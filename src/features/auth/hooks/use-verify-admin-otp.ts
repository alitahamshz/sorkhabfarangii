"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyOtp } from "../api/verify-admin-otp";
import { AUTH_SESSION_QUERY_KEY } from "./use-session";
import type { AuthAudience } from "../config/auth-routes";

export function useVerifyAdminOtp(audience: AuthAudience) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof verifyOtp>[1]) => verifyOtp(audience, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: AUTH_SESSION_QUERY_KEY });
    },
  });
}
