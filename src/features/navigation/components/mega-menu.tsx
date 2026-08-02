import { ChevronLeft } from "lucide-react";
import type { MenuCategory } from "@/features/categories";
import { getMegaColumns } from "../lib/get-mega-columns";

export function MegaMenu({ category }: { category: MenuCategory }) {
  return (
    <div className="invisible absolute top-full right-0 z-50 flex h-[500px] w-full flex-col overflow-hidden border border-secondary-100 bg-secondary-50 p-1 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100">
      <a
        className="flex shrink-0 items-center gap-1 px-7 py-5 text-base font-semibold text-secondary-700"
        href="#"
      >
        مشاهده همه محصولات {category.name}
        <ChevronLeft size={18} />
      </a>

      <div className="mb-4 grid min-h-0 flex-1 grid-cols-5 items-stretch gap-1">
        {getMegaColumns(category.groups).map((column, columnIndex) => (
          <div className="bg-white px-4 py-5" key={columnIndex}>
            {column.map((group, groupIndex) => (
              <section
                className={groupIndex > 0 ? "mt-6" : ""}
                key={group.id}
              >
                <h3 className="relative mb-3 pr-3 text-sm font-bold text-zinc-600 before:absolute before:right-0 before:top-0.5 before:h-5 before:w-0.5 before:bg-primary-500">
                  {group.name}
                </h3>
                <ul className="space-y-2 text-xs leading-5 text-zinc-500">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <a
                        className="inline-block transition-transform duration-200 hover:-translate-x-1 hover:text-primary-500"
                        href="#"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
