package com.senai.pi.vitalux.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.senai.pi.vitalux.models.Consulta;
import com.senai.pi.vitalux.repositories.ConsultaRepository;
import java.util.List;
import java.util.Optional;

/**
 * Service responsável pela lógica de negócio de consultas
 * Realiza operações CRUD e buscas customizadas no banco de dados
 */
@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;

    /**
     * Retorna todas as consultas cadastradas
     * @return Lista de todas as consultas
     */
    public List<Consulta> listarTodos() {
        return consultaRepository.findAll();
    }

    /**
     * Busca uma consulta pelo ID
     * @param id ID da consulta
     * @return Optional contendo a consulta se encontrada
     */
    public Optional<Consulta> buscarPorId(Integer id) {
        return consultaRepository.findById(id);
    }

    /**
     * Busca todas as consultas de um cliente específico
     * @param clienteId ID do cliente
     * @return Lista de consultas do cliente
     */
    public List<Consulta> buscarPorClienteId(Integer clienteId) {
        return consultaRepository.findByClienteId(clienteId);
    }

    /**
     * Busca todas as consultas de uma clínica específica
     * @param clinicaId ID da clínica
     * @return Lista de consultas da clínica
     */
    public List<Consulta> buscarPorClinicaId(Integer clinicaId) {
        return consultaRepository.findByClinicaId(clinicaId);
    }

    /**
     * Busca todas as consultas de um agendamento específico
     * @param agendamentoId ID do agendamento
     * @return Lista de consultas do agendamento
     */
    public List<Consulta> buscarPorAgendamentoId(Integer agendamentoId) {
        return consultaRepository.findByAgendamentoId(agendamentoId);
    }

    /**
     * Cria uma nova consulta
     * @param consulta Objeto consulta a ser salvo
     * @return Consulta criada com ID gerado
     */
    public Consulta criar(Consulta consulta) {
        return consultaRepository.save(consulta);
    }

    /**
     * Atualiza uma consulta existente
     * @param id ID da consulta a atualizar
     * @param consulta Novos dados da consulta
     * @return Consulta atualizada ou null se não encontrada
     */
    public Consulta atualizar(Integer id, Consulta consulta) {
        if (consultaRepository.existsById(id)) {
            consulta.setId(id);
            return consultaRepository.save(consulta);
        }
        return null;
    }

    /**
     * Deleta uma consulta
     * @param id ID da consulta a deletar
     * @return true se deletada, false se não encontrada
     */
    public boolean deletar(Integer id) {
        if (consultaRepository.existsById(id)) {
            consultaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Verifica se uma consulta existe
     * @param id ID da consulta
     * @return true se existe, false caso contrário
     */
    public boolean existe(Integer id) {
        return consultaRepository.existsById(id);
    }
}
