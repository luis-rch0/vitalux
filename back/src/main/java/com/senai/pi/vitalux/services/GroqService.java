package com.senai.pi.vitalux.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import lombok.RequiredArgsConstructor;
import com.senai.pi.vitalux.dtos.ChatRequestDTO;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GroqService {

    private final WebClient webClient;

    @Value("${GROQ_API_KEY}")
    private String apiKey;

    public String generate(ChatRequestDTO request) {

        // ...existing code...
        String systemContent = "Você é a Vitalux AI.\n" +
                "Função: atuar como assistente virtual no fluxo da aplicação. Sempre que responder, retorne um objeto JSON com dois campos principais:\n" +
                "  - response: string com a mensagem a ser exibida ao usuário (resposta legível e sucinta).\n" +
                "  - metadata: (opcional) objeto que indica ações que o orquestrador pode executar. Se não houver ação, omita metadata ou deixe null.\n" +
                "Formato de metadata para ações:\n" +
                "  { \"actionType\": \"create_agendamento\", \"agendamento\": { /* campos do agendamento */ } }\n" +
                "Regras importantes:\n" +
                "  - Nunca tente executar ações diretamente. Apenas sugira ações via metadata.\n" +
                "  - Se sugerir um agendamento, preencha `metadata.actionType` com \"create_agendamento\" e forneça `metadata.agendamento` com os campos necessários.\n" +
                "  - Seja conciso no campo response e valide que o JSON gerado seja bem formado.\n" +
                "Exemplo de saída válida (JSON):\n" +
                "{ \"response\": \"Agendamento criado com sucesso.\", \"metadata\": { \"actionType\": \"create_agendamento\", \"agendamento\": { \"data\": \"2026-06-01\", \"horario\": \"15:00\" } } }";

        Map<String, Object> body = Map.of(
                "model", "llama-3.3-70b-versatile",
                "messages", List.of(
                        Map.of("role", "system",
                                "content", systemContent),
                        Map.of("role", "user",
                                "content", request.getMessage())
                )
        );

        return webClient.post()
                .uri("https://api.groq.com/openai/v1/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}