package br.com.carepoint.repository;

import br.com.carepoint.entity.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.Instant;
import java.util.Optional;

public interface ClinicRepository extends JpaRepository<Clinic, Long>, JpaSpecificationExecutor<Clinic> {
    boolean existsByCnpj(String cnpj);
    Optional<Clinic> findByCnpj(String cnpj);
    long countByCreatedAtGreaterThanEqualAndCreatedAtLessThan(Instant start, Instant end);
}
