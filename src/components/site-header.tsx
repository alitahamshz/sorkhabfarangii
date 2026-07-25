"use client";

import { ChevronDown, ChevronLeft, Gift, HeartPulse, Scissors, Search, ShoppingBag, ShoppingCart, Sparkles, SprayCan, Star, UserRound, X, Zap } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { MenuCategory, MenuGroup } from "@/lib/categories";

function getMegaColumns(groups: MenuGroup[]) {
  // ارتفاع ستون بر اساس واحدِ «عنوان + آیتم‌ها» محاسبه می‌شود. مقدار ۱۸
  // اجازه می‌دهد گروه‌های کوتاهِ پیاپی در همان ستون بمانند و تنها در صورت
  // پر شدن واقعی ستون به ستون بعدی wrap شوند.
  const maxColumnHeight = 18;
  const columns: MenuGroup[][] = [[]];
  let currentHeight = 0;

  groups.forEach((group) => {
    const groupHeight = group.items.length + 1;
    if (currentHeight > 0 && currentHeight + groupHeight > maxColumnHeight) {
      columns.push([]);
      currentHeight = 0;
    }
    columns.at(-1)?.push(group);
    currentHeight += groupHeight;
  });

  return columns;
}

function Logo() {
  return <Image alt="سرخاب فرنگی" className="h-auto w-[78px] md:w-[128px]" height={58} priority src="/img/logo.png" width={145} />;
}

function LipstickIcon() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-[#d81968]" fill="none" viewBox="0 0 24 24">
      <path d="M8.5 11.5h7v9h-7z" fill="currentColor" opacity=".25" />
      <path d="M8.5 11.5h7v9h-7zM7 20.5h10M9.5 11.5V7.8c0-1.4 1.1-2.5 2.5-2.5h.8c1.4 0 2.5 1.1 2.5 2.5v3.7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M10.6 5.2 13.1 1.8c.7-.9 2-.2 1.7.9l-.8 2.6" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
    </svg>
  );
}

function CategoryIcon({ name }: { name: string }) {
  const iconProps = { className: "h-[18px] w-[18px] shrink-0 text-[#d81968]", strokeWidth: 1.7 };

  switch (name) {
    case "آرایشی":
      return <LipstickIcon />;
    case "پوستی":
      return <Sparkles {...iconProps} />;
    case "بهداشتی":
      return <HeartPulse {...iconProps} />;
    case "اکسسوری و گیفت":
      return <Gift {...iconProps} />;
    case "عطر و ادکلن":
    case "عطر و رایحه":
      return <SprayCan {...iconProps} />;
    case "مراقبت مو":
      return <Scissors {...iconProps} />;
    case "لوازم برقی":
      return <Zap {...iconProps} />;
    case "کیف و کفش":
      return <ShoppingBag {...iconProps} />;
    default:
      return <Star {...iconProps} />;
  }
}

function PromoBanner() {
  const banners = ["/img/menuBanner1.png", "/img/menuBanner2.png"];
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveBanner((current) => (current + 1) % banners.length), 4000);
    return () => window.clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="relative aspect-[2.61/1] overflow-hidden rounded-lg shadow-sm">
      {banners.map((src, index) => (
        <Image
          alt={`بنر پیشنهاد ویژه ${index + 1}`}
          className={`object-cover transition-opacity duration-500 ${activeBanner === index ? "opacity-100" : "opacity-0"}`}
          fill
          key={src}
          priority={index === 0}
          sizes="70vw"
          src={src}
        />
      ))}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
        {banners.map((_, index) => (
          <button
            aria-label={`نمایش بنر ${index + 1}`}
            className={`h-1.5 rounded-full transition-all ${activeBanner === index ? "w-4 bg-white" : "w-1.5 bg-white/60"}`}
            key={index}
            onClick={() => setActiveBanner(index)}
          />
        ))}
      </div>
    </div>
  );
}

export function SiteHeader({ categories }: { categories: MenuCategory[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMobileCategoryId, setOpenMobileCategoryId] = useState<string | null>(categories[0]?.id ?? null);
  const [openMobileGroupId, setOpenMobileGroupId] = useState<string | null>(null);

  return (
    <>
      <header className="relative z-30 border-b-0 bg-transparent md:border-b md:border-[#f1e6ec] md:bg-[#fbf6fa]">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3 md:h-28 md:py-0" dir="rtl">
          <div className="flex shrink-0 items-center gap-4">
            <button className="text-zinc-600 md:hidden" onClick={() => setDrawerOpen(true)} aria-label="باز کردن منو">
              <span className="block h-0.5 w-5 bg-current" />
              <span className="my-1 block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
            </button>
            <Logo />
          </div>
          <div className="hidden w-full max-w-sm items-center rounded-lg bg-white px-3 py-3 text-sm text-zinc-400 md:flex">
            <Search className="ml-2" size={20} />
            جستجوی نام محصول، دسته‌بندی و ...
          </div>
          <div className="hidden flex-1 md:block" />
          <div className="hidden items-center gap-5 text-zinc-500 md:flex" dir="ltr">
            <ShoppingCart size={27} strokeWidth={1.7} />
            <UserRound size={27} strokeWidth={1.7} />
          </div>
          <div className="mr-auto flex items-center gap-4 text-zinc-600 md:hidden" dir="ltr">
            <ShoppingCart size={19} strokeWidth={1.7} />
            <UserRound size={19} strokeWidth={1.7} />
          </div>
        </div>
        <nav className="hidden border-t border-white/70 bg-white/55 md:block">
          <ul className="relative mx-auto flex h-15 max-w-7xl items-center justify-start gap-8 px-5 text-sm text-zinc-600" dir="rtl">
            {categories.map((category, index) => (
              <li className="group flex h-full items-center" key={category.id}>
                <button className={`flex items-center gap-1 whitespace-nowrap transition-colors group-hover:text-[#fb65b6] ${index === 0 ? "text-[#fb65b6]" : ""}`}>
                  <Star size={17} strokeWidth={1.8} /> {category.name} <ChevronDown className="transition-transform duration-200 ease-out group-hover:rotate-180" size={16} />
                </button>
                {category.groups.length > 0 && (
                  <div className="invisible absolute top-full right-0 z-50 flex h-[500px] w-full flex-col overflow-hidden border border-[#f4dce9] bg-[#fff8fc] p-1 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100">
                    <a className="flex shrink-0 items-center gap-1 px-7 py-5 text-base font-semibold text-[#fb65b6]" href="#">مشاهده همه محصولات {category.name} <ChevronLeft size={18} /></a>
                    <div className="mb-4 grid min-h-0 flex-1 grid-cols-5 items-stretch gap-1">
                      {getMegaColumns(category.groups).map((column, index) => (
                        <div className="bg-white px-4 py-5" key={index}>
                          {column.map((group, groupIndex) => (
                            <section className={groupIndex > 0 ? "mt-6" : ""} key={group.id}>
                              <h3 className="relative mb-3 pr-3 text-sm font-bold text-zinc-600 before:absolute before:right-0 before:top-0.5 before:h-5 before:w-0.5 before:bg-[#97003b]">{group.name}</h3>
                              <ul className="space-y-2 text-xs leading-5 text-zinc-500">
                                {group.items.map((item) => <li key={item.id}><a href="#" className="inline-block transition-transform duration-200 hover:-translate-x-1 hover:text-[#97003b]">{item.name}</a></li>)}
                              </ul>
                            </section>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="pointer-events-none fixed inset-0 z-50" aria-hidden={!drawerOpen}>
        <button aria-label="بستن منو" className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${drawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setDrawerOpen(false)} />
        <aside className={`absolute right-0 top-0 h-full w-[70vw] overflow-y-auto rounded-l-lg bg-white shadow-2xl transition-transform duration-300 ease-out ${drawerOpen ? "pointer-events-auto translate-x-0" : "pointer-events-none translate-x-full"}`}>
          <div className="flex h-25 items-center justify-start gap-5 border-b border-zinc-100 px-7" dir="rtl">
            <button onClick={() => setDrawerOpen(false)} aria-label="بستن منو"><X size={34} strokeWidth={1.5} className="text-zinc-500" /></button>
            <Logo />
          </div>
          <div className="space-y-3 px-4 py-7">
            <PromoBanner />
            {categories.map((category) => {
              const isOpen = openMobileCategoryId === category.id;
              return (
                <section className="border-b border-zinc-100 pb-3" key={category.id}>
                  <button
                    className="flex w-full items-center justify-between py-0.5 text-base font-bold text-zinc-500"
                    onClick={() => {
                      setOpenMobileCategoryId(isOpen ? null : category.id);
                      setOpenMobileGroupId(null);
                    }}
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-2">
                      <CategoryIcon name={category.name} />
                      {category.name}
                    </span>
                    <ChevronDown className={`text-[#97003b] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} size={20} strokeWidth={1.7} />
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "mt-2 grid-rows-[1fr]" : "mt-0 grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <ul className="rounded-2xl bg-[#fafafa] px-4 py-2 text-sm text-slate-500">
                        {category.groups.map((group) => {
                          const isGroupOpen = openMobileGroupId === group.id;
                          return (
                            <li className="border-b border-zinc-100 last:border-0" key={group.id}>
                              <button
                                className="flex w-full items-center justify-between py-3"
                                onClick={() => setOpenMobileGroupId(isGroupOpen ? null : group.id)}
                                aria-expanded={isGroupOpen}
                              >
                                <span>{group.name}</span>
                                <ChevronDown className={`transition-transform duration-300 ${isGroupOpen ? "rotate-180" : ""}`} size={17} strokeWidth={1.5} />
                              </button>
                              <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isGroupOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                                <ul className="overflow-hidden border-r-2 border-[#97003b] pr-3 text-xs text-zinc-400">
                                  {group.items.map((item) => (
                                    <li className="flex items-center justify-between py-2" key={item.id}>
                                      <span>{item.name}</span>
                                    </li>
                                  ))}
                                  {group.items.length === 0 && <li className="pb-3 text-sm">موردی ثبت نشده است.</li>}
                                </ul>
                              </div>
                            </li>
                          );
                        })}
                        {category.groups.length === 0 && <li className="py-4 text-base text-zinc-400">زیر‌دسته‌ای ثبت نشده است.</li>}
                      </ul>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </aside>
      </div>
    </>
  );
}
