package br.com.carepoint.assistant;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cp_assistant_actions")
@Getter
@Setter
@NoArgsConstructor
public class AssistantAction {
  @Id
  @Column(length = 36)
  private String token;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 30)
  private AssistantContracts.ActionType type;

  @Column(name = "request_id")
  private Long requestId;

  @Column(columnDefinition = "text")
  private String payload;

  @Column(name = "quoted_value", precision = 12, scale = 2)
  private java.math.BigDecimal quotedValue;

  @Column(name = "expires_at", nullable = false)
  private Instant expiresAt;

  @Column(name = "executed_at")
  private Instant executedAt;
}
