import { redirect } from "next/navigation";
import { getServerSession } from "@/features/auth/server/session";
import { AdminShell } from "./_components/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session || session.user.audience !== "admin") {
    redirect("/auth/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
