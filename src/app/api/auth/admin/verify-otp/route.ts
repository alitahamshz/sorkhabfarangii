import { NextResponse } from "next/server";
import { isApiError } from "@/lib/api";
import { serverApi } from "@/lib/api/server";
import type {
  AdminOtpVerification,
  VerifyAdminOtpInput,
} from "@/features/auth/api/verify-admin-otp";
import {
  createServerSession,
  setAuthCookies,
  toClientSession,
} from "@/features/auth/server/session";

function maskToken(token: string | undefined) {
  if (!token) return token;
  if (token.length <= 14) return "••••••••";
  return `${token.slice(0, 8)}••••••••${token.slice(-6)}`;
}

export async function POST(request: Request) {
  let input: VerifyAdminOtpInput;

  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ message: "بدنهٔ درخواست نامعتبر است." }, { status: 400 });
  }

  if (!/^09\d{9}$/.test(input.phone_number) || !/^\d{5}$/.test(input.code)) {
    return NextResponse.json({ message: "شماره موبایل یا کد تأیید نامعتبر است." }, { status: 400 });
  }

  try {
    const payload = await serverApi.post<AdminOtpVerification, VerifyAdminOtpInput>(
      "/main_admin/otpVerify/index.php",
      input,
      { cache: "no-store" },
    );

    console.info("[auth/verify-otp] پاسخ وب‌سرویس PHP:", {
      ...payload,
      token: maskToken(payload.token),
    });

    if (payload.status === "false" || !payload.token) {
      return NextResponse.json(
        { message: payload.discript || "کد تأیید صحیح نیست." },
        { status: 401 },
      );
    }

    const session = await createServerSession(
      {
        audience: "admin",
        family: payload.family ?? "",
        id: String(payload.id ?? ""),
        level: payload.level ?? "",
        name: payload.name ?? "",
      },
      payload.token,
    );
    const response = NextResponse.json(toClientSession(session));
    await setAuthCookies(response, session);
    return response;
  } catch (error) {
    if (isApiError(error)) {
      console.error("[auth/verify-otp] خطای وب‌سرویس PHP:", {
        code: error.code,
        data: error.data,
        message: error.message,
        status: error.status,
      });
      return NextResponse.json(
        error.data ?? { message: error.message },
        { status: error.status || 502 },
      );
    }

    console.error("[auth/verify-otp] خطای ساخت Session:", error);

    return NextResponse.json(
      { message: "ارتباط با سرویس تأیید کد برقرار نشد." },
      { status: 502 },
    );
  }
}
