package com.senai.pi.vitalux.controllers;

import org.springframework.beans.factory.annotation.Autowired;
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
public class FarmaciaController {

    @Autowired
    private FarmaciaService fs;

    /**
     * Retorna uma lista de todas as farmácias
     * @return ResponseEntity com lista de farmácias
     */
    @GetMapping
    public List<Farmacia> listarTodos() {
        return fs.listarTodos();
    }

    /**
     * Busca uma farmácia específica pelo ID
     * @param id ID da farmácia
     * @return ResponseEntity com farmácia ou 404 se não encontrada
     */
    @GetMapping("/{id}")
    public Farmacia buscarPorId(@PathVariable Integer id) {
        Optional<Farmacia> farmacia = fs.buscarPorId(id);
        return farmacia.orElse(null);
    }

    /**
     * Busca uma farmácia pelo CNPJ
     * @param cnpj CNPJ da farmácia
     * @return ResponseEntity com farmácia ou 404 se não encontrada
     */
    @GetMapping("/cnpj/{cnpj}")
    public Farmacia buscarPorCnpj(@PathVariable String cnpj) {
        Optional<Farmacia> farmacia = fs.buscarPorCnpj(cnpj);
        return farmacia.orElse(null);
    }

    /**
     * Busca todas as farmácias associadas a um cliente
     * @param clienteId ID do cliente
     * @return ResponseEntity com lista de farmácias do cliente
     */
    @GetMapping("/cliente/{clienteId}")
    public List<Farmacia> buscarPorClienteId(@PathVariable Integer clienteId) {
        return fs.buscarPorClienteId(clienteId);
    }

    /**
     * Busca farmácias pelo nome (busca parcial, case-insensitive)
     * @param nome Parte do nome da farmácia
     * @return ResponseEntity com lista de farmácias encontradas
     */
    @GetMapping("/buscar/nome")
    public Farmacia buscarPorNome(@RequestParam String nome) {
        return fs.buscarPorNome(nome).orElse(null);
    }

    /**
     * Cria uma nova farmácia
     * @param farmacia Objeto com dados da farmácia
     * @return ResponseEntity com farmácia criada e status 201
     */
    @PostMapping
    public Farmacia criar(@RequestBody Farmacia farmacia) {
        return fs.criar(farmacia);
    }

    /**
     * Atualiza uma farmácia existente
     * @param id ID da farmácia a atualizar
     * @param farmacia Novos dados da farmácia
     * @return ResponseEntity com farmácia atualizada ou 404 se não encontrada
     */
    @PutMapping("/{id}")
    public Farmacia atualizar(@PathVariable Integer id, @RequestBody Farmacia farmacia) {
        return fs.atualizar(id, farmacia);
    }

    /**
     * Deleta uma farmácia
     * @param id ID da farmácia a deletar
     * @return ResponseEntity sem conteúdo (204) ou 404 se não encontrada
     */
    @DeleteMapping("/{id}")
    public Farmacia deletar(@PathVariable Integer id) {
        if (fs.deletar(id)) {
            return null;
        } else {
            return null;
        }
    }
}
