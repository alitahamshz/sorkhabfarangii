import { dashboardStats } from "./dashboard-data";
import { DashboardStatCard } from "./dashboard-stat-card";
import { MonthlyRevenueChart } from "./monthly-revenue-chart";
import { OrdersCountChart } from "./orders-count-chart";
import { RecentOrders } from "./recent-orders";
import { TopProducts } from "./top-products";

export function AdminDashboardOverview() {
  return (
    <div className="w-full min-w-0 max-w-full space-y-4 overflow-x-hidden p-4 lg:space-y-5 lg:p-6">
      <section aria-label="آمار کلی" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <DashboardStatCard key={stat.title} stat={stat} />
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-4 xl:gap-5">
        <div className="min-w-0 xl:col-span-3">
          <MonthlyRevenueChart />
        </div>
        <OrdersCountChart />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        <RecentOrders />
        <TopProducts />
      </div>
    </div>
  );
}
