import { createApiClient } from "@/lib/api";
import type { AuthSession } from "../types/session";

const nextApi = createApiClient({
  baseUrl: "/api",
  credentials: "include",
});

export function getSession() {
  return nextApi.get<AuthSession | null>("/auth/session", { cache: "no-store" });
}

export function signOut() {
  return nextApi.post<{ success: true }>("/auth/logout");
}
