import { redirect } from "next/navigation";
import { getServerSession } from "@/features/auth/server/session";
import { AdminDashboardOverview } from "./_components/dashboard/admin-dashboard-overview";

export default async function AdminDashboardPage() {
  const session = await getServerSession();

  if (!session) redirect("/auth/admin/login");

  return <AdminDashboardOverview session={session} />;
}
