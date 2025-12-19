// app/compare/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  ClockIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  DocumentMagnifyingGlassIcon,
  SparklesIcon,
  LightBulbIcon
} from "@heroicons/react/24/outline";

type ChangeItem = {
  id: number;
  change_type: "ADDED" | "REMOVED" | "MODIFIED";
  section_label: string | null;
  old_text: string | null;
  new_text: string | null;
  risk_level?: "LOW" | "MEDIUM" | "HIGH" | null;
  ai_comment?: string | null;
  ai_suggestion?: string | null;
};

type ComparisonDetail = {
  id: number;
  document_name: string;
  version_old_label: string;
  version_new_label: string;
  created_at: string;
  overall_risk_level?: string | null;
  summary_text?: string | null;
  changes: ChangeItem[];
};

export default function CompareDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [detail, setDetail] = useState<ComparisonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [annotating, setAnnotating] = useState(false);
  const [annotateError, setAnnotateError] = useState<string | null>(null);

  const API_BASE = "http://127.0.0.1:8000";

  useEffect(() => {
    if (id) {
      loadDetail();
    }
  }, [id]);

  const loadDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/comparisons/${id}`);
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const data: ComparisonDetail = await res.json();
      setDetail(data);
    } catch (err: any) {
      setError(err.message);
      setDetail(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAnnotate = async () => {
    if (!id) return;
    setAnnotating(true);
    setAnnotateError(null);
    
    try {
      const res = await fetch(`${API_BASE}/comparisons/${id}/annotate`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`Annotation failed (${res.status})`);
      
      // โหลดใหม่หลังจาก annotate
      await loadDetail();
    } catch (err: any) {
      setAnnotateError(err.message);
    } finally {
      setAnnotating(false);
    }
  };

  // Helper functions
  const riskBadge = (risk?: string | null) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold";
    const level = (risk || "LOW").toUpperCase();
    
    if (level === "HIGH") return <span className={`${base} bg-red-100 text-red-700`}>HIGH</span>;
    if (level === "MEDIUM") return <span className={`${base} bg-amber-100 text-amber-700`}>MEDIUM</span>;
    return <span className={`${base} bg-emerald-100 text-emerald-700`}>LOW</span>;
  };

  const changeTypeBadge = (type: string) => {
    const base = "px-2 py-1 rounded text-xs font-medium";
    if (type === "ADDED") return <span className={`${base} bg-emerald-100 text-emerald-700`}>+ ADDED</span>;
    if (type === "REMOVED") return <span className={`${base} bg-red-100 text-red-700`}>- REMOVED</span>;
    return <span className={`${base} bg-amber-100 text-amber-700`}>MODIFIED</span>;
  };

  const formatDateTime = (iso: string) => {
    return new Date(iso).toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-slate-600">กำลังโหลดรายละเอียด...</p>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 mt-4">ไม่พบข้อมูล</h2>
          <p className="text-slate-600 mt-2">{error || "ไม่พบรายการเปรียบเทียบนี้"}</p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link
              href="/history"
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              ← กลับไปหน้าประวัติ
            </Link>
            <button
              onClick={loadDetail}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              ลองอีกครั้ง
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/history"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              กลับไปหน้าประวัติ
            </Link>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleAnnotate}
                disabled={annotating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-70"
              >
                {annotating ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    กำลังวิเคราะห์...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-4 w-4" />
                    ให้ AI วิเคราะห์ใหม่
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Document Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                  {detail.document_name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-violet-100 text-violet-700 text-sm rounded">
                      {detail.version_old_label}
                    </span>
                    <span className="text-slate-400">→</span>
                    <span className="px-2 py-1 bg-fuchsia-100 text-fuchsia-700 text-sm rounded">
                      {detail.version_new_label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    {formatDateTime(detail.created_at)}
                  </div>
                  <div className="text-sm">ID: {detail.id}</div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3">
                <div className="text-right">
                  <div className="text-sm text-slate-500 mb-1">ระดับความเสี่ยง</div>
                  <div className={`text-lg font-bold ${
                    detail.overall_risk_level?.includes('HIGH') ? 'text-red-600' :
                    detail.overall_risk_level?.includes('MEDIUM') ? 'text-amber-600' :
                    'text-emerald-600'
                  }`}>
                    {detail.overall_risk_level || 'ไม่ระบุ'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500 mb-1">การเปลี่ยนแปลง</div>
                  <div className="text-lg font-bold text-blue-600">
                    {detail.changes.length} จุด
                  </div>
                </div>
              </div>
            </div>

            {/* AI Annotate Error */}
            {annotateError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0" />
                  {annotateError}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              สรุปผลการเปรียบเทียบ
            </h2>
            <div className="prose max-w-none">
              <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                {detail.summary_text || "ไม่มีข้อความสรุปสำหรับการเปรียบเทียบนี้"}
              </p>
            </div>
          </div>
        </div>

        {/* Changes List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <DocumentMagnifyingGlassIcon className="h-6 w-6 text-violet-600" />
            รายการการเปลี่ยนแปลง ({detail.changes.length} รายการ)
          </h2>

          <div className="space-y-4">
            {detail.changes.map((change) => (
              <div
                key={change.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                {/* Change Header */}
                <div className="border-b border-slate-100 p-4 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {changeTypeBadge(change.change_type)}
                    <span className="text-sm font-medium text-slate-700">
                      {change.section_label || "ไม่มีหัวข้อ"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {riskBadge(change.risk_level)}
                    <span className="text-xs text-slate-500">ID: {change.id}</span>
                  </div>
                </div>

                {/* Change Content */}
                <div className="p-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {/* Old Text */}
                    <div>
                      <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        เวอร์ชันเก่า
                      </div>
                      <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                        <p className="text-sm text-red-800 whitespace-pre-wrap line-through">
                          {change.old_text || "ไม่มีข้อความ"}
                        </p>
                      </div>
                    </div>

                    {/* New Text */}
                    <div>
                      <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        เวอร์ชันใหม่
                      </div>
                      <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                        <p className="text-sm text-emerald-800 whitespace-pre-wrap">
                          {change.new_text || "ไม่มีข้อความ"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* AI Comment */}
                    <div>
                      <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        ความคิดเห็นจาก AI
                      </div>
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                        <p className="text-sm text-blue-800 whitespace-pre-wrap">
                         {typeof change.ai_comment === "string" &&
                        change.ai_comment.trim().length > 0
                                ? change.ai_comment
                            : "AI ยังไม่ได้แสดงความคิดเห็น"}

                        </p>
                      </div>
                    </div>

                    {/* AI Suggestion */}
                    <div>
                      <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-2">
                        <LightBulbIcon className="h-4 w-4 text-amber-500" />
                        คำแนะนำจาก AI
                      </div>
                      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                        <p className="text-sm text-amber-800 whitespace-pre-wrap">
                         {typeof change.ai_suggestion === "string" &&
                            change.ai_suggestion.trim().length > 0
                                ? change.ai_suggestion
                                : "AI ยังไม่ได้ให้คำแนะนำ"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}