import { ChevronDown } from "lucide-react";
import { CategoryIcon, type MenuCategory } from "@/features/categories";
import { MobileMenuGroup } from "./mobile-menu-group";

type MobileMenuCategoryProps = {
  category: MenuCategory;
  isOpen: boolean;
  openGroupId: string | null;
  onToggle: () => void;
  onToggleGroup: (groupId: string) => void;
};

export function MobileMenuCategory({
  category,
  isOpen,
  openGroupId,
  onToggle,
  onToggleGroup,
}: MobileMenuCategoryProps) {
  return (
    <section className="border-b border-zinc-100 pb-3">
      <button
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-0.5 text-base font-bold text-zinc-500"
        onClick={onToggle}
        type="button"
      >
        <span className="flex items-center gap-2">
          <CategoryIcon name={category.name} />
          {category.name}
        </span>
        <ChevronDown
          className={`text-[#97003b] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          size={20}
          strokeWidth={1.7}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "mt-2 grid-rows-[1fr]" : "mt-0 grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="rounded-2xl bg-[#fafafa] px-4 py-2 text-sm text-slate-500">
            {category.groups.map((group) => (
              <MobileMenuGroup
                group={group}
                isOpen={openGroupId === group.id}
                key={group.id}
                onToggle={() => onToggleGroup(group.id)}
              />
            ))}
            {category.groups.length === 0 && (
              <li className="py-4 text-base text-zinc-400">
                زیر‌دسته‌ای ثبت نشده است.
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
