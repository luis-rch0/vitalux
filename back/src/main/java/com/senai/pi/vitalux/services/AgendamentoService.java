package com.senai.pi.vitalux.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.senai.pi.vitalux.models.Agendamento;
import com.senai.pi.vitalux.repositories.AgendamentoRepository;
import java.util.List;
import java.util.Optional;

/**
 * Service responsável pela lógica de negócio de agendamentos
 * Realiza operações CRUD e buscas customizadas no banco de dados
 */
@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    /**
     * Retorna todos os agendamentos ordenados por data/hora decrescente
     * @return Lista de todos os agendamentos
     */
    public List<Agendamento> listarTodos() {
        return agendamentoRepository.findAllByOrderByDataHoraDesc();
    }

    /**
     * Busca um agendamento pelo ID
     * @param id ID do agendamento
     * @return Optional contendo o agendamento se encontrado
     */
    public Optional<Agendamento> buscarPorId(Integer id) {
        return agendamentoRepository.findById(id);
    }

    /**
     * Busca todos os agendamentos de um cliente específico
     * @param clienteId ID do cliente
     * @return Lista de agendamentos do cliente
     */
    public List<Agendamento> buscarPorClienteId(Integer clienteId) {
        return agendamentoRepository.findByClienteId(clienteId);
    }

    /**
     * Cria um novo agendamento
     * @param agendamento Objeto agendamento a ser salvo
     * @return Agendamento criado com ID gerado
     */
    public Agendamento criar(Agendamento agendamento) {
        return agendamentoRepository.save(agendamento);
    }

    /**
     * Atualiza um agendamento existente
     * @param id ID do agendamento a atualizar
     * @param agendamento Novos dados do agendamento
     * @return Agendamento atualizado ou null se não encontrado
     */
    public Agendamento atualizar(Integer id, Agendamento agendamento) {
        if (agendamentoRepository.existsById(id)) {
            agendamento.setId(id);
            return agendamentoRepository.save(agendamento);
        }
        return null;
    }

    /**
     * Deleta um agendamento
     * @param id ID do agendamento a deletar
     * @return true se deletado, false se não encontrado
     */
    public boolean deletar(Integer id) {
        if (agendamentoRepository.existsById(id)) {
            agendamentoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Verifica se um agendamento existe
     * @param id ID do agendamento
     * @return true se existe, false caso contrário
     */
    public boolean existe(Integer id) {
        return agendamentoRepository.existsById(id);
    }
}
