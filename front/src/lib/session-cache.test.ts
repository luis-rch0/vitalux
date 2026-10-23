import { describe, expect, it } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { clearSessionCache } from "./session-cache";

describe("session isolation", () => {
  it("removes previous account records, conversations and auth on logout", async () => {
    const client = new QueryClient();
    client.setQueryData(["auth", "me"], { id: 1 });
    client.setQueryData(["patient-dashboard"], { nome: "Private patient" });
    client.setQueryData(["assistant-conversations", 1], [{ id: 2 }]);
    await clearSessionCache(client);
    expect(client.getQueryData(["auth", "me"])).toBeNull();
    expect(client.getQueryData(["patient-dashboard"])).toBeUndefined();
    expect(client.getQueryData(["assistant-conversations", 1])).toBeUndefined();
  });
});
