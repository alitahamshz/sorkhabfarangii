"use client";

import { ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { CategoryNode } from "./categories-data";

type CategoryViewSheetProps = {
  category: CategoryNode | null;
  isMobile: boolean;
  onClose: () => void;
  parentName: string;
};

export function CategoryViewSheet({
  category,
  isMobile,
  onClose,
  parentName,
}: CategoryViewSheetProps) {
  const isActive = category?.isActive !== false;

  return (
    <Sheet
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      open={isMobile && category !== null}
    >
      <SheetContent
        aria-describedby={undefined}
        className="gap-0 rounded-t-[16px] border-zinc-200 bg-white p-0 shadow-2xl"
        dir="rtl"
        overlayClassName="bg-black/20"
        showCloseButton={false}
        side="bottom"
      >
        <SheetHeader className="border-b border-zinc-200 p-0">
          <div className="flex h-12 items-center gap-2 px-4">
            <SheetClose
              aria-label="بستن اطلاعات دسته‌بندی"
              className="grid size-8 shrink-0 place-items-center rounded-lg text-zinc-700 transition-colors hover:bg-zinc-100"
            >
              <ArrowRight size={22} strokeWidth={1.5} />
            </SheetClose>
            <SheetTitle className="text-base font-medium text-zinc-900">
              {category?.name}
            </SheetTitle>
          </div>
        </SheetHeader>

        <dl
          className="space-y-5 px-6 pt-5 text-sm text-zinc-500"
          style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-center gap-1.5">
            <dt>نام دسته‌بندی والد:</dt>
            <dd>{parentName}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt>تعداد محصول:</dt>
            <dd>{category?.productCount.toLocaleString("fa-IR")}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt>تعداد زیر دسته:</dt>
            <dd className="rounded-md bg-primary-50 px-2.5 py-1 text-[11px] font-medium text-primary-600">
              {(category?.children.length ?? 0).toLocaleString("fa-IR")} مورد
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <dt>وضعیت:</dt>
            <dd
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
                isActive
                  ? "bg-[#F3FAF7] text-green-600"
                  : "bg-[#F1E6E9] text-primary-500"
              }`}
            >
              {isActive ? "فعال" : "غیرفعال"}
            </dd>
          </div>
        </dl>
      </SheetContent>
    </Sheet>
  );
}
