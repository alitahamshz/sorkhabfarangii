"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { createBrandColumns } from "./brand-columns";
import { BrandDeleteDialog } from "./brand-delete-dialog";
import { BrandDrawer } from "./brand-drawer";
import {
  BrandFilterSheet,
  type BrandAvailabilityFilter,
  type BrandStatusFilter,
} from "./brand-filter-sheet";
import { BrandViewSheet } from "./brand-view-sheet";
import { initialBrands, type Brand } from "./brands-data";

export function BrandManagement() {
  const isMobile = useIsMobile();
  const [brands, setBrands] = useState(initialBrands);
  const [query, setQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<BrandAvailabilityFilter>("all");
  const [statusFilter, setStatusFilter] = useState<BrandStatusFilter>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [brandToView, setBrandToView] = useState<Brand | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const filteredBrands = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fa-IR");
    return brands.filter((brand) => {
      const matchesQuery = !normalizedQuery ||
        `${brand.name} ${brand.latinName ?? ""} ${brand.origin}`
          .toLocaleLowerCase("fa-IR")
          .includes(normalizedQuery);
      const matchesAvailability = availabilityFilter === "all" ||
        (availabilityFilter === "in-stock" ? brand.productCount > 0 : brand.productCount === 0);
      const matchesStatus = statusFilter === "all" || brand.status === statusFilter;

      return matchesQuery && matchesAvailability && matchesStatus;
    });
  }, [availabilityFilter, brands, query, statusFilter]);

  const hasActiveFilters = availabilityFilter !== "all" || statusFilter !== "all";

  function openCreateDrawer() {
    setEditingBrand(null);
    setDrawerOpen(true);
  }

  function openEditDrawer(brand: Brand) {
    setEditingBrand(brand);
    setDrawerOpen(true);
  }

  function saveBrand(values: Omit<Brand, "id" | "productCount">) {
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
      },
    ]);
    setMessage(`برند «${values.name}» اضافه شد.`);
  }

  const columns = useMemo(
    () =>
      createBrandColumns(
        (brand) => {
          if (isMobile) {
            setBrandToView(brand);
            return;
          }
          setMessage(`برند «${brand.name}» انتخاب شد.`);
        },
        openEditDrawer,
        setBrandToDelete,
      ),
    [isMobile],
  );

  function removeBrand(brand: Brand) {
    setBrands((current) => current.filter((item) => item.id !== brand.id));
    setMessage(`برند «${brand.name}» حذف شد.`);
    setBrandToDelete(null);
  }

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

      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-3 md:border-0 md:pb-0">
        <label className="relative hidden min-w-0 flex-1 md:block">
          <span className="sr-only">جستجوی برند</span>
          <Image alt="" aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2" height={24} src="/icon/adminDashboard/search.svg" width={24} />
          <Input
            className="h-[52px] rounded-lg border-zinc-200 bg-white pr-12 shadow-none"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جستجو"
            type="search"
            value={query}
          />
        </label>

        <div className="flex items-center gap-2 md:contents">
          <Button
            aria-expanded={mobileSearchOpen}
            aria-label="جستجوی برند"
            className="size-[52px] rounded-lg border-zinc-200 bg-white text-zinc-500 shadow-none hover:bg-zinc-50 md:hidden"
            onClick={() => setMobileSearchOpen((current) => !current)}
            size="icon"
            type="button"
            variant="outline"
          >
            <Image alt="" aria-hidden="true" height={24} src="/icon/adminDashboard/search.svg" width={24} />
          </Button>
          <Button
            aria-label="فیلتر برندها"
            className={`h-[52px] w-[52px] rounded-lg border-zinc-200 bg-white shadow-none hover:bg-zinc-50 md:w-32 ${
              hasActiveFilters ? "border-primary-200 text-primary-500" : "text-zinc-500"
            }`}
            onClick={() => setFilterOpen(true)}
            type="button"
            variant="outline"
          >
            <Image alt="" aria-hidden="true" height={24} src="/icon/adminDashboard/filter.svg" width={24} />
            <span className="hidden md:inline">فیلتر</span>
          </Button>
        </div>

        <Button className="admin-page-action h-[52px]! gap-2 px-4 md:w-40" onClick={openCreateDrawer} type="button">
          <Plus size={21} />
          برند جدید
        </Button>
      </div>

      {mobileSearchOpen ? (
        <label className="relative block md:hidden">
          <span className="sr-only">جستجوی برند</span>
          <Image alt="" aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2" height={24} src="/icon/adminDashboard/search.svg" width={24} />
          <Input
            autoFocus
            className="h-[52px] rounded-lg border-zinc-200 bg-white pr-12 shadow-none"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جستجوی برند..."
            type="search"
            value={query}
          />
        </label>
      ) : null}

      <DataTable
        ariaLabel="لیست برندها"
        columns={columns}
        data={filteredBrands}
        emptyMessage="برندی با این مشخصات پیدا نشد."
        enableRowSelection={false}
        getRowId={(brand) => brand.id}
        pageSize={8}
        tableClassName="min-w-0 table-fixed md:min-w-[900px] md:table-auto"
      />

      <BrandDrawer
        brand={editingBrand}
        onOpenChange={setDrawerOpen}
        onSave={saveBrand}
        open={drawerOpen}
      />
      <BrandDeleteDialog
        brand={brandToDelete}
        onCancel={() => setBrandToDelete(null)}
        onConfirm={removeBrand}
      />
      <BrandViewSheet
        brand={brandToView}
        isMobile={isMobile}
        onClose={() => setBrandToView(null)}
      />
      <BrandFilterSheet
        availability={availabilityFilter}
        onAvailabilityChange={setAvailabilityFilter}
        onOpenChange={setFilterOpen}
        onStatusChange={setStatusFilter}
        open={filterOpen}
        status={statusFilter}
      />
    </div>
  );
}
