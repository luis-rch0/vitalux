import { describe, expect, it } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { invalidateRequestQueries } from "./cache";

describe("request mutations", () => {
  it("invalidates list, detail and dashboard together", async () => {
    const client = new QueryClient();
    const keys = [
      ["my-requests"],
      ["request", "7"],
      ["patient-dashboard"],
      ["admin-requests"],
      ["admin-dashboard"],
    ];
    for (const key of keys) client.setQueryData(key, { status: "PENDENTE" });
    await invalidateRequestQueries(client);
    for (const key of keys) expect(client.getQueryState(key)?.isInvalidated).toBe(true);
  });
});
