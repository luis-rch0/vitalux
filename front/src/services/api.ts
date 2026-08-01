import type { ApiErrorBody } from "@/types/api";

const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "/api").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  fields: Record<string, string>;
  constructor(status: number, message: string, fields: Record<string, string> = {}) {
    super(message); this.status = status; this.fields = fields;
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, { ...init, headers, credentials: "include", cache: "no-store" });
  } catch {
    throw new ApiError(0, "Não foi possível conectar ao CarePoint. Verifique sua conexão.");
  }
  if (response.status === 204) return undefined as T;
  const body = (await response.json().catch(() => ({}))) as ApiErrorBody;
  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") window.dispatchEvent(new Event("carepoint:unauthorized"));
    throw new ApiError(response.status, body.message || "Não foi possível concluir a operação.", body.fieldErrors || {});
  }
  return body as T;
}

export const query = (values: Record<string, string | number | boolean | undefined | null>) => {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== "") params.set(key, String(value)); });
  const text = params.toString();
  return text ? `?${text}` : "";
};
