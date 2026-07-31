package br.com.carepoint.dto;

import java.util.List;

public record DashboardResponse(
        long totalPacientes, long totalProfissionais, long totalClinicas, long totalSolicitacoes,
        long solicitacoesPendentes, long solicitacoesConfirmadas, long solicitacoesConcluidas,
        long solicitacoesRejeitadas, long solicitacoesCanceladas,
        long agendamentosRealizados, long consultasRealizadas,
        long novosPacientesNoMes, long novosProfissionaisNoMes, long novasClinicasNoMes,
        List<MonthlyMetricsResponse> cadastrosPorMes,
        List<ServiceRequestResponse> solicitacoesRecentes
) { }
