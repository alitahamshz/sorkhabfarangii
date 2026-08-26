"use client";

import { ArrowRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export type CategoryChildrenFilter = "all" | "with-children" | "without-children";
export type CategoryStatusFilter = "all" | "active" | "inactive";

type CategoryFilterSheetProps = {
  childrenFilter: CategoryChildrenFilter;
  onChildrenFilterChange: (value: CategoryChildrenFilter) => void;
  onOpenChange: (open: boolean) => void;
  onStatusFilterChange: (value: CategoryStatusFilter) => void;
  open: boolean;
  statusFilter: CategoryStatusFilter;
};

const childrenOptions: { label: string; value: CategoryChildrenFilter }[] = [
  { label: "همه", value: "all" },
  { label: "دارای زیر دسته", value: "with-children" },
  { label: "بدون زیر دسته", value: "without-children" },
];

const statusOptions: { label: string; value: CategoryStatusFilter }[] = [
  { label: "همه", value: "all" },
  { label: "فعال", value: "active" },
  { label: "غیرفعال", value: "inactive" },
];

export function CategoryFilterSheet({
  childrenFilter,
  onChildrenFilterChange,
  onOpenChange,
  onStatusFilterChange,
  open,
  statusFilter,
}: CategoryFilterSheetProps) {
  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent
        aria-describedby={undefined}
        className="w-[313px] max-w-full gap-0 rounded-r-2xl border-0 bg-white p-0 shadow-2xl sm:max-w-[313px]"
        dir="rtl"
        showCloseButton={false}
        side="left"
      >
        <SheetHeader className="border-b border-zinc-200 px-4 py-0">
          <div className="flex h-14 items-center gap-3">
            <SheetClose
              aria-label="بستن فیلترها"
              className="grid size-8 shrink-0 place-items-center rounded-lg text-zinc-700 transition-colors hover:bg-zinc-100"
            >
              <ArrowRight size={21} strokeWidth={1.5} />
            </SheetClose>
            <SheetTitle className="text-base font-medium text-zinc-900">فیلتر</SheetTitle>
          </div>
        </SheetHeader>

        <div className="space-y-5 px-4 pt-4 text-sm text-zinc-500">
          <fieldset className="space-y-2.5">
            <legend className="mb-2 font-medium text-zinc-800">زیر دسته:</legend>
            {childrenOptions.map((option) => (
              <label className="flex cursor-pointer items-center gap-2" key={option.value}>
                <Checkbox
                  aria-label={option.label}
                  checked={childrenFilter === option.value}
                  onCheckedChange={() => onChildrenFilterChange(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>

          <fieldset className="space-y-2.5">
            <legend className="mb-2 font-medium text-zinc-800">وضعیت:</legend>
            {statusOptions.map((option) => (
              <label className="flex cursor-pointer items-center gap-2" key={option.value}>
                <Checkbox
                  aria-label={option.label}
                  checked={statusFilter === option.value}
                  onCheckedChange={() => onStatusFilterChange(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
        </div>
      </SheetContent>
    </Sheet>
  );
}
