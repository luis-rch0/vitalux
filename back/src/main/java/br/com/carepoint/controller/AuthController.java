package br.com.carepoint.controller;

import br.com.carepoint.dto.AuthUserResponse;
import br.com.carepoint.dto.LoginRequest;
import br.com.carepoint.dto.RegisterPatientRequest;
import br.com.carepoint.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticação")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) { this.authService = authService; }

    @PostMapping("/cadastro")
    @Operation(summary = "Cadastra uma conta de paciente")
    public ResponseEntity<AuthUserResponse> register(@Valid @RequestBody RegisterPatientRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Autentica e define cookies HTTP-only de sessão")
    public ResponseEntity<AuthUserResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String key = httpRequest.getRemoteAddr() + ":" + request.email().trim().toLowerCase();
        AuthService.AuthenticatedSession session = authService.login(request, key);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, session.accessCookie().toString())
                .header(HttpHeaders.SET_COOKIE, session.refreshCookie().toString()).body(session.user());
    }

    @PostMapping("/refresh")
    @Operation(summary = "Renova a sessão usando o refresh token HTTP-only")
    public ResponseEntity<AuthUserResponse> refresh(@CookieValue(name = "carepoint_refresh", required = false) String refreshToken) {
        AuthService.AuthenticatedSession session = authService.refresh(refreshToken);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, session.accessCookie().toString())
                .header(HttpHeaders.SET_COOKIE, session.refreshCookie().toString()).body(session.user());
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoga o refresh token e limpa os cookies")
    public ResponseEntity<Void> logout(Authentication authentication) {
        authService.logout(authentication);
        return ResponseEntity.noContent().header(HttpHeaders.SET_COOKIE, authService.expiredAccessCookie().toString())
                .header(HttpHeaders.SET_COOKIE, authService.expiredRefreshCookie().toString()).build();
    }

    @GetMapping("/me")
    @Operation(summary = "Retorna o usuário autenticado")
    public AuthUserResponse me(Authentication authentication) { return authService.me(authentication); }
}
