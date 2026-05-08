package com.senai.pi.vitalux.controllers;

import org.springframework.beans.factory.annotation.Autowired;

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
public class ClinicaController {

    @Autowired
    private ClinicaService cs;

    /**
     * Retorna uma lista de todas as clínicas
     * @return ResponseEntity com lista de clínicas
     */
    @GetMapping
    public List<Clinica> listarTodos() {
        return cs.listarTodos();
    }

    /**
     * Busca uma clínica específica pelo ID
     * @param id ID da clínica
     * @return ResponseEntity com clínica ou 404 se não encontrada
     */
    @GetMapping("/{id}")
    public Clinica buscarPorId(@PathVariable Integer id) {
        Optional<Clinica> clinica = cs.buscarPorId(id);
        return clinica.orElse(null);
    }

    /**
     * Busca uma clínica pelo CNPJ
     * @param cnpj CNPJ da clínica
     * @return ResponseEntity com clínica ou 404 se não encontrada
     */
    @GetMapping("/cnpj/{cnpj}")
    public Clinica buscarPorCnpj(@PathVariable String cnpj) {
        Optional<Clinica> clinica = cs.buscarPorCnpj(cnpj);
        return clinica.orElse(null);
    }

    /**
     * Busca clínicas pelo nome (busca parcial, case-insensitive)
     * @param nome Parte do nome da clínica
     * @return ResponseEntity com lista de clínicas encontradas
     */
    @GetMapping("/buscar/nome")
    public List<Clinica> buscarPorNome(@RequestParam String nome) {
        return cs.buscarPorNome(nome);
    }

    /**
     * Cria uma nova clínica
     * @param clinica Objeto com dados da clínica
     * @return ResponseEntity com clínica criada e status 201
     */
    @PostMapping
    public Clinica criar(@RequestBody Clinica clinica) {
        return cs.criar(clinica);
    }

    /**
     * Atualiza uma clínica existente
     * @param id ID da clínica a atualizar
     * @param clinica Novos dados da clínica
     * @return ResponseEntity com clínica atualizada ou 404 se não encontrada
     */
    @PutMapping("/{id}")
    public Clinica atualizar(@PathVariable Integer id, @RequestBody Clinica clinica) {
        return cs.atualizar(id, clinica);
    }

    /**
     * Deleta uma clínica
     * @param id ID da clínica a deletar
     * @return ResponseEntity sem conteúdo (204) ou 404 se não encontrada
     */
    @DeleteMapping("/{id}")
    public Clinica deletar(@PathVariable Integer id) {
        if (cs.deletar(id)) {
            return null;
        } else {
            return null;
        }
    }
}
