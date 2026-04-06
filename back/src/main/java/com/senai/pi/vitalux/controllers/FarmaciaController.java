package com.senai.pi.vitalux.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.senai.pi.vitalux.models.Farmacia;
import com.senai.pi.vitalux.services.FarmaciaService;
import java.util.List;
import java.util.Optional;

/**
 * Controller responsável pelo gerenciamento de farmácias
 * Fornece endpoints REST para operações CRUD de farmácias
 */
@RestController
@RequestMapping("/api/farmacias")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FarmaciaController {

    @Autowired
    private FarmaciaService farmaciaService;

    /**
     * Retorna uma lista de todas as farmácias
     * @return ResponseEntity com lista de farmácias
     */
    @GetMapping
    public ResponseEntity<List<Farmacia>> listarTodos() {
        List<Farmacia> farmacias = farmaciaService.listarTodos();
        return ResponseEntity.ok(farmacias);
    }

    /**
     * Busca uma farmácia específica pelo ID
     * @param id ID da farmácia
     * @return ResponseEntity com farmácia ou 404 se não encontrada
     */
    @GetMapping("/{id}")
    public ResponseEntity<Farmacia> buscarPorId(@PathVariable Integer id) {
        Optional<Farmacia> farmacia = farmaciaService.buscarPorId(id);
        return farmacia.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Busca uma farmácia pelo CNPJ
     * @param cnpj CNPJ da farmácia
     * @return ResponseEntity com farmácia ou 404 se não encontrada
     */
    @GetMapping("/cnpj/{cnpj}")
    public ResponseEntity<Farmacia> buscarPorCnpj(@PathVariable String cnpj) {
        Optional<Farmacia> farmacia = farmaciaService.buscarPorCnpj(cnpj);
        return farmacia.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Busca todas as farmácias associadas a um cliente
     * @param clienteId ID do cliente
     * @return ResponseEntity com lista de farmácias do cliente
     */
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Farmacia>> buscarPorClienteId(@PathVariable Integer clienteId) {
        List<Farmacia> farmacias = farmaciaService.buscarPorClienteId(clienteId);
        return ResponseEntity.ok(farmacias);
    }

    /**
     * Busca farmácias pelo nome (busca parcial, case-insensitive)
     * @param nome Parte do nome da farmácia
     * @return ResponseEntity com lista de farmácias encontradas
     */
    @GetMapping("/buscar/nome")
    public ResponseEntity<List<Farmacia>> buscarPorNome(@RequestParam String nome) {
        List<Farmacia> farmacias = farmaciaService.buscarPorNome(nome);
        return ResponseEntity.ok(farmacias);
    }

    /**
     * Cria uma nova farmácia
     * @param farmacia Objeto com dados da farmácia
     * @return ResponseEntity com farmácia criada e status 201
     */
    @PostMapping
    public ResponseEntity<Farmacia> criar(@RequestBody Farmacia farmacia) {
        Farmacia novaFarmacia = farmaciaService.criar(farmacia);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaFarmacia);
    }

    /**
     * Atualiza uma farmácia existente
     * @param id ID da farmácia a atualizar
     * @param farmacia Novos dados da farmácia
     * @return ResponseEntity com farmácia atualizada ou 404 se não encontrada
     */
    @PutMapping("/{id}")
    public ResponseEntity<Farmacia> atualizar(@PathVariable Integer id, @RequestBody Farmacia farmacia) {
        Farmacia farmaciaAtualizada = farmaciaService.atualizar(id, farmacia);
        if (farmaciaAtualizada != null) {
            return ResponseEntity.ok(farmaciaAtualizada);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Deleta uma farmácia
     * @param id ID da farmácia a deletar
     * @return ResponseEntity sem conteúdo (204) ou 404 se não encontrada
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        if (farmaciaService.deletar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
