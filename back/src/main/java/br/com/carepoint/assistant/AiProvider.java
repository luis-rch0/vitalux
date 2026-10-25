package br.com.carepoint.assistant;

import java.util.List;
import java.util.Optional;

public interface AiProvider {
  Optional<String> answer(String question, String locale);

  default Optional<String> converse(
      String question,
      String locale,
      String role,
      List<AssistantContracts.Message> history,
      AssistantTools tools) {
    return answer(question, locale);
  }
}
