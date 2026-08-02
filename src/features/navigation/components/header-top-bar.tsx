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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BrandLogo } from "./brand-logo";

type HeaderTopBarProps = {
  isAtTop: boolean;
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
      dir="rtl"
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              aria-label="باز کردن منوی حساب کاربری"
              className="rounded-full transition-opacity hover:opacity-70"
              size="icon"
              type="button"
              variant="ghost"
            />
          }
        >
          <Image alt="" aria-hidden height={24} src="/icon/header/user.png" width={24} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          aria-label="منوی حساب کاربری"
          className="w-44 rounded-md border-zinc-300 px-2 text-[13px] text-zinc-500 shadow-none"
          sideOffset={14}
        >
          <DropdownMenuItem
            className="h-10 justify-between rounded-none border-b border-zinc-200"
            render={<Link href="/account" />}
          >
            <span>نام کاربر</span>
            <ChevronLeft aria-hidden size={16} strokeWidth={1.5} />
          </DropdownMenuItem>
          <DropdownMenuItem className="h-10 rounded-none border-b border-zinc-200">
            <ShoppingBag aria-hidden size={17} strokeWidth={1.4} />
            <span>سفارش‌های من</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="h-10 rounded-none border-b border-zinc-200">
            <Heart aria-hidden size={17} strokeWidth={1.4} />
            <span>علاقه‌مندی‌ها</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="h-10 rounded-none border-b border-zinc-200">
            <MapPin aria-hidden size={17} strokeWidth={1.4} />
            <span>آدرس‌های من</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="h-10 rounded-none border-b border-zinc-200">
            <WalletCards aria-hidden size={17} strokeWidth={1.4} />
            <span>کیف پول</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="h-10 rounded-none border-b border-zinc-200">
            <Headphones aria-hidden size={17} strokeWidth={1.4} />
            <span>پشتیبانی</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="h-10 rounded-none text-red-500" variant="destructive">
            <LogOut aria-hidden size={17} strokeWidth={1.5} />
            <span>خروج از حساب کاربری</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
        <Button
          aria-label="باز کردن منو"
          className="text-zinc-600 md:hidden"
          onClick={onOpenMenu}
          size="icon"
          type="button"
          variant="ghost"
        >
          <Image alt="منو" height={24} src="/icon/header/menu.svg" width={24} />
        </Button>
        <Button aria-label="جستجو" className="text-zinc-600" size="icon" type="button" variant="ghost">
          <Image alt="" aria-hidden height={24} src="/icon/header/search.svg" width={24} />
        </Button>
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
