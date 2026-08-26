import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { DataTableColumnMeta } from "@/components/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
        <div className="flex min-w-0 items-center gap-2 md:min-w-48 md:gap-3">
          <div
            aria-hidden="true"
            className="size-10 shrink-0 rounded-2xl bg-secondary-50 bg-cover bg-center"
            style={row.original.image ? { backgroundImage: `url(${row.original.image})` } : undefined}
          />
          <span className="min-w-0 truncate text-sm font-medium text-zinc-800">{row.original.name}</span>
        </div>
      ),
      meta: {
        headerClassName: "w-[45%] px-3 md:w-auto",
        cellClassName: "w-[45%] min-w-0 px-3 md:w-auto md:min-w-64",
      } satisfies DataTableColumnMeta,
    },
    {
      accessorKey: "origin",
      header: "کشور",
      meta: {
        headerClassName: "w-[30%] px-1 md:w-auto md:px-3",
        cellClassName: "w-[30%] min-w-0 px-1 text-zinc-500 md:w-auto md:min-w-28 md:px-3",
      } satisfies DataTableColumnMeta,
    },
    {
      accessorKey: "productCount",
      header: "تعداد محصول",
      cell: ({ row }) => row.original.productCount.toLocaleString("fa-IR"),
      meta: {
        headerClassName: "hidden md:table-cell",
        cellClassName: "hidden min-w-28 md:table-cell",
      } satisfies DataTableColumnMeta,
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
      meta: {
        headerClassName: "hidden md:table-cell",
        cellClassName: "hidden min-w-24 md:table-cell",
      } satisfies DataTableColumnMeta,
    },
    {
      id: "actions",
      header: "عملیات",
      enableHiding: false,
      cell: ({ row }) => (
        <>
          <div className="hidden items-center gap-2 md:flex" dir="ltr">
            <Button
              aria-label={`حذف ${row.original.name}`}
              className="hover:bg-red-50"
              onClick={() => onDelete(row.original)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <Image alt="" aria-hidden="true" height={32} src="/icon/adminDashboard/deleteBtn.svg" width={32} />
            </Button>
            <Button
              aria-label={`ویرایش ${row.original.name}`}
              onClick={() => onEdit(row.original)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <Image alt="" aria-hidden="true" height={32} src="/icon/adminDashboard/editBtn.svg" width={32} />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`عملیات ${row.original.name}`}
              className="mx-auto grid size-8 place-items-center rounded-md text-zinc-500 outline-none hover:bg-zinc-100 data-popup-open:bg-zinc-100 md:hidden"
            >
              <Image alt="" aria-hidden="true" height={24} src="/icon/adminDashboard/more.svg" width={24} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[112px]! min-w-[112px] overflow-hidden rounded-lg bg-white p-0 shadow-lg ring-1 ring-zinc-200"
              dir="rtl"
              sideOffset={4}
            >
              <DropdownMenuItem className="h-9 justify-between rounded-none border-b border-zinc-100 px-3 text-xs text-zinc-500" onClick={() => onView(row.original)}>
                <Image alt="" aria-hidden="true" height={18} src="/icon/adminDashboard/eyeIcon.png" width={18} />
                <span>مشاهده</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="h-9 justify-between rounded-none border-b border-zinc-100 px-3 text-xs text-zinc-500" onClick={() => onEdit(row.original)}>
                <Image alt="" aria-hidden="true" height={24} src="/icon/adminDashboard/editBtn.svg" width={24} />
                <span>ویرایش</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="h-9 justify-between rounded-none px-3 text-xs" onClick={() => onDelete(row.original)} variant="destructive">
                <Image alt="" aria-hidden="true" height={24} src="/icon/adminDashboard/deleteBtn.svg" width={24} />
                <span>حذف</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ),
      meta: {
        headerClassName: "w-[25%] px-1 text-center md:w-auto md:min-w-36 md:px-3 md:text-start",
        cellClassName: "w-[25%] min-w-0 px-1 md:w-auto md:min-w-36 md:px-3",
      } satisfies DataTableColumnMeta,
    },
  ];
}
