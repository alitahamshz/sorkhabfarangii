"use client";

import { getClientAccessToken } from "@/features/auth/client/access-token";
import { createApiClient } from "./request";

export const clientApi = createApiClient({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:5050/api",
  credentials: "include",
  getAccessToken: getClientAccessToken,
});
