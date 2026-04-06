package com.senai.pi.vitalux.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.senai.pi.vitalux.models.ListagemMedica;
import com.senai.pi.vitalux.services.ListagemMedicaService;
import java.util.List;
import java.util.Optional;

/**
 * Controller responsável pelo gerenciamento de médicos (Listagem Médica)
 * Fornece endpoints REST para operações CRUD de médicos
 */
@RestController
@RequestMapping("/api/medicos")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ListagemMedicaController {

    @Autowired
    private ListagemMedicaService listagemMedicaService;

    /**
     * Retorna uma lista de todos os médicos
     * @return ResponseEntity com lista de médicos
     */
    @GetMapping
    public ResponseEntity<List<ListagemMedica>> listarTodos() {
        List<ListagemMedica> medicos = listagemMedicaService.listarTodos();
        return ResponseEntity.ok(medicos);
    }

    /**
     * Busca um médico específico pelo ID
     * @param id ID do médico
     * @return ResponseEntity com médico ou 404 se não encontrado
     */
    @GetMapping("/{id}")
    public ResponseEntity<ListagemMedica> buscarPorId(@PathVariable Integer id) {
        Optional<ListagemMedica> medico = listagemMedicaService.buscarPorId(id);
        return medico.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Busca um médico pelo CPF
     * @param cpf CPF do médico
     * @return ResponseEntity com médico ou 404 se não encontrado
     */
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<ListagemMedica> buscarPorCpf(@PathVariable String cpf) {
        Optional<ListagemMedica> medico = listagemMedicaService.buscarPorCpf(cpf);
        return medico.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Busca um médico pelo CRM
     * @param crm CRM do médico
     * @return ResponseEntity com médico ou 404 se não encontrado
     */
    @GetMapping("/crm/{crm}")
    public ResponseEntity<ListagemMedica> buscarPorCrm(@PathVariable String crm) {
        Optional<ListagemMedica> medico = listagemMedicaService.buscarPorCrm(crm);
        return medico.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Busca médicos pelo nome (busca parcial, case-insensitive)
     * @param nome Parte do nome do médico
     * @return ResponseEntity com lista de médicos encontrados
     */
    @GetMapping("/buscar/nome")
    public ResponseEntity<List<ListagemMedica>> buscarPorNome(@RequestParam String nome) {
        List<ListagemMedica> medicos = listagemMedicaService.buscarPorNome(nome);
        return ResponseEntity.ok(medicos);
    }

    /**
     * Busca médicos por especialidade
     * @param especialidade Especialidade do médico
     * @return ResponseEntity com lista de médicos encontrados
     */
    @GetMapping("/buscar/especialidade")
    public ResponseEntity<List<ListagemMedica>> buscarPorEspecialidade(@RequestParam String especialidade) {
        List<ListagemMedica> medicos = listagemMedicaService.buscarPorEspecialidade(especialidade);
        return ResponseEntity.ok(medicos);
    }

    /**
     * Retorna apenas os médicos ativos
     * @return ResponseEntity com lista de médicos ativos
     */
    @GetMapping("/ativos")
    public ResponseEntity<List<ListagemMedica>> listarAtivos() {
        List<ListagemMedica> medicos = listagemMedicaService.listarAtivos();
        return ResponseEntity.ok(medicos);
    }

    /**
     * Cria um novo médico
     * @param listagem Objeto com dados do médico
     * @return ResponseEntity com médico criado e status 201
     */
    @PostMapping
    public ResponseEntity<ListagemMedica> criar(@RequestBody ListagemMedica listagem) {
        ListagemMedica novoMedico = listagemMedicaService.criar(listagem);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoMedico);
    }

    /**
     * Atualiza um médico existente
     * @param id ID do médico a atualizar
     * @param listagem Novos dados do médico
     * @return ResponseEntity com médico atualizado ou 404 se não encontrado
     */
    @PutMapping("/{id}")
    public ResponseEntity<ListagemMedica> atualizar(@PathVariable Integer id, @RequestBody ListagemMedica listagem) {
        ListagemMedica medicoAtualizado = listagemMedicaService.atualizar(id, listagem);
        if (medicoAtualizado != null) {
            return ResponseEntity.ok(medicoAtualizado);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Deleta um médico
     * @param id ID do médico a deletar
     * @return ResponseEntity sem conteúdo (204) ou 404 se não encontrado
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        if (listagemMedicaService.deletar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
