package com.senai.pi.vitalux.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.senai.pi.vitalux.models.Consulta;
import java.util.List;

/**
 * Repository para Consulta
 * Fornece métodos customizados para buscar consultas no banco de dados
 */
@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Integer> {
    
    /**
     * Busca todas as consultas de um cliente específico
     * @param clienteId ID do cliente
     * @return Lista de consultas do cliente
     */
    List<Consulta> findByClienteId(Integer clienteId);
    
    /**
     * Busca todas as consultas de uma clínica específica
     * @param clinicaId ID da clínica
     * @return Lista de consultas da clínica
     */
    List<Consulta> findByClinicaId(Integer clinicaId);
    
    /**
     * Busca todas as consultas de um agendamento específico
     * @param agendamentoId ID do agendamento
     * @return Lista de consultas do agendamento
     */
    List<Consulta> findByAgendamentoId(Integer agendamentoId);
}
