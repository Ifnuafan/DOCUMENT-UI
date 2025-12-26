"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/outline";

type Props = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onNavigate?: () => void; // สำหรับปิด drawer บนมือถือ
};

export default function Sidebar({ collapsed, onToggleCollapsed, onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <aside
      className={[
        "h-full border-r border-slate-200 bg-white/80 backdrop-blur-xl",
        "transition-all duration-200 ease-out",
        collapsed ? "w-20" : "w-72",
      ].join(" ")}
    >
      {/* Brand */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200">
        <Link href="/" className="flex items-center gap-3 min-w-0" onClick={onNavigate}>
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-pink-500 shadow text-white flex items-center justify-center font-extrabold">
            SN
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                Doc Versioning
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Compare • Summary • Risk
              </p>
            </div>
          )}
        </Link>

        {/* collapse btn (desktop) */}
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="hidden md:inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50"
          aria-label="Toggle sidebar"
        >
          <ChevronDoubleLeftIcon
            className={[
              "h-5 w-5 text-slate-600 transition-transform",
              collapsed ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>
      </div>

      {/* Nav */}
      <nav className="p-3 space-y-4">
        {NAV.map((g) => (
          <div key={g.group} className="space-y-2">
            {!collapsed && (
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {g.group}
              </p>
            )}

            <div className="space-y-1">
              {g.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={[
                      "group flex items-center gap-3 rounded-2xl px-3 py-2.5",
                      "text-sm font-semibold transition-colors",
                      active
                        ? "bg-slate-900 text-white shadow"
                        : "text-slate-700 hover:bg-slate-100",
                    ].join(" ")}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      className={[
                        "h-5 w-5 shrink-0",
                        active
                          ? "text-white"
                          : "text-slate-600 group-hover:text-slate-800",
                      ].join(" ")}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {active && !collapsed && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-violet-400" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
