import {
  getStoreCategories,
  ProductCategories,
} from "@/features/categories";
import { FeaturedBrands, HomeHero, OurMagazine, ProductsShelf, SingleBanner } from "@/features/home";
import { SiteFooter, SiteHeader } from "@/features/navigation";

export default async function Home() {
  const categories = await getStoreCategories();

  return (
    <main className="relative min-h-screen bg-white text-stone-900">
      <SiteHeader categories={categories} />
      <HomeHero />
      <ProductCategories categories={categories} />
      <ProductsShelf title="پیشنهاد سرخاب فرنگی" variant="plain" />
      <FeaturedBrands />
      <ProductsShelf
        categories={["همه", "میسلار", "آبرسان", "تونر"]}
        title="تخفیف سرخاب فرنگی"
        variant="rose"
      />
      <ProductsShelf title="پرطرفدارها" variant="plain" />
      <ProductsShelf
        categories={["همه", "میسلار", "آبرسان", "تونر"]}
        title="پرطرفدار پوست"
        variant="wine"
      />
      <SingleBanner alt="پیشنهاد ویژه" image="/img/landingbanner.png" />
      <ProductsShelf title="منتخب سرخاب فرنگی" variant="plain" />
      <OurMagazine
        articles={[
          { image: "/img/girl.png", title: "ترفندهای ساده برای مراقبت از پوست" },
          { image: "/img/woman.png", title: "راهنمای انتخاب محصولات آرایشی" },
          { image: "/img/woman.png", title: "بهترین روتین مراقبت روزانه" },
        ]}
      />
      <SiteFooter />
      <div aria-hidden />
    </main>
  );
}
