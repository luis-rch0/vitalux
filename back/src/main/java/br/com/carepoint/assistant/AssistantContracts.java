package br.com.carepoint.assistant;

import br.com.carepoint.dto.ServiceRequestCreateRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.List;

public final class AssistantContracts {
  private AssistantContracts() {}

  public enum Intent {
    HELP,
    PROFESSIONALS,
    CLINICS,
    MY_REQUESTS
  }

  public record MessageInput(
      Long conversationId,
      @NotBlank @Size(max = 2000) String message,
      @NotNull Intent intent,
      @Size(max = 160) String search,
      @Pattern(regexp = "pt-BR|en") String locale,
      boolean useAi) {}

  public record Link(String label, String href) {}

  public record Reply(
      Long conversationId, String answer, String mode, List<Link> links, String task) {}

  public record Conversation(Long id, String title, Instant updatedAt) {}

  public record Message(Long id, String role, String content, Instant createdAt) {}

  public record PrepareAction(
      @NotNull ActionType type, Long requestId, @Valid ServiceRequestCreateRequest draft) {}

  public enum ActionType {
    CREATE_REQUEST,
    CANCEL_REQUEST
  }

  public record ActionPreview(String token, ActionType type, String summary, Instant expiresAt) {}
}
