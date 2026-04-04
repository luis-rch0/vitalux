package com.senai.pi.vitalux.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    
    @Column(name="id")
    private Integer id;

    @Column(name="email")
    private String email;

    @Column(name="nome_completo")
    private String nome_completo;

    @Column(name="plano")
    private String plano;

    @Column(name="data_nascimento")
    private String data_nascimento;

    @Column(name="endereco")
    private String endereco;

}
    