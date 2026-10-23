import type { QueryClient } from "@tanstack/react-query";

/** Cancel in-flight private reads before removing cached account data. */
export async function clearSessionCache(client: QueryClient) {
  await client.cancelQueries();
  client.clear();
  client.setQueryData(["auth", "me"], null);
}
