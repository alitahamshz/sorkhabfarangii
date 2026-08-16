import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DataTableColumnMeta } from "@/components/data-table";
import type { CategoryNode } from "./categories-data";

export function createCategoryColumns(
  onView: (category: CategoryNode) => void,
  onEdit: (category: CategoryNode) => void,
  onDelete: (category: CategoryNode) => void,
): ColumnDef<CategoryNode, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: "نام دسته بندی اصلی",
      cell: ({ row }) => (
        <div className="flex min-w-52 items-center gap-3">
          <div
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-2xl bg-secondary-50 bg-cover bg-center text-lg"
            style={row.original.imageUrl ? { backgroundImage: `url(${row.original.imageUrl})` } : undefined}
          >
            {!row.original.imageUrl ? row.original.icon : null}
          </div>
          <span className="text-sm font-semibold text-zinc-800">{row.original.name}</span>
        </div>
      ),
      meta: { cellClassName: "min-w-64" } satisfies DataTableColumnMeta,
    },
    {
      id: "children",
      header: "زیر دسته",
      cell: ({ row }) => {
        const count = row.original.children.length;
        return (
          <Button
            aria-expanded={row.getIsExpanded()}
            className={`h-7 gap-1.5 rounded-md px-2.5 text-[11px] ${
              count ? "bg-primary-50 text-primary-600 hover:bg-primary-100" : "text-zinc-400"
            }`}
            disabled={!row.getCanExpand()}
            onClick={row.getToggleExpandedHandler()}
            type="button"
            variant="ghost"
          >
            {count.toLocaleString("fa-IR")} مورد
            <ChevronDown
              className={`transition-transform duration-200 ${row.getIsExpanded() ? "rotate-180" : ""}`}
              size={16}
            />
          </Button>
        );
      },
      meta: { cellClassName: "min-w-28" } satisfies DataTableColumnMeta,
    },
    {
      accessorKey: "productCount",
      header: "تعداد",
      cell: ({ row }) => `${row.original.productCount.toLocaleString("fa-IR")} محصول`,
      meta: { cellClassName: "min-w-28 text-zinc-500" } satisfies DataTableColumnMeta,
    },
    {
      accessorKey: "description",
      header: "توضیحات",
      cell: ({ row }) => (
        <span className="block max-w-48 truncate text-zinc-500">{row.original.description || "—"}</span>
      ),
      meta: { cellClassName: "min-w-56" } satisfies DataTableColumnMeta,
    },
    {
      id: "actions",
      header: "عملیات",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2" dir="ltr">
          <Button
            aria-label={`حذف ${row.original.name}`}
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => onDelete(row.original)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <Trash2 size={21} strokeWidth={1.6} />
          </Button>
          <Button
            aria-label={`ویرایش ${row.original.name}`}
            className="text-zinc-500 hover:text-primary-500"
            onClick={() => onEdit(row.original)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <Pencil size={20} strokeWidth={1.6} />
          </Button>
          <Button
            aria-label={`مشاهده ${row.original.name}`}
            className="text-zinc-500 hover:text-primary-500"
            onClick={() => onView(row.original)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <Eye size={22} strokeWidth={1.6} />
          </Button>
        </div>
      ),
      meta: { headerClassName: "min-w-36", cellClassName: "min-w-36" } satisfies DataTableColumnMeta,
    },
  ];
}
