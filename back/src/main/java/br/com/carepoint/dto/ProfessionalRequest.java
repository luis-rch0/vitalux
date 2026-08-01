package br.com.carepoint.dto;

import br.com.carepoint.entity.Profissao;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ProfessionalRequest(
        @NotBlank(message = "Nome é obrigatório") @Size(max = 160) String nome,
        @NotBlank(message = "CPF é obrigatório") @Pattern(regexp = "[0-9.\\- ]{11,18}", message = "CPF inválido") String cpf,
        @NotNull(message = "Profissão é obrigatória") Profissao profissao,
        @NotBlank(message = "Especialidade é obrigatória") @Size(max = 160) String especialidade,
        @Size(max = 80) String numeroRegistroProfissional,
        @Size(max = 500) String fotoUrl,
        @NotNull(message = "Valor é obrigatório") @DecimalMin(value = "0.0", message = "Valor inválido") BigDecimal valorAtendimento,
        @NotBlank(message = "Telefone é obrigatório") String telefone,
        @Email(message = "E-mail inválido") @NotBlank(message = "E-mail é obrigatório") String email,
        @Size(max = 4000) String descricao,
        Long clinicaId,
        Boolean ativo
) { }
