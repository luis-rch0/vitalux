package br.com.carepoint.dto;

import java.time.Instant;

public record ClinicResponse(
        Long id, String nome, String cnpj, String descricao, String endereco, String telefone, String email,
        String imagemUrl, boolean ativo, long totalProfissionais,
        Instant createdAt, Instant updatedAt
) { }
