package br.com.carepoint.config;

import br.com.carepoint.entity.Clinic;
import br.com.carepoint.entity.Profissao;
import br.com.carepoint.entity.Professional;
import br.com.carepoint.repository.ClinicRepository;
import br.com.carepoint.repository.ProfessionalRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Dados exclusivamente demonstrativos. O componente só existe quando
 * APP_SEED_DEMO_DATA=true. Registros de demonstração existentes recebem apenas
 * atualizações de caminhos de imagens locais; dados de negócio não são sobrescritos.
 */
@Component
@ConditionalOnProperty(prefix = "app", name = "seed-demo-data", havingValue = "true")
public class DemoDataSeeder implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);

    private final ClinicRepository clinicRepository;
    private final ProfessionalRepository professionalRepository;

    public DemoDataSeeder(ClinicRepository clinicRepository, ProfessionalRepository professionalRepository) {
        this.clinicRepository = clinicRepository;
        this.professionalRepository = professionalRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        Map<String, Clinic> clinics = new LinkedHashMap<>();
        int createdClinics = 0;
        for (ClinicSeed seed : clinicSeeds()) {
            Clinic clinic = clinicRepository.findByCnpj(seed.cnpj()).orElse(null);
            if (clinic == null) {
                clinic = clinicRepository.save(toClinic(seed));
                createdClinics++;
            }
            clinics.put(seed.key(), clinic);
        }

        int createdProfessionals = 0;
        int updatedProfessionalImages = 0;
        for (ProfessionalSeed seed : professionalSeeds()) {
            Professional existing = professionalRepository.findByCpf(seed.cpf()).orElse(null);
            if (existing != null) {
                if (!seed.photoUrl().equals(existing.getFotoUrl())) {
                    existing.setFotoUrl(seed.photoUrl());
                    updatedProfessionalImages++;
                }
                continue;
            }
            professionalRepository.save(toProfessional(seed, clinics.get(seed.clinicKey())));
            createdProfessionals++;
        }

        log.info("Dados demonstrativos verificados: {} clínica(s) e {} profissional(is) criado(s).",
                createdClinics, createdProfessionals);
        if (updatedProfessionalImages > 0) {
            log.info("Imagens locais atualizadas em {} profissional(is) demonstrativo(s).", updatedProfessionalImages);
        }
    }

    private Clinic toClinic(ClinicSeed seed) {
        return Clinic.builder()
                .nome(seed.name()).cnpj(seed.cnpj()).descricao(seed.description()).endereco(seed.address())
                .telefone(seed.phone()).email(seed.email()).imagemUrl(seed.imageUrl())
                .latitude(seed.latitude()).longitude(seed.longitude()).ativo(true).build();
    }

    private Professional toProfessional(ProfessionalSeed seed, Clinic clinic) {
        return Professional.builder()
                .nome(seed.name()).cpf(seed.cpf()).profissao(seed.profession()).especialidade(seed.specialty())
                .numeroRegistroProfissional(seed.registration()).fotoUrl(seed.photoUrl())
                .valorAtendimento(seed.price()).telefone(seed.phone()).email(seed.email())
                .descricao(seed.description()).clinica(clinic).ativo(true).build();
    }

    private List<ClinicSeed> clinicSeeds() {
        return List.of(
                new ClinicSeed("centro", "Clínica CarePoint Centro", "90000000000001",
                        "Atendimento domiciliar integrado para adultos e idosos, com equipe multiprofissional.",
                        "Av. Paulista, 1000 - Bela Vista, São Paulo - SP", "1130001001", "centro@demo.carepoint.local",
                        "/images/clinica-carepoint.png", decimal("-23.5614140"), decimal("-46.6558810")),
                new ClinicSeed("vida", "Espaço Vida em Casa", "90000000000002",
                        "Cuidado humanizado em reabilitação, enfermagem e acompanhamento nutricional no domicílio.",
                        "Rua Vergueiro, 1800 - Vila Mariana, São Paulo - SP", "1130001002", "vida@demo.carepoint.local",
                        "/images/clinicas/clinica-viver-bem.webp", decimal("-23.5853120"), decimal("-46.6357990")),
                new ClinicSeed("longevidade", "Instituto Longevidade", "90000000000003",
                        "Serviços especializados para envelhecimento saudável, autonomia e apoio aos familiares.",
                        "Rua Cardoso de Almeida, 820 - Perdizes, São Paulo - SP", "1130001003", "longevidade@demo.carepoint.local",
                        "/images/clinica-carepoint.png", decimal("-23.5358560"), decimal("-46.6752040")),
                new ClinicSeed("movimento", "Centro Movimento & Saúde", "90000000000004",
                        "Reabilitação funcional e respiratória com planos de cuidado individualizados.",
                        "Av. Jabaquara, 1500 - Saúde, São Paulo - SP", "1130001004", "movimento@demo.carepoint.local",
                        "/images/clinicas/clinica-horizonte.webp", decimal("-23.6176530"), decimal("-46.6384480")),
                new ClinicSeed("familia", "Clínica Bem-Estar Família", "90000000000005",
                        "Acompanhamento clínico, psicológico e terapêutico para pacientes e seus familiares.",
                        "Rua Tuiuti, 1450 - Tatuapé, São Paulo - SP", "1130001005", "familia@demo.carepoint.local",
                        "/images/clinicas/clinica-viver-bem.webp", decimal("-23.5407430"), decimal("-46.5765750")),
                new ClinicSeed("horizonte", "Núcleo Horizonte Domiciliar", "90000000000006",
                        "Assistência coordenada para recuperação pós-hospitalar e cuidados continuados.",
                        "Av. Corifeu de Azevedo Marques, 900 - Butantã, São Paulo - SP", "1130001006", "horizonte@demo.carepoint.local",
                        "/images/clinicas/clinica-horizonte.webp", decimal("-23.5706150"), decimal("-46.7114910"))
        );
    }

    private List<ProfessionalSeed> professionalSeeds() {
        return List.of(
                professional("Dra. Ana Martins", "90000000001", Profissao.MEDICO, "Cardiologista", "CRM-DEMO-1001", "ana.martins", "320.00", "centro", "Avaliação cardiovascular e acompanhamento de pacientes crônicos no domicílio."),
                professional("Dr. Rafael Nogueira", "90000000002", Profissao.MEDICO, "Geriatra", "CRM-DEMO-1002", "rafael.nogueira", "350.00", "longevidade", "Cuidado integral da pessoa idosa e orientação de familiares e cuidadores."),
                professional("Dra. Luiza Andrade", "90000000003", Profissao.MEDICO, "Clínica geral", "CRM-DEMO-1003", "luiza.andrade", "250.00", "vida", "Consultas clínicas, prevenção e acompanhamento pós-hospitalar."),
                professional("Dr. Caio Ribeiro", "90000000004", Profissao.MEDICO, "Neurologista", "CRM-DEMO-1004", "caio.ribeiro", "390.00", "horizonte", "Acompanhamento neurológico domiciliar para adultos e idosos."),
                professional("Dra. Beatriz Campos", "90000000005", Profissao.MEDICO, "Pediatra", "CRM-DEMO-1005", "beatriz.campos", "310.00", "familia", "Atendimento pediátrico humanizado no conforto da família."),
                professional("Dr. André Lima", "90000000006", Profissao.MEDICO, "Pneumologista", "CRM-DEMO-1006", "andre.lima", "360.00", "movimento", "Avaliação respiratória e suporte em tratamentos domiciliares."),
                professional("Enf. Mariana Costa", "90000000007", Profissao.ENFERMEIRO, "Enfermeiro", "COREN-DEMO-2001", "mariana.costa", "190.00", "centro", "Curativos, administração de medicamentos e planejamento de cuidados."),
                professional("Enf. João Freitas", "90000000008", Profissao.ENFERMEIRO, "Enfermeiro", "COREN-DEMO-2002", "joao.freitas", "180.00", "horizonte", "Assistência pós-operatória e educação do paciente para o autocuidado."),
                professional("Téc. Camila Rocha", "90000000009", Profissao.TECNICO_ENFERMAGEM, "Técnico de enfermagem", "COREN-DEMO-3001", "camila.rocha", "130.00", "vida", "Apoio de enfermagem, sinais vitais e cuidados prescritos no domicílio."),
                professional("Paulo Mendes", "90000000010", Profissao.CUIDADOR, "Cuidador", "CUID-DEMO-4001", "paulo.mendes", "120.00", "longevidade", "Apoio à rotina, mobilidade, alimentação e companhia para pessoas idosas."),
                professional("Fernanda Alves", "90000000011", Profissao.CUIDADOR, "Cuidador", "CUID-DEMO-4002", "fernanda.alves", "115.00", "familia", "Cuidado diário humanizado e suporte organizado aos familiares."),
                professional("Dra. Isabela Souza", "90000000012", Profissao.FISIOTERAPEUTA, "Fisioterapeuta", "CREFITO-DEMO-5001", "isabela.souza", "210.00", "movimento", "Fisioterapia ortopédica e recuperação funcional em atendimento domiciliar."),
                professional("Dr. Felipe Barros", "90000000013", Profissao.FISIOTERAPEUTA, "Fisioterapeuta", "CREFITO-DEMO-5002", "felipe.barros", "225.00", "horizonte", "Fisioterapia respiratória e reabilitação de pacientes pós-hospitalares."),
                professional("Dra. Renata Moraes", "90000000014", Profissao.NUTRICIONISTA, "Nutricionista", "CRN-DEMO-6001", "renata.moraes", "200.00", "vida", "Planos alimentares adaptados à saúde, à rotina e às preferências do paciente."),
                professional("Dra. Júlia Fernandes", "90000000015", Profissao.PSICOLOGO, "Psicólogo", "CRP-DEMO-7001", "julia.fernandes", "190.00", "familia", "Acolhimento psicológico de pacientes e familiares durante o cuidado domiciliar."),
                professional("Dra. Aline Teixeira", "90000000016", Profissao.FONOAUDIOLOGO, "Fonoaudiólogo", "CREFONO-DEMO-8001", "aline.teixeira", "205.00", "longevidade", "Avaliação e reabilitação de fala, voz e deglutição no domicílio."),
                professional("Dr. Bruno Carvalho", "90000000017", Profissao.TERAPEUTA_OCUPACIONAL, "Terapeuta ocupacional", "CREFITO-DEMO-9001", "bruno.carvalho", "215.00", "movimento", "Treino de autonomia e adaptação segura das atividades diárias."),
                professional("Dra. Patrícia Gomes", "90000000018", Profissao.MEDICO, "Dermatologista", "CRM-DEMO-1007", "patricia.gomes", "330.00", "centro", "Avaliação dermatológica e acompanhamento de lesões e condições crônicas.")
        );
    }

    private ProfessionalSeed professional(String name, String cpf, Profissao profession, String specialty,
                                            String registration, String emailSlug, String price, String clinicKey,
                                            String description) {
        return new ProfessionalSeed(name, cpf, profession, specialty, registration,
                professionalImage(profession, specialty), decimal(price), "119" + cpf.substring(3),
                emailSlug + "@demo.carepoint.local", description, clinicKey);
    }

    private String professionalImage(Profissao profession, String specialty) {
        if (profession == Profissao.FISIOTERAPEUTA) return "/images/profissionais/fisioterapeuta.webp";
        if (profession == Profissao.MEDICO) {
            return switch (specialty) {
                case "Cardiologista" -> "/images/profissionais/medico-cardiologista.webp";
                case "Geriatra" -> "/images/profissionais/medica-geriatra.webp";
                case "Neurologista" -> "/images/profissionais/medico-neurologista.webp";
                case "Pediatra" -> "/images/profissionais/medica-pediatra.webp";
                default -> "/images/profissionais/medico-clinico.webp";
            };
        }
        return "/images/fisioterapeuta-carepoint.png";
    }

    private BigDecimal decimal(String value) { return new BigDecimal(value); }

    private record ClinicSeed(String key, String name, String cnpj, String description, String address,
                              String phone, String email, String imageUrl, BigDecimal latitude, BigDecimal longitude) { }

    private record ProfessionalSeed(String name, String cpf, Profissao profession, String specialty,
                                    String registration, String photoUrl, BigDecimal price, String phone,
                                    String email, String description, String clinicKey) { }
}
