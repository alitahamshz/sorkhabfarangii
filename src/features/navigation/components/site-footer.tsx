"use client";

import { ChevronDown, MessageCircle, Music2, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const FOOTER_LINKS = [
  { title: "خدمات مشتریان", links: ["پاسخ به پرسش‌های متداول", "رویه بازگرداندن کالا"] },
  { title: "درباره سرخاب فرنگی", links: ["درباره ما", "تماس با ما"] },
  { title: "دریافت اپلیکیشن", links: ["دانلود از بازار", "دانلود از مایکت"] },
];

const SOCIAL_LINKS = [ Send,Send, MessageCircle,MessageCircle, Music2];

export function SiteFooter() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <footer className="mt-8 bg-white px-4 pb-5 pt-6 text-zinc-700 sm:px-5" dir="rtl">
      <div className="mx-auto max-w-[77.5rem]">
        <div className="flex items-center gap-4" dir="ltr">
          <Image alt="سرخاب فرنگی" height={36} src="/img/logo.svg" width={65} />
          <div className="h-px flex-1 bg-zinc-300" />
          <div className="flex gap-1.5">
            {SOCIAL_LINKS.map((Icon, index) => (
              <Link
                aria-label={`شبکه اجتماعی ${index + 1}`}
                className="grid size-8 place-items-center rounded-lg bg-zinc-100 text-primary-500 transition-transform hover:-translate-y-0.5 sm:size-10"
                href="#"
                key={index}
              >
                <Icon size={16} />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-5">
          {FOOTER_LINKS.map((item) => {
            const isOpen = openItem === item.title;
            return (
              <div key={item.title}>
                <Button
                  aria-expanded={isOpen}
                  className="flex h-auto w-full items-center justify-between px-0 py-3 text-sm font-semibold"
                  onClick={() => setOpenItem(isOpen ? null : item.title)}
                  type="button"
                  variant="ghost"
                >
                  <span>{item.title}</span>
                  <ChevronDown className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} size={18} />
                </Button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <ul className={`space-y-2 pb-3 text-xs text-zinc-500 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"}`}>
                      {item.links.map((link) => <li key={link}><Link href="#">{link}</Link></li>)}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mx-3 mt-5 border-t border-zinc-300" />
        <p className="mt-4 text-center text-[10px] text-zinc-500">کلیه حقوق این وب‌سایت متعلق به سرخاب فرنگی است.</p>
      </div>
    </footer>
  );
}
