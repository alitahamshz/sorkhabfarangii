import { buildCategoryMenu } from "../lib/build-category-menu";
import type { CategoryResponse, MenuCategory } from "../model/types";
import { serverApi } from "@/lib/api/server";

export async function getStoreCategories(): Promise<MenuCategory[]> {
  try {
    const payload = await serverApi.get<CategoryResponse>("/user/category", {
      next: { revalidate: 300 },
      timeoutMs: 8_000,
    });
    if (payload.status !== "success" || !Array.isArray(payload.res)) return [];

    return buildCategoryMenu(payload.res);
  } catch {
    return [];
  }
}
