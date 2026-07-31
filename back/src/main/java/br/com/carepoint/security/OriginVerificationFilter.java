package br.com.carepoint.security;

import br.com.carepoint.config.CorsProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class OriginVerificationFilter extends OncePerRequestFilter {
    private final Set<String> allowedOrigins;

    public OriginVerificationFilter(CorsProperties properties) {
        allowedOrigins = Arrays.stream(properties.getAllowedOrigins().split(","))
                .map(String::trim).filter(value -> !value.isBlank()).collect(Collectors.toSet());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String origin = request.getHeader("Origin");
        boolean unsafeMethod = !(HttpMethod.GET.matches(request.getMethod()) || HttpMethod.HEAD.matches(request.getMethod()) || HttpMethod.OPTIONS.matches(request.getMethod()));
        if (unsafeMethod && origin != null && !allowedOrigins.contains(origin)) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Origem não autorizada.");
            return;
        }
        chain.doFilter(request, response);
    }
}
