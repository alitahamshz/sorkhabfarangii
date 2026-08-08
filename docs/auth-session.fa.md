# احراز هویت OTP و Session

این پروژه برای ادمین یک Session امن مشابه الگوی Auth.js دارد. توکن دریافتی از PHP فقط در Route Handler سمت Next.js پردازش و داخل cookie از نوع `HttpOnly` ذخیره می‌شود؛ بنابراین JavaScript مرورگر به access token دسترسی ندارد.

## جریان ورود

```text
Admin OTP Form
  → POST /api/auth/admin/verify-otp
  → POST {API_BASE_URL}/main_admin/otpVerify/index.php
  → دریافت token و اطلاعات کاربر از PHP
  → ساخت Session امضاشده و تنظیم cookieهای HttpOnly
  → بازگرداندن اطلاعات عمومی Session به کلاینت
```

پاسخ قابل‌مشاهده در مرورگر فقط این ساختار را دارد:

```ts
type AuthSession = {
  user: {
    id: string;
    name: string;
    family: string;
    level: string;
    audience: "admin" | "customer" | "seller";
  };
  expires: string;
};
```

فیلد `accessToken` عمداً در پاسخ کلاینت وجود ندارد.

## متغیرهای محیطی

```env
API_BASE_URL=https://sorkhabfarangi.shop/api/v1
AUTH_SECRET=a-long-random-production-secret
AUTH_SESSION_MAX_AGE=604800
```

- `AUTH_SECRET` برای امضای Session استفاده می‌شود و در production الزامی است.
- `AUTH_SESSION_MAX_AGE` مدت نشست بر حسب ثانیه است و مقدار پیش‌فرض آن ۷ روز است.
- برای ساخت secret می‌توان از `openssl rand -base64 32` استفاده کرد.
- بعد از تغییر متغیرهای محیطی، سرور Next.js باید restart شود.

## دسترسی در Client Component

```tsx
"use client";

import { useSession } from "@/features/auth";

export function ProfileName() {
  const { data: session, status, update } = useSession();

  if (status === "loading") return <span>در حال بارگذاری...</span>;
  if (status === "unauthenticated") return <span>وارد نشده‌اید</span>;

  return (
    <div>
      <span>{session.user.name} {session.user.family}</span>
      <button onClick={() => update()} type="button">به‌روزرسانی نشست</button>
    </div>
  );
}
```

مقادیر `status` عبارت‌اند از `loading`، `authenticated` و `unauthenticated`.

## خروج در Client Component

```tsx
"use client";

import { useSignOut } from "@/features/auth";

export function LogoutButton() {
  const logout = useSignOut();

  return (
    <button disabled={logout.isPending} onClick={() => logout.mutate()} type="button">
      خروج
    </button>
  );
}
```

## دسترسی در Server Component

```tsx
import { redirect } from "next/navigation";
import { getServerSession } from "@/features/auth/server/session";

export default async function AdminPage() {
  const session = await getServerSession();

  if (!session || session.user.audience !== "admin") {
    redirect("/auth/admin/login");
  }

  return <h1>سلام {session.user.name}</h1>;
}
```

`getServerSession()` در سمت سرور علاوه بر `user` و `expires`، فیلد `accessToken` را نیز برمی‌گرداند.

## استفاده از توکن در Route Handler یا کد سرور

```ts
import { getServerSession } from "@/features/auth/server/session";
import { serverApi } from "@/lib/api/server";

const session = await getServerSession();
if (!session) throw new Error("Unauthorized");

const result = await serverApi.get("/main_admin/profile", {
  headers: {
    Authorization: `Bearer ${session.accessToken}`,
  },
});
```

نام header توکن باید در صورت تفاوت قرارداد PHP تغییر کند.

## endpointهای داخلی

| متد | مسیر | کاربرد |
|---|---|---|
| `POST` | `/api/auth/admin/login` | ارسال OTP |
| `POST` | `/api/auth/admin/verify-otp` | تأیید OTP و ایجاد Session |
| `GET` | `/api/auth/session` | دریافت اطلاعات عمومی Session |
| `POST` | `/api/auth/logout` | حذف cookieهای احراز هویت |

## نکات امنیتی

- access token را در `localStorage`، `sessionStorage` یا state عمومی React ذخیره نکنید.
- cookieهای توکن و Session با `HttpOnly` و `SameSite=Lax` تنظیم می‌شوند و در production گزینه `Secure` دارند.
- اطلاعات Session با HMAC-SHA256 امضا شده‌اند و به hash توکن متصل هستند تا دست‌کاری یا جابه‌جایی cookie تشخیص داده شود.
- بررسی نقش باید در layout، Server Component یا Route Handler انجام شود. وضعیت نمایش UI به‌تنهایی کنترل دسترسی نیست.
- در حال حاضر refresh token پیاده‌سازی نشده است. پس از پایان اعتبار توکن بک‌اند، باید Session پاک و ورود مجدد انجام شود یا قرارداد refresh token اضافه شود.
