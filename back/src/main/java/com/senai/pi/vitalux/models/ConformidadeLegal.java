package com.senai.pi.vitalux.models;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity

@Table(name = "conformidade_legal")
public class ConformidadeLegal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "id")
    private Integer id;

    @Column(name = "observacao")
    private String observacao;

    @Column(name = "segue_normas")
    private boolean segueNormas;

    @Column(name = "data_verificacao")
    private LocalDate dataVerificacao;
    
    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "id_clinica")
    private Clinica clinica;

    public ConformidadeLegal() {
    }
    public ConformidadeLegal(Integer id, String observacao, boolean segueNormas, LocalDate dataVerificacao,
            Clinica clinica) {
        this.id = id;
        this.observacao = observacao;
        this.segueNormas = segueNormas;
        this.dataVerificacao = dataVerificacao;
        this.clinica = clinica;
    }
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getObservacao() {
        return observacao;
    }
    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
    public boolean isSegueNormas() {
        return segueNormas;
    }
    public void setSegueNormas(boolean segueNormas) {
        this.segueNormas = segueNormas;
    }
    public LocalDate getDataVerificacao() {
        return dataVerificacao;
    }
    public void setDataVerificacao(LocalDate dataVerificacao) {
        this.dataVerificacao = dataVerificacao;
    }
    public Clinica getClinica() {
        return clinica;
    }
    public void setClinica(Clinica clinica) {
        this.clinica = clinica;
    }

    
    
}