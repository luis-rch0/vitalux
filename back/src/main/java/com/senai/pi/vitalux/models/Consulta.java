package com.senai.pi.vitalux.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="consulta")
public class Consulta {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    
    @Column(name="id")
    private Integer id;

    @Column(name="descricao")
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "id_clinica")
    private Clinica clinica;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_agendamento")
    private Agendamento agendamento;
}