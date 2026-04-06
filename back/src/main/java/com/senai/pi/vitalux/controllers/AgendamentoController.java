package com.senai.pi.vitalux.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.senai.pi.vitalux.models.Agendamento;
import com.senai.pi.vitalux.services.AgendamentoService;
import java.util.List;
import java.util.Optional;

/**
 * Controller responsável pelo gerenciamento de agendamentos
 * Fornece endpoints REST para operações CRUD de agendamentos
 */
@RestController
@RequestMapping("/api/agendamentos")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AgendamentoController {

    @Autowired
    private AgendamentoService agendamentoService;

    /**
     * Retorna uma lista de todos os agendamentos ordenados por data/hora decrescente
     * @return ResponseEntity com lista de agendamentos
     */
    @GetMapping
    public ResponseEntity<List<Agendamento>> listarTodos() {
        List<Agendamento> agendamentos = agendamentoService.listarTodos();
        return ResponseEntity.ok(agendamentos);
    }

    /**
     * Busca um agendamento específico pelo ID
     * @param id ID do agendamento
     * @return ResponseEntity com agendamento ou 404 se não encontrado
     */
    @GetMapping("/{id}")
    public ResponseEntity<Agendamento> buscarPorId(@PathVariable Integer id) {
        Optional<Agendamento> agendamento = agendamentoService.buscarPorId(id);
        return agendamento.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Busca todos os agendamentos de um cliente específico
     * @param clienteId ID do cliente
     * @return ResponseEntity com lista de agendamentos do cliente
     */
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Agendamento>> buscarPorClienteId(@PathVariable Integer clienteId) {
        List<Agendamento> agendamentos = agendamentoService.buscarPorClienteId(clienteId);
        return ResponseEntity.ok(agendamentos);
    }

    /**
     * Cria um novo agendamento
     * @param agendamento Objeto com dados do agendamento
     * @return ResponseEntity com agendamento criado e status 201
     */
    @PostMapping
    public ResponseEntity<Agendamento> criar(@RequestBody Agendamento agendamento) {
        Agendamento novoAgendamento = agendamentoService.criar(agendamento);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoAgendamento);
    }

    /**
     * Atualiza um agendamento existente
     * @param id ID do agendamento a atualizar
     * @param agendamento Novos dados do agendamento
     * @return ResponseEntity com agendamento atualizado ou 404 se não encontrado
     */
    @PutMapping("/{id}")
    public ResponseEntity<Agendamento> atualizar(@PathVariable Integer id, @RequestBody Agendamento agendamento) {
        Agendamento agendamentoAtualizado = agendamentoService.atualizar(id, agendamento);
        if (agendamentoAtualizado != null) {
            return ResponseEntity.ok(agendamentoAtualizado);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Deleta um agendamento
     * @param id ID do agendamento a deletar
     * @return ResponseEntity sem conteúdo (204) ou 404 se não encontrado
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        if (agendamentoService.deletar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
