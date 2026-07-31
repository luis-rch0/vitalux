import { beforeEach, describe, expect, it, vi } from "vitest";
import { loginSchema } from "@/schemas/auth";
import { authService } from "@/services/auth";
import { carepointService } from "@/services/carepoint";

describe("validações e integração HTTP", () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ id: 1, nome: "Ana", email: "ana@exemplo.com", role: "PACIENTE", pacienteId: 1 }), { status: 200, headers: { "Content-Type": "application/json" } }));
  });

  it("rejeita credenciais de login inválidas antes do envio", () => {
    expect(loginSchema.safeParse({ email: "inválido", senha: "123" }).success).toBe(false);
  });

  it("envia login sem armazenar token no navegador", async () => {
    await authService.login({ email: "ana@exemplo.com", senha: "senha-segura", perfilSelecionado: "PACIENTE" });
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/auth/login"), expect.objectContaining({ method: "POST", credentials: "include" }));
  });

  it("envia criação de solicitação ao endpoint protegido", async () => {
    await carepointService.createRequest({ profissionalId: 2, servicoSolicitado: "Fisioterapia" });
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/solicitacoes"), expect.objectContaining({ method: "POST", credentials: "include" }));
  });

  it("usa endpoint administrativo para confirmar solicitação", async () => {
    await carepointService.updateRequestStatus(5, "confirmar");
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/admin/solicitacoes/5/confirmar"), expect.objectContaining({ method: "PATCH", credentials: "include" }));
  });
});
