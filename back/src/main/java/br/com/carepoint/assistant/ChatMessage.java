package br.com.carepoint.assistant;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cp_chat_messages")
@Getter
@NoArgsConstructor
public class ChatMessage {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "conversation_id", nullable = false)
  private Long conversationId;

  @Column(nullable = false, length = 12)
  private String role;

  @Column(name = "conteudo", nullable = false, columnDefinition = "text")
  private String content;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  public ChatMessage(Long conversationId, String role, String content) {
    this.conversationId = conversationId;
    this.role = role;
    this.content = content;
    this.createdAt = Instant.now();
  }
}
