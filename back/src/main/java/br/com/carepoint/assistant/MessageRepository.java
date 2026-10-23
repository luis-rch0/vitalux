package br.com.carepoint.assistant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<ChatMessage, Long> {
  Page<ChatMessage> findByConversationIdOrderByIdDesc(Long conversationId, Pageable pageable);
}
