package br.com.carepoint.config;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "app.security")
public class SecurityProperties {
    @NotBlank(message = "JWT_SECRET é obrigatório")
    private String jwtSecret;
    @Min(60000)
    private long accessExpirationMs = 900000;
    @Min(300000)
    private long refreshExpirationMs = 604800000;
    private boolean cookieSecure;
}
