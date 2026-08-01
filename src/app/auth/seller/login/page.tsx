import { AuthFlowForm } from "@/features/auth";

export default function SellerLoginPage() {
  return <AuthFlowForm audience="seller" step="login" />;
}

