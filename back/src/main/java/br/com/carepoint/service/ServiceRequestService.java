package br.com.carepoint.service;

import br.com.carepoint.dto.*;
import br.com.carepoint.entity.*;
import br.com.carepoint.exception.ApiException;
import br.com.carepoint.exception.ResourceNotFoundException;
import br.com.carepoint.mapper.CarePointMapper;
import br.com.carepoint.repository.ClinicRepository;
import br.com.carepoint.repository.ProfessionalRepository;
import br.com.carepoint.repository.ReviewRepository;
import br.com.carepoint.repository.ServiceRequestRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ServiceRequestService {
    private final ServiceRequestRepository requestRepository;
    private final ReviewRepository reviewRepository;
    private final CurrentUserService currentUserService;
    private final ProfessionalService professionalService;
    private final ClinicRepository clinicRepository;
    private final ProfessionalRepository professionalRepository;
    private final CarePointMapper mapper;

    public ServiceRequestService(ServiceRequestRepository requestRepository, ReviewRepository reviewRepository,
                                 CurrentUserService currentUserService, ProfessionalService professionalService,
                                 ClinicRepository clinicRepository, ProfessionalRepository professionalRepository, CarePointMapper mapper) {
        this.requestRepository = requestRepository;
        this.reviewRepository = reviewRepository;
        this.currentUserService = currentUserService;
        this.professionalService = professionalService;
        this.clinicRepository = clinicRepository;
        this.professionalRepository = professionalRepository;
        this.mapper = mapper;
    }

    @Transactional
    public ServiceRequestResponse create(Authentication authentication, ServiceRequestCreateRequest input) {
        Patient patient = currentUserService.requirePatient(authentication);
        Professional professional = getActiveProfessional(input.profissionalId());
        Clinic clinic = resolveClinic(input.clinicaId(), professional);
        ServiceRequest request = ServiceRequest.builder()
                .paciente(patient).profissional(professional).clinica(clinic).servicoSolicitado(input.servicoSolicitado().trim())
                .necessidadesInformadas(input.necessidadesInformadas().trim()).dataDesejada(input.dataDesejada())
                .enderecoAtendimento(input.enderecoAtendimento().trim()).valor(professional.getValorAtendimento()).status(RequestStatus.PENDENTE).build();
        requestRepository.save(request);
        return mapper.toServiceRequest(request, professionalService.toResponse(professional), false);
    }

    @Transactional(readOnly = true)
    public PageResponse<ServiceRequestResponse> mine(Authentication authentication, int page, int size) {
        Patient patient = currentUserService.requirePatient(authentication);
        Page<ServiceRequest> result = requestRepository.findByPacienteIdOrderByCreatedAtDesc(patient.getId(), page(page, size));
        return pageResponses(result, patient.getId());
    }

    @Transactional(readOnly = true)
    public ServiceRequestResponse get(Authentication authentication, Long id) {
        AppUser user = currentUserService.requireUser(authentication);
        ServiceRequest request = findAuthorized(id, user);
        return responses(List.of(request), user.getRole() == Role.PACIENTE ? request.getPaciente().getId() : null).getFirst();
    }

    @Transactional
    public ServiceRequestResponse cancel(Authentication authentication, Long id) {
        Patient patient = currentUserService.requirePatient(authentication);
        ServiceRequest request = requestRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Solicitação"));
        if (!request.getPaciente().getId().equals(patient.getId())) throw new ApiException(HttpStatus.FORBIDDEN, "Você só pode cancelar suas próprias solicitações.");
        if (request.getStatus() != RequestStatus.PENDENTE && request.getStatus() != RequestStatus.CONFIRMADA) {
            throw new ApiException(HttpStatus.CONFLICT, "Esta solicitação não pode mais ser cancelada.");
        }
        request.setStatus(RequestStatus.CANCELADA);
        request.setCancelledAt(Instant.now());
        return responses(List.of(request), patient.getId()).getFirst();
    }

    @Transactional(readOnly = true)
    public PageResponse<ServiceRequestResponse> adminList(RequestStatus status, int page, int size) {
        Page<ServiceRequest> result = status == null ? requestRepository.findAllByOrderByCreatedAtDesc(page(page, size))
                : requestRepository.findByStatusOrderByCreatedAtDesc(status, page(page, size));
        return pageResponses(result, null);
    }

    @Transactional(readOnly = true)
    public ServiceRequestResponse adminGet(Long id) {
        return responses(List.of(find(id)), null).getFirst();
    }

    @Transactional
    public ServiceRequestResponse confirm(Long id) {
        ServiceRequest request = find(id);
        requireStatus(request, RequestStatus.PENDENTE, "confirmada");
        request.setStatus(RequestStatus.CONFIRMADA);
        request.setConfirmedAt(Instant.now());
        return responses(List.of(request), null).getFirst();
    }

    @Transactional
    public ServiceRequestResponse reject(Long id, StatusNoteRequest input) {
        ServiceRequest request = find(id);
        requireStatus(request, RequestStatus.PENDENTE, "rejeitada");
        request.setStatus(RequestStatus.REJEITADA);
        request.setObservacaoAdministrador(input.observacao().trim());
        request.setRejectedAt(Instant.now());
        return responses(List.of(request), null).getFirst();
    }

    @Transactional
    public ServiceRequestResponse complete(Long id) {
        ServiceRequest request = find(id);
        requireStatus(request, RequestStatus.CONFIRMADA, "concluída");
        request.setStatus(RequestStatus.CONCLUIDA);
        request.setCompletedAt(Instant.now());
        return responses(List.of(request), null).getFirst();
    }

    @Transactional
    public void review(Authentication authentication, Long requestId, ReviewCreateRequest input) {
        Patient patient = currentUserService.requirePatient(authentication);
        ServiceRequest request = requestRepository.findById(requestId).orElseThrow(() -> new ResourceNotFoundException("Solicitação"));
        if (!request.getPaciente().getId().equals(patient.getId())) throw new ApiException(HttpStatus.FORBIDDEN, "Você só pode avaliar seus próprios atendimentos.");
        if (request.getStatus() != RequestStatus.CONCLUIDA) throw new ApiException(HttpStatus.CONFLICT, "A avaliação só pode ser feita após a conclusão.");
        if (reviewRepository.existsBySolicitacaoId(requestId)) throw new ApiException(HttpStatus.CONFLICT, "Esta solicitação já foi avaliada.");
        reviewRepository.save(Review.builder().solicitacao(request).paciente(patient).profissional(request.getProfissional())
                .nota(input.nota()).comentario(blankToNull(input.comentario())).build());
    }

    @Transactional(readOnly = true)
    public List<ServiceRequestResponse> recentForPatient(Patient patient) {
        return responses(requestRepository.findTop5ByPacienteIdOrderByCreatedAtDesc(patient.getId()), patient.getId());
    }

    @Transactional(readOnly = true)
    public List<ServiceRequestResponse> recentForAdmin() {
        return responses(requestRepository.findTop8ByOrderByCreatedAtDesc(), null);
    }

    private PageResponse<ServiceRequestResponse> pageResponses(Page<ServiceRequest> page, Long patientId) {
        List<ServiceRequestResponse> mapped = responses(page.getContent(), patientId);
        return new PageResponse<>(mapped, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isFirst(), page.isLast());
    }

    private List<ServiceRequestResponse> responses(List<ServiceRequest> requests, Long requestingPatientId) {
        if (requests.isEmpty()) return List.of();
        Map<Long, ProfessionalResponse> professionals = professionalService.responseMap(requests.stream().map(ServiceRequest::getProfissional).toList());
        Set<Long> reviewed = new HashSet<>(reviewRepository.requestIdsWithReview(requests.stream().map(ServiceRequest::getId).toList()));
        return requests.stream().map(request -> {
            boolean canReview = requestingPatientId != null && requestingPatientId.equals(request.getPaciente().getId())
                    && request.getStatus() == RequestStatus.CONCLUIDA && !reviewed.contains(request.getId());
            return mapper.toServiceRequest(request, professionals.get(request.getProfissional().getId()), canReview);
        }).toList();
    }

    private ServiceRequest findAuthorized(Long id, AppUser user) {
        ServiceRequest request = find(id);
        if (user.getRole() == Role.ADMIN) return request;
        if (user.getRole() == Role.PACIENTE && request.getPaciente().getUser().getId().equals(user.getId())) return request;
        throw new ApiException(HttpStatus.FORBIDDEN, "Você não tem acesso a esta solicitação.");
    }

    private ServiceRequest find(Long id) { return requestRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Solicitação")); }

    private Professional getActiveProfessional(Long id) {
        Professional professional = professionalServiceEntity(id);
        if (!professional.isAtivo()) throw new ApiException(HttpStatus.CONFLICT, "O profissional selecionado está indisponível.");
        return professional;
    }

    private Professional professionalServiceEntity(Long id) {
        return professionalRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Profissional"));
    }

    private Clinic resolveClinic(Long clinicId, Professional professional) {
        Clinic professionalClinic = professional.getClinica();
        if (clinicId == null) return professionalClinic;
        Clinic requested = clinicRepository.findById(clinicId).orElseThrow(() -> new ResourceNotFoundException("Clínica"));
        if (!requested.isAtivo()) throw new ApiException(HttpStatus.CONFLICT, "A clínica selecionada está indisponível.");
        if (professionalClinic != null && !professionalClinic.getId().equals(requested.getId())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "O profissional não está associado à clínica informada.");
        }
        return requested;
    }

    private void requireStatus(ServiceRequest request, RequestStatus allowed, String target) {
        if (request.getStatus() != allowed) throw new ApiException(HttpStatus.CONFLICT, "A solicitação não pode ser " + target + " no status atual.");
    }
    private Pageable page(int page, int size) { return PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100)); }
    private String blankToNull(String value) { return value == null || value.isBlank() ? null : value.trim(); }
}
