"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import {
  ChevronLeft,
  Headphones,
  Heart,
  LogOut,
  MapPin,
  Search,
  ShoppingBag,
  WalletCards,
} from "lucide-react";
import { useSession, useSignOut } from "@/features/auth";
import { startGlobalNavigation } from "@/components/global-navigation-loader";
import { BrandLogo } from "./brand-logo";

type HeaderTopBarProps = {
  isAtTop: boolean;
  onOpenMenu: () => void;
};

function AccountActions({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter();
  const { data: session } = useSession();
  const logout = useSignOut();
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const displayName = [session?.user.name, session?.user.family]
    .filter(Boolean)
    .join(" ") || "نام کاربر";

  return (
    <div
      className={
        mobile
          ? "mr-auto flex items-center gap-4 text-zinc-600 md:hidden"
          : "hidden items-center gap-5 text-zinc-500 md:flex"
      }
      dir="rtl"
    >
      <div className="relative" ref={wrapperRef}>
        <button
          aria-controls={menuId}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label="باز کردن منوی حساب کاربری"
          className="inline-flex size-9 items-center justify-center rounded-full transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <Image alt="" aria-hidden height={24} src="/icon/header/user.png" width={24} />
        </button>
        <div
          aria-label="منوی حساب کاربری"
          className={`absolute left-1/2 top-full z-50 mt-3 w-44 -translate-x-1/2 rounded-md border border-zinc-300 bg-white px-2 text-[13px] text-zinc-500 transition-[opacity,transform] duration-200 ease-out ${
            isOpen
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-1 scale-95 opacity-0"
          }`}
          id={menuId}
          inert={!isOpen}
          role="menu"
        >
          <Link
            className="flex h-10 items-center justify-between border-b border-zinc-200 transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-primary-500"
            href="/account"
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            <span>{displayName}</span>
            <ChevronLeft aria-hidden size={16} strokeWidth={1.5} />
          </Link>
          <button className="flex h-10 w-full items-center gap-1.5 border-b border-zinc-200 transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-primary-500" role="menuitem" type="button">
            <ShoppingBag aria-hidden size={17} strokeWidth={1.4} />
            <span>سفارش‌های من</span>
          </button>
          <button className="flex h-10 w-full items-center gap-1.5 border-b border-zinc-200 transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-primary-500" role="menuitem" type="button">
            <Heart aria-hidden size={17} strokeWidth={1.4} />
            <span>علاقه‌مندی‌ها</span>
          </button>
          <button className="flex h-10 w-full items-center gap-1.5 border-b border-zinc-200 transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-primary-500" role="menuitem" type="button">
            <MapPin aria-hidden size={17} strokeWidth={1.4} />
            <span>آدرس‌های من</span>
          </button>
          <button className="flex h-10 w-full items-center gap-1.5 border-b border-zinc-200 transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-primary-500" role="menuitem" type="button">
            <WalletCards aria-hidden size={17} strokeWidth={1.4} />
            <span>کیف پول</span>
          </button>
          <button className="flex h-10 w-full items-center gap-1.5 border-b border-zinc-200 transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-primary-500" role="menuitem" type="button">
            <Headphones aria-hidden size={17} strokeWidth={1.4} />
            <span>پشتیبانی</span>
          </button>
          <button
            className="flex h-10 w-full items-center gap-1.5 text-red-500 transition-colors hover:text-red-600 focus-visible:outline-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={logout.isPending || !session}
            onClick={() => {
              logout.mutate(undefined, {
                onSuccess: () => {
                  setIsOpen(false);
                  startGlobalNavigation();
                  router.push("/");
                  router.refresh();
                },
              });
            }}
            role="menuitem"
            type="button"
          >
            <LogOut aria-hidden size={17} strokeWidth={1.5} />
            <span>{logout.isPending ? "در حال خروج..." : "خروج از حساب کاربری"}</span>
          </button>
        </div>
      </div>

      {/* آیکون سبد خرید */}
      <Image alt="سبد خرید" width={24} height={24} src="/icon/header/cart.png" />
    </div>
  );
}

export function HeaderTopBar({ isAtTop, onOpenMenu }: HeaderTopBarProps) {
  return (
    <div
      className={`mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 transition-[padding] duration-300 md:h-28 md:py-0 ${isAtTop ? "pt-6" : "pt-2"
        }`}
      dir="rtl"
    >
      <div className="flex shrink-0 items-center gap-3 md:hidden">
        <button
          aria-label="باز کردن منو"
          className="inline-flex size-9 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 md:hidden"
          onClick={onOpenMenu}
          type="button"
        >
          <Image alt="منو" height={24} src="/icon/header/menu.svg" width={24} />
        </button>
        <button aria-label="جستجو" className="inline-flex size-9 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500" type="button">
          <Image alt="" aria-hidden height={24} src="/icon/header/search.svg" width={24} />
        </button>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
        <BrandLogo />
      </div>

      <div className="hidden w-full max-w-sm items-center rounded-lg bg-white px-3 py-3 text-sm text-zinc-400 md:flex">
        <Search className="ml-2" size={20} />
        جستجوی نام محصول، دسته‌بندی و ...
      </div>

      <div className="hidden flex-1 md:block" />
      <AccountActions />
      <AccountActions mobile />
    </div>
  );
}
