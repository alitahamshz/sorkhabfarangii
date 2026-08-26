"use client";

import { ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Brand } from "./brands-data";

type BrandViewSheetProps = {
  brand: Brand | null;
  isMobile: boolean;
  onClose: () => void;
};

export function BrandViewSheet({ brand, isMobile, onClose }: BrandViewSheetProps) {
  const isActive = brand?.status === "active";

  return (
    <Sheet
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      open={isMobile && brand !== null}
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
              aria-label="بستن اطلاعات برند"
              className="grid size-8 shrink-0 place-items-center rounded-lg text-zinc-700 transition-colors hover:bg-zinc-100"
            >
              <ArrowRight size={22} strokeWidth={1.5} />
            </SheetClose>
            <SheetTitle className="text-base font-medium text-zinc-900">{brand?.name}</SheetTitle>
          </div>
        </SheetHeader>

        <div
          className="px-6 pt-5"
          style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
        >
          {brand?.image ? (
            <div
              aria-label={`لوگوی ${brand.name}`}
              className="mb-5 size-16 rounded-2xl border border-zinc-100 bg-contain bg-center bg-no-repeat"
              role="img"
              style={{ backgroundImage: `url(${brand.image})` }}
            />
          ) : null}
          <dl className="space-y-5 text-sm text-zinc-500">
            <div className="flex items-center gap-1.5">
              <dt>نام برند:</dt>
              <dd>{brand?.name}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt>نام لاتین:</dt>
              <dd dir="ltr">{brand?.latinName || "—"}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt>کشور مبدا:</dt>
              <dd>{brand?.origin}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt>تعداد محصول:</dt>
              <dd>{brand?.productCount.toLocaleString("fa-IR")}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt>وضعیت:</dt>
              <dd
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
                  isActive ? "bg-[#F3FAF7] text-green-600" : "bg-[#F1E6E9] text-primary-500"
                }`}
              >
                {isActive ? "فعال" : "غیرفعال"}
              </dd>
            </div>
          </dl>
        </div>
      </SheetContent>
    </Sheet>
  );
}
