export default function SellerLayout({ children }: { children: React.ReactNode }) {
  // ساختار و طراحی پنل فروشنده در این layout مستقل پیاده‌سازی می‌شود.
  return <div data-panel="seller">{children}</div>;
}

