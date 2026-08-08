import "server-only";

import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import type { AuthSession, AuthUser, ServerAuthSession } from "../types/session";

const ACCESS_TOKEN_COOKIE = "sf_access_token";
const SESSION_COOKIE = "sf_session";
const DEFAULT_SESSION_MAX_AGE = 7 * 24 * 60 * 60;

type SignedSessionPayload = AuthSession & {
  tokenHash: string;
};

function getSessionMaxAge() {
  const configuredValue = Number(process.env.AUTH_SESSION_MAX_AGE);
  return Number.isFinite(configuredValue) && configuredValue > 0
    ? configuredValue
    : DEFAULT_SESSION_MAX_AGE;
}

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return "sorkhabfarangi-development-secret";
  throw new Error("AUTH_SECRET must be configured in production.");
}

function toBase64Url(value: Uint8Array | string) {
  return Buffer.from(value).toString("base64url");
}

async function getSigningKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign", "verify"],
  );
}

async function hashToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return toBase64Url(new Uint8Array(digest));
}

async function encodeSession(payload: SignedSessionPayload) {
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = await crypto.subtle.sign(
    "HMAC",
    await getSigningKey(),
    new TextEncoder().encode(encodedPayload),
  );
  return `${encodedPayload}.${toBase64Url(new Uint8Array(signature))}`;
}

async function decodeSession(value: string): Promise<SignedSessionPayload | null> {
  const [encodedPayload, encodedSignature] = value.split(".");
  if (!encodedPayload || !encodedSignature) return null;

  try {
    const isValid = await crypto.subtle.verify(
      "HMAC",
      await getSigningKey(),
      Buffer.from(encodedSignature, "base64url"),
      new TextEncoder().encode(encodedPayload),
    );
    if (!isValid) return null;

    return JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as SignedSessionPayload;
  } catch {
    return null;
  }
}

export async function createServerSession(
  user: AuthUser,
  accessToken: string,
): Promise<ServerAuthSession> {
  return {
    accessToken,
    expires: new Date(Date.now() + getSessionMaxAge() * 1000).toISOString(),
    user,
  };
}

export function toClientSession(session: ServerAuthSession): AuthSession {
  return { expires: session.expires, user: session.user };
}

export async function setAuthCookies(
  response: NextResponse,
  session: ServerAuthSession,
) {
  const maxAge = getSessionMaxAge();
  const signedSession = await encodeSession({
    ...toClientSession(session),
    tokenHash: await hashToken(session.accessToken),
  });
  const cookieOptions = {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };

  response.cookies.set(ACCESS_TOKEN_COOKIE, session.accessToken, cookieOptions);
  response.cookies.set(SESSION_COOKIE, signedSession, cookieOptions);
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", { maxAge: 0, path: "/" });
  response.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
}

export async function getServerSession(): Promise<ServerAuthSession | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const signedValue = cookieStore.get(SESSION_COOKIE)?.value;
  if (!accessToken || !signedValue) return null;

  const payload = await decodeSession(signedValue);
  if (!payload || Date.parse(payload.expires) <= Date.now()) return null;
  if (payload.tokenHash !== (await hashToken(accessToken))) return null;

  return {
    accessToken,
    expires: payload.expires,
    user: payload.user,
  };
}
