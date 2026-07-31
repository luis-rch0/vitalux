package br.com.carepoint.service;

import br.com.carepoint.dto.ProfessionalResponse;
import br.com.carepoint.dto.ServiceRequestResponse;
import br.com.carepoint.entity.Patient;
import br.com.carepoint.entity.Professional;
import br.com.carepoint.entity.RequestStatus;
import br.com.carepoint.entity.ServiceRequest;
import br.com.carepoint.exception.ApiException;
import br.com.carepoint.mapper.CarePointMapper;
import br.com.carepoint.repository.ClinicRepository;
import br.com.carepoint.repository.ProfessionalRepository;
import br.com.carepoint.repository.ReviewRepository;
import br.com.carepoint.repository.ServiceRequestRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.lenient;

@ExtendWith(MockitoExtension.class)
class ServiceRequestServiceTest {
    @Mock private ServiceRequestRepository requestRepository;
    @Mock private ReviewRepository reviewRepository;
    @Mock private CurrentUserService currentUserService;
    @Mock private ProfessionalService professionalService;
    @Mock private ClinicRepository clinicRepository;
    @Mock private ProfessionalRepository professionalRepository;
    @Mock private CarePointMapper mapper;

    private ServiceRequestService service;
    private ServiceRequest request;

    @BeforeEach
    void setUp() {
        service = new ServiceRequestService(requestRepository, reviewRepository, currentUserService, professionalService,
                clinicRepository, professionalRepository, mapper);
        Professional professional = Professional.builder().id(10L).nome("Dra. Maria").valorAtendimento(BigDecimal.TEN).build();
        Patient patient = Patient.builder().id(20L).nome("Ana").build();
        request = ServiceRequest.builder().id(30L).paciente(patient).profissional(professional).status(RequestStatus.PENDENTE).build();
        when(requestRepository.findById(30L)).thenReturn(Optional.of(request));
        lenient().when(professionalService.responseMap(any())).thenReturn(Map.of(10L, new ProfessionalResponse(
                10L, "Dra. Maria", null, "", null, null, BigDecimal.TEN, "", "", "", true,
                null, 0, 0, null, null)));
        lenient().when(reviewRepository.requestIdsWithReview(any())).thenReturn(List.of());
        lenient().when(mapper.toServiceRequest(any(), any(), anyBoolean())).thenReturn((ServiceRequestResponse) null);
    }

    @Test
    void confirmsOnlyPendingRequestAndRecordsTimestamp() {
        service.confirm(30L);
        assertEquals(RequestStatus.CONFIRMADA, request.getStatus());
        assertNotNull(request.getConfirmedAt());
    }

    @Test
    void rejectsInvalidConfirmationTransition() {
        request.setStatus(RequestStatus.CANCELADA);
        assertThrows(ApiException.class, () -> service.confirm(30L));
    }

    @Test
    void completesOnlyConfirmedRequest() {
        assertThrows(ApiException.class, () -> service.complete(30L));
        request.setStatus(RequestStatus.CONFIRMADA);
        service.complete(30L);
        assertEquals(RequestStatus.CONCLUIDA, request.getStatus());
        assertNotNull(request.getCompletedAt());
    }
}
