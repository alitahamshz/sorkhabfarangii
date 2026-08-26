"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Filter, Plus, Search, Trash2 } from "lucide-react";
import { DataTable, type DataTableBulkAction } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProductColumns } from "./product-columns";
import { initialProducts, type Product, type ProductStatus } from "./products-data";

const statusLabels: Record<ProductStatus | "all", string> = {
  all: "همه وضعیت‌ها",
  active: "فعال",
  "low-stock": "کم‌موجود",
  unavailable: "ناموجود",
};

export function ProductList() {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProductStatus | "all">("all");
  const [message, setMessage] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fa-IR");
    return products.filter((product) => {
      const matchesStatus = status === "all" || product.status === status;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [product.name, product.brand, product.category, product.id]
          .join(" ")
          .toLocaleLowerCase("fa-IR")
          .includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [products, query, status]);

  const removeProduct = (product: Product) => {
    setProducts((current) => current.filter((item) => item.id !== product.id));
    setMessage(`«${product.name}» حذف شد.`);
  };

  const columns = useMemo(
    () => createProductColumns(removeProduct, (product) => setMessage(`ویرایش «${product.name}» انتخاب شد.`)),
    [],
  );

  const bulkActions = useMemo<DataTableBulkAction<Product>[]>(
    () => [
      {
        label: "فعال کردن",
        icon: <CheckCircle2 />,
        onClick: (selectedRows, clearSelection) => {
          const selectedIds = new Set(selectedRows.map((product) => product.id));
          setProducts((current) =>
            current.map((product) =>
              selectedIds.has(product.id) ? { ...product, status: "active" as const } : product,
            ),
          );
          setMessage(`${selectedRows.length.toLocaleString("fa-IR")} محصول فعال شد.`);
          clearSelection();
        },
      },
      {
        label: "حذف گروهی",
        icon: <Trash2 />,
        variant: "destructive",
        onClick: (selectedRows, clearSelection) => {
          const selectedIds = new Set(selectedRows.map((product) => product.id));
          setProducts((current) => current.filter((product) => !selectedIds.has(product.id)));
          setMessage(`${selectedRows.length.toLocaleString("fa-IR")} محصول حذف شد.`);
          clearSelection();
        },
      },
    ],
    [],
  );

  const summary = [
    { label: "کل محصولات", value: products.length, color: "bg-secondary-50 text-secondary-500" },
    { label: "فعال", value: products.filter((product) => product.status === "active").length, color: "bg-emerald-50 text-emerald-600" },
    { label: "کم‌موجود", value: products.filter((product) => product.status === "low-stock").length, color: "bg-orange-50 text-orange-500" },
    { label: "ناموجود", value: products.filter((product) => product.status === "unavailable").length, color: "bg-red-50 text-red-500" },
  ];

  return (
    <div className="w-full min-w-0 space-y-4 p-4 lg:p-6">
      <section aria-label="خلاصه محصولات" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {summary.map((item) => (
          <article className="flex h-16 items-center justify-start gap-2 rounded-lg border border-zinc-200 bg-white px-4" key={item.label}>
            <span className={`grid size-7 place-items-center rounded-full text-xs font-semibold ${item.color}`}>
              {item.value.toLocaleString("fa-IR")}
            </span>
            <span className="text-xs text-zinc-500">{item.label}</span>
          </article>
        ))}
      </section>

      {message ? (
        <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm text-emerald-700" role="status">
          <span>{message}</span>
          <Button aria-label="بستن پیام" onClick={() => setMessage(null)} size="xs" type="button" variant="ghost">بستن</Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">جستجوی محصول</span>
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <Input
            className="h-12 bg-white pr-11"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جستجوی محصول یا برند..."
            type="search"
            value={query}
          />
        </label>
        <label className="relative sm:w-44">
          <span className="sr-only">فیلتر وضعیت</span>
          <Filter className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 text-zinc-500" size={18} />
          <select
            className="h-12 w-full appearance-none rounded-lg border border-zinc-200 bg-white pr-10 pl-3 text-sm text-zinc-700 outline-none focus:border-zinc-400 focus:ring-3 focus:ring-zinc-200/60"
            onChange={(event) => setStatus(event.target.value as ProductStatus | "all")}
            value={status}
          >
            {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <Button className="admin-page-action px-5" onClick={() => setMessage("فرم افزودن محصول در مرحله بعد به این دکمه متصل می‌شود.")} type="button">
          <Plus />
          افزودن محصول
        </Button>
      </div>

      <DataTable
        ariaLabel="لیست محصولات"
        bulkActions={bulkActions}
        columns={columns}
        data={filteredProducts}
        emptyMessage="محصولی با این مشخصات پیدا نشد."
        getRowId={(product) => product.id}
        pageSize={8}
      />
    </div>
  );
}
