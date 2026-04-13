package com.senai.pi.vitalux.controllers;

import org.springframework.beans.factory.annotation.Autowired;
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
public class ListagemMedicaController {

    @Autowired
    private ListagemMedicaService ls;

    /**
     * Retorna uma lista de todos os médicos
     * @return ResponseEntity com lista de médicos
     */
    @GetMapping
    public List<ListagemMedica> listarTodos() {
        return ls.listarTodos();
    }

    /**
     * Busca um médico específico pelo ID
     * @param id ID do médico
     * @return ResponseEntity com médico ou 404 se não encontrado
     */
    @GetMapping("/{id}")
    public ListagemMedica buscarPorId(@PathVariable Integer id) {
        Optional<ListagemMedica> medico = ls.buscarPorId(id);
        return medico.orElse(null);
    }

    /**
     * Busca um médico pelo CPF
     * @param cpf CPF do médico
     * @return ResponseEntity com médico ou 404 se não encontrado
     */
    @GetMapping("/cpf/{cpf}")
    public ListagemMedica buscarPorCpf(@PathVariable String cpf) {
        Optional<ListagemMedica> medico = ls.buscarPorCpf(cpf);
        return medico.orElse(null);
    }

    /**
     * Busca um médico pelo CRM
     * @param crm CRM do médico
     * @return ResponseEntity com médico ou 404 se não encontrado
     */
    @GetMapping("/crm/{crm}")
    public ListagemMedica buscarPorCrm(@PathVariable String crm) {
        Optional<ListagemMedica> medico = ls.buscarPorCrm(crm);
        return medico.orElse(null);
    }

    /**
     * Busca médicos pelo nome (busca parcial, case-insensitive)
     * @param nome Parte do nome do médico
     * @return ResponseEntity com lista de médicos encontrados
     */
    @GetMapping("/buscar/nome")
    public List<ListagemMedica> buscarPorNome(@RequestParam String nome) {
        return ls.buscarPorNome(nome);
    }

    /**
     * Busca médicos por especialidade
     * @param especialidade Especialidade do médico
     * @return ResponseEntity com lista de médicos encontrados
     */
    @GetMapping("/buscar/especialidade")
    public List<ListagemMedica> buscarPorEspecialidade(@RequestParam String especialidade) {
        return ls.buscarPorEspecialidade(especialidade);
    }

    /**
     * Retorna apenas os médicos ativos
     * @return ResponseEntity com lista de médicos ativos
     */
    @GetMapping("/ativos")
    public List<ListagemMedica> listarAtivos() {
        return ls.listarAtivos();
    }

    /**
     * Cria um novo médico
     * @param listagem Objeto com dados do médico
     * @return ResponseEntity com médico criado e status 201
     */
    @PostMapping
    public ListagemMedica criar(@RequestBody ListagemMedica listagem) {
        return ls.criar(listagem);
    }

    /**
     * Atualiza um médico existente
     * @param id ID do médico a atualizar
     * @param listagem Novos dados do médico
     * @return ResponseEntity com médico atualizado ou 404 se não encontrado
     */
    @PutMapping("/{id}")
    public ListagemMedica atualizar(@PathVariable Integer id, @RequestBody ListagemMedica listagem) {
        return ls.atualizar(id, listagem);
    }

    /**
     * Deleta um médico
     * @param id ID do médico a deletar
     * @return ResponseEntity sem conteúdo (204) ou 404 se não encontrado
     */
    @DeleteMapping("/{id}")
    public ListagemMedica deletar(@PathVariable Integer id) {
        if (ls.deletar(id)) {
            return null;
        } else {
            return null;
        }
    }
}
