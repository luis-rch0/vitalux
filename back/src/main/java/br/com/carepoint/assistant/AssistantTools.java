package br.com.carepoint.assistant;

import static br.com.carepoint.assistant.AssistantContracts.*;

import br.com.carepoint.service.*;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.*;
import org.springframework.security.core.Authentication;

/** Request-scoped, allowlisted tools. No mutation service is exposed to the model. */
final class AssistantTools {
  private final Authentication auth;
  private final boolean admin;
  private final ProfessionalService professionals;
  private final ClinicService clinics;
  private final ServiceRequestService requests;
  private final List<Link> links = new ArrayList<>();
  private String task;

  AssistantTools(
      Authentication auth,
      boolean admin,
      ProfessionalService professionals,
      ClinicService clinics,
      ServiceRequestService requests) {
    this.auth = auth;
    this.admin = admin;
    this.professionals = professionals;
    this.clinics = clinics;
    this.requests = requests;
  }

  List<Link> links() {
    return List.copyOf(links);
  }

  String task() {
    return task;
  }

  List<Map<String, Object>> definitions() {
    var descriptions = new LinkedHashMap<String, String>();
    descriptions.put(
        "find_professionals",
        "Search real professionals by name or specialty. Optional search string.");
    descriptions.put("find_clinics", "Search real clinics. Optional search string.");
    descriptions.put("open_help", "Offer the platform help-center link.");
    descriptions.put(
        "open_settings", "Offer the settings page appropriate to the authenticated role.");
    if (!admin) {
      descriptions.put(
          "my_requests",
          "Read the current patient's five most recent requests; no user ID accepted.");
      descriptions.put(
          "open_profile", "Offer the patient's own Edit profile page, including password changes.");
      descriptions.put(
          "start_request", "Open the care request form; does not book or submit anything.");
      descriptions.put(
          "start_cancellation", "Open cancellation selection/review; does not cancel anything.");
    }
    return descriptions.entrySet().stream()
        .map(
            entry -> {
              Map<String, Object> properties =
                  entry.getKey().startsWith("find_")
                      ? Map.of("search", Map.of("type", "string", "maxLength", 160))
                      : Map.of();
              return Map.<String, Object>of(
                  "type",
                  "function",
                  "function",
                  Map.of(
                      "name",
                      entry.getKey(),
                      "description",
                      entry.getValue(),
                      "parameters",
                      Map.of(
                          "type",
                          "object",
                          "properties",
                          properties,
                          "additionalProperties",
                          false,
                          "required",
                          List.of())));
            })
        .toList();
  }

  String execute(String name, JsonNode arguments) {
    if (arguments == null || !arguments.isObject()) return "Invalid tool arguments.";
    var names = arguments.fieldNames();
    while (names.hasNext()) {
      String key = names.next();
      if (!name.startsWith("find_") || !key.equals("search")) return "Unsupported argument.";
    }
    String search = null;
    if (arguments.has("search")) {
      if (!arguments.get("search").isTextual() || arguments.get("search").asText().length() > 160)
        return "Invalid search.";
      search = arguments.get("search").asText();
    }
    if (admin
        && Set.of("my_requests", "open_profile", "start_request", "start_cancellation")
            .contains(name)) return "This tool is available only to patients.";
    return switch (name) {
      case "find_professionals" -> {
        var found =
            professionals.list(search, null, null, null, null, null, null, "NOME", false, 0, 5);
        var result = new StringBuilder("First five matching professionals:\n");
        for (var item : found.content()) {
          result
              .append(item.nome())
              .append(" · ")
              .append(item.especialidade())
              .append(" · R$ ")
              .append(item.valorAtendimento())
              .append('\n');
          links.add(
              new Link(
                  item.nome(),
                  admin
                      ? "/admin/profissionais/" + item.id() + "/editar"
                      : "/profissionais/" + item.id()));
        }
        yield found.content().isEmpty() ? "No matching professionals." : result.toString();
      }
      case "find_clinics" -> {
        var found = clinics.list(search, false, 0, 5);
        var result = new StringBuilder("First five matching clinics:\n");
        for (var item : found.content()) {
          result.append(item.nome()).append(" · ").append(item.endereco()).append('\n');
          links.add(
              new Link(
                  item.nome(),
                  admin ? "/admin/clinicas/" + item.id() + "/editar" : "/clinicas/" + item.id()));
        }
        yield found.content().isEmpty() ? "No matching clinics." : result.toString();
      }
      case "my_requests" -> {
        var found = requests.mine(auth, 0, 5);
        var result = new StringBuilder("Current patient's latest five requests:\n");
        for (var item : found.content()) {
          result.append('#').append(item.id()).append(" · ").append(item.status()).append('\n');
          links.add(new Link("#" + item.id(), "/solicitacoes/" + item.id()));
        }
        yield found.content().isEmpty() ? "No requests found." : result.toString();
      }
      case "open_profile" -> navigate("Editar perfil", "/perfil/editar");
      case "open_help" -> navigate("Ajuda / Help", "/ajuda");
      case "open_settings" ->
          navigate("Configurações / Settings", admin ? "/admin/configuracoes" : "/configuracoes");
      case "start_request", "start_cancellation" -> {
        task = name.equals("start_request") ? "CREATE" : "CANCEL";
        yield "The form will be displayed. Nothing has been changed. User review and confirmation"
                  + " are required.";
      }
      default -> "Unknown tool. No action performed.";
    };
  }

  private String navigate(String label, String href) {
    links.add(new Link(label, href));
    return "A navigation link is attached: " + label + ". No data changed.";
  }
}
