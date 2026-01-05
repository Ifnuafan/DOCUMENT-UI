// app/dashboard/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowPathIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentMagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  DocumentTextIcon,
  DocumentArrowDownIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";

type ComparisonItem = {
  id: number;
  document_name: string;
  version_old_label: string;
  version_new_label: string;
  created_at: string;
  overall_risk_level?: "LOW" | "MEDIUM" | "HIGH" | string | null;
  changes_count?: number; // (ถ้า backend ยังไม่ส่งมา ก็จะเป็น undefined)
};

type Role = "ADMIN" | "LEGAL" | "MANAGER" | "VIEWER";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.trim() || "http://127.0.0.1:8000";

// Facebook colors
const FB_BLUE = "#1877F2";
const FB_BLUE_HOVER = "#166FE5";

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("th-TH", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatMonthLabel(d: Date) {
  try {
    return d.toLocaleDateString("th-TH", { month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

function normalizeRisk(r?: string | null) {
  const x = (r || "").toUpperCase();
  if (x.includes("HIGH") || x.includes("สูง")) return "HIGH";
  if (x.includes("MEDIUM") || x.includes("กลาง")) return "MEDIUM";
  if (x.includes("LOW") || x.includes("ต่ำ")) return "LOW";
  return "LOW";
}

function RiskPill({ level }: { level?: string | null }) {
  const r = normalizeRisk(level);
  const base =
    "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold border";
  if (r === "HIGH")
    return (
      <span className={`${base} bg-red-50 text-red-700 border-red-200`}>
        HIGH
      </span>
    );
  if (r === "MEDIUM")
    return (
      <span className={`${base} bg-amber-50 text-amber-700 border-amber-200`}>
        MEDIUM
      </span>
    );
  return (
    <span className={`${base} bg-emerald-50 text-emerald-700 border-emerald-200`}>
      LOW
    </span>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-3xl border border-slate-200 bg-white shadow-sm",
        "hover:shadow-md transition-shadow",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function Stat({
  title,
  value,
  icon,
  sub,
}: {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-extrabold text-slate-600">{title}</div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">
            {value}
          </div>
          {sub && <div className="mt-2 text-xs text-slate-500">{sub}</div>}
        </div>
        <div
          className="h-10 w-10 rounded-2xl flex items-center justify-center border"
          style={{
            borderColor: "rgba(24,119,242,0.20)",
            background: "rgba(24,119,242,0.06)",
            color: FB_BLUE,
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

function MiniLineChart({
  points,
  height = 120,
}: {
  points: number[];
  height?: number;
}) {
  const w = 520;
  const h = height;
  const pad = 12;
  const max = Math.max(1, ...points);
  const toX = (i: number) =>
    pad + (i * (w - pad * 2)) / Math.max(1, points.length - 1);
  const toY = (v: number) =>
    h - pad - (v * (h - pad * 2)) / Math.max(1, max);

  const d = points
    .map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`)
    .join(" ");

  const area = `${d} L ${toX(points.length - 1)} ${h - pad} L ${toX(0)} ${
    h - pad
  } Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[140px]" role="img">
      {[0, 1, 2, 3].map((k) => {
        const y = pad + (k * (h - pad * 2)) / 3;
        return (
          <line
            key={k}
            x1={pad}
            y1={y}
            x2={w - pad}
            y2={y}
            stroke="rgba(15,23,42,0.10)"
            strokeWidth="1"
          />
        );
      })}
      <path d={area} fill="rgba(24,119,242,0.12)" />
      <path d={d} fill="none" stroke="rgba(24,119,242,0.95)" strokeWidth="3" />
      {points.map((v, i) => (
        <circle
          key={i}
          cx={toX(i)}
          cy={toY(v)}
          r="4"
          fill="white"
          stroke="rgba(24,119,242,0.95)"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

function Donut({
  high,
  medium,
  low,
}: {
  high: number;
  medium: number;
  low: number;
}) {
  const total = Math.max(1, high + medium + low);
  const r = 52;
  const c = 2 * Math.PI * r;

  const pHigh = (high / total) * c;
  const pMed = (medium / total) * c;
  const pLow = (low / total) * c;

  const dashHigh = `${pHigh} ${c - pHigh}`;
  const dashMed = `${pMed} ${c - pMed}`;
  const dashLow = `${pLow} ${c - pLow}`;

  const offHigh = 0;
  const offMed = -pHigh;
  const offLow = -(pHigh + pMed);

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 140 140" className="h-[140px] w-[140px]" role="img">
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="rgba(15,23,42,0.08)"
          strokeWidth="14"
        />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="rgba(239,68,68,0.85)"
          strokeWidth="14"
          strokeDasharray={dashHigh}
          strokeDashoffset={offHigh}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="rgba(245,158,11,0.85)"
          strokeWidth="14"
          strokeDasharray={dashMed}
          strokeDashoffset={offMed}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="rgba(16,185,129,0.85)"
          strokeWidth="14"
          strokeDasharray={dashLow}
          strokeDashoffset={offLow}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
        <text
          x="70"
          y="67"
          textAnchor="middle"
          className="fill-slate-900"
          style={{ fontSize: 18, fontWeight: 800 }}
        >
          {high + medium + low}
        </text>
        <text
          x="70"
          y="88"
          textAnchor="middle"
          className="fill-slate-500"
          style={{ fontSize: 12, fontWeight: 700 }}
        >
          runs
        </text>
      </svg>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="font-semibold text-slate-900">HIGH</span>
          </div>
          <span className="font-extrabold text-slate-900">{high}</span>
        </div>
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="font-semibold text-slate-900">MEDIUM</span>
          </div>
          <span className="font-extrabold text-slate-900">{medium}</span>
        </div>
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-900">LOW</span>
          </div>
          <span className="font-extrabold text-slate-900">{low}</span>
        </div>
      </div>
    </div>
  );
}

function getStoredRole(): Role {
  if (typeof window === "undefined") return "LEGAL";
  const v = (localStorage.getItem("dv_role") || "LEGAL").toUpperCase();
  if (v === "ADMIN" || v === "LEGAL" || v === "MANAGER" || v === "VIEWER")
    return v;
  return "LEGAL";
}

function setStoredRole(role: Role) {
  if (typeof window === "undefined") return;
  localStorage.setItem("dv_role", role);
}

function csvEscape(v: any) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

export default function DashboardPage() {
  const [items, setItems] = useState<ComparisonItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pinging, setPinging] = useState(false);
  const [apiOk, setApiOk] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [role, setRole] = useState<Role>("LEGAL");

  useEffect(() => {
    setRole(getStoredRole());
  }, []);

  useEffect(() => {
    setStoredRole(role);
  }, [role]);

  const canSeeRisk = role !== "VIEWER";
  const canDownload = role === "ADMIN" || role === "MANAGER" || role === "LEGAL";

  const fetchComparisons = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/comparisons?limit=250`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`โหลด comparisons ไม่สำเร็จ (${res.status})`);
      const data: ComparisonItem[] = await res.json();
      setItems(Array.isArray(data) ? data : []);
      setApiOk(true);
    } catch (e: any) {
      setError(e?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      setApiOk(false);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const pingApi = async () => {
    setPinging(true);
    try {
      const res = await fetch(`${API_BASE}/health`, { cache: "no-store" });
      setApiOk(res.ok);
    } catch {
      setApiOk(false);
    } finally {
      setPinging(false);
    }
  };

  useEffect(() => {
    fetchComparisons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const computed = useMemo(() => {
    const list = [...items].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const comparisons = list.length;

    const docsSet = new Set(list.map((x) => x.document_name).filter(Boolean));
    const documents = docsSet.size;

    const vSet = new Set<string>();
    list.forEach((x) => {
      if (x.version_old_label)
        vSet.add(`${x.document_name}::${x.version_old_label}`);
      if (x.version_new_label)
        vSet.add(`${x.document_name}::${x.version_new_label}`);
    });
    const versions = vSet.size;

    let high = 0,
      med = 0,
      low = 0;

    list.forEach((x) => {
      const r = normalizeRisk(x.overall_risk_level);
      if (r === "HIGH") high++;
      else if (r === "MEDIUM") med++;
      else low++;
    });

    // trend last 14 days
    const days = 14;
    const now = new Date();
    const buckets = new Array(days).fill(0);
    const labels = new Array(days).fill("").map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (days - 1 - i));
      return d.toLocaleDateString("th-TH", { month: "short", day: "numeric" });
    });

    list.forEach((x) => {
      const d = new Date(x.created_at);
      const diff = Math.floor(
        (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diff >= 0 && diff < days) {
        const idx = days - 1 - diff;
        buckets[idx] += 1;
      }
    });

    // Top documents (by changes_count if present, else by frequency)
    const byDoc = new Map<
      string,
      { doc: string; totalChanges: number; count: number }
    >();
    list.forEach((x) => {
      const doc = x.document_name || "Untitled";
      const cur = byDoc.get(doc) || { doc, totalChanges: 0, count: 0 };
      cur.totalChanges += x.changes_count || 0;
      cur.count += 1;
      byDoc.set(doc, cur);
    });

    const topDocs = [...byDoc.values()]
      .sort((a, b) => {
        // ถ้า backend ไม่ส่ง changes_count -> totalChanges จะเป็น 0 หมด จัดด้วย count แทน
        if (b.totalChanges !== a.totalChanges) return b.totalChanges - a.totalChanges;
        return b.count - a.count;
      })
      .slice(0, 6);

    const latest = list.slice(0, 8);
    const lastRun = latest[0]?.created_at ? formatDateTime(latest[0].created_at) : "—";

    // month
    const nowMonth = new Date();
    const m = nowMonth.getMonth();
    const y = nowMonth.getFullYear();
    const monthList = list.filter((x) => {
      const d = new Date(x.created_at);
      return d.getFullYear() === y && d.getMonth() === m;
    });

    const monthLabel = formatMonthLabel(nowMonth);

    const monthChanges = monthList.reduce((s, x) => s + (x.changes_count ?? 0), 0);

    return {
      list,
      comparisons,
      documents,
      versions,
      high,
      med,
      low,
      trend: buckets,
      trendLabels: labels,
      latest,
      topDocs,
      lastRun,
      monthList,
      monthLabel,
      monthChanges,
    };
  }, [items]);

  const downloadMonthlyCSV = () => {
    const rows = computed.monthList;
    const headers = [
      "id",
      "document_name",
      "version_old_label",
      "version_new_label",
      "created_at",
      "overall_risk_level",
      "changes_count",
    ];

    const csv =
      [headers.join(",")]
        .concat(
          rows.map((r) =>
            [
              csvEscape(r.id),
              csvEscape(r.document_name),
              csvEscape(r.version_old_label),
              csvEscape(r.version_new_label),
              csvEscape(r.created_at),
              csvEscape(r.overall_risk_level ?? ""),
              csvEscape(r.changes_count ?? ""),
            ].join(",")
          )
        )
        .join("\n") + "\n";

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `monthly_report_${new Date().toISOString().slice(0, 7)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Header (Facebook-ish) */}
        <Card className="p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className="h-11 w-11 rounded-2xl text-white flex items-center justify-center shadow-sm"
                style={{ backgroundColor: FB_BLUE }}
              >
                <Squares2X2Icon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-slate-900">
                  Dashboard
                </h1>
                <p className="mt-1 text-sm text-slate-600 font-semibold">
                  ภาพรวมเอกสารและการเปรียบเทียบล่าสุดจาก Backend
                </p>

                <div className="mt-3 flex items-center gap-2 flex-wrap text-xs font-semibold text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1">
                    <CircleStackIcon className="h-4 w-4 text-slate-600" />
                    API: <span className="font-extrabold text-slate-900">{API_BASE}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1">
                    <ClockIcon className="h-4 w-4 text-slate-600" />
                    ล่าสุด: <span className="font-extrabold text-slate-900">{computed.lastRun}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Role */}
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
                <span className="text-xs font-extrabold text-slate-700">ROLE</span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="bg-transparent text-sm font-extrabold text-slate-900 outline-none"
                  title="Role-based view"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="LEGAL">LEGAL</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
              </div>

              <button
                onClick={pingApi}
                disabled={pinging}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-900 hover:bg-slate-50"
                title="ตรวจสอบ API"
              >
                <ShieldCheckIcon className="h-5 w-5 text-emerald-600" />
                {apiOk === null ? "API: —" : apiOk ? "Online" : "Offline"}
                {pinging && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
              </button>

              <button
                onClick={fetchComparisons}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold text-white shadow-sm disabled:opacity-60"
                style={{ backgroundColor: FB_BLUE }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = FB_BLUE_HOVER;
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = FB_BLUE;
                }}
              >
                <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                รีเฟรช
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-900 hover:bg-slate-50"
              >
                <DocumentMagnifyingGlassIcon className="h-5 w-5 text-slate-700" />
                เปรียบเทียบใหม่
              </Link>

              <Link
                href="/history"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-900 hover:bg-slate-50"
              >
                <ClockIcon className="h-5 w-5 text-slate-700" />
                History
              </Link>
            </div>
          </div>
        </Card>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 font-semibold flex items-start gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 mt-0.5" />
            <div>
              <div>โหลดข้อมูลไม่สำเร็จ</div>
              <div className="text-red-700/80 font-medium mt-1">{error}</div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Stat
            title="Documents"
            value={computed.documents.toLocaleString()}
            icon={<DocumentTextIcon className="h-5 w-5" />}
            sub="จำนวนชื่อเอกสาร"
          />
          <Stat
            title="Versions (est.)"
            value={computed.versions.toLocaleString()}
            icon={<DocumentTextIcon className="h-5 w-5" />}
            sub="คำนวณจาก labels"
          />
          <Stat
            title="Comparisons"
            value={computed.comparisons.toLocaleString()}
            icon={<ChartBarIcon className="h-5 w-5" />}
            sub="จำนวนการเปรียบเทียบ"
          />
          <Stat
            title="This month"
            value={computed.monthList.length.toLocaleString()}
            icon={<ClockIcon className="h-5 w-5" />}
            sub={computed.monthLabel || "เดือนนี้"}
          />
        </div>

        {/* Main */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Left: Trend + Latest */}
          <div className="lg:col-span-2 space-y-4">
            {/* Trend */}
            <Card className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5" style={{ color: FB_BLUE }} />
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      แนวโน้ม 14 วันล่าสุด
                    </div>
                    <div className="text-xs text-slate-500 font-semibold mt-0.5">
                      จำนวน comparisons ต่อวัน
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 font-semibold">
                  รวม {computed.trend.reduce((a, b) => a + b, 0)}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                {computed.comparisons === 0 ? (
                  <div className="py-10 text-center text-sm text-slate-600 font-semibold">
                    ยังไม่มีข้อมูล
                  </div>
                ) : (
                  <>
                    <MiniLineChart points={computed.trend} />
                    <div className="mt-2 grid grid-cols-7 gap-2 text-[11px] text-slate-500 font-semibold">
                      {computed.trendLabels.slice(-7).map((x, idx) => (
                        <div key={idx} className="text-center">
                          {x}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Latest comparisons */}
            <Card className="overflow-hidden">
              <div className="p-5 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">
                    Comparisons ล่าสุด
                  </div>
                  <div className="text-xs text-slate-500 font-semibold mt-1">
                    คลิกเพื่อดูรายละเอียด diff
                  </div>
                </div>
                <Link
                  href="/history"
                  className="text-xs font-extrabold hover:underline underline-offset-4"
                  style={{ color: FB_BLUE }}
                >
                  ดูทั้งหมด →
                </Link>
              </div>

              <div className="border-t border-slate-200">
                {loading ? (
                  <div className="p-8 text-center">
                    <ArrowPathIcon
                      className="h-8 w-8 animate-spin mx-auto"
                      style={{ color: FB_BLUE }}
                    />
                    <p className="mt-3 text-sm text-slate-600 font-semibold">
                      กำลังโหลด...
                    </p>
                  </div>
                ) : computed.latest.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-600 font-semibold">
                    ยังไม่มีข้อมูล
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {computed.latest.map((x) => (
                      <div
                        key={x.id}
                        className="p-4 flex flex-col md:flex-row md:items-center gap-3 hover:bg-slate-50 transition"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="font-extrabold text-slate-900 truncate">
                              {x.document_name}
                            </div>
                            {canSeeRisk ? (
                              <RiskPill level={x.overall_risk_level} />
                            ) : (
                              <span className="text-[11px] font-extrabold text-slate-400">
                                (hidden)
                              </span>
                            )}
                          </div>

                          <div className="mt-1 text-xs text-slate-600 font-semibold flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-slate-700">
                              {x.version_old_label}
                            </span>
                            <span className="text-slate-400">→</span>
                            <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-slate-700">
                              {x.version_new_label}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span>{formatDateTime(x.created_at)}</span>

                            {typeof x.changes_count === "number" && (
                              <>
                                <span className="text-slate-400">•</span>
                                <span className="font-extrabold text-slate-900">
                                  {x.changes_count.toLocaleString()}
                                </span>
                                <span>changes</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/compare/${x.id}`}
                            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-extrabold text-white shadow-sm"
                            style={{ backgroundColor: FB_BLUE }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = FB_BLUE_HOVER;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = FB_BLUE;
                            }}
                          >
                            เปิดรายละเอียด
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right: Risk + Top docs + Export */}
          <div className="space-y-4">
            {/* Risk distribution */}
            <Card className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-5 w-5 text-emerald-600" />
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      Risk distribution
                    </div>
                    <div className="text-xs text-slate-500 font-semibold mt-0.5">
                      จาก comparisons ทั้งหมด
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {canSeeRisk ? (
                  <Donut high={computed.high} medium={computed.med} low={computed.low} />
                ) : (
                  <div className="py-10 text-center text-sm text-slate-600 font-semibold">
                    Viewer role: ซ่อนข้อมูลความเสี่ยง
                  </div>
                )}
              </div>
            </Card>

            {/* Top docs */}
            <Card className="overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5 text-slate-700" />
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      Top documents
                    </div>
                    <div className="text-xs text-slate-500 font-semibold mt-0.5">
                      เอกสารที่ถูก compare บ่อย / เปลี่ยนเยอะ (ถ้ามี changes_count)
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200">
                {computed.topDocs.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-600 font-semibold">
                    ยังไม่มีข้อมูล
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {computed.topDocs.map((d) => {
                      const max = Math.max(
                        1,
                        ...computed.topDocs.map((x) =>
                          x.totalChanges > 0 ? x.totalChanges : x.count
                        )
                      );
                      const score = d.totalChanges > 0 ? d.totalChanges : d.count;
                      const pct = Math.max(6, Math.round((score / max) * 100));

                      return (
                        <div key={d.doc} className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-extrabold text-slate-900 truncate">
                                {d.doc}
                              </div>
                              <div className="mt-1 text-xs text-slate-600 font-semibold">
                                {d.count} comparisons
                                {d.totalChanges > 0 && (
                                  <>
                                    {" "}
                                    • {d.totalChanges.toLocaleString()} changes
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="text-xs font-extrabold text-slate-900">
                              {score.toLocaleString()}
                            </div>
                          </div>

                          <div className="mt-3 h-2 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                background: `linear-gradient(90deg, ${FB_BLUE}, rgba(24,119,242,0.35))`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>

            {/* Monthly export (clean) */}
            <Card className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <DocumentArrowDownIcon className="h-5 w-5 text-slate-700 mt-0.5" />
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      Monthly export
                    </div>
                    <div className="text-xs text-slate-500 font-semibold mt-1">
                      {computed.monthLabel} • {computed.monthList.length} runs
                      {computed.monthChanges > 0 ? ` • ${computed.monthChanges} changes` : ""}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                {canDownload ? (
                  <button
                    onClick={downloadMonthlyCSV}
                    disabled={computed.monthList.length === 0}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold text-white shadow-sm disabled:opacity-60"
                    style={{ backgroundColor: FB_BLUE }}
                    onMouseEnter={(e) => {
                      if (computed.monthList.length > 0)
                        e.currentTarget.style.backgroundColor = FB_BLUE_HOVER;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = FB_BLUE;
                    }}
                  >
                    <DocumentArrowDownIcon className="h-5 w-5" />
                    Download CSV
                  </button>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 font-semibold">
                    Viewer role: ไม่อนุญาตดาวน์โหลดรายงาน
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Footer small note */}
        <div className="text-xs text-slate-500 font-semibold">
          UI โทน Facebook-ish: ปุ่มน้ำเงิน • การ์ดขาว • ขอบบาง • จัด spacing ให้โล่งอ่านง่าย
        </div>

        {/* Global focus */}
        <style jsx global>{`
          select:focus,
          button:focus,
          a:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(24, 119, 242, 0.25);
            border-radius: 12px;
          }
        `}</style>
      </div>
    </div>
  );
}
