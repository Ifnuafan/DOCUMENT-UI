module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/history/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
__turbopack_context__.s([
    "default",
    ()=>CompareDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowLeftIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeftIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ArrowLeftIcon.js [app-ssr] (ecmascript) <export default as ArrowLeftIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$DocumentTextIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DocumentTextIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/DocumentTextIcon.js [app-ssr] (ecmascript) <export default as DocumentTextIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ClockIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClockIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ClockIcon.js [app-ssr] (ecmascript) <export default as ClockIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowPathIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowPathIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ArrowPathIcon.js [app-ssr] (ecmascript) <export default as ArrowPathIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ExclamationTriangleIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExclamationTriangleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ExclamationTriangleIcon.js [app-ssr] (ecmascript) <export default as ExclamationTriangleIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$DocumentMagnifyingGlassIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DocumentMagnifyingGlassIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/DocumentMagnifyingGlassIcon.js [app-ssr] (ecmascript) <export default as DocumentMagnifyingGlassIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$SparklesIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SparklesIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/SparklesIcon.js [app-ssr] (ecmascript) <export default as SparklesIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$LightBulbIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LightBulbIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/LightBulbIcon.js [app-ssr] (ecmascript) <export default as LightBulbIcon>");
"use client";
;
;
;
;
;
function CompareDetailPage() {
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const id = params.id;
    const [detail, setDetail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [annotating, setAnnotating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [annotateError, setAnnotateError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const API_BASE = "http://127.0.0.1:8000";
    /* =====================
     Effects
  ===================== */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (id) loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        id
    ]);
    /* =====================
     Data loaders
  ===================== */ const loadDetail = async ()=>{
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`${API_BASE}/comparisons/${id}`);
            if (!res.ok) throw new Error(`Failed to load (${res.status})`);
            const data = await res.json();
            setDetail(data);
        } catch (err) {
            setError(err.message || "Unknown error");
            setDetail(null);
        } finally{
            setLoading(false);
        }
    };
    const handleAnnotate = async ()=>{
        try {
            setAnnotating(true);
            setAnnotateError(null);
            const res = await fetch(`${API_BASE}/comparisons/${id}/annotate`, {
                method: "POST"
            });
            if (!res.ok) throw new Error(`Annotation failed (${res.status})`);
            await loadDetail();
        } catch (err) {
            setAnnotateError(err.message || "Annotation error");
        } finally{
            setAnnotating(false);
        }
    };
    /* =====================
     Helpers
  ===================== */ const formatDateTime = (iso)=>new Date(iso).toLocaleString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    const riskBadge = (risk)=>{
        const base = "px-2 py-1 rounded-full text-xs font-semibold";
        const level = (risk || "LOW").toUpperCase();
        if (level === "HIGH") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `${base} bg-red-100 text-red-700`,
            children: "HIGH"
        }, void 0, false, {
            fileName: "[project]/app/history/page.tsx",
            lineNumber: 678,
            columnNumber: 14
        }, this);
        if (level === "MEDIUM") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `${base} bg-amber-100 text-amber-700`,
            children: "MEDIUM"
        }, void 0, false, {
            fileName: "[project]/app/history/page.tsx",
            lineNumber: 680,
            columnNumber: 14
        }, this);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `${base} bg-emerald-100 text-emerald-700`,
            children: "LOW"
        }, void 0, false, {
            fileName: "[project]/app/history/page.tsx",
            lineNumber: 682,
            columnNumber: 12
        }, this);
    };
    const changeTypeBadge = (type)=>{
        const base = "px-2 py-1 rounded text-xs font-medium";
        if (type === "ADDED") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `${base} bg-emerald-100 text-emerald-700`,
            children: "+ ADDED"
        }, void 0, false, {
            fileName: "[project]/app/history/page.tsx",
            lineNumber: 689,
            columnNumber: 14
        }, this);
        if (type === "REMOVED") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `${base} bg-red-100 text-red-700`,
            children: "- REMOVED"
        }, void 0, false, {
            fileName: "[project]/app/history/page.tsx",
            lineNumber: 691,
            columnNumber: 14
        }, this);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `${base} bg-amber-100 text-amber-700`,
            children: "MODIFIED"
        }, void 0, false, {
            fileName: "[project]/app/history/page.tsx",
            lineNumber: 693,
            columnNumber: 12
        }, this);
    };
    /* =====================
     States
  ===================== */ if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-slate-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowPathIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowPathIcon$3e$__["ArrowPathIcon"], {
                className: "h-10 w-10 animate-spin text-blue-600"
            }, void 0, false, {
                fileName: "[project]/app/history/page.tsx",
                lineNumber: 703,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/history/page.tsx",
            lineNumber: 702,
            columnNumber: 7
        }, this);
    }
    if (error || !detail) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-slate-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center p-6 max-w-md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ExclamationTriangleIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExclamationTriangleIcon$3e$__["ExclamationTriangleIcon"], {
                        className: "h-12 w-12 text-red-500 mx-auto"
                    }, void 0, false, {
                        fileName: "[project]/app/history/page.tsx",
                        lineNumber: 712,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mt-4 text-xl font-bold",
                        children: "ไม่พบข้อมูล"
                    }, void 0, false, {
                        fileName: "[project]/app/history/page.tsx",
                        lineNumber: 713,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-600 mt-2",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/app/history/page.tsx",
                        lineNumber: 714,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/history",
                        className: "inline-block mt-6 px-4 py-2 border rounded-lg",
                        children: "กลับไปหน้าประวัติ"
                    }, void 0, false, {
                        fileName: "[project]/app/history/page.tsx",
                        lineNumber: 715,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/history/page.tsx",
                lineNumber: 711,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/history/page.tsx",
            lineNumber: 710,
            columnNumber: 7
        }, this);
    }
    /* =====================
     Render
  ===================== */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-slate-50 p-4 md:p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto space-y-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/history",
                            className: "flex items-center gap-2 text-slate-600",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowLeftIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeftIcon$3e$__["ArrowLeftIcon"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/app/history/page.tsx",
                                    lineNumber: 736,
                                    columnNumber: 13
                                }, this),
                                "กลับไปหน้าประวัติ"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/history/page.tsx",
                            lineNumber: 735,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleAnnotate,
                            disabled: annotating,
                            className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white disabled:opacity-60",
                            children: annotating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowPathIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowPathIcon$3e$__["ArrowPathIcon"], {
                                        className: "h-4 w-4 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/app/history/page.tsx",
                                        lineNumber: 747,
                                        columnNumber: 17
                                    }, this),
                                    " กำลังวิเคราะห์"
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$SparklesIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SparklesIcon$3e$__["SparklesIcon"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/history/page.tsx",
                                        lineNumber: 751,
                                        columnNumber: 17
                                    }, this),
                                    " ให้ AI วิเคราะห์ใหม่"
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/app/history/page.tsx",
                            lineNumber: 740,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/history/page.tsx",
                    lineNumber: 734,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-xl border p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold",
                            children: detail.document_name
                        }, void 0, false, {
                            fileName: "[project]/app/history/page.tsx",
                            lineNumber: 759,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-4 text-sm text-slate-600 mt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "px-2 py-1 bg-violet-100 rounded",
                                    children: detail.version_old_label
                                }, void 0, false, {
                                    fileName: "[project]/app/history/page.tsx",
                                    lineNumber: 762,
                                    columnNumber: 13
                                }, this),
                                "→",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "px-2 py-1 bg-fuchsia-100 rounded",
                                    children: detail.version_new_label
                                }, void 0, false, {
                                    fileName: "[project]/app/history/page.tsx",
                                    lineNumber: 766,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ClockIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClockIcon$3e$__["ClockIcon"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/history/page.tsx",
                                            lineNumber: 770,
                                            columnNumber: 15
                                        }, this),
                                        formatDateTime(detail.created_at)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/history/page.tsx",
                                    lineNumber: 769,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/history/page.tsx",
                            lineNumber: 761,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/history/page.tsx",
                    lineNumber: 758,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-xl border p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "flex items-center gap-2 text-lg font-bold mb-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$DocumentTextIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DocumentTextIcon$3e$__["DocumentTextIcon"], {
                                    className: "h-5 w-5 text-blue-600"
                                }, void 0, false, {
                                    fileName: "[project]/app/history/page.tsx",
                                    lineNumber: 779,
                                    columnNumber: 13
                                }, this),
                                "สรุปผลการเปรียบเทียบ"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/history/page.tsx",
                            lineNumber: 778,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-slate-700 whitespace-pre-line",
                            children: detail.summary_text || "ไม่มีสรุป"
                        }, void 0, false, {
                            fileName: "[project]/app/history/page.tsx",
                            lineNumber: 782,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/history/page.tsx",
                    lineNumber: 777,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "flex items-center gap-2 text-lg font-bold",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$DocumentMagnifyingGlassIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DocumentMagnifyingGlassIcon$3e$__["DocumentMagnifyingGlassIcon"], {
                                    className: "h-5 w-5 text-violet-600"
                                }, void 0, false, {
                                    fileName: "[project]/app/history/page.tsx",
                                    lineNumber: 790,
                                    columnNumber: 13
                                }, this),
                                "รายการการเปลี่ยนแปลง (",
                                detail.changes.length,
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/history/page.tsx",
                            lineNumber: 789,
                            columnNumber: 11
                        }, this),
                        detail.changes.map((change)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white border rounded-xl overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center bg-slate-50 p-4 border-b",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    changeTypeBadge(change.change_type),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-medium",
                                                        children: change.section_label || "ไม่มีหัวข้อ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/history/page.tsx",
                                                        lineNumber: 799,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/history/page.tsx",
                                                lineNumber: 797,
                                                columnNumber: 17
                                            }, this),
                                            riskBadge(change.risk_level)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/history/page.tsx",
                                        lineNumber: 796,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4 grid md:grid-cols-2 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs font-semibold mb-1",
                                                        children: "เวอร์ชันเก่า"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/history/page.tsx",
                                                        lineNumber: 808,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-red-50 border rounded p-3 text-sm line-through whitespace-pre-wrap",
                                                        children: change.old_text || "ไม่มีข้อความ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/history/page.tsx",
                                                        lineNumber: 809,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/history/page.tsx",
                                                lineNumber: 807,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs font-semibold mb-1",
                                                        children: "เวอร์ชันใหม่"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/history/page.tsx",
                                                        lineNumber: 814,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-emerald-50 border rounded p-3 text-sm whitespace-pre-wrap",
                                                        children: change.new_text || "ไม่มีข้อความ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/history/page.tsx",
                                                        lineNumber: 815,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/history/page.tsx",
                                                lineNumber: 813,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/history/page.tsx",
                                        lineNumber: 806,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid md:grid-cols-2 gap-4 p-4 pt-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs font-semibold mb-1",
                                                        children: "ความคิดเห็นจาก AI"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/history/page.tsx",
                                                        lineNumber: 823,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-blue-50 border rounded p-3 text-sm whitespace-pre-wrap",
                                                        children: change.ai_comment || "ยังไม่มีความคิดเห็น"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/history/page.tsx",
                                                        lineNumber: 824,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/history/page.tsx",
                                                lineNumber: 822,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs font-semibold mb-1 flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$LightBulbIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LightBulbIcon$3e$__["LightBulbIcon"], {
                                                                className: "h-4 w-4 text-amber-500"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/history/page.tsx",
                                                                lineNumber: 830,
                                                                columnNumber: 21
                                                            }, this),
                                                            " คำแนะนำจาก AI"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/history/page.tsx",
                                                        lineNumber: 829,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-amber-50 border rounded p-3 text-sm whitespace-pre-wrap",
                                                        children: change.ai_suggestion || "ยังไม่มีคำแนะนำ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/history/page.tsx",
                                                        lineNumber: 832,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/history/page.tsx",
                                                lineNumber: 828,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/history/page.tsx",
                                        lineNumber: 821,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, change.id, true, {
                                fileName: "[project]/app/history/page.tsx",
                                lineNumber: 795,
                                columnNumber: 13
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/history/page.tsx",
                    lineNumber: 788,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/history/page.tsx",
            lineNumber: 732,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/history/page.tsx",
        lineNumber: 731,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__97c041b4._.js.map