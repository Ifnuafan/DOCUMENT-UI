"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/outline";

type Props = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onNavigate?: () => void;
};

const FB_BLUE = "#1877F2";
const FB_BLUE_HOVER = "#166FE5";

export default function Sidebar({ collapsed, onToggleCollapsed, onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <aside
      className={[
        "h-full border-r border-blue-100 bg-white",
        "transition-all duration-200 ease-out",
        collapsed ? "w-20" : "w-72",
      ].join(" ")}
    >
      {/* Brand */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-blue-100">
        <Link href="/" className="flex items-center gap-3 min-w-0" onClick={onNavigate}>
          <div
            className="h-10 w-10 rounded-2xl text-white flex items-center justify-center font-extrabold shadow-sm"
            style={{ backgroundColor: FB_BLUE }}
          >
            DV
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-slate-900 truncate">
                Doc Versioning
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Compare • Summary • Risk
              </p>
            </div>
          )}
        </Link>

        <button
          type="button"
          onClick={onToggleCollapsed}
          className="hidden md:inline-flex items-center justify-center h-9 w-9 rounded-xl border border-blue-100 bg-white hover:bg-blue-50"
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <ChevronDoubleLeftIcon
            className={[
              "h-5 w-5 transition-transform",
              collapsed ? "rotate-180" : "",
            ].join(" ")}
            style={{ color: FB_BLUE }}
          />
        </button>
      </div>

      {/* Nav */}
      <nav className="p-3 space-y-4">
        {NAV.map((g) => (
          <div key={g.group} className="space-y-2">
            {!collapsed && (
              <p className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
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
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5",
                      "text-sm font-semibold transition-colors",
                      active
                        ? "text-white shadow-sm"
                        : "text-slate-700 hover:bg-blue-50",
                    ].join(" ")}
                    style={
                      active
                        ? { backgroundColor: FB_BLUE }
                        : undefined
                    }
                    title={collapsed ? item.label : undefined}
                    onMouseEnter={(e) => {
                      if (active) e.currentTarget.style.backgroundColor = FB_BLUE_HOVER;
                    }}
                    onMouseLeave={(e) => {
                      if (active) e.currentTarget.style.backgroundColor = FB_BLUE;
                    }}
                  >
                    <Icon
                      className="h-5 w-5 shrink-0 transition-colors"
                      style={{
                        color: active ? "#ffffff" : "#64748b", // slate-500
                      }}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}

                    {/* Active dot */}
                    {active && !collapsed && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-white/80" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Optional footer hint (nice like FB) */}
      {!collapsed && (
        <div className="mt-auto p-3">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3 text-xs text-slate-600 font-semibold">
            Tip: อัปโหลด PDF 2 เวอร์ชัน แล้วกด <span style={{ color: FB_BLUE }}>Compare</span>
          </div>
        </div>
      )}
    </aside>
  );
}
