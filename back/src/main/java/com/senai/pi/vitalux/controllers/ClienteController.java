package com.senai.pi.vitalux.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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



@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService cs;

    @GetMapping
    public List<Cliente> listarTodos() {
        return cs.listarTodos();
    }

    @GetMapping("/{id}")
    public Cliente buscarPorId(@PathVariable Integer id) {
        return cs.buscarPorId(id);
    }


    @GetMapping("/cpf/{cpf}")
    public Cliente buscarPorCpf(@PathVariable String cpf) {
        return cs.buscarPorCpf(cpf).orElse(null);
    }

    @GetMapping("/email/{email}")
    public Cliente buscarPorEmail(@PathVariable String email) {
        return cs.buscarPorEmail(email).orElse(null);
    }


    @GetMapping("/buscar/nome")
    public Cliente buscarPorNome(@RequestParam String nome) {
    return cs.buscarPorNome(nome).orElse(null);
    }


    @PostMapping("/criar")
    public Cliente criar(@RequestBody Cliente cliente) {
        return cs.criar(cliente);

    }
     

    @PutMapping("/{id}")
    public Cliente atualizar(@PathVariable Integer id, @RequestBody Cliente cliente) {
        return cs.atualizar(id, cliente);
    }


    @DeleteMapping("/{id}")
    public Cliente deletar(@PathVariable Integer id) {
        if (cs.deletar(id)) {
            return null;
        } else {
            return null;
        }
    }
}
