package com.senai.pi.vitalux.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.senai.pi.vitalux.models.Clinica;
import java.util.Optional;
import java.util.List;

/**
 * Repository para Clínica
 * Fornece métodos customizados para buscar clínicas no banco de dados
 */
@Repository
public interface ClinicaRepository extends JpaRepository<Clinica, Integer> {
    
    /**
     * Busca uma clínica pelo CNPJ
     * @param cnpj CNPJ da clínica
     * @return Optional contendo a clínica se encontrada
     */
    Optional<Clinica> findByCnpj(String cnpj);
    
    /**
     * Busca clínicas pelo nome (busca parcial, case-insensitive)
     * @param nome Parte do nome da clínica
     * @return Lista de clínicas encontradas
     */
    List<Clinica> findByNomeContainingIgnoreCase(String nome);
}
