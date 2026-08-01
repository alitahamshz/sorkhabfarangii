import { AuthFlowForm } from "@/features/auth";

export default function CustomerOtpPage() {
  return <AuthFlowForm audience="customer" step="otp" />;
}

