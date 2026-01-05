"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bars3Icon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

type TopbarProps = {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobile: () => void;
};

const FB_BLUE = "#1877F2";
const FB_BLUE_HOVER = "#166FE5";

function getTitleFromPath(pathname: string) {
  if (pathname === "/") return "Compare Documents";
  if (pathname === "/history") return "History";
  if (pathname.startsWith("/compare/")) return "Compare Detail";
  if (pathname === "/dashboard") return "Dashboard";
  if (pathname === "/reports") return "Reports";
  if (pathname === "/documents") return "Documents";
  return "Dashboard";
}

function getBreadcrumb(pathname: string) {
  const crumbs: { label: string; href?: string }[] = [{ label: "Home", href: "/" }];

  if (pathname === "/history") {
    crumbs.push({ label: "History" });
  } else if (pathname.startsWith("/compare/")) {
    const id = pathname.split("/").filter(Boolean)[1];
    crumbs.push({ label: "History", href: "/history" });
    crumbs.push({ label: `Detail #${id || ""}` });
  } else if (pathname === "/") {
    crumbs.push({ label: "Compare" });
  } else if (pathname === "/dashboard") {
    crumbs.push({ label: "Dashboard" });
  } else if (pathname === "/reports") {
    crumbs.push({ label: "Reports" });
  } else if (pathname === "/documents") {
    crumbs.push({ label: "Documents" });
  }

  return crumbs;
}

export default function Topbar({ collapsed, onToggleSidebar, onOpenMobile }: TopbarProps) {
  const pathname = usePathname();
  const title = getTitleFromPath(pathname);
  const crumbs = getBreadcrumb(pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/90 backdrop-blur">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-3">
        {/* Left */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenMobile}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-white hover:bg-blue-50"
            aria-label="Open sidebar"
          >
            <Bars3Icon className="h-6 w-6" style={{ color: FB_BLUE }} />
          </button>

          <button
            type="button"
            onClick={onToggleSidebar}
            className="hidden md:inline-flex h-10 items-center gap-2 rounded-xl px-3 border border-blue-100 bg-white hover:bg-blue-50"
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <>
                <ChevronDoubleRightIcon className="h-5 w-5" style={{ color: FB_BLUE }} />
                <span className="text-sm font-extrabold" style={{ color: FB_BLUE }}>
                  Expand
                </span>
              </>
            ) : (
              <>
                <ChevronDoubleLeftIcon className="h-5 w-5" style={{ color: FB_BLUE }} />
                <span className="text-sm font-extrabold" style={{ color: FB_BLUE }}>
                  Collapse
                </span>
              </>
            )}
          </button>

          <div className="ml-1">
            <div className="text-sm md:text-base font-extrabold text-slate-900 leading-tight">
              {title}
            </div>

            <nav className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-500">
              {crumbs.map((c, idx) => (
                <React.Fragment key={`${c.label}-${idx}`}>
                  {idx > 0 && <span className="text-slate-300">/</span>}
                  {c.href ? (
                    <Link href={c.href} className="hover:text-slate-800">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-slate-600">{c.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>

        {/* Center */}
        <div className="hidden lg:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              placeholder="Search (UI only)..."
              className="w-full rounded-xl bg-white px-10 py-2 text-sm font-semibold text-slate-900 border border-blue-100 focus:outline-none"
              style={{
                boxShadow: "0 0 0 0 rgba(0,0,0,0)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(24, 119, 242, 0.22)";
                e.currentTarget.style.borderColor = "rgba(24, 119, 242, 0.45)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 0 rgba(0,0,0,0)";
                e.currentTarget.style.borderColor = "rgba(219, 234, 254, 1)"; // blue-100-ish
              }}
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-extrabold text-white shadow-sm"
            style={{ backgroundColor: FB_BLUE }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = FB_BLUE_HOVER;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = FB_BLUE;
            }}
          >
            <DocumentMagnifyingGlassIcon className="h-5 w-5" />
            Compare
          </Link>

          <Link
            href="/history"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm font-extrabold hover:bg-blue-50"
            style={{ color: FB_BLUE }}
          >
            <ClockIcon className="h-5 w-5" style={{ color: FB_BLUE }} />
            History
          </Link>
        </div>
      </div>
    </header>
  );
}
