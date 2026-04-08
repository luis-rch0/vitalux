package com.senai.pi.vitalux.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.senai.pi.vitalux.models.Cliente;
import com.senai.pi.vitalux.repositories.ClienteRepository;
import java.util.List;
import java.util.Optional;

/**
 * Service responsável pela lógica de negócio de clientes
 * Realiza operações CRUD e buscas customizadas no banco de dados
 */
@Service
public class ClienteService {

    @Autowired
    private ClienteRepository cs;

    /**
     * Retorna todos os clientes cadastrados
     * @return Lista de todos os clientes
     */
    public List<Cliente> listarTodos() {
        return cs.findAll();
    }

    /**
     * Busca um cliente pelo ID
     * @param id ID do cliente
     * @return Optional contendo o cliente se encontrado
     */
    public Optional<Cliente> buscarPorId(Integer id) {
        return cs.findById(id);
    }

    /**
     * Busca um cliente pelo CPF
     * @param cpf CPF do cliente
     * @return Optional contendo o cliente se encontrado
     */
    public Optional<Cliente> buscarPorCpf(String cpf) {
        return cs.findByCpf(cpf);
    }

    /**
     * Busca um cliente pelo email
     * @param email Email do cliente
     * @return Optional contendo o cliente se encontrado
     */
    public Optional<Cliente> buscarPorEmail(String email) {
        return cs.findByEmail(email);
    }

    /**
     * Busca clientes pelo nome (busca parcial, case-insensitive)
     * @param nome Parte do nome do cliente
     * @return Lista de clientes encontrados
     */
    public Optional<Cliente> buscarPorNome(String nome) {
        return cs.findByNomeContainingIgnoreCase(nome);
    }

    /**
     * Cria um novo cliente
     * @param cliente Objeto cliente a ser salvo
     * @return Cliente criado com ID gerado
     */
    public Cliente criar(Cliente cliente) {
        return cs.save(cliente);
    }

    /**
     * Atualiza um cliente existente
     * @param id ID do cliente a atualizar
     * @param cliente Novos dados do cliente
     * @return Cliente atualizado ou null se não encontrado
     */
    public Cliente atualizar(Integer id, Cliente cliente) {
        if (cs.existsById(id)) {
            cliente.setId(id);
            return cs.save(cliente);
        }
        return null;
    }

    /**
     * Deleta um cliente
     * @param id ID do cliente a deletar
     * @return true se deletado, false se não encontrado
     */
    public boolean deletar(Integer id) {
        if (cs.existsById(id)) {
            cs.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Verifica se um cliente existe
     * @param id ID do cliente
     * @return true se existe, false caso contrário
     */
    public boolean existe(Integer id) {
        return cs.existsById(id);
    }
}
