package com.senai.pi.vitalux.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.senai.pi.vitalux.models.Farmacia;
import com.senai.pi.vitalux.repositories.FamarciaRepository;
import java.util.List;
import java.util.Optional;

/**
 * Service responsável pela lógica de negócio de farmácias
 * Realiza operações CRUD e buscas customizadas no banco de dados
 */
@Service
public class FarmaciaService {

    @Autowired
    private FamarciaRepository farmaciaRepository;

    /**
     * Retorna todas as farmácias cadastradas
     * @return Lista de todas as farmácias
     */
    public List<Farmacia> listarTodos() {
        return farmaciaRepository.findAll();
    }

    /**
     * Busca uma farmácia pelo ID
     * @param id ID da farmácia
     * @return Optional contendo a farmácia se encontrada
     */
    public Optional<Farmacia> buscarPorId(Integer id) {
        return farmaciaRepository.findById(id);
    }

    /**
     * Busca uma farmácia pelo CNPJ
     * @param cnpj CNPJ da farmácia
     * @return Optional contendo a farmácia se encontrada
     */
    public Optional<Farmacia> buscarPorCnpj(String cnpj) {
        return farmaciaRepository.findByCnpj(cnpj);
    }

    /**
     * Busca todas as farmácias associadas a um cliente
     * @param clienteId ID do cliente
     * @return Lista de farmácias do cliente
     */
    public List<Farmacia> buscarPorClienteId(Integer clienteId) {
        return farmaciaRepository.findByClienteId(clienteId);
    }

    /**
     * Busca farmácias pelo nome (busca parcial, case-insensitive)
     * @param nome Parte do nome da farmácia
     * @return Lista de farmácias encontradas
     */
    public List<Farmacia> buscarPorNome(String nome) {
        return farmaciaRepository.findByNomeContainingIgnoreCase(nome);
    }

    /**
     * Cria uma nova farmácia
     * @param farmacia Objeto farmácia a ser salvo
     * @return Farmácia criada com ID gerado
     */
    public Farmacia criar(Farmacia farmacia) {
        return farmaciaRepository.save(farmacia);
    }

    /**
     * Atualiza uma farmácia existente
     * @param id ID da farmácia a atualizar
     * @param farmacia Novos dados da farmácia
     * @return Farmácia atualizada ou null se não encontrada
     */
    public Farmacia atualizar(Integer id, Farmacia farmacia) {
        if (farmaciaRepository.existsById(id)) {
            farmacia.setId(id);
            return farmaciaRepository.save(farmacia);
        }
        return null;
    }

    /**
     * Deleta uma farmácia
     * @param id ID da farmácia a deletar
     * @return true se deletada, false se não encontrada
     */
    public boolean deletar(Integer id) {
        if (farmaciaRepository.existsById(id)) {
            farmaciaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Verifica se uma farmácia existe
     * @param id ID da farmácia
     * @return true se existe, false caso contrário
     */
    public boolean existe(Integer id) {
        return farmaciaRepository.existsById(id);
    }
}
