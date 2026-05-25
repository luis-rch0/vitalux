package com.senai.pi.vitalux.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatResponseDTO {

    private String response;
    private Boolean actionExecuted;
    private String actionType;
    private Object data;
}
