package br.com.carepoint.service;

import br.com.carepoint.config.SecurityProperties;
import br.com.carepoint.dto.LoginRequest;
import br.com.carepoint.entity.AppUser;
import br.com.carepoint.entity.Role;
import br.com.carepoint.exception.ApiException;
import br.com.carepoint.mapper.CarePointMapper;
import br.com.carepoint.repository.AppUserRepository;
import br.com.carepoint.repository.PatientRepository;
import br.com.carepoint.security.JwtService;
import br.com.carepoint.security.LoginRateLimiter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock private AppUserRepository userRepository;
    @Mock private PatientRepository patientRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private SecurityProperties securityProperties;
    @Mock private LoginRateLimiter rateLimiter;
    @Mock private CarePointMapper mapper;
    @Mock private CurrentUserService currentUserService;

    private AuthService service;

    @BeforeEach
    void setUp() {
        service = new AuthService(userRepository, patientRepository, passwordEncoder, jwtService,
                securityProperties, rateLimiter, mapper, currentUserService);
    }

    @Test
    void rejectsAccountWhenSelectedPortalDoesNotMatchUserRole() {
        AppUser patient = AppUser.builder()
                .nome("Paciente")
                .email("paciente@carepoint.test")
                .passwordHash("hash")
                .role(Role.PACIENTE)
                .ativo(true)
                .build();
        when(userRepository.findByEmailIgnoreCase("paciente@carepoint.test")).thenReturn(Optional.of(patient));
        when(passwordEncoder.matches("senha-segura", "hash")).thenReturn(true);

        ApiException error = assertThrows(ApiException.class, () -> service.login(
                new LoginRequest("paciente@carepoint.test", "senha-segura", Role.ADMIN), "127.0.0.1"));

        assertEquals(HttpStatus.FORBIDDEN, error.getStatus());
        verify(rateLimiter).check("127.0.0.1");
        verify(rateLimiter, never()).reset("127.0.0.1");
        verifyNoInteractions(jwtService);
    }
}
