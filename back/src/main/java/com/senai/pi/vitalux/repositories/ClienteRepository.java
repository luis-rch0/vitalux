package com.senai.pi.vitalux.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.senai.pi.vitalux.models.Cliente;
import java.util.Optional;

/**
 * Repository para Cliente
 * Fornece métodos customizados para buscar clientes no banco de dados
 */
@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    
    /**
     * Busca um cliente pelo CPF
     * @param cpf CPF do cliente
     * @return Optional contendo o cliente se encontrado
     */
    Optional<Cliente> findByCpf(String cpf);
    
    /**
     * Busca um cliente pelo email
     * @param email Email do cliente
     * @return Optional contendo o cliente se encontrado
     */
    Optional<Cliente> findByEmail(String email);
    
    /**
     * Busca clientes pelo nome (busca parcial, case-insensitive)
     * @param nome Parte do nome do cliente
     * @return Lista de clientes encontrados
     */
    Optional<Cliente> findByNomeContainingIgnoreCase(String nome);


}