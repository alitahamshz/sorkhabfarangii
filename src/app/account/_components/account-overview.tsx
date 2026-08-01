import Link from "next/link";

// این کامپوننت فقط متعلق به مسیر پنل مشتری است.
export function AccountOverview() {
  return (
    <section className="mx-auto max-w-5xl rounded-xl border border-dashed border-zinc-300 bg-white p-8">
      <p className="text-xs text-zinc-400">مسیر محافظت‌شده مشتری</p>
      <h1 className="mt-2 text-2xl font-semibold">پنل مشتری</h1>
      <p className="mt-3 text-sm text-zinc-500">
        سفارش‌ها، علاقه‌مندی‌ها، آدرس‌ها و کیف پول بعداً در این بخش طراحی می‌شوند.
      </p>
      <Link className="mt-6 inline-block text-sm text-zinc-700 underline" href="/">
        بازگشت به فروشگاه
      </Link>
    </section>
  );
}

