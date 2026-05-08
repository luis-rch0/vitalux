package com.senai.pi.vitalux.dtos;

import java.time.LocalDateTime;

public class AgendamentoRequestDTO {
    
    private String descricao;
    private LocalDateTime dataHora;
    private Integer clienteId;

    public AgendamentoRequestDTO() {
    }

    public AgendamentoRequestDTO(String descricao, LocalDateTime dataHora, Integer clienteId) {
        this.descricao = descricao;
        this.dataHora = dataHora;
        this.clienteId = clienteId;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public Integer getClienteId() {
        return clienteId;
    }

    public void setClienteId(Integer clienteId) {
        this.clienteId = clienteId;
    }
}
