package com.senai.pi.vitalux.services;

import com.senai.pi.vitalux.dtos.ChatRequestDTO;
import com.senai.pi.vitalux.dtos.ChatResponseDTO;
import com.senai.pi.vitalux.dtos.AgendamentoRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIOrchestratorService {

    private final GroqService groqService;
    private final AgendamentoService agendamentoService;
    private final ObjectMapper objectMapper;

    public ChatResponseDTO process(
            ChatRequestDTO request,
            Authentication auth
    ) {

        // 1) resposta livre do Groq (texto que será retornado ao cliente)
        String response = groqService.generate(request);

        // 2) verifica metadata para ações (ex: create_agendamento)
        Map<String, Object> metadata = request.getMetadata();
        if (metadata != null) {
            Object actionType = metadata.get("actionType");
            if ("create_agendamento".equals(actionType)) {
                Object agendamentoPayload = metadata.get("agendamento");
                try {
                    // converte payload genérico para o DTO existente
                    AgendamentoRequestDTO dto = objectMapper.convertValue(agendamentoPayload, AgendamentoRequestDTO.class);

                    // opcional: associar ao usuário autenticado (se necessário)
                    // Ex: if (auth != null) { set clienteId a partir do auth quando apropriado }

                    // chama serviço que executa o "post" / cria o agendamento
                    AgendamentoRequestDTO created = agendamentoService.create(dto);

                    return ChatResponseDTO.builder()
                            .response(response)
                            .actionExecuted(true)
                            .actionType("create_agendamento")
                            .data(created)
                            .build();
                } catch (Exception e) {
                    return ChatResponseDTO.builder()
                            .response("Falha ao criar agendamento: " + e.getMessage())
                            .actionExecuted(false)
                            .actionType("create_agendamento")
                            .build();
                }
            }
        }

        // padrão: apenas retorno do modelo sem executar ação
        return ChatResponseDTO.builder()
                .response(response)
                .actionExecuted(false)
                .build();
    }
}