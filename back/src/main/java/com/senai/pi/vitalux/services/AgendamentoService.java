package com.senai.pi.vitalux.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.senai.pi.vitalux.models.Agendamento;
import com.senai.pi.vitalux.repositories.AgendamentoRepository;
import java.util.List;
import java.util.Optional;


@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository as;


    public List<Agendamento> listarTodos() {
        return as.findAllByOrderByDataHoraDesc();
    }


    public Agendamento buscarPorId(Integer id) {
        return as.findById(id).orElse(null);
    }


    public List<Agendamento> buscarPorClienteId(Integer clienteId) {
        return as.findByClienteId(clienteId);
    }


    public Agendamento criar(Agendamento agendamento) {
        as.save(agendamento);
        return agendamento;
    }


    public Agendamento atualizar(Integer id, Agendamento agendamento) {
        if (as.existsById(id)) {
            agendamento.setId(id);
            return as.save(agendamento);
        }
        return null;
    }


    public List<Agendamento> deletar(Integer id) {
        if (as.existsById(id)) {
            as.deleteById(id);
            return listarTodos();
        }
        return null;
    }


    public Optional<Agendamento> existe(Integer id) {
        if (as.existsById(id)) {
            return as.findById(id);
        }
        return Optional.empty();
    }
}
