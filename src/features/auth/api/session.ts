import { createApiClient, type ApiResponse } from "@/lib/api";
import type { AuthSession } from "../types/session";

const nextApi = createApiClient({
  baseUrl: "/api",
  credentials: "include",
});

export async function getSession() {
  const response = await nextApi.get<ApiResponse<AuthSession | null>>(
    "/auth/session",
    { cache: "no-store" },
  );
  return response.data;
}

export function signOut() {
  return nextApi.post<ApiResponse<null>>("/auth/logout");
}
