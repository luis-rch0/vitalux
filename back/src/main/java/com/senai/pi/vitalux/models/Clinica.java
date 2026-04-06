package com.senai.pi.vitalux.models;
import java.util.List;
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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="clinica")
public class Clinica {

    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Id
    
    @Column(name="id")
    private Integer id;

    @Column(name="nome")
    private String nome;

    @Column(name="cnpj")
    private String cnpj;

    @Column(name="endereco")
    private String endereco;

    @Column(name="telefone")
    private String telefone;

    @Column(name="email")
    private String email;

    @ManyToOne
    @JoinColumn(name = "id_listagem")
    private ListagemMedica listagemMedica;

    @OneToMany(mappedBy = "clinica")
    private List<Consulta> consultas;

    @OneToOne(mappedBy = "clinica", cascade = CascadeType.ALL)
    private ConformidadeLegal conformidadeLegal;

}