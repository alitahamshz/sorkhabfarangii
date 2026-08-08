"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  Check,
  CheckCircle2,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { isApiError } from "@/lib/api";
import { useSendAdminOtp } from "../hooks/use-send-admin-otp";
import { useVerifyAdminOtp } from "../hooks/use-verify-admin-otp";
import { useWebOtp } from "../hooks/use-web-otp";
import { AUTH_ROUTES, type AuthAudience } from "../config/auth-routes";

type AuthStep = "login" | "otp";

const audienceContent = {
  customer: {
    title: "ورود مشتری",
    description:
      "برای ورود به حساب فروشگاه، شماره موبایل خود را وارد کنید.",
  },
  admin: {
    title: "ورود ادمین",
    description: "برای ورود به پنل مدیریت، شماره موبایل ادمین را وارد کنید.",
  },
  seller: {
    title: "ورود فروشنده",
    description:
      "برای ورود به پنل فروشندگی، شماره موبایل فروشنده را وارد کنید.",
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

function getAdminLoginErrorMessage(error: unknown) {
  const apiError = isApiError(error) ? error : undefined;
  const payload = apiError?.data ?? error;
  const data =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : undefined;
  const status = Number(apiError?.status ?? data?.["status code"]);
  const description = typeof data?.discript === "string" ? data.discript : "";

  if (status === 503) {
    return "سرویس ارسال کد موقتاً در دسترس نیست. چند دقیقه دیگر تلاش کنید.";
  }
  if (status === 502) {
    return "ارتباط با سرویس ارسال کد برقرار نشد. دوباره تلاش کنید.";
  }
  if (status === 404) {
    return "سرویس ارسال کد یافت نشد. لطفاً با پشتیبانی تماس بگیرید.";
  }
  if (status === 400 && /non-standard characters/i.test(description)) {
    return "شماره موبایل را فقط با اعداد انگلیسی وارد کنید.";
  }
  if (status === 400) {
    return "شماره موبایل نامعتبر است.";
  }

  return description || "ارسال کد تأیید با خطا مواجه شد. دوباره تلاش کنید.";
}

function AdminLoginForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dark, setDark] = useState(false);
  const [requestError, setRequestError] = useState("");
  const { isPending: isSendingOtp, mutate: sendOtp } = useSendAdminOtp();

  const normalizedValue = normalizeDigits(value);
  const isValid = /^09\d{9}$/.test(normalizedValue);
  const isInvalid =
    !isValid &&
    (submitted || (touched && normalizedValue.length > 0) || normalizedValue.length === 11);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    if (!isValid) return;

    setRequestError("");
    sendOtp(
      { phone_number: normalizedValue },
      {
        onSuccess: (response) => {
          if (response.status === "false") {
            setRequestError(getAdminLoginErrorMessage(response));
            return;
          }

          window.sessionStorage.setItem("admin_otp_phone_number", normalizedValue);
          router.push(AUTH_ROUTES.admin.otp);
        },
        onError: (requestError) => {
          setRequestError(getAdminLoginErrorMessage(requestError));
        },
      },
    );
  }

  return (
    <main
      className={`flex min-h-dvh items-center justify-center p-3 transition-colors max-[480px]:p-0 sm:p-6 ${dark ? "bg-neutral-900" : "bg-neutral-100"
        }`}
      dir="rtl"
    >
      <section
        className={`flex min-h-[480px] w-full max-w-[465px] flex-col rounded-2xl border px-8 pb-7 pt-8 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors max-[480px]:min-h-dvh max-[480px]:max-w-none max-[480px]:rounded-none max-[480px]:border-0 max-[480px]:px-4 max-[480px]:shadow-none ${dark
            ? "border-neutral-700 bg-neutral-800 text-white"
            : "border-neutral-300 bg-white text-neutral-900"
          }`}
      >
        <div className="flex h-10 items-start justify-between">
          <Image
            alt="سرخاب فرنگی"
            className="h-auto w-[70px]"
            height={39}
            priority
            src="/img/logo.svg"
            width={70}
          />
          <Button
            aria-label={dark ? "فعال‌کردن حالت روشن" : "فعال‌کردن حالت تیره"}
            className={`grid size-9 cursor-pointer place-items-center rounded-full transition-colors ${dark ? "text-yellow-300 hover:bg-white/10" : "text-neutral-500 hover:bg-neutral-100"
              }`}
            onClick={() => setDark((current) => !current)}
            size="icon-lg"
            type="button"
            variant="ghost"
          >
            {dark ? <Sun size={23} strokeWidth={1.7} /> : <Moon size={25} strokeWidth={1.7} />}
          </Button>
        </div>

        <div className="mt-10 flex items-center gap-2 text-[14px] font-medium">
          <Image src={'/icon/auth/login.svg'} width={18} height={18} alt="login" />
          <h1>ورود به سایت</h1>
        </div>

        <form className="mt-8 flex flex-1 flex-col" noValidate onSubmit={handleSubmit}>
          <Label
            className={`mb-2 text-[14px] ${dark ? "text-neutral-300" : "text-neutral-500"}`}
            htmlFor="admin-login"
          >
            لطفا شماره موبایل خود را وارد کنید
          </Label>

          <div className="relative" dir="ltr">
            <Image
              src='/icon/auth/cellphone.svg'
              alt="phone"
              aria-hidden="true"
              className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${isInvalid ? "text-red-600" : "text-neutral-500"
                }`}
              width={19}
              height={24}
            />
            <Input
              aria-describedby={isInvalid ? "admin-phone-error" : undefined}
              aria-invalid={isInvalid}
              autoComplete="tel"
              autoFocus
              className={`h-12 w-full rounded-lg border bg-transparent px-11 text-left text-[13px] outline-none transition placeholder:text-neutral-400 ${isInvalid
                  ? "border-red-600 focus:ring-2 focus:ring-red-100"
                  : dark
                    ? "border-neutral-600 text-white focus:border-neutral-400 focus:ring-2 focus:ring-white/10"
                    : "border-neutral-200 text-neutral-600 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
                }`}
              dir="ltr"
              id="admin-login"
              inputMode="numeric"
              maxLength={11}
              name="phone"
              onBlur={() => setTouched(true)}
              onChange={(event) => {
                const nextValue = event.target.value.replace(/[^0-9۰-۹٠-٩]/g, "");
                setValue(nextValue);
                setSubmitted(false);
              }}
              placeholder="09XX XXX XXXX"
              type="tel"
              value={value}
            />
            {isValid ? (
              <Check
                aria-label="شماره موبایل معتبر است"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-green-400"
                size={20}
                strokeWidth={2}
              />
            ) : null}
          </div>

          {isInvalid ? (
            <p className="mt-1.5 text-xs text-red-600" id="admin-phone-error">
              شماره موبایل نادرست است
            </p>
          ) : null}
          {requestError ? <p className="mt-1.5 text-xs text-red-600">{requestError}</p> : null}

          <Button
            className="mt-auto h-12 w-full rounded-lg bg-primary-500 text-[14px] font-medium text-white transition enabled:cursor-pointer enabled:hover:bg-primary-600 enabled:active:scale-[0.995] disabled:cursor-not-allowed disabled:bg-primary-200 max-[480px]:mt-[42px]"
            disabled={!isValid || isSendingOtp}
            size="lg"
            type="submit"
          >
            {isSendingOtp ? "در حال ارسال کد..." : "ورود"}
          </Button>
        </form>

        <p className={`mt-6 text-center text-[10px] ${dark ? "text-neutral-400" : "text-neutral-400"}`}>
          ورود به منزله پذیرش{" "}
          <Link className="text-primary-500 underline underline-offset-2" href="/privacy">
            قوانین حریم خصوصی
          </Link>
          است.
        </p>
      </section>
    </main>
  );
}

// ==================== شروع بخش OTP ادمین ====================
function AdminOtpForm() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [dark, setDark] = useState(false);
  const [success, setSuccess] = useState(false);
  const [phoneNumber] = useState(() =>
    typeof window === "undefined"
      ? ""
      : (window.sessionStorage.getItem("admin_otp_phone_number") ?? ""),
  );
  const [error, setError] = useState("");
  const isComplete = otp.length === 5;

  const { isPending: isVerifying, mutate: verifyOtp } = useVerifyAdminOtp();

  useWebOtp(setOtp, 5);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(
      () => router.push(AUTH_ROUTES.admin.destination),
      1100,
    );
    return () => window.clearTimeout(timer);
  }, [router, success]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isComplete) return;

    if (!/^09\d{9}$/.test(phoneNumber)) {
      setError("شماره موبایل یافت نشد؛ لطفاً دوباره وارد شوید.");
      return;
    }

    setError("");
    verifyOtp(
      { phone_number: phoneNumber, code: otp },
      {
        onSuccess: (response) => {
          console.log("[main_admin/otpVerify] raw backend response:", response);
          if (response.status === "false") {
            setError(response.discript || "کد تأیید نامعتبر است.");
            return;
          }
          setSuccess(true);
        },
        onError: (requestError) => {
          if (isApiError(requestError)) {
            console.error(
              "[main_admin/otpVerify] raw backend error response:",
              requestError.data,
            );
          } else {
            console.error("[main_admin/otpVerify] request error:", requestError);
          }
          setError(
          isApiError(requestError)
            ? requestError.message
            : "تأیید کد با خطا مواجه شد. دوباره تلاش کنید.",
        );
        },
      },
    );
  }

  return (
    <main
      className={`flex min-h-dvh items-center justify-center p-3 transition-colors max-[480px]:p-0 sm:p-6 ${dark ? "bg-neutral-900" : "bg-neutral-100"
        }`}
      dir="rtl"
    >
      <SuccessMessage visible={success} />
      <section
        className={`flex min-h-[480px] w-full max-w-[465px] flex-col rounded-2xl border px-8 pb-7 pt-8 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors max-[480px]:min-h-dvh max-[480px]:max-w-none max-[480px]:rounded-none max-[480px]:border-0 max-[480px]:px-4 max-[480px]:shadow-none ${dark
            ? "border-neutral-700 bg-neutral-800 text-white"
            : "border-neutral-300 bg-white text-neutral-900"
          }`}
      >
        <div className="flex h-10 items-start justify-between">
          <Image
            alt="سرخاب فرنگی"
            className="h-auto w-[70px]"
            height={39}
            priority
            src="/img/logo.svg"
            width={70}
          />
          <Button
            aria-label={dark ? "فعال‌کردن حالت روشن" : "فعال‌کردن حالت تیره"}
            className={`grid size-9 cursor-pointer place-items-center rounded-full transition-colors ${dark ? "text-yellow-300 hover:bg-white/10" : "text-neutral-500 hover:bg-neutral-100"
              }`}
            onClick={() => setDark((current) => !current)}
            size="icon-lg"
            type="button"
            variant="ghost"
          >
            {dark ? <Sun size={23} strokeWidth={1.7} /> : <Moon size={25} strokeWidth={1.7} />}
          </Button>
        </div>

        <div className="mt-10 flex items-center gap-2 text-[14px] font-medium">
          <Image src={'/icon/auth/login.svg'} alt="login" width={18} height={18} />
          <h1>تأیید شماره موبایل</h1>
        </div>

        {/* فرم ورود کد پنج‌رقمی OTP */}
        <form className="mt-8 flex flex-1 flex-col" noValidate onSubmit={handleSubmit}>
          <p className={`mb-3 text-[14px] ${dark ? "text-neutral-300" : "text-neutral-500"}`}>
            کد تأیید ۵ رقمی ارسال‌شده را وارد کنید
          </p>

          {/* پنج اینپوت مجزای کد OTP */}
          <div className="w-full" dir="ltr">
            <InputOTP
              autoComplete="one-time-code"
              autoFocus
              containerClassName="w-full [direction:ltr]"
              dir="ltr"
              inputMode="numeric"
              maxLength={5}
              name="otp"
              onChange={(value) => setOtp(normalizeDigits(value).slice(0, 5))}
              value={otp}
            >
              <InputOTPGroup className="w-full flex-row justify-between gap-6" dir="ltr">
                {[0, 1, 2, 3, 4].map((index) => (
                  <InputOTPSlot
                    className={`h-12 w-10 min-w-0 flex-1 rounded-lg border text-xl font-medium first:rounded-lg first:border last:rounded-lg ${dark
                      ? "border-neutral-600 bg-transparent text-white data-[active=true]:border-neutral-400 data-[active=true]:ring-white/10"
                      : "border-neutral-200 bg-transparent text-neutral-600 data-[active=true]:border-primary-500 data-[active=true]:ring-primary-500/10"
                      }`}
                    index={index}
                    key={index}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}

          {/* ویرایش شماره و ارسال مجدد کد OTP */}
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <Link className="text-primary-500 underline underline-offset-2" href={AUTH_ROUTES.admin.login}>
              ویرایش شماره موبایل
            </Link>
            <Button
              className="h-auto cursor-pointer p-0 text-[11px] text-primary-500"
              type="button"
              variant="link"
            >
              ارسال مجدد کد
            </Button>
          </div>

          {/* دکمه تأیید OTP */}
          <Button
            className="mt-auto h-12 w-full rounded-lg bg-primary-500 text-[14px] font-medium text-white transition enabled:cursor-pointer enabled:hover:bg-primary-600 enabled:active:scale-[0.995] disabled:cursor-not-allowed disabled:bg-primary-200 max-[480px]:mt-[42px]"
            disabled={!isComplete || success || isVerifying}
            size="lg"
            type="submit"
          >
            {isVerifying ? "در حال تأیید..." : "تأیید و ورود"}
          </Button>
        </form>

        <p className={`mt-6 text-center text-[10px] ${dark ? "text-neutral-400" : "text-neutral-400"}`}>
          ورود به منزله پذیرش{" "}
          <Link className="text-primary-500 underline underline-offset-2" href="/privacy">
            قوانین حریم خصوصی
          </Link>
          است.
        </p>
      </section>
    </main>
  );
}
// ==================== پایان بخش OTP ادمین ====================

function SuccessMessage({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <Alert
      className="fixed left-1/2 top-5 z-50 flex w-auto -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 shadow-lg"
    >
      <CheckCircle2 size={20} />
      <AlertDescription className="text-green-700">
        ورود با موفقیت انجام شد
      </AlertDescription>
    </Alert>
  );
}

function DefaultAuthForm({ audience, step }: { audience: AuthAudience; step: AuthStep }) {
  const router = useRouter();
  const routes = AUTH_ROUTES[audience];
  const content = audienceContent[audience];
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const isLoginStep = step === "login";

  useWebOtp(setValue, 5, 6, !isLoginStep);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => router.push(routes.destination), 1100);
    return () => window.clearTimeout(timer);
  }, [router, routes.destination, success]);

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
    if (isLoginStep) {
      router.push(routes.otp);
      return;
    }

    setSuccess(true);
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-zinc-50 px-4" dir="rtl">
      <SuccessMessage visible={success} />
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
            <Label className="mb-2 block text-sm text-zinc-700" htmlFor={`${audience}-${step}`}>
              {isLoginStep ? "شماره موبایل" : "کد تأیید"}
            </Label>
            <Input
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

          <Button
            className="h-11 w-full cursor-pointer rounded-lg bg-zinc-900 text-sm font-medium text-white transition hover:bg-zinc-700"
            type="submit"
          >
            {isLoginStep ? "دریافت کد تأیید" : "تأیید و ادامه"}
          </Button>
        </form>

        {!isLoginStep ? (
          <Link className="mt-4 block text-center text-sm text-zinc-500 hover:text-zinc-900" href={routes.login}>
            ویرایش شماره موبایل
          </Link>
        ) : null}
      </section>
    </main>
  );
}

export function AuthFlowForm({ audience, step }: { audience: AuthAudience; step: AuthStep }) {
  if (audience === "admin" && step === "login") return <AdminLoginForm />;
  if (audience === "admin" && step === "otp") return <AdminOtpForm />;
  return <DefaultAuthForm audience={audience} step={step} />;
}
