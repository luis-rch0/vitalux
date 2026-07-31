package br.com.carepoint.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record ClinicResponse(
        Long id, String nome, String cnpj, String descricao, String endereco, String telefone, String email,
        String imagemUrl, BigDecimal latitude, BigDecimal longitude, boolean ativo, long totalProfissionais,
        Instant createdAt, Instant updatedAt
) { }
