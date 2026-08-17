import { createApiClient } from "@/lib/api";
import type { AuthAudience } from "../config/auth-routes";

export type SendOtpInput = { mobile: string };
export type SendOtpResponse = {
  success: boolean;
  message: string;
  data: { mobile: string; expires_in: string };
};

const nextApi = createApiClient({
  baseUrl: "/api",
  credentials: "include",
});

export function sendOtp(audience: AuthAudience, input: SendOtpInput) {
  return nextApi.post<SendOtpResponse, SendOtpInput>(
    `/auth/${audience}/login`,
    input,
  );
}
