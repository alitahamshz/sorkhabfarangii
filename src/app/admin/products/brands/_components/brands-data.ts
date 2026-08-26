export type Brand = {
  id: string;
  name: string;
  latinName?: string;
  origin: string;
  productCount: number;
  status: "active" | "inactive";
  image?: string;
};

export const initialBrands: Brand[] = [
  { id: "brand-1", name: "نیوآ", latinName: "Nivea", origin: "ایران", productCount: 142, status: "active" },
  { id: "brand-2", name: "سیمپل", latinName: "Simple", origin: "آلمان", productCount: 34, status: "active" },
  { id: "brand-3", name: "شنل", latinName: "Chanel", origin: "فرانسه", productCount: 8, status: "active" },
  { id: "brand-4", name: "نیوآ", latinName: "Nivea", origin: "اتریش", productCount: 27, status: "active" },
  { id: "brand-5", name: "شکلم", origin: "ایران", productCount: 0, status: "active" },
  { id: "brand-6", name: "شنل", latinName: "Chanel", origin: "آلمان", productCount: 18, status: "active" },
  { id: "brand-7", name: "میبلین", latinName: "Maybelline", origin: "فرانسه", productCount: 555, status: "active" },
  { id: "brand-8", name: "سیمپل", latinName: "Simple", origin: "اتریش", productCount: 4, status: "active" },
];
