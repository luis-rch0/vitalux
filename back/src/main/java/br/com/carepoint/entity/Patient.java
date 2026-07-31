package br.com.carepoint.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "cp_patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private AppUser user;

    @Column(name = "nome", nullable = false, length = 160)
    private String nome;

    @Column(name = "cpf", nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(name = "data_nascimento", nullable = false)
    private LocalDate dataNascimento;

    @Column(name = "telefone", nullable = false, length = 15)
    private String telefone;

    @Column(name = "endereco", nullable = false)
    private String endereco;

    @Column(name = "necessidades_cuidado", columnDefinition = "TEXT")
    private String necessidadesCuidado;

    @Column(name = "familiar_responsavel", length = 160)
    private String familiarResponsavel;

    @Column(name = "ativo", nullable = false)
    @Builder.Default
    private boolean ativo = true;
}
