export type Brand = {
  id: string;
  name: string;
  origin: string;
  productCount: number;
  status: "active" | "inactive";
  image?: string;
};

export const initialBrands: Brand[] = [
  { id: "brand-1", name: "نیوآ", origin: "ایران", productCount: 142, status: "active" },
  { id: "brand-2", name: "سیمپل", origin: "آلمان", productCount: 34, status: "active" },
  { id: "brand-3", name: "شنل", origin: "فرانسه", productCount: 8, status: "active" },
  { id: "brand-4", name: "نیوآ", origin: "اتریش", productCount: 27, status: "active" },
  { id: "brand-5", name: "شکلم", origin: "ایران", productCount: 0, status: "active" },
  { id: "brand-6", name: "شنل", origin: "آلمان", productCount: 18, status: "active" },
  { id: "brand-7", name: "میبلین", origin: "فرانسه", productCount: 555, status: "active" },
  { id: "brand-8", name: "سیمپل", origin: "اتریش", productCount: 4, status: "active" },
];
