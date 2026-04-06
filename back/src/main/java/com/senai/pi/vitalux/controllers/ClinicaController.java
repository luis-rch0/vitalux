package com.senai.pi.vitalux.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.senai.pi.vitalux.models.Clinica;
import com.senai.pi.vitalux.services.ClinicaService;
import java.util.List;
import java.util.Optional;

/**
 * Controller responsável pelo gerenciamento de clínicas
 * Fornece endpoints REST para operações CRUD de clínicas
 */
@RestController
@RequestMapping("/api/clinicas")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ClinicaController {

    @Autowired
    private ClinicaService clinicaService;

    /**
     * Retorna uma lista de todas as clínicas
     * @return ResponseEntity com lista de clínicas
     */
    @GetMapping
    public ResponseEntity<List<Clinica>> listarTodos() {
        List<Clinica> clinicas = clinicaService.listarTodos();
        return ResponseEntity.ok(clinicas);
    }

    /**
     * Busca uma clínica específica pelo ID
     * @param id ID da clínica
     * @return ResponseEntity com clínica ou 404 se não encontrada
     */
    @GetMapping("/{id}")
    public ResponseEntity<Clinica> buscarPorId(@PathVariable Integer id) {
        Optional<Clinica> clinica = clinicaService.buscarPorId(id);
        return clinica.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Busca uma clínica pelo CNPJ
     * @param cnpj CNPJ da clínica
     * @return ResponseEntity com clínica ou 404 se não encontrada
     */
    @GetMapping("/cnpj/{cnpj}")
    public ResponseEntity<Clinica> buscarPorCnpj(@PathVariable String cnpj) {
        Optional<Clinica> clinica = clinicaService.buscarPorCnpj(cnpj);
        return clinica.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Busca clínicas pelo nome (busca parcial, case-insensitive)
     * @param nome Parte do nome da clínica
     * @return ResponseEntity com lista de clínicas encontradas
     */
    @GetMapping("/buscar/nome")
    public ResponseEntity<List<Clinica>> buscarPorNome(@RequestParam String nome) {
        List<Clinica> clinicas = clinicaService.buscarPorNome(nome);
        return ResponseEntity.ok(clinicas);
    }

    /**
     * Cria uma nova clínica
     * @param clinica Objeto com dados da clínica
     * @return ResponseEntity com clínica criada e status 201
     */
    @PostMapping
    public ResponseEntity<Clinica> criar(@RequestBody Clinica clinica) {
        Clinica novaClinica = clinicaService.criar(clinica);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaClinica);
    }

    /**
     * Atualiza uma clínica existente
     * @param id ID da clínica a atualizar
     * @param clinica Novos dados da clínica
     * @return ResponseEntity com clínica atualizada ou 404 se não encontrada
     */
    @PutMapping("/{id}")
    public ResponseEntity<Clinica> atualizar(@PathVariable Integer id, @RequestBody Clinica clinica) {
        Clinica clinicaAtualizada = clinicaService.atualizar(id, clinica);
        if (clinicaAtualizada != null) {
            return ResponseEntity.ok(clinicaAtualizada);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Deleta uma clínica
     * @param id ID da clínica a deletar
     * @return ResponseEntity sem conteúdo (204) ou 404 se não encontrada
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        if (clinicaService.deletar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
