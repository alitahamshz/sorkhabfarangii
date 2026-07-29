import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";

const PRODUCTS = [
  { id: "dove-1", discount: "۲۵٪", price: "۳۵۱,۱۰۰ تومان" },
  { id: "dove-2", discount: "۲۵٪", price: "۳۵۱,۱۰۰ تومان" },
  { id: "dove-3", discount: "۲۵٪", price: "۳۵۱,۱۰۰ تومان" },
  { id: "dove-4", discount: "۲۵٪", price: "۳۵۱,۱۰۰ تومان" },
];

function ProductImage() {
  return (
    <div className="relative aspect-square overflow-hidden rounded-sm bg-[#f8f0d7]">
      <Image
        alt=""
        aria-hidden
        // className="pointer-events-none absolute left-0 top-0 max-w-none -translate-x-[170px] -translate-y-[48px]"
        height={386}
        src="/img/product.png"
        width={360}
      />
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

function ProductCard({
  discount,
  price,
}: {
  discount: string;
  price: string;
}) {
  return (
    <article className="w-44 shrink-0 snap-start overflow-hidden rounded-md bg-white p-2.5">
      <ProductImage />
      <div className="pt-2.5" dir="rtl">
        <p className="text-xs text-zinc-400">داو</p>
        <h3 className="mt-1 h-10 overflow-hidden text-sm leading-5 text-zinc-600">
          مایع دستشویی خوشبو داو
        </h3>
        <div className="mt-4 flex items-end justify-between gap-2">
          <button
            aria-label="افزودن مایع دستشویی داو به سبد خرید"
            className="text-[#97003b]"
            type="button"
          >
            {/* <ShoppingCart size={26} strokeWidth={1.5} /> */}
            <Image width={24} height={24} alt="cart" src={'/icon/productCard/cartp.svg'}></Image>
          </button>
          <div>
            <div className="flex items-center gap-1 text-[10px]">
              <del className="text-zinc-400">۴۶۸,۱۰۰</del>
              <span className="font-bold bg-[#fff7f7] px-1.5 rounded-sm text-[#d81968]">{discount}</span>
            </div>
            <p className="mt-1 whitespace-nowrap text-xs font-medium text-zinc-700">
              {price}
            </p>
          </div>

        </div>
      </div>
    </article>
  );
}

export function PopularProducts() {
  return (
    <section
      aria-labelledby="popular-products-title"
      className="mx-4 py-8 sm:mx-5 md:mx-auto md:w-[calc(100%-2.5rem)] md:max-w-[77.5rem] md:py-10"
    >
      <div className="mb-4 flex items-center justify-between md:mb-5">
        <h2
          className="text-right text-base font-bold text-zinc-700 md:text-lg"
          id="popular-products-title"
        >
          پرطرفدارها
        </h2>
        <a
          className="text-xs font-semibold text-[#d81968] transition-colors hover:text-[#97003b] md:text-sm"
          href="#"
        >
          مشاهده بیشتر
        </a>
      </div>

      <div
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto bg-[#fff8fc] px-4 py-2 [scrollbar-width:none] sm:-mx-5 sm:px-5 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
        dir="rtl"
      >
        {PRODUCTS.map((product) => (
          <ProductCard {...product} key={product.id} />
        ))}
      </div>
    </section>
  );
}
