package br.com.carepoint.controller;

import br.com.carepoint.dto.PatientDashboardResponse;
import br.com.carepoint.dto.PatientResponse;
import br.com.carepoint.dto.PatientUpdateRequest;
import br.com.carepoint.service.DashboardService;
import br.com.carepoint.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Paciente")
public class PatientController {
    private final PatientService patientService;
    private final DashboardService dashboardService;

    public PatientController(PatientService patientService, DashboardService dashboardService) {
        this.patientService = patientService;
        this.dashboardService = dashboardService;
    }

    @GetMapping("/api/pacientes/me")
    @PreAuthorize("hasRole('PACIENTE')")
    @Operation(summary = "Retorna o perfil do paciente autenticado")
    public PatientResponse me(Authentication authentication) { return patientService.current(authentication); }

    @PatchMapping("/api/pacientes/me")
    @PreAuthorize("hasRole('PACIENTE')")
    @Operation(summary = "Atualiza o perfil do paciente autenticado")
    public PatientResponse update(@Valid @RequestBody PatientUpdateRequest request, Authentication authentication) {
        return patientService.updateCurrent(authentication, request);
    }

    @GetMapping("/api/paciente/dashboard")
    @PreAuthorize("hasRole('PACIENTE')")
    @Operation(summary = "Retorna dados dinâmicos da página inicial do paciente")
    public PatientDashboardResponse dashboard(Authentication authentication) { return dashboardService.patient(authentication); }
}
