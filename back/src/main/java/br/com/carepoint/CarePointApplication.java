package br.com.carepoint;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class CarePointApplication {

    public static void main(String[] args) {
        SpringApplication.run(CarePointApplication.class, args);
    }
}
