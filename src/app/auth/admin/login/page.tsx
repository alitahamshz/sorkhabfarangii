import { AuthFlowForm } from "@/features/auth";

export default function AdminLoginPage() {
  return <AuthFlowForm audience="admin" step="login" />;
}

