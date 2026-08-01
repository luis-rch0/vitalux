package br.com.carepoint.security;

import br.com.carepoint.config.SecurityProperties;
import br.com.carepoint.entity.AppUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;

@Service
public class JwtService {
    private final SecurityProperties properties;
    private SecretKey key;

    public JwtService(SecurityProperties properties) {
        this.properties = properties;
    }

    @PostConstruct
    void initialize() {
        byte[] secret = properties.getJwtSecret().getBytes(StandardCharsets.UTF_8);
        if (secret.length < 32) {
            throw new IllegalStateException("JWT_SECRET deve possuir ao menos 32 caracteres.");
        }
        key = Keys.hmacShaKeyFor(secret);
    }

    public String createAccessToken(AppUser user) {
        return createToken(user, "access", properties.getAccessExpirationMs());
    }

    public String createRefreshToken(AppUser user) {
        return createToken(user, "refresh", properties.getRefreshExpirationMs());
    }

    public Optional<TokenData> parseAccessToken(String token) {
        return parse(token, "access");
    }

    public Optional<TokenData> parseRefreshToken(String token) {
        return parse(token, "refresh");
    }

    private String createToken(AppUser user, String type, long expirationMs) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("role", user.getRole().name())
                .claim("type", type)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(expirationMs)))
                .signWith(key)
                .compact();
    }

    private Optional<TokenData> parse(String token, String expectedType) {
        try {
            Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
            if (!expectedType.equals(claims.get("type", String.class))) {
                return Optional.empty();
            }
            return Optional.of(new TokenData(claims.getSubject(), claims.get("role", String.class), claims.getExpiration().toInstant()));
        } catch (RuntimeException ignored) {
            return Optional.empty();
        }
    }

    public record TokenData(String email, String role, Instant expiresAt) { }
}
