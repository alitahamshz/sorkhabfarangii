"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyAdminOtp } from "../api/verify-admin-otp";
import { AUTH_SESSION_QUERY_KEY } from "./use-session";

export function useVerifyAdminOtp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyAdminOtp,
    onSuccess: (session) => {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, session);
    },
  });
}
