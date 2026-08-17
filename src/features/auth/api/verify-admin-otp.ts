import { createApiClient } from "@/lib/api";
import type { AuthAudience } from "../config/auth-routes";

export type VerifyOtpInput = { mobile: string; otp_code: string };
export type VerifyOtpResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string | number;
      first_name: string | null;
      last_name: string | null;
      mobile: string;
      gender: string | null;
      profile_picture: string | null;
      is_personal: boolean;
      company_name: string | null;
      roles: unknown[];
    };
  };
};

const nextApi = createApiClient({
  baseUrl: "/api",
  credentials: "include",
});

export function verifyOtp(audience: AuthAudience, input: VerifyOtpInput) {
  return nextApi.post<VerifyOtpResponse, VerifyOtpInput>(
    `/auth/${audience}/verify-otp`,
    input,
  );
}
