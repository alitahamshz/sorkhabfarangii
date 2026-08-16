import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import type { CategoryNode } from "./categories-data";

type CategoryTreeTableProps = {
  categories: CategoryNode[];
  columns: ColumnDef<CategoryNode, unknown>[];
  depth?: number;
};

export function CategoryTreeTable({ categories, columns, depth = 0 }: CategoryTreeTableProps) {
  return (
    <DataTable
      ariaLabel={depth === 0 ? "لیست دسته‌بندی‌ها" : `زیر دسته‌های سطح ${depth.toLocaleString("fa-IR")}`}
      className={depth > 0 ? "rounded-xl border-primary-100 shadow-sm" : undefined}
      columns={columns}
      data={categories}
      emptyMessage="دسته‌بندی‌ای برای نمایش وجود ندارد."
      enableRowSelection={false}
      getRowCanExpand={(category) => category.children.length > 0}
      getRowId={(category) => category.id}
      pageSize={depth === 0 ? 8 : Math.max(categories.length, 1)}
      renderExpandedRow={(category) => (
        <div className="p-3 sm:p-4">
          <CategoryTreeTable categories={category.children} columns={columns} depth={depth + 1} />
        </div>
      )}
      showFooter={depth === 0}
      tableClassName={depth > 0 ? "bg-white" : undefined}
    />
  );
}
