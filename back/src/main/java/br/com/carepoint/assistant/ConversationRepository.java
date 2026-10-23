package br.com.carepoint.assistant;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConversationRepository extends JpaRepository<ChatConversation, Long> {
  Optional<ChatConversation> findByIdAndUserId(Long id, Long userId);

  List<ChatConversation> findTop30ByUserIdOrderByUpdatedAtDesc(Long userId);
}
