export type MenuItem = {
  id: string;
  name: string;
};

export type MenuGroup = {
  id: string;
  name: string;
  items: MenuItem[];
};

export type MenuCategory = {
  id: string;
  name: string;
  groups: MenuGroup[];
};

export type ApiCategory = {
  id: string;
  name: string;
  id_parent: string | number;
  status: string;
};

export type CategoryData = {
  status: string;
  res: ApiCategory[];
};

export type CategoryResponse = ApiResponse<CategoryData>;
import type { ApiResponse } from "@/lib/api";
