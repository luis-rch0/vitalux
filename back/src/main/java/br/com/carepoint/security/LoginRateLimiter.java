package br.com.carepoint.security;

import br.com.carepoint.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LoginRateLimiter {
    private static final int LIMIT = 5;
    private static final long WINDOW_SECONDS = 60;
    private final ConcurrentHashMap<String, Attempt> attempts = new ConcurrentHashMap<>();

    public void check(String key) {
        Attempt attempt = attempts.compute(key, (ignored, current) -> {
            Instant now = Instant.now();
            if (current == null || current.startedAt.plusSeconds(WINDOW_SECONDS).isBefore(now)) {
                return new Attempt(now, 1);
            }
            return new Attempt(current.startedAt, current.count + 1);
        });
        if (attempt.count > LIMIT) {
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "Muitas tentativas. Aguarde um minuto e tente novamente.");
        }
    }

    public void reset(String key) {
        attempts.remove(key);
    }

    private record Attempt(Instant startedAt, int count) { }
}
