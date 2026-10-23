import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ActionReview } from "./action-review";
import { assistantApi } from "./api";
vi.mock("@/providers/i18n-provider", () => ({ useI18n: () => ({ locale: "pt-BR" }) }));
vi.mock("./api", () => ({ assistantApi: { prepare: vi.fn(), confirm: vi.fn() } }));

beforeEach(() => vi.clearAllMocks());
describe("confirmed assistant actions", () => {
  it("prepares first and only commits after explicit confirmation", async () => {
    vi.mocked(assistantApi.prepare).mockResolvedValue({
      token: "owned",
      type: "CANCEL_REQUEST",
      summary: "Cancelar #7",
      expiresAt: "2027-01-01",
    });
    vi.mocked(assistantApi.confirm).mockResolvedValue({ id: 7 } as Awaited<
      ReturnType<typeof assistantApi.confirm>
    >);
    const onComplete = vi.fn();
    render(
      <QueryClientProvider client={new QueryClient()}>
        <ActionReview input={{ type: "CANCEL_REQUEST", requestId: 7 }} onComplete={onComplete} />
      </QueryClientProvider>,
    );
    fireEvent.click(screen.getByText("Revisar com o assistente"));
    await screen.findByText("Cancelar #7");
    expect(assistantApi.confirm).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Confirmar ação"));
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith({ id: 7 }));
    expect(assistantApi.confirm).toHaveBeenCalledWith("owned");
  });
  it("shows a preparation failure without executing", async () => {
    vi.mocked(assistantApi.prepare).mockRejectedValue(new Error("Solicitação indisponível"));
    render(
      <QueryClientProvider client={new QueryClient()}>
        <ActionReview input={{ type: "CANCEL_REQUEST", requestId: 7 }} onComplete={vi.fn()} />
      </QueryClientProvider>,
    );
    fireEvent.click(screen.getByText("Revisar com o assistente"));
    expect(await screen.findByRole("alert")).toHaveTextContent("Solicitação indisponível");
    expect(assistantApi.confirm).not.toHaveBeenCalled();
  });
});
