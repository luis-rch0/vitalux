package com.senai.pi.vitalux.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.senai.pi.vitalux.models.Clinica;
import com.senai.pi.vitalux.repositories.ClinicaRepository;
import java.util.List;
import java.util.Optional;

/**
 * Service responsável pela lógica de negócio de clínicas
 * Realiza operações CRUD e buscas customizadas no banco de dados
 */
@Service
public class ClinicaService {

    @Autowired
    private ClinicaRepository clinicaRepository;

    /**
     * Retorna todas as clínicas cadastradas
     * @return Lista de todas as clínicas
     */
    public List<Clinica> listarTodos() {
        return clinicaRepository.findAll();
    }

    /**
     * Busca uma clínica pelo ID
     * @param id ID da clínica
     * @return Optional contendo a clínica se encontrada
     */
    public Optional<Clinica> buscarPorId(Integer id) {
        return clinicaRepository.findById(id);
    }

    /**
     * Busca uma clínica pelo CNPJ
     * @param cnpj CNPJ da clínica
     * @return Optional contendo a clínica se encontrada
     */
    public Optional<Clinica> buscarPorCnpj(String cnpj) {
        return clinicaRepository.findByCnpj(cnpj);
    }

    /**
     * Busca clínicas pelo nome (busca parcial, case-insensitive)
     * @param nome Parte do nome da clínica
     * @return Lista de clínicas encontradas
     */
    public List<Clinica> buscarPorNome(String nome) {
        return clinicaRepository.findByNomeContainingIgnoreCase(nome);
    }

    /**
     * Cria uma nova clínica
     * @param clinica Objeto clínica a ser salvo
     * @return Clínica criada com ID gerado
     */
    public Clinica criar(Clinica clinica) {
        return clinicaRepository.save(clinica);
    }

    /**
     * Atualiza uma clínica existente
     * @param id ID da clínica a atualizar
     * @param clinica Novos dados da clínica
     * @return Clínica atualizada ou null se não encontrada
     */
    public Clinica atualizar(Integer id, Clinica clinica) {
        if (clinicaRepository.existsById(id)) {
            clinica.setId(id);
            return clinicaRepository.save(clinica);
        }
        return null;
    }

    /**
     * Deleta uma clínica
     * @param id ID da clínica a deletar
     * @return true se deletada, false se não encontrada
     */
    public boolean deletar(Integer id) {
        if (clinicaRepository.existsById(id)) {
            clinicaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Verifica se uma clínica existe
     * @param id ID da clínica
     * @return true se existe, false caso contrário
     */
    public boolean existe(Integer id) {
        return clinicaRepository.existsById(id);
    }
}
