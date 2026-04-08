package com.senai.pi.vitalux.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.senai.pi.vitalux.models.Agendamento;
import com.senai.pi.vitalux.services.AgendamentoService;
import java.util.List;


/**
 * Controller responsável pelo gerenciamento de agendamentos
 * Fornece endpoints REST para operações CRUD de agendamentos
 */
@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    @Autowired
    private AgendamentoService as;

    /**
     * Retorna uma lista de todos os agendamentos ordenados por data/hora decrescente
     * @return ResponseEntity com lista de agendamentos
     */
    @GetMapping
    public List<Agendamento> listarTodos() {
        return as.listarTodos();
    }

    /**
     * Busca um agendamento específico pelo ID
     * @param id ID do agendamento
     * @return ResponseEntity com agendamento ou 404 se não encontrado
     */
    @GetMapping("/buscar/{id}")
    public Agendamento buscarPorId(@PathVariable Integer id) {
        return as.buscarPorId(id);
    }

    /**
     * Busca todos os agendamentos de um cliente específico
     * @param clienteId ID do cliente
     * @return ResponseEntity com lista de agendamentos do cliente
     */
    @GetMapping("/cliente/{clienteId}")
    public List<Agendamento> buscarPorClienteId(@PathVariable Integer clienteId) {
        return as.buscarPorClienteId(clienteId);
    }

    /**
     * Cria um novo agendamento
     * @param agendamento Objeto com dados do agendamento
     * @return ResponseEntity com agendamento criado e status 201
     */
    @PostMapping
    public Agendamento criar(@RequestBody Agendamento agendamento) {
        return as.criar(agendamento);
    }

    /**
     * Atualiza um agendamento existente
     * @param id ID do agendamento a atualizar
     * @param agendamento Novos dados do agendamento
     * @return ResponseEntity com agendamento atualizado ou 404 se não encontrado
     */
    @PutMapping("/{id}")
    public Agendamento atualizar(@PathVariable Integer id, @RequestBody Agendamento agendamento) {
        return as.atualizar(id, agendamento);
    }
    /**
     * Deleta um agendamento
     * @param id ID do agendamento a deletar
     * @return ResponseEntity sem conteúdo (204) ou 404 se não encontrado
     */
    @DeleteMapping("/{id}")
    public List<Agendamento> deletar(@PathVariable Integer id) {
        return as.deletar(id);
    }
}
