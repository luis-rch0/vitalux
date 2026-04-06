package com.senai.pi.vitalux.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.senai.pi.vitalux.models.ConformidadeLegal;
import com.senai.pi.vitalux.services.Conformidade_legalService;
import java.util.List;
import java.util.Optional;

/**
 * Controller responsável pelo gerenciamento de conformidades legais
 * Fornece endpoints REST para operações CRUD de conformidades legais
 */
@RestController
@RequestMapping("/api/conformidades")
@CrossOrigin(origins = "*", maxAge = 3600)
public class Conformidade_legalController {

    @Autowired
    private Conformidade_legalService conformidadeService;

    /**
     * Retorna uma lista de todas as conformidades legais
     * @return ResponseEntity com lista de conformidades
     */
    @GetMapping
    public ResponseEntity<List<ConformidadeLegal>> listarTodos() {
        List<ConformidadeLegal> conformidades = conformidadeService.listarTodos();
        return ResponseEntity.ok(conformidades);
    }

    /**
     * Busca uma conformidade legal específica pelo ID
     * @param id ID da conformidade
     * @return ResponseEntity com conformidade ou 404 se não encontrada
     */
    @GetMapping("/{id}")
    public ResponseEntity<ConformidadeLegal> buscarPorId(@PathVariable Integer id) {
        Optional<ConformidadeLegal> conformidade = conformidadeService.buscarPorId(id);
        return conformidade.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Busca a conformidade legal de uma clínica específica
     * @param clinicaId ID da clínica
     * @return ResponseEntity com conformidade ou 404 se não encontrada
     */
    @GetMapping("/clinica/{clinicaId}")
    public ResponseEntity<ConformidadeLegal> buscarPorClinicaId(@PathVariable Integer clinicaId) {
        Optional<ConformidadeLegal> conformidade = conformidadeService.buscarPorClinicaId(clinicaId);
        return conformidade.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Cria uma nova conformidade legal
     * @param conformidade Objeto com dados da conformidade
     * @return ResponseEntity com conformidade criada e status 201
     */
    @PostMapping
    public ResponseEntity<ConformidadeLegal> criar(@RequestBody ConformidadeLegal conformidade) {
        ConformidadeLegal novaConformidade = conformidadeService.criar(conformidade);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaConformidade);
    }

    /**
     * Atualiza uma conformidade legal existente
     * @param id ID da conformidade a atualizar
     * @param conformidade Novos dados da conformidade
     * @return ResponseEntity com conformidade atualizada ou 404 se não encontrada
     */
    @PutMapping("/{id}")
    public ResponseEntity<ConformidadeLegal> atualizar(@PathVariable Integer id, @RequestBody ConformidadeLegal conformidade) {
        ConformidadeLegal conformidadeAtualizada = conformidadeService.atualizar(id, conformidade);
        if (conformidadeAtualizada != null) {
            return ResponseEntity.ok(conformidadeAtualizada);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Deleta uma conformidade legal
     * @param id ID da conformidade a deletar
     * @return ResponseEntity sem conteúdo (204) ou 404 se não encontrada
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        if (conformidadeService.deletar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
