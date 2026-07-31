package br.com.carepoint.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StatusNoteRequest(@NotBlank(message = "A justificativa é obrigatória") @Size(max = 2000) String observacao) { }
