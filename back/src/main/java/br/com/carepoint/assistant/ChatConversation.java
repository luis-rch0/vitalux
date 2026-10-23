package br.com.carepoint.assistant;

import br.com.carepoint.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cp_chat_conversations")
@Getter
@NoArgsConstructor
public class ChatConversation extends BaseEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "titulo", nullable = false, length = 120)
  private String title;

  public ChatConversation(Long userId, String title) {
    this.userId = userId;
    this.title = title;
  }

  public void touch() {
    onUpdate();
  }
}
