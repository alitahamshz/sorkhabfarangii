"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, onClose]);

  return (
    <div
      aria-hidden={!isOpen}
      className="pointer-events-none fixed inset-0 z-50"
    >
      <button
        aria-label="بستن منو"
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        type="button"
      />

      <aside
        aria-label="منوی موبایل"
        className={`absolute right-0 top-0 h-full w-[70vw] overflow-y-auto rounded-l-lg bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen
            ? "pointer-events-auto translate-x-0"
            : "pointer-events-none translate-x-full"
        }`}
      >
        <div
          className="flex h-25 items-center justify-start gap-5 border-b border-zinc-100 px-7"
          dir="rtl"
        >
          <button aria-label="بستن منو" onClick={onClose} type="button">
            <X className="text-zinc-500" size={34} strokeWidth={1.5} />
          </button>
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
      </aside>
    </div>
  );
}
