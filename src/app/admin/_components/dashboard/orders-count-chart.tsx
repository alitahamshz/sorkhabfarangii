"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { orderCountData } from "./dashboard-data";
import { DashboardPanel } from "./dashboard-panel";

const chartConfig = {
  orders: { label: "سفارش", color: "#a95772" },
} satisfies ChartConfig;

export function OrdersCountChart() {
  return (
    <DashboardPanel className="min-h-[365px]" title="تعداد سفارشات">
      <div className="min-w-0 px-1 pb-3 pt-4 min-[400px]:px-3">
        <ChartContainer className="h-[250px] w-full min-w-0 min-[400px]:h-[285px]" config={chartConfig}>
          <BarChart data={orderCountData} margin={{ left: 0, right: 0, top: 8 }}>
            <CartesianGrid strokeDasharray="3 5" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="day"
              fontSize={9}
              interval="preserveStartEnd"
              minTickGap={4}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis axisLine={false} hide tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            <Bar dataKey="orders" fill="var(--color-orders)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </DashboardPanel>
  );
}
