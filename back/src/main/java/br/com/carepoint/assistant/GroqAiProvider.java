package br.com.carepoint.assistant;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.*;
import java.time.Duration;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/** Bounded conversational inference; business operations remain server-authorized tools. */
@Component
public class GroqAiProvider implements AiProvider {
  private final String apiKey;
  private final String model;
  private final ObjectMapper mapper;
  private final HttpClient client;

  @Autowired
  public GroqAiProvider(
      @Value("${app.assistant.api-key:}") String apiKey,
      @Value("${app.assistant.model:}") String model,
      ObjectMapper mapper) {
    this(
        apiKey,
        model,
        mapper,
        HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build());
  }

  GroqAiProvider(String apiKey, String model, ObjectMapper mapper, HttpClient client) {
    this.apiKey = apiKey;
    this.model = model;
    this.mapper = mapper;
    this.client = client;
  }

  @Override
  public Optional<String> answer(String question, String locale) {
    return converse(question, locale, "PACIENTE", List.of(), null);
  }

  @Override
  public Optional<String> converse(
      String question,
      String locale,
      String role,
      List<AssistantContracts.Message> history,
      AssistantTools tools) {
    if (apiKey.isBlank() || model.isBlank()) return Optional.empty();
    var messages = new ArrayList<Object>();
    messages.add(Map.of("role", "system", "content", PlatformKnowledge.instructions(locale, role)));
    // Bound both number and size. History is read server-side after checking ownership.
    for (var item : history.subList(Math.max(0, history.size() - 12), history.size())) {
      if (!Set.of("USER", "ASSISTANT").contains(item.role())) continue;
      messages.add(
          Map.of(
              "role",
              item.role().toLowerCase(Locale.ROOT),
              "content",
              item.content().substring(0, Math.min(1500, item.content().length()))));
    }
    messages.add(Map.of("role", "user", "content", question));
    try {
      JsonNode reply = complete(messages, tools, true);
      var calls = reply.path("tool_calls");
      if (calls.isArray() && !calls.isEmpty()) {
        if (tools == null || calls.size() > 3) return Optional.empty();
        var assistantTurn = new LinkedHashMap<String, Object>();
        assistantTurn.put("role", "assistant");
        assistantTurn.put("tool_calls", calls);
        if (reply.path("content").isTextual())
          assistantTurn.put("content", reply.path("content").asText());
        messages.add(assistantTurn);
        for (var call : calls) {
          String result;
          try {
            result =
                tools.execute(
                    call.path("function").path("name").asText(),
                    mapper.readTree(call.path("function").path("arguments").asText()));
          } catch (RuntimeException exception) {
            // Never expose database errors, personal data, tokens or provider bodies.
            result = "The tool could not complete this lookup. No change was made.";
          }
          messages.add(
              Map.of(
                  "role",
                  "tool",
                  "tool_call_id",
                  call.path("id").asText(),
                  "content",
                  result.substring(0, Math.min(6000, result.length()))));
        }
        // Exactly one tool round; no recursive execution or unbounded agent loop.
        reply = complete(messages, tools, false);
      }
      String answer = reply.path("content").asText("").trim();
      return answer.isBlank()
          ? Optional.empty()
          : Optional.of(answer.substring(0, Math.min(answer.length(), 6000)));
    } catch (InterruptedException exception) {
      Thread.currentThread().interrupt();
      return Optional.empty();
    } catch (Exception exception) {
      return Optional.empty();
    }
  }

  private JsonNode complete(List<Object> messages, AssistantTools tools, boolean allowTools)
      throws Exception {
    var body = new LinkedHashMap<String, Object>();
    body.put("model", model);
    body.put("temperature", 0.2);
    body.put("max_tokens", 700);
    body.put("messages", messages);
    if (tools != null) {
      body.put("tools", tools.definitions());
      body.put("tool_choice", allowTools ? "auto" : "none");
      body.put("parallel_tool_calls", false);
    }
    var request =
        HttpRequest.newBuilder(URI.create("https://api.groq.com/openai/v1/chat/completions"))
            .timeout(Duration.ofSeconds(15))
            .header("Authorization", "Bearer " + apiKey)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body)))
            .build();
    var response = client.send(request, HttpResponse.BodyHandlers.ofString());
    if (response.statusCode() != 200 || response.body().length() > 64000)
      throw new IllegalStateException("Provider unavailable or response too large");
    return mapper.readTree(response.body()).path("choices").path(0).path("message");
  }
}
