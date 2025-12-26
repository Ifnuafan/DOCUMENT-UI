"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem("sidebar_collapsed");
    if (v) setCollapsed(v === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="flex h-screen">
        {/* desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar
            collapsed={collapsed}
            onToggleCollapsed={() => setCollapsed((x) => !x)}
          />
        </div>

        {/* mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-[86%] max-w-xs shadow-2xl">
              <Sidebar
                collapsed={false}
                onToggleCollapsed={() => {}}
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
          </div>
        )}

        {/* main */}
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar
            collapsed={collapsed}
            onToggleSidebar={() => setCollapsed((x) => !x)}
            onOpenMobile={() => setMobileOpen(true)}
          />

          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
