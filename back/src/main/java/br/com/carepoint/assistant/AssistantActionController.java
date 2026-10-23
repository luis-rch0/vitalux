package br.com.carepoint.assistant;

import static br.com.carepoint.assistant.AssistantContracts.*;

import br.com.carepoint.dto.ServiceRequestResponse;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistant/actions")
@PreAuthorize("hasRole('PACIENTE')")
public class AssistantActionController {
  private final AssistantActionService actions;

  public AssistantActionController(AssistantActionService actions) {
    this.actions = actions;
  }

  @PostMapping
  public ActionPreview prepare(Authentication auth, @Valid @RequestBody PrepareAction input) {
    return actions.prepare(auth, input);
  }

  @PostMapping("/{token}/confirm")
  public ServiceRequestResponse confirm(Authentication auth, @PathVariable String token) {
    return actions.confirm(auth, token);
  }
}
