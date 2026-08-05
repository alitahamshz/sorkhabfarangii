# راهنمای جدول داده قابل استفاده مجدد

کامپوننت `DataTable` در مسیر `src/components/data-table` قرار دارد و رندر جدول، انتخاب ردیف‌ها، عملیات گروهی، حالت خالی و صفحه‌بندی سمت کاربر را مدیریت می‌کند. تعریف داده‌ها، ستون‌ها و منطق عملیات هر صفحه بیرون از این کامپوننت باقی می‌ماند.

## قابلیت‌ها

- مبتنی بر `@tanstack/react-table` نسخه ۸
- انتخاب یک ردیف یا انتخاب همه رکوردهای داده فعلی
- نمایش وضعیت نیمه‌انتخاب‌شده در checkbox سربرگ
- اجرای عملیات گروهی روی مدل‌های اصلی و پاک‌کردن انتخاب‌ها پس از عملیات
- صفحه‌بندی سمت کاربر با اندازه صفحه قابل تنظیم
- پشتیبانی از شناسه پایدار برای حفظ انتخاب رکوردها
- جدول افقی scrollable در عرض‌های کوچک
- امکان غیرفعال‌کردن انتخاب برای همه یا بعضی ردیف‌ها

## استفاده پایه

```tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

type User = {
  id: string;
  name: string;
  phone: string;
};

const columns: ColumnDef<User, unknown>[] = [
  { accessorKey: "name", header: "نام" },
  { accessorKey: "phone", header: "شماره تماس" },
];

export function UsersTable({ users }: { users: User[] }) {
  return (
    <DataTable
      ariaLabel="لیست کاربران"
      columns={columns}
      data={users}
      getRowId={(user) => user.id}
      pageSize={10}
    />
  );
}
```

`getRowId` باید یک شناسه یکتا و پایدار برگرداند. از index آرایه استفاده نکنید؛ چون بعد از فیلتر، حذف یا مرتب‌سازی ممکن است انتخاب به رکورد اشتباهی منتقل شود.

## عملیات گروهی

```tsx
import { Trash2 } from "lucide-react";
import type { DataTableBulkAction } from "@/components/data-table";

const actions: DataTableBulkAction<User>[] = [
  {
    label: "حذف گروهی",
    icon: <Trash2 />,
    variant: "destructive",
    onClick: async (selectedUsers, clearSelection) => {
      await api.users.removeMany(selectedUsers.map((user) => user.id));
      clearSelection();
    },
  },
];

<DataTable
  ariaLabel="لیست کاربران"
  bulkActions={actions}
  columns={columns}
  data={users}
  getRowId={(user) => user.id}
/>
```

تابع `onClick` دو ورودی دارد:

1. `selectedRows`: آرایه رکوردهای اصلی انتخاب‌شده، نه rowهای داخلی TanStack.
2. `clearSelection`: تابعی برای پاک‌کردن انتخاب‌ها بعد از موفقیت عملیات.

Checkbox سربرگ همه رکوردهای موجود در `data` را انتخاب می‌کند، نه فقط صفحه قابل مشاهده. بنابراین عملیات گروهی روی انتخاب‌های صفحات مختلف نیز اجرا می‌شود.

## انتخاب شرطی یا غیرفعال

```tsx
// جدول بدون قابلیت انتخاب
<DataTable enableRowSelection={false} {...props} />

// فقط کاربران فعال قابل انتخاب باشند
<DataTable
  enableRowSelection={(row) => row.original.status === "active"}
  {...props}
/>
```

## کلاس اختصاصی ستون

برای کنترل عرض یا ظاهر یک ستون از `DataTableColumnMeta` استفاده کنید:

```tsx
import type { DataTableColumnMeta } from "@/components/data-table";

const columns: ColumnDef<User, unknown>[] = [
  {
    accessorKey: "name",
    header: "نام",
    meta: {
      headerClassName: "min-w-48",
      cellClassName: "font-medium",
    } satisfies DataTableColumnMeta,
  },
];
```

## API کامپوننت

| prop | نوع | توضیح |
| --- | --- | --- |
| `ariaLabel` | `string` | نام دسترس‌پذیر جدول؛ اجباری |
| `columns` | `ColumnDef<TData, unknown>[]` | تعریف ستون‌های TanStack؛ اجباری |
| `data` | `TData[]` | داده فعلی جدول؛ اجباری |
| `getRowId` | `(row: TData) => string` | تولید شناسه پایدار؛ اجباری |
| `bulkActions` | `DataTableBulkAction<TData>[]` | عملیات نمایش‌داده‌شده بعد از انتخاب |
| `enableRowSelection` | `boolean \| (row) => boolean` | فعال یا شرطی‌کردن انتخاب؛ پیش‌فرض `true` |
| `pageSize` | `number` | تعداد رکورد هر صفحه؛ پیش‌فرض `8` |
| `emptyMessage` | `string` | پیام حالت بدون داده |
| `tableClassName` | `string` | کلاس تکمیلی برای عنصر table |

## صفحه‌بندی سمت سرور

پیاده‌سازی فعلی برای داده‌ای است که کامل در `data` موجود باشد. اگر API فقط داده یک صفحه را برمی‌گرداند، «انتخاب همه» طبیعتاً فقط همان رکوردهای دریافت‌شده را می‌شناسد. برای انتخاب همه نتایج سمت سرور باید شناسه‌ها یا یک توکن انتخاب از API دریافت شود و وضعیت selection به لایه صفحه منتقل شود؛ این رفتار بهتر است به‌عنوان حالت جداگانه به API جدول اضافه شود و با انتخاب سمت کاربر ترکیب نشود.

## نمونه موجود در پروژه

صفحه `src/app/admin/products/page.tsx` یک نمونه کامل است. تعریف مدل و داده نمونه در `products-data.ts`، ستون‌های اختصاصی در `product-columns.tsx` و جستجو، فیلتر و عملیات گروهی در `product-list.tsx` قرار دارند.
