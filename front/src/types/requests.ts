import type { Profession } from "./api";

export interface CreateServiceRequest {
  profissionalId: number;
  clinicaId?: number | null;
  servicoSolicitado: string;
  necessidadesInformadas: string;
  dataDesejada: string;
  enderecoAtendimento: string;
}
export interface UpdatePatient {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  necessidadesCuidado?: string;
  familiarResponsavel?: string;
  novaSenha?: string;
}
export interface SaveClinic {
  nome: string;
  cnpj: string;
  descricao?: string;
  endereco: string;
  telefone: string;
  email: string;
  imagemUrl?: string;
  ativo?: boolean;
}
export interface SaveProfessional {
  nome: string;
  cpf: string;
  profissao: Profession;
  especialidade: string;
  numeroRegistroProfissional?: string;
  fotoUrl?: string;
  valorAtendimento: number;
  telefone: string;
  email: string;
  descricao?: string;
  clinicaId?: number | null;
  ativo?: boolean;
}
export interface ReviewRequest {
  nota: number;
  comentario?: string;
}
export type SearchFilters = Record<string, string | number | boolean | undefined | null>;
