import { api } from "@/services/api";
import type { AuthUser } from "@/types/api";

export interface LoginPayload { email: string; senha: string; perfilSelecionado?: "ADMIN" | "PACIENTE"; }
export interface RegisterPayload { nome: string; cpf: string; dataNascimento: string; telefone: string; email: string; senha: string; endereco: string; necessidadesCuidado?: string; familiarResponsavel?: string; }

export const authService = {
  me: () => api<AuthUser>("/auth/me"),
  login: (payload: LoginPayload) => api<AuthUser>("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload: RegisterPayload) => api<AuthUser>("/auth/cadastro", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => api<void>("/auth/logout", { method: "POST" }),
  refresh: () => api<AuthUser>("/auth/refresh", { method: "POST" }),
};
