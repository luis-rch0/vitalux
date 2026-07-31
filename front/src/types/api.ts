export type Role = "ADMIN" | "PACIENTE" | "PROFISSIONAL";
export type RequestStatus = "PENDENTE" | "CONFIRMADA" | "REJEITADA" | "CANCELADA" | "CONCLUIDA";
export type Profession = "MEDICO" | "ENFERMEIRO" | "TECNICO_ENFERMAGEM" | "CUIDADOR" | "FISIOTERAPEUTA" | "NUTRICIONISTA" | "PSICOLOGO" | "FONOAUDIOLOGO" | "TERAPEUTA_OCUPACIONAL";

export interface AuthUser { id: number; nome: string; email: string; role: Role; pacienteId: number | null; }
export interface Patient { id: number; nome: string; cpf: string; dataNascimento: string; telefone: string; email: string; endereco: string; necessidadesCuidado?: string; familiarResponsavel?: string; ativo: boolean; createdAt: string; updatedAt: string; }
export interface ClinicShort { id: number; nome: string; endereco: string; imagemUrl?: string; }
export interface Clinic extends ClinicShort { cnpj: string; descricao?: string; telefone: string; email: string; latitude?: number; longitude?: number; ativo: boolean; totalProfissionais: number; createdAt: string; updatedAt: string; }
export interface Professional { id: number; nome: string; profissao: Profession; especialidade: string; numeroRegistroProfissional?: string; fotoUrl?: string; valorAtendimento: number; telefone: string; email: string; descricao?: string; ativo: boolean; clinica?: ClinicShort; mediaAvaliacoes: number; quantidadeAvaliacoes: number; createdAt: string; updatedAt: string; }
export interface AdminProfessionalDetail { profissional: Professional; cpf: string; }
export interface ServiceRequest { id: number; pacienteId: number; pacienteNome: string; profissional: Professional; clinica?: ClinicShort; servicoSolicitado: string; necessidadesInformadas: string; dataDesejada: string; enderecoAtendimento: string; valor: number; status: RequestStatus; observacaoAdministrador?: string; createdAt: string; updatedAt: string; confirmedAt?: string; rejectedAt?: string; cancelledAt?: string; completedAt?: string; podeAvaliar: boolean; }
export interface PageResponse<T> { content: T[]; page: number; size: number; totalElements: number; totalPages: number; first: boolean; last: boolean; }
export interface MonthlyMetrics { mes: string; pacientes: number; profissionais: number; clinicas: number; solicitacoes: number; }
export interface Dashboard { totalPacientes: number; totalProfissionais: number; totalClinicas: number; totalSolicitacoes: number; solicitacoesPendentes: number; solicitacoesConfirmadas: number; solicitacoesConcluidas: number; solicitacoesRejeitadas: number; solicitacoesCanceladas: number; agendamentosRealizados: number; consultasRealizadas: number; novosPacientesNoMes: number; novosProfissionaisNoMes: number; novasClinicasNoMes: number; cadastrosPorMes: MonthlyMetrics[]; solicitacoesRecentes: ServiceRequest[]; }
export interface PatientDashboard { paciente: Patient; profissionaisRecomendados: Professional[]; clinicasDisponiveis: Clinic[]; solicitacoesRecentes: ServiceRequest[]; solicitacoesPendentes: number; }

export interface ApiErrorBody { message?: string; fieldErrors?: Record<string, string>; }
