"use client";

import { useState } from "react";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 lg:bg-white" data-panel="admin" dir="rtl">
      <AdminSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {isMobileSidebarOpen ? (
        <button
          aria-label="بستن منوی مدیریت"
          className="fixed inset-0 z-30 cursor-default bg-black/35 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
          type="button"
        />
      ) : null}

      <div className="min-h-screen lg:mr-[313px]">
        <AdminHeader onOpenSidebar={() => setIsMobileSidebarOpen(true)} />
        <main className="min-h-[calc(100vh-136px)] bg-zinc-50 lg:min-h-[calc(100vh-80px)] lg:bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
