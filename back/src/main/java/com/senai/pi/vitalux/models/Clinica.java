<<<<<<< HEAD
package com.senai.pi.vitalux.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;



@Entity
@Table(name = "clinica")
public class Clinica {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id

    @Column(name = "id")
    private Integer id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "cnpj")
    private String cnpj;

    @Column(name = "endereco")
    private String endereco;

    @Column(name = "telefone")
    private String telefone;

    @Column(name = "email")
    private String email;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_listagem")
    private ListagemMedica listagemMedica;

    @JsonIgnore
    @OneToMany(mappedBy = "clinica")
    private List<Consulta> consultas;

    @JsonIgnore
    @OneToOne(mappedBy = "clinica", cascade = CascadeType.ALL)
    private ConformidadeLegal conformidadeLegal;


        public Clinica() {
        }


        public Clinica(Integer id, String nome, String cnpj, String endereco, String telefone, String email,
                ListagemMedica listagemMedica, List<Consulta> consultas, ConformidadeLegal conformidadeLegal) {
            this.id = id;
            this.nome = nome;
            this.cnpj = cnpj;
            this.endereco = endereco;
            this.telefone = telefone;
            this.email = email;
            this.listagemMedica = listagemMedica;
            this.consultas = consultas;
            this.conformidadeLegal = conformidadeLegal;
        }


        public Integer getId() {
            return id;
        }


        public void setId(Integer id) {
            this.id = id;
        }


        public String getNome() {
            return nome;
        }


        public void setNome(String nome) {
            this.nome = nome;
        }


        public String getCnpj() {
            return cnpj;
        }


        public void setCnpj(String cnpj) {
            this.cnpj = cnpj;
        }


        public String getEndereco() {
            return endereco;
        }


        public void setEndereco(String endereco) {
            this.endereco = endereco;
        }


        public String getTelefone() {
            return telefone;
        }


        public void setTelefone(String telefone) {
            this.telefone = telefone;
        }


        public String getEmail() {
            return email;
        }


        public void setEmail(String email) {
            this.email = email;
        }


        public ListagemMedica getListagemMedica() {
            return listagemMedica;
        }


        public void setListagemMedica(ListagemMedica listagemMedica) {
            this.listagemMedica = listagemMedica;
        }


        public List<Consulta> getConsultas() {
            return consultas;
        }


        public void setConsultas(List<Consulta> consultas) {
            this.consultas = consultas;
        }


        public ConformidadeLegal getConformidadeLegal() {
            return conformidadeLegal;
        }


        public void setConformidadeLegal(ConformidadeLegal conformidadeLegal) {
            this.conformidadeLegal = conformidadeLegal;
        }

        
=======
package com.senai.pi.vitalux.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;



@Entity
@Table(name = "clinica")
public class Clinica {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id

    @Column(name = "id")
    private Integer id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "cnpj")
    private String cnpj;

    @Column(name = "endereco")
    private String endereco;

    @Column(name = "telefone")
    private String telefone;

    @Column(name = "email")
    private String email;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_listagem")
    private ListagemMedica listagemMedica;

    @JsonIgnore
    @OneToMany(mappedBy = "clinica")
    private List<Consulta> consultas;

    @JsonIgnore
    @OneToOne(mappedBy = "clinica", cascade = CascadeType.ALL)
    private ConformidadeLegal conformidadeLegal;


        public Clinica() {
        }


        public Clinica(Integer id, String nome, String cnpj, String endereco, String telefone, String email,
                ListagemMedica listagemMedica, List<Consulta> consultas, ConformidadeLegal conformidadeLegal) {
            this.id = id;
            this.nome = nome;
            this.cnpj = cnpj;
            this.endereco = endereco;
            this.telefone = telefone;
            this.email = email;
            this.listagemMedica = listagemMedica;
            this.consultas = consultas;
            this.conformidadeLegal = conformidadeLegal;
        }


        public Integer getId() {
            return id;
        }


        public void setId(Integer id) {
            this.id = id;
        }


        public String getNome() {
            return nome;
        }


        public void setNome(String nome) {
            this.nome = nome;
        }


        public String getCnpj() {
            return cnpj;
        }


        public void setCnpj(String cnpj) {
            this.cnpj = cnpj;
        }


        public String getEndereco() {
            return endereco;
        }


        public void setEndereco(String endereco) {
            this.endereco = endereco;
        }


        public String getTelefone() {
            return telefone;
        }


        public void setTelefone(String telefone) {
            this.telefone = telefone;
        }


        public String getEmail() {
            return email;
        }


        public void setEmail(String email) {
            this.email = email;
        }


        public ListagemMedica getListagemMedica() {
            return listagemMedica;
        }


        public void setListagemMedica(ListagemMedica listagemMedica) {
            this.listagemMedica = listagemMedica;
        }


        public List<Consulta> getConsultas() {
            return consultas;
        }


        public void setConsultas(List<Consulta> consultas) {
            this.consultas = consultas;
        }


        public ConformidadeLegal getConformidadeLegal() {
            return conformidadeLegal;
        }


        public void setConformidadeLegal(ConformidadeLegal conformidadeLegal) {
            this.conformidadeLegal = conformidadeLegal;
        }

        
>>>>>>> dee608f957cafa43114f1bee8bb15974a60c7b1a
}