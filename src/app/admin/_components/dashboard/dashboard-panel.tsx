import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type DashboardPanelProps = ComponentProps<"section"> & {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function DashboardPanel({
  action,
  children,
  className,
  description,
  title,
  ...props
}: DashboardPanelProps) {
  return (
    <section
      className={cn("min-w-0 overflow-hidden rounded-lg border border-zinc-200 bg-white", className)}
      {...props}
    >
      <header className="flex min-w-0 flex-col items-start justify-between gap-3 px-5 pt-5 min-[560px]:flex-row min-[560px]:gap-4 md:px-6 md:pt-6">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-zinc-900 md:text-lg">{title}</h2>
          {description ? (
            <p className="mt-1 text-[11px] text-zinc-500">{description}</p>
          ) : null}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
