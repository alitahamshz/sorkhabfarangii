import { redirect } from "next/navigation";
import { getServerSession } from "@/features/auth/server/session";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session || session.user.audience !== "seller") {
    redirect("/auth/seller/login");
  }

  return <div data-panel="seller">{children}</div>;
}
