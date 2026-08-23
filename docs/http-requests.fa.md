# راهنمای درخواست HTTP در کلاینت و سرور

این پروژه برای درخواست‌های HTTP یک wrapper تایپ‌شده روی `fetch` دارد. این wrapper در `src/lib/api/request.ts` پیاده‌سازی شده و مسئول ساخت URL، query string، تبدیل body به JSON، timeout، مدیریت خطا و افزودن توکن دسترسی است.

## انتخاب مسیر درست

| نیاز | ابزار پیشنهادی |
| --- | --- |
| داده اولیه، SEO یا داده کم‌تغییر | `serverApi` در Server Component |
| داده تعاملی، فیلتر، صفحه‌بندی یا polling | `clientApi` همراه TanStack Query |
| ایجاد، ویرایش و حذف از UI | `clientApi` همراه `useMutation` |
| عملیات حساس مانند ورود، کوکی امن یا پرداخت | Route Handler داخلی Next.js و سپس `serverApi` |

`serverApi` از `API_BASE_URL` استفاده می‌کند و توکن session امن سمت سرور را خودکار به header درخواست اضافه می‌کند. `clientApi` از `NEXT_PUBLIC_API_BASE_URL` استفاده می‌کند و برای تماس مستقیم مرورگر با بک‌اند به تنظیم صحیح CORS نیاز دارد.

## تعریف نوع‌ها و توابع API

هر endpoint را در پوشه feature خودش تعریف کنید؛ برای نمونه `src/features/products/api/products.ts`:

```ts
import { clientApi } from "@/lib/api/client";

export type Product = {
  id: number;
  title: string;
  price: number;
};

export type CreateProductInput = {
  title: string;
  price: number;
};

export type UpdateProductInput = Partial<CreateProductInput>;

// GET /products?page=1&search=...
export function getProducts(page = 1, search?: string) {
  return clientApi.get<Product[]>("/products", {
    query: { page, search },
  });
}

// POST /products
export function createProduct(input: CreateProductInput) {
  return clientApi.post<Product, CreateProductInput>("/products", input);
}

// PATCH /products/:id
export function updateProduct(id: number, input: UpdateProductInput) {
  return clientApi.patch<Product, UpdateProductInput>(
    `/products/${id}`,
    input,
  );
}

// DELETE /products/:id
export function deleteProduct(id: number) {
  return clientApi.delete<void>(`/products/${id}`);
}
```

بدنهٔ object به JSON تبدیل می‌شود و header مناسب خودکار اضافه می‌شود. برای `FormData` نباید `content-type` را دستی تنظیم کنید:

```ts
const formData = new FormData();
formData.append("image", file);

await clientApi.post("/uploads", formData);
```

## GET در Client Component

برای خواندن داده از `useQuery` استفاده کنید. همه پارامترهایی که پاسخ را تغییر می‌دهند باید در `queryKey` باشند.

```ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/products";

export const productKeys = {
  all: ["products"] as const,
  list: (page: number, search?: string) =>
    [...productKeys.all, "list", { page, search }] as const,
};

export function useProducts(page: number, search?: string) {
  return useQuery({
    queryKey: productKeys.list(page, search),
    queryFn: () => getProducts(page, search),
  });
}
```

```tsx
"use client";

const { data: products = [], isPending, error } = useProducts(1, "رژ");

if (isPending) return <p>در حال دریافت...</p>;
if (error) return <p>دریافت محصولات ناموفق بود.</p>;

return <p>{products.length} محصول</p>;
```

## POST، PATCH و DELETE در Client Component

برای عملیاتی که داده را تغییر می‌دهند از `useMutation` استفاده کنید. بعد از موفقیت، queryهای مربوط به محصولات را invalid کنید تا فهرست دوباره دریافت شود.

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  type UpdateProductInput,
} from "../api/products";
import { productKeys } from "./use-products";

export function useProductMutations() {
  const queryClient = useQueryClient();
  const refreshProducts = () =>
    queryClient.invalidateQueries({ queryKey: productKeys.all });

  return {
    create: useMutation({
      mutationFn: createProduct,
      onSuccess: refreshProducts,
    }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: number; input: UpdateProductInput }) =>
        updateProduct(id, input),
      onSuccess: refreshProducts,
    }),
    remove: useMutation({
      mutationFn: deleteProduct,
      onSuccess: refreshProducts,
    }),
  };
}
```

```tsx
const { create, update, remove } = useProductMutations();

create.mutate({ title: "رژ لب", price: 250000 });
update.mutate({ id: 12, input: { price: 280000 } });
remove.mutate(12);
```

Mutationهای پروژه به شکل پیش‌فرض retry نمی‌شوند تا ثبت یا حذف ناخواسته تکرار نشود.

## درخواست در Server Component

برای دریافت داده‌ای که باید روی سرور رندر شود، از `serverApi` استفاده کنید. فایل endpoint سروری را مستقیم import کنید؛ آن را از barrel عمومی feature export نکنید.

```ts
// src/features/products/api/get-products.server.ts
import { serverApi } from "@/lib/api/server";

type Product = {
  id: number;
  title: string;
};

export function getProductsOnServer() {
  return serverApi.get<Product[]>("/products", {
    next: {
      revalidate: 300,
      tags: ["products"],
    },
  });
}
```

```tsx
// src/app/products/page.tsx
import { getProductsOnServer } from "@/features/products/api/get-products.server";

export default async function ProductsPage() {
  const products = await getProductsOnServer();
  return <p>{products.length} محصول</p>;
}
```

متدهای نوشتنی در سرور نیز همان API را دارند. برای آن‌ها معمولاً cache را غیرفعال کنید:

```ts
await serverApi.post("/products", { title: "کرم", price: 180000 }, {
  cache: "no-store",
});

await serverApi.patch("/products/12", { price: 200000 }, {
  cache: "no-store",
});

await serverApi.delete("/products/12", {
  cache: "no-store",
});
```

## Route Handler داخلی Next.js

وقتی درخواست از مرورگر نباید مستقیم به بک‌اند برسد، یک Route Handler بسازید. الگوی فعلی ورود OTP پروژه نیز همین مسیر را استفاده می‌کند: Client → `/api` داخلی Next.js → Backend.

```ts
// src/app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { serverApi } from "@/lib/api/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const input = await request.json();

  const product = await serverApi.patch(`/products/${id}`, input, {
    cache: "no-store",
  });

  return NextResponse.json(product);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  await serverApi.delete(`/products/${id}`, { cache: "no-store" });
  return new NextResponse(null, { status: 204 });
}
```

برای درخواست به این route از کلاینت، یک API داخلی با `baseUrl: "/api"` بسازید؛ همان الگوی `send-admin-otp.ts` و `verify-admin-otp.ts` در پروژه:

```ts
import { createApiClient } from "@/lib/api";

const nextApi = createApiClient({
  baseUrl: "/api",
  credentials: "include",
});

await nextApi.patch("/products/12", { title: "عنوان جدید" });
await nextApi.delete("/products/12");
```

## مدیریت خطا

همه خطاهای HTTP، timeout و network به `ApiError` تبدیل می‌شوند:

```ts
import { isApiError } from "@/lib/api";

try {
  await createProduct({ title: "رژ لب", price: 250000 });
} catch (error) {
  if (isApiError(error)) {
    console.log(error.status);  // مانند 400 یا 500
    console.log(error.code);    // مانند REQUEST_TIMEOUT
    console.log(error.message);
    console.log(error.data);    // پاسخ خام بک‌اند
  }
}
```

## نکته‌های مهم

- token را دستی در endpointهای feature ارسال نکنید؛ `clientApi` و `serverApi` در صورت وجود آن را اضافه می‌کنند.
- یک داده را بدون سیاست hydration مشخص، هم در Server Component و هم با TanStack Query مدیریت نکنید.
- برای `GET`های client از `useQuery` و برای `POST`/`PATCH`/`DELETE` از `useMutation` استفاده کنید.
- درخواست مستقیم مرورگر به بک‌اند نیازمند CORS مناسب برای origin فرانت‌اند و header `Authorization` است.
- برای اعتبارسنجی ورودی، کوکی `HttpOnly` و منطق حساس از Route Handler استفاده کنید.
