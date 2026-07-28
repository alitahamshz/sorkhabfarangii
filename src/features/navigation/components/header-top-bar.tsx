import { Search, ShoppingCart, UserRound } from "lucide-react";
import { BrandLogo } from "./brand-logo";

type HeaderTopBarProps = {
  onOpenMenu: () => void;
};

function AccountActions({ mobile = false }: { mobile?: boolean }) {
  const size = mobile ? 19 : 27;

  return (
    <div
      className={
        mobile
          ? "mr-auto flex items-center gap-4 text-zinc-600 md:hidden"
          : "hidden items-center gap-5 text-zinc-500 md:flex"
      }
      dir="ltr"
    >
      <ShoppingCart size={size} strokeWidth={1.7} />
      <UserRound size={size} strokeWidth={1.7} />
    </div>
  );
}

export function HeaderTopBar({ onOpenMenu }: HeaderTopBarProps) {
  return (
    <div
      className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3 md:h-28 md:py-0"
      dir="rtl"
    >
      <div className="flex shrink-0 items-center gap-4">
        <button
          aria-label="باز کردن منو"
          className="text-zinc-600 md:hidden"
          onClick={onOpenMenu}
          type="button"
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="my-1 block h-0.5 w-5 bg-current" />
          <span className="block h-0.5 w-5 bg-current" />
        </button>
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
