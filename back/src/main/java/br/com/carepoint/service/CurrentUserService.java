package br.com.carepoint.service;

import br.com.carepoint.entity.AppUser;
import br.com.carepoint.entity.Patient;
import br.com.carepoint.entity.Role;
import br.com.carepoint.exception.ApiException;
import br.com.carepoint.exception.ResourceNotFoundException;
import br.com.carepoint.repository.AppUserRepository;
import br.com.carepoint.repository.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CurrentUserService {
    private final AppUserRepository userRepository;
    private final PatientRepository patientRepository;

    public CurrentUserService(AppUserRepository userRepository, PatientRepository patientRepository) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
    }

    @Transactional(readOnly = true)
    public AppUser requireUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof String email)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Autenticação necessária.");
        }
        return userRepository.findByEmailIgnoreCase(email).filter(AppUser::isAtivo)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Conta não está disponível."));
    }

    @Transactional(readOnly = true)
    public Patient requirePatient(Authentication authentication) {
        AppUser user = requireUser(authentication);
        if (user.getRole() != Role.PACIENTE) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Esta ação é exclusiva de pacientes.");
        }
        return patientRepository.findByUserId(user.getId()).orElseThrow(() -> new ResourceNotFoundException("Paciente"));
    }
}
