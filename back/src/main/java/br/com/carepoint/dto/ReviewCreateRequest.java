package br.com.carepoint.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReviewCreateRequest(
        @NotNull(message = "A nota é obrigatória") @Min(value = 1, message = "Nota mínima é 1") @Max(value = 5, message = "Nota máxima é 5") Short nota,
        @Size(max = 2000) String comentario
) { }
