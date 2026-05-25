package com.senai.pi.vitalux.dtos;

import lombok.Data;
import java.util.Map;

@Data
public class ChatRequestDTO {

    private String sessionId;
    private String message;
    private String currentScreen;
    private Map<String, Object> metadata;
}
