"use client";

import { ACCESS_TOKEN_COOKIE } from "../config/auth-cookies";

export function getClientAccessToken() {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${ACCESS_TOKEN_COOKIE}=`));
  if (!cookie) return null;

  const value = cookie.slice(ACCESS_TOKEN_COOKIE.length + 1);
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
