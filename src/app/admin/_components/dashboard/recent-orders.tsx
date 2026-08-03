import { cn } from "@/lib/utils";
import { recentOrders, type RecentOrder } from "./dashboard-data";
import { DashboardPanel } from "./dashboard-panel";

const statusClasses: Record<RecentOrder["status"], string> = {
  "ارسال شده": "bg-violet-100 text-violet-600",
  "تکمیل شده": "bg-emerald-100 text-emerald-700",
  "در حال پردازش": "bg-blue-100 text-blue-700",
  "لغو شده": "bg-red-100 text-red-600",
};

export function RecentOrders() {
  return (
    <DashboardPanel
      action={<a className="text-sm font-medium text-secondary-500 hover:text-primary-500" href="#">مشاهده همه</a>}
      title="آخرین سفارش‌ها"
    >
      <div className="px-5 pb-4 pt-5 md:px-6">
        {recentOrders.map((order) => (
          <div className="flex items-center gap-3 border-b border-zinc-100 py-3 first:pt-0 last:border-0 last:pb-0" key={`${order.customer}-${order.date}`}>
            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-50 text-[11px] text-zinc-500">
              {order.customer.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-800">{order.customer}</p>
              <p className="mt-1 truncate text-[10px] text-zinc-400">{order.date}</p>
            </div>
            <div className="shrink-0 text-left">
              <p className="text-xs text-zinc-700">{order.amount}</p>
              <span className={cn("mt-1 inline-block rounded-full px-2 py-1 text-[9px]", statusClasses[order.status])}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}
