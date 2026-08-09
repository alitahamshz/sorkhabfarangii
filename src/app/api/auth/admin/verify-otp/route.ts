import { NextResponse } from "next/server";
import {
  createServerSession,
  setAuthCookies,
} from "@/features/auth/server/session";
import type { AdminOtpVerification } from "@/features/auth/api/verify-admin-otp";

const DEFAULT_API_BASE_URL = "https://sorkhabfarangi.shop/api/v1";

function maskToken(token: string | undefined) {
  if (!token) return token;
  if (token.length <= 14) return "••••••••";
  return `${token.slice(0, 8)}••••••••${token.slice(-6)}`;
}

export async function POST(request: Request) {
  const body = await request.text();
  const apiBaseUrl = process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL;

  try {
    const upstream = await fetch(`${apiBaseUrl}/main_admin/otpVerify/index.php`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": request.headers.get("content-type") ?? "application/json",
      },
      body,
      cache: "no-store",
    });
    const upstreamBody = await upstream.text();
    const response = new NextResponse(upstreamBody, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "application/json",
      },
    });

    // پاسخ body بدون تغییر به مرورگر بازگردانده می‌شود؛ این بخش فقط cookie
    // نشست را برای پاسخ موفق تنظیم می‌کند.
    try {
      const payload = JSON.parse(upstreamBody) as AdminOtpVerification;
      if (payload.status !== "false" && payload.token) {
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
        await setAuthCookies(response, session);
      }
    } catch {
      // پاسخ غیر JSON هم باید دقیقاً همان‌طور که از بک‌اند آمده برگردد.
    }

    return response;
  } catch (error) {
    console.error("[main_admin/otpVerify] upstream request failed:", error);
    return NextResponse.json(
      { message: "OTP_VERIFY_UPSTREAM_UNREACHABLE" },
      { status: 502 },
    );
  }
}
