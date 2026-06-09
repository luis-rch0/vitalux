package com.senai.pi.vitalux.services;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.senai.pi.vitalux.dtos.ChatRequestDTO;
import com.senai.pi.vitalux.dtos.ChatResponseDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AIOrchestratorService {

    private final GroqService groqService;

    /**
     * Processa uma pergunta/dúvida do usuário através da IA.
     * A IA atua como assistente virtual de Q&A, respondendo perguntas sobre o fluxo
     * da aplicação.
     * 
     * @param request Requisição com a mensagem do usuário
     * @param auth    Autenticação do usuário (não utilizada atualmente, mas mantida
     *                para referência)
     * @return Resposta da IA com esclarecimento sobre o fluxo da aplicação
     */
    public ChatResponseDTO process(
            ChatRequestDTO request,
            Authentication auth) {
        // Gera resposta via IA baseada no contexto do fluxo da aplicação
        String response = groqService.generate(request);

        // Retorna resposta ao cliente
        return ChatResponseDTO.builder()
                .response(response)
                .build();
    }
}