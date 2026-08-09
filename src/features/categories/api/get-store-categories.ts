"use client";

import { buildCategoryMenu } from "../lib/build-category-menu";
import type { CategoryResponse, MenuCategory } from "../model/types";
import { clientApi } from "@/lib/api/client";

export async function getStoreCategories(): Promise<MenuCategory[]> {
  const payload = await clientApi.get<CategoryResponse>("/user/category/index.php", {
    credentials: "omit",
    timeoutMs: 8_000,
  });

  if (
    payload.success !== "true" ||
    payload.data.status !== "success" ||
    !Array.isArray(payload.data.res)
  ) {
    return [];
  }

  return buildCategoryMenu(payload.data.res);
}
