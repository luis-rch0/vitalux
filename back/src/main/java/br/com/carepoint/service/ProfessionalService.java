package br.com.carepoint.service;

import br.com.carepoint.dto.PageResponse;
import br.com.carepoint.dto.ProfessionalRequest;
import br.com.carepoint.dto.ProfessionalAdminResponse;
import br.com.carepoint.dto.ProfessionalResponse;
import br.com.carepoint.entity.Clinic;
import br.com.carepoint.entity.Profissao;
import br.com.carepoint.entity.Professional;
import br.com.carepoint.entity.Review;
import br.com.carepoint.exception.ApiException;
import br.com.carepoint.exception.ResourceNotFoundException;
import br.com.carepoint.mapper.CarePointMapper;
import br.com.carepoint.repository.ClinicRepository;
import br.com.carepoint.repository.ProfessionalRepository;
import jakarta.persistence.criteria.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Collator;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProfessionalService {
    private final ProfessionalRepository professionalRepository;
    private final ClinicRepository clinicRepository;
    private final CarePointMapper mapper;

    public ProfessionalService(ProfessionalRepository professionalRepository, ClinicRepository clinicRepository, CarePointMapper mapper) {
        this.professionalRepository = professionalRepository;
        this.clinicRepository = clinicRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public PageResponse<ProfessionalResponse> list(String search, Profissao profession, String specialty, Long clinicId,
                                                    BigDecimal minValue, BigDecimal maxValue, Double minRating,
                                                    String order, boolean includeInactive, int page, int size) {
        if (minValue != null && maxValue != null && minValue.compareTo(maxValue) > 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "O valor mínimo não pode ser maior que o máximo.");
        }
        Specification<Professional> spec = specification(search, profession, specialty, clinicId, minValue, maxValue, minRating, order, includeInactive);
        Pageable pageable = pageable(order, page, size);
        Page<Professional> result = professionalRepository.findAll(spec, pageable);
        Map<Long, Rating> ratings = ratingsFor(result.getContent());
        return PageResponse.from(result, professional -> toResponse(professional, ratings));
    }

    @Transactional(readOnly = true)
    public ProfessionalResponse get(Long id, boolean includeInactive) {
        Professional professional = professionalRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Profissional"));
        if (!includeInactive && !professional.isAtivo()) throw new ResourceNotFoundException("Profissional");
        return toResponse(professional, ratingFor(professional.getId()));
    }

    @Transactional(readOnly = true)
    public ProfessionalAdminResponse getAdmin(Long id) {
        Professional professional = professionalRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Profissional"));
        return new ProfessionalAdminResponse(toResponse(professional, ratingFor(id)), professional.getCpf());
    }

    @Transactional(readOnly = true)
    public List<String> listActiveSpecialties() {
        Collator portugueseOrder = Collator.getInstance(Locale.forLanguageTag("pt-BR"));
        portugueseOrder.setStrength(Collator.PRIMARY);

        Map<String, String> uniqueSpecialties = new HashMap<>();
        for (String specialty : professionalRepository.findDistinctActiveSpecialties()) {
            if (specialty == null || specialty.isBlank()) continue;
            String normalized = specialty.trim();
            uniqueSpecialties.merge(normalized.toLowerCase(Locale.ROOT), normalized,
                    (left, right) -> left.compareToIgnoreCase(right) <= 0 ? left : right);
        }
        return uniqueSpecialties.values().stream().sorted(portugueseOrder).toList();
    }

    @Transactional
    public ProfessionalResponse create(ProfessionalRequest request) {
        String cpf = digits(request.cpf());
        if (cpf.length() != 11) throw new ApiException(HttpStatus.BAD_REQUEST, "CPF inválido.");
        if (professionalRepository.existsByCpf(cpf)) throw new ApiException(HttpStatus.CONFLICT, "CPF já cadastrado.");
        validateRegistration(request.numeroRegistroProfissional(), null);
        Professional professional = new Professional();
        apply(professional, request);
        professionalRepository.save(professional);
        return toResponse(professional, new Rating(0, 0));
    }

    @Transactional
    public ProfessionalResponse update(Long id, ProfessionalRequest request) {
        Professional professional = professionalRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Profissional"));
        String cpf = digits(request.cpf());
        if (cpf.length() != 11) throw new ApiException(HttpStatus.BAD_REQUEST, "CPF inválido.");
        if (!cpf.equals(professional.getCpf()) && professionalRepository.existsByCpf(cpf)) throw new ApiException(HttpStatus.CONFLICT, "CPF já cadastrado.");
        validateRegistration(request.numeroRegistroProfissional(), id);
        apply(professional, request);
        return toResponse(professional, ratingFor(id));
    }

    @Transactional
    public void setActive(Long id, boolean active) {
        professionalRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Profissional")).setAtivo(active);
    }

    @Transactional(readOnly = true)
    public ProfessionalResponse toResponse(Professional professional) {
        return toResponse(professional, ratingFor(professional.getId()));
    }

    @Transactional(readOnly = true)
    public Map<Long, ProfessionalResponse> responseMap(Collection<Professional> professionals) {
        Map<Long, Rating> ratings = ratingsFor(professionals);
        return professionals.stream().collect(Collectors.toMap(Professional::getId, professional -> toResponse(professional, ratings), (left, right) -> left));
    }

    private Specification<Professional> specification(String search, Profissao profession, String specialty, Long clinicId,
                                                       BigDecimal minValue, BigDecimal maxValue, Double minRating,
                                                       String order, boolean includeInactive) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (!includeInactive) predicates.add(cb.isTrue(root.get("ativo")));
            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.trim().toLowerCase(Locale.ROOT) + "%";
                predicates.add(cb.or(cb.like(cb.lower(root.get("nome")), pattern), cb.like(cb.lower(root.get("especialidade")), pattern)));
            }
            if (profession != null) predicates.add(cb.equal(root.get("profissao"), profession));
            if (specialty != null && !specialty.isBlank()) predicates.add(cb.like(cb.lower(root.get("especialidade")), "%" + specialty.trim().toLowerCase(Locale.ROOT) + "%"));
            if (clinicId != null) predicates.add(cb.equal(root.get("clinica").get("id"), clinicId));
            if (minValue != null) predicates.add(cb.greaterThanOrEqualTo(root.get("valorAtendimento"), minValue));
            if (maxValue != null) predicates.add(cb.lessThanOrEqualTo(root.get("valorAtendimento"), maxValue));

            Subquery<Double> averageRating = null;
            if (minRating != null || "AVALIACAO".equalsIgnoreCase(order)) {
                averageRating = query.subquery(Double.class);
                Root<Review> review = averageRating.from(Review.class);
                averageRating.select(cb.avg(review.<Number>get("nota")))
                        .where(cb.equal(review.get("profissional"), root));
            }
            if (minRating != null) predicates.add(cb.greaterThanOrEqualTo(averageRating, minRating));
            if (averageRating != null && "AVALIACAO".equalsIgnoreCase(order) && query.getResultType() != Long.class) {
                query.orderBy(cb.desc(averageRating), cb.asc(root.get("nome")));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }

    private Pageable pageable(String order, int page, int size) {
        int safePage = Math.max(0, page);
        int safeSize = Math.min(Math.max(size, 1), 100);
        if ("MENOR_VALOR".equalsIgnoreCase(order)) return PageRequest.of(safePage, safeSize, Sort.by("valorAtendimento").ascending());
        if ("AVALIACAO".equalsIgnoreCase(order)) return PageRequest.of(safePage, safeSize);
        return PageRequest.of(safePage, safeSize, Sort.by("nome").ascending());
    }

    private void apply(Professional professional, ProfessionalRequest request) {
        String phone = digits(request.telefone());
        if (phone.length() < 10 || phone.length() > 15) throw new ApiException(HttpStatus.BAD_REQUEST, "Telefone inválido.");
        Clinic clinic = request.clinicaId() == null ? null : clinicRepository.findById(request.clinicaId())
                .orElseThrow(() -> new ResourceNotFoundException("Clínica"));
        professional.setNome(request.nome().trim());
        professional.setCpf(digits(request.cpf()));
        professional.setProfissao(request.profissao());
        professional.setEspecialidade(request.especialidade().trim());
        professional.setNumeroRegistroProfissional(blankToNull(request.numeroRegistroProfissional()));
        professional.setFotoUrl(blankToNull(request.fotoUrl()));
        professional.setValorAtendimento(request.valorAtendimento());
        professional.setTelefone(phone);
        professional.setEmail(request.email().trim().toLowerCase(Locale.ROOT));
        professional.setDescricao(blankToNull(request.descricao()));
        professional.setClinica(clinic);
        if (request.ativo() != null) professional.setAtivo(request.ativo());
    }

    private void validateRegistration(String registration, Long currentId) {
        String normalized = blankToNull(registration);
        if (normalized == null) return;
        professionalRepository.findByNumeroRegistroProfissional(normalized)
                .filter(existing -> !existing.getId().equals(currentId))
                .ifPresent(existing -> { throw new ApiException(HttpStatus.CONFLICT, "Registro profissional já cadastrado."); });
    }

    private Map<Long, Rating> ratingsFor(Collection<Professional> professionals) {
        if (professionals.isEmpty()) return Map.of();
        return professionalRepository.ratingsByProfessionalIds(professionals.stream().map(Professional::getId).toList()).stream()
                .collect(Collectors.toMap(ProfessionalRepository.ProfessionalRating::getProfessionalId,
                        row -> new Rating(row.getAverage() == null ? 0 : row.getAverage(), row.getTotal() == null ? 0 : row.getTotal())));
    }

    private Rating ratingFor(Long professionalId) {
        return professionalRepository.ratingsByProfessionalIds(List.of(professionalId)).stream().findFirst()
                .map(row -> new Rating(row.getAverage() == null ? 0 : row.getAverage(), row.getTotal() == null ? 0 : row.getTotal()))
                .orElse(new Rating(0, 0));
    }

    private ProfessionalResponse toResponse(Professional professional, Map<Long, Rating> ratings) {
        return toResponse(professional, ratings.getOrDefault(professional.getId(), new Rating(0, 0)));
    }

    private ProfessionalResponse toResponse(Professional professional, Rating rating) {
        return mapper.toProfessional(professional, rating.average(), rating.count());
    }

    private String digits(String value) { return value == null ? "" : value.replaceAll("\\D", ""); }
    private String blankToNull(String value) { return value == null || value.isBlank() ? null : value.trim(); }
    private record Rating(double average, long count) { }
}
