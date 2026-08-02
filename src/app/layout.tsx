import type { Metadata } from "next";
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
