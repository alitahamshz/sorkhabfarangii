export type Category = {
  id: string;
  name: string;
  latinName?: string;
  description: string;
  icon: string;
  imageUrl?: string;
  parentId: string | null;
  isActive?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  displayPriority?: number;
  productCount: number;
};

export type CategoryNode = Category & { children: CategoryNode[] };

export const initialCategories: Category[] = [
  { id: "beauty", name: "آرایشی", description: "رژلب، کانسیلر، ریمل، سایه و...", icon: "💄", parentId: null, productCount: 48 },
  { id: "skin", name: "مراقبت پوست", description: "کرم، سرم، ماسک صورت و...", icon: "🧴", parentId: null, productCount: 35 },
  { id: "hair", name: "مراقبت مو", description: "شامپو، نرم‌کننده، ماسک مو و...", icon: "🌿", parentId: null, productCount: 35 },
  { id: "perfume", name: "عطر و ادکلن", description: "ادو پرفیوم، ادو تویلت و...", icon: "🌸", parentId: null, productCount: 24 },
  { id: "health", name: "بهداشتی", description: "صابون، دئودورانت، ضدعفونی و...", icon: "🧼", parentId: null, productCount: 35 },
  { id: "nail", name: "محصولات ناخن", description: "لاک، پولیش، استون و...", icon: "💅", parentId: null, productCount: 35 },

  { id: "lip-makeup", name: "آرایش لب", description: "محصولات آرایشی لب", icon: "💄", parentId: "beauty", productCount: 23 },
  { id: "solid-liquid-lipstick", name: "رژلب جامد و مایع", description: "انواع رژ لب جامد و مایع", icon: "💄", parentId: "lip-makeup", productCount: 3 },
  { id: "lip-balm", name: "بالم لب", description: "بالم و نرم‌کننده لب", icon: "✨", parentId: "lip-makeup", productCount: 2 },
  { id: "face-makeup", name: "آرایش صورت", description: "محصولات آرایشی صورت", icon: "✨", parentId: "beauty", productCount: 23 },
  { id: "foundation", name: "کرم پودر", description: "کرم پودر و زیرساز", icon: "✨", parentId: "face-makeup", productCount: 8 },
  { id: "concealer", name: "کانسیلر", description: "کانسیلر مایع و استیکی", icon: "✨", parentId: "face-makeup", productCount: 6 },
  { id: "powder", name: "پنکیک", description: "پنکیک و پودر فیکس", icon: "✨", parentId: "face-makeup", productCount: 5 },
  { id: "blush", name: "رژگونه", description: "رژگونه پودری و مایع", icon: "✨", parentId: "face-makeup", productCount: 4 },
  { id: "eye-makeup", name: "چشم و ابرو", description: "محصولات آرایش چشم و ابرو", icon: "✨", parentId: "beauty", productCount: 23 },
  { id: "mascara", name: "ریمل", description: "ریمل حجم‌دهنده و بلندکننده", icon: "✨", parentId: "eye-makeup", productCount: 7 },
  { id: "eyeliner", name: "خط چشم", description: "خط چشم مایع و مدادی", icon: "✨", parentId: "eye-makeup", productCount: 5 },
  { id: "eye-shadow", name: "سایه چشم", description: "سایه چشم تکی و پالتی", icon: "✨", parentId: "eye-makeup", productCount: 4 },
  { id: "eyebrow", name: "محصولات ابرو", description: "مداد، ژل و سایه ابرو", icon: "✨", parentId: "eye-makeup", productCount: 4 },
  { id: "eye-pencil", name: "مداد چشم", description: "مداد چشم نرم و ضدآب", icon: "✨", parentId: "eye-makeup", productCount: 3 },
  { id: "makeup-tools", name: "براش و ابزارهای آرایشی", description: "براش و ابزار آرایش", icon: "🖌️", parentId: "beauty", productCount: 23 },
  { id: "brush-set", name: "ست براش", description: "ست براش صورت و چشم", icon: "🖌️", parentId: "makeup-tools", productCount: 23 },

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

  { id: "nail-polish", name: "لاک ناخن", description: "لاک ناخن در رنگ‌های متنوع", icon: "💅", parentId: "nail", productCount: 14 },
  { id: "nail-care", name: "مراقبت ناخن", description: "تقویت‌کننده و روغن ناخن", icon: "💅", parentId: "nail", productCount: 11 },
  { id: "nail-tools", name: "ابزار ناخن", description: "سوهان، پولیش و ابزار مانیکور", icon: "💅", parentId: "nail", productCount: 10 },
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
