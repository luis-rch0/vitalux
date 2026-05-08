package com.senai.pi.vitalux.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.senai.pi.vitalux.dtos.AgendamentoRequestDTO;
import com.senai.pi.vitalux.models.Agendamento;
import com.senai.pi.vitalux.repositories.AgendamentoRepository;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Optional;
import com.senai.pi.vitalux.services.ClienteService;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;


@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository as;

    @Autowired
    private ClienteService cs;


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
            byte[] payload = ObjectMapper.writeValueAsBytes(body);
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.groq.com/openai/v1/chat/completions&quot;"))
                .timeout(Duration.ofSeconds(60))
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .POST(HttpRequest.BodyPublishers.ofByteArray(payload))
                .build();

            HttpResponse<String> response = HttpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (response.statusCode() / 100 != 2) {
                // Tenta fallback de modelo se o atual estiver descontinuado/indisponível
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
                            byte[] retryPayload = ObjectMapper.writeValueAsBytes(body);
                            HttpRequest retryReq = HttpRequest.newBuilder()
                                .uri(URI.create("https://api.groq.com/openai/v1/chat/completions&quot;"))
                                .timeout(Duration.ofSeconds(60))
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                                .POST(HttpRequest.BodyPublishers.ofByteArray(retryPayload))
                                .build();
                            HttpResponse<String> retryResp = HttpClient.send(retryReq, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
                            if (retryResp.statusCode() / 100 == 2) {
                                // atualiza o modelo efetivo em memória
                                this.model = candidate;
                                return ObjectMapper.readTree(retryResp.body());
                            }
                        } catch (Exception ignore) {
                            // tenta próximo
                        }
                    }
                }
                throw new IllegalStateException("Erro Groq: HTTP " + response.statusCode() + " - " + response.body());
            }
            return ObjectMapper.readTree(response.body());
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Chamada interrompida", ex);
        } catch (IOException ex) {
            throw new IllegalStateException("Falha ao chamar Groq", ex);
        }
    }


    
}
