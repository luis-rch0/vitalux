package br.com.carepoint.dto;

public record MonthlyMetricsResponse(
        String mes,
        long pacientes,
        long profissionais,
        long clinicas,
        long solicitacoes
) { }
