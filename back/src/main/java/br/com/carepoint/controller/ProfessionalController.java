package br.com.carepoint.controller;

import br.com.carepoint.dto.PageResponse;
import br.com.carepoint.dto.ProfessionalResponse;
import br.com.carepoint.entity.Profissao;
import br.com.carepoint.service.ProfessionalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/profissionais")
@Tag(name = "Marketplace de profissionais")
public class ProfessionalController {
    private final ProfessionalService professionalService;
    public ProfessionalController(ProfessionalService professionalService) { this.professionalService = professionalService; }

    @GetMapping
    @Operation(summary = "Pesquisa profissionais ativos com filtros, ordenação e paginação")
    public PageResponse<ProfessionalResponse> list(
            @RequestParam(required = false) String busca, @RequestParam(required = false) Profissao profissao,
            @RequestParam(required = false) String especialidade, @RequestParam(required = false) Long clinicaId,
            @RequestParam(required = false) BigDecimal valorMin, @RequestParam(required = false) BigDecimal valorMax,
            @RequestParam(required = false) Double avaliacaoMin, @RequestParam(defaultValue = "NOME") String ordenacao,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "12") int size) {
        return professionalService.list(busca, profissao, especialidade, clinicaId, valorMin, valorMax, avaliacaoMin, ordenacao, false, page, size);
    }

    @GetMapping("/especialidades")
    @Operation(summary = "Lista as especialidades dos profissionais ativos disponíveis para filtro")
    public List<String> listSpecialties() {
        return professionalService.listActiveSpecialties();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Retorna o perfil público de um profissional ativo")
    public ProfessionalResponse get(@PathVariable Long id) { return professionalService.get(id, false); }
}
