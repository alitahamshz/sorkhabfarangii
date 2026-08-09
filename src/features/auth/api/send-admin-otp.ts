import { createApiClient, type ApiResponse } from "@/lib/api";

export type SendAdminOtpInput = {
  phone_number: string;
};

export type SendAdminOtpData = {
  status: string;
  send: string;
};

export type SendAdminOtpResponse = ApiResponse<SendAdminOtpData>;

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
