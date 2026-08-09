import { NextResponse } from "next/server";
import { isApiError } from "@/lib/api";
import { serverApi } from "@/lib/api/server";
import type {
  SendAdminOtpInput,
  SendAdminOtpResponse,
} from "@/features/auth/api/send-admin-otp";

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    {
      success: "false",
      statusCode: String(status),
      message,
      data: null,
      meta: [],
    },
    { status },
  );
}

export async function POST(request: Request) {
  let input: SendAdminOtpInput;

  try {
    input = await request.json();
  } catch {
    return errorResponse("بدنهٔ درخواست نامعتبر است.", 400);
  }

  if (!/^09\d{9}$/.test(input.phone_number)) {
    return errorResponse("شماره موبایل نامعتبر است.", 400);
  }

  try {
    const payload = await serverApi.post<SendAdminOtpResponse, SendAdminOtpInput>(
      "/main_admin/login/index.php",
      input,
      { cache: "no-store" },
    );
    return NextResponse.json(payload);
  } catch (error) {
    if (isApiError(error)) {
      const status = error.status || 502;
      const payload = error.data;
      if (
        payload &&
        typeof payload === "object" &&
        "success" in payload &&
        "statusCode" in payload &&
        "data" in payload &&
        "meta" in payload
      ) {
        return NextResponse.json(payload, { status });
      }
      return errorResponse(error.message, status);
    }

    return errorResponse("ارتباط با سرویس ارسال کد برقرار نشد.", 502);
  }
}
