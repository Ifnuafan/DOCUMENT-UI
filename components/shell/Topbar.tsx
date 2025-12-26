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
  onToggleSidebar: () => void; // desktop toggle collapse/expand
  onOpenMobile: () => void; // mobile open drawer
};

function getTitleFromPath(pathname: string) {
  if (pathname === "/") return "Compare Documents";
  if (pathname === "/history") return "History";
  if (pathname.startsWith("/compare/")) return "Compare Detail";
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
  }

  return crumbs;
}

export default function Topbar({ collapsed, onToggleSidebar, onOpenMobile }: TopbarProps) {
  const pathname = usePathname();
  const title = getTitleFromPath(pathname);
  const crumbs = getBreadcrumb(pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-3">
        {/* Left */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Mobile: open sidebar */}
          <button
            type="button"
            onClick={onOpenMobile}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-slate-200 bg-white hover:bg-slate-50"
            aria-label="Open sidebar"
          >
            <Bars3Icon className="h-6 w-6 text-slate-900" />
          </button>

          {/* Logo SN */}
          <Link href="/" className="hidden sm:block">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-pink-500 shadow text-white flex items-center justify-center font-extrabold">
              SN
            </div>
          </Link>

          {/* Desktop: collapse/expand sidebar */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="hidden md:inline-flex h-10 items-center gap-2 rounded-xl px-3 ring-1 ring-slate-200 bg-white hover:bg-slate-50"
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <>
                <ChevronDoubleRightIcon className="h-5 w-5 text-slate-900" />
                <span className="text-sm font-extrabold text-slate-900">Expand</span>
              </>
            ) : (
              <>
                <ChevronDoubleLeftIcon className="h-5 w-5 text-slate-900" />
                <span className="text-sm font-extrabold text-slate-900">Collapse</span>
              </>
            )}
          </button>

          {/* Title + breadcrumb */}
          <div className="ml-1 min-w-0">
            <div className="text-sm md:text-base font-extrabold text-slate-900 leading-tight truncate">
              {title}
            </div>

            <nav className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-500 truncate">
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

        {/* Center: search (UI only) */}
        <div className="hidden lg:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              placeholder="Search (UI only)..."
              className="w-full rounded-xl bg-white px-10 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-extrabold text-white hover:opacity-95"
          >
            <DocumentMagnifyingGlassIcon className="h-5 w-5" />
            Compare
          </Link>

          <Link
            href="/history"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-extrabold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            <ClockIcon className="h-5 w-5" />
            History
          </Link>
        </div>
      </div>
    </header>
  );
}
