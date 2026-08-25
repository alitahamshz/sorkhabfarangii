"use client";

import Image from "next/image";
import { Fragment, useMemo, useState } from "react";
import { ChevronDown, Eye, Filter, MoreHorizontal, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CategoryDeleteDialog } from "./category-delete-dialog";
import { CategoryDrawer } from "./category-drawer";
import { CategoryViewSheet } from "./category-view-sheet";
import { buildCategoryTree, initialCategories, type Category, type CategoryNode } from "./categories-data";

type CategoryFilter = "all" | "with-children" | "without-children";

function filterNodes(nodes: CategoryNode[], query: string): CategoryNode[] {
  const normalizedQuery = query.trim().toLocaleLowerCase("fa-IR");
  if (!normalizedQuery) return nodes;
  return nodes.flatMap((node) => {
    const children = filterNodes(node.children, normalizedQuery);
    const matches = `${node.name} ${node.description}`.toLocaleLowerCase("fa-IR").includes(normalizedQuery);
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

type CategoryRowProps = {
  category: CategoryNode;
  depth: number;
  expandedIds: Set<string>;
  onDelete: (category: CategoryNode) => void;
  onEdit: (category: CategoryNode) => void;
  onToggle: (categoryId: string) => void;
  onView: (category: CategoryNode) => void;
};

function CategoryRow({ category, depth, expandedIds, onDelete, onEdit, onToggle, onView }: CategoryRowProps) {
  const isExpanded = expandedIds.has(category.id);
  const childCount = category.children.length;

  return (
    <Fragment>
      <TableRow className={depth > 0 ? "bg-secondary-50/50 hover:bg-secondary-50/70" : "bg-white hover:bg-zinc-50/70"}>
        <TableCell className="h-[70px] w-[42%] px-3 text-sm font-medium text-zinc-800 md:w-[35%] md:px-6">
          <span className="block truncate" style={{ paddingRight: `${depth * 22}px` }}>{category.name}</span>
        </TableCell>
        <TableCell className="h-[70px] w-[20%] px-1 md:w-[15%] md:px-3">
          {childCount ? (
            <Button
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? "بستن" : "باز کردن"} زیر دسته‌های ${category.name}`}
              className="h-7 gap-1 rounded-md bg-primary-50 px-2.5 text-[11px] text-primary-600 hover:bg-primary-100"
              onClick={() => onToggle(category.id)}
              type="button"
              variant="ghost"
            >
              {childCount.toLocaleString("fa-IR")}<span className="hidden md:inline"> مورد</span>
              <ChevronDown className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} size={16} />
            </Button>
          ) : null}
        </TableCell>
        <TableCell className="h-[70px] w-[23%] px-1 text-center md:w-[15%] md:px-3">
          <span
            className={`inline-flex min-w-12 justify-center rounded-md px-2 py-1 text-[11px] font-medium ${
              category.isActive === false
                ? "bg-[#F1E6E9] text-primary-500"
                : "bg-[#F3FAF7] text-green-600"
            }`}
          >
            {category.isActive === false ? "غیرفعال" : "فعال"}
          </span>
        </TableCell>
        <TableCell className="hidden h-[70px] w-[17%] px-3 text-xs text-zinc-500 md:table-cell">
          {category.productCount.toLocaleString("fa-IR")} محصول
        </TableCell>
        <TableCell className="h-[70px] w-[15%] px-1 md:w-[18%] md:px-5">
          <div className="hidden items-center gap-1 md:flex" dir="ltr">
            <Button aria-label={`حذف ${category.name}`} className="hover:bg-red-50" onClick={() => onDelete(category)} size="icon" type="button" variant="ghost"><Image alt="" aria-hidden="true" height={32} src="/icon/adminDashboard/deleteBtn.svg" width={32} /></Button>
            <Button aria-label={`ویرایش ${category.name}`} onClick={() => onEdit(category)} size="icon" type="button" variant="ghost"><Image alt="" aria-hidden="true" height={32} src="/icon/adminDashboard/editBtn.svg" width={32} /></Button>
            <Button aria-label={`مشاهده ${category.name}`} className="text-zinc-500 hover:text-primary-500" onClick={() => onView(category)} size="icon" type="button" variant="ghost"><Eye size={22} strokeWidth={1.6} /></Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`عملیات ${category.name}`}
              className="mx-auto grid size-8 place-items-center rounded-md text-zinc-500 outline-none hover:bg-zinc-100 data-popup-open:bg-zinc-100 md:hidden"
            >
              <MoreHorizontal size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[112px]! min-w-[112px] overflow-hidden rounded-lg bg-white p-0 shadow-lg ring-1 ring-zinc-200"
              dir="rtl"
              sideOffset={4}
            >
              <DropdownMenuItem className="h-9 justify-between rounded-none border-b border-zinc-100 px-3 text-xs text-zinc-500" onClick={() => onView(category)}>
                <Image alt="" aria-hidden="true" height={18} src="/icon/adminDashboard/eyeIcon.png" width={18} />
                <span>مشاهده</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="h-9 justify-between rounded-none border-b border-zinc-100 px-3 text-xs text-zinc-500" onClick={() => onEdit(category)}>
                <Image alt="" aria-hidden="true" height={24} src="/icon/adminDashboard/editBtn.svg" width={24} />
                <span>ویرایش</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="h-9 justify-between rounded-none px-3 text-xs" onClick={() => onDelete(category)} variant="destructive">
                <Image alt="" aria-hidden="true" height={24} src="/icon/adminDashboard/deleteBtn.svg" width={24} />
                <span>حذف</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      {isExpanded
        ? category.children.map((child) => (
            <CategoryRow
              category={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              key={child.id}
              onDelete={onDelete}
              onEdit={onEdit}
              onToggle={onToggle}
              onView={onView}
            />
          ))
        : null}
    </Fragment>
  );
}

export function CategoryDetails({ categoryId }: { categoryId: string }) {
  const isMobile = useIsMobile();
  const [categories, setCategories] = useState(initialCategories);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(categoryId === "beauty" ? ["lip-makeup"] : []));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [categoryToView, setCategoryToView] = useState<CategoryNode | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const selectedCategory = tree.find((category) => category.id === categoryId);
  const visibleCategories = useMemo(() => {
    const searched = filterNodes(selectedCategory?.children ?? [], query);
    if (filter === "with-children") return searched.filter((category) => category.children.length > 0);
    if (filter === "without-children") return searched.filter((category) => category.children.length === 0);
    return searched;
  }, [filter, query, selectedCategory]);
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

  function viewCategory(category: CategoryNode) {
    if (isMobile) {
      setCategoryToView(category);
      return;
    }
    setMessage(`دسته‌بندی «${category.name}» انتخاب شد.`);
  }

  function removeCategory(category: Category) {
    setCategories((current) => {
      const ids = collectDescendantIds(current, category.id);
      return current.filter((item) => !ids.has(item.id));
    });
    setMessage(`دسته‌بندی «${category.name}» حذف شد.`);
    setCategoryToDelete(null);
  }

  function saveCategory(values: Omit<Category, "id" | "icon" | "productCount">) {
    if (editingCategory) {
      setCategories((current) => current.map((category) => category.id === editingCategory.id ? { ...category, ...values } : category));
      setMessage(`دسته‌بندی «${values.name}» ویرایش شد.`);
      return;
    }
    setCategories((current) => [...current, { ...values, id: `category-${Date.now()}`, icon: "✨", productCount: 0 }]);
    setMessage(`دسته‌بندی «${values.name}» اضافه شد.`);
  }

  function toggleCategory(categoryIdToToggle: string) {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(categoryIdToToggle)) next.delete(categoryIdToToggle);
      else next.add(categoryIdToToggle);
      return next;
    });
  }

  if (!selectedCategory) return null;

  return (
    <div className="w-full min-w-0 space-y-4 p-4 lg:p-6">
      <section aria-label="خلاصه دسته‌بندی‌ها" className="flex h-[60px] items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4">
        <span className="ml-2 text-xs text-zinc-600">دسته بندی:</span>
        <span className="rounded-lg bg-secondary-50 px-4 py-2 text-xs font-medium text-secondary-500">{rootCategories.length.toLocaleString("fa-IR")} دسته</span>
        <span className="rounded-lg bg-secondary-50 px-4 py-2 text-xs font-medium text-secondary-500">{productCount.toLocaleString("fa-IR")} محصول</span>
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
          <Input className="h-[52px] rounded-lg border-zinc-200 bg-white pr-12 shadow-sm" onChange={(event) => setQuery(event.target.value)} placeholder="جستجوی محصول..." type="search" value={query} />
        </label>
        <label className="relative md:w-32">
          <span className="sr-only">فیلتر دسته‌بندی</span>
          <Filter className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 text-zinc-500" size={20} strokeWidth={1.5} />
          <select className="h-[52px] w-full appearance-none rounded-lg border border-zinc-200 bg-white pr-10 pl-8 text-sm text-zinc-700 outline-none shadow-sm focus:border-primary-500" onChange={(event) => setFilter(event.target.value as CategoryFilter)} value={filter}>
            <option value="all">فیلتر</option>
            <option value="with-children">دارای زیر دسته</option>
            <option value="without-children">بدون زیر دسته</option>
          </select>
          <ChevronDown className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        </label>
        <Button className="admin-page-action gap-2 px-4 md:w-44" onClick={openCreateDrawer} type="button"><Plus size={21} />افزودن دسته بندی جدید</Button>
      </div>

      <section aria-label={`زیر دسته‌های ${selectedCategory.name}`} className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <Table className="table-fixed md:min-w-[760px] md:table-auto">
          <TableHeader className="bg-zinc-50">
            <TableRow className="hover:bg-zinc-50">
              <TableHead className="h-[52px] w-[42%] px-3 text-xs text-zinc-500 md:w-[35%] md:px-6">دسته بندی {selectedCategory.name}</TableHead>
              <TableHead className="h-[52px] w-[20%] px-1 text-xs text-zinc-500 md:w-[15%] md:px-3">زیر دسته</TableHead>
              <TableHead className="h-[52px] w-[23%] px-1 text-center text-xs text-zinc-500 md:w-[15%] md:px-3">وضعیت</TableHead>
              <TableHead className="hidden h-[52px] w-[17%] px-3 text-xs text-zinc-500 md:table-cell">تعداد</TableHead>
              <TableHead className="h-[52px] w-[15%] px-1 text-center text-xs text-zinc-500 md:w-[18%] md:px-5 md:text-start">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleCategories.length ? visibleCategories.map((category) => (
              <CategoryRow category={category} depth={0} expandedIds={expandedIds} key={category.id} onDelete={setCategoryToDelete} onEdit={openEditDrawer} onToggle={toggleCategory} onView={viewCategory} />
            )) : (
              <TableRow className="hover:bg-white"><TableCell className="h-40 text-center text-sm text-zinc-500" colSpan={5}>دسته‌بندی‌ای برای نمایش وجود ندارد.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      <CategoryDrawer categories={categories} category={editingCategory} defaultParentId={categoryId} onOpenChange={setDrawerOpen} onSave={saveCategory} open={drawerOpen} />
      <CategoryDeleteDialog category={categoryToDelete} onCancel={() => setCategoryToDelete(null)} onConfirm={removeCategory} />
      <CategoryViewSheet
        category={categoryToView}
        isMobile={isMobile}
        onClose={() => setCategoryToView(null)}
        parentName={categoryToView?.parentId
          ? categories.find((category) => category.id === categoryToView.parentId)?.name ?? selectedCategory.name
          : selectedCategory.name}
      />
    </div>
  );
}
