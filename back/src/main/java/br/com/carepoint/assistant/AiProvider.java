package br.com.carepoint.assistant;

import java.util.Optional;

public interface AiProvider {
  Optional<String> answer(String question, String locale);
}
