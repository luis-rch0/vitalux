package com.senai.pi.vitalux.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.senai.pi.vitalux.models.Consulta;
import com.senai.pi.vitalux.services.ConsultaService;
import java.util.List;
import java.util.Optional;

/**
 * Controller responsável pelo gerenciamento de consultas
 * Fornece endpoints REST para operações CRUD de consultas
 */
@RestController
@RequestMapping("/api/consultas")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ConsultaController {

    @Autowired
    private ConsultaService consultaService;

    /**
     * Retorna uma lista de todas as consultas
     * @return ResponseEntity com lista de consultas
     */
    @GetMapping
    public ResponseEntity<List<Consulta>> listarTodos() {
        List<Consulta> consultas = consultaService.listarTodos();
        return ResponseEntity.ok(consultas);
    }

    /**
     * Busca uma consulta específica pelo ID
     * @param id ID da consulta
     * @return ResponseEntity com consulta ou 404 se não encontrada
     */
    @GetMapping("/{id}")
    public ResponseEntity<Consulta> buscarPorId(@PathVariable Integer id) {
        Optional<Consulta> consulta = consultaService.buscarPorId(id);
        return consulta.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Busca todas as consultas de um cliente específico
     * @param clienteId ID do cliente
     * @return ResponseEntity com lista de consultas do cliente
     */
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Consulta>> buscarPorClienteId(@PathVariable Integer clienteId) {
        List<Consulta> consultas = consultaService.buscarPorClienteId(clienteId);
        return ResponseEntity.ok(consultas);
    }

    /**
     * Busca todas as consultas de uma clínica específica
     * @param clinicaId ID da clínica
     * @return ResponseEntity com lista de consultas da clínica
     */
    @GetMapping("/clinica/{clinicaId}")
    public ResponseEntity<List<Consulta>> buscarPorClinicaId(@PathVariable Integer clinicaId) {
        List<Consulta> consultas = consultaService.buscarPorClinicaId(clinicaId);
        return ResponseEntity.ok(consultas);
    }

    /**
     * Busca todas as consultas de um agendamento específico
     * @param agendamentoId ID do agendamento
     * @return ResponseEntity com lista de consultas do agendamento
     */
    @GetMapping("/agendamento/{agendamentoId}")
    public ResponseEntity<List<Consulta>> buscarPorAgendamentoId(@PathVariable Integer agendamentoId) {
        List<Consulta> consultas = consultaService.buscarPorAgendamentoId(agendamentoId);
        return ResponseEntity.ok(consultas);
    }

    /**
     * Cria uma nova consulta
     * @param consulta Objeto com dados da consulta
     * @return ResponseEntity com consulta criada e status 201
     */
    @PostMapping
    public ResponseEntity<Consulta> criar(@RequestBody Consulta consulta) {
        Consulta novaConsulta = consultaService.criar(consulta);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaConsulta);
    }

    /**
     * Atualiza uma consulta existente
     * @param id ID da consulta a atualizar
     * @param consulta Novos dados da consulta
     * @return ResponseEntity com consulta atualizada ou 404 se não encontrada
     */
    @PutMapping("/{id}")
    public ResponseEntity<Consulta> atualizar(@PathVariable Integer id, @RequestBody Consulta consulta) {
        Consulta consultaAtualizada = consultaService.atualizar(id, consulta);
        if (consultaAtualizada != null) {
            return ResponseEntity.ok(consultaAtualizada);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Deleta uma consulta
     * @param id ID da consulta a deletar
     * @return ResponseEntity sem conteúdo (204) ou 404 se não encontrada
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        if (consultaService.deletar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
