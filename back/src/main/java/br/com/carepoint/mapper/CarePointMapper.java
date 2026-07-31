package br.com.carepoint.mapper;

import br.com.carepoint.dto.*;
import br.com.carepoint.entity.*;
import org.springframework.stereotype.Component;

@Component
public class CarePointMapper {

    public AuthUserResponse toAuthUser(AppUser user, Patient patient) {
        return new AuthUserResponse(user.getId(), user.getNome(), user.getEmail(), user.getRole(), patient == null ? null : patient.getId());
    }

    public PatientResponse toPatient(Patient patient) {
        return new PatientResponse(patient.getId(), patient.getNome(), patient.getCpf(), patient.getDataNascimento(),
                patient.getTelefone(), patient.getUser().getEmail(), patient.getEndereco(), patient.getNecessidadesCuidado(),
                patient.getFamiliarResponsavel(), patient.isAtivo(), patient.getCreatedAt(), patient.getUpdatedAt());
    }

    public ClinicShortResponse toClinicShort(Clinic clinic) {
        return clinic == null ? null : new ClinicShortResponse(clinic.getId(), clinic.getNome(), clinic.getEndereco(), clinic.getImagemUrl());
    }

    public ClinicResponse toClinic(Clinic clinic, long totalProfessionals) {
        return new ClinicResponse(clinic.getId(), clinic.getNome(), clinic.getCnpj(), clinic.getDescricao(), clinic.getEndereco(),
                clinic.getTelefone(), clinic.getEmail(), clinic.getImagemUrl(), clinic.getLatitude(), clinic.getLongitude(), clinic.isAtivo(),
                totalProfessionals, clinic.getCreatedAt(), clinic.getUpdatedAt());
    }

    public ProfessionalResponse toProfessional(Professional professional, double average, long totalReviews) {
        return new ProfessionalResponse(professional.getId(), professional.getNome(), professional.getProfissao(),
                professional.getEspecialidade(), professional.getNumeroRegistroProfissional(), professional.getFotoUrl(),
                professional.getValorAtendimento(), professional.getTelefone(), professional.getEmail(), professional.getDescricao(),
                professional.isAtivo(), toClinicShort(professional.getClinica()), average, totalReviews,
                professional.getCreatedAt(), professional.getUpdatedAt());
    }

    public ServiceRequestResponse toServiceRequest(ServiceRequest request, ProfessionalResponse professional, boolean canReview) {
        return new ServiceRequestResponse(request.getId(), request.getPaciente().getId(), request.getPaciente().getNome(), professional,
                toClinicShort(request.getClinica()), request.getServicoSolicitado(), request.getNecessidadesInformadas(), request.getDataDesejada(),
                request.getEnderecoAtendimento(), request.getValor(), request.getStatus(), request.getObservacaoAdministrador(), request.getCreatedAt(),
                request.getUpdatedAt(), request.getConfirmedAt(), request.getRejectedAt(), request.getCancelledAt(), request.getCompletedAt(), canReview);
    }

}
