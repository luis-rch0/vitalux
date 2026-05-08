package com.senai.pi.vitalux.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.senai.pi.vitalux.models.ListagemMedica;
import java.util.Optional;
import java.util.List;

/**
 * Repository para Listagem Médica
 * Fornece métodos customizados para buscar médicos no banco de dados
 */
@Repository
public interface ListagemMedicaRepository extends JpaRepository<ListagemMedica, Integer> {
    
    /**
     * Busca um médico pelo CPF
     * @param cpf CPF do médico
     * @return Optional contendo o médico se encontrado
     */
    Optional<ListagemMedica> findByCpf(String cpf);
    
    /**
     * Busca um médico pelo CRM
     * @param crm CRM do médico
     * @return Optional contendo o médico se encontrado
     */
    Optional<ListagemMedica> findByCrm(String crm);
    
    /**
     * Busca médicos pelo nome (busca parcial, case-insensitive)
     * @param nome Parte do nome do médico
     * @return Lista de médicos encontrados
     */
    List<ListagemMedica> findByNomeContainingIgnoreCase(String nome);
    
    /**
     * Busca médicos por especialidade
     * @param especialidade Especialidade do médico
     * @return Lista de médicos encontrados
     */
    List<ListagemMedica> findByEspecialidade(String especialidade);
    
    /**
     * Busca todos os médicos ativos
     * @return Lista de médicos ativos
     */
    List<ListagemMedica> findByAtivoTrue();
}
