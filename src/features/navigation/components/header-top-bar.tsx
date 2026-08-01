import Image from "next/image";
import Link from "next/link";
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
import { useEffect, useId, useRef, useState } from "react";
import { BrandLogo } from "./brand-logo";

type HeaderTopBarProps = {
  isAtTop: boolean;
  onOpenMenu: () => void;
};

function AccountActions({ mobile = false }: { mobile?: boolean }) {
  // وضعیت باز یا بسته بودن منوی حساب کاربری
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuId = useId();
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // بستن منو با کلیک بیرون از آن یا فشردن کلید Escape
  useEffect(() => {
    if (!isAccountMenuOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsAccountMenuOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isAccountMenuOpen]);

  return (
    <div
      className={
        mobile
          ? "mr-auto flex items-center gap-4 text-zinc-600 md:hidden"
          : "hidden items-center gap-5 text-zinc-500 md:flex"
      }
      dir="rtl"
    >
      {/* دکمه آیکون کاربر و منوی بازشونده آن */}
      <div className="relative" ref={accountMenuRef}>
        {/* دکمه باز و بسته کردن منوی حساب کاربری */}
        <button
          aria-controls={accountMenuId}
          aria-expanded={isAccountMenuOpen}
          aria-label="باز کردن منوی حساب کاربری"
          className="flex cursor-pointer items-center justify-center rounded-full transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4"
          onClick={() => setIsAccountMenuOpen((isOpen) => !isOpen)}
          type="button"
        >
          <Image alt="" aria-hidden height={24} src="/icon/header/user.png" width={24} />
        </button>

        {isAccountMenuOpen ? (
          /* پنل منوی حساب کاربری */
          <div
            aria-label="منوی حساب کاربری"
            className="absolute left-1/2 top-[calc(100%+14px)] z-50 w-44 -translate-x-1/2 rounded-md border border-zinc-300 bg-white px-2 text-[13px] text-zinc-500 shadow-none"
            id={accountMenuId}
            role="menu"
          >
            {/* مثلث دقیقاً وسط پنل و آیکون کاربر؛ فقط اضلاع بیرونی آن بوردر دارند */}
            <span
              aria-hidden
              className="absolute -top-2 left-1/2 z-10 size-4 -translate-x-1/2 rotate-45 border-l border-t border-zinc-300 bg-white"
            />

            {/* نام کاربر و لینک ورود به صفحه حساب */}
            <Link
              className="relative flex h-10 w-full cursor-pointer items-center justify-between border-b border-zinc-200 text-right transition-colors hover:text-zinc-900"
              href="/account"
              role="menuitem"
            >
              <span>نام کاربر</span>
              <ChevronLeft aria-hidden size={16} strokeWidth={1.5} />
            </Link>

            {/* گزینه‌های حساب کاربری */}
            <button
              className="flex h-10 w-full cursor-pointer items-center gap-2 border-b border-zinc-200 text-right transition-colors hover:text-zinc-900"
              role="menuitem"
              type="button"
            >
              <ShoppingBag aria-hidden size={17} strokeWidth={1.4} />
              <span>سفارش‌های من</span>
            </button>
            <button
              className="flex h-10 w-full cursor-pointer items-center gap-2 border-b border-zinc-200 text-right transition-colors hover:text-zinc-900"
              role="menuitem"
              type="button"
            >
              <Heart aria-hidden size={17} strokeWidth={1.4} />
              <span>علاقه‌مندی‌ها</span>
            </button>
            <button
              className="flex h-10 w-full cursor-pointer items-center gap-2 border-b border-zinc-200 text-right transition-colors hover:text-zinc-900"
              role="menuitem"
              type="button"
            >
              <MapPin aria-hidden size={17} strokeWidth={1.4} />
              <span>آدرس‌های من</span>
            </button>
            <button
              className="flex h-10 w-full cursor-pointer items-center gap-2 border-b border-zinc-200 text-right transition-colors hover:text-zinc-900"
              role="menuitem"
              type="button"
            >
              <WalletCards aria-hidden size={17} strokeWidth={1.4} />
              <span>کیف پول</span>
            </button>
            <button
              className="flex h-10 w-full cursor-pointer items-center gap-2 border-b border-zinc-200 text-right transition-colors hover:text-zinc-900"
              role="menuitem"
              type="button"
            >
              <Headphones aria-hidden size={17} strokeWidth={1.4} />
              <span>پشتیبانی</span>
            </button>

            {/* خروج از حساب کاربری */}
            <button
              className="flex h-10 w-full cursor-pointer items-center gap-2 text-right text-red-500 transition-colors hover:text-red-700"
              role="menuitem"
              type="button"
            >
              <LogOut aria-hidden size={17} strokeWidth={1.5} />
              <span>خروج از حساب کاربری</span>
            </button>
          </div>
        ) : null}
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
          className="text-zinc-600 md:hidden"
          onClick={onOpenMenu}
          type="button"
        >
          <Image alt="منو" height={24} src="/icon/header/menu.svg" width={24} />
        </button>
        <button aria-label="جستجو" className="text-zinc-600" type="button">
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
