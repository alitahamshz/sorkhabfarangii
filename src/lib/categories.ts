export type MenuGroup = {
  id: string;
  name: string;
  items: { id: string; name: string }[];
};

export type MenuCategory = {
  id: string;
  name: string;
  groups: MenuGroup[];
};

type ApiCategory = {
  id: string;
  name: string;
  id_parent: string | number;
  status: string;
};

type CategoryResponse = { status: string; res: ApiCategory[] };

const categoryEndpoint = "https://sorkhabfarangi.shop/api/v1/user/category";

export async function getStoreCategories(): Promise<MenuCategory[]> {
  try {
    const response = await fetch(categoryEndpoint, { next: { revalidate: 300 } });
    if (!response.ok) return [];

    const payload = (await response.json()) as CategoryResponse;
    if (payload.status !== "success" || !Array.isArray(payload.res)) return [];

    const records = payload.res
      .map((item) => ({ ...item, id: String(item.id), id_parent: String(item.id_parent), name: item.name.trim().replace(/\s+/g, " ") }))
      .filter((item) => /[\u0600-\u06FF]/.test(item.name));

    const childrenByParent = new Map<string, ApiCategory[]>();
    records.forEach((item) => childrenByParent.set(item.id_parent, [...(childrenByParent.get(item.id_parent) ?? []), item]));

    const countDescendants = (id: string, visited = new Set<string>()): number => {
      if (visited.has(id)) return 0;
      const nextVisited = new Set(visited).add(id);
      return (childrenByParent.get(id) ?? []).reduce((total, child) => total + 1 + countDescendants(child.id, nextVisited), 0);
    };

    // پاسخ API چند ریشهٔ تکراری دارد؛ نمونه‌ای که درخت کامل‌تری دارد نمایش داده می‌شود.
    const uniqueRoots = new Map<string, ApiCategory>();
    (childrenByParent.get("-1") ?? [])
      .filter((item) => item.name !== "خانه")
      .forEach((root) => {
        const existing = uniqueRoots.get(root.name);
        if (!existing || countDescendants(root.id) >= countDescendants(existing.id)) uniqueRoots.set(root.name, root);
      });

    return [...uniqueRoots.values()].map((root) => ({
      id: root.id,
      name: root.name,
      groups: (childrenByParent.get(root.id) ?? []).map((group) => ({
        id: group.id,
        name: group.name,
        items: (childrenByParent.get(group.id) ?? []).map((item) => ({ id: item.id, name: item.name })),
      })),
    }));
  } catch {
    return [];
  }
}
