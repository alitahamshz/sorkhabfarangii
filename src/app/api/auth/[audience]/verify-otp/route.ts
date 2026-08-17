import { NextResponse } from "next/server";
import { isApiError } from "@/lib/api";
import { serverApi } from "@/lib/api/server";
import { createServerSession, setAuthCookies } from "@/features/auth/server/session";
import type { AuthAudience } from "@/features/auth";
import type { VerifyOtpInput, VerifyOtpResponse } from "@/features/auth/api/verify-admin-otp";

const serviceByAudience: Record<AuthAudience, string> = {
  admin: "employees",
  customer: "customer",
  seller: "seller",
};

function getAudience(value: string): AuthAudience | null {
  return value in serviceByAudience ? (value as AuthAudience) : null;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ audience: string }> },
) {
  const audience = getAudience((await params).audience);
  if (!audience) return NextResponse.json({ success: false, message: "NOT_FOUND", data: null }, { status: 404 });

  let input: VerifyOtpInput;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "INVALID_REQUEST_BODY", data: null }, { status: 400 });
  }
  if (!/^09\d{9}$/.test(input.mobile) || !/^\d{6}$/.test(input.otp_code)) {
    return NextResponse.json({ success: false, message: "INVALID_OTP_INPUT", data: null }, { status: 400 });
  }

  try {
    const payload = await serverApi.post<VerifyOtpResponse, VerifyOtpInput>(
      `/${serviceByAudience[audience]}/sign/code/valid`, input, { cache: "no-store" },
    );
    const response = NextResponse.json(payload);
    if (payload.success && payload.data?.token && payload.data.user) {
      const { user } = payload.data;
      const session = await createServerSession({
        audience,
        family: user.last_name ?? "",
        last_name: user.last_name,
        first_name: user.first_name,
        mobile: user.mobile,
        gender: user.gender,
        profile_picture: user.profile_picture,
        is_personal: user.is_personal,
        company_name: user.company_name,
        roles: user.roles,
        id: String(user.id),
        name: user.first_name ?? "",
      }, payload.data.token);
      await setAuthCookies(response, session);
    }
    return response;
  } catch (error) {
    if (isApiError(error) && error.data && typeof error.data === "object") {
      return NextResponse.json(error.data, { status: error.status || 502 });
    }
    return NextResponse.json({ success: false, message: "OTP_VERIFY_UPSTREAM_UNREACHABLE", data: null }, { status: 502 });
  }
}
