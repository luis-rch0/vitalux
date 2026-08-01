package br.com.carepoint.dto;

import br.com.carepoint.entity.Profissao;

import java.math.BigDecimal;
import java.time.Instant;

public record ProfessionalResponse(
        Long id, String nome, Profissao profissao, String especialidade, String numeroRegistroProfissional,
        String fotoUrl, BigDecimal valorAtendimento, String telefone, String email, String descricao,
        boolean ativo, ClinicShortResponse clinica, double mediaAvaliacoes, long quantidadeAvaliacoes,
        Instant createdAt, Instant updatedAt
) { }
