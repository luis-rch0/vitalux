package br.com.carepoint.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record RegisterPatientRequest(
        @NotBlank(message = "Nome é obrigatório") @Size(max = 160) String nome,
        @NotBlank(message = "CPF é obrigatório") @Pattern(regexp = "[0-9.\\- ]{11,18}", message = "CPF inválido") String cpf,
        @NotNull(message = "Data de nascimento é obrigatória") @Past(message = "Data de nascimento deve estar no passado") LocalDate dataNascimento,
        @NotBlank(message = "Telefone é obrigatório") @Pattern(regexp = "[0-9()+\\- ]{10,20}", message = "Telefone inválido") String telefone,
        @Email(message = "E-mail inválido") @NotBlank(message = "E-mail é obrigatório") @Size(max = 180) String email,
        @NotBlank(message = "Senha é obrigatória") @Size(min = 8, max = 72, message = "Senha deve ter entre 8 e 72 caracteres") String senha,
        @NotBlank(message = "Endereço é obrigatório") @Size(max = 255) String endereco,
        @Size(max = 4000) String necessidadesCuidado,
        @Size(max = 160) String familiarResponsavel
) { }
