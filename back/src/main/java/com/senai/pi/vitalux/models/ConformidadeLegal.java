package com.senai.pi.vitalux.models;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name="conformidade_legal")
public class ConformidadeLegal {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    
    @Column(name="id")
    private Integer id;

    @Column(name="observacao")
    private String observacao;

    @Column(name="segue_normas")
    private boolean segueNormas;

    @Column(name="data_verificacao")
    private LocalDate dataVerificacao;

    @OneToOne
    @JoinColumn(name = "id_clinica")
    private Clinica clinica;
}