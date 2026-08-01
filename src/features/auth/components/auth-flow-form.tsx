"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AUTH_ROUTES, type AuthAudience } from "../config/auth-routes";

type AuthStep = "login" | "otp";

const audienceContent = {
  customer: {
    title: "ورود مشتری",
    description: "برای ورود به حساب فروشگاه، شماره موبایل خود را وارد کنید.",
  },
  admin: {
    title: "ورود ادمین",
    description: "برای ورود به پنل مدیریت، شماره موبایل ادمین را وارد کنید.",
  },
  seller: {
    title: "ورود فروشنده",
    description: "برای ورود به پنل فروشندگی، شماره موبایل فروشنده را وارد کنید.",
  },
} satisfies Record<AuthAudience, { title: string; description: string }>;

function normalizeDigits(value: string) {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

  return value
    .replace(/[۰-۹]/g, (digit) => String(persianDigits.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(arabicDigits.indexOf(digit)))
    .replace(/\D/g, "");
}

export function AuthFlowForm({
  audience,
  step,
}: {
  audience: AuthAudience;
  step: AuthStep;
}) {
  const router = useRouter();
  const routes = AUTH_ROUTES[audience];
  const content = audienceContent[audience];
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const isLoginStep = step === "login";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedValue = normalizeDigits(value);

    if (isLoginStep && !/^09\d{9}$/.test(normalizedValue)) {
      setError("شماره موبایل معتبر وارد کنید.");
      return;
    }

    if (!isLoginStep && !/^\d{5,6}$/.test(normalizedValue)) {
      setError("کد تأیید باید ۵ یا ۶ رقم باشد.");
      return;
    }

    setError("");

    // TODO(auth-api): در مرحله ورود، درخواست ارسال OTP به API متناسب با audience ارسال شود.
    if (isLoginStep) {
      router.push(routes.otp);
      return;
    }

    // TODO(auth-api): کد OTP و نقش کاربر در بک‌اند بررسی و توکن امن در cookie ذخیره شود.
    // انتقال زیر فقط برای کامل بودن اسکلت مسیرها است و احراز هویت واقعی محسوب نمی‌شود.
    router.push(routes.destination);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4" dir="rtl">
      <section className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="mb-2 text-xs text-zinc-400">
          {audience === "customer"
            ? "حساب فروشگاه"
            : audience === "admin"
              ? "پنل مدیریت"
              : "پنل فروشندگی"}
        </p>
        <h1 className="text-xl font-semibold text-zinc-900">
          {isLoginStep ? content.title : "تأیید کد یک‌بارمصرف"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          {isLoginStep
            ? content.description
            : "کد ارسال‌شده به شماره موبایل را وارد کنید."}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm text-zinc-700" htmlFor={`${audience}-${step}`}>
              {isLoginStep ? "شماره موبایل" : "کد تأیید"}
            </label>
            <input
              autoComplete={isLoginStep ? "tel" : "one-time-code"}
              autoFocus
              className="h-11 w-full rounded-lg border border-zinc-300 px-3 text-left outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
              dir="ltr"
              id={`${audience}-${step}`}
              inputMode="numeric"
              maxLength={isLoginStep ? 11 : 6}
              name={isLoginStep ? "phone" : "otp"}
              onChange={(event) => setValue(event.target.value)}
              placeholder={isLoginStep ? "09123456789" : "12345"}
              type="tel"
              value={value}
            />
            {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
          </div>

          <button
            className="h-11 w-full cursor-pointer rounded-lg bg-zinc-900 text-sm font-medium text-white transition hover:bg-zinc-700"
            type="submit"
          >
            {isLoginStep ? "دریافت کد تأیید" : "تأیید و ادامه"}
          </button>
        </form>

        {!isLoginStep ? (
          <Link className="mt-4 block text-center text-sm text-zinc-500 hover:text-zinc-900" href={routes.login}>
            ویرایش شماره موبایل
          </Link>
        ) : null}

        <p className="mt-6 border-t border-zinc-100 pt-4 text-xs leading-5 text-zinc-400">
          این صفحه اسکلت اولیه است؛ ارسال و اعتبارسنجی OTP پس از اتصال API فعال می‌شود.
        </p>
      </section>
    </main>
  );
}
