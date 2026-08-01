import { ArrowRight, Bell, Menu, Moon } from "lucide-react";

export function AdminHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  return (
    <>
      {/* دکمه مستقل منو در نسخه موبایل */}
      <div className="flex h-[76px] items-start bg-zinc-50 px-6 pt-6 lg:hidden">
        <button
          aria-label="باز کردن منوی مدیریت"
          className="flex size-10 cursor-pointer items-center justify-center rounded bg-[#85002e] text-white shadow-[0_4px_10px_rgba(0,0,0,0.22)]"
          onClick={onOpenSidebar}
          type="button"
        >
          <Menu size={23} strokeWidth={1.7} />
        </button>
      </div>

      {/* هدر کارت‌مانند در موبایل و هدر سراسری در دسکتاپ */}
      <header className="mx-4 flex h-[60px] items-center justify-between rounded-lg border-b border-zinc-200 bg-white px-4 shadow-[0_1px_2px_rgba(0,0,0,0.06)] lg:mx-0 lg:h-20 lg:rounded-none lg:border-b-2 lg:border-zinc-800 lg:px-7 lg:shadow-none">
        <div className="flex items-start gap-3">
          <button
            aria-label="بازگشت"
            className="mt-0.5 cursor-pointer text-zinc-800 transition-colors hover:text-[#85002e]"
            onClick={() => window.history.back()}
            type="button"
          >
            <ArrowRight size={21} strokeWidth={1.5} />
          </button>

          <div>
            <h1 className="text-base font-medium text-zinc-900 lg:text-xl">نمای کلی</h1>
            <div className="mt-1 flex items-center gap-1.5 text-[9px] lg:mt-1.5 lg:text-[10px]">
              <span className="text-zinc-400">داشبورد</span>
              <span className="text-zinc-400">&gt;</span>
              <span className="font-medium text-[#85002e]">صفحه فعلی</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-7 text-zinc-700" dir="ltr">
          <button aria-label="حالت شب" className="cursor-pointer transition-colors hover:text-[#85002e]" type="button">
            <Moon size={20} strokeWidth={1.5} />
          </button>
          <button
            aria-label="اعلان‌ها"
            className="relative cursor-pointer transition-colors hover:text-[#85002e]"
            type="button"
          >
            <Bell size={19} strokeWidth={1.4} />
            <span className="absolute -right-0.5 top-0 size-1.5 rounded-full bg-red-500 ring-1 ring-white" />
          </button>
        </div>
      </header>
    </>
  );
}
