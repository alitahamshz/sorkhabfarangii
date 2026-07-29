"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MenuCategory } from "@/features/categories";
import { DesktopNavigation } from "./desktop-navigation";
import { HeaderTopBar } from "./header-top-bar";
import { MobileMenuDrawer } from "./mobile-menu-drawer";

export function SiteHeader({
  categories,
}: {
  categories: MenuCategory[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSolid, setIsSolid] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    const updateHeaderAppearance = () => {
      const slider = document.querySelector<HTMLElement>("[data-home-slider]");
      const headerHeight = headerRef.current?.offsetHeight ?? 0;

      setIsSolid(
        slider ? slider.getBoundingClientRect().bottom <= headerHeight : false,
      );
    };

    updateHeaderAppearance();
    window.addEventListener("scroll", updateHeaderAppearance, { passive: true });
    window.addEventListener("resize", updateHeaderAppearance);

    return () => {
      window.removeEventListener("scroll", updateHeaderAppearance);
      window.removeEventListener("resize", updateHeaderAppearance);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-30 transition-colors duration-300 ${
          isSolid
            ? "border-zinc-100 bg-white"
            : "border-transparent bg-transparent"
        }`}
        ref={headerRef}
      >
        <HeaderTopBar onOpenMenu={() => setIsMenuOpen(true)} />
        <DesktopNavigation categories={categories} isSolid={isSolid} />
      </header>
      <MobileMenuDrawer
        categories={categories}
        isOpen={isMenuOpen}
        onClose={closeMenu}
      />
    </>
  );
}
