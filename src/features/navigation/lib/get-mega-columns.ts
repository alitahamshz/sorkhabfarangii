import type { MenuGroup } from "@/features/categories";

const MAX_COLUMN_HEIGHT = 18;

export function getMegaColumns(groups: MenuGroup[]): MenuGroup[][] {
  const columns: MenuGroup[][] = [[]];
  let currentHeight = 0;

  groups.forEach((group) => {
    const groupHeight = group.items.length + 1;

    if (
      currentHeight > 0 &&
      currentHeight + groupHeight > MAX_COLUMN_HEIGHT
    ) {
      columns.push([]);
      currentHeight = 0;
    }

    columns.at(-1)?.push(group);
    currentHeight += groupHeight;
  });

  return columns;
}
