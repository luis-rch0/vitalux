package com.senai.pi.vitalux.controllers;

import org.springframework.beans.factory.annotation.Autowired;
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
public class ConsultaController {

    @Autowired
    private ConsultaService cs;


    @GetMapping
    public List<Consulta> listarTodos() {
        return cs.listarTodos();
    }


    @GetMapping("/{id}")
    public Consulta buscarPorId(@PathVariable Integer id) {
        Optional<Consulta> consulta = cs.buscarPorId(id);
        return consulta.orElse(null);
    }


    @GetMapping("/cliente/{clienteId}")
    public List<Consulta> buscarPorClienteId(@PathVariable Integer clienteId) {
        return cs.buscarPorClienteId(clienteId);
    }

    @GetMapping("/clinica/{clinicaId}")
    public List<Consulta> buscarPorClinicaId(@PathVariable Integer clinicaId) {
        return cs.buscarPorClinicaId(clinicaId);
    }


    @GetMapping("/agendamento/{agendamentoId}")
    public List<Consulta> buscarPorAgendamentoId(@PathVariable Integer agendamentoId) {
        return cs.buscarPorAgendamentoId(agendamentoId);
    }


    @PostMapping
    public Consulta criar(@RequestBody Consulta consulta) {
        return cs.criar(consulta);
    }


    @PutMapping("/{id}")
    public Consulta atualizar(@PathVariable Integer id, @RequestBody Consulta consulta) {
        return cs.atualizar(id, consulta);
    }

    @DeleteMapping("/{id}")
    public Consulta deletar(@PathVariable Integer id) {
        if (cs.deletar(id)) {
            return null;
        } else {
            return null;
        }
    }
}
