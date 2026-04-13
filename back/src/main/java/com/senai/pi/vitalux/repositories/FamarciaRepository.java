package com.senai.pi.vitalux.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.senai.pi.vitalux.models.Farmacia;
import java.util.Optional;
import java.util.List;

/**
 * Repository para Farmácia
 * Fornece métodos customizados para buscar farmácias no banco de dados
 */
@Repository
public interface FamarciaRepository extends JpaRepository<Farmacia, Integer> {
    
    /**
     * Busca uma farmácia pelo CNPJ
     * @param cnpj CNPJ da farmácia
     * @return Optional contendo a farmácia se encontrada
     */
    Optional<Farmacia> findByCnpj(String cnpj);
    
    /**
     * Busca todas as farmácias associadas a um cliente
     * @param clienteId ID do cliente
     * @return Lista de farmácias do cliente
     */
    List<Farmacia> findByClienteId(Integer clienteId);
    
    /**
     * Busca farmácias pelo nome (busca parcial, case-insensitive)
     * @param nome Parte do nome da farmácia
     * @return Lista de farmácias encontradas
     */
    Farmacia findByNomeContainingIgnoreCase(String nome);
}
