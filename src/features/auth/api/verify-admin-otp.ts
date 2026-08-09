import { createApiClient, type ApiResponse } from "@/lib/api";

export type VerifyAdminOtpInput = {
  /** شماره موبایل ۱۱ رقمی؛ به‌صورت string برای حفظ صفر ابتدایی. */
  phone_number: string;
  /** کد تأیید پنج‌رقمی. */
  code: string;
};

export type AdminOtpVerificationData = {
  status: string;
  name: string;
  family: string;
  discript: string;
  level: string;
  opt: string;
  id: string | number;
  token: string;
};

export type AdminOtpVerification = ApiResponse<AdminOtpVerificationData>;

const nextApi = createApiClient({
  baseUrl: "/api",
  credentials: "include",
});

export function verifyAdminOtp(input: VerifyAdminOtpInput) {
  return nextApi.post<AdminOtpVerification, VerifyAdminOtpInput>(
    "/auth/admin/verify-otp",
    input,
  );
}
