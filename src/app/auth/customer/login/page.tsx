import { AuthFlowForm } from "@/features/auth";

export default function CustomerLoginPage() {
  return <AuthFlowForm audience="customer" step="login" />;
}

