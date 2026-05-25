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

        Map<String, Object> body = Map.of(
                "model", "llama-3.3-70b-versatile",
                "messages", List.of(
                        Map.of("role", "system",
                                "content", "Você é a Vitalux AI"),
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
