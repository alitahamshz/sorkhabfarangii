import { AuthFlowForm } from "@/features/auth";

export default function AdminOtpPage() {
  return <AuthFlowForm audience="admin" step="otp" />;
}

