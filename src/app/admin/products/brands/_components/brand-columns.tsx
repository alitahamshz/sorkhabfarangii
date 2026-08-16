import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DataTableColumnMeta } from "@/components/data-table";
import type { Brand } from "./brands-data";

export function createBrandColumns(
  onView: (brand: Brand) => void,
  onEdit: (brand: Brand) => void,
  onDelete: (brand: Brand) => void,
): ColumnDef<Brand, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: "محصول",
      cell: ({ row }) => (
        <div className="flex min-w-48 items-center gap-3">
          <div
            aria-hidden="true"
            className="size-10 shrink-0 rounded-2xl bg-secondary-50 bg-cover bg-center"
            style={row.original.image ? { backgroundImage: `url(${row.original.image})` } : undefined}
          />
          <span className="text-sm font-medium text-zinc-800">{row.original.name}</span>
        </div>
      ),
      meta: { cellClassName: "min-w-64" } satisfies DataTableColumnMeta,
    },
    {
      accessorKey: "origin",
      header: "کشور",
      meta: { cellClassName: "min-w-28 text-zinc-500" } satisfies DataTableColumnMeta,
    },
    {
      accessorKey: "productCount",
      header: "تعداد محصول",
      cell: ({ row }) => row.original.productCount.toLocaleString("fa-IR"),
      meta: { cellClassName: "min-w-28" } satisfies DataTableColumnMeta,
    },
    {
      accessorKey: "status",
      header: "وضعیت",
      cell: ({ row }) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
            row.original.status === "active"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-zinc-100 text-zinc-500"
          }`}
        >
          {row.original.status === "active" ? "فعال" : "غیرفعال"}
        </span>
      ),
      meta: { cellClassName: "min-w-24" } satisfies DataTableColumnMeta,
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
      meta: {
        headerClassName: "min-w-36",
        cellClassName: "min-w-36",
      } satisfies DataTableColumnMeta,
    },
  ];
}
