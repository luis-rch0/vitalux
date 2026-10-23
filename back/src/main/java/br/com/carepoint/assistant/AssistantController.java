package br.com.carepoint.assistant;

import static br.com.carepoint.assistant.AssistantContracts.*;

import br.com.carepoint.service.CurrentUserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistant")
@PreAuthorize("hasAnyRole('PACIENTE', 'ADMIN')")
public class AssistantController {
  private final AssistantService assistant;
  private final ConversationService conversations;
  private final CurrentUserService users;

  public AssistantController(
      AssistantService assistant, ConversationService conversations, CurrentUserService users) {
    this.assistant = assistant;
    this.conversations = conversations;
    this.users = users;
  }

  @PostMapping("/messages")
  public Reply message(Authentication auth, @Valid @RequestBody MessageInput input) {
    return assistant.reply(auth, input);
  }

  @GetMapping("/conversations")
  public List<Conversation> list(Authentication auth) {
    return conversations.list(users.requireUser(auth).getId());
  }

  @GetMapping("/conversations/{id}/messages")
  public List<Message> history(
      Authentication auth, @PathVariable Long id, @RequestParam(defaultValue = "0") int page) {
    return conversations.history(users.requireUser(auth).getId(), id, page);
  }

  @DeleteMapping("/conversations/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(Authentication auth, @PathVariable Long id) {
    conversations.delete(users.requireUser(auth).getId(), id);
  }
}
