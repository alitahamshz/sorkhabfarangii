import { NextResponse } from "next/server";
import { isApiError } from "@/lib/api";
import { serverApi } from "@/lib/api/server";
import type { AuthAudience } from "@/features/auth";
import type { SendOtpInput, SendOtpResponse } from "@/features/auth/api/send-admin-otp";

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

  let input: SendOtpInput;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "INVALID_REQUEST_BODY", data: null }, { status: 400 });
  }
  if (!/^09\d{9}$/.test(input.mobile)) {
    return NextResponse.json({ success: false, message: "INVALID_MOBILE", data: null }, { status: 400 });
  }

  try {
    const payload = await serverApi.post<SendOtpResponse, SendOtpInput>(
      `/${serviceByAudience[audience]}/sign/code/auth`, input, { cache: "no-store" },
    );
    return NextResponse.json(payload);
  } catch (error) {
    if (isApiError(error) && error.data && typeof error.data === "object") {
      return NextResponse.json(error.data, { status: error.status || 502 });
    }
    return NextResponse.json({ success: false, message: "OTP_SEND_UPSTREAM_UNREACHABLE", data: null }, { status: 502 });
  }
}
