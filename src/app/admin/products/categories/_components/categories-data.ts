export type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
  imageUrl?: string;
  parentId: string | null;
  productCount: number;
};

export type CategoryNode = Category & { children: CategoryNode[] };

export const initialCategories: Category[] = [
  { id: "beauty", name: "آرایشی", description: "رژلب، کانسیلر، ریمل، سایه و...", icon: "💄", parentId: null, productCount: 42 },
  { id: "skin", name: "پوستی", description: "کرم، سرم، ماسک صورت و...", icon: "🧴", parentId: null, productCount: 38 },
  { id: "health", name: "بهداشتی", description: "شامپو، نرم‌کننده، ماسک مو و...", icon: "🧼", parentId: null, productCount: 35 },
  { id: "perfume", name: "عطر و ادکلن", description: "ادو پرفیوم، ادو تویلت و...", icon: "🌸", parentId: null, productCount: 31 },
  { id: "hair", name: "مو", description: "کرم، سرم، ماسک صورت و...", icon: "🌿", parentId: null, productCount: 34 },
  { id: "electric", name: "لوازم برقی", description: "سشوار، اتو مو، حالت‌دهنده و...", icon: "💄", parentId: null, productCount: 32 },

  { id: "lipstick", name: "رژ لب", description: "رژ لب جامد، مایع و مدادی", icon: "💄", parentId: "beauty", productCount: 16 },
  { id: "mascara", name: "ریمل", description: "ریمل حجم‌دهنده و بلندکننده", icon: "✨", parentId: "beauty", productCount: 14 },
  { id: "concealer", name: "کانسیلر", description: "کانسیلر مایع و استیکی", icon: "✨", parentId: "beauty", productCount: 12 },

  { id: "cream", name: "کرم صورت", description: "کرم مرطوب‌کننده و آبرسان", icon: "🧴", parentId: "skin", productCount: 14 },
  { id: "serum", name: "سرم پوست", description: "سرم روشن‌کننده و ضدچروک", icon: "🧴", parentId: "skin", productCount: 13 },
  { id: "face-mask", name: "ماسک صورت", description: "ماسک ورقه‌ای و کرمی", icon: "🧴", parentId: "skin", productCount: 11 },

  { id: "body-care", name: "مراقبت بدن", description: "لوسیون و کرم بدن", icon: "🧼", parentId: "health", productCount: 13 },
  { id: "deodorant", name: "دئودورانت", description: "اسپری و رول ضدتعریق", icon: "🧼", parentId: "health", productCount: 12 },
  { id: "soap", name: "شوینده", description: "صابون و ژل شست‌وشو", icon: "🧼", parentId: "health", productCount: 10 },

  { id: "women-perfume", name: "عطر زنانه", description: "عطر و ادکلن زنانه", icon: "🌸", parentId: "perfume", productCount: 12 },
  { id: "men-perfume", name: "عطر مردانه", description: "عطر و ادکلن مردانه", icon: "🌸", parentId: "perfume", productCount: 11 },
  { id: "unisex-perfume", name: "عطر یونی‌سکس", description: "رایحه‌های مشترک", icon: "🌸", parentId: "perfume", productCount: 8 },

  { id: "shampoo", name: "شامپو", description: "شامپو برای انواع مو", icon: "🌿", parentId: "hair", productCount: 13 },
  { id: "hair-mask", name: "ماسک مو", description: "ماسک ترمیم و تقویت مو", icon: "🌿", parentId: "hair", productCount: 11 },
  { id: "hair-color", name: "رنگ مو", description: "رنگ مو و اکسیدان", icon: "🌿", parentId: "hair", productCount: 10 },

  { id: "hair-dryer", name: "سشوار", description: "سشوار خانگی و حرفه‌ای", icon: "⚡", parentId: "electric", productCount: 12 },
  { id: "hair-iron", name: "اتو مو", description: "اتو مو و حالت‌دهنده", icon: "⚡", parentId: "electric", productCount: 11 },
  { id: "facial-device", name: "دستگاه پاکسازی", description: "ابزار برقی مراقبت پوست", icon: "⚡", parentId: "electric", productCount: 9 },
];

export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const nodes = new Map<string, CategoryNode>(
    categories.map((category) => [category.id, { ...category, children: [] }]),
  );
  const roots: CategoryNode[] = [];

  nodes.forEach((node) => {
    const parent = node.parentId ? nodes.get(node.parentId) : undefined;
    if (parent && parent.id !== node.id) parent.children.push(node);
    else roots.push(node);
  });

  return roots;
}
