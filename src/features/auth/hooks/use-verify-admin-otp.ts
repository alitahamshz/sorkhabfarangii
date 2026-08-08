"use client";

import { useMutation } from "@tanstack/react-query";
import { verifyAdminOtp } from "../api/verify-admin-otp";

export function useVerifyAdminOtp() {
  return useMutation({
    mutationFn: verifyAdminOtp,
  });
}
