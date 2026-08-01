package br.com.carepoint.controller;

import br.com.carepoint.dto.*;
import br.com.carepoint.service.ServiceRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/solicitacoes")
@Tag(name = "Solicitações de atendimento")
public class ServiceRequestController {
    private final ServiceRequestService service;
    public ServiceRequestController(ServiceRequestService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('PACIENTE')")
    @Operation(summary = "Cria uma solicitação de atendimento domiciliar")
    public ServiceRequestResponse create(@Valid @RequestBody ServiceRequestCreateRequest request, Authentication authentication) {
        return service.create(authentication, request);
    }

    @GetMapping("/minhas")
    @PreAuthorize("hasRole('PACIENTE')")
    @Operation(summary = "Lista as solicitações do paciente autenticado")
    public PageResponse<ServiceRequestResponse> mine(Authentication authentication, @RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "10") int size) {
        return service.mine(authentication, page, size);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Retorna uma solicitação do paciente dono ou do administrador")
    public ServiceRequestResponse get(Authentication authentication, @PathVariable Long id) { return service.get(authentication, id); }

    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasRole('PACIENTE')")
    @Operation(summary = "Cancela solicitação pendente ou confirmada")
    public ServiceRequestResponse cancel(Authentication authentication, @PathVariable Long id) { return service.cancel(authentication, id); }

    @PostMapping("/{id}/avaliacao")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('PACIENTE')")
    @Operation(summary = "Avalia um atendimento concluído")
    public void review(Authentication authentication, @PathVariable Long id, @Valid @RequestBody ReviewCreateRequest request) {
        service.review(authentication, id, request);
    }
}
