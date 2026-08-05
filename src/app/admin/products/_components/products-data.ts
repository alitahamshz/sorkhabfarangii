export type ProductStatus = "active" | "low-stock" | "unavailable";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  rating: number;
  image: string;
};

export const initialProducts: Product[] = [
  { id: "PR-1001", name: "کرم ضد آفتاب SPF50 نیوآ", brand: "نیوآ", category: "مراقبت پوست", price: 185000, stock: 142, status: "active", rating: 4.5, image: "/img/product.png" },
  { id: "PR-1002", name: "ماسک موی آرگان فاگرو", brand: "فاگرو", category: "مراقبت مو", price: 185000, stock: 34, status: "active", rating: 4.2, image: "/img/product.png" },
  { id: "PR-1003", name: "رژ لب مات شانل شماره ۱۲", brand: "شانل", category: "آرایشی", price: 185000, stock: 8, status: "low-stock", rating: 4.8, image: "/img/product.png" },
  { id: "PR-1004", name: "سرم ویتامین C اولوهندریکسن", brand: "اولوهندریکسن", category: "مراقبت پوست", price: 185000, stock: 27, status: "active", rating: 4.6, image: "/img/product.png" },
  { id: "PR-1005", name: "پنکیک مایع لورآل پاریس", brand: "لورآل", category: "آرایشی", price: 185000, stock: 0, status: "unavailable", rating: 4.1, image: "/img/product.png" },
  { id: "PR-1006", name: "عطر ادو پرفیوم رزا", brand: "رزا", category: "عطر", price: 185000, stock: 18, status: "active", rating: 4.7, image: "/img/product.png" },
  { id: "PR-1007", name: "کرم دور چشم رینتاز", brand: "رینتاز", category: "مراقبت پوست", price: 185000, stock: 55, status: "active", rating: 4.3, image: "/img/product.png" },
  { id: "PR-1008", name: "روغن آرگان مرطوب‌کننده بیوسیلک", brand: "بیوسیلک", category: "مراقبت مو", price: 185000, stock: 4, status: "low-stock", rating: 4.4, image: "/img/product.png" },
  { id: "PR-1009", name: "ریمل حجم‌دهنده اسنس", brand: "اسنس", category: "آرایشی", price: 245000, stock: 76, status: "active", rating: 4.6, image: "/img/product.png" },
  { id: "PR-1010", name: "تونر صورت سیمپل", brand: "سیمپل", category: "مراقبت پوست", price: 310000, stock: 11, status: "active", rating: 4.2, image: "/img/product.png" },
  { id: "PR-1011", name: "شامپو بدون سولفات لافارر", brand: "لافارر", category: "مراقبت مو", price: 198000, stock: 0, status: "unavailable", rating: 4.0, image: "/img/product.png" },
  { id: "PR-1012", name: "مداد چشم ضد آب فلورمار", brand: "فلورمار", category: "آرایشی", price: 126000, stock: 6, status: "low-stock", rating: 4.5, image: "/img/product.png" },
];
