"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import type { MenuCategory } from "@/features/categories";
import { BrandLogo } from "./brand-logo";
import { MobileMenuCategory } from "./mobile-menu-category";
import { PromoBanner } from "./promo-banner";

type MobileMenuDrawerProps = {
  categories: MenuCategory[];
  isOpen: boolean;
  onClose: () => void;
};

export function MobileMenuDrawer({
  categories,
  isOpen,
  onClose,
}: MobileMenuDrawerProps) {
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(
    categories[0]?.id ?? null,
  );
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);

  return (
    <Sheet
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      open={isOpen}
    >
      <SheetContent
        aria-label="منوی موبایل"
        className="w-[70vw] max-w-none gap-0 overflow-y-auto rounded-l-lg border-0 bg-white p-0 shadow-2xl sm:max-w-none"
        showCloseButton={false}
        side="right"
      >
        <SheetTitle className="sr-only">منوی موبایل</SheetTitle>
        <div
          className="flex h-25 items-center justify-start gap-5 border-b border-zinc-100 px-7"
          dir="rtl"
        >
          <SheetClose
            render={
              <Button aria-label="بستن منو" size="icon-lg" type="button" variant="ghost" />
            }
          >
            <X className="text-zinc-500" size={34} strokeWidth={1.5} />
          </SheetClose>
          <BrandLogo />
        </div>

        <div className="space-y-3 px-4 py-7">
          <PromoBanner />
          {categories.map((category) => (
            <MobileMenuCategory
              category={category}
              isOpen={openCategoryId === category.id}
              key={category.id}
              onToggle={() => {
                setOpenCategoryId((current) =>
                  current === category.id ? null : category.id,
                );
                setOpenGroupId(null);
              }}
              onToggleGroup={(groupId) =>
                setOpenGroupId((current) =>
                  current === groupId ? null : groupId,
                )
              }
              openGroupId={openGroupId}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
