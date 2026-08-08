import { NextResponse } from "next/server";
import { isApiError } from "@/lib/api";
import { serverApi } from "@/lib/api/server";
import type { SendAdminOtpInput } from "@/features/auth/api/send-admin-otp";

export async function POST(request: Request) {
  let input: SendAdminOtpInput;

  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ message: "بدنهٔ درخواست نامعتبر است." }, { status: 400 });
  }

  if (!/^09\d{9}$/.test(input.phone_number)) {
    return NextResponse.json({ message: "شماره موبایل نامعتبر است." }, { status: 400 });
  }

  try {
    const payload = await serverApi.post<unknown, SendAdminOtpInput>(
      "/main_admin/login/index.php",
      input,
      { cache: "no-store" },
    );
    return NextResponse.json(payload);
  } catch (error) {
    if (isApiError(error)) {
      return NextResponse.json(
        error.data ?? { message: error.message },
        { status: error.status || 502 },
      );
    }

    return NextResponse.json(
      { message: "ارتباط با سرویس ارسال کد برقرار نشد." },
      { status: 502 },
    );
  }
}
