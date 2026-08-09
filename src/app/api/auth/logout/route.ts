import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/features/auth/server/session";

export async function POST() {
  const response = NextResponse.json({
    success: "true",
    statusCode: "200",
    message: "Successful",
    data: null,
    meta: [],
  });
  clearAuthCookies(response);
  return response;
}
