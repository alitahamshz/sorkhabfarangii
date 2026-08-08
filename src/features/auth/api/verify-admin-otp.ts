import { clientApi } from "@/lib/api/client";

export type VerifyAdminOtpInput = {
  /** شماره موبایل ۱۱ رقمی؛ به‌صورت string برای حفظ صفر ابتدایی. */
  phone_number: string;
  /** کد تأیید پنج‌رقمی. */
  code: string;
};

export type AdminOtpVerification = {
  status: string;
  name: string;
  family: string;
  discript: string;
  level: string;
  opt: string;
  id: string | number;
  token: string;
};

export function verifyAdminOtp(input: VerifyAdminOtpInput) {
  return clientApi.post<AdminOtpVerification, VerifyAdminOtpInput>(
    "/main_admin/otpVerify",
    input,
  );
}
