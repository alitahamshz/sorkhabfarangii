import { buildCategoryMenu } from "../lib/build-category-menu";
import type { CategoryResponse, MenuCategory } from "../model/types";

const CATEGORY_ENDPOINT =
  "https://sorkhabfarangi.shop/api/v1/user/category";

export async function getStoreCategories(): Promise<MenuCategory[]> {
  try {
    const response = await fetch(CATEGORY_ENDPOINT, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return [];

    const payload = (await response.json()) as CategoryResponse;
    if (payload.status !== "success" || !Array.isArray(payload.res)) return [];

    return buildCategoryMenu(payload.res);
  } catch {
    return [];
  }
}
