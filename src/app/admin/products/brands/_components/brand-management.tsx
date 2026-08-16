"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBrandColumns } from "./brand-columns";
import { BrandDrawer } from "./brand-drawer";
import { initialBrands, type Brand } from "./brands-data";

export function BrandManagement() {
  const [brands, setBrands] = useState(initialBrands);
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const filteredBrands = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fa-IR");
    if (!normalizedQuery) return brands;
    return brands.filter((brand) =>
      `${brand.name} ${brand.origin}`.toLocaleLowerCase("fa-IR").includes(normalizedQuery),
    );
  }, [brands, query]);

  function openCreateDrawer() {
    setEditingBrand(null);
    setDrawerOpen(true);
  }

  function openEditDrawer(brand: Brand) {
    setEditingBrand(brand);
    setDrawerOpen(true);
  }

  function saveBrand(values: Omit<Brand, "id" | "productCount" | "status">) {
    if (editingBrand) {
      setBrands((current) =>
        current.map((brand) => (brand.id === editingBrand.id ? { ...brand, ...values } : brand)),
      );
      setMessage(`برند «${values.name}» ویرایش شد.`);
      return;
    }

    setBrands((current) => [
      ...current,
      {
        ...values,
        id: `brand-${Date.now()}`,
        productCount: 0,
        status: "active",
      },
    ]);
    setMessage(`برند «${values.name}» اضافه شد.`);
  }

  const columns = useMemo(
    () =>
      createBrandColumns(
        (brand) => setMessage(`برند «${brand.name}» انتخاب شد.`),
        openEditDrawer,
        (brand) => {
          setBrands((current) => current.filter((item) => item.id !== brand.id));
          setMessage(`برند «${brand.name}» حذف شد.`);
        },
      ),
    [],
  );

  return (
    <div className="w-full min-w-0 space-y-4 p-4 lg:p-6">
      <section
        aria-label="خلاصه برندها"
        className="flex h-[60px] items-center justify-start gap-2 rounded-lg border border-zinc-200 bg-white px-4"
      >
        <span className="grid size-7 place-items-center rounded-full bg-secondary-50 text-xs font-semibold text-secondary-500">
          {brands.length.toLocaleString("fa-IR")}
        </span>
        <span className="text-xs text-zinc-500">برند ثبت شده</span>
      </section>

      {message ? (
        <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm text-emerald-700" role="status">
          <span>{message}</span>
          <Button aria-label="بستن پیام" onClick={() => setMessage(null)} size="icon-sm" type="button" variant="ghost">
            <X />
          </Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">جستجوی برند</span>
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600" size={22} strokeWidth={1.5} />
          <Input
            className="h-[52px] rounded-lg border-zinc-200 bg-white pr-12 shadow-sm"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جستجو"
            type="search"
            value={query}
          />
        </label>
        <Button className="h-[52px] gap-3 px-6 sm:w-36" onClick={openCreateDrawer} type="button">
          <Plus size={21} />
          افزودن برند
        </Button>
      </div>

      <DataTable
        ariaLabel="لیست برندها"
        columns={columns}
        data={filteredBrands}
        emptyMessage="برندی با این مشخصات پیدا نشد."
        enableRowSelection={false}
        getRowId={(brand) => brand.id}
        pageSize={8}
      />

      <BrandDrawer
        brand={editingBrand}
        onOpenChange={setDrawerOpen}
        onSave={saveBrand}
        open={drawerOpen}
      />
    </div>
  );
}
