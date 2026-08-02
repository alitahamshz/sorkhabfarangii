import Image from "next/image";
import Link from "next/link";

type MagazineArticle = {
  title: string;
  image: string;
  href?: string;
};

type OurMagazineProps = {
  articles: MagazineArticle[];
  viewAllHref?: string;
};

/** A compact row of magazine articles for the home page. */
export function OurMagazine({ articles, viewAllHref = "#" }: OurMagazineProps) {
  return (
    <section
      aria-labelledby="our-magazine-title"
      className="mx-auto max-w-[77.5rem] px-4 py-8 sm:px-5 md:py-10"
      dir="rtl"
    >
      <div className="relative mb-4 flex items-center justify-center">
        <h2
          className="leading-none text-base font-bold text-zinc-700 md:text-lg"
          id="our-magazine-title"
        >
          مجله ما
        </h2>
        <Link
          className="absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-bold leading-none text-secondary-700 transition-colors hover:text-primary-500 md:text-sm"
          href={viewAllHref}
        >
          مشاهده همه
        </Link>
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-5 sm:px-5 md:mx-0 md:gap-5 md:px-0 [&::-webkit-scrollbar]:hidden">
        {articles.map((article) => (
          <Link
            className="group relative aspect-[0.8] w-[42%] shrink-0 snap-start overflow-hidden rounded-md bg-zinc-100 sm:w-48 md:w-64"
            href={article.href ?? "#"}
            key={`${article.title}-${article.image}`}
          >
            <Image
              alt={article.title}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              fill
              sizes="(max-width: 768px) 32vw, 390px"
              src={article.image}
            />
            <div className="absolute inset-x-0 bottom-0 flex h-[30%] items-start bg-black/30 px-2 pt-2">
              <span
                aria-hidden
                className="absolute right-1 bottom-0 text-xs text-white/45"
              >
                ✦
              </span>
              <h3 className="line-clamp-2 w-full text-right text-[12px] font-medium leading-4 text-white sm:text-lg md:text-sm">
                {article.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
