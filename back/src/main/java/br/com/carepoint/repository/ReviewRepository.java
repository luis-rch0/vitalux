package br.com.carepoint.repository;

import br.com.carepoint.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsBySolicitacaoId(Long solicitacaoId);

    @Query("select avg(r.nota), count(r) from Review r where r.profissional.id = :professionalId")
    Object[] ratingForProfessional(@Param("professionalId") Long professionalId);

    @Query("select r.solicitacao.id from Review r where r.solicitacao.id in :requestIds")
    List<Long> requestIdsWithReview(@Param("requestIds") Collection<Long> requestIds);
}
