package br.com.carepoint.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "cp_professionals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Professional extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false, length = 160)
    private String nome;

    @Column(name = "cpf", nullable = false, unique = true, length = 11)
    private String cpf;

    @Enumerated(EnumType.STRING)
    @Column(name = "profissao", nullable = false, length = 40)
    private Profissao profissao;

    @Column(name = "especialidade", nullable = false, length = 160)
    private String especialidade;

    @Column(name = "numero_registro_profissional", unique = true, length = 80)
    private String numeroRegistroProfissional;

    @Column(name = "foto_url", length = 500)
    private String fotoUrl;

    @Column(name = "valor_atendimento", nullable = false, precision = 12, scale = 2)
    private BigDecimal valorAtendimento;

    @Column(name = "telefone", nullable = false, length = 15)
    private String telefone;

    @Column(name = "email", nullable = false, length = 180)
    private String email;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "ativo", nullable = false)
    @Builder.Default
    private boolean ativo = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clinica_id")
    private Clinic clinica;
}
