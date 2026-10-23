import type { QueryClient } from "@tanstack/react-query";

export async function invalidateRequestQueries(client: QueryClient) {
  const keys = [
    "my-requests",
    "request",
    "patient-dashboard",
    "admin-dashboard",
    "admin-requests",
    "admin-request",
  ];
  await Promise.all(keys.map((key) => client.invalidateQueries({ queryKey: [key] })));
}
