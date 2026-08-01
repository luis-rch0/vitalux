package br.com.carepoint.dto;

import java.time.Instant;
import java.time.LocalDate;

public record PatientResponse(
        Long id, String nome, String cpf, LocalDate dataNascimento, String telefone, String email,
        String endereco, String necessidadesCuidado, String familiarResponsavel, boolean ativo,
        Instant createdAt, Instant updatedAt
) { }
