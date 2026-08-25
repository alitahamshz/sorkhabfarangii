"use client";

import { useSyncExternalStore } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Category } from "./categories-data";

const mobileMediaQuery = "(max-width: 639px)";

function subscribeToMobileView(callback: () => void) {
  const mediaQuery = window.matchMedia(mobileMediaQuery);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getMobileSnapshot() {
  return window.matchMedia(mobileMediaQuery).matches;
}

function getServerMobileSnapshot() {
  return false;
}

type CategoryDeleteDialogProps = {
  category: Category | null;
  onCancel: () => void;
  onConfirm: (category: Category) => void;
};

export function CategoryDeleteDialog({
  category,
  onCancel,
  onConfirm,
}: CategoryDeleteDialogProps) {
  const isMobile = useSyncExternalStore(
    subscribeToMobileView,
    getMobileSnapshot,
    getServerMobileSnapshot,
  );

  if (isMobile) {
    return (
      <Sheet
        onOpenChange={(open) => {
          if (!open) onCancel();
        }}
        open={category !== null}
      >
        <SheetContent
          className="gap-0 rounded-t-[16px] border-zinc-200 bg-white px-6 pt-10 shadow-2xl"
          dir="rtl"
          overlayClassName="bg-black/20"
          showCloseButton={false}
          side="bottom"
          style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
        >
          <SheetTitle className="mx-auto max-w-sm text-center text-base leading-7 font-medium text-zinc-900">
            آیا مطمئن هستید که می‌خواهید (هر چیزی که انتخاب کردید) را حذف کنید؟
          </SheetTitle>

          <div className="mt-6 grid grid-cols-2 gap-4" dir="rtl">
            <SheetClose
              render={
                <Button
                  className="h-[43px] rounded-lg border-zinc-200 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  variant="outline"
                />
              }
            >
              انصراف
            </SheetClose>
            <Button
              className="h-[43px] rounded-lg bg-primary-500 text-sm font-medium text-white hover:bg-primary-600"
              onClick={() => {
                if (category) onConfirm(category);
              }}
              type="button"
            >
              بله حذف شود
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <AlertDialog
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
      open={category !== null}
    >
      <AlertDialogContent
        className="w-[calc(100%_-_32px)] max-w-[352px]! gap-0 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl ring-0"
        dir="rtl"
        size="sm"
      >
        <AlertDialogTitle className="mx-auto max-w-[280px] text-center text-base leading-7 font-medium text-zinc-900">
          آیا مطمئن هستید که می‌خواهید (هر چیزی که انتخاب کردید) را حذف کنید؟
        </AlertDialogTitle>

        <div className="mt-6 grid grid-cols-2 gap-4" dir="rtl">
          <AlertDialogCancel className="h-[43px] rounded-lg border-zinc-200 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            انصراف
          </AlertDialogCancel>
          <Button
            className="h-[43px] rounded-lg bg-primary-500 text-sm font-medium text-white hover:bg-primary-600"
            onClick={() => {
              if (category) onConfirm(category);
            }}
            type="button"
          >
            بله حذف شود
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
