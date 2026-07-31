package br.com.carepoint.repository;

import br.com.carepoint.entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.time.Instant;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    @EntityGraph(attributePaths = "user")
    Optional<Patient> findByUserId(Long userId);
    boolean existsByCpf(String cpf);
    @EntityGraph(attributePaths = "user")
    Page<Patient> findByNomeContainingIgnoreCase(String nome, Pageable pageable);
    @EntityGraph(attributePaths = "user")
    Page<Patient> findAll(Pageable pageable);
    long countByCreatedAtGreaterThanEqual(Instant since);
    long countByCreatedAtGreaterThanEqualAndCreatedAtLessThan(Instant start, Instant end);
}
