package br.com.carepoint.security;

import br.com.carepoint.config.SecurityProperties;
import br.com.carepoint.entity.AppUser;
import br.com.carepoint.entity.Role;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {
    @Test
    void createsAndValidatesAccessTokensWithoutAcceptingThemAsRefreshTokens() {
        SecurityProperties properties = new SecurityProperties();
        properties.setJwtSecret("segredo-de-teste-com-mais-de-trinta-e-dois-caracteres");
        JwtService service = new JwtService(properties);
        service.initialize();
        AppUser user = AppUser.builder().email("ana@carepoint.com").role(Role.PACIENTE).build();

        String access = service.createAccessToken(user);

        assertTrue(service.parseAccessToken(access).isPresent());
        assertEquals("ana@carepoint.com", service.parseAccessToken(access).orElseThrow().email());
        assertTrue(service.parseRefreshToken(access).isEmpty());
    }
}
