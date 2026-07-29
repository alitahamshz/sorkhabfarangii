import Image from "next/image";

const BRANDS = [
  { name: "Cerita", src: "/img/brand1.png" },
  { name: "Vitalayer", src: "/img/brand2.png" },
  { name: "Promax", src: "/img/brand3.png" },
  { name: "Callista", src: "/img/brand4.png" },
];

export function FeaturedBrands() {
  return (
    <section
      aria-labelledby="featured-brands-title"
      className="mx-4 py-8 sm:mx-5 md:mx-auto md:w-[calc(100%-2.5rem)] md:max-w-[77.5rem] md:py-10"
    >
      <div className="mb-4 flex items-center justify-between md:mb-5">
        <h2
          className="text-right text-base font-bold text-zinc-700 md:text-lg"
          id="featured-brands-title"
        >
          برندهای برتر
        </h2>
        <a
          className="text-xs font-semibold text-[#d81968] transition-colors hover:text-[#97003b] md:text-sm"
          href="#"
        >
          مشاهده همه
        </a>
      </div>

      <div
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-5 sm:px-5 md:mx-0 md:gap-5 md:px-0 [&::-webkit-scrollbar]:hidden"
        dir="rtl"
      >
        {BRANDS.map((brand) => (
          <a
            aria-label={`مشاهده محصولات ${brand.name}`}
            className="group relative flex h-16 w-28 shrink-0 snap-start items-center justify-center bg-white p-3 transition-transform duration-200 hover:-translate-y-0.5"
            href="#"
            key={brand.src}
          >
            <Image
              alt={brand.name}
              className="object-contain"
              width={80}
              height={24}
              src={brand.src}
            />
          </a>
        ))}
      </div>
    </section>
  );
}
