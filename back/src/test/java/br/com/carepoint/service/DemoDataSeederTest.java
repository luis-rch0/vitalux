package br.com.carepoint.service;

import br.com.carepoint.config.DemoDataSeeder;
import br.com.carepoint.entity.Clinic;
import br.com.carepoint.entity.Profissao;
import br.com.carepoint.entity.Professional;
import br.com.carepoint.repository.ClinicRepository;
import br.com.carepoint.repository.ProfessionalRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DemoDataSeederTest {
    @Mock private ClinicRepository clinicRepository;
    @Mock private ProfessionalRepository professionalRepository;

    @Test
    void createsEveryDemoRecordOnlyOnceAndCoversAllProfessions() {
        Map<String, Clinic> clinicsByCnpj = new HashMap<>();
        Set<String> professionalCpfs = new HashSet<>();
        List<Professional> savedProfessionals = new ArrayList<>();

        when(clinicRepository.findByCnpj(any())).thenAnswer(invocation ->
                Optional.ofNullable(clinicsByCnpj.get(invocation.getArgument(0, String.class))));
        when(clinicRepository.save(any(Clinic.class))).thenAnswer(invocation -> {
            Clinic clinic = invocation.getArgument(0, Clinic.class);
            clinicsByCnpj.put(clinic.getCnpj(), clinic);
            return clinic;
        });
        when(professionalRepository.findByCpf(any())).thenAnswer(invocation -> {
            String cpf = invocation.getArgument(0, String.class);
            return professionalCpfs.contains(cpf) ? Optional.of(new Professional()) : Optional.empty();
        });
        when(professionalRepository.save(any(Professional.class))).thenAnswer(invocation -> {
            Professional professional = invocation.getArgument(0, Professional.class);
            professionalCpfs.add(professional.getCpf());
            savedProfessionals.add(professional);
            return professional;
        });

        DemoDataSeeder seeder = new DemoDataSeeder(clinicRepository, professionalRepository);
        seeder.run();
        seeder.run();

        verify(clinicRepository, times(6)).save(any(Clinic.class));
        verify(professionalRepository, times(18)).save(any(Professional.class));
        assertEquals(6, clinicsByCnpj.size());
        assertEquals(18, professionalCpfs.size());
        assertEquals(EnumSet.allOf(Profissao.class), savedProfessionals.stream()
                .map(Professional::getProfissao).collect(java.util.stream.Collectors.toSet()));
        assertTrue(savedProfessionals.stream().anyMatch(professional ->
                professional.getProfissao() == Profissao.FISIOTERAPEUTA
                        && professional.getEspecialidade().equals("Fisioterapeuta")));
    }
}
