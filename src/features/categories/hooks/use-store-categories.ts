"use client";

import { useQuery } from "@tanstack/react-query";
import { getStoreCategories } from "../api/get-store-categories";

export const storeCategoryKeys = {
  all: ["store-categories"] as const,
};

export function useStoreCategories() {
  return useQuery({
    queryKey: storeCategoryKeys.all,
    queryFn: getStoreCategories,
  });
}
