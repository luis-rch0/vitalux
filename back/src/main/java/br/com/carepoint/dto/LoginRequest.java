package br.com.carepoint.dto;

import br.com.carepoint.entity.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @Email(message = "E-mail inválido") @NotBlank(message = "E-mail é obrigatório") String email,
        @NotBlank(message = "Senha é obrigatória") @Size(min = 8, message = "Senha deve ter ao menos 8 caracteres") String senha,
        @Schema(description = "Preferência de tela escolhida; a autorização real vem da role autenticada.") Role perfilSelecionado
) { }
