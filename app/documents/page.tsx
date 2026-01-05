// app/documents/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowPathIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

type ComparisonItem = {
  id: number;
  document_name: string;
  version_old_label: string;
  version_new_label: string;
  created_at: string;
  overall_risk_level?: "LOW" | "MEDIUM" | "HIGH" | string | null;
  changes_count?: number;
};

type Risk = "HIGH" | "MEDIUM" | "LOW";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.trim() || "http://127.0.0.1:8000";

function normalizeRisk(r?: string | null): Risk {
  const x = (r || "").toUpperCase();
  if (x.includes("HIGH")) return "HIGH";
  if (x.includes("MEDIUM")) return "MEDIUM";
  return "LOW";
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("th-TH", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function csvEscape(v: any) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

function RiskPill({ r }: { r: Risk }) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold border";
  if (r === "HIGH")
    return <span className={`${base} bg-red-50 text-red-700 border-red-200`}>HIGH</span>;
  if (r === "MEDIUM")
    return <span className={`${base} bg-amber-50 text-amber-700 border-amber-200`}>MEDIUM</span>;
  return <span className={`${base} bg-emerald-50 text-emerald-700 border-emerald-200`}>LOW</span>;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function DocumentsPage() {
  const [items, setItems] = useState<ComparisonItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [q, setQ] = useState("");
  const [riskFilter, setRiskFilter] = useState<"ALL" | Risk>("ALL");
  const [sort, setSort] = useState<"UPDATED_DESC" | "NAME_ASC" | "RISK_DESC">(
    "UPDATED_DESC"
  );

  const fetchComparisons = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/comparisons?limit=250`, { cache: "no-store" });
      if (!res.ok) throw new Error(`โหลด comparisons ไม่สำเร็จ (${res.status})`);
      const data: ComparisonItem[] = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparisons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const computed = useMemo(() => {
    const list = [...items].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // group by document
    type DocRow = {
      doc: string;
      comparisons: number;
      versionsEstimated: number;
      totalChanges: number;
      lastUpdatedISO: string;
      lastComparisonId: number | null;
      lastRisk: Risk;
      lastFromTo: string; // v_old -> v_new
    };

    const byDoc = new Map<
      string,
      {
        doc: string;
        comparisons: number;
        vset: Set<string>;
        totalChanges: number;
        lastUpdatedISO: string;
        lastComparisonId: number | null;
        lastRisk: Risk;
        lastFromTo: string;
      }
    >();

    for (const x of list) {
      const doc = (x.document_name || "Untitled").trim() || "Untitled";
      const cur =
        byDoc.get(doc) ||
        ({
          doc,
          comparisons: 0,
          vset: new Set<string>(),
          totalChanges: 0,
          lastUpdatedISO: x.created_at,
          lastComparisonId: x.id,
          lastRisk: normalizeRisk(x.overall_risk_level),
          lastFromTo: `${x.version_old_label} → ${x.version_new_label}`,
        } as any);

      cur.comparisons += 1;
      if (x.version_old_label) cur.vset.add(x.version_old_label);
      if (x.version_new_label) cur.vset.add(x.version_new_label);
      cur.totalChanges += x.changes_count ?? 0;

      // list is sorted desc; first time we see a doc = latest
      if (!byDoc.has(doc)) {
        cur.lastUpdatedISO = x.created_at;
        cur.lastComparisonId = x.id;
        cur.lastRisk = normalizeRisk(x.overall_risk_level);
        cur.lastFromTo = `${x.version_old_label} → ${x.version_new_label}`;
      }

      byDoc.set(doc, cur);
    }

    const rows: DocRow[] = [...byDoc.values()].map((x) => ({
      doc: x.doc,
      comparisons: x.comparisons,
      versionsEstimated: x.vset.size,
      totalChanges: x.totalChanges,
      lastUpdatedISO: x.lastUpdatedISO,
      lastComparisonId: x.lastComparisonId,
      lastRisk: x.lastRisk,
      lastFromTo: x.lastFromTo,
    }));

    // filters
    const qq = q.trim().toLowerCase();
    let filtered = rows.filter((r) => {
      const okQ = !qq ? true : r.doc.toLowerCase().includes(qq);
      const okRisk = riskFilter === "ALL" ? true : r.lastRisk === riskFilter;
      return okQ && okRisk;
    });

    // sort
    const riskScore = (r: Risk) => (r === "HIGH" ? 3 : r === "MEDIUM" ? 2 : 1);

    filtered.sort((a, b) => {
      if (sort === "NAME_ASC") return a.doc.localeCompare(b.doc);
      if (sort === "RISK_DESC") {
        const d = riskScore(b.lastRisk) - riskScore(a.lastRisk);
        if (d !== 0) return d;
        return new Date(b.lastUpdatedISO).getTime() - new Date(a.lastUpdatedISO).getTime();
      }
      return new Date(b.lastUpdatedISO).getTime() - new Date(a.lastUpdatedISO).getTime();
    });

    // KPIs
    const totalDocs = rows.length;
    const totalComparisons = list.length;
    const totalVersionsEstimated = rows.reduce((s, r) => s + r.versionsEstimated, 0);

    const highDocs = rows.filter((r) => r.lastRisk === "HIGH").length;
    const medDocs = rows.filter((r) => r.lastRisk === "MEDIUM").length;
    const lowDocs = rows.filter((r) => r.lastRisk === "LOW").length;

    // top changes
    const topChanged = [...rows]
      .sort((a, b) => b.totalChanges - a.totalChanges)
      .slice(0, 5);

    const maxChanges = Math.max(1, ...topChanged.map((x) => x.totalChanges));

    return {
      rows,
      filtered,
      totalDocs,
      totalComparisons,
      totalVersionsEstimated,
      riskSummary: { highDocs, medDocs, lowDocs },
      topChanged,
      maxChanges,
    };
  }, [items, q, riskFilter, sort]);

  const downloadDocsCSV = () => {
    const rows = computed.filtered;
    const headers = [
      "document_name",
      "comparisons",
      "versions_estimated",
      "total_changes",
      "last_updated",
      "last_risk",
      "last_from_to",
      "last_comparison_id",
    ];

    const csv =
      [headers.join(",")]
        .concat(
          rows.map((r) =>
            [
              csvEscape(r.doc),
              csvEscape(r.comparisons),
              csvEscape(r.versionsEstimated),
              csvEscape(r.totalChanges),
              csvEscape(r.lastUpdatedISO),
              csvEscape(r.lastRisk),
              csvEscape(r.lastFromTo),
              csvEscape(r.lastComparisonId ?? ""),
            ].join(",")
          )
        )
        .join("\n") + "\n";

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `documents_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Documents</h1>
            <p className="mt-1 text-sm text-slate-600 font-semibold">
              รายการเอกสาร • เวอร์ชัน (estimated) • สถานะความเสี่ยงล่าสุด • last updated
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={fetchComparisons}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-extrabold text-white hover:opacity-95 disabled:opacity-60"
            >
              <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>

            <button
              onClick={downloadDocsCSV}
              disabled={computed.filtered.length === 0}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
              title="Export documents list (CSV)"
            >
              <DocumentArrowDownIcon className="h-5 w-5 text-emerald-700" />
              Export CSV
            </button>

            <Link
              href="/history"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-900 hover:bg-slate-50"
            >
              <ClockIcon className="h-5 w-5 text-slate-700" />
              History
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 font-semibold flex items-start gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 mt-0.5" />
            <div>
              <div>โหลดข้อมูลไม่สำเร็จ</div>
              <div className="text-red-700/80 font-medium mt-1">{error}</div>
            </div>
          </div>
        )}
      </div>

      {/* KPI */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-extrabold text-slate-600 uppercase">Documents</div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">
            {computed.totalDocs.toLocaleString()}
          </div>
          <div className="mt-1 text-xs font-semibold text-slate-600">จำนวนชื่อเอกสารทั้งหมด</div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-extrabold text-slate-600 uppercase">Comparisons</div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">
            {computed.totalComparisons.toLocaleString()}
          </div>
          <div className="mt-1 text-xs font-semibold text-slate-600">รายการเปรียบเทียบรวม</div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-extrabold text-slate-600 uppercase">Versions (estimated)</div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">
            {computed.totalVersionsEstimated.toLocaleString()}
          </div>
          <div className="mt-1 text-xs font-semibold text-slate-600">
            รวมจำนวนเวอร์ชันที่เดาจาก labels (sum ต่อเอกสาร)
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-extrabold text-slate-600 uppercase">Risk docs (H/M/L)</div>
          <div className="mt-2 text-lg font-extrabold text-slate-900">
            {computed.riskSummary.highDocs}/{computed.riskSummary.medDocs}/{computed.riskSummary.lowDocs}
          </div>
          <div className="mt-1 text-xs font-semibold text-slate-600">
            ความเสี่ยง “ล่าสุด” ต่อเอกสาร
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-slate-700" />
          <div className="text-sm font-extrabold text-slate-900">Search & filters</div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="md:col-span-1">
            <label className="text-xs font-extrabold text-slate-700">Search</label>
            <div className="mt-1 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ค้นหาชื่อเอกสาร..."
                className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-extrabold text-slate-700">Risk</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
            >
              <option value="ALL">All risk</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-extrabold text-slate-700">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
            >
              <option value="UPDATED_DESC">Last updated (desc)</option>
              <option value="NAME_ASC">Name (A → Z)</option>
              <option value="RISK_DESC">Risk (high → low)</option>
            </select>
          </div>
        </div>

        <div className="mt-3 text-xs font-semibold text-slate-600">
          Showing <span className="font-extrabold text-slate-900">{computed.filtered.length}</span>{" "}
          documents
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Documents list */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5 flex items-center gap-2">
            <DocumentTextIcon className="h-5 w-5 text-slate-700" />
            <div>
              <div className="text-sm font-extrabold text-slate-900">Document registry</div>
              <div className="text-xs font-semibold text-slate-600">
                รวมเอกสารจาก comparisons (group by document_name)
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200">
            {loading ? (
              <div className="p-8 text-center">
                <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto text-violet-600" />
                <p className="mt-3 text-sm text-slate-600 font-semibold">กำลังโหลด...</p>
              </div>
            ) : computed.filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-600 font-semibold">
                ไม่พบเอกสาร
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {computed.filtered.slice(0, 25).map((r) => (
                  <div
                    key={r.doc}
                    className="p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4 hover:bg-slate-50/60"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-extrabold text-slate-900 truncate">{r.doc}</div>
                        <RiskPill r={r.lastRisk} />
                      </div>

                      <div className="mt-1 text-xs font-semibold text-slate-600 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-50 border border-slate-200 px-2 py-0.5">
                          {r.versionsEstimated} versions (est.)
                        </span>
                        <span className="rounded-full bg-slate-50 border border-slate-200 px-2 py-0.5">
                          {r.comparisons} comparisons
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="font-extrabold text-slate-900">
                          {r.totalChanges.toLocaleString()}
                        </span>
                        <span>changes</span>
                        <span className="text-slate-400">•</span>
                        <span>Updated {formatDate(r.lastUpdatedISO)}</span>
                      </div>

                      <div className="mt-2 text-[11px] font-semibold text-slate-500">
                        Latest: {r.lastFromTo}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {r.lastComparisonId ? (
                        <Link
                          href={`/compare/${r.lastComparisonId}`}
                          className="inline-flex items-center justify-center rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-extrabold hover:opacity-95"
                        >
                          Open latest
                        </Link>
                      ) : (
                        <span className="text-xs font-semibold text-slate-500">—</span>
                      )}
                      <Link
                        href="/history"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-900 hover:bg-slate-50"
                      >
                        History
                      </Link>
                    </div>
                  </div>
                ))}
                {computed.filtered.length > 25 && (
                  <div className="p-4 text-center text-xs font-semibold text-slate-600">
                    แสดงแค่ 25 รายการแรก (ถ้าจะทำ pagination + server-side ผมทำให้ได้)
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Side: Top changed */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5">
            <div className="text-sm font-extrabold text-slate-900">Top changed documents</div>
            <div className="mt-1 text-xs font-semibold text-slate-600">
              เอกสารที่เปลี่ยนเยอะสุด (รวม changes_count)
            </div>
          </div>

          <div className="border-t border-slate-200">
            {computed.topChanged.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-600 font-semibold">
                ยังไม่มีข้อมูล
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {computed.topChanged.map((d) => {
                  const pct = clamp((d.totalChanges / computed.maxChanges) * 100, 6, 100);
                  return (
                    <div key={d.doc} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-extrabold text-slate-900 truncate">{d.doc}</div>
                          <div className="mt-1 text-xs font-semibold text-slate-600">
                            {d.comparisons} comparisons • {d.totalChanges.toLocaleString()} changes
                          </div>
                        </div>
                        <div className="text-xs font-extrabold text-slate-900">
                          {d.totalChanges.toLocaleString()}
                        </div>
                      </div>

                      <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      {d.lastComparisonId && (
                        <div className="mt-3">
                          <Link
                            href={`/compare/${d.lastComparisonId}`}
                            className="text-xs font-extrabold text-violet-700 hover:underline underline-offset-4"
                          >
                            Open latest diff →
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-200">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-600" />
                <div className="text-sm font-extrabold text-slate-900">Next step (สมจริงขึ้นอีก)</div>
              </div>
              <div className="mt-2 text-xs font-semibold text-slate-600">
                ถ้าคุณมีตาราง documents/versions จริงใน backend:
                จะทำให้ “versions (estimated)” กลายเป็น “versions (actual)” ได้ + มี owner, department, status
              </div>
              <div className="mt-3">
                <Link
                  href="/reports"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-extrabold hover:opacity-95"
                >
                  ดู Reports
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-slate-600 font-semibold">
        หน้านี้พร้อมใช้งานแล้ว: search/filter/sort • group by document • export CSV • jump to latest diff
      </div>
    </div>
  );
}
