import Image from "next/image";
import type { MenuCategory } from "../model/types";

const CATEGORY_ICONS = [
  "/icon/icon1.svg",
  "/icon/icon2.svg",
  "/icon/icon3.svg",
  "/icon/icon4.svg",
  "/icon/icon5.svg",
  "/icon/icon6.svg",
  "/icon/icon7.svg",
];

export function ProductCategories({
  categories,
}: {
  categories: MenuCategory[];
}) {
  if (categories.length === 0) return null;

  return (
    <section
      aria-labelledby="product-categories-title"
      className="mx-4 py-8 sm:mx-5 md:mx-auto md:w-[calc(100%-2.5rem)] md:max-w-[77.5rem] md:py-10"
    >
      <div className="mb-4 flex items-center justify-between md:mb-5">
        <h2
          className="text-right text-base font-bold text-zinc-700 md:text-lg"
          id="product-categories-title"
        >
          دسته بندی محصولات
        </h2>
        <a
          className="text-xs font-semibold text-secondary-700 transition-colors hover:text-primary-500 md:text-sm"
          href="#"
        >
          مشاهده بیشتر
        </a>
      </div>

      <div
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-5 sm:px-5 md:mx-0 md:gap-5 md:px-0 [&::-webkit-scrollbar]:hidden"
        dir="rtl"
      >
        {categories.map((category, index) => (
          <a
            className="group flex w-16 shrink-0 snap-start flex-col items-center gap-2"
            href="#"
            key={category.id}
          >
            <Image
              alt=""
              aria-hidden
              className="size-16 transition-transform duration-200 group-hover:-translate-y-0.5"
              height={64}
              src={CATEGORY_ICONS[index % CATEGORY_ICONS.length]}
              width={64}
            />
            <span className="w-full truncate text-center text-xs font-medium text-zinc-600 md:text-sm">
              {category.name}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
