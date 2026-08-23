"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryDrawer } from "./category-drawer";
import { initialCategories, type Category } from "./categories-data";

function collectDescendantIds(categories: Category[], categoryId: string) {
  const ids = new Set([categoryId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const category of categories) {
      if (category.parentId && ids.has(category.parentId) && !ids.has(category.id)) {
        ids.add(category.id);
        changed = true;
      }
    }
  }
  return ids;
}

export function CategoryCatalog() {
  const [categories, setCategories] = useState(initialCategories);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const rootCategories = useMemo(
    () => categories.filter((category) => category.parentId === null),
    [categories],
  );
  const largestProductCount = Math.max(...rootCategories.map((category) => category.productCount), 1);

  function openCreateDrawer() {
    setEditingCategory(null);
    setDrawerOpen(true);
  }

  function openEditDrawer(category: Category) {
    setEditingCategory(category);
    setDrawerOpen(true);
  }

  function removeCategory(category: Category) {
    if (!window.confirm(`دسته‌بندی «${category.name}» و همه زیر‌دسته‌های آن حذف شود؟`)) return;
    setCategories((current) => {
      const ids = collectDescendantIds(current, category.id);
      return current.filter((item) => !ids.has(item.id));
    });
    setMessage(`دسته‌بندی «${category.name}» حذف شد.`);
  }

  function saveCategory(values: Omit<Category, "id" | "icon" | "productCount">) {
    if (editingCategory) {
      setCategories((current) =>
        current.map((category) =>
          category.id === editingCategory.id ? { ...category, ...values } : category,
        ),
      );
      setMessage(`دسته‌بندی «${values.name}» ویرایش شد.`);
      return;
    }
    setCategories((current) => [
      ...current,
      { ...values, id: `category-${Date.now()}`, icon: "✨", productCount: 0 },
    ]);
    setMessage(`دسته‌بندی «${values.name}» اضافه شد.`);
  }

  return (
    <div className="w-full min-w-0 p-4 lg:p-6">
      <section className="min-h-[calc(100vh-128px)] overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="flex min-h-[76px] flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-5 py-3 lg:px-6">
          <h2 className="admin-page-title font-semibold text-zinc-800">کاتالوگ محصولات</h2>
          <Button className="admin-page-action gap-2 px-4" onClick={openCreateDrawer} type="button">
            <Plus size={21} />
            دسته بندی جدید
          </Button>
        </div>

        {message ? (
          <div className="mx-5 mt-4 flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 lg:mx-6" role="status">
            <span>{message}</span>
            <Button aria-label="بستن پیام" onClick={() => setMessage(null)} size="icon-sm" type="button" variant="ghost"><X /></Button>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:p-6 xl:grid-cols-3">
          {rootCategories.map((category) => (
            <article className="group relative min-h-[184px] overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-colors hover:bg-zinc-50 focus-within:bg-zinc-50" key={category.id}>
              <Link
                aria-label={`مشاهده دسته‌بندی ${category.name}`}
                className="flex h-full min-h-[184px] flex-col p-5 outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
                href={`/admin/products/categories/${category.id}`}
              >
                <span
                  aria-hidden="true"
                  className="grid size-11 place-items-center self-start rounded-2xl bg-zinc-100 bg-cover bg-center text-xl"
                  style={category.imageUrl ? { backgroundImage: `url(${category.imageUrl})` } : undefined}
                >
                  {!category.imageUrl ? category.icon : null}
                </span>
                <h3 className="mt-3 text-base font-semibold text-zinc-800">{category.name}</h3>
                <p className="mt-2 truncate text-xs text-zinc-500">{category.description}</p>
                <div className="mt-auto flex items-center gap-3 pt-3" dir="ltr">
                  <span className="shrink-0 rounded-full bg-secondary-50 px-3 py-1 text-[11px] font-medium text-secondary-500" dir="rtl">
                    {category.productCount.toLocaleString("fa-IR")} محصول
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200">
                    <span className="block h-full rounded-full bg-secondary-500" style={{ width: `${Math.max(18, (category.productCount / largestProductCount) * 64)}%` }} />
                  </span>
                </div>
              </Link>

              <div className="absolute left-4 top-4 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                <Button aria-label={`ویرایش ${category.name}`} className="text-zinc-600 hover:text-primary-500" onClick={() => openEditDrawer(category)} size="icon" type="button" variant="ghost">
                  <Image alt="" aria-hidden="true" height={32} src="/icon/adminDashboard/editBtn.svg" width={32} />
                </Button>
                <Button aria-label={`حذف ${category.name}`} className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => removeCategory(category)} size="icon" type="button" variant="ghost">
                  <Image alt="" aria-hidden="true" height={32} src="/icon/adminDashboard/deleteBtn.svg" width={32} />
                </Button>
              </div>
            </article>
          ))}

          <button className="flex min-h-[184px] flex-col items-center justify-center rounded-2xl border border-dashed border-primary-100 bg-white text-zinc-800 transition-colors hover:border-secondary-300 hover:bg-secondary-50/30" onClick={openCreateDrawer} type="button">
            <span className="grid size-12 place-items-center rounded-2xl bg-secondary-50 text-secondary-500"><Plus size={22} strokeWidth={1.5} /></span>
            <span className="mt-4 text-sm font-medium">دسته بندی جدید</span>
          </button>
        </div>
      </section>

      <CategoryDrawer categories={categories} category={editingCategory} onOpenChange={setDrawerOpen} onSave={saveCategory} open={drawerOpen} />
    </div>
  );
}
