"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  BadgePercent,
  Box,
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  ChevronUp,
  LogOut,
  Settings,
  ShoppingBag,
  Store,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type SidebarItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  children?: string[];
};

const sidebarItems: SidebarItem[] = [
  {
    id: "products",
    label: "محصولات",
    icon: Box,
    children: [
      "لیست محصولات",
      "افزودن محصول",
      "دسته بندی",
      "برند ها",
      "ویژگی ها و متغیرها",
    ],
  },
  { id: "inventory", label: "انبار موجودی", icon: Store },
  { id: "orders", label: "فروش و سفارشات", icon: ShoppingBag },
  { id: "marketing", label: "بازاریابی و تخفیف", icon: BadgePercent },
  { id: "customers", label: "مشتریان و پشتیبانی", icon: UserRound },
  { id: "reports", label: "گزارش ها", icon: ChartNoAxesColumnIncreasing },
  { id: "settings", label: "تنظیمات سیستم", icon: Settings },
];

export function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItem, setExpandedItem] = useState<string | null>("products");

  return (
    <aside
      aria-label="منوی داشبورد ادمین"
      className={`fixed inset-y-0 right-0 z-40 flex w-[313px] max-w-[88vw] flex-col rounded-l-2xl bg-primary-500 px-6 pb-5 pt-6 text-white shadow-xl transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "translate-x-full"
        }`}
    >
      <div className="flex shrink-0 justify-center pb-5">
        <Image
          alt="سرخاب فرنگی"
          className="h-auto w-[92px] brightness-0 invert"
          height={52}
          priority
          src="/img/logo.svg"
          width={96}
        />
      </div>

      <div className="h-px shrink-0 bg-white/65" />

      <nav className="mt-6 min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Button
          className="flex h-11 w-full cursor-pointer items-center justify-start gap-3 px-3 text-right text-base font-semibold"
          onClick={() => {
            router.push("/admin");
            onClose();
          }}
          type="button"
          variant="ghost"
        >
          <span
            aria-hidden="true"
            className="size-[23px] shrink-0 bg-current transition-colors"
            style={{
              mask: "url('/icon/adminDashboard/dashboardIcon.svg') center / contain no-repeat",
              WebkitMask: "url('/icon/adminDashboard/dashboardIcon.svg') center / contain no-repeat",
            }}
          />
          <span>نمای کلی</span>
        </Button>

        <div className="mt-4 space-y-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedItem === item.id;

            return (
              <div key={item.id}>
                <Button
                  aria-expanded={isExpanded}
                  className={`flex h-[47px] w-full cursor-pointer items-center rounded-xl px-3 text-right transition-colors ${isExpanded
                      ? "bg-primary-50 text-zinc-900 shadow-[0_8px_14px_rgba(0,0,0,0.2)]"
                      : "text-white hover:bg-white/10"
                    }`}
                  onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                  type="button"
                  variant="ghost"
                >
                  <Icon size={23} strokeWidth={1.55} />
                  <span className="mr-3 flex-1 text-[15px] font-bold">{item.label}</span>
                  {isExpanded ? (
                    <ChevronUp size={22} strokeWidth={1.5} />
                  ) : (
                    <ChevronDown size={22} strokeWidth={1.5} />
                  )}
                </Button>

                {isExpanded && item.children ? (
                  <div className="mx-2 mt-5 rounded-xl bg-white px-5 py-2 text-zinc-800 shadow-sm">
                    {item.children.map((child) => (
                      <Button
                        className={`block h-[44px] w-full cursor-pointer text-right text-[13px] transition-colors hover:text-primary-500 ${child === "لیست محصولات" && pathname.startsWith("/admin/products")
                            ? "bg-zinc-100 font-semibold text-primary-500"
                            : ""
                          }`}
                        key={child}
                        onClick={() => {
                          if (child === "لیست محصولات") router.push("/admin/products");
                          onClose();
                        }}
                        type="button"
                        variant="ghost"
                      >
                        {child}
                      </Button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </nav>

      <footer className="mt-5 shrink-0 border-t border-white/65 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-white/10 text-[10px]">م</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">مدیر ارشد</p>
            <p className="mt-0.5 text-[9px] text-white/70" dir="ltr">0912 123 1214</p>
          </div>
          <Button aria-label="خروج از حساب" className="cursor-pointer text-white/90 hover:text-white" size="icon" type="button" variant="ghost">
            <LogOut size={22} strokeWidth={1.5} />
          </Button>
        </div>
      </footer>
    </aside>
  );
}
