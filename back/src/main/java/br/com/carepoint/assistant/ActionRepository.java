package br.com.carepoint.assistant;

import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface ActionRepository extends JpaRepository<AssistantAction, String> {
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select a from AssistantAction a where a.token = :token and a.userId = :userId")
  Optional<AssistantAction> lockOwned(@Param("token") String token, @Param("userId") Long userId);

  @Modifying
  @Query(
      "delete from AssistantAction a where (a.executedAt is null and a.expiresAt < :now) or"
          + " a.executedAt < :cutoff")
  int deleteExpired(@Param("now") java.time.Instant now, @Param("cutoff") java.time.Instant cutoff);
}
