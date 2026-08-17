"use client";

import { useMutation } from "@tanstack/react-query";
import { sendOtp } from "../api/send-admin-otp";
import type { AuthAudience } from "../config/auth-routes";

export function useSendAdminOtp(audience: AuthAudience) {
  return useMutation({
    mutationFn: (input: Parameters<typeof sendOtp>[1]) => sendOtp(audience, input),
  });
}
