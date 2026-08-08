"use client";

import { createApiClient } from "./request";

export const clientApi = createApiClient({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://sorkhabfarangi.shop/api/v1",
  credentials: "include",
});
