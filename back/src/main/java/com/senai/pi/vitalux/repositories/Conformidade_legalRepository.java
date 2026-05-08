package com.senai.pi.vitalux.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.senai.pi.vitalux.models.ConformidadeLegal;
import java.util.Optional;

/**
 * Repository para Conformidade Legal
 * Fornece métodos customizados para buscar conformidades legais no banco de dados
 */
@Repository
public interface Conformidade_legalRepository extends JpaRepository<ConformidadeLegal, Integer> {
    
    /**
     * Busca a conformidade legal de uma clínica específica
     * @param clinicaId ID da clínica
     * @return Optional contendo a conformidade se encontrada
     */
    Optional<ConformidadeLegal> findByClinicaId(Integer clinicaId);
}
