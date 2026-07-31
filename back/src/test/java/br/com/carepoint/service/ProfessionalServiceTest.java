package br.com.carepoint.service;

import br.com.carepoint.mapper.CarePointMapper;
import br.com.carepoint.repository.ClinicRepository;
import br.com.carepoint.repository.ProfessionalRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProfessionalServiceTest {
    @Mock private ProfessionalRepository professionalRepository;
    @Mock private ClinicRepository clinicRepository;
    @Mock private CarePointMapper mapper;

    @Test
    void listsActiveSpecialtiesTrimmedSortedAndWithoutCaseInsensitiveDuplicates() {
        when(professionalRepository.findDistinctActiveSpecialties()).thenReturn(Arrays.asList(
                " Psicólogo ", "Fisioterapeuta", "fisioterapeuta", "Cardiologista", "  ", null));
        ProfessionalService service = new ProfessionalService(professionalRepository, clinicRepository, mapper);

        assertEquals(List.of("Cardiologista", "Fisioterapeuta", "Psicólogo"), service.listActiveSpecialties());
    }
}
