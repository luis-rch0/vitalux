package com.senai.pi.vitalux.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.senai.pi.vitalux.dtos.AgendamentoRequestDTO;
import com.senai.pi.vitalux.models.Agendamento;
import com.senai.pi.vitalux.services.AgendamentoService;
import java.util.List;



@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    @Autowired
    private AgendamentoService as;


    @GetMapping
    public List<Agendamento> listarTodos() {
        return as.listarTodos();
    }


    @GetMapping("/buscar/{id}")
    public Agendamento buscarPorId(@PathVariable Integer id) {
        return as.buscarPorId(id);
    }


    @GetMapping("/cliente/{clienteId}")
    public List<Agendamento> buscarPorClienteId(@PathVariable Integer clienteId) {
        return as.buscarPorClienteId(clienteId);
    }


    @PostMapping
    public Agendamento criar(@RequestBody AgendamentoRequestDTO agendamento) {
        return as.criar(agendamento);
    }


    @PutMapping("/{id}")
    public Agendamento atualizar(@PathVariable Integer id, @RequestBody Agendamento agendamento) {
        return as.atualizar(id, agendamento);
    }

    @DeleteMapping("/{id}")
    public List<Agendamento> deletar(@PathVariable Integer id) {
        return as.deletar(id);
    }
}
