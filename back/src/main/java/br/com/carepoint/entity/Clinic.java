package br.com.carepoint.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cp_clinics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Clinic extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false, length = 160)
    private String nome;

    @Column(name = "cnpj", nullable = false, unique = true, length = 14)
    private String cnpj;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "endereco", nullable = false)
    private String endereco;

    @Column(name = "telefone", nullable = false, length = 15)
    private String telefone;

    @Column(name = "email", nullable = false, length = 180)
    private String email;

    @Column(name = "imagem_url", length = 500)
    private String imagemUrl;

    @Column(name = "ativo", nullable = false)
    @Builder.Default
    private boolean ativo = true;
}
