import { createApiClient } from "@/lib/api";

export type SendAdminOtpInput = {
  phone_number: string;
};

export type SendAdminOtpResponse = {
  status: string;
  send: string;
};

const nextApi = createApiClient({
  baseUrl: "/api",
  credentials: "include",
});

export function sendAdminOtp(input: SendAdminOtpInput) {
  return nextApi.post<SendAdminOtpResponse, SendAdminOtpInput>(
    "/auth/admin/login",
    input,
  );
}
