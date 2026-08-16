"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Filter, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildCategoryTree, initialCategories, type Category, type CategoryNode } from "./categories-data";
import { createCategoryColumns } from "./category-columns";
import { CategoryDrawer } from "./category-drawer";
import { CategoryTreeTable } from "./category-tree-table";

type CategoryFilter = "all" | "with-children" | "without-children";

function filterTree(nodes: CategoryNode[], query: string): CategoryNode[] {
  const normalizedQuery = query.trim().toLocaleLowerCase("fa-IR");
  if (!normalizedQuery) return nodes;

  return nodes.flatMap((node) => {
    const children = filterTree(node.children, normalizedQuery);
    const matches = `${node.name} ${node.description}`
      .toLocaleLowerCase("fa-IR")
      .includes(normalizedQuery);
    return matches || children.length ? [{ ...node, children }] : [];
  });
}

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
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const visibleTree = useMemo(() => {
    const searched = filterTree(tree, query);
    if (filter === "with-children") return searched.filter((category) => category.children.length > 0);
    if (filter === "without-children") return searched.filter((category) => category.children.length === 0);
    return searched;
  }, [filter, query, tree]);

  const rootCategories = categories.filter((category) => category.parentId === null);
  const productCount = rootCategories.reduce((sum, category) => sum + category.productCount, 0);

  function openCreateDrawer() {
    setEditingCategory(null);
    setDrawerOpen(true);
  }

  function openEditDrawer(category: CategoryNode) {
    setEditingCategory(category);
    setDrawerOpen(true);
  }

  function removeCategory(category: CategoryNode) {
    const childNote = category.children.length ? " و همه زیر‌دسته‌های آن" : "";
    if (!window.confirm(`دسته‌بندی «${category.name}»${childNote} حذف شود؟`)) return;
    setCategories((current) => {
      const ids = collectDescendantIds(current, category.id);
      return current.filter((item) => !ids.has(item.id));
    });
    setMessage(`دسته‌بندی «${category.name}» حذف شد.`);
  }

  function saveCategory(values: Omit<Category, "id" | "icon" | "productCount">) {
    if (editingCategory) {
      setCategories((current) =>
        current.map((category) => category.id === editingCategory.id ? { ...category, ...values } : category),
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

  const columns = createCategoryColumns(
    (category) => setMessage(`دسته‌بندی «${category.name}» انتخاب شد.`),
    openEditDrawer,
    removeCategory,
  );

  return (
    <div className="w-full min-w-0 space-y-4 p-4 lg:p-6">
      <section aria-label="خلاصه دسته‌بندی‌ها" className="flex h-[60px] items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4">
        <span className="ml-2 text-xs text-zinc-600">دسته بندی:</span>
        <span className="rounded-lg bg-secondary-50 px-4 py-2 text-xs font-medium text-secondary-500">
          {rootCategories.length.toLocaleString("fa-IR")} دسته
        </span>
        <span className="rounded-lg bg-secondary-50 px-4 py-2 text-xs font-medium text-secondary-500">
          {productCount.toLocaleString("fa-IR")} محصول
        </span>
      </section>

      {message ? (
        <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm text-emerald-700" role="status">
          <span>{message}</span>
          <Button aria-label="بستن پیام" onClick={() => setMessage(null)} size="icon-sm" type="button" variant="ghost"><X /></Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 md:flex-row">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">جستجوی دسته‌بندی</span>
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={22} strokeWidth={1.5} />
          <Input
            className="h-[52px] rounded-lg border-zinc-200 bg-white pr-12 shadow-sm"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جستجوی محصول..."
            type="search"
            value={query}
          />
        </label>

        <label className="relative md:w-32">
          <span className="sr-only">فیلتر دسته‌بندی</span>
          <Filter className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 text-zinc-500" size={20} strokeWidth={1.5} />
          <select
            className="h-[52px] w-full appearance-none rounded-lg border border-zinc-200 bg-white pr-10 pl-8 text-sm text-zinc-700 outline-none shadow-sm focus:border-primary-500"
            onChange={(event) => setFilter(event.target.value as CategoryFilter)}
            value={filter}
          >
            <option value="all">فیلتر</option>
            <option value="with-children">دارای زیر دسته</option>
            <option value="without-children">بدون زیر دسته</option>
          </select>
          <ChevronDown className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        </label>

        <Button className="h-[52px] gap-2 px-5 md:w-44" onClick={openCreateDrawer} type="button">
          <Plus size={21} />
          افزودن دسته بندی جدید
        </Button>
      </div>

      <CategoryTreeTable categories={visibleTree} columns={columns} />

      <CategoryDrawer
        categories={categories}
        category={editingCategory}
        onOpenChange={setDrawerOpen}
        onSave={saveCategory}
        open={drawerOpen}
      />
    </div>
  );
}
