import { getStoreCategories } from "@/features/categories";
import { HomeHero } from "@/features/home";
import { SiteHeader } from "@/features/navigation";

export default async function Home() {
  const categories = await getStoreCategories();

  return (
    <main className="relative min-h-screen bg-[#fff8fc] text-stone-900">
      <SiteHeader categories={categories} />
      <HomeHero />
      <div aria-hidden className="h-[120vh]" />
    </main>
  );
}
