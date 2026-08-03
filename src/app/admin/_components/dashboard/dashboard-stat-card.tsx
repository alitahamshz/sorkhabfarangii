import Image from "next/image";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardStat } from "./dashboard-data";

export function DashboardStatCard({ stat }: { stat: DashboardStat }) {
  const isPositive = stat.trend === "up";

  return (
    <article className="flex min-h-28 items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-white p-4">
      <div className="min-w-0">
        <p className="text-xs text-zinc-500">{stat.title}</p>
        <p className="mt-3 truncate text-base font-bold text-zinc-900 md:text-lg">
          {stat.value}
        </p>
        <div
          className={cn(
            "mt-2 flex items-center gap-1 text-[11px]",
            isPositive ? "text-emerald-600" : "text-red-500",
          )}
        >
          {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownLeft size={13} />}
          <span>{stat.change}</span>
          <span>{stat.comparison}</span>
        </div>
      </div>
      <div className={cn("grid size-9 shrink-0 place-items-center rounded", stat.iconClassName)}>
        <Image
          alt=""
          aria-hidden="true"
          height={18}
          src={stat.icon}
          width={18}
        />
      </div>
    </article>
  );
}
