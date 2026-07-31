package br.com.carepoint.service;

import br.com.carepoint.dto.PageResponse;
import br.com.carepoint.dto.PatientResponse;
import br.com.carepoint.dto.PatientUpdateRequest;
import br.com.carepoint.entity.Patient;
import br.com.carepoint.exception.ApiException;
import br.com.carepoint.exception.ResourceNotFoundException;
import br.com.carepoint.mapper.CarePointMapper;
import br.com.carepoint.repository.AppUserRepository;
import br.com.carepoint.repository.PatientRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class PatientService {
    private final PatientRepository patientRepository;
    private final AppUserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final PasswordEncoder passwordEncoder;
    private final CarePointMapper mapper;

    public PatientService(PatientRepository patientRepository, AppUserRepository userRepository, CurrentUserService currentUserService,
                          PasswordEncoder passwordEncoder, CarePointMapper mapper) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
        this.passwordEncoder = passwordEncoder;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public PatientResponse current(Authentication authentication) {
        return mapper.toPatient(currentUserService.requirePatient(authentication));
    }

    @Transactional
    public PatientResponse updateCurrent(Authentication authentication, PatientUpdateRequest request) {
        Patient patient = currentUserService.requirePatient(authentication);
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (!email.equals(patient.getUser().getEmail()) && userRepository.existsByEmailIgnoreCase(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "E-mail já cadastrado.");
        }
        String phone = request.telefone().replaceAll("\\D", "");
        if (phone.length() < 10 || phone.length() > 15) throw new ApiException(HttpStatus.BAD_REQUEST, "Telefone inválido.");
        patient.setNome(request.nome().trim());
        patient.setTelefone(phone);
        patient.setEndereco(request.endereco().trim());
        patient.setNecessidadesCuidado(blankToNull(request.necessidadesCuidado()));
        patient.setFamiliarResponsavel(blankToNull(request.familiarResponsavel()));
        patient.getUser().setNome(patient.getNome());
        patient.getUser().setEmail(email);
        if (request.novaSenha() != null && !request.novaSenha().isBlank()) {
            patient.getUser().setPasswordHash(passwordEncoder.encode(request.novaSenha()));
        }
        return mapper.toPatient(patient);
    }

    @Transactional(readOnly = true)
    public PageResponse<PatientResponse> list(String search, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(size, 1), 100));
        Page<Patient> result = search == null || search.isBlank()
                ? patientRepository.findAll(pageable)
                : patientRepository.findByNomeContainingIgnoreCase(search.trim(), pageable);
        return PageResponse.from(result, mapper::toPatient);
    }

    @Transactional(readOnly = true)
    public PatientResponse getById(Long id) {
        Patient patient = patientRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Paciente"));
        return mapper.toPatient(patient);
    }

    private String blankToNull(String value) { return value == null || value.isBlank() ? null : value.trim(); }
}
