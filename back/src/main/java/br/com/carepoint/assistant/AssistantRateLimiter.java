package br.com.carepoint.assistant;

import br.com.carepoint.exception.ApiException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class AssistantRateLimiter {
  private record Window(Instant start, int count) {}

  private final Map<Long, Window> windows = new HashMap<>();

  public synchronized void check(Long userId) {
    Instant now = Instant.now();
    windows.entrySet().removeIf(e -> e.getValue().start().plusSeconds(60).isBefore(now));
    Window current = windows.get(userId);
    if ((current != null && current.count() >= 15)
        || (current == null && windows.size() >= 10000)) {
      throw new ApiException(
          HttpStatus.TOO_MANY_REQUESTS, "Aguarde um minuto antes de tentar novamente.");
    }
    windows.put(
        userId,
        current == null ? new Window(now, 1) : new Window(current.start(), current.count() + 1));
  }
}
