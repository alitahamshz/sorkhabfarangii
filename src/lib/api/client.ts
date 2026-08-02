"use client";

import { createApiClient } from "./request";

// در حالت پیشنهادی، مرورگر فقط Route Handlerهای همین Next.js را صدا می‌زند.
// NEXT_PUBLIC_API_BASE_URL صرفاً برای API عمومی و بدون اطلاعات محرمانه است.
export const clientApi = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
  credentials: "include",
});
