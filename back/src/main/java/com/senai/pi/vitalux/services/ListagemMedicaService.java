package com.senai.pi.vitalux.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.senai.pi.vitalux.models.ListagemMedica;
import com.senai.pi.vitalux.repositories.ListagemMedicaRepository;
import java.util.List;
import java.util.Optional;

/**
 * Service responsável pela lógica de negócio de médicos (Listagem Médica)
 * Realiza operações CRUD e buscas customizadas no banco de dados
 */
@Service
public class ListagemMedicaService {

    @Autowired
    private ListagemMedicaRepository listagemMedicaRepository;

    /**
     * Retorna todos os médicos cadastrados
     * @return Lista de todos os médicos
     */
    public List<ListagemMedica> listarTodos() {
        return listagemMedicaRepository.findAll();
    }

    /**
     * Busca um médico pelo ID
     * @param id ID do médico
     * @return Optional contendo o médico se encontrado
     */
    public Optional<ListagemMedica> buscarPorId(Integer id) {
        return listagemMedicaRepository.findById(id);
    }

    /**
     * Busca um médico pelo CPF
     * @param cpf CPF do médico
     * @return Optional contendo o médico se encontrado
     */
    public Optional<ListagemMedica> buscarPorCpf(String cpf) {
        return listagemMedicaRepository.findByCpf(cpf);
    }

    /**
     * Busca um médico pelo CRM
     * @param crm CRM do médico
     * @return Optional contendo o médico se encontrado
     */
    public Optional<ListagemMedica> buscarPorCrm(String crm) {
        return listagemMedicaRepository.findByCrm(crm);
    }

    /**
     * Busca médicos pelo nome (busca parcial, case-insensitive)
     * @param nome Parte do nome do médico
     * @return Lista de médicos encontrados
     */
    public List<ListagemMedica> buscarPorNome(String nome) {
        return listagemMedicaRepository.findByNomeContainingIgnoreCase(nome);
    }

    /**
     * Busca médicos por especialidade
     * @param especialidade Especialidade do médico
     * @return Lista de médicos encontrados
     */
    public List<ListagemMedica> buscarPorEspecialidade(String especialidade) {
        return listagemMedicaRepository.findByEspecialidade(especialidade);
    }

    /**
     * Retorna apenas os médicos ativos
     * @return Lista de médicos ativos
     */
    public List<ListagemMedica> listarAtivos() {
        return listagemMedicaRepository.findByAtivoTrue();
    }

    /**
     * Cria um novo médico
     * @param listagem Objeto médico a ser salvo
     * @return Médico criado com ID gerado
     */
    public ListagemMedica criar(ListagemMedica listagem) {
        return listagemMedicaRepository.save(listagem);
    }

    /**
     * Atualiza um médico existente
     * @param id ID do médico a atualizar
     * @param listagem Novos dados do médico
     * @return Médico atualizado ou null se não encontrado
     */
    public ListagemMedica atualizar(Integer id, ListagemMedica listagem) {
        if (listagemMedicaRepository.existsById(id)) {
            Optional<ListagemMedica> existente = listagemMedicaRepository.findById(id);
            if (existente.isPresent()) {
                listagemMedicaRepository.delete(existente.get());
                listagemMedicaRepository.save(listagem);
                return listagem;
            }
        }
        return null;
    }

    /**
     * Deleta um médico
     * @param id ID do médico a deletar
     * @return true se deletado, false se não encontrado
     */
    public boolean deletar(Integer id) {
        if (listagemMedicaRepository.existsById(id)) {
            listagemMedicaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Verifica se um médico existe
     * @param id ID do médico
     * @return true se existe, false caso contrário
     */
    public boolean existe(Integer id) {
        return listagemMedicaRepository.existsById(id);
    }
}
