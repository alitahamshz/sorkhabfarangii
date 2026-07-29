import {
  getStoreCategories,
  ProductCategories,
} from "@/features/categories";
import { FeaturedBrands, HomeHero, PopularProducts } from "@/features/home";
import { SiteHeader } from "@/features/navigation";

export default async function Home() {
  const categories = await getStoreCategories();

  return (
    <main className="relative min-h-screen bg-white text-stone-900">
      <SiteHeader categories={categories} />
      <HomeHero />
      <ProductCategories categories={categories} />
      <PopularProducts />
      <FeaturedBrands />
      <PopularProducts />
      <div aria-hidden />
    </main>
  );
}
