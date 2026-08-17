import { redirect } from "next/navigation";
import { getServerSession } from "@/features/auth/server/session";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session || session.user.audience !== "customer") {
    redirect("/auth/customer/login");
  }

  return children;
}
