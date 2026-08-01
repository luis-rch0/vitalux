package br.com.carepoint.repository;

import br.com.carepoint.entity.Professional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.time.Instant;

public interface ProfessionalRepository extends JpaRepository<Professional, Long>, JpaSpecificationExecutor<Professional> {
    boolean existsByCpf(String cpf);
    Optional<Professional> findByCpf(String cpf);
    boolean existsByNumeroRegistroProfissional(String numeroRegistroProfissional);
    Optional<Professional> findByNumeroRegistroProfissional(String numeroRegistroProfissional);
    long countByAtivoTrue();
    long countByCreatedAtGreaterThanEqualAndCreatedAtLessThan(Instant start, Instant end);

    @Query("select distinct p.especialidade from Professional p where p.ativo = true and p.especialidade is not null")
    List<String> findDistinctActiveSpecialties();

    @Query("select p.clinica.id as clinicId, count(p) as total from Professional p where p.clinica.id in :clinicIds group by p.clinica.id")
    List<ClinicProfessionalCount> countByClinicIds(@Param("clinicIds") Collection<Long> clinicIds);

    @Query("select r.profissional.id as professionalId, avg(r.nota) as average, count(r) as total from Review r where r.profissional.id in :professionalIds group by r.profissional.id")
    List<ProfessionalRating> ratingsByProfessionalIds(@Param("professionalIds") Collection<Long> professionalIds);

    @Override
    @EntityGraph(attributePaths = "clinica")
    Page<Professional> findAll(Specification<Professional> specification, Pageable pageable);

    interface ProfessionalRating {
        Long getProfessionalId();
        Double getAverage();
        Long getTotal();
    }

    interface ClinicProfessionalCount {
        Long getClinicId();
        Long getTotal();
    }
}
