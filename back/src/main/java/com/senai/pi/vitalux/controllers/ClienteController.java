package com.senai.pi.vitalux.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.senai.pi.vitalux.models.Cliente;
import com.senai.pi.vitalux.services.ClienteService;

import jakarta.validation.Valid;

/**
 * Controller responsável pelo gerenciamento de clientes
 * Fornece endpoints REST para operações CRUD de clientes
 */
@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    /**
     * Retorna uma lista de todos os clientes
     * 
     * @return ResponseEntity com lista de clientes
     */
    @GetMapping
    public ResponseEntity<List<Cliente>> listarTodos() {
        List<Cliente> clientes = clienteService.listarTodos();
        return ResponseEntity.ok(clientes);
    }

    /**
     * Busca um cliente específico pelo ID
     * 
     * @param id ID do cliente
     * @return ResponseEntity com cliente ou 404 se não encontrado
     */
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarPorId(@PathVariable Integer id) {
        Optional<Cliente> cliente = clienteService.buscarPorId(id);
        return cliente.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Busca um cliente pelo CPF
     * 
     * @param cpf CPF do cliente
     * @return ResponseEntity com cliente ou 404 se não encontrado
     */
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Cliente> buscarPorCpf(@PathVariable String cpf) {
        Optional<Cliente> cliente = clienteService.buscarPorCpf(cpf);
        return cliente.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Busca um cliente pelo email
     * 
     * @param email Email do cliente
     * @return ResponseEntity com cliente ou 404 se não encontrado
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<Cliente> buscarPorEmail(@PathVariable String email) {
        Optional<Cliente> cliente = clienteService.buscarPorEmail(email);
        return cliente.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Busca clientes pelo nome (busca parcial, case-insensitive)
     * 
     * @param nome Parte do nome do cliente
     * @return ResponseEntity com lista de clientes encontrados
     */
    @GetMapping("/buscar/nome")
    public ResponseEntity<List<Cliente>> buscarPorNome(@RequestParam String nome) {
        List<Cliente> clientes = clienteService.buscarPorNome(nome);
        return ResponseEntity.ok(clientes);
    }

    /**
     * Cria um novo cliente
     * 
     * @param cliente Objeto com dados do cliente
     * @return ResponseEntity com cliente criado e status 201
     */
    @PostMapping
    public ResponseEntity<Cliente> criar(@Valid @RequestBody Cliente cliente) {
        Cliente novoCliente = clienteService.criar(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoCliente);
    }

    /**
     * Atualiza um cliente existente
     * 
     * @param id      ID do cliente a atualizar
     * @param cliente Novos dados do cliente
     * @return ResponseEntity com cliente atualizado ou 404 se não encontrado
     */
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> atualizar(@PathVariable Integer id, @RequestBody Cliente cliente) {
        Cliente clienteAtualizado = clienteService.atualizar(id, cliente);
        if (clienteAtualizado != null) {
            return ResponseEntity.ok(clienteAtualizado);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Deleta um cliente
     * 
     * @param id ID do cliente a deletar
     * @return ResponseEntity sem conteúdo (204) ou 404 se não encontrado
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        if (clienteService.deletar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
