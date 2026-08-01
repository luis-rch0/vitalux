package br.com.carepoint.config;

import br.com.carepoint.entity.AppUser;
import br.com.carepoint.entity.Role;
import br.com.carepoint.repository.AppUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);
    private final AdminProperties properties;
    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(AdminProperties properties, AppUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.properties = properties;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmailIgnoreCase(properties.getInitialEmail())) return;
        if (properties.getInitialPassword() == null || properties.getInitialPassword().isBlank()) {
            log.warn("Administrador inicial não criado: ADMIN_INITIAL_PASSWORD não foi configurada.");
            return;
        }
        userRepository.save(AppUser.builder().nome(properties.getInitialName()).email(properties.getInitialEmail().toLowerCase())
                .passwordHash(passwordEncoder.encode(properties.getInitialPassword())).role(Role.ADMIN).ativo(true).build());
        log.info("Administrador inicial do CarePoint criado.");
    }
}
