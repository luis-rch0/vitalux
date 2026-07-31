package br.com.carepoint.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "cp_service_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRequest extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Patient paciente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profissional_id", nullable = false)
    private Professional profissional;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clinica_id")
    private Clinic clinica;

    @Column(name = "servico_solicitado", nullable = false, length = 200)
    private String servicoSolicitado;

    @Column(name = "necessidades_informadas", nullable = false, columnDefinition = "TEXT")
    private String necessidadesInformadas;

    @Column(name = "data_desejada", nullable = false)
    private Instant dataDesejada;

    @Column(name = "endereco_atendimento", nullable = false)
    private String enderecoAtendimento;

    @Column(name = "valor", nullable = false, precision = 12, scale = 2)
    private BigDecimal valor;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private RequestStatus status;

    @Column(name = "observacao_administrador", columnDefinition = "TEXT")
    private String observacaoAdministrador;

    @Column(name = "confirmed_at")
    private Instant confirmedAt;

    @Column(name = "rejected_at")
    private Instant rejectedAt;

    @Column(name = "cancelled_at")
    private Instant cancelledAt;

    @Column(name = "completed_at")
    private Instant completedAt;
}
