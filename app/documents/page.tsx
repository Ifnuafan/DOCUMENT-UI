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
  ChartBarIcon,
  HashtagIcon,
  ArchiveBoxIcon,
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

function formatDateShort(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("th-TH", {
      month: "short",
      day: "numeric",
      year: "numeric",
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

// Function to highlight only changed parts in old text
function HighlightDiffText({ oldText = "", newText = "" }: { oldText?: string; newText?: string }) {
  const oldWords = (oldText || "").split(/(\s+)/);
  const newWords = (newText || "").split(/(\s+)/);
  
  const oldSet = new Set(oldWords.map(w => w.toLowerCase()));
  const newSet = new Set(newWords.map(w => w.toLowerCase()));
  
  return (
    <div className="text-sm text-gray-700">
      {oldWords.map((word, i) => {
        const isChanged = !newSet.has(word.toLowerCase());
        
        return (
          <span
            key={i}
            className={
              isChanged 
                ? "bg-red-100 text-red-900 px-1 py-0.5 rounded line-through font-bold" 
                : ""
            }
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}

// Function to highlight only changed parts in new text
function HighlightDiffTextNew({ oldText = "", newText = "" }: { oldText?: string; newText?: string }) {
  const oldWords = (oldText || "").split(/(\s+)/);
  const newWords = (newText || "").split(/(\s+)/);
  
  const oldSet = new Set(oldWords.map(w => w.toLowerCase()));
  
  return (
    <div className="text-sm text-gray-700">
      {newWords.map((word, i) => {
        const isChanged = !oldSet.has(word.toLowerCase());
        
        return (
          <span
            key={i}
            className={
              isChanged 
                ? "bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded font-bold" 
                : ""
            }
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}

export default function DocumentsPage() {
  const [items, setItems] = useState<ComparisonItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  // filters
  const [q, setQ] = useState("");
  const [riskFilter, setRiskFilter] = useState<"ALL" | Risk>("ALL");
  const [sort, setSort] = useState<"UPDATED_DESC" | "NAME_ASC" | "RISK_DESC" | "CHANGES_DESC">(
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
      lastFromTo: string;
      allComparisons: ComparisonItem[];
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
        allComparisons: ComparisonItem[];
      }
    >();

    for (const x of list) {
      const doc = (x.document_name || "Untitled").trim() || "Untitled";
      const cur = byDoc.get(doc) || ({
        doc,
        comparisons: 0,
        vset: new Set<string>(),
        totalChanges: 0,
        lastUpdatedISO: x.created_at,
        lastComparisonId: x.id,
        lastRisk: normalizeRisk(x.overall_risk_level),
        lastFromTo: `${x.version_old_label} → ${x.version_new_label}`,
        allComparisons: [],
      } as any);

      cur.comparisons += 1;
      if (x.version_old_label) cur.vset.add(x.version_old_label);
      if (x.version_new_label) cur.vset.add(x.version_new_label);
      cur.totalChanges += x.changes_count ?? 0;
      cur.allComparisons.push(x);

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
      allComparisons: x.allComparisons,
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
      if (sort === "CHANGES_DESC") {
        return b.totalChanges - a.totalChanges;
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

    // Get selected document details
    const selectedDocDetails = selectedDoc 
      ? rows.find(r => r.doc === selectedDoc)
      : null;

    return {
      rows,
      filtered,
      totalDocs,
      totalComparisons,
      totalVersionsEstimated,
      riskSummary: { highDocs, medDocs, lowDocs },
      topChanged,
      maxChanges,
      selectedDocDetails,
      allComparisons: list,
    };
  }, [items, q, riskFilter, sort, selectedDoc]);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">📁 จัดการเอกสาร</h1>
                <p className="mt-1 text-gray-600">
                  ดูเอกสารทั้งหมดที่เคยเปรียบเทียบ จัดกลุ่มตามชื่อเอกสาร
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={fetchComparisons}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
                >
                  <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  โหลดใหม่
                </button>

                <button
                  onClick={downloadDocsCSV}
                  disabled={computed.filtered.length === 0}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  <DocumentArrowDownIcon className="h-5 w-5 text-emerald-600" />
                  Export CSV
                </button>

                <Link
                  href="/history"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <ClockIcon className="h-5 w-5 text-gray-600" />
                  ดูประวัติ
                </Link>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <div className="flex items-start gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-red-800">โหลดข้อมูลไม่สำเร็จ</div>
                    <div className="text-sm text-red-600 mt-1">{error}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{computed.totalDocs}</div>
                <div className="text-sm text-gray-600">เอกสารทั้งหมด</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <ChartBarIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{computed.totalComparisons}</div>
                <div className="text-sm text-gray-600">การเปรียบเทียบ</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <HashtagIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{computed.totalVersionsEstimated}</div>
                <div className="text-sm text-gray-600">เวอร์ชันโดยประมาณ</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <ArchiveBoxIcon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {computed.riskSummary.highDocs}
                </div>
                <div className="text-sm text-gray-600">ความเสี่ยงสูง</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Filters & Documents List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-4">
                <FunnelIcon className="h-5 w-5 text-gray-700" />
                <h2 className="font-bold text-gray-900">ค้นหาและกรอง</h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ค้นหาชื่อเอกสาร</label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="พิมพ์ชื่อเอกสาร..."
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ระดับความเสี่ยง</label>
                    <select
                      value={riskFilter}
                      onChange={(e) => setRiskFilter(e.target.value as any)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="ALL">ทั้งหมด</option>
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">เรียงลำดับ</label>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as any)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="UPDATED_DESC">อัพเดตล่าสุด</option>
                      <option value="NAME_ASC">ชื่อ A-Z</option>
                      <option value="RISK_DESC">ความเสี่ยงสูง-ต่ำ</option>
                      <option value="CHANGES_DESC">เปลี่ยนแปลงมากสุด</option>
                    </select>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  แสดง {computed.filtered.length} จาก {computed.totalDocs} เอกสาร
                </div>
              </div>
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5 text-gray-700" />
                  <h2 className="font-bold text-gray-900">รายการเอกสาร</h2>
                </div>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                  <p className="mt-3 text-gray-600">กำลังโหลด...</p>
                </div>
              ) : computed.filtered.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600">ไม่พบเอกสารที่ตรงกับการค้นหา</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {computed.filtered.slice(0, 20).map((doc) => (
                    <div
                      key={doc.doc}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedDoc === doc.doc ? "bg-blue-50 border-l-4 border-blue-500" : ""
                      }`}
                      onClick={() => setSelectedDoc(doc.doc)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-900 truncate">{doc.doc}</h3>
                            <RiskPill r={doc.lastRisk} />
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                              {doc.comparisons} การเปรียบเทียบ
                            </span>
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                              {doc.versionsEstimated} เวอร์ชัน
                            </span>
                            <span className="font-bold text-gray-900">
                              {doc.totalChanges.toLocaleString()} การเปลี่ยนแปลง
                            </span>
                          </div>

                          <div className="text-sm text-gray-600">
                            อัพเดตล่าสุด: {formatDateShort(doc.lastUpdatedISO)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {doc.lastComparisonId && (
                            <Link
                              href={`/compare/${doc.lastComparisonId}`}
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium"
                            >
                              ดูล่าสุด
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Document Details & Top Documents */}
          <div className="space-y-6">
            {/* Selected Document Details */}
            {computed.selectedDocDetails ? (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-bold text-gray-900">รายละเอียดเอกสาร</h2>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {computed.selectedDocDetails.doc}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">การเปรียบเทียบ</div>
                        <div className="text-xl font-bold text-gray-900">
                          {computed.selectedDocDetails.comparisons}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">การเปลี่ยนแปลงรวม</div>
                        <div className="text-xl font-bold text-gray-900">
                          {computed.selectedDocDetails.totalChanges.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600 mb-2">เวอร์ชันล่าสุด</div>
                      <div className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {computed.selectedDocDetails.lastFromTo}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600 mb-2">การเปรียบเทียบทั้งหมด</div>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {computed.selectedDocDetails.allComparisons
                          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                          .slice(0, 5)
                          .map((comp) => (
                            <Link
                              key={comp.id}
                              href={`/compare/${comp.id}`}
                              className="block p-2 border border-gray-200 rounded hover:bg-gray-50"
                            >
                              <div className="text-sm text-gray-900">{comp.version_old_label} → {comp.version_new_label}</div>
                              <div className="text-xs text-gray-600">{formatDateShort(comp.created_at)}</div>
                            </Link>
                          ))}
                      </div>
                    </div>

                    <Link
                      href="/history"
                      className="block w-full text-center py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      ดูประวัติทั้งหมด
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <DocumentTextIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-gray-700 font-medium">เลือกรายการเอกสาร</h3>
                <p className="text-sm text-gray-500 mt-1">คลิกรายการเอกสารเพื่อดูรายละเอียด</p>
              </div>
            )}

            {/* Top Changed Documents */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">เอกสารที่มีการเปลี่ยนแปลงมากที่สุด</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {computed.topChanged.map((doc, index) => {
                  const pct = clamp((doc.totalChanges / computed.maxChanges) * 100, 10, 100);
                  return (
                    <div key={doc.doc} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                            <h4 className="font-medium text-gray-900 truncate">{doc.doc}</h4>
                          </div>
                          <div className="text-xs text-gray-600">
                            {doc.totalChanges.toLocaleString()} การเปลี่ยนแปลง
                          </div>
                        </div>
                      </div>

                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      {doc.lastComparisonId && (
                        <div className="mt-3">
                          <Link
                            href={`/compare/${doc.lastComparisonId}`}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            ดูการเปรียบเทียบล่าสุด →
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>แสดงเอกสารจาก {computed.totalComparisons} การเปรียบเทียบ • สรุป: {computed.totalDocs} เอกสาร • อัพเดตล่าสุด: {new Date().toLocaleTimeString("th-TH")}</p>
        </div>
      </div>
    </div>
  );
}