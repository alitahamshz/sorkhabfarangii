"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const PRODUCTS = [
  { id: "dove-1", discount: "۲۵٪", price: "۳۵۱,۱۰۰ تومان" },
  { id: "dove-2", discount: "۲۵٪", price: "۳۵۱,۱۰۰ تومان" },
  { id: "dove-3", discount: "۲۵٪", price: "۳۵۱,۱۰۰ تومان" },
  { id: "dove-4", discount: "۲۵٪", price: "۳۵۱,۱۰۰ تومان" },
];

const WINE_STARS = [
  "left-5 top-6 text-sm", "left-[16%] top-20 text-xs", "left-[34%] top-9 text-base",
  "left-[52%] top-28 text-xs", "left-[69%] top-12 text-sm", "left-[86%] top-24 text-xs",
  "left-[9%] bottom-10 text-base", "left-[27%] bottom-20 text-xs", "left-[47%] bottom-8 text-sm",
  "left-[64%] bottom-16 text-xs", "left-[81%] bottom-7 text-base", "right-5 bottom-24 text-xs",
];

type ProductsShelfVariant = "wine" | "rose" | "plain";

type ProductsShelfProps = {
  title: string;
  variant?: ProductsShelfVariant;
  categories?: string[];
  viewAllHref?: string;
};

const SHELF_STYLES: Record<
  ProductsShelfVariant,
  { section: string; title: string; viewAll: string; tab: string; activeTab: string }
> = {
  wine: {
    section: "bg-[#85002f]",
    title: "text-white",
    viewAll: "text-white/90 hover:text-white",
    tab: "bg-white/20 text-white hover:bg-white/30",
    activeTab: "bg-white text-[#85002f]",
  },
  rose: {
    section: "bg-[#fff1f7]",
    title: "text-zinc-700",
    viewAll: "text-[#d81968] hover:text-[#97003b]",
    tab: "bg-white text-zinc-600 hover:bg-[#fff7fb]",
    activeTab: "bg-[#d81968] text-white",
  },
  plain: {
    section: "bg-white",
    title: "text-zinc-700",
    viewAll: "text-[#d81968] hover:text-[#97003b]",
    tab: "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
    activeTab: "bg-zinc-700 text-white",
  },
};

function ProductImage() {
  return (
    <div className="relative aspect-square overflow-hidden rounded-sm bg-[#f8f0d7]">
      <Image alt="مایع دستشویی داو" height={386} src="/img/product.png" width={360} />
      <button
        aria-label="افزودن به علاقه‌مندی‌ها"
        className="absolute left-2 top-2 grid size-8 place-items-center rounded-full bg-white/90 text-zinc-500"
        type="button"
      >
        <Heart size={18} strokeWidth={1.5} />
      </button>
    </div>
  );
}

function ProductCard({ discount, price }: { discount: string; price: string }) {
  return (
    <article className="w-44 shrink-0 snap-start overflow-hidden rounded-md bg-white p-2.5">
      <ProductImage />
      <div className="pt-2.5" dir="rtl">
        <p className="text-xs text-zinc-400">داو</p>
        <h3 className="mt-1 h-10 overflow-hidden text-sm leading-5 text-zinc-600">
          مایع دستشویی خوشبو داو
        </h3>
        <div className="mt-4 flex items-end justify-between gap-2">
          <button aria-label="افزودن مایع دستشویی داو به سبد خرید" className="text-[#97003b]" type="button">
            <Image alt="سبد خرید" height={24} src="/icon/productCard/cartp.svg" width={24} />
          </button>
          <div>
            <div className="flex items-center gap-1 text-[10px]">
              <del className="text-zinc-400">۴۶۸,۱۰۰</del>
              <span className="rounded-sm bg-[#fff7f7] px-1.5 font-bold text-[#d81968]">{discount}</span>
            </div>
            <p className="mt-1 whitespace-nowrap text-xs font-medium text-zinc-700">{price}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

/** A reusable product row: choose its background with `variant` and optionally pass category tabs. */
export function ProductsShelf({
  title,
  variant = "rose",
  categories,
  viewAllHref = "#",
}: ProductsShelfProps) {
  const [activeCategory, setActiveCategory] = useState(categories?.[0]);
  const styles = SHELF_STYLES[variant];
  const titleId = `products-shelf-${title.replaceAll(" ", "-")}`;

  return (
    <section aria-labelledby={titleId} className={`relative overflow-hidden ${styles.section}`}>
      {variant === "wine" && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden text-white">
          {WINE_STARS.map((position) => (
            <span className={`absolute ${position}`} key={position}>★</span>
          ))}
        </div>
      )}
      <div className="mx-auto max-w-[77.5rem] px-4 py-8 sm:px-5 md:py-10">
        <div className="mb-4 flex items-center justify-between md:mb-5" dir="rtl">
          <h2 className={`text-base font-bold md:text-lg ${styles.title}`} id={titleId}>{title}</h2>
          <a className={`text-xs font-semibold transition-colors md:text-sm ${styles.viewAll}`} href={viewAllHref}>
            مشاهده همه
          </a>
        </div>

        {categories && categories.length > 0 && (
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" dir="rtl">
            {categories.map((category) => (
              <button
                className={`shrink-0 rounded-md px-4 py-2 text-sm transition-colors ${
                  activeCategory === category ? styles.activeTab : styles.tab
                }`}
                key={category}
                onClick={() => setActiveCategory(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-2 [scrollbar-width:none] sm:-mx-5 sm:px-5 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden" dir="rtl">
          {PRODUCTS.map((product) => <ProductCard {...product} key={product.id} />)}
        </div>
      </div>
    </section>
  );
}

export function PopularProducts() {
  return <ProductsShelf title="پرفروش‌ترین‌ها" variant="rose" />;
}
