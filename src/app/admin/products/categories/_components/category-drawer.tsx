"use client";
/* eslint-disable react-hooks/set-state-in-effect -- form fields must reset when the persistent animated sheet opens */

import { useEffect, useId, useRef, useState, type DragEvent, type FormEvent } from "react";
import { ArrowRight, ChevronDown, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "./categories-data";

type CategoryDrawerProps = {
  categories: Category[];
  category: Category | null;
  defaultParentId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: Omit<Category, "id" | "icon" | "productCount">) => void;
};

function getUnavailableParentIds(categories: Category[], editingId?: string) {
  if (!editingId) return new Set<string>();
  const unavailable = new Set([editingId]);
  let changed = true;

  while (changed) {
    changed = false;
    for (const category of categories) {
      if (category.parentId && unavailable.has(category.parentId) && !unavailable.has(category.id)) {
        unavailable.add(category.id);
        changed = true;
      }
    }
  }

  return unavailable;
}

export function CategoryDrawer({ categories, category, defaultParentId = "", open, onOpenChange, onSave }: CategoryDrawerProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(category?.name ?? "");
  const [latinName, setLatinName] = useState(category?.latinName ?? "");
  const [parentId, setParentId] = useState(category?.parentId ?? defaultParentId);
  const [imageUrl, setImageUrl] = useState(category?.imageUrl ?? "");
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
  const [seoTitle, setSeoTitle] = useState(category?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(category?.seoDescription ?? "");
  const [displayPriority, setDisplayPriority] = useState(category?.displayPriority ?? 1);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const unavailableParentIds = getUnavailableParentIds(categories, category?.id);

  useEffect(() => {
    if (!open) return;
    setName(category?.name ?? "");
    setLatinName(category?.latinName ?? "");
    setParentId(category?.parentId ?? defaultParentId);
    setImageUrl(category?.imageUrl ?? "");
    setIsActive(category?.isActive ?? true);
    setSeoTitle(category?.seoTitle ?? "");
    setSeoDescription(category?.seoDescription ?? "");
    setDisplayPriority(category?.displayPriority ?? 1);
    setIsDragging(false);
    setFileError("");
  }, [category, defaultParentId, open]);

  function loadImage(file?: File) {
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setFileError("فقط فایل‌های JPG و PNG قابل انتخاب هستند.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError("حجم تصویر باید کمتر از ۵ مگابایت باشد.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
        setFileError("");
      }
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsDragging(false);
    loadImage(event.dataTransfer.files[0]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      latinName: latinName.trim() || undefined,
      description: category?.description ?? "",
      imageUrl: imageUrl || undefined,
      parentId: parentId || null,
      isActive,
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDescription.trim() || undefined,
      displayPriority,
    });
    onOpenChange(false);
  }

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
              aria-label="بستن فرم دسته‌بندی"
              className="grid size-8 shrink-0 place-items-center rounded-lg text-zinc-700 transition-colors hover:bg-zinc-100"
            >
              <ArrowRight size={21} strokeWidth={1.5} />
            </SheetClose>
            <SheetTitle className="text-base font-medium text-zinc-900">
              {category ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی جدید"}
            </SheetTitle>
          </div>
        </SheetHeader>

        <form className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 pb-6 pt-5" onSubmit={handleSubmit}>
          <label className="block" htmlFor={`${inputId}-name`}>
            <span className="mb-2 block text-sm text-zinc-500">نام دسته‌بندی</span>
            <Input
              autoFocus
              className="h-12 border-zinc-200 px-3 text-right shadow-sm"
              id={`${inputId}-name`}
              onChange={(event) => setName(event.target.value)}
              placeholder="مثلا: مراقبت پوست"
              required
              value={name}
            />
          </label>

          <label className="block" htmlFor={`${inputId}-latin-name`}>
            <span className="mb-2 block text-sm text-zinc-500">نام لاتین دسته‌بندی</span>
            <Input
              className="h-12 border-zinc-200 px-3 text-left shadow-sm"
              dir="ltr"
              id={`${inputId}-latin-name`}
              onChange={(event) => setLatinName(event.target.value)}
              value={latinName}
            />
          </label>

          <div>
            <span className="mb-2 block text-sm text-zinc-500">تصویر دسته‌بندی</span>
            <input
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              className="sr-only"
              onChange={(event) => loadImage(event.target.files?.[0])}
              ref={fileInputRef}
              type="file"
            />
            <button
              className={`flex h-[180px] w-full flex-col items-center justify-center rounded-2xl border border-dashed px-4 text-center transition-colors ${
                isDragging ? "border-secondary-500 bg-secondary-50/50" : "border-primary-100 hover:bg-secondary-50/40"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              type="button"
            >
              {imageUrl ? (
                <span
                  aria-label="پیش‌نمایش تصویر دسته‌بندی"
                  className="h-[136px] w-full rounded-xl bg-contain bg-center bg-no-repeat"
                  role="img"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
              ) : (
                <>
                  <span className="grid size-11 place-items-center rounded-2xl bg-secondary-50 text-secondary-500">
                    <Upload size={20} strokeWidth={1.5} />
                  </span>
                  <span className="mt-3 text-sm font-medium text-zinc-800">تصویر را اینجا رها کنید</span>
                  <span className="mt-1 text-xs leading-5 text-zinc-500">یا کلیک کنید برای انتخاب<br />تا ۵ مگابایت JPG یا PNG</span>
                </>
              )}
            </button>
            {fileError ? <p className="mt-2 text-xs text-red-500">{fileError}</p> : null}
          </div>

          <label className="block" htmlFor={`${inputId}-parent`}>
            <span className="mb-2 block text-sm text-zinc-500">دسته‌بندی والد</span>
            <span className="relative block">
              <select
                className="h-12 w-full appearance-none rounded-lg border border-zinc-200 bg-white px-3 pl-10 text-sm text-zinc-600 outline-none focus:border-zinc-400 focus:ring-3 focus:ring-zinc-200/60"
                id={`${inputId}-parent`}
                onChange={(event) => setParentId(event.target.value)}
                value={parentId}
              >
                <option value="">بدون والد</option>
                {categories
                  .filter((item) => !unavailableParentIds.has(item.id))
                  .map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={19} />
            </span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">وضعیت انتشار:</span>
            <span className="text-sm text-zinc-500">{isActive ? "فعال" : "غیرفعال"}</span>
            <Switch
              aria-label="وضعیت انتشار دسته‌بندی"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <label className="block" htmlFor={`${inputId}-seo-title`}>
            <span className="mb-2 block text-sm text-zinc-500">عنوان متا SEO</span>
            <Input
              className="h-12 border-zinc-200 px-3 text-right shadow-sm"
              id={`${inputId}-seo-title`}
              onChange={(event) => setSeoTitle(event.target.value)}
              value={seoTitle}
            />
          </label>

          <label className="block" htmlFor={`${inputId}-seo-description`}>
            <span className="mb-2 block text-sm text-zinc-500">توضیحات متا SEO</span>
            <Textarea
              className="min-h-[74px] resize-none border-zinc-200 px-3 text-right shadow-sm"
              id={`${inputId}-seo-description`}
              onChange={(event) => setSeoDescription(event.target.value)}
              value={seoDescription}
            />
          </label>

          <label className="block" htmlFor={`${inputId}-priority`}>
            <span className="mb-2 block text-sm text-zinc-500">اولویت نمایش</span>
            <span className="relative block">
              <select
                className="h-12 w-full appearance-none rounded-lg border border-zinc-200 bg-white px-3 pl-10 text-sm text-zinc-600 outline-none focus:border-zinc-400 focus:ring-3 focus:ring-zinc-200/60"
                id={`${inputId}-priority`}
                onChange={(event) => setDisplayPriority(Number(event.target.value))}
                value={displayPriority}
              >
                {Array.from({ length: 10 }, (_, index) => index + 1).map((priority) => (
                  <option key={priority} value={priority}>{priority.toLocaleString("fa-IR")}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={19} />
            </span>
          </label>

          <Button className="h-12 min-w-36" type="submit">
            ذخیره دسته‌بندی
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
