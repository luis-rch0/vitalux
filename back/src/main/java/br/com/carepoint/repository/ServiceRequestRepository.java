package br.com.carepoint.repository;

import br.com.carepoint.entity.RequestStatus;
import br.com.carepoint.entity.ServiceRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    @Override
    @EntityGraph(attributePaths = {"paciente", "paciente.user", "profissional", "clinica"})
    Optional<ServiceRequest> findById(Long id);
    @EntityGraph(attributePaths = {"paciente", "paciente.user", "profissional", "clinica"})
    Page<ServiceRequest> findByPacienteIdOrderByCreatedAtDesc(Long patientId, Pageable pageable);
    @EntityGraph(attributePaths = {"paciente", "paciente.user", "profissional", "clinica"})
    Page<ServiceRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status, Pageable pageable);
    @EntityGraph(attributePaths = {"paciente", "paciente.user", "profissional", "clinica"})
    Page<ServiceRequest> findAllByOrderByCreatedAtDesc(Pageable pageable);
    @EntityGraph(attributePaths = {"paciente", "paciente.user", "profissional", "clinica"})
    List<ServiceRequest> findTop5ByPacienteIdOrderByCreatedAtDesc(Long patientId);
    long countByStatus(RequestStatus status);
    long countByPacienteIdAndStatus(Long patientId, RequestStatus status);
    long countByCreatedAtGreaterThanEqual(Instant since);
    long countByCreatedAtGreaterThanEqualAndCreatedAtLessThan(Instant start, Instant end);
    @EntityGraph(attributePaths = {"paciente", "paciente.user", "profissional", "clinica"})
    List<ServiceRequest> findTop8ByOrderByCreatedAtDesc();
}
