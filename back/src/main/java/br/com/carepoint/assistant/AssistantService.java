package br.com.carepoint.assistant;

import static br.com.carepoint.assistant.AssistantContracts.*;

import br.com.carepoint.entity.Role;
import br.com.carepoint.service.*;
import java.util.ArrayList;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AssistantService {
  private final CurrentUserService users;
  private final ProfessionalService professionals;
  private final ClinicService clinics;
  private final ServiceRequestService requests;
  private final ConversationService conversations;
  private final AiProvider ai;
  private final AssistantRateLimiter limiter;

  public AssistantService(
      CurrentUserService users,
      ProfessionalService professionals,
      ClinicService clinics,
      ServiceRequestService requests,
      ConversationService conversations,
      AiProvider ai,
      AssistantRateLimiter limiter) {
    this.users = users;
    this.professionals = professionals;
    this.clinics = clinics;
    this.requests = requests;
    this.conversations = conversations;
    this.ai = ai;
    this.limiter = limiter;
  }

  public Reply reply(Authentication auth, MessageInput input) {
    var user = users.requireUser(auth);
    limiter.check(user.getId());
    conversations.verifyOwner(user.getId(), input.conversationId());
    boolean english = "en".equals(input.locale());
    boolean admin = user.getRole() == Role.ADMIN;
    String answer;
    String mode = "GUIDED";
    List<Link> links = new ArrayList<>();
    String task = null;
    switch (input.intent()) {
      case PROFESSIONALS -> {
        var found =
            professionals.list(
                input.search(), null, null, null, null, null, null, "NOME", false, 0, 5);
        answer =
            english
                ? "Professionals matching your search:"
                : "Profissionais encontrados para sua busca:";
        if (found.content().isEmpty())
          answer =
              english
                  ? "No professionals found. Try another search."
                  : "Nenhum profissional encontrado. Tente outra busca.";
        for (var item : found.content()) {
          answer +=
              "\n"
                  + item.nome()
                  + " · "
                  + item.especialidade()
                  + " · R$ "
                  + item.valorAtendimento();
          links.add(
              new Link(
                  item.nome(),
                  admin
                      ? "/admin/profissionais/" + item.id() + "/editar"
                      : "/profissionais/" + item.id()));
        }
      }
      case CLINICS -> {
        var found = clinics.list(input.search(), false, 0, 5);
        answer = english ? "Clinics matching your search:" : "Clínicas encontradas para sua busca:";
        if (found.content().isEmpty())
          answer = english ? "No clinics found." : "Nenhuma clínica encontrada.";
        for (var item : found.content()) {
          answer += "\n" + item.nome() + " · " + item.endereco();
          links.add(
              new Link(
                  item.nome(),
                  admin ? "/admin/clinicas/" + item.id() + "/editar" : "/clinicas/" + item.id()));
        }
      }
      case MY_REQUESTS -> {
        var found = requests.mine(auth, 0, 5);
        answer = english ? "Your latest requests:" : "Suas solicitações mais recentes:";
        if (found.content().isEmpty())
          answer = english ? "You have no requests yet." : "Você ainda não tem solicitações.";
        for (var item : found.content()) {
          answer += "\n#" + item.id() + " · " + item.profissional().nome() + " · " + item.status();
          links.add(new Link("#" + item.id(), "/solicitacoes/" + item.id()));
        }
      }
      default -> {
        var recent =
            input.conversationId() == null
                ? List.<Message>of()
                : conversations.history(user.getId(), input.conversationId(), 0);
        var tools = new AssistantTools(auth, admin, professionals, clinics, requests);
        var generated =
            input.useAi()
                ? ai.converse(
                    input.message(),
                    english ? "English" : "Brazilian Portuguese",
                    user.getRole().name(),
                    recent,
                    tools)
                : java.util.Optional.<String>empty();
        mode = generated.isPresent() ? "AI" : "GUIDED";
        answer =
            generated.orElseGet(
                () ->
                    admin && GuidedHelp.isProfileQuestion(input.message())
                        ? (english
                            ? "Patient profile editing is not available for administrators. Open"
                                  + " administrator settings or contact the person responsible for"
                                  + " account access."
                            : "A edição de perfil de paciente não se aplica ao administrador. Abra"
                                  + " as configurações administrativas ou procure o responsável"
                                  + " pelo acesso à conta.")
                        : GuidedHelp.answer(input.message(), english));
        if (generated.isPresent()) {
          links.addAll(tools.links());
          task = tools.task();
        } else if (!admin && GuidedHelp.isProfileQuestion(input.message())) {
          links.add(new Link(english ? "Edit profile" : "Editar perfil", "/perfil/editar"));
        } else {
          links.add(new Link(english ? "Help center" : "Central de ajuda", "/ajuda"));
        }
      }
    }
    Long id = conversations.append(user.getId(), input.conversationId(), input.message(), answer);
    return new Reply(id, answer, mode, links.stream().distinct().toList(), task);
  }
}
