package br.com.carepoint.assistant;

import static br.com.carepoint.assistant.AssistantContracts.*;

import br.com.carepoint.dto.*;
import br.com.carepoint.entity.RequestStatus;
import br.com.carepoint.exception.*;
import br.com.carepoint.service.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Validator;
import java.time.Instant;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AssistantActionService {
  private final CurrentUserService users;
  private final ServiceRequestService requests;
  private final ProfessionalService professionals;
  private final ActionRepository actions;
  private final ObjectMapper mapper;
  private final Validator validator;
  private final AssistantRateLimiter limiter;

  public AssistantActionService(
      CurrentUserService users,
      ServiceRequestService requests,
      ProfessionalService professionals,
      ActionRepository actions,
      ObjectMapper mapper,
      Validator validator,
      AssistantRateLimiter limiter) {
    this.users = users;
    this.requests = requests;
    this.professionals = professionals;
    this.actions = actions;
    this.mapper = mapper;
    this.validator = validator;
    this.limiter = limiter;
  }

  @Transactional
  public ActionPreview prepare(Authentication auth, PrepareAction input) {
    var patient = users.requirePatient(auth);
    limiter.check(patient.getUser().getId());
    AssistantAction action = new AssistantAction();
    action.setToken(UUID.randomUUID().toString());
    action.setUserId(patient.getUser().getId());
    action.setType(input.type());
    action.setExpiresAt(Instant.now().plusSeconds(600));
    String summary;
    if (input.type() == ActionType.CANCEL_REQUEST) {
      if (input.requestId() == null) throw badRequest("Informe a solicitação.");
      var request = requests.get(auth, input.requestId());
      requireCancellable(request);
      action.setRequestId(request.id());
      summary = "Cancelar solicitação #" + request.id() + " · " + request.profissional().nome();
    } else {
      validateDraft(input.draft());
      var professional = professionals.get(input.draft().profissionalId(), false);
      action.setQuotedValue(professional.valorAtendimento());
      try {
        action.setPayload(mapper.writeValueAsString(input.draft()));
      } catch (JsonProcessingException exception) {
        throw badRequest("Não foi possível preparar a solicitação.");
      }
      summary =
          "Solicitar atendimento com "
              + professional.nome()
              + " · R$ "
              + professional.valorAtendimento()
              + " · "
              + input.draft().dataDesejada()
              + " · "
              + input.draft().enderecoAtendimento()
              + " · "
              + input.draft().servicoSolicitado()
              + " · "
              + input.draft().necessidadesInformadas()
              + ". O pedido ficará PENDENTE de confirmação pela administração.";
    }
    actions.save(action);
    return new ActionPreview(action.getToken(), action.getType(), summary, action.getExpiresAt());
  }

  @Transactional
  public ServiceRequestResponse confirm(Authentication auth, String token) {
    var patient = users.requirePatient(auth);
    var action =
        actions
            .lockOwned(token, patient.getUser().getId())
            .orElseThrow(() -> new ResourceNotFoundException("Ação"));
    // Replays return the original resource, never execute the mutation twice.
    if (action.getExecutedAt() != null) return requests.get(auth, action.getRequestId());
    if (action.getExpiresAt().isBefore(Instant.now())) {
      throw new ApiException(
          HttpStatus.CONFLICT, "A confirmação expirou. Prepare a ação novamente.");
    }
    ServiceRequestResponse result;
    if (action.getType() == ActionType.CANCEL_REQUEST) {
      result = requests.cancel(auth, action.getRequestId());
    } else {
      try {
        var draft = mapper.readValue(action.getPayload(), ServiceRequestCreateRequest.class);
        validateDraft(draft);
        var currentProfessional = professionals.get(draft.profissionalId(), false);
        if (currentProfessional.valorAtendimento().compareTo(action.getQuotedValue()) != 0) {
          throw new ApiException(
              HttpStatus.CONFLICT, "O valor mudou. Revise uma nova proposta antes de confirmar.");
        }
        result = requests.create(auth, draft);
      } catch (JsonProcessingException exception) {
        throw badRequest("Rascunho inválido.");
      }
    }
    action.setRequestId(result.id());
    action.setExecutedAt(Instant.now());
    action.setPayload(null);
    return result;
  }

  private void validateDraft(ServiceRequestCreateRequest draft) {
    if (draft == null || !validator.validate(draft).isEmpty())
      throw badRequest("Revise os dados e a data futura do atendimento.");
  }

  private void requireCancellable(ServiceRequestResponse request) {
    if (request.status() != RequestStatus.PENDENTE && request.status() != RequestStatus.CONFIRMADA)
      throw new ApiException(HttpStatus.CONFLICT, "Esta solicitação não pode mais ser cancelada.");
  }

  private ApiException badRequest(String message) {
    return new ApiException(HttpStatus.BAD_REQUEST, message);
  }
}
