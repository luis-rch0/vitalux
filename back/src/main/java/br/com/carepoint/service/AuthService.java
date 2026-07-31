package br.com.carepoint.service;

import br.com.carepoint.config.SecurityProperties;
import br.com.carepoint.dto.*;
import br.com.carepoint.entity.*;
import br.com.carepoint.exception.ApiException;
import br.com.carepoint.mapper.CarePointMapper;
import br.com.carepoint.repository.AppUserRepository;
import br.com.carepoint.repository.PatientRepository;
import br.com.carepoint.security.JwtService;
import br.com.carepoint.security.LoginRateLimiter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Locale;

@Service
public class AuthService {
    private final AppUserRepository userRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final SecurityProperties securityProperties;
    private final LoginRateLimiter rateLimiter;
    private final CarePointMapper mapper;
    private final CurrentUserService currentUserService;

    public AuthService(AppUserRepository userRepository, PatientRepository patientRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService, SecurityProperties securityProperties, LoginRateLimiter rateLimiter,
                       CarePointMapper mapper, CurrentUserService currentUserService) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.securityProperties = securityProperties;
        this.rateLimiter = rateLimiter;
        this.mapper = mapper;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public AuthUserResponse register(RegisterPatientRequest request) {
        String email = normalizeEmail(request.email());
        String cpf = digits(request.cpf());
        if (cpf.length() != 11) throw new ApiException(HttpStatus.BAD_REQUEST, "CPF inválido.");
        if (userRepository.existsByEmailIgnoreCase(email)) throw new ApiException(HttpStatus.CONFLICT, "E-mail já cadastrado.");
        if (patientRepository.existsByCpf(cpf)) throw new ApiException(HttpStatus.CONFLICT, "CPF já cadastrado.");

        AppUser user = userRepository.save(AppUser.builder()
                .nome(request.nome().trim()).email(email).passwordHash(passwordEncoder.encode(request.senha()))
                .role(Role.PACIENTE).ativo(true).build());
        Patient patient = patientRepository.save(Patient.builder().user(user).nome(request.nome().trim()).cpf(cpf)
                .dataNascimento(request.dataNascimento()).telefone(normalizePhone(request.telefone()))
                .endereco(request.endereco().trim()).necessidadesCuidado(blankToNull(request.necessidadesCuidado()))
                .familiarResponsavel(blankToNull(request.familiarResponsavel())).ativo(true).build());
        return mapper.toAuthUser(user, patient);
    }

    @Transactional
    public AuthenticatedSession login(LoginRequest request, String rateLimitKey) {
        rateLimiter.check(rateLimitKey);
        AppUser user = userRepository.findByEmailIgnoreCase(normalizeEmail(request.email()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos."));
        if (!user.isAtivo() || !passwordEncoder.matches(request.senha(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos.");
        }
        if (request.perfilSelecionado() != null && request.perfilSelecionado() != user.getRole()) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Esta conta não possui acesso a este portal.");
        }
        rateLimiter.reset(rateLimitKey);
        String refreshToken = jwtService.createRefreshToken(user);
        user.setRefreshTokenHash(hashRefreshToken(refreshToken));
        user.setRefreshTokenExpiresAt(Instant.now().plusMillis(securityProperties.getRefreshExpirationMs()));
        Patient patient = user.getRole() == Role.PACIENTE
                ? patientRepository.findByUserId(user.getId()).orElse(null) : null;
        return new AuthenticatedSession(mapper.toAuthUser(user, patient), accessCookie(jwtService.createAccessToken(user)), refreshCookie(refreshToken));
    }

    @Transactional
    public AuthenticatedSession refresh(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) throw new ApiException(HttpStatus.UNAUTHORIZED, "Sessão expirada.");
        JwtService.TokenData data = jwtService.parseRefreshToken(refreshToken)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Sessão expirada."));
        AppUser user = userRepository.findByEmailIgnoreCase(data.email()).filter(AppUser::isAtivo)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Sessão expirada."));
        if (user.getRefreshTokenHash() == null || user.getRefreshTokenExpiresAt() == null
                || user.getRefreshTokenExpiresAt().isBefore(Instant.now()) || !refreshTokenMatches(refreshToken, user.getRefreshTokenHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Sessão expirada.");
        }
        String newRefresh = jwtService.createRefreshToken(user);
        user.setRefreshTokenHash(hashRefreshToken(newRefresh));
        user.setRefreshTokenExpiresAt(Instant.now().plusMillis(securityProperties.getRefreshExpirationMs()));
        Patient patient = user.getRole() == Role.PACIENTE ? patientRepository.findByUserId(user.getId()).orElse(null) : null;
        return new AuthenticatedSession(mapper.toAuthUser(user, patient), accessCookie(jwtService.createAccessToken(user)), refreshCookie(newRefresh));
    }

    @Transactional(readOnly = true)
    public AuthUserResponse me(Authentication authentication) {
        AppUser user = currentUserService.requireUser(authentication);
        Patient patient = user.getRole() == Role.PACIENTE ? patientRepository.findByUserId(user.getId()).orElse(null) : null;
        return mapper.toAuthUser(user, patient);
    }

    @Transactional
    public void logout(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            try {
                AppUser user = currentUserService.requireUser(authentication);
                user.setRefreshTokenHash(null);
                user.setRefreshTokenExpiresAt(null);
            } catch (ApiException ignored) { }
        }
    }

    public ResponseCookie expiredAccessCookie() { return expiredCookie("carepoint_access"); }
    public ResponseCookie expiredRefreshCookie() { return expiredCookie("carepoint_refresh"); }

    private ResponseCookie accessCookie(String token) {
        return cookie("carepoint_access", token, securityProperties.getAccessExpirationMs());
    }

    private ResponseCookie refreshCookie(String token) {
        return cookie("carepoint_refresh", token, securityProperties.getRefreshExpirationMs());
    }

    private ResponseCookie expiredCookie(String name) { return cookie(name, "", 0); }

    private ResponseCookie cookie(String name, String value, long maxAgeMs) {
        return ResponseCookie.from(name, value).httpOnly(true).secure(securityProperties.isCookieSecure())
                .sameSite(securityProperties.isCookieSecure() ? "None" : "Lax").path("/")
                .maxAge(Duration.ofMillis(maxAgeMs)).build();
    }

    private String normalizeEmail(String value) { return value.trim().toLowerCase(Locale.ROOT); }
    private String normalizePhone(String value) {
        String digits = digits(value);
        if (digits.length() < 10 || digits.length() > 15) throw new ApiException(HttpStatus.BAD_REQUEST, "Telefone inválido.");
        return digits;
    }
    private String digits(String value) { return value == null ? "" : value.replaceAll("\\D", ""); }
    private String blankToNull(String value) { return value == null || value.isBlank() ? null : value.trim(); }

    private String hashRefreshToken(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 indisponível.", ex);
        }
    }

    private boolean refreshTokenMatches(String token, String storedHash) {
        byte[] calculated = hashRefreshToken(token).getBytes(StandardCharsets.US_ASCII);
        byte[] stored = storedHash.getBytes(StandardCharsets.US_ASCII);
        return MessageDigest.isEqual(calculated, stored);
    }

    public record AuthenticatedSession(AuthUserResponse user, ResponseCookie accessCookie, ResponseCookie refreshCookie) { }
}
