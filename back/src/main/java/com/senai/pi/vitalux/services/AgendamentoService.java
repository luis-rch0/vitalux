package com.senai.pi.vitalux.services;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.senai.pi.vitalux.dtos.AgendamentoRequestDTO;
import com.senai.pi.vitalux.models.Agendamento;
import com.senai.pi.vitalux.repositories.AgendamentoRepository;



@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository as;

    @Autowired
    private ClienteService cs;

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public AgendamentoService(AgendamentoRepository agendamentoRepository) {
		this.objectMapper = new ObjectMapper()
			.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		this.httpClient = HttpClient.newBuilder()
			.connectTimeout(Duration.ofSeconds(20))
			.build();
		this.as = agendamentoRepository;
	}

    public List<Agendamento> listarTodos() {
        return as.findAllByOrderByDataHoraDesc();
    }


    public Agendamento buscarPorId(Integer id) {
        return as.findById(id).orElse(null);
    }


    public List<Agendamento> buscarPorClienteId(Integer clienteId) {
        return as.findByClienteId(clienteId);
    }


    public Agendamento criar(AgendamentoRequestDTO agendamento) {
        Agendamento novoAgendamento = new Agendamento(agendamento.getDescricao(), agendamento.getDataHora(), cs.buscarPorId(agendamento.getClienteId()));
        as.save(novoAgendamento);
        return novoAgendamento;
    }


    public Agendamento atualizar(Integer id, Agendamento agendamento) {
        if (as.existsById(id)) {
            agendamento.setId(id);
            return as.save(agendamento);
        }
        return null;
    }


    public List<Agendamento> deletar(Integer id) {
        if (as.existsById(id)) {
            as.deleteById(id);
            return listarTodos();
        }
        return null;
    }


    public Optional<Agendamento> existe(Integer id) {
        if (as.existsById(id)) {
            return as.findById(id);
        }
        return Optional.empty();
    }





    @Value("${groq.api-key}")
    private String apiKey;

    @Value("${groq.model}")
    private String model;


private JsonNode callGroq(JsonNode body) {
        try {
            String systemPrompt = buildSystemPrompt();
            double temperature = 0.6;
            body = buildGroqBody(systemPrompt, temperature);
            
            
            ObjectMapper objectMapper = new ObjectMapper();

            byte[] payload = objectMapper.writeValueAsBytes(body);

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.groq.com/openai/v1/chat/completions"))
                .timeout(Duration.ofSeconds(60))
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .POST(HttpRequest.BodyPublishers.ofByteArray(payload))
                .build();
            
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            
            if (response.statusCode() / 100 != 2) {
                
                
                
                if (response.statusCode() == 400 && response.body() != null && response.body().toLowerCase().contains("model")) {
                    String[] fallbacks = new String[] {
                        "llama-3.3-70b-versatile",
                        "llama3-70b-8192",
                        "llama-3.1-8b-instant",
                        "mixtral-8x7b-32768",
                        "gemma-7b-it"
                    };
                    for (String candidate : fallbacks) {
                        try {
                            // altera o campo model no mesmo body
                            if (body instanceof ObjectNode on) {
                                on.put("model", candidate);
                            }
                            
                            byte[] retryPayload = objectMapper.writeValueAsBytes(body);

                            HttpRequest retryReq = HttpRequest.newBuilder()
                                .uri(URI.create("https://api.groq.com/openai/v1/chat/completions"))
                                .timeout(Duration.ofSeconds(60))
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                                .POST(HttpRequest.BodyPublishers.ofByteArray(retryPayload))
                                .build();
                                
                                HttpResponse<String> retryResp = httpClient.send(retryReq, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
                                if (retryResp.statusCode() / 100 == 2) {
                                    // atualiza o modelo efetivo em memória
                                    this.model = candidate;
                                    return objectMapper.readTree(retryResp.body());
                                }

                            } catch (Exception ignore) {
                                // tenta próximo
                            }
                        }
                    }
                    throw new IllegalStateException("Erro Groq: HTTP " + response.statusCode() + " - " + response.body());
                }
                return objectMapper.readTree(response.body());
            } catch (InterruptedException ex) {
                Thread.currentThread().interrupt();
                throw new IllegalStateException("Chamada interrompida", ex);
            } catch (IOException ex) {
                throw new IllegalStateException("Falha ao chamar Groq", ex);
            }
            
}

    	private String buildSystemPrompt() {
		return """
		Você é um gerador de itens avaliativos. Gere itens de múltipla escolha em português seguindo a Taxonomia Revisada de Bloom e a TRI (Teoria de Resposta ao Item).
		
		Regras de construção:
		- Produza um enunciado claro e contextualizado.
		- Gere alternativas A, B, C, D (ou mais se solicitado), apenas uma correta.
		- Distratores devem ser plausíveis e alinhados ao nível cognitivo.
		- Traga uma justificativa breve para a alternativa correta.
		- Cada item segue a matriz dissertação: processo cognitivo × dimensão do conhecimento define verbo indicativo e metas de a (discriminação), b (dificuldade) e c (acerto casual baixo).
		  Hierarquia cognitiva mais alta e dimensões mais exigentes (até metacognitivo) implicam maior a e maior b, em linha com a figura de referência.
		- Respeite o Processo Cognitivo (Lembrar, Entender, Aplicar, Analisar, Sintetizar, Criar) e a Dimensão do Conhecimento (Factual, Conceitual, Procedimental, Metacognitivo).
		- Parâmetros TRI 3PL: a, b e c informados por questão devem ser coerentes com a célula Bloom×dimensão; c permanece baixo (distratores plausíveis).
		- Distribua os rótulos corretos entre as questões (A, B, C, D ...). Nunca use a mesma letra como correta em 3 ou mais questões no mesmo lote; prefira distribuição equilibrada.
		
		Saída deve ser APENAS JSON válido, conforme o schema especificado na instrução do usuário.
		""";
	}

    private JsonNode buildGroqBody(String systemPrompt, double temperature) {
		ObjectNode body = objectMapper.createObjectNode();
		body.put("model", model);
		ArrayNode messages = body.putArray("messages");

		ObjectNode sys = messages.addObject();
		sys.put("role", "system");
		sys.put("content", systemPrompt);

		ObjectNode user = messages.addObject();
		user.put("role", "user");
        user.put("content", "Sua mensagem aqui");

		body.put("temperature", temperature);
		body.put("max_tokens", 1200);
		ObjectNode respFmt = body.putObject("response_format");
		respFmt.put("type", "json_object");
		return body;
	}

}
