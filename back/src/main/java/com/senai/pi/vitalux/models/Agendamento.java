package com.senai.pi.vitalux.models;

import java.time.LocalDateTime;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "agendamento")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "id")
    private Integer id;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "dataHora")
    private LocalDateTime dataHora;
    
    @OneToOne
    @JoinColumn(name = "cliente_id")
    private Cliente clienteId;

    public Agendamento() {
    }


    public Agendamento(Integer id, String descricao, LocalDateTime dataHora, Cliente clienteId) {
        this.id = id;
        this.descricao = descricao;
        this.dataHora = dataHora;
        this.clienteId = clienteId;
    }

    public Agendamento(String descricao, LocalDateTime dataHora, Cliente clienteId) {
        this.descricao = descricao;
        this.dataHora = dataHora;
        this.clienteId = clienteId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public Cliente getClienteId() {
        return clienteId;
    }

    public void setClienteId(Cliente clienteId) {
        this.clienteId = clienteId;
    }

    
}