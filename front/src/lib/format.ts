import type { RequestStatus } from "@/types/api";

export const currency = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
export const dateTime = (value?: string) => value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
export const statusLabel: Record<RequestStatus, string> = { PENDENTE: "Pendente", CONFIRMADA: "Confirmada", REJEITADA: "Rejeitada", CANCELADA: "Cancelada", CONCLUIDA: "Concluída" };
