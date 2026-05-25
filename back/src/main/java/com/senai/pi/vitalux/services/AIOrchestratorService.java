package com.senai.pi.vitalux.services;

import com.senai.pi.vitalux.dtos.ChatRequestDTO;
import com.senai.pi.vitalux.dtos.ChatResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AIOrchestratorService {

    private final GroqService groqService;

    public ChatResponseDTO process(
            ChatRequestDTO request,
            Authentication auth
    ) {

        String response = groqService.generate(request);

        return ChatResponseDTO.builder()
                .response(response)
                .actionExecuted(false)
                .build();
    }
}


