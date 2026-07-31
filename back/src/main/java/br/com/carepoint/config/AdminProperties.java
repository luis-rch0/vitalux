package br.com.carepoint.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.admin")
public class AdminProperties {
    private String initialEmail;
    private String initialName;
    private String initialPassword;
}
