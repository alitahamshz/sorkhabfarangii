# معماری ارتباط با وب‌سرویس و TanStack Query

این سند معماری ارتباط فرانت‌اند سرخاب فرنگی با بک‌اند را توضیح می‌دهد. هدف این ساختار، ساده‌بودن استفاده در Server Component و Client Component و آماده‌بودن برای احراز هویت مبتنی بر cookie امن است.

## وضعیت فعلی: فاز اول

در فاز اول موارد زیر پیاده‌سازی شده‌اند:

- wrapper تایپ‌شده روی `fetch`
- مدیریت متمرکز URL، query string، JSON، timeout و خطا
- API client جدا برای سرور و مرورگر
- نصب و راه‌اندازی TanStack Query
- تنظیم رفتار پیش‌فرض Query و Mutation
- اتصال Provider به layout اصلی
- انتقال درخواست دسته‌بندی‌ها به API client سرور

احراز هویت، ذخیره token، session و اطلاعات کاربر عمداً به فاز دوم موکول شده‌اند.

## ساختار فایل‌ها

```text
src/
├── app/
│   ├── layout.tsx
│   └── providers.tsx
├── lib/
│   ├── api/
│   │   ├── api-error.ts
│   │   ├── client.ts
│   │   ├── index.ts
│   │   ├── request.ts
│   │   ├── server.ts
│   │   └── types.ts
│   └── query/
│       └── get-query-client.ts
└── features/
    └── <feature>/
        ├── api/
        ├── hooks/
        └── model/
```

هر endpoint باید در feature مربوط به خودش قرار بگیرد. برای مثال:

```text
features/products/api/get-products.ts
features/products/api/create-product.ts
features/products/hooks/use-products.ts
features/products/hooks/use-create-product.ts
features/products/model/types.ts
```

فایل‌های `server-only` نباید از barrel عمومی feature مانند `index.ts` export شوند؛ چون ممکن است یک Client Component با import کردن type یا component از همان barrel، ناخواسته کد سرور را وارد bundle کلاینت کند. فایل‌های API سروری باید با مسیر مستقیم import شوند.

## جریان درخواست‌ها

### Server Component

Server Component مستقیماً با `serverApi` به بک‌اند درخواست می‌زند:

```text
Server Component → serverApi → Backend API
```

این روش امکان استفاده از قابلیت‌های `revalidate` و `tags` در Next.js را حفظ می‌کند و round trip اضافه از Route Handler داخلی ایجاد نمی‌کند.

`serverApi` در هر درخواست نشست امن را بررسی می‌کند و اگر access token وجود داشته باشد، هدر زیر را به‌صورت خودکار اضافه می‌کند:

```http
Authorization: Bearer <access-token>
```

نیازی به خواندن یا ارسال دستی token در endpointهای feature نیست. اگر یک درخواست عمداً هدر `Authorization` اختصاصی داشته باشد، مقدار همان درخواست بر مقدار خودکار اولویت دارد.
برای جلوگیری از افشای token، مقدار خودکار فقط به آدرس اصلی تنظیم‌شده برای همان API client اضافه می‌شود و به URL مطلق با origin متفاوت ارسال نخواهد شد.

### Client Component

Client Component از TanStack Query و `clientApi` استفاده می‌کند:

```text
Client Component → TanStack Query → clientApi → Backend API
```

مسیر `clientApi` از `NEXT_PUBLIC_API_BASE_URL` خوانده می‌شود و درخواست را مستقیماً به بک‌اند می‌فرستد. access token از cookie خوانده می‌شود و `clientApi` آن را به‌صورت خودکار در هدر `Authorization` قرار می‌دهد؛ بنابراین استفاده از Route Handlerهای Next.js برای همه endpointهای محافظت‌شده الزامی نیست.

## متغیرهای محیطی

نمونه متغیرها در `.env.example` قرار دارد:

```env
API_BASE_URL=https://sorkhabfarangi.shop/api/v1
```

`API_BASE_URL` فقط روی سرور قابل استفاده است و نباید پیشوند `NEXT_PUBLIC_` داشته باشد.

`NEXT_PUBLIC_API_BASE_URL` آدرس API مورد استفاده مستقیم مرورگر است. بک‌اند باید origin فرانت‌اند و هدر `Authorization` را در تنظیمات CORS مجاز کرده باشد.

## تعریف endpoint سروری

```ts
import { serverApi } from "@/lib/api/server";

type Product = {
  id: number;
  title: string;
};

export function getProducts() {
  return serverApi.get<Product[]>("/products", {
    next: {
      revalidate: 300,
      tags: ["products"],
    },
  });
}
```

استفاده در Server Component:

```tsx
import { getProducts } from "@/features/products/api/get-products";

export default async function ProductsPage() {
  const products = await getProducts();
  return <div>{products.length}</div>;
}
```

## تعریف endpoint کلاینتی

```ts
import { clientApi } from "@/lib/api/client";

export type Product = {
  id: number;
  title: string;
};

export function getProducts() {
  return clientApi.get<Product[]>("/products");
}
```

در این مثال URL نهایی مرورگر `/api/products` خواهد بود.

## Query در Client Component

```ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/get-products";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: { search?: string }) =>
    [...productKeys.lists(), filters] as const,
};

export function useProducts(filters: { search?: string }) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => getProducts(),
  });
}
```

قواعد query key:

- keyها داخل همان feature تعریف شوند.
- از ساختار سلسله‌مراتبی استفاده شود.
- تمام پارامترهای مؤثر در پاسخ داخل key قرار بگیرند.
- از string پراکنده در کامپوننت‌ها استفاده نشود.

## Mutation در Client Component

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/lib/api/client";
import { productKeys } from "./use-products";

type CreateProductInput = {
  title: string;
};

function createProduct(input: CreateProductInput) {
  return clientApi.post<{ id: number }, CreateProductInput>(
    "/products",
    input,
  );
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
```

Mutationها به‌صورت پیش‌فرض retry نمی‌شوند تا عملیات ثبت یا پرداخت ناخواسته تکرار نشود.

## ارسال Query Parameter

```ts
clientApi.get("/products", {
  query: {
    page: 1,
    search: "رژ لب",
    brand: [2, 5],
  },
});
```

خروجی:

```text
/api/products?page=1&search=...&brand=2&brand=5
```

## آپلود فایل

```ts
const formData = new FormData();
formData.append("image", file);

clientApi.post("/uploads", formData);
```

برای `FormData` نباید `content-type` را دستی تنظیم کرد؛ مرورگر boundary را اضافه می‌کند.

## مدیریت خطا

تمام خطاهای HTTP، timeout و network به `ApiError` تبدیل می‌شوند:

```ts
import { isApiError } from "@/lib/api";

if (isApiError(error)) {
  console.log(error.status);
  console.log(error.code);
  console.log(error.message);
  console.log(error.data);
}
```

رفتار پیش‌فرض TanStack Query:

- خطاهای `4xx` مجدداً تلاش نمی‌شوند.
- خطاهای شبکه و `5xx` حداکثر یک بار تکرار می‌شوند.
- Mutationها تکرار خودکار ندارند.
- `staleTime` برابر ۶۰ ثانیه است.
- `gcTime` برابر ۵ دقیقه است.
- refetch هنگام focus شدن پنجره غیرفعال است.

این مقادیر را می‌توان برای هر Query جداگانه override کرد.

## مالکیت داده بین Server و Client

یک داده نباید هم‌زمان توسط Server Component و TanStack Query کلاینت مدیریت و نمایش داده شود، مگر اینکه hydration و سیاست هماهنگ‌سازی آن مشخص باشد. قاعده پیشنهادی:

- محتوای اولیه، SEO و داده کم‌تغییر: Server Component
- فیلتر زنده، pagination کلاینتی، polling و داده تعاملی: TanStack Query
- create/update/delete: `useMutation`

در صورت نیاز به SSR همراه TanStack Query، برای همان route از `HydrationBoundary` و `dehydrate` استفاده خواهد شد؛ نیازی نیست از ابتدا تمام صفحات را hydrate کنیم.

## احراز هویت و Session

احراز هویت OTP ادمین اکنون با این مسیر پیاده‌سازی شده است:

```text
Admin OTP Form
   ↓
useMutation
   ↓
POST /api/auth/admin/verify-otp (Next.js Route Handler)
   ↓
Backend OTP Verify API
   ↓
Token returned to Next.js only
   ↓
Set secure httpOnly cookie
   ↓
Return sanitized user/session to browser
```

اصول پیاده‌سازی:

- token در `localStorage` یا state کلاینت ذخیره نمی‌شود.
- cookie مربوط به access token برای ساخت هدر درخواست مستقیم در کلاینت قابل‌خواندن است؛ cookie امضاشده session همچنان `HttpOnly` باقی می‌ماند.
- `serverApi` توکن موجود در cookie امن را در هدر `Authorization: Bearer ...` درخواست‌های بک‌اند قرار می‌دهد.
- `clientApi` توکن مرورگر را در هدر `Authorization: Bearer ...` درخواست‌های مستقیم بک‌اند قرار می‌دهد.
- endpointی مانند `/api/auth/session` اطلاعات امن و خلاصه کاربر را برمی‌گرداند.
- وضعیت user/session با query مشخصی مانند `["auth", "session"]` مدیریت می‌شود.
- logout کوکی‌ها را روی سرور پاک و query مربوط به session را به `null` تغییر می‌دهد.
- نقش و دسترسی همیشه در سرور بررسی می‌شود؛ مخفی‌کردن دکمه در UI مجوز امنیتی محسوب نمی‌شود.

راهنمای کامل endpointها، متغیرهای محیطی و نمونه استفاده در Client و Server در [مستند Session](./auth-session.fa.md) قرار دارد.
