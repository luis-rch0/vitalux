package com.senai.pi.vitalux.config;

import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "API",
        version = "1.0",
        description = "Gabriel Quinelato, Luis Eduardo. Rafael Felipe, Kayke dos Santos"
    )
)
public class Swagger {

}
