import { ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MenuCategory } from "@/features/categories";
import { MegaMenu } from "./mega-menu";

export function DesktopNavigation({
  categories,
  isSolid,
}: {
  categories: MenuCategory[];
  isSolid: boolean;
}) {
  return (
    <nav
      aria-label="دسته‌بندی محصولات"
      className={`hidden border-t transition-colors duration-300 md:block ${
        isSolid ? "border-zinc-100 bg-white" : "border-transparent bg-transparent"
      }`}
    >
      <ul
        className="relative mx-auto flex h-15 max-w-7xl items-center justify-start gap-8 px-5 text-sm text-zinc-600"
        dir="rtl"
      >
        {categories.map((category, index) => (
          <li className="group flex h-full items-center" key={category.id}>
            <Button
              className={`flex h-auto items-center gap-1 whitespace-nowrap p-0 transition-colors group-hover:text-secondary-500 ${
                index === 0 ? "text-secondary-500" : ""
              }`}
              type="button"
              variant="ghost"
            >
              <Star size={17} strokeWidth={1.8} />
              {category.name}
              <ChevronDown
                className="transition-transform duration-200 ease-out group-hover:rotate-180"
                size={16}
              />
            </Button>
            {category.groups.length > 0 && <MegaMenu category={category} />}
          </li>
        ))}
      </ul>
    </nav>
  );
}
