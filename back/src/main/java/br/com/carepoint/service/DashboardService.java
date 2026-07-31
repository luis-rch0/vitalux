package br.com.carepoint.service;

import br.com.carepoint.dto.*;
import br.com.carepoint.entity.Patient;
import br.com.carepoint.entity.RequestStatus;
import br.com.carepoint.repository.ClinicRepository;
import br.com.carepoint.repository.PatientRepository;
import br.com.carepoint.repository.ProfessionalRepository;
import br.com.carepoint.repository.ServiceRequestRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardService {
    private final PatientRepository patientRepository;
    private final ProfessionalRepository professionalRepository;
    private final ClinicRepository clinicRepository;
    private final ServiceRequestRepository requestRepository;
    private final CurrentUserService currentUserService;
    private final PatientService patientService;
    private final ProfessionalService professionalService;
    private final ClinicService clinicService;
    private final ServiceRequestService serviceRequestService;

    public DashboardService(PatientRepository patientRepository, ProfessionalRepository professionalRepository,
                            ClinicRepository clinicRepository, ServiceRequestRepository requestRepository,
                            CurrentUserService currentUserService, PatientService patientService,
                            ProfessionalService professionalService, ClinicService clinicService,
                            ServiceRequestService serviceRequestService) {
        this.patientRepository = patientRepository;
        this.professionalRepository = professionalRepository;
        this.clinicRepository = clinicRepository;
        this.requestRepository = requestRepository;
        this.currentUserService = currentUserService;
        this.patientService = patientService;
        this.professionalService = professionalService;
        this.clinicService = clinicService;
        this.serviceRequestService = serviceRequestService;
    }

    @Transactional(readOnly = true)
    public DashboardResponse admin() {
        YearMonth currentMonth = YearMonth.now(ZoneOffset.UTC);
        Instant monthStart = currentMonth.atDay(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant nextMonthStart = currentMonth.plusMonths(1).atDay(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        long confirmed = requestRepository.countByStatus(RequestStatus.CONFIRMADA);
        long completed = requestRepository.countByStatus(RequestStatus.CONCLUIDA);
        return new DashboardResponse(patientRepository.count(), professionalRepository.countByAtivoTrue(),
                clinicRepository.count(), requestRepository.count(), requestRepository.countByStatus(RequestStatus.PENDENTE),
                confirmed, completed, requestRepository.countByStatus(RequestStatus.REJEITADA),
                requestRepository.countByStatus(RequestStatus.CANCELADA), confirmed + completed, completed,
                patientRepository.countByCreatedAtGreaterThanEqualAndCreatedAtLessThan(monthStart, nextMonthStart),
                professionalRepository.countByCreatedAtGreaterThanEqualAndCreatedAtLessThan(monthStart, nextMonthStart),
                clinicRepository.countByCreatedAtGreaterThanEqualAndCreatedAtLessThan(monthStart, nextMonthStart),
                monthlyMetrics(currentMonth),
                serviceRequestService.recentForAdmin());
    }

    private List<MonthlyMetricsResponse> monthlyMetrics(YearMonth currentMonth) {
        List<MonthlyMetricsResponse> metrics = new ArrayList<>();
        for (int offset = 5; offset >= 0; offset--) {
            YearMonth month = currentMonth.minusMonths(offset);
            Instant start = month.atDay(1).atStartOfDay().toInstant(ZoneOffset.UTC);
            Instant end = month.plusMonths(1).atDay(1).atStartOfDay().toInstant(ZoneOffset.UTC);
            metrics.add(new MonthlyMetricsResponse(month.toString(),
                    patientRepository.countByCreatedAtGreaterThanEqualAndCreatedAtLessThan(start, end),
                    professionalRepository.countByCreatedAtGreaterThanEqualAndCreatedAtLessThan(start, end),
                    clinicRepository.countByCreatedAtGreaterThanEqualAndCreatedAtLessThan(start, end),
                    requestRepository.countByCreatedAtGreaterThanEqualAndCreatedAtLessThan(start, end)));
        }
        return List.copyOf(metrics);
    }

    @Transactional(readOnly = true)
    public PatientDashboardResponse patient(Authentication authentication) {
        Patient patient = currentUserService.requirePatient(authentication);
        return new PatientDashboardResponse(patientService.current(authentication),
                professionalService.list(null, null, null, null, null, null, null, "AVALIACAO", false, 0, 6).content(),
                clinicService.list(null, false, 0, 4).content(), serviceRequestService.recentForPatient(patient),
                requestRepository.countByPacienteIdAndStatus(patient.getId(), RequestStatus.PENDENTE));
    }
}
