package br.com.carepoint.assistant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import br.com.carepoint.entity.*;
import br.com.carepoint.service.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.http.*;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.Flow;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

class ConversationalAgentTest {
  private final ObjectMapper mapper = new ObjectMapper();
  private final ProfessionalService professionals = mock(ProfessionalService.class);
  private final ClinicService clinics = mock(ClinicService.class);
  private final ServiceRequestService requests = mock(ServiceRequestService.class);
  private final UsernamePasswordAuthenticationToken auth =
      new UsernamePasswordAuthenticationToken("patient@example.test", null);

  private AssistantTools tools(boolean admin) {
    return new AssistantTools(auth, admin, professionals, clinics, requests);
  }

  @Test
  void greetingAndPasswordFollowUpAreUsefulWithoutProvider() {
    assertTrue(GuidedHelp.answer("Olá, tudo bem?", false).startsWith("Olá!"));
    assertTrue(GuidedHelp.answer("quero alterar minha senha", false).contains("Salvar mudanças"));
    assertFalse(GuidedHelp.answer("quero alterar minha senha", false).contains("Qual desses"));
    assertTrue(GuidedHelp.answer("obrigado!", false).contains("Por nada"));
  }

  @Test
  void toolsCannotWriteOrAcceptAnotherUserId() throws Exception {
    var tools = tools(false);
    assertEquals(
        "Unsupported argument.", tools.execute("my_requests", mapper.readTree("{\"userId\":9}")));
    assertEquals(
        "Unknown tool. No action performed.",
        tools.execute("delete_all_patients", mapper.readTree("{}")));
    tools.execute("start_cancellation", mapper.readTree("{}"));
    assertEquals("CANCEL", tools.task());
    verifyNoInteractions(requests, professionals, clinics);
  }

  @Test
  void administratorCannotUsePatientTools() throws Exception {
    var tools = tools(true);
    assertTrue(tools.execute("my_requests", mapper.readTree("{}")).contains("only to patients"));
    assertTrue(tools.execute("start_request", mapper.readTree("{}")).contains("only to patients"));
    assertNull(tools.task());
    verifyNoInteractions(requests);
  }

  @Test
  void profileLinkComesFromAllowlist() throws Exception {
    var tools = tools(false);
    tools.execute("open_profile", mapper.readTree("{}"));
    assertEquals("/perfil/editar", tools.links().getFirst().href());
    verifyNoInteractions(requests);
  }

  @SuppressWarnings("unchecked")
  @Test
  void providerUsesHistoryAndReturnsToolResultsBeforeFinalAnswer() throws Exception {
    var client = mock(HttpClient.class);
    HttpResponse<String> first = mock(HttpResponse.class), second = mock(HttpResponse.class);
    when(first.statusCode()).thenReturn(200);
    when(second.statusCode()).thenReturn(200);
    when(first.body())
        .thenReturn(
            """
            {"choices":[{"message":{"role":"assistant","content":null,"tool_calls":[
              {"id":"call_1","type":"function","function":{"name":"open_profile","arguments":"{}"}}
            ]}}]}
            """);
    when(second.body())
        .thenReturn(
            "{\"choices\":[{\"message\":{\"content\":\"Use Nova senha e Salvar mudanças.\"}}]}");
    when(client.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
        .thenReturn(first, second);
    var history =
        List.of(new AssistantContracts.Message(1L, "USER", "Preciso editar meu perfil", null));
    var tools = tools(false);
    var provider = new GroqAiProvider("test-key", "test-model", mapper, client);
    var result = provider.converse("A senha", "Portuguese", "PACIENTE", history, tools);
    assertTrue(result.orElseThrow().contains("Nova senha"));
    assertEquals("/perfil/editar", tools.links().getFirst().href());
    var capture = ArgumentCaptor.forClass(HttpRequest.class);
    verify(client, times(2)).send(capture.capture(), any(HttpResponse.BodyHandler.class));
    var firstBody = mapper.readTree(body(capture.getAllValues().getFirst()));
    assertEquals(
        "Preciso editar meu perfil", firstBody.path("messages").get(1).path("content").asText());
    var secondBody = mapper.readTree(body(capture.getAllValues().getLast()));
    assertEquals("none", secondBody.path("tool_choice").asText());
    assertEquals("call_1", secondBody.path("messages").get(4).path("tool_call_id").asText());
  }

  @Test
  void historyIsOwnerScopedAndExternalInferenceRequiresConsent() {
    var users = mock(CurrentUserService.class);
    var conversations = mock(ConversationService.class);
    var ai = mock(AiProvider.class);
    when(users.requireUser(auth)).thenReturn(AppUser.builder().id(10L).role(Role.PACIENTE).build());
    when(conversations.history(10L, 7L, 0)).thenReturn(List.of());
    var service =
        new AssistantService(
            users, professionals, clinics, requests, conversations, ai, new AssistantRateLimiter());
    var result =
        service.reply(
            auth,
            new AssistantContracts.MessageInput(
                7L,
                "quero alterar minha senha",
                AssistantContracts.Intent.HELP,
                null,
                "pt-BR",
                false));
    verify(conversations).verifyOwner(10L, 7L);
    verify(conversations).history(10L, 7L, 0);
    assertEquals("GUIDED", result.mode());
    assertEquals("/perfil/editar", result.links().getFirst().href());
    verifyNoInteractions(ai, requests);
  }

  private String body(HttpRequest request) {
    var bytes = new java.io.ByteArrayOutputStream();
    request
        .bodyPublisher()
        .orElseThrow()
        .subscribe(
            new Flow.Subscriber<ByteBuffer>() {
              public void onSubscribe(Flow.Subscription subscription) {
                subscription.request(Long.MAX_VALUE);
              }

              public void onNext(ByteBuffer buffer) {
                byte[] chunk = new byte[buffer.remaining()];
                buffer.get(chunk);
                bytes.writeBytes(chunk);
              }

              public void onError(Throwable error) {
                throw new AssertionError(error);
              }

              public void onComplete() {}
            });
    return bytes.toString(StandardCharsets.UTF_8);
  }
}
