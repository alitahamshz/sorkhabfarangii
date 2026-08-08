"use client";

import { useEffect } from "react";
import type { AuthSession } from "@/features/auth";

export function SessionConsoleLogger({ session }: { session: AuthSession }) {
  useEffect(() => {
    console.group("[Auth Session] اطلاعات کاربر ادمین");
    console.log("session:", session);
    console.log("user:", session.user);
    console.log("expires:", session.expires);
    console.info("accessToken داخل cookie امن HttpOnly است و در کلاینت نمایش داده نمی‌شود.");
    console.groupEnd();
  }, [session]);

  return null;
}
