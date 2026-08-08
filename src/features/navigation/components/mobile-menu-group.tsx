import { ChevronDown } from "lucide-react";
import type { MenuGroup } from "@/features/categories";

type MobileMenuGroupProps = {
  group: MenuGroup;
  isOpen: boolean;
  onToggle: () => void;
};

export function MobileMenuGroup({
  group,
  isOpen,
  onToggle,
}: MobileMenuGroupProps) {
  return (
    <li className="border-b border-zinc-100 last:border-0">
      <button
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        onClick={onToggle}
        type="button"
      >
        <span>{group.name}</span>
        <ChevronDown
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          size={17}
          strokeWidth={1.5}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <ul className="overflow-hidden border-r-2 border-primary-500 pr-3 text-xs text-zinc-400">
          {group.items.map((item) => (
            <li className="flex items-center justify-between py-2" key={item.id}>
              <span>{item.name}</span>
            </li>
          ))}
          {group.items.length === 0 && (
            <li className="pb-3 text-sm">موردی ثبت نشده است.</li>
          )}
        </ul>
      </div>
    </li>
  );
}
