import { api } from "@/services/api";
import type { CreateServiceRequest } from "@/types/requests";
import type { ServiceRequest } from "@/types/api";

export type Intent = "HELP" | "PROFESSIONALS" | "CLINICS" | "MY_REQUESTS";
export interface Message {
  id: number;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt?: string;
}
export interface Conversation {
  id: number;
  title: string;
  updatedAt: string;
}
export interface Reply {
  conversationId: number;
  answer: string;
  mode: "AI" | "GUIDED";
  links: { label: string; href: string }[];
}
export interface ActionPreview {
  token: string;
  type: "CREATE_REQUEST" | "CANCEL_REQUEST";
  summary: string;
  expiresAt: string;
}
export type ActionInput =
  | { type: "CREATE_REQUEST"; draft: CreateServiceRequest }
  | { type: "CANCEL_REQUEST"; requestId: number };
export const assistantApi = {
  send: (payload: {
    conversationId?: number;
    message: string;
    intent: Intent;
    search?: string;
    locale: string;
    useAi: boolean;
  }) => api<Reply>("/assistant/messages", { method: "POST", body: JSON.stringify(payload) }),
  conversations: () => api<Conversation[]>("/assistant/conversations"),
  history: (id: number, page = 0) =>
    api<Message[]>(`/assistant/conversations/${id}/messages?page=${page}`),
  remove: (id: number) => api<void>(`/assistant/conversations/${id}`, { method: "DELETE" }),
  prepare: (payload: ActionInput) =>
    api<ActionPreview>("/assistant/actions", { method: "POST", body: JSON.stringify(payload) }),
  confirm: (token: string) =>
    api<ServiceRequest>(`/assistant/actions/${token}/confirm`, { method: "POST" }),
};
