import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import AssistantPanel from "./assistant-panel";
import { assistantApi } from "./api";
vi.mock("@/providers/auth-provider", () => ({
  useAuth: () => ({ user: { id: 1, role: "PACIENTE" } }),
}));
vi.mock("@/providers/i18n-provider", () => ({ useI18n: () => ({ locale: "pt-BR" }) }));
vi.mock("./task-panel", () => ({
  TaskPanel: ({ task }: { task: string }) => <div>Formulário: {task}</div>,
}));
vi.mock("./api", () => ({
  assistantApi: {
    send: vi.fn(),
    conversations: vi.fn(async () => []),
    history: vi.fn(),
    remove: vi.fn(),
    prepare: vi.fn(),
    confirm: vi.fn(),
  },
}));
beforeEach(() => {
  vi.clearAllMocks();
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(cleanup);
function open() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <AssistantPanel onClose={() => {}} />
    </QueryClientProvider>,
  );
}
function submit(text: string) {
  fireEvent.change(screen.getByRole("textbox", { name: "Escreva sua dúvida…" }), {
    target: { value: text },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enviar mensagem" }));
}
it("keeps AI opt-in and conversation id across natural follow-ups", async () => {
  vi.mocked(assistantApi.send).mockResolvedValue({
    conversationId: 7,
    answer: "Como posso ajudar?",
    mode: "AI",
    links: [],
  });
  open();
  expect(screen.getByRole("checkbox", { name: "Ativar conversa com IA" })).not.toBeChecked();
  fireEvent.click(screen.getByRole("checkbox", { name: "Ativar conversa com IA" }));
  submit("Olá, tudo bem?");
  await screen.findByText("Como posso ajudar?");
  vi.mocked(assistantApi.send).mockResolvedValue({
    conversationId: 7,
    answer: "Preencha Nova senha.",
    mode: "AI",
    links: [{ label: "Editar perfil", href: "/perfil/editar" }],
  });
  submit("quero alterar minha senha");
  await screen.findByRole("link", { name: "Editar perfil" });
  expect(assistantApi.send).toHaveBeenLastCalledWith(
    expect.objectContaining({
      conversationId: 7,
      intent: "HELP",
      useAi: true,
      message: "quero alterar minha senha",
    }),
  );
  expect(assistantApi.confirm).not.toHaveBeenCalled();
});
it("lets the server select a task without performing the action", async () => {
  vi.mocked(assistantApi.send).mockResolvedValue({
    conversationId: 8,
    answer: "Vamos preparar seu pedido.",
    mode: "AI",
    links: [],
    task: "CREATE",
  });
  open();
  fireEvent.click(screen.getByRole("checkbox", { name: "Ativar conversa com IA" }));
  submit("Gostaria de marcar uma visita para minha mãe");
  await screen.findByText("Formulário: CREATE");
  expect(assistantApi.send).toHaveBeenCalledWith(expect.objectContaining({ intent: "HELP" }));
  expect(assistantApi.prepare).not.toHaveBeenCalled();
  expect(assistantApi.confirm).not.toHaveBeenCalled();
});
it("shows provider fallback and preserves text after failure", async () => {
  vi.mocked(assistantApi.send).mockResolvedValue({
    conversationId: 9,
    answer: "Olá!",
    mode: "GUIDED",
    links: [],
  });
  open();
  fireEvent.click(screen.getByRole("checkbox", { name: "Ativar conversa com IA" }));
  submit("Olá");
  await screen.findByText(
    "A IA externa não respondeu esta consulta. O modo guiado está disponível.",
  );
  vi.mocked(assistantApi.send).mockRejectedValue(new Error("Falha temporária"));
  submit("Preciso de ajuda");
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Falha temporária"));
  expect(screen.getByRole("textbox", { name: "Escreva sua dúvida…" })).toHaveValue(
    "Preciso de ajuda",
  );
});
