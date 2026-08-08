import type { ServerAuthSession } from "@/features/auth";
import { DashboardPanel } from "./dashboard-panel";

function maskToken(token: string) {
  if (token.length <= 14) return "••••••••";
  return `${token.slice(0, 8)}••••••••${token.slice(-6)}`;
}

export function SessionPreview({ session }: { session: ServerAuthSession }) {
  const rows = [
    ["شناسه کاربر", session.user.id || "—"],
    ["نام", session.user.name || "—"],
    ["نام خانوادگی", session.user.family || "—"],
    ["سطح دسترسی", session.user.level || "—"],
    ["نوع حساب", session.user.audience],
    ["انقضای نشست", new Date(session.expires).toLocaleString("fa-IR")],
  ];

  return (
    <DashboardPanel
      aria-label="نمونه اطلاعات نشست کاربر"
      description="این اطلاعات در Server Component با getServerSession خوانده شده است."
      title="اطلاعات Session فعلی"
    >
      <dl className="grid gap-px bg-zinc-100 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map(([label, value]) => (
          <div className="bg-white px-5 py-4 md:px-6" key={label}>
            <dt className="text-xs text-zinc-400">{label}</dt>
            <dd className="mt-1.5 break-words text-sm font-semibold text-zinc-700">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="border-t border-zinc-100 bg-zinc-50 px-5 py-4 md:px-6">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-zinc-500">Access token امن (نمایش ماسک‌شده)</span>
          <code className="break-all text-left font-mono text-xs text-primary-500" dir="ltr">
            {maskToken(session.accessToken)}
          </code>
        </div>
        <p className="mt-2 text-[11px] leading-5 text-zinc-400">
          مقدار کامل توکن فقط در cookie از نوع HttpOnly و کد سمت سرور قابل دسترسی است.
        </p>
      </div>
    </DashboardPanel>
  );
}
