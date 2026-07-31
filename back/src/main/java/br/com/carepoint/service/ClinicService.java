package br.com.carepoint.service;

import br.com.carepoint.dto.ClinicRequest;
import br.com.carepoint.dto.ClinicResponse;
import br.com.carepoint.dto.PageResponse;
import br.com.carepoint.entity.Clinic;
import br.com.carepoint.exception.ApiException;
import br.com.carepoint.exception.ResourceNotFoundException;
import br.com.carepoint.mapper.CarePointMapper;
import br.com.carepoint.repository.ClinicRepository;
import br.com.carepoint.repository.ProfessionalRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ClinicService {
    private final ClinicRepository clinicRepository;
    private final ProfessionalRepository professionalRepository;
    private final CarePointMapper mapper;

    public ClinicService(ClinicRepository clinicRepository, ProfessionalRepository professionalRepository, CarePointMapper mapper) {
        this.clinicRepository = clinicRepository;
        this.professionalRepository = professionalRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public PageResponse<ClinicResponse> list(String search, boolean includeInactive, int page, int size) {
        Specification<Clinic> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (!includeInactive) predicates.add(cb.isTrue(root.get("ativo")));
            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.trim().toLowerCase(Locale.ROOT) + "%";
                predicates.add(cb.or(cb.like(cb.lower(root.get("nome")), pattern), cb.like(cb.lower(root.get("endereco")), pattern)));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(size, 1), 100), Sort.by("nome").ascending());
        Page<Clinic> result = clinicRepository.findAll(spec, pageable);
        Map<Long, Long> counts = professionalCounts(result.getContent());
        return PageResponse.from(result, clinic -> mapper.toClinic(clinic, counts.getOrDefault(clinic.getId(), 0L)));
    }

    @Transactional(readOnly = true)
    public ClinicResponse get(Long id, boolean includeInactive) {
        Clinic clinic = clinicRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Clínica"));
        if (!includeInactive && !clinic.isAtivo()) throw new ResourceNotFoundException("Clínica");
        return mapper.toClinic(clinic, professionalCounts(List.of(clinic)).getOrDefault(id, 0L));
    }

    @Transactional
    public ClinicResponse create(ClinicRequest request) {
        String cnpj = digits(request.cnpj());
        if (cnpj.length() != 14) throw new ApiException(HttpStatus.BAD_REQUEST, "CNPJ inválido.");
        if (clinicRepository.existsByCnpj(cnpj)) throw new ApiException(HttpStatus.CONFLICT, "CNPJ já cadastrado.");
        Clinic clinic = new Clinic();
        apply(clinic, request);
        clinicRepository.save(clinic);
        return mapper.toClinic(clinic, 0);
    }

    @Transactional
    public ClinicResponse update(Long id, ClinicRequest request) {
        Clinic clinic = clinicRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Clínica"));
        String cnpj = digits(request.cnpj());
        if (cnpj.length() != 14) throw new ApiException(HttpStatus.BAD_REQUEST, "CNPJ inválido.");
        if (!cnpj.equals(clinic.getCnpj()) && clinicRepository.existsByCnpj(cnpj)) throw new ApiException(HttpStatus.CONFLICT, "CNPJ já cadastrado.");
        apply(clinic, request);
        return mapper.toClinic(clinic, professionalCounts(List.of(clinic)).getOrDefault(id, 0L));
    }

    @Transactional
    public void setActive(Long id, boolean active) {
        clinicRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Clínica")).setAtivo(active);
    }

    private void apply(Clinic clinic, ClinicRequest request) {
        String phone = digits(request.telefone());
        if (phone.length() < 10 || phone.length() > 15) throw new ApiException(HttpStatus.BAD_REQUEST, "Telefone inválido.");
        clinic.setNome(request.nome().trim());
        clinic.setCnpj(digits(request.cnpj()));
        clinic.setDescricao(blankToNull(request.descricao()));
        clinic.setEndereco(request.endereco().trim());
        clinic.setTelefone(phone);
        clinic.setEmail(request.email().trim().toLowerCase(Locale.ROOT));
        clinic.setImagemUrl(blankToNull(request.imagemUrl()));
        clinic.setLatitude(request.latitude());
        clinic.setLongitude(request.longitude());
        if (request.ativo() != null) clinic.setAtivo(request.ativo());
    }

    private Map<Long, Long> professionalCounts(List<Clinic> clinics) {
        if (clinics.isEmpty()) return Map.of();
        return professionalRepository.countByClinicIds(clinics.stream().map(Clinic::getId).toList()).stream()
                .collect(Collectors.toMap(ProfessionalRepository.ClinicProfessionalCount::getClinicId,
                        ProfessionalRepository.ClinicProfessionalCount::getTotal));
    }

    private String digits(String value) { return value == null ? "" : value.replaceAll("\\D", ""); }
    private String blankToNull(String value) { return value == null || value.isBlank() ? null : value.trim(); }
}
