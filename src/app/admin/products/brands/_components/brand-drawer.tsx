"use client";
/* eslint-disable react-hooks/set-state-in-effect -- form fields must reset when the persistent animated sheet opens */

import { useEffect, useId, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Brand } from "./brands-data";

type BrandDrawerProps = {
  brand: Brand | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (brand: Omit<Brand, "id" | "productCount" | "status">) => void;
};

const acceptedImageTypes = ["image/png", "image/jpeg"];

export function BrandDrawer({ brand, open, onOpenChange, onSave }: BrandDrawerProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(brand?.name ?? "");
  const [origin, setOrigin] = useState(brand?.origin ?? "");
  const [image, setImage] = useState<string | undefined>(brand?.image);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(brand?.name ?? "");
    setOrigin(brand?.origin ?? "");
    setImage(brand?.image);
    setFileError("");
  }, [brand, open]);

  function selectFile(file?: File) {
    if (!file) return;
    if (!acceptedImageTypes.includes(file.type)) {
      setFileError("فقط فایل‌های JPG و PNG قابل انتخاب هستند.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(typeof reader.result === "string" ? reader.result : undefined);
      setFileError("");
    };
    reader.readAsDataURL(file);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    selectFile(event.dataTransfer.files?.[0]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !origin.trim()) return;
    onSave({ name: name.trim(), origin: origin.trim(), image });
    onOpenChange(false);
  }

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent
        aria-describedby={undefined}
        className="w-[313px] max-w-full gap-0 rounded-r-2xl border-0 bg-white p-0 shadow-2xl sm:max-w-[313px]"
        dir="rtl"
        showCloseButton={true}
        side="left"
      >
        <SheetHeader className="border-b border-zinc-200 px-4 py-0">
          <div className="flex h-14 items-center gap-3">
            <SheetClose
              aria-label="بستن فرم برند"
              className="grid size-8 shrink-0 place-items-center rounded-lg text-zinc-700 transition-colors hover:bg-zinc-100"
            >
              <ArrowRight size={21} strokeWidth={1.5} />
            </SheetClose>
            <SheetTitle className="text-base font-medium text-zinc-900">
              {brand ? "ویرایش برند" : "افزودن برند جدید"}
            </SheetTitle>
          </div>
        </SheetHeader>

        <form className="flex min-h-0 flex-1 flex-col px-4 pt-5" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <label className="block" htmlFor={`${inputId}-name`}>
              <span className="mb-2 block text-sm text-zinc-500">نام برند</span>
              <Input
                autoFocus
                className="h-12 border-zinc-200 px-3 text-right shadow-sm"
                id={`${inputId}-name`}
                onChange={(event) => setName(event.target.value)}
                placeholder="مثلا: نیوآ"
                required
                value={name}
              />
            </label>

            <label className="block" htmlFor={`${inputId}-origin`}>
              <span className="mb-2 block text-sm text-zinc-500">کشور مبدا</span>
              <Input
                className="h-12 border-zinc-200 px-3 text-right shadow-sm"
                id={`${inputId}-origin`}
                onChange={(event) => setOrigin(event.target.value)}
                placeholder="مثلا: ایران"
                required
                value={origin}
              />
            </label>

            <div>
              <span className="mb-2 block text-sm text-zinc-500">تصویر لوگو</span>
              <input
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                className="sr-only"
                id={`${inputId}-image`}
                onChange={handleFileChange}
                ref={fileInputRef}
                type="file"
              />
              <button
                className="flex h-[180px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-primary-100 bg-white px-4 text-center transition-colors hover:bg-secondary-50/40"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
                type="button"
              >
                {image ? (
                  <span
                    aria-label="پیش‌نمایش لوگوی انتخاب‌شده"
                    className="mb-3 size-16 rounded-2xl bg-contain bg-center bg-no-repeat"
                    role="img"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                ) : (
                  <span className="mb-3 grid size-11 place-items-center rounded-2xl bg-secondary-50 text-secondary-500">
                    <Upload size={20} strokeWidth={1.5} />
                  </span>
                )}
                <span className="text-sm font-medium text-zinc-800">تصویر را اینجا رها کنید</span>
                <span className="mt-1 text-xs leading-5 text-zinc-500">
                  یا کلیک کنید برای انتخاب
                  <br />
                  تا ۵ مگابایت JPG یا PNG
                </span>
              </button>
              {fileError ? <p className="mt-2 text-xs text-red-500">{fileError}</p> : null}
            </div>
          </div>
          <div dir="ltr">


            <Button className="mt-6 h-12 w-36" type="submit">
              {brand ? "ذخیره تغییرات" : "ذخیره برند"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
