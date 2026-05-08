package com.senai.pi.vitalux.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.senai.pi.vitalux.models.ConformidadeLegal;
import com.senai.pi.vitalux.services.Conformidade_legalService;
import java.util.List;

/**
 * Controller responsável pelo gerenciamento de conformidades legais
 * Fornece endpoints REST para operações CRUD de conformidades legais
 */
@RestController
@RequestMapping("/api/conformidades")
public class Conformidade_legalController {

    @Autowired
    private Conformidade_legalService conformidadeService;


    @GetMapping
    public List<ConformidadeLegal> listarTodos() {
        return conformidadeService.listarTodos();   
    }


    @GetMapping("/{id}")
    public ConformidadeLegal buscarPorId(@PathVariable Integer id) {
        return conformidadeService.buscarPorId(id).orElse(null);
    }


    @GetMapping("/clinica/{clinicaId}")
    public ConformidadeLegal buscarPorClinicaId(@PathVariable Integer clinicaId) {
        return conformidadeService.buscarPorClinicaId(clinicaId).orElse(null);
    }


    @PostMapping
    public ConformidadeLegal criar(@RequestBody ConformidadeLegal conformidade) {
        return conformidadeService.criar(conformidade);
    }


    @PutMapping("/{id}")
    public ConformidadeLegal atualizar(@PathVariable Integer id, @RequestBody ConformidadeLegal conformidade) {
        return conformidadeService.atualizar(id, conformidade);
    }


    @DeleteMapping("/{id}")
    public ConformidadeLegal deletar(@PathVariable Integer id) {
        if (conformidadeService.deletar(id)) {
            return null;
        } else {
            return null;
        }
    }
}
