package com.senai.pi.vitalux.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.senai.pi.vitalux.models.Agendamento;
import java.util.List;

/**
 * Repository para Agendamento
 * Fornece métodos customizados para buscar agendamentos no banco de dados
 */
@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Integer> {
    
    /**
     * Busca todos os agendamentos de um cliente específico
     * @param clienteId ID do cliente
     * @return Lista de agendamentos do cliente
     */
    List<Agendamento> findByClienteId(Integer clienteId);
    
    /**
     * Busca todos os agendamentos ordenados por data/hora em ordem decrescente
     * @return Lista de agendamentos ordenados
     */
    List<Agendamento> findAllByOrderByDataHoraDesc();


    

}
