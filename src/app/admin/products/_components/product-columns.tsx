import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DataTableColumnMeta } from "@/components/data-table";
import type { Product, ProductStatus } from "./products-data";

const statusLabels: Record<ProductStatus, string> = {
  active: "فعال",
  "low-stock": "کم‌موجود",
  unavailable: "ناموجود",
};

const statusClasses: Record<ProductStatus, string> = {
  active: "bg-emerald-50 text-emerald-600",
  "low-stock": "bg-orange-50 text-orange-600",
  unavailable: "bg-red-50 text-red-600",
};

const priceFormatter = new Intl.NumberFormat("fa-IR");

export function createProductColumns(
  onDelete: (product: Product) => void,
  onEdit: (product: Product) => void,
): ColumnDef<Product, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: "محصول",
      cell: ({ row }) => (
        <div className="flex min-w-60 items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-secondary-50">
            <Image alt="" aria-hidden height={32} src={row.original.image} width={32} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-800">{row.original.name}</p>
            <p className="mt-0.5 text-[11px] text-zinc-400">{row.original.brand}</p>
          </div>
        </div>
      ),
      meta: { cellClassName: "min-w-72" } satisfies DataTableColumnMeta,
    },
    {
      accessorKey: "category",
      header: "دسته‌بندی",
      meta: { cellClassName: "min-w-28" } satisfies DataTableColumnMeta,
    },
    {
      accessorKey: "price",
      header: "قیمت",
      cell: ({ row }) => <span>{priceFormatter.format(row.original.price)} تومان</span>,
      meta: { cellClassName: "min-w-32" } satisfies DataTableColumnMeta,
    },
    {
      accessorKey: "stock",
      header: "موجودی",
      cell: ({ row }) => row.original.stock.toLocaleString("fa-IR"),
    },
    {
      accessorKey: "status",
      header: "وضعیت",
      cell: ({ row }) => (
        <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-medium ${statusClasses[row.original.status]}`}>
          {statusLabels[row.original.status]}
        </span>
      ),
    },
    {
      accessorKey: "rating",
      header: "امتیاز",
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-1 text-zinc-700">
          <Star className="fill-amber-400 text-amber-400" size={16} />
          {row.original.rating.toLocaleString("fa-IR")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "عملیات",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            aria-label={`ویرایش ${row.original.name}`}
            className="text-zinc-500 hover:text-primary-500"
            onClick={() => onEdit(row.original)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <Pencil size={18} />
          </Button>
          <Button
            aria-label={`حذف ${row.original.name}`}
            className="text-red-500"
            onClick={() => onDelete(row.original)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      ),
    },
  ];
}
