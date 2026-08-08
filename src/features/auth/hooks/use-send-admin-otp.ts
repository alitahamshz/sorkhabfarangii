"use client";

import { useMutation } from "@tanstack/react-query";
import { sendAdminOtp } from "../api/send-admin-otp";

export function useSendAdminOtp() {
  return useMutation({
    mutationFn: sendAdminOtp,
  });
}
