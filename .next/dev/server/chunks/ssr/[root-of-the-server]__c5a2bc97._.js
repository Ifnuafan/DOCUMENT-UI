module.exports = [
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/history/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

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
// app/compare/[id]/page.tsx "use client"; import { useParams, useRouter } from "next/navigation"; import { useEffect, useState } from "react"; import Link from "next/link"; import { ArrowLeftIcon, DocumentTextIcon, ClockIcon, ArrowPathIcon, ExclamationTriangleIcon, DocumentMagnifyingGlassIcon, SparklesIcon, LightBulbIcon } from "@heroicons/react/24/outline"; type ChangeItem = { id: number; change_type: "ADDED" | "REMOVED" | "MODIFIED"; section_label: string | null; old_text: string | null; new_text: string | null; risk_level?: "LOW" | "MEDIUM" | "HIGH" | null; ai_comment?: string | null; ai_suggestion?: string | null; }; type ComparisonDetail = { id: number; document_name: string; version_old_label: string; version_new_label: string; created_at: string; overall_risk_level?: string | null; summary_text?: string | null; changes: ChangeItem[]; }; export default function CompareDetailPage() { const params = useParams(); const router = useRouter(); const id = params.id as string; const [detail, setDetail] = useState<ComparisonDetail | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); const [annotating, setAnnotating] = useState(false); const [annotateError, setAnnotateError] = useState<string | null>(null); const API_BASE = "http://127.0.0.1:8000"; useEffect(() => { if (id) { loadDetail(); } }, [id]); const loadDetail = async () => { setLoading(true); setError(null); try { const res = await fetch(${API_BASE}/comparisons/${id}); if (!res.ok) throw new Error(Failed to load (${res.status})); const data: ComparisonDetail = await res.json(); setDetail(data); } catch (err: any) { setError(err.message); setDetail(null); } finally { setLoading(false); } }; const handleAnnotate = async () => { if (!id) return; setAnnotating(true); setAnnotateError(null); try { const res = await fetch(${API_BASE}/comparisons/${id}/annotate, { method: "POST", }); if (!res.ok) throw new Error(Annotation failed (${res.status})); // โหลดใหม่หลังจาก annotate await loadDetail(); } catch (err: any) { setAnnotateError(err.message); } finally { setAnnotating(false); } }; // Helper functions const riskBadge = (risk?: string | null) => { const base = "px-2 py-1 rounded-full text-xs font-semibold"; const level = (risk || "LOW").toUpperCase(); if (level === "HIGH") return <span className={${base} bg-red-100 text-red-700}>HIGH</span>; if (level === "MEDIUM") return <span className={${base} bg-amber-100 text-amber-700}>MEDIUM</span>; return <span className={${base} bg-emerald-100 text-emerald-700}>LOW</span>; }; const changeTypeBadge = (type: string) => { const base = "px-2 py-1 rounded text-xs font-medium"; if (type === "ADDED") return <span className={${base} bg-emerald-100 text-emerald-700}>+ ADDED</span>; if (type === "REMOVED") return <span className={${base} bg-red-100 text-red-700}>- REMOVED</span>; return <span className={${base} bg-amber-100 text-amber-700}>MODIFIED</span>; }; const formatDateTime = (iso: string) => { return new Date(iso).toLocaleString("th-TH", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); }; if (loading) { return ( <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center"> <div className="text-center"> <ArrowPathIcon className="h-12 w-12 animate-spin text-blue-600 mx-auto" /> <p className="mt-4 text-slate-600">กำลังโหลดรายละเอียด...</p> </div> </div> ); } if (error || !detail) { return ( <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center"> <div className="text-center max-w-md p-8"> <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto" /> <h2 className="text-xl font-bold text-slate-900 mt-4">ไม่พบข้อมูล</h2> <p className="text-slate-600 mt-2">{error || "ไม่พบรายการเปรียบเทียบนี้"}</p> <div className="mt-6 flex gap-3 justify-center"> <Link href="/history" className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50" > ← กลับไปหน้าประวัติ </Link> <button onClick={loadDetail} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" > ลองอีกครั้ง </button> </div> </div> </div> ); } return ( <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8"> <div className="max-w-6xl mx-auto"> {/* Header */} <div className="mb-8"> <div className="flex items-center justify-between mb-6"> <Link href="/history" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900" > <ArrowLeftIcon className="h-5 w-5" /> กลับไปหน้าประวัติ </Link> <div className="flex items-center gap-3"> <button onClick={handleAnnotate} disabled={annotating} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-70" > {annotating ? ( <> <ArrowPathIcon className="h-4 w-4 animate-spin" /> กำลังวิเคราะห์... </> ) : ( <> <SparklesIcon className="h-4 w-4" /> ให้ AI วิเคราะห์ใหม่ </> )} </button> </div> </div> {/* Document Info Card */} <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"> <div className="flex flex-col md:flex-row md:items-start justify-between gap-6"> <div className="flex-1"> <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2"> {detail.document_name} </h1> <div className="flex flex-wrap items-center gap-4 text-slate-600"> <div className="flex items-center gap-2"> <span className="px-2 py-1 bg-violet-100 text-violet-700 text-sm rounded"> {detail.version_old_label} </span> <span className="text-slate-400">→</span> <span className="px-2 py-1 bg-fuchsia-100 text-fuchsia-700 text-sm rounded"> {detail.version_new_label} </span> </div> <div className="flex items-center gap-2"> <ClockIcon className="h-4 w-4" /> {formatDateTime(detail.created_at)} </div> <div className="text-sm">ID: {detail.id}</div> </div> </div> <div className="flex flex-col items-end gap-3"> <div className="text-right"> <div className="text-sm text-slate-500 mb-1">ระดับความเสี่ยง</div> <div className={text-lg font-bold ${ detail.overall_risk_level?.includes('HIGH') ? 'text-red-600' : detail.overall_risk_level?.includes('MEDIUM') ? 'text-amber-600' : 'text-emerald-600' }}> {detail.overall_risk_level || 'ไม่ระบุ'} </div> </div> <div className="text-right"> <div className="text-sm text-slate-500 mb-1">การเปลี่ยนแปลง</div> <div className="text-lg font-bold text-blue-600"> {detail.changes.length} จุด </div> </div> </div> </div> {/* AI Annotate Error */} {annotateError && ( <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"> <p className="text-sm text-red-700 flex items-center gap-2"> <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0" /> {annotateError} </p> </div> )} </div> </div> {/* Summary Section */} <div className="mb-8"> <div className="bg-white rounded-xl border border-slate-200 p-6"> <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"> <DocumentTextIcon className="h-6 w-6 text-blue-600" /> สรุปผลการเปรียบเทียบ </h2> <div className="prose max-w-none"> <p className="text-slate-700 whitespace-pre-line leading-relaxed"> {detail.summary_text || "ไม่มีข้อความสรุปสำหรับการเปรียบเทียบนี้"} </p> </div> </div> </div> {/* Changes List */} <div className="space-y-6"> <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"> <DocumentMagnifyingGlassIcon className="h-6 w-6 text-violet-600" /> รายการการเปลี่ยนแปลง ({detail.changes.length} รายการ) </h2> <div className="space-y-4"> {detail.changes.map((change) => ( <div key={change.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden" > {/* Change Header */} <div className="border-b border-slate-100 p-4 bg-slate-50 flex flex-wrap items-center justify-between gap-3"> <div className="flex items-center gap-3"> {changeTypeBadge(change.change_type)} <span className="text-sm font-medium text-slate-700"> {change.section_label || "ไม่มีหัวข้อ"} </span> </div> <div className="flex items-center gap-3"> {riskBadge(change.risk_level)} <span className="text-xs text-slate-500">ID: {change.id}</span> </div> </div> {/* Change Content */} <div className="p-4"> <div className="grid md:grid-cols-2 gap-4 mb-4"> {/* Old Text */} <div> <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-2"> <span className="h-2 w-2 rounded-full bg-red-500"></span> เวอร์ชันเก่า </div> <div className="bg-red-50 border border-red-100 rounded-lg p-3"> <p className="text-sm text-red-800 whitespace-pre-wrap line-through"> {change.old_text || "ไม่มีข้อความ"} </p> </div> </div> {/* New Text */} <div> <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-2"> <span className="h-2 w-2 rounded-full bg-emerald-500"></span> เวอร์ชันใหม่ </div> <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3"> <p className="text-sm text-emerald-800 whitespace-pre-wrap"> {change.new_text || "ไม่มีข้อความ"} </p> </div> </div> </div> {/* AI Insights */} <div className="grid md:grid-cols-2 gap-4"> {/* AI Comment */} <div> <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-2"> <span className="h-2 w-2 rounded-full bg-blue-500"></span> ความคิดเห็นจาก AI </div> <div className="bg-blue-50 border border-blue-100 rounded-lg p-3"> <p className="text-sm text-blue-800 whitespace-pre-wrap"> {change.ai_comment || "AI ยังไม่ได้แสดงความคิดเห็น"} </p> </div> </div> {/* AI Suggestion */} <div> <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-2"> <LightBulbIcon className="h-4 w-4 text-amber-500" /> คำแนะนำจาก AI </div> <div className="bg-amber-50 border border-amber-100 rounded-lg p-3"> <p className="text-sm text-amber-800 whitespace-pre-wrap"> {change.ai_suggestion || "AI ยังไม่ได้ให้คำแนะนำ"} </p> </div> </div> </div> </div> </div> ))} </div> </div> </div> </main> ); }
}),
"[project]/app/history/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/history/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c5a2bc97._.js.map