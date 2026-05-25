package com.senai.pi.vitalux.controllers;

import com.senai.pi.vitalux.dtos.ChatRequestDTO;
import com.senai.pi.vitalux.dtos.ChatResponseDTO;
import com.senai.pi.vitalux.services.AIOrchestratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIChatController {

    private final AIOrchestratorService orchestrator;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponseDTO> chat(
            @RequestBody ChatRequestDTO request,
            Authentication auth
    ) {
        return ResponseEntity.ok(
                orchestrator.process(request, auth)
        );
    }
}
