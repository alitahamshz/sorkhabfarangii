// این کامپوننت فقط متعلق به مسیر داشبورد فروشنده است.
export function SellerDashboard() {
  return (
    <section className="mx-auto max-w-6xl rounded-xl border border-dashed border-stone-300 bg-white p-8">
      <p className="text-xs text-stone-400">مسیر محافظت‌شده فروشنده</p>
      <h1 className="mt-2 text-2xl font-semibold">داشبورد فروشنده</h1>
      <p className="mt-3 text-sm text-stone-500">
        طراحی، منوها و امکانات فروشندگی بعداً در layout مستقل فروشنده پیاده‌سازی می‌شوند.
      </p>
    </section>
  );
}

