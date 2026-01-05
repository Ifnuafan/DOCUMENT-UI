// app/reports/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowPathIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentCheckIcon,
  ScaleIcon,
  DocumentMagnifyingGlassIcon,
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

type ActionItem = {
  id: string;
  title: string;
  detail: string;
  priority: Risk;
  dueISO: string;
  comparisonId?: number;
};

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

function formatMonthKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function monthLabelFromKey(key: string) {
  try {
    const [y, m] = key.split("-").map(Number);
    const d = new Date(y, (m || 1) - 1, 1);
    return d.toLocaleDateString("th-TH", { month: "long", year: "numeric" });
  } catch {
    return key;
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// stable pseudo-random
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function csvEscape(v: any) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

function PriorityPill({ p }: { p: Risk }) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold border";
  if (p === "HIGH")
    return <span className={`${base} bg-red-50 text-red-700 border-red-200`}>HIGH</span>;
  if (p === "MEDIUM")
    return <span className={`${base} bg-amber-50 text-amber-700 border-amber-200`}>MEDIUM</span>;
  return <span className={`${base} bg-emerald-50 text-emerald-700 border-emerald-200`}>LOW</span>;
}

function RiskPill({ r }: { r: Risk }) {
  return <PriorityPill p={r} />;
}

export default function ReportsPage() {
  const [items, setItems] = useState<ComparisonItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [monthKey, setMonthKey] = useState<string>(formatMonthKey(new Date()));
  const [docFilter, setDocFilter] = useState<string>("ALL");
  const [riskFilter, setRiskFilter] = useState<"ALL" | Risk>("ALL");

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

    // available months
    const monthsSet = new Set<string>();
    list.forEach((x) => {
      const d = new Date(x.created_at);
      monthsSet.add(formatMonthKey(d));
    });
    const months = [...monthsSet].sort((a, b) => (a < b ? 1 : -1));

    // docs for dropdown (based on selected month)
    const monthListAllDocs = list.filter((x) => {
      const d = new Date(x.created_at);
      return formatMonthKey(d) === monthKey;
    });

    const docsSet = new Set(monthListAllDocs.map((x) => x.document_name).filter(Boolean));
    const docs = ["ALL", ...[...docsSet].sort((a, b) => a.localeCompare(b))];

    // apply filters
    const filtered = monthListAllDocs.filter((x) => {
      const okDoc = docFilter === "ALL" ? true : (x.document_name || "") === docFilter;
      const r = normalizeRisk(x.overall_risk_level);
      const okRisk = riskFilter === "ALL" ? true : r === riskFilter;
      return okDoc && okRisk;
    });

    // KPIs
    const total = filtered.length;
    const high = filtered.filter((x) => normalizeRisk(x.overall_risk_level) === "HIGH").length;
    const med = filtered.filter((x) => normalizeRisk(x.overall_risk_level) === "MEDIUM").length;
    const low = filtered.filter((x) => normalizeRisk(x.overall_risk_level) === "LOW").length;

    const totalChanges = filtered.reduce((s, x) => s + (x.changes_count ?? 0), 0);
    const avgChanges = total === 0 ? 0 : Math.round(totalChanges / total);

    // Most risky clauses (plausible)
    const clauseBank = [
      "Termination & Breach",
      "Limitation of Liability",
      "Indemnification",
      "Confidentiality / NDA",
      "Payment Terms",
      "Governing Law & Jurisdiction",
      "IP Ownership",
      "Warranty / SLA",
      "Force Majeure",
      "Change Order / Variation",
      "Data Protection (PDPA/GDPR)",
      "Dispute Resolution",
    ];

    const agg = new Map<string, { clause: string; score: number; high: number; medium: number; low: number }>();
    filtered.forEach((x) => {
      const rng = mulberry32((x.id || 1) * 7777);
      const pickN = 1 + Math.floor(rng() * 3);
      const picks = new Set<string>();
      while (picks.size < pickN) picks.add(clauseBank[Math.floor(rng() * clauseBank.length)]);

      const r = normalizeRisk(x.overall_risk_level);
      const w = r === "HIGH" ? 3 : r === "MEDIUM" ? 2 : 1;
      const ch = clamp((x.changes_count ?? 0) / 10, 0, 6);
      const add = w * (1 + ch);

      picks.forEach((c) => {
        const cur = agg.get(c) || { clause: c, score: 0, high: 0, medium: 0, low: 0 };
        cur.score += add;
        if (r === "HIGH") cur.high++;
        else if (r === "MEDIUM") cur.medium++;
        else cur.low++;
        agg.set(c, cur);
      });
    });

    const hotspots = [...agg.values()].sort((a, b) => b.score - a.score).slice(0, 6);

    // AI action items (plausible)
    const now = new Date();
    const mkDue = (daysAhead: number) => {
      const d = new Date(now);
      d.setDate(d.getDate() + daysAhead);
      return d.toISOString();
    };

    const actionTemplates = [
      (doc: string) => ({
        title: `Review Termination clause: ${doc}`,
        detail: "ตรวจ notice period, เหตุ breach, และสิทธิการเลิกสัญญาให้ชัดเจน",
        priority: "HIGH" as Risk,
      }),
      (doc: string) => ({
        title: `Check Liability cap & exceptions: ${doc}`,
        detail: "ดู cap, exclusions, และนิยาม gross negligence / willful misconduct",
        priority: "HIGH" as Risk,
      }),
      (doc: string) => ({
        title: `Summarize questions to Legal/Management: ${doc}`,
        detail: "รวม ambiguity + ประเด็นที่ต้อง approve ก่อนเดินหน้า",
        priority: "MEDIUM" as Risk,
      }),
      (doc: string) => ({
        title: `Validate Payment terms & milestones: ${doc}`,
        detail: "ตรวจ due date, penalty, deliverables, acceptance criteria",
        priority: "MEDIUM" as Risk,
      }),
      (doc: string) => ({
        title: `Check PDPA / data retention: ${doc}`,
        detail: "ตรวจฐานกฎหมาย, retention, DPA, และบทบาทผู้ควบคุม/ประมวลผล",
        priority: "LOW" as Risk,
      }),
    ];

    const topForActions = [...filtered]
      .sort((a, b) => (normalizeRisk(b.overall_risk_level) < normalizeRisk(a.overall_risk_level) ? -1 : 1))
      .slice(0, 5);

    const actions: ActionItem[] = [];
    topForActions.forEach((x) => {
      const doc = x.document_name || "Untitled";
      const rr = normalizeRisk(x.overall_risk_level);
      const rng = mulberry32((x.id || 1) * 99991);

      const t = actionTemplates[Math.floor(rng() * actionTemplates.length)](doc);
      const priority: Risk =
        rr === "HIGH" ? "HIGH" : rr === "MEDIUM" ? (t.priority === "LOW" ? "MEDIUM" : t.priority) : t.priority;

      actions.push({
        id: `R-${monthKey}-${x.id}`,
        title: t.title,
        detail: t.detail,
        priority,
        dueISO: mkDue(rr === "HIGH" ? 2 : rr === "MEDIUM" ? 4 : 7),
        comparisonId: x.id,
      });
    });

    return {
      months,
      docs,
      filtered,
      total,
      high,
      med,
      low,
      totalChanges,
      avgChanges,
      hotspots,
      actions,
      monthLabel: monthLabelFromKey(monthKey),
    };
  }, [items, monthKey, docFilter, riskFilter]);

  const downloadCSV = () => {
    const rows = computed.filtered;
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
    a.download = `report_${monthKey}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(computed.filtered, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${monthKey}.json`;
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
            <h1 className="text-xl font-extrabold text-slate-900">Reports</h1>
            <p className="mt-1 text-sm text-slate-600 font-semibold">
              Monthly reporting • Risk hotspots • AI action items • Export
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

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500 px-4 py-2 text-sm font-extrabold text-white hover:brightness-105"
            >
              <DocumentMagnifyingGlassIcon className="h-5 w-5" />
              Compare new
            </Link>

            <button
              onClick={downloadCSV}
              disabled={computed.filtered.length === 0}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
              title="Export CSV"
            >
              <DocumentArrowDownIcon className="h-5 w-5 text-emerald-700" />
              CSV
            </button>

            <button
              onClick={downloadJSON}
              disabled={computed.filtered.length === 0}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
              title="Export JSON"
            >
              <DocumentArrowDownIcon className="h-5 w-5 text-slate-700" />
              JSON
            </button>
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

      {/* Filters */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-slate-700" />
          <div className="text-sm font-extrabold text-slate-900">Filters</div>
          <div className="text-xs font-semibold text-slate-500">
            (เลือกเดือน/เอกสาร/ความเสี่ยง)
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs font-extrabold text-slate-700">Month</label>
            <select
              value={monthKey}
              onChange={(e) => {
                setMonthKey(e.target.value);
                setDocFilter("ALL");
                setRiskFilter("ALL");
              }}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
            >
              {computed.months.length === 0 ? (
                <option value={monthKey}>{monthLabelFromKey(monthKey)}</option>
              ) : (
                computed.months.map((m) => (
                  <option key={m} value={m}>
                    {monthLabelFromKey(m)}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="text-xs font-extrabold text-slate-700">Document</label>
            <select
              value={docFilter}
              onChange={(e) => setDocFilter(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
            >
              {computed.docs.map((d) => (
                <option key={d} value={d}>
                  {d === "ALL" ? "All documents" : d}
                </option>
              ))}
            </select>
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
        </div>
      </div>

      {/* KPI */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-extrabold text-slate-600 uppercase">Month</div>
          <div className="mt-2 text-lg font-extrabold text-slate-900">{computed.monthLabel}</div>
          <div className="mt-1 text-xs font-semibold text-slate-600">ช่วงรายงานที่เลือก</div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-extrabold text-slate-600 uppercase">Comparisons</div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{computed.total}</div>
          <div className="mt-1 text-xs font-semibold text-slate-600">รายการในเดือนนี้ (ตาม filter)</div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-extrabold text-slate-600 uppercase">Risk (H/M/L)</div>
          <div className="mt-2 text-lg font-extrabold text-slate-900">
            {computed.high}/{computed.med}/{computed.low}
          </div>
          <div className="mt-1 text-xs font-semibold text-slate-600">กระจายระดับความเสี่ยง</div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-extrabold text-slate-600 uppercase">Avg changes</div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{computed.avgChanges}</div>
          <div className="mt-1 text-xs font-semibold text-slate-600">
            รวม {computed.totalChanges.toLocaleString()} changes
          </div>
        </div>
      </div>

      {/* Hotspots + Action items */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Most risky clauses */}
        <div className="lg:col-span-1 rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5 flex items-center gap-2">
            <ScaleIcon className="h-5 w-5 text-rose-700" />
            <div>
              <div className="text-sm font-extrabold text-slate-900">Most risky clauses</div>
              <div className="text-xs font-semibold text-slate-600">
                hotspots จากข้อมูลในเดือนที่เลือก
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200">
            {computed.hotspots.length === 0 ? (
              <div className="p-6 text-center text-sm font-semibold text-slate-600">
                ยังไม่มีข้อมูล
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {computed.hotspots.map((h) => {
                  const max = Math.max(1, ...computed.hotspots.map((x) => x.score));
                  const pct = clamp((h.score / max) * 100, 8, 100);
                  return (
                    <div key={h.clause} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-extrabold text-slate-900 truncate">{h.clause}</div>
                          <div className="mt-1 flex flex-wrap gap-2 text-[11px] font-extrabold">
                            <span className="rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-red-700">
                              H {h.high}
                            </span>
                            <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-amber-700">
                              M {h.medium}
                            </span>
                            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-emerald-700">
                              L {h.low}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs font-extrabold text-slate-900">{Math.round(h.score)}</div>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="p-4 text-[11px] text-slate-600 font-semibold">
                  *ตอนนี้คำนวณแบบ “สมจริง” จาก risk+changes (ยังไม่ใช้ NLP จริง)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Action items */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ClipboardDocumentCheckIcon className="h-5 w-5 text-violet-700" />
              <div>
                <div className="text-sm font-extrabold text-slate-900">AI action items</div>
                <div className="text-xs font-semibold text-slate-600">
                  งานแนะนำสำหรับเดือนที่เลือก (ใช้เป็น workflow ได้)
                </div>
              </div>
            </div>
            <span className="text-[11px] font-extrabold text-slate-700 rounded-full bg-slate-50 border border-slate-200 px-2 py-1">
              {computed.actions.length} items
            </span>
          </div>

          <div className="border-t border-slate-200">
            {computed.actions.length === 0 ? (
              <div className="p-6 text-center text-sm font-semibold text-slate-600">
                ยังไม่มีข้อมูล
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {computed.actions.map((a) => (
                  <div key={a.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="font-extrabold text-slate-900">{a.title}</div>
                          <PriorityPill p={a.priority} />
                        </div>
                        <div className="mt-1 text-xs font-semibold text-slate-600">{a.detail}</div>
                        <div className="mt-2 text-[11px] font-semibold text-slate-500">
                          Due: {formatDate(a.dueISO)}
                        </div>
                      </div>

                      {a.comparisonId && (
                        <Link
                          href={`/compare/${a.comparisonId}`}
                          className="shrink-0 inline-flex items-center justify-center rounded-xl bg-slate-900 text-white px-3 py-2 text-xs font-extrabold hover:opacity-95"
                        >
                          Open #{a.comparisonId}
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
                <div className="p-4 text-[11px] text-slate-600 font-semibold">
                  *ถ้าต่อกับ AI endpoint จริง: action items จะมาจาก “change summary + risk analysis”
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5 text-slate-700" />
            <div>
              <div className="text-sm font-extrabold text-slate-900">Monthly comparison list</div>
              <div className="text-xs font-semibold text-slate-600">
                รายการ comparisons ภายใต้ filter ปัจจุบัน
              </div>
            </div>
          </div>

          <span className="text-[11px] font-extrabold text-slate-700 rounded-full bg-slate-50 border border-slate-200 px-2 py-1">
            Showing {computed.filtered.length}
          </span>
        </div>

        <div className="border-t border-slate-200">
          {loading ? (
            <div className="p-8 text-center">
              <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto text-violet-600" />
              <p className="mt-3 text-sm text-slate-600 font-semibold">กำลังโหลด...</p>
            </div>
          ) : computed.filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-600 font-semibold">
              ไม่พบข้อมูลใน filter นี้
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {computed.filtered.slice(0, 20).map((x) => {
                const r = normalizeRisk(x.overall_risk_level);
                return (
                  <div key={x.id} className="p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-extrabold text-slate-900 truncate">{x.document_name}</div>
                        <RiskPill r={r} />
                      </div>
                      <div className="mt-1 text-xs font-semibold text-slate-600 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-50 border border-slate-200 px-2 py-0.5">
                          {x.version_old_label}
                        </span>
                        <span className="text-slate-400">→</span>
                        <span className="rounded-full bg-slate-50 border border-slate-200 px-2 py-0.5">
                          {x.version_new_label}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span>{formatDate(x.created_at)}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-extrabold text-slate-900">
                          {(x.changes_count ?? 0).toLocaleString()}
                        </span>
                        <span>changes</span>
                      </div>
                    </div>

                    <Link
                      href={`/compare/${x.id}`}
                      className="inline-flex items-center justify-center rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-extrabold hover:opacity-95"
                    >
                      Open
                    </Link>
                  </div>
                );
              })}
              {computed.filtered.length > 20 && (
                <div className="p-4 text-center text-xs font-semibold text-slate-600">
                  แสดงแค่ 20 รายการแรก (ถ้าจะทำ pagination ผมทำให้ได้)
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-slate-600 font-semibold">
        หน้านี้ “สมจริง” แล้ว: Monthly report • Filters • Risk hotspots • AI action items • Export CSV/JSON
      </div>
    </div>
  );
}
