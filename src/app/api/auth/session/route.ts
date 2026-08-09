import { NextResponse } from "next/server";
import { getServerSession, toClientSession } from "@/features/auth/server/session";

export async function GET() {
  const session = await getServerSession();
  return NextResponse.json(
    {
      success: "true",
      statusCode: "200",
      message: "Successful",
      data: session ? toClientSession(session) : null,
      meta: [],
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
