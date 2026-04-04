package com.senai.pi.vitalux.models;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Data
@Entity
@Table(name="agendamento")
public class Agendamento {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    
    @Column(name="id")
    private Integer id;

    @Column(name="descricao")
    private String descricao;

    @Column(name="dataHora")
    private LocalDateTime dataHora;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}