package br.com.carepoint.controller;

import br.com.carepoint.dto.ClinicResponse;
import br.com.carepoint.dto.PageResponse;
import br.com.carepoint.service.ClinicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clinicas")
@Tag(name = "Clínicas")
public class ClinicController {
    private final ClinicService clinicService;
    public ClinicController(ClinicService clinicService) { this.clinicService = clinicService; }

    @GetMapping
    @Operation(summary = "Lista clínicas ativas")
    public PageResponse<ClinicResponse> list(@RequestParam(required = false) String busca,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "12") int size) {
        return clinicService.list(busca, false, page, size);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Retorna detalhes de uma clínica ativa")
    public ClinicResponse get(@PathVariable Long id) { return clinicService.get(id, false); }
}
