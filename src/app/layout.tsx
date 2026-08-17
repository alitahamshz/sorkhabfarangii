import type { Metadata } from "next";
import { Suspense } from "react";
import { GlobalNavigationLoader } from "@/components/global-navigation-loader";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "سرخاب فرنگی | فروشگاه لوازم آرایش",
  description: "فروشگاه آنلاین لوازم آرایش و مراقبت پوست",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className="font-sans">
      <body>
        <Providers>
          <Suspense fallback={null}>
            <GlobalNavigationLoader />
          </Suspense>
          {children}
        </Providers>
      </body>
    </html>
  );
}
