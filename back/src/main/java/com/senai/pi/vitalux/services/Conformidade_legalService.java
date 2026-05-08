package com.senai.pi.vitalux.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.senai.pi.vitalux.models.ConformidadeLegal;
import com.senai.pi.vitalux.repositories.Conformidade_legalRepository;
import java.util.List;
import java.util.Optional;

/**
 * Service responsável pela lógica de negócio de conformidades legais
 * Realiza operações CRUD e buscas customizadas no banco de dados
 */
@Service
public class Conformidade_legalService {

    @Autowired
    private Conformidade_legalRepository conformidadeRepository;

    /**
     * Retorna todas as conformidades legais cadastradas
     * @return Lista de todas as conformidades
     */
    public List<ConformidadeLegal> listarTodos() {
        return conformidadeRepository.findAll();
    }

    /**
     * Busca uma conformidade legal pelo ID
     * @param id ID da conformidade
     * @return Optional contendo a conformidade se encontrada
     */
    public Optional<ConformidadeLegal> buscarPorId(Integer id) {
        return conformidadeRepository.findById(id);
    }

    /**
     * Busca a conformidade legal de uma clínica específica
     * @param clinicaId ID da clínica
     * @return Optional contendo a conformidade se encontrada
     */
    public Optional<ConformidadeLegal> buscarPorClinicaId(Integer clinicaId) {
        return conformidadeRepository.findByClinicaId(clinicaId);
    }

    /**
     * Cria uma nova conformidade legal
     * @param conformidade Objeto conformidade a ser salvo
     * @return Conformidade criada com ID gerado
     */
    public ConformidadeLegal criar(ConformidadeLegal conformidade) {
        return conformidadeRepository.save(conformidade);
    }

    /**
     * Atualiza uma conformidade legal existente
     * @param id ID da conformidade a atualizar
     * @param conformidade Novos dados da conformidade
     * @return Conformidade atualizada ou null se não encontrada
     */
    public ConformidadeLegal atualizar(Integer id, ConformidadeLegal conformidade) {
        if (conformidadeRepository.existsById(id)) {
            conformidade.setId(id);
            return conformidadeRepository.save(conformidade);
        }
        return null;
    }

    /**
     * Deleta uma conformidade legal
     * @param id ID da conformidade a deletar
     * @return true se deletada, false se não encontrada
     */
    public boolean deletar(Integer id) {
        if (conformidadeRepository.existsById(id)) {
            conformidadeRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Verifica se uma conformidade legal existe
     * @param id ID da conformidade
     * @return true se existe, false caso contrário
     */
    public boolean existe(Integer id) {
        return conformidadeRepository.existsById(id);
    }
}
