"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 md:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      inert={!isOpen}
    >
      <button
        aria-label="بستن منو"
        className={`absolute inset-0 bg-black/25 transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <aside
        aria-label="منوی موبایل"
        aria-modal="true"
        className={`absolute inset-y-0 right-0 w-[70vw] overflow-y-auto rounded-l-lg bg-white shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        dir="rtl"
        role="dialog"
      >
        <h2 className="sr-only">منوی موبایل</h2>
        <div
          className="flex h-25 items-center justify-start gap-5 border-b border-zinc-100 px-7"
        >
          <button
            aria-label="بستن منو"
            className="inline-flex size-10 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
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
