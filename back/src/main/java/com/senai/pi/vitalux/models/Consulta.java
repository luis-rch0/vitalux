package com.senai.pi.vitalux.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="consulta")
public class Consulta {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    
    @Column(name="id")
    private Integer id;
}