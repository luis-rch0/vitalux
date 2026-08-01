package br.com.carepoint.dto;

import java.util.List;

public record PatientDashboardResponse(
        PatientResponse paciente, List<ProfessionalResponse> profissionaisRecomendados,
        List<ClinicResponse> clinicasDisponiveis, List<ServiceRequestResponse> solicitacoesRecentes,
        long solicitacoesPendentes
) { }
