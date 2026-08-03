"use client";

import { ChevronDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { revenueData } from "./dashboard-data";
import { DashboardPanel } from "./dashboard-panel";

const chartConfig = {
  revenue: { label: "درآمد", color: "#9f3658" },
} satisfies ChartConfig;

export function MonthlyRevenueChart() {
  return (
    <DashboardPanel
      className="min-h-[365px]"
      description="۶ ماه اخیر · میلیون تومان"
      title="درآمد ماهیانه"
      action={
        <div className="flex max-w-full flex-wrap items-center gap-2 text-[11px]">
          <span className="rounded-full bg-emerald-50 px-3 py-2 text-emerald-600">۲۶.۹٪+ رشد</span>
          <button className="flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-2 text-zinc-500" type="button">
            ماهیانه
            <ChevronDown size={14} />
          </button>
        </div>
      }
    >
      <div className="min-w-0 px-1 pb-3 pt-4 min-[400px]:px-2 md:px-4">
        <ChartContainer className="h-[230px] w-full min-w-0 min-[400px]:h-[260px]" config={chartConfig}>
          <AreaChart data={revenueData} margin={{ left: 0, right: 0, top: 16 }}>
            <defs>
              <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.17} />
                <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 5" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="month"
              fontSize={10}
              interval="preserveStartEnd"
              minTickGap={8}
              tickLine={false}
              tickMargin={12}
            />
            <YAxis axisLine={false} hide tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} cursor={false} />
            <Area
              dataKey="revenue"
              fill="url(#revenue-fill)"
              fillOpacity={1}
              stroke="var(--color-revenue)"
              strokeWidth={2}
              type="natural"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </DashboardPanel>
  );
}
