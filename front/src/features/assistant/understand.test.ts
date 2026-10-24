import { describe, expect, it } from "vitest";
import { understand } from "./understand";
describe("local assistant routing", () => {
  it("routes care requests to a review flow, never executes them", () => {
    expect(understand("quero agendar fisioterapia")).toEqual({ intent: "HELP", task: "CREATE" });
  });
  it("routes cancellation without assuming a request id", () => {
    expect(understand("cancele meu pedido").task).toBe("CANCEL");
  });
  it("recognizes accented request and specialty queries", () => {
    expect(understand("minhas solicitações").intent).toBe("MY_REQUESTS");
    expect(understand("busco nutrição").search).toBe("nutrição");
  });
  it("leaves unknown questions to the help provider", () => {
    expect(understand("como editar meu perfil?")).toEqual({ intent: "HELP" });
  });
});
