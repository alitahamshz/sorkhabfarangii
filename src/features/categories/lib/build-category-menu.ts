import type { ApiCategory, MenuCategory } from "../model/types";

function countDescendants(
  id: string,
  childrenByParent: Map<string, ApiCategory[]>,
  visited = new Set<string>(),
): number {
  if (visited.has(id)) return 0;

  const nextVisited = new Set(visited).add(id);
  return (childrenByParent.get(id) ?? []).reduce(
    (total, child) =>
      total + 1 + countDescendants(child.id, childrenByParent, nextVisited),
    0,
  );
}

export function buildCategoryMenu(categories: ApiCategory[]): MenuCategory[] {
  const records = categories
    .map((item) => ({
      ...item,
      id: String(item.id),
      id_parent: String(item.id_parent),
      name: item.name.trim().replace(/\s+/g, " "),
    }))
    .filter((item) => /[\u0600-\u06FF]/.test(item.name));

  const childrenByParent = new Map<string, ApiCategory[]>();

  records.forEach((item) => {
    const siblings = childrenByParent.get(item.id_parent) ?? [];
    childrenByParent.set(item.id_parent, [...siblings, item]);
  });

  // پاسخ API چند ریشهٔ تکراری دارد؛ ریشه‌ای با درخت کامل‌تر انتخاب می‌شود.
  const uniqueRoots = new Map<string, ApiCategory>();

  (childrenByParent.get("-1") ?? [])
    .filter((item) => item.name !== "خانه")
    .forEach((root) => {
      const existing = uniqueRoots.get(root.name);
      if (
        !existing ||
        countDescendants(root.id, childrenByParent) >=
          countDescendants(existing.id, childrenByParent)
      ) {
        uniqueRoots.set(root.name, root);
      }
    });

  return [...uniqueRoots.values()].map((root) => ({
    id: root.id,
    name: root.name,
    groups: (childrenByParent.get(root.id) ?? []).map((group) => ({
      id: group.id,
      name: group.name,
      items: (childrenByParent.get(group.id) ?? []).map((item) => ({
        id: item.id,
        name: item.name,
      })),
    })),
  }));
}
