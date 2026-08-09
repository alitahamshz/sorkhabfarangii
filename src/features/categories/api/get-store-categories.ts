"use client";

import { buildCategoryMenu } from "../lib/build-category-menu";
import type { CategoryResponse, MenuCategory } from "../model/types";
import { clientApi } from "@/lib/api/client";

export async function getStoreCategories(): Promise<MenuCategory[]> {
  const payload = await clientApi.get<CategoryResponse>("/user/category/index.php", {
    credentials: "omit",
    timeoutMs: 8_000,
  });

  if (payload.status !== "success" || !Array.isArray(payload.res)) return [];

  return buildCategoryMenu(payload.res);
}
