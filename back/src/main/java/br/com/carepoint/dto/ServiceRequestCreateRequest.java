package br.com.carepoint.dto;

import jakarta.validation.constraints.*;

import java.time.Instant;

public record ServiceRequestCreateRequest(
        @NotNull(message = "Profissional é obrigatório") Long profissionalId,
        Long clinicaId,
        @NotBlank(message = "Serviço solicitado é obrigatório") @Size(max = 200) String servicoSolicitado,
        @NotBlank(message = "Informe as necessidades de cuidado") @Size(max = 4000) String necessidadesInformadas,
        @NotNull(message = "Data desejada é obrigatória") @Future(message = "A data desejada deve estar no futuro") Instant dataDesejada,
        @NotBlank(message = "Endereço de atendimento é obrigatório") @Size(max = 255) String enderecoAtendimento
) { }
