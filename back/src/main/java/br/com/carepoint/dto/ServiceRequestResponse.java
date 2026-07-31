package br.com.carepoint.dto;

import br.com.carepoint.entity.RequestStatus;

import java.math.BigDecimal;
import java.time.Instant;

public record ServiceRequestResponse(
        Long id, Long pacienteId, String pacienteNome, ProfessionalResponse profissional, ClinicShortResponse clinica,
        String servicoSolicitado, String necessidadesInformadas, Instant dataDesejada, String enderecoAtendimento,
        BigDecimal valor, RequestStatus status, String observacaoAdministrador, Instant createdAt, Instant updatedAt,
        Instant confirmedAt, Instant rejectedAt, Instant cancelledAt, Instant completedAt, boolean podeAvaliar
) { }
