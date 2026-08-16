"use client";

import { Fragment, useMemo, useState, type ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type ExpandedState,
  type Row,
  type RowSelectionState,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DataTableBulkAction<TData> = {
  label: string;
  icon?: ReactNode;
  variant?: "default" | "outline" | "destructive" | "ghost";
  onClick: (selectedRows: TData[], clearSelection: () => void) => void;
};

export type DataTableColumnMeta = {
  headerClassName?: string;
  cellClassName?: string;
};

type DataTableProps<TData> = {
  ariaLabel: string;
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  getRowId: (row: TData) => string;
  bulkActions?: DataTableBulkAction<TData>[];
  className?: string;
  emptyMessage?: string;
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
  getRowCanExpand?: (row: TData) => boolean;
  pageSize?: number;
  renderExpandedRow?: (row: TData) => ReactNode;
  showFooter?: boolean;
  tableClassName?: string;
};

export function DataTable<TData>({
  ariaLabel,
  bulkActions = [],
  className,
  columns,
  data,
  emptyMessage = "رکوردی برای نمایش وجود ندارد.",
  enableRowSelection = true,
  getRowId,
  getRowCanExpand,
  pageSize = 8,
  renderExpandedRow,
  showFooter = true,
  tableClassName,
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const selectionColumn = useMemo<ColumnDef<TData, unknown>>(
    () => ({
      id: "select",
      size: 44,
      enableHiding: false,
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox
          aria-label="انتخاب همه رکوردها"
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onCheckedChange={(checked) => table.toggleAllRowsSelected(checked)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={`انتخاب ردیف ${row.index + 1}`}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(checked) => row.toggleSelected(checked)}
        />
      ),
      meta: {
        headerClassName: "w-11 px-4",
        cellClassName: "w-11 px-4",
      } satisfies DataTableColumnMeta,
    }),
    [],
  );

  const resolvedColumns = useMemo(
    () => (enableRowSelection ? [selectionColumn, ...columns] : columns),
    [columns, enableRowSelection, selectionColumn],
  );

  // TanStack Table intentionally returns callable table APIs; React Compiler skips this hook safely.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns: resolvedColumns,
    data,
    enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowCanExpand: getRowCanExpand
      ? (row) => getRowCanExpand(row.original)
      : undefined,
    getRowId,
    initialState: { pagination: { pageIndex: 0, pageSize } },
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    state: { expanded, rowSelection },
  });

  const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);
  const selectedCount = selectedRows.length;
  const pagination = table.getState().pagination;
  const firstVisibleRow = data.length === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const lastVisibleRow = Math.min(firstVisibleRow + pagination.pageSize - 1, data.length);
  const pageCount = table.getPageCount();

  return (
    <section
      aria-label={ariaLabel}
      className={cn("overflow-hidden rounded-2xl border border-zinc-200 bg-white", className)}
    >
      {selectedCount > 0 ? (
        <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-primary-100 bg-primary-50/70 px-4 py-2">
          <div className="flex items-center gap-2 text-sm font-medium text-primary-700">
            <span>{selectedCount.toLocaleString("fa-IR")} رکورد انتخاب شده</span>
            <Button
              aria-label="لغو انتخاب ردیف‌ها"
              className="text-primary-700"
              onClick={() => table.resetRowSelection()}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <X />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {bulkActions.map((action) => (
              <Button
                key={action.label}
                onClick={() => action.onClick(selectedRows, () => table.resetRowSelection())}
                size="sm"
                type="button"
                variant={action.variant ?? "outline"}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      <Table aria-label={ariaLabel} className={cn("min-w-[900px]", tableClassName)}>
        <TableHeader className="bg-zinc-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="hover:bg-zinc-50" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as DataTableColumnMeta | undefined;
                return (
                  <TableHead
                    className={cn("h-14 px-3 text-xs text-zinc-500", meta?.headerClassName)}
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as DataTableColumnMeta | undefined;
                    return (
                      <TableCell
                        className={cn("h-[70px] px-3 text-xs text-zinc-700", meta?.cellClassName)}
                        key={cell.id}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
                {row.getIsExpanded() && renderExpandedRow ? (
                  <TableRow className="bg-zinc-50/80 hover:bg-zinc-50/80">
                    <TableCell className="p-0 whitespace-normal" colSpan={row.getVisibleCells().length}>
                      {renderExpandedRow(row.original)}
                    </TableCell>
                  </TableRow>
                ) : null}
              </Fragment>
            ))
          ) : (
            <TableRow className="hover:bg-white">
              <TableCell className="h-40 text-center text-sm text-zinc-500" colSpan={resolvedColumns.length}>
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {showFooter ? (
      <footer className="flex min-h-12 flex-wrap items-center justify-between gap-3 border-t border-zinc-200 px-4 py-2 text-xs text-zinc-500">
        <span>
          نمایش {firstVisibleRow.toLocaleString("fa-IR")} تا {lastVisibleRow.toLocaleString("fa-IR")} از {data.length.toLocaleString("fa-IR")} رکورد
        </span>
        {pageCount > 1 ? (
          <nav aria-label="صفحه‌بندی جدول" className="flex items-center gap-1" dir="rtl">
            <Button
              aria-label="صفحه قبلی"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <ChevronRight />
            </Button>
            {Array.from({ length: pageCount }, (_, index) => (
              <Button
                aria-current={pagination.pageIndex === index ? "page" : undefined}
                className={cn(
                  pagination.pageIndex === index && "bg-primary-500 text-white hover:bg-primary-600",
                )}
                key={index}
                onClick={() => table.setPageIndex(index)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                {(index + 1).toLocaleString("fa-IR")}
              </Button>
            ))}
            <Button
              aria-label="صفحه بعدی"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <ChevronLeft />
            </Button>
          </nav>
        ) : null}
      </footer>
      ) : null}
    </section>
  );
}
