import { Star } from "lucide-react";
import { topProducts } from "./dashboard-data";
import { DashboardPanel } from "./dashboard-panel";

export function TopProducts() {
  return (
    <DashboardPanel
      action={<a className="text-sm font-medium text-secondary-500 hover:text-primary-500" href="#">گزارش کامل</a>}
      title="پرفروش‌ترین‌ها"
    >
      <ol className="px-5 pb-4 pt-5 md:px-6">
        {topProducts.map((product, index) => (
          <li className="flex items-center gap-3 border-b border-zinc-100 py-2.5 first:pt-0 last:border-0 last:pb-0" key={`${product.name}-${index}`}>
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-50 text-[10px] text-zinc-500">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-zinc-800">{product.name}</p>
              <p className="mt-1 flex items-center gap-1 text-[10px] text-zinc-400">
                <Star className="fill-yellow-400 text-yellow-400" size={11} />
                {product.sales}
              </p>
            </div>
            <span className="shrink-0 text-xs text-zinc-700">{product.revenue}</span>
          </li>
        ))}
      </ol>
    </DashboardPanel>
  );
}
