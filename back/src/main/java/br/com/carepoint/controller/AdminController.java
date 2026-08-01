package br.com.carepoint.controller;

import br.com.carepoint.dto.*;
import br.com.carepoint.entity.RequestStatus;
import br.com.carepoint.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Administração")
public class AdminController {
    private final DashboardService dashboardService;
    private final ProfessionalService professionalService;
    private final ClinicService clinicService;
    private final PatientService patientService;
    private final ServiceRequestService requestService;

    public AdminController(DashboardService dashboardService, ProfessionalService professionalService, ClinicService clinicService,
                           PatientService patientService, ServiceRequestService requestService) {
        this.dashboardService = dashboardService;
        this.professionalService = professionalService;
        this.clinicService = clinicService;
        this.patientService = patientService;
        this.requestService = requestService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Retorna métricas administrativas")
    public DashboardResponse dashboard() { return dashboardService.admin(); }

    @GetMapping("/profissionais")
    public PageResponse<ProfessionalResponse> professionals(
            @RequestParam(required = false) String busca, @RequestParam(required = false) br.com.carepoint.entity.Profissao profissao,
            @RequestParam(required = false) String especialidade, @RequestParam(required = false) Long clinicaId,
            @RequestParam(required = false) BigDecimal valorMin, @RequestParam(required = false) BigDecimal valorMax,
            @RequestParam(required = false) Double avaliacaoMin, @RequestParam(defaultValue = "NOME") String ordenacao,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return professionalService.list(busca, profissao, especialidade, clinicaId, valorMin, valorMax, avaliacaoMin, ordenacao, true, page, size);
    }

    @GetMapping("/profissionais/{id}")
    public ProfessionalAdminResponse professional(@PathVariable Long id) { return professionalService.getAdmin(id); }

    @PostMapping("/profissionais")
    @ResponseStatus(HttpStatus.CREATED)
    public ProfessionalResponse createProfessional(@Valid @RequestBody ProfessionalRequest request) { return professionalService.create(request); }

    @PutMapping("/profissionais/{id}")
    public ProfessionalResponse updateProfessional(@PathVariable Long id, @Valid @RequestBody ProfessionalRequest request) { return professionalService.update(id, request); }

    @PatchMapping("/profissionais/{id}/status")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void professionalStatus(@PathVariable Long id, @RequestParam boolean ativo) { professionalService.setActive(id, ativo); }

    @GetMapping("/clinicas")
    public PageResponse<ClinicResponse> clinics(@RequestParam(required = false) String busca,
                                                 @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return clinicService.list(busca, true, page, size);
    }

    @GetMapping("/clinicas/{id}")
    public ClinicResponse clinic(@PathVariable Long id) { return clinicService.get(id, true); }

    @PostMapping("/clinicas")
    @ResponseStatus(HttpStatus.CREATED)
    public ClinicResponse createClinic(@Valid @RequestBody ClinicRequest request) { return clinicService.create(request); }

    @PutMapping("/clinicas/{id}")
    public ClinicResponse updateClinic(@PathVariable Long id, @Valid @RequestBody ClinicRequest request) { return clinicService.update(id, request); }

    @PatchMapping("/clinicas/{id}/status")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clinicStatus(@PathVariable Long id, @RequestParam boolean ativo) { clinicService.setActive(id, ativo); }

    @GetMapping("/pacientes")
    public PageResponse<PatientResponse> patients(@RequestParam(required = false) String busca,
                                                  @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return patientService.list(busca, page, size);
    }

    @GetMapping("/pacientes/{id}")
    public PatientResponse patient(@PathVariable Long id) { return patientService.getById(id); }

    @GetMapping("/solicitacoes")
    public PageResponse<ServiceRequestResponse> requests(@RequestParam(required = false) RequestStatus status,
                                                          @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return requestService.adminList(status, page, size);
    }

    @GetMapping("/solicitacoes/{id}")
    public ServiceRequestResponse request(@PathVariable Long id) { return requestService.adminGet(id); }

    @PatchMapping("/solicitacoes/{id}/confirmar")
    public ServiceRequestResponse confirm(@PathVariable Long id) { return requestService.confirm(id); }

    @PatchMapping("/solicitacoes/{id}/rejeitar")
    public ServiceRequestResponse reject(@PathVariable Long id, @Valid @RequestBody StatusNoteRequest request) { return requestService.reject(id, request); }

    @PatchMapping("/solicitacoes/{id}/concluir")
    public ServiceRequestResponse complete(@PathVariable Long id) { return requestService.complete(id); }
}
