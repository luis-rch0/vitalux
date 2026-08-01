package br.com.carepoint.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PatientUpdateRequest(
        @NotBlank(message = "Nome é obrigatório") @Size(max = 160) String nome,
        @Email(message = "E-mail inválido") @NotBlank(message = "E-mail é obrigatório") @Size(max = 180) String email,
        @NotBlank(message = "Telefone é obrigatório") String telefone,
        @NotBlank(message = "Endereço é obrigatório") @Size(max = 255) String endereco,
        @Size(max = 4000) String necessidadesCuidado,
        @Size(max = 160) String familiarResponsavel,
        @Size(min = 8, max = 72, message = "Nova senha deve ter entre 8 e 72 caracteres") String novaSenha
) { }
