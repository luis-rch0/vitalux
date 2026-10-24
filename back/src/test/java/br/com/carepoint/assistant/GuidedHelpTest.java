package br.com.carepoint.assistant;

import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

class GuidedHelpTest {
  @Test void explainsProfileChanges() {
    assertTrue(GuidedHelp.answer("Como editar meu perfil?", false).contains("Editar perfil"));
  }
  @Test void normalizesAccentedQuestions() {
    assertTrue(GuidedHelp.answer("avaliação", false).contains("concluído"));
  }
  @Test void doesNotPromiseAnAppointment() {
    assertTrue(GuidedHelp.answer("status", true).contains("does not guarantee availability"));
  }
  @Test void distinguishesGreetingFromUnknownQuestion() {
    assertTrue(GuidedHelp.answer("Olá!", false).startsWith("Olá!"));
    assertTrue(GuidedHelp.answer("anything unknown", true).contains("guided mode"));
  }
}
