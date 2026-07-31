package br.com.carepoint.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ClinicRequest(
        @NotBlank(message = "Nome é obrigatório") @Size(max = 160) String nome,
        @NotBlank(message = "CNPJ é obrigatório") @Pattern(regexp = "[0-9.\\-/ ]{14,22}", message = "CNPJ inválido") String cnpj,
        @Size(max = 4000) String descricao,
        @NotBlank(message = "Endereço é obrigatório") @Size(max = 255) String endereco,
        @NotBlank(message = "Telefone é obrigatório") String telefone,
        @Email(message = "E-mail inválido") @NotBlank(message = "E-mail é obrigatório") String email,
        @Size(max = 500) String imagemUrl,
        @DecimalMin(value = "-90.0", message = "Latitude inválida") @DecimalMax(value = "90.0", message = "Latitude inválida") BigDecimal latitude,
        @DecimalMin(value = "-180.0", message = "Longitude inválida") @DecimalMax(value = "180.0", message = "Longitude inválida") BigDecimal longitude,
        Boolean ativo
) { }
