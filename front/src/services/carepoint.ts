import type {
  CreateServiceRequest,
  UpdatePatient,
  SaveClinic,
  SaveProfessional,
  ReviewRequest,
  SearchFilters,
} from "@/types/requests";
import { api, query } from "@/services/api";
import type {
  AdminProfessionalDetail,
  Clinic,
  Dashboard,
  PageResponse,
  Patient,
  PatientDashboard,
  Professional,
  ServiceRequest,
  RequestStatus,
} from "@/types/api";

export const carepointService = {
  patientDashboard: () => api<PatientDashboard>("/paciente/dashboard"),
  myPatient: () => api<Patient>("/pacientes/me"),
  updatePatient: (payload: UpdatePatient) =>
    api<Patient>("/pacientes/me", { method: "PATCH", body: JSON.stringify(payload) }),
  professionals: (filters: SearchFilters = {}) =>
    api<PageResponse<Professional>>(`/profissionais${query(filters)}`),
  professionalSpecialties: () => api<string[]>("/profissionais/especialidades"),
  professional: (id: string | number) => api<Professional>(`/profissionais/${id}`),
  clinics: (filters: SearchFilters = {}) => api<PageResponse<Clinic>>(`/clinicas${query(filters)}`),
  clinic: (id: string | number) => api<Clinic>(`/clinicas/${id}`),
  myRequests: () => api<PageResponse<ServiceRequest>>("/solicitacoes/minhas"),
  request: (id: string | number) => api<ServiceRequest>(`/solicitacoes/${id}`),
  createRequest: (payload: CreateServiceRequest) =>
    api<ServiceRequest>("/solicitacoes", { method: "POST", body: JSON.stringify(payload) }),
  cancelRequest: (id: number) =>
    api<ServiceRequest>(`/solicitacoes/${id}/cancelar`, { method: "PATCH" }),
  reviewRequest: (id: number, payload: ReviewRequest) =>
    api<void>(`/solicitacoes/${id}/avaliacao`, { method: "POST", body: JSON.stringify(payload) }),
  adminDashboard: () => api<Dashboard>("/admin/dashboard"),
  adminProfessionals: (filters: SearchFilters = {}) =>
    api<PageResponse<Professional>>(`/admin/profissionais${query(filters)}`),
  adminProfessional: (id: string | number) =>
    api<AdminProfessionalDetail>(`/admin/profissionais/${id}`),
  saveProfessional: (payload: SaveProfessional, id?: string | number) =>
    api<Professional>(id ? `/admin/profissionais/${id}` : "/admin/profissionais", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload),
    }),
  setProfessionalStatus: (id: number, ativo: boolean) =>
    api<void>(`/admin/profissionais/${id}/status?ativo=${ativo}`, { method: "PATCH" }),
  adminClinics: (filters: SearchFilters = {}) =>
    api<PageResponse<Clinic>>(`/admin/clinicas${query(filters)}`),
  adminClinic: (id: string | number) => api<Clinic>(`/admin/clinicas/${id}`),
  saveClinic: (payload: SaveClinic, id?: string | number) =>
    api<Clinic>(id ? `/admin/clinicas/${id}` : "/admin/clinicas", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload),
    }),
  setClinicStatus: (id: number, ativo: boolean) =>
    api<void>(`/admin/clinicas/${id}/status?ativo=${ativo}`, { method: "PATCH" }),
  adminPatients: (filters: SearchFilters = {}) =>
    api<PageResponse<Patient>>(`/admin/pacientes${query(filters)}`),
  adminPatient: (id: string | number) => api<Patient>(`/admin/pacientes/${id}`),
  adminRequests: (status?: RequestStatus) =>
    api<PageResponse<ServiceRequest>>(`/admin/solicitacoes${query({ status })}`),
  adminRequest: (id: string | number) => api<ServiceRequest>(`/admin/solicitacoes/${id}`),
  updateRequestStatus: (
    id: number,
    action: "confirmar" | "rejeitar" | "concluir",
    observacao?: string,
  ) =>
    api<ServiceRequest>(`/admin/solicitacoes/${id}/${action}`, {
      method: "PATCH",
      body: observacao ? JSON.stringify({ observacao }) : undefined,
    }),
};
