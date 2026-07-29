import Image from "next/image";
import { Search } from "lucide-react";
import { BrandLogo } from "./brand-logo";

type HeaderTopBarProps = {
  onOpenMenu: () => void;
};

function AccountActions({ mobile = false }: { mobile?: boolean }) {
  return (
    <div
      className={
        mobile
          ? "mr-auto flex items-center gap-4 text-zinc-600 md:hidden"
          : "hidden items-center gap-5 text-zinc-500 md:flex"
      }
      dir="ltr"
    >
      <Image alt="cart" width={24} height={24} src={'/icon/header/cart.png'} />
      <Image alt="cart" width={24} height={24} src={'/icon/header/user.png'} />
      {/* <UserRound size={size} strokeWidth={1.7} /> */}
    </div>
  );
}

export function HeaderTopBar({ onOpenMenu }: HeaderTopBarProps) {
  return (
    <div
      className="mx-auto pt-8 flex max-w-7xl items-center gap-4 px-4 py-2 md:h-28 md:py-0"
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
