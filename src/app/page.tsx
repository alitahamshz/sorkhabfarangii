import { SiteHeader } from "@/components/site-header";
import { getStoreCategories } from "@/lib/categories";

export default async function Home() {
  const categories = await getStoreCategories();

  return (
    <main className="relative min-h-screen bg-[#fff8fc] text-stone-900">
      <div className="absolute inset-x-0 top-0 z-30">
        <SiteHeader categories={categories} />
      </div>
      <section className="mx-auto max-w-7xl px-4 sm:px-5">
        <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_12%_20%,rgba(255,255,255,.86)_1px,transparent_2px),radial-gradient(circle_at_70%_40%,rgba(255,255,255,.7)_1px,transparent_2px),linear-gradient(180deg,#fff_0%,#fff9fc_23%,#fde5f2_100%)] bg-[length:54px_54px,76px_76px,100%_100%] md:min-h-[760px]">
          <span aria-hidden className="absolute left-[12%] top-[16%] text-2xl text-white/70">✦</span>
          <span aria-hidden className="absolute left-[24%] top-[38%] text-lg text-white/75">✿</span>
          <span aria-hidden className="absolute left-[43%] top-[22%] text-xl text-white/60">✦</span>
          <span aria-hidden className="absolute left-[63%] top-[51%] text-2xl text-white/60">✿</span>
          <span aria-hidden className="absolute right-[20%] top-[27%] text-lg text-white/70">✦</span>

          <div className="absolute bottom-0 right-0 h-[68%] w-[36%]" aria-label="محل قرارگیری تصویر مدل" />
        </div>
      </section>
    </main>
  );
}
