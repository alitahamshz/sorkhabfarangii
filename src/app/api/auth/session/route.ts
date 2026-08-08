import { NextResponse } from "next/server";
import { getServerSession, toClientSession } from "@/features/auth/server/session";

export async function GET() {
  const session = await getServerSession();
  return NextResponse.json(session ? toClientSession(session) : null, {
    headers: { "Cache-Control": "no-store" },
  });
}
