// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import {
//   ClockIcon,
//   DocumentMagnifyingGlassIcon,
//   ArrowPathIcon,
//   ExclamationTriangleIcon,
//   ChevronRightIcon,
//   ChevronLeftIcon,
//   DocumentTextIcon,
// } from "@heroicons/react/24/outline";

// type ComparisonItem = {
//   id: number;
//   document_name: string;
//   version_old_label: string;
//   version_new_label: string;
//   created_at: string;
//   overall_risk_level?: string | null;
// };

// type ChangeType = "ADDED" | "REMOVED" | "MODIFIED";

// type ChangeItem = {
//   id: number;
//   change_type: ChangeType;
//   section_label: string | null;
//   old_text: string | null;
//   new_text: string | null;
//   risk_level?: "LOW" | "MEDIUM" | "HIGH" | null;
//   ai_comment?: string | null;
//   ai_suggestion?: string | null;
// };

// type ComparisonDetail = {
//   id: number;
//   document_name: string;
//   version_old_label: string;
//   version_new_label: string;
//   created_at: string;
//   overall_risk_level?: string | null;
//   summary_text?: string | null;
//   changes: ChangeItem[];
// };

// // --- helper UI ---

// const riskBadge = (risk?: string | null) => {
//   const base =
//     "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border";
//   const level = (risk || "LOW").toUpperCase();

//   if (level === "HIGH") {
//     return (
//       <span className={`${base} bg-red-100 text-red-700 border-red-200`}>
//         HIGH
//       </span>
//     );
//   }
//   if (level === "MEDIUM") {
//     return (
//       <span className={`${base} bg-amber-100 text-amber-700 border-amber-200`}>
//         MEDIUM
//       </span>
//     );
//   }
//   return (
//     <span
//       className={`${base} bg-emerald-100 text-emerald-700 border-emerald-200`}
//     >
//       LOW
//     </span>
//   );
// };

// const changeTypeBadge = (t: ChangeType) => {
//   const base =
//     "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold";
//   if (t === "ADDED") {
//     return (
//       <span className={`${base} bg-emerald-100 text-emerald-700`}>＋ ADDED</span>
//     );
//   }
//   if (t === "REMOVED") {
//     return (
//       <span className={`${base} bg-rose-100 text-rose-700`}>− REMOVED</span>
//     );
//   }
//   return (
//     <span className={`${base} bg-amber-100 text-amber-700`}>MODIFIED</span>
//   );
// };

// const formatDateTime = (iso: string) => {
//   try {
//     const d = new Date(iso);
//     return d.toLocaleString("th-TH", {
//       year: "numeric",
//       month: "short",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   } catch {
//     return iso;
//   }
// };

// const truncate = (text: string | null | undefined, len = 180) => {
//   if (!text) return "";
//   return text.length > len ? text.slice(0, len) + "..." : text;
// };

// const API_BASE = "http://127.0.0.1:8000";

// // 🆕 AI Comment box (left column)
// function AiCommentBox({ comment }: { comment?: string | null }) {
//   return (
//     <div className="rounded-lg border border-slate-100 bg-white/80 p-3 min-h-[64px]">
//       <div className="text-[11px] font-semibold text-slate-600 mb-1">
//         AI Comment
//       </div>
//       <div className="text-[12px] text-slate-800 whitespace-pre-wrap min-h-[44px]">
//         {comment ? (
//           comment
//         ) : (
//           <span className="text-slate-400">ยังไม่มีความคิดเห็นจาก AI</span>
//         )}
//       </div>
//     </div>
//   );
// }

// // 🆕 AI Suggestion box (right column)
// function AiSuggestionBox({ suggestion }: { suggestion?: string | null }) {
//   return (
//     <div className="rounded-lg border border-slate-100 bg-gradient-to-r from-white to-slate-50 p-3 min-h-[64px]">
//       <div className="flex items-start gap-3">
//         <div className="flex-shrink-0">
//           <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
//             AI
//           </span>
//         </div>
//         <div className="min-w-0">
//           <div className="text-[11px] font-semibold text-slate-600">
//             AI Suggestion
//           </div>
//           <div className="mt-1 text-[12px] text-slate-800 whitespace-pre-wrap min-h-[44px]">
//             {suggestion ? (
//               suggestion
//             ) : (
//               <span className="text-slate-400">ยังไม่มีคำแนะนำจาก AI</span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function HistoryPage() {
//   const [items, setItems] = useState<ComparisonItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [selectedId, setSelectedId] = useState<number | null>(null);
//   const [detail, setDetail] = useState<ComparisonDetail | null>(null);
//   const [detailLoading, setDetailLoading] = useState(false);
//   const [detailError, setDetailError] = useState<string | null>(null);

//   // 🆕 state สำหรับเรียก AI annotate
//   const [annotating, setAnnotating] = useState(false);
//   const [annotateError, setAnnotateError] = useState<string | null>(null);

//   // โหลด list ครั้งแรก
//   useEffect(() => {
//     const fetchList = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await fetch(`${API_BASE}/comparisons?limit=50`);
//         if (!res.ok) {
//           const data = await res.json().catch(() => ({}));
//           throw new Error(
//             data.detail || `โหลดรายการไม่สำเร็จ (status ${res.status})`
//           );
//         }
//         const data: ComparisonItem[] = await res.json();
//         setItems(data);
//         if (data.length > 0) {
//           setSelectedId(data[0].id);
//         }
//       } catch (err: any) {
//         setError(err.message || "เกิดข้อผิดพลาดขณะโหลดรายการ");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchList();
//   }, []);

//   // ฟังก์ชันโหลด detail แยก เพื่อ reuse หลัง annotate
//   const loadDetail = async (id: number) => {
//     setDetailLoading(true);
//     setDetailError(null);
//     try {
//       const res = await fetch(`${API_BASE}/comparisons/${id}`);
//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         throw new Error(
//           data.detail || `โหลดรายละเอียดไม่สำเร็จ (status ${res.status})`
//         );
//       }
//       const data: ComparisonDetail = await res.json();
//       setDetail(data);
//     } catch (err: any) {
//       setDetailError(err.message || "เกิดข้อผิดพลาดขณะโหลดรายละเอียด");
//       setDetail(null);
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   // โหลด detail เมื่อ selectedId เปลี่ยน
//   useEffect(() => {
//     if (!selectedId) {
//       setDetail(null);
//       return;
//     }
//     loadDetail(selectedId);
//   }, [selectedId]);

//   // 🆕 ฟังก์ชันให้ AI วิเคราะห์ (เรียก /annotate แล้วรีโหลด detail)
//   const handleAnnotate = async () => {
//     if (!selectedId) return;
//     setAnnotating(true);
//     setAnnotateError(null);
//     try {
//       const res = await fetch(
//         `${API_BASE}/comparisons/${selectedId}/annotate`,
//         {
//           method: "POST",
//           headers: {
//             Accept: "application/json",
//           },
//         }
//       );
//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         throw new Error(
//           data.detail ||
//             `เรียก AI วิเคราะห์ไม่สำเร็จ (status ${res.status})`
//         );
//       }

//       // reload detail เพื่อดึง ai_comment และ ai_suggestion ล่าสุด
//       await loadDetail(selectedId);
//     } catch (err: any) {
//       setAnnotateError(
//         err.message || "เกิดข้อผิดพลาดขณะให้ AI วิเคราะห์การเปลี่ยนแปลง"
//       );
//     } finally {
//       setAnnotating(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-[#f6e9ff] via-[#f7f0ff] to-[#e3d4ff] flex items-center justify-center px-4 py-8">
//       <div className="w-full max-w-6xl">
//         <div className="relative overflow-hidden rounded-3xl bg-white/80 shadow-2xl border border-white/60 backdrop-blur-md">
//           {/* bubble decoration */}
//           <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-fuchsia-300/20 blur-3xl" />
//           <div className="pointer-events-none absolute -left-24 -bottom-32 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl" />

//           {/* gradient bar */}
//           <div className="h-2 w-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-pink-400" />

//           <div className="relative z-10 p-6 md:p-8 space-y-6">
//             {/* header */}
//             <div className="flex items-center justify-between gap-3 flex-wrap">
//               <div className="flex items-center gap-3">
//                 <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-pink-400 text-white shadow-lg">
//                   <ClockIcon className="h-6 w-6" />
//                 </div>
//                 <div>
//                   <p className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 border border-violet-100 mb-1">
//                     <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[9px] text-white">
//                       AI
//                     </span>
//                     Document Compare History
//                   </p>
//                   <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
//                     ประวัติการเปรียบเทียบเอกสาร
//                   </h1>
//                   <p className="text-xs md:text-sm text-slate-600">
//                     ดูรายการเปรียบเทียบย้อนหลัง เลือก run ที่สนใจ
//                     เพื่อดูสรุปและรายการการเปลี่ยนแปลงแบบละเอียด
//                   </p>
//                 </div>
//               </div>

//               <Link
//                 href="/"
//                 className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
//               >
//                 <ChevronLeftIcon className="h-4 w-4 text-slate-500" />
//                 กลับไปหน้าเปรียบเทียบ
//               </Link>
//             </div>

//             {/* main grid */}
//             <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">
//               {/* left: list */}
//               <section className="rounded-2xl border border-slate-100 bg-white/95 shadow-sm p-4 space-y-3">
//                 <div className="flex items-center justify-between gap-2 mb-1">
//                   <p className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
//                     <DocumentMagnifyingGlassIcon className="h-4 w-4 text-violet-500" />
//                     รายการเปรียบเทียบล่าสุด
//                   </p>
//                   <span className="text-[11px] text-slate-400">
//                     ทั้งหมด {items.length} รายการ
//                   </span>
//                 </div>

//                 {loading ? (
//                   <div className="flex items-center justify-center gap-2 py-10 text-xs text-slate-500">
//                     <ArrowPathIcon className="h-4 w-4 animate-spin text-violet-500" />
//                     กำลังโหลดรายการ...
//                   </div>
//                 ) : error ? (
//                   <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50/80 px-3 py-2.5 text-xs text-red-700">
//                     <ExclamationTriangleIcon className="mt-0.5 h-4 w-4" />
//                     <p>{error}</p>
//                   </div>
//                 ) : items.length === 0 ? (
//                   <p className="text-xs text-slate-500 py-4">
//                     ยังไม่มีประวัติการเปรียบเทียบ ลองกลับไปหน้าแรกแล้ว
//                     รันการเปรียบเทียบสักหนึ่งครั้งก่อน
//                   </p>
//                 ) : (
//                   <div className="space-y-2 max-h-[420px] overflow-auto pr-1">
//                     {items.map((it) => (
//                       <button
//                         key={it.id}
//                         type="button"
//                         onClick={() => setSelectedId(it.id)}
//                         className={`w-full text-left rounded-xl border px-3 py-2.5 text-xs transition-all flex items-center justify-between gap-2 ${
//                           selectedId === it.id
//                             ? "border-violet-300 bg-violet-50 shadow-sm"
//                             : "border-slate-100 bg-slate-50/70 hover:bg-slate-100"
//                         }`}
//                       >
//                         <div className="flex-1 min-w-0">
//                           <p className="font-semibold text-slate-900 truncate flex items-center gap-1.5">
//                             {it.document_name}
//                           </p>
//                           <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
//                             <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-violet-100 text-[9px] text-violet-700">
//                               v1
//                             </span>
//                             {it.version_old_label}
//                             <span className="text-slate-400">→</span>
//                             <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-fuchsia-100 text-[9px] text-fuchsia-700">
//                               v2
//                             </span>
//                             {it.version_new_label}
//                           </p>
//                           <p className="text-[11px] text-slate-400">
//                             {formatDateTime(it.created_at)}
//                           </p>
//                         </div>
//                         <div className="flex flex-col items-end gap-1">
//                           {riskBadge(it.overall_risk_level)}
//                           <ChevronRightIcon className="h-3.5 w-3.5 text-slate-300" />
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </section>

//               {/* right: detail */}
//               <section className="rounded-2xl border border-slate-100 bg-white/95 shadow-sm p-4 md:p-5 space-y-4 min-h-[260px]">
//                 {!selectedId ? (
//                   <div className="flex h-full items-center justify-center text-xs text-slate-500">
//                     เลือก run จากด้านซ้ายเพื่อดูรายละเอียด
//                   </div>
//                 ) : detailLoading ? (
//                   <div className="flex h-full items-center justify-center gap-2 text-xs text-slate-500">
//                     <ArrowPathIcon className="h-4 w-4 animate-spin text-violet-500" />
//                     กำลังโหลดรายละเอียด...
//                   </div>
//                 ) : detailError ? (
//                   <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50/80 px-3 py-2.5 text-xs text-red-700">
//                     <ExclamationTriangleIcon className="mt-0.5 h-4 w-4" />
//                     <p>{detailError}</p>
//                   </div>
//                 ) : !detail ? (
//                   <p className="text-xs text-slate-500">
//                     ไม่พบข้อมูลรายละเอียดของ run นี้
//                   </p>
//                 ) : (
//                   <>
//                     {/* header detail */}
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="space-y-1">
//                         <p className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
//                           <DocumentTextIcon className="h-4 w-4 text-violet-500" />
//                           รายละเอียดย้อนหลัง
//                         </p>
//                         <p className="text-sm font-semibold text-slate-900">
//                           {detail.document_name}
//                         </p>
//                         <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
//                           จาก{" "}
//                           <span className="font-medium text-violet-700">
//                             {detail.version_old_label}
//                           </span>{" "}
//                           →{" "}
//                           <span className="font-medium text-fuchsia-700">
//                             {detail.version_new_label}
//                           </span>
//                           <span className="text-slate-400">•</span>
//                           {formatDateTime(detail.created_at)}
//                         </p>
//                       </div>
//                       <div className="flex flex-col items-end gap-2">
//                         {/* ปุ่มให้ AI วิเคราะห์ */}
//                         <button
//                           type="button"
//                           onClick={handleAnnotate}
//                           disabled={annotating}
//                           className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[11px] font-medium text-violet-700 hover:bg-violet-100 disabled:opacity-60 disabled:cursor-not-allowed"
//                         >
//                           {annotating ? (
//                             <>
//                               <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
//                               กำลังให้ AI วิเคราะห์...
//                             </>
//                           ) : (
//                             <>ให้ AI วิเคราะห์การเปลี่ยนแปลง</>
//                           )}
//                         </button>

//                         <div className="flex flex-col items-end gap-0.5">
//                           <span className="text-[11px] text-slate-400">
//                             Overall Risk
//                           </span>
//                           {riskBadge(detail.overall_risk_level)}
//                         </div>
//                       </div>
//                     </div>

//                     {/* แสดง error จาก AI ถ้ามี */}
//                     {annotateError && (
//                       <div className="text-[11px] text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
//                         {annotateError}
//                       </div>
//                     )}

//                     {/* summary text */}
//                     <div className="space-y-1.5">
//                       <p className="text-xs font-semibold text-slate-800">
//                         สรุปจาก AI
//                       </p>
//                       <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 max-h-40 overflow-auto text-xs text-slate-700 whitespace-pre-wrap">
//                         {detail.summary_text ||
//                           "ไม่มีข้อความสรุปสำหรับการเปรียบเทียบนี้"}
//                       </div>
//                     </div>

//                     {/* changes list */}
//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between gap-2">
//                         <p className="text-xs font-semibold text-slate-900">
//                           รายการการเปลี่ยนแปลง ({detail.changes.length})
//                         </p>
//                         <span className="text-[11px] text-slate-400">
//                           แสดงข้อความย่อ (ไม่ใช่ diff เต็ม)
//                         </span>
//                       </div>

//                       {detail.changes.length === 0 ? (
//                         <p className="text-[11px] text-slate-500">
//                           ไม่พบรายการการเปลี่ยนแปลงใน run นี้
//                         </p>
//                       ) : (
//                         <div className="space-y-2 max-h-[280px] overflow-auto pr-1">
//                           {detail.changes.map((c) => (
//                             <div
//                               key={c.id}
//                               className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 text-xs space-y-3"
//                             >
//                               <div className="flex items-center justify-between gap-2">
//                                 <div className="flex items-center gap-2">
//                                   {changeTypeBadge(c.change_type)}
//                                   <span className="text-[11px] text-slate-500">
//                                     {c.section_label || "-"}
//                                   </span>
//                                 </div>
//                                 {riskBadge(c.risk_level)}
//                               </div>

//                               <div className="grid gap-2 md:grid-cols-2">
//                                 <div>
//                                   <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
//                                     Old Text
//                                   </p>
//                                   <p className="rounded-md bg-rose-50/80 text-rose-900 px-2 py-1 whitespace-pre-wrap line-through">
//                                     {truncate(c.old_text)}
//                                   </p>
//                                 </div>
//                                 <div>
//                                   <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
//                                     New Text
//                                   </p>
//                                   <p className="rounded-md bg-emerald-50/80 text-emerald-900 px-2 py-1 whitespace-pre-wrap">
//                                     {truncate(c.new_text)}
//                                   </p>
//                                 </div>
//                               </div>

//                               {/* --- แยก 2 คอลัมน์: AI Comment | AI Suggestion --- */}
//                            <div className="mt-1 grid gap-3 md:grid-cols-2">
//                                 <AiCommentBox comment={c.ai_comment} />
//                               <AiSuggestionBox
//                            suggestion={
//                               c.ai_suggestion
//                              ? c.ai_suggestion
//                             : "AI ยังไม่สามารถให้คำแนะนำได้ในรายการนี้"} />
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </section>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

// app/history/page.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ClockIcon,
  DocumentMagnifyingGlassIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  TrashIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  TagIcon,
  CalendarIcon,
  ChevronUpDownIcon
} from "@heroicons/react/24/outline";

type ComparisonItem = {
  id: number;
  document_name: string;
  version_old_label: string;
  version_new_label: string;
  created_at: string;
  overall_risk_level?: string | null;
  changes_count?: number;
};

const API_BASE = "http://127.0.0.1:8000";

type SortField = "name" | "date" | "risk" | "changes";
type SortDirection = "asc" | "desc";
type DateFilter = "ALL" | "TODAY" | "WEEK" | "MONTH";

export default function HistoryPage() {
  // Core states
  const [items, setItems] = useState<ComparisonItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // 🔍 Search & Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("ALL");
  const [filterDateRange, setFilterDateRange] = useState<DateFilter>("ALL");
  const [showFilters, setShowFilters] = useState(false);

  // 📊 Sorting states
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // 🗑️ Bulk operations
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // 📈 Statistics
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      total: items.length,
      highRisk: items.filter(i => i.overall_risk_level === "HIGH").length,
      mediumRisk: items.filter(i => i.overall_risk_level === "MEDIUM").length,
      lowRisk: items.filter(i => i.overall_risk_level === "LOW").length,
      today: items.filter(i => new Date(i.created_at) >= today).length,
      thisWeek: items.filter(i => new Date(i.created_at) >= weekAgo).length,
      thisMonth: items.filter(i => new Date(i.created_at) >= monthAgo).length
    };
  }, [items]);

  // 🔄 Load data
  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/comparisons?limit=100`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.detail || 
          `ไม่สามารถโหลดข้อมูลได้ (รหัส ${res.status}). 
          ตรวจสอบว่า API server กำลังรันอยู่ที่ ${API_BASE}`
        );
      }
      const data: ComparisonItem[] = await res.json();
      setItems(data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter(item => {
      // Search filter
      if (searchTerm && !item.document_name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Risk filter
      if (filterRisk !== "ALL" && item.overall_risk_level !== filterRisk) {
        return false;
      }
      
      // Date filter
      if (filterDateRange !== "ALL") {
        const itemDate = new Date(item.created_at);
        const now = new Date();
        const diffTime = now.getTime() - itemDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (filterDateRange === "TODAY" && diffDays > 0) return false;
        if (filterDateRange === "WEEK" && diffDays > 7) return false;
        if (filterDateRange === "MONTH" && diffDays > 30) return false;
      }
      
      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortField) {
        case "name":
          aVal = a.document_name.toLowerCase();
          bVal = b.document_name.toLowerCase();
          break;
        case "date":
          aVal = new Date(a.created_at).getTime();
          bVal = new Date(b.created_at).getTime();
          break;
        case "risk":
          const riskOrder = { "HIGH": 3, "MEDIUM": 2, "LOW": 1 };
          aVal = riskOrder[a.overall_risk_level as keyof typeof riskOrder] || 0;
          bVal = riskOrder[b.overall_risk_level as keyof typeof riskOrder] || 0;
          break;
        case "changes":
          aVal = a.changes_count || 0;
          bVal = b.changes_count || 0;
          break;
        default:
          return 0;
      }
      
      return sortDirection === "asc" 
        ? (aVal > bVal ? 1 : -1)
        : (aVal < bVal ? 1 : -1);
    });

    return filtered;
  }, [items, searchTerm, filterRisk, filterDateRange, sortField, sortDirection]);

  // 🗑️ Delete single item
  const deleteItem = async (id: number) => {
    if (!confirm("คุณต้องการลบรายการนี้ใช่หรือไม่?")) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/comparisons/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        throw new Error("ลบไม่สำเร็จ");
      }
      
      // Remove from UI
      setItems(prev => prev.filter(item => item.id !== id));
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    } catch (err: any) {
      alert("ลบไม่สำเร็จ: " + (err.message || "โปรดลองอีกครั้ง"));
    } finally {
      setDeletingId(null);
    }
  };

  // 🗑️ Bulk delete
  const deleteSelected = async () => {
    if (!selectedItems.length || 
        !confirm(`คุณต้องการลบ ${selectedItems.length} รายการที่เลือกใช่หรือไม่?`)) return;
    
    try {
      const promises = selectedItems.map(id =>
        fetch(`${API_BASE}/comparisons/${id}`, { method: "DELETE" })
          .then(res => res.ok ? { success: true, id } : { success: false, id })
      );
      
      const results = await Promise.all(promises);
      const failed = results.filter(r => !r.success);
      
      if (failed.length > 0) {
        alert(`ลบ ${failed.length} รายการไม่สำเร็จ`);
      }
      
      // Refresh list
      fetchList();
      setSelectedItems([]);
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการลบหลายรายการ");
    }
  };

  // 📋 Bulk selection
  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const selectAllVisible = () => {
    const visibleIds = filteredAndSortedItems.map(item => item.id);
    if (selectedItems.length === visibleIds.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(visibleIds);
    }
  };

  // 📊 Export functions
  const exportToCSV = () => {
    const headers = ["ID", "Document Name", "Version Old", "Version New", "Created At", "Risk Level", "Changes Count"];
    
    const csvRows = [
      headers.join(","),
      ...filteredAndSortedItems.map(item => [
        item.id,
        `"${item.document_name.replace(/"/g, '""')}"`,
        item.version_old_label,
        item.version_new_label,
        new Date(item.created_at).toISOString(),
        item.overall_risk_level || "N/A",
        item.changes_count || 0
      ].join(","))
    ];
    
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `document_comparisons_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(filteredAndSortedItems, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `document_comparisons_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // 🔄 Sorting handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // 📅 Format date
  const formatDate = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleDateString('th-TH', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  // 📈 Risk badge
  const RiskBadge = ({ risk }: { risk?: string | null }) => {
    const base = "px-2 py-1 rounded-full text-xs font-medium";
    const level = risk || "UNKNOWN";
    
    if (level.includes("HIGH")) {
      return <span className={`${base} bg-red-100 text-red-700`}>สูง</span>;
    }
    if (level.includes("MEDIUM")) {
      return <span className={`${base} bg-amber-100 text-amber-700`}>กลาง</span>;
    }
    if (level.includes("LOW")) {
      return <span className={`${base} bg-emerald-100 text-emerald-700`}>ต่ำ</span>;
    }
    return <span className={`${base} bg-slate-100 text-slate-600`}>ไม่ระบุ</span>;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                  <ClockIcon className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    ประวัติการเปรียบเทียบเอกสาร
                  </h1>
                  <p className="text-slate-600 mt-1">
                    จัดการและค้นหาประวัติการเปรียบเทียบทั้งหมดของคุณ
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={exportToCSV}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-100 font-medium"
              >
                <DocumentArrowDownIcon className="h-4 w-4" />
                Export CSV
              </button>
              <button
                onClick={exportToJSON}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 font-medium"
              >
                <DocumentArrowDownIcon className="h-4 w-4" />
                Export JSON
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 font-medium"
              >
                <DocumentMagnifyingGlassIcon className="h-4 w-4" />
                เปรียบเทียบใหม่
              </Link>
            </div>
          </div>
        </div>

        {/* 📊 Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-slate-600 flex items-center gap-2 mt-1">
              <TagIcon className="h-4 w-4" />
              ทั้งหมด
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-2xl font-bold text-red-600">{stats.highRisk}</div>
            <div className="text-sm text-slate-600">ความเสี่ยงสูง</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-2xl font-bold text-amber-600">{stats.mediumRisk}</div>
            <div className="text-sm text-slate-600">ความเสี่ยงกลาง</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">{stats.lowRisk}</div>
            <div className="text-sm text-slate-600">ความเสี่ยงต่ำ</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-2xl font-bold text-slate-600">{stats.thisWeek}</div>
            <div className="text-sm text-slate-600 flex items-center gap-2 mt-1">
              <CalendarIcon className="h-4 w-4" />
              สัปดาห์นี้
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-2xl font-bold text-slate-600">{stats.today}</div>
            <div className="text-sm text-slate-600">วันนี้</div>
          </div>
        </div>

        {/* 🔍 Search & Filter Bar */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                    showFilters 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'bg-slate-50 text-slate-700 border border-slate-200'
                  }`}
                >
                  <FunnelIcon className="h-4 w-4" />
                  {showFilters ? 'ซ่อนตัวกรอง' : 'แสดงตัวกรอง'}
                </button>
                <div className="text-sm text-slate-600">
                  แสดง <span className="font-bold">{filteredAndSortedItems.length}</span> จาก {items.length} รายการ
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchList}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium disabled:opacity-50"
                >
                  <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  รีเฟรช
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search Input */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      ค้นหาเอกสาร
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="พิมพ์ชื่อเอกสาร..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    </div>
                  </div>

                  {/* Risk Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      ระดับความเสี่ยง
                    </label>
                    <select
                      value={filterRisk}
                      onChange={(e) => setFilterRisk(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="ALL">ทั้งหมด</option>
                      <option value="HIGH">สูง</option>
                      <option value="MEDIUM">กลาง</option>
                      <option value="LOW">ต่ำ</option>
                    </select>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      ช่วงเวลา
                    </label>
                    <select
                      value={filterDateRange}
                      onChange={(e) => setFilterDateRange(e.target.value as DateFilter)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="ALL">ทุกเวลา</option>
                      <option value="TODAY">วันนี้</option>
                      <option value="WEEK">สัปดาห์นี้</option>
                      <option value="MONTH">เดือนนี้</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🗑️ Bulk Actions Bar */}
        {selectedItems.length > 0 && (
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">
                  {selectedItems.length}
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">
                    เลือก {selectedItems.length} รายการ
                  </h3>
                  <p className="text-sm text-blue-700">
                    คุณสามารถดำเนินการกับรายการที่เลือกทั้งหมดพร้อมกัน
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={deleteSelected}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  <TrashIcon className="h-4 w-4" />
                  ลบที่เลือก
                </button>
                <button
                  onClick={() => setSelectedItems([])}
                  className="px-3 py-1.5 text-sm text-blue-700 hover:text-blue-900"
                >
                  ยกเลิกการเลือกทั้งหมด
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 📋 Main Content Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="border-b border-slate-200 p-4 grid grid-cols-12 gap-4 text-sm font-semibold text-slate-700 bg-slate-50">
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={selectedItems.length > 0 && 
                         selectedItems.length === filteredAndSortedItems.length}
                onChange={selectAllVisible}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div 
              className="col-span-4 flex items-center gap-1 cursor-pointer hover:text-blue-600 select-none"
              onClick={() => handleSort("name")}
            >
              ชื่อเอกสาร
              {sortField === "name" && (
                sortDirection === "asc" ? 
                <ArrowUpIcon className="h-3 w-3" /> : 
                <ArrowDownIcon className="h-3 w-3" />
              )}
            </div>
            <div className="col-span-2">เวอร์ชัน</div>
            <div 
              className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-blue-600 select-none"
              onClick={() => handleSort("date")}
            >
              วันที่เปรียบเทียบ
              {sortField === "date" && (
                sortDirection === "asc" ? 
                <ArrowUpIcon className="h-3 w-3" /> : 
                <ArrowDownIcon className="h-3 w-3" />
              )}
            </div>
            <div 
              className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-blue-600 select-none"
              onClick={() => handleSort("risk")}
            >
              ระดับความเสี่ยง
              {sortField === "risk" && (
                sortDirection === "asc" ? 
                <ArrowUpIcon className="h-3 w-3" /> : 
                <ArrowDownIcon className="h-3 w-3" />
              )}
            </div>
            <div className="col-span-1 text-right">การดำเนินการ</div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-8 text-center">
              <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto text-blue-600" />
              <p className="mt-4 text-slate-600 font-medium">กำลังโหลดข้อมูล...</p>
              <p className="text-sm text-slate-500 mt-1">กรุณารอสักครู่</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-8 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                <ExclamationTriangleIcon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">ไม่สามารถโหลดข้อมูล</h3>
              <p className="text-slate-600 mb-4 max-w-md mx-auto">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={fetchList}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  ลองอีกครั้ง
                </button>
                <Link
                  href="/"
                  className="px-4 py-2 bg-slate-100 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-200 font-medium"
                >
                  ไปเปรียบเทียบเอกสารใหม่
                </Link>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredAndSortedItems.length === 0 && (
            <div className="p-8 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                <DocumentMagnifyingGlassIcon className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">
                {items.length === 0 ? "ยังไม่มีประวัติการเปรียบเทียบ" : "ไม่พบผลลัพธ์"}
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                {items.length === 0 
                  ? "เริ่มต้นด้วยการเปรียบเทียบเอกสารสองเวอร์ชันเพื่อสร้างประวัติแรกของคุณ" 
                  : "ลองเปลี่ยนคำค้นหาหรือตัวกรองเพื่อดูผลลัพธ์อื่นๆ"}
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:opacity-90"
              >
                <DocumentMagnifyingGlassIcon className="h-5 w-5" />
                ไปเปรียบเทียบเอกสาร
              </Link>
            </div>
          )}

          {/* Data Rows */}
          {!loading && !error && filteredAndSortedItems.length > 0 && (
            <div className="divide-y divide-slate-100">
              {filteredAndSortedItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-4 grid grid-cols-12 gap-4 items-center transition-colors ${
                    selectedItems.includes(item.id) 
                      ? 'bg-blue-50' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Checkbox */}
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  {/* Document Name */}
                  <div className="col-span-4">
                    <div className="font-medium text-slate-900 line-clamp-1">
                      {item.document_name}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                        ID: {item.id}
                      </span>
                      {item.changes_count !== undefined && (
                        <span className="text-xs px-1.5 py-0.5 bg-violet-100 text-violet-700 rounded">
                          {item.changes_count} การเปลี่ยนแปลง
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Versions */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded">
                        {item.version_old_label}
                      </span>
                      <span className="text-slate-400">→</span>
                      <span className="px-2 py-1 bg-fuchsia-100 text-fuchsia-700 text-xs font-medium rounded">
                        {item.version_new_label}
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="col-span-2">
                    <div className="text-sm text-slate-900 font-medium">
                      {formatDate(item.created_at)}
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div className="col-span-2">
                    <RiskBadge risk={item.overall_risk_level} />
                  </div>

                  {/* Actions */}
                  <div className="col-span-1">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/compare/${item.id}`}
                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="ดูรายละเอียด"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => deleteItem(item.id)}
                        disabled={deletingId === item.id}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="ลบรายการ"
                      >
                        {deletingId === item.id ? (
                          <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        ) : (
                          <TrashIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {!loading && !error && filteredAndSortedItems.length > 0 && (
            <div className="border-t border-slate-200 p-4 bg-slate-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-sm text-slate-600">
                  แสดง <span className="font-medium">{filteredAndSortedItems.length}</span> รายการ
                  {searchTerm && ` สำหรับ "${searchTerm}"`}
                </div>
                <div className="text-sm text-slate-600">
                  เรียงตาม: 
                  <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value as SortField)}
                    className="ml-2 px-2 py-1 border border-slate-300 rounded text-sm"
                  >
                    <option value="date">วันที่ (ล่าสุด)</option>
                    <option value="name">ชื่อเอกสาร</option>
                    <option value="risk">ระดับความเสี่ยง</option>
                    <option value="changes">จำนวนการเปลี่ยนแปลง</option>
                  </select>
                  <select
                    value={sortDirection}
                    onChange={(e) => setSortDirection(e.target.value as SortDirection)}
                    className="ml-2 px-2 py-1 border border-slate-300 rounded text-sm"
                  >
                    <option value="desc">จากมากไปน้อย</option>
                    <option value="asc">จากน้อยไปมาก</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}