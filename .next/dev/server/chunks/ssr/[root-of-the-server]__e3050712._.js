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
"[project]/app/compare/[id]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

// "use client";
// import { useParams } from "next/navigation";
// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import {
//   ArrowLeftIcon,
//   DocumentTextIcon,
//   ClockIcon,
//   ArrowPathIcon,
//   ExclamationTriangleIcon,
//   DocumentMagnifyingGlassIcon,
//   SparklesIcon,
//   LightBulbIcon,
//   ClipboardIcon,
//   FunnelIcon,
//   MagnifyingGlassIcon,
//   ChatBubbleLeftRightIcon,
//   PaperAirplaneIcon,
// } from "@heroicons/react/24/outline";
// type ChangeType = "ADDED" | "REMOVED" | "MODIFIED";
// type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
// type AiMode = "short" | "detailed" | "legal" | "risk";
// type ChangeItem = {
//   id: number;
//   change_type: ChangeType;
//   section_label: string | null;
//   old_text: string | null;
//   new_text: string | null;
//   risk_level?: RiskLevel | null;
//   ai_comment?: string | null;
//   ai_suggestion?: string | null;
//   risk_reason?: string | null;
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
// // ------------------------ helpers ------------------------
// function normalizeText(s?: string | null) {
//   return (s || "").toString().trim();
// }
// function riskRank(level?: string | null) {
//   const lv = (level || "LOW").toUpperCase();
//   if (lv === "HIGH") return 3;
//   if (lv === "MEDIUM") return 2;
//   return 1;
// }
// function contains(hay: string, needle: string) {
//   return hay.toLowerCase().includes(needle.toLowerCase());
// }
// function formatDateTime(iso: string) {
//   try {
//     return new Date(iso).toLocaleString("th-TH", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   } catch {
//     return iso;
//   }
// }
// function riskBadge(risk?: string | null) {
//   const base = "px-2 py-1 rounded-full text-xs font-semibold";
//   const level = (risk || "LOW").toUpperCase();
//   if (level === "HIGH")
//     return <span className={`${base} bg-red-100 text-red-700`}>HIGH</span>;
//   if (level === "MEDIUM")
//     return <span className={`${base} bg-amber-100 text-amber-700`}>MEDIUM</span>;
//   return <span className={`${base} bg-emerald-100 text-emerald-700`}>LOW</span>;
// }
// function changeTypeBadge(type: string) {
//   const base = "px-2 py-1 rounded text-xs font-medium";
//   if (type === "ADDED")
//     return (
//       <span className={`${base} bg-emerald-100 text-emerald-700`}>+ ADDED</span>
//     );
//   if (type === "REMOVED")
//     return (
//       <span className={`${base} bg-red-100 text-red-700`}>- REMOVED</span>
//     );
//   return (
//     <span className={`${base} bg-amber-100 text-amber-700`}>MODIFIED</span>
//   );
// }
// async function copyToClipboard(text: string) {
//   try {
//     await navigator.clipboard.writeText(text);
//     return true;
//   } catch {
//     try {
//       const el = document.createElement("textarea");
//       el.value = text;
//       document.body.appendChild(el);
//       el.select();
//       document.execCommand("copy");
//       document.body.removeChild(el);
//       return true;
//     } catch {
//       return false;
//     }
//   }
// }
// function CopyButton({
//   text,
//   label = "Copy",
//   className = "",
//   onCopied,
// }: {
//   text: string;
//   label?: string;
//   className?: string;
//   onCopied?: (ok: boolean) => void;
// }) {
//   const disabled = !text || text.trim().length === 0;
//   return (
//     <button
//       type="button"
//       disabled={disabled}
//       onClick={async () => {
//         const ok = await copyToClipboard(text);
//         onCopied?.(ok);
//       }}
//       className={[
//         "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border font-semibold",
//         disabled
//           ? "opacity-50 cursor-not-allowed border-slate-200 text-slate-400"
//           : "border-slate-200 text-slate-900 hover:bg-slate-50",
//         className,
//       ].join(" ")}
//       title={disabled ? "ไม่มีข้อความให้คัดลอก" : "คัดลอกไป clipboard"}
//     >
//       <ClipboardIcon className="h-4 w-4" />
//       {label}
//     </button>
//   );
// }
// function ExpandableText({
//   text,
//   emptyText,
//   tone = "neutral",
// }: {
//   text: string | null | undefined;
//   emptyText: string;
//   tone?: "old" | "new" | "aiComment" | "aiSuggestion" | "neutral";
// }) {
//   const raw = normalizeText(text);
//   const [expanded, setExpanded] = useState(false);
//   const THRESHOLD = 520;
//   const isLong = raw.length > THRESHOLD;
//   const shown = expanded || !isLong ? raw : raw.slice(0, THRESHOLD) + "…";
//   const baseText =
//     tone === "old"
//       ? "text-red-900"
//       : tone === "new"
//       ? "text-emerald-900"
//       : tone === "aiComment"
//       ? "text-blue-900"
//       : tone === "aiSuggestion"
//       ? "text-amber-900"
//       : "text-slate-900";
//   return (
//     <div>
//       <p className={`text-sm whitespace-pre-wrap ${baseText}`}>
//         {raw.length > 0 ? shown : emptyText}
//       </p>
//       {isLong && (
//         <button
//           type="button"
//           onClick={() => setExpanded((v) => !v)}
//           className="mt-2 text-xs font-semibold text-slate-900 underline underline-offset-2"
//         >
//           {expanded ? "ย่อข้อความ" : "ดูเพิ่ม"}
//         </button>
//       )}
//     </div>
//   );
// }
// // ------------------------ main page ------------------------
// type ChatState = {
//   open: boolean;
//   mode: AiMode;
//   question: string;
//   loading: boolean;
//   answer: string;
//   error: string | null;
// };
// const API_BASE = "http://127.0.0.1:8000";
// export default function CompareDetailPage() {
//   const params = useParams();
//   const id = params.id as string;
//   const [detail, setDetail] = useState<ComparisonDetail | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [annotating, setAnnotating] = useState(false);
//   const [annotateError, setAnnotateError] = useState<string | null>(null);
//   // Filters
//   const [q, setQ] = useState("");
//   const [riskFilter, setRiskFilter] = useState<"ALL" | RiskLevel>("ALL");
//   const [typeFilter, setTypeFilter] = useState<"ALL" | ChangeType>("ALL");
//   const [onlyNoAI, setOnlyNoAI] = useState(false);
//   const [sortMode, setSortMode] = useState<
//     "RISK_DESC" | "RISK_ASC" | "ID_DESC" | "ID_ASC"
//   >("RISK_DESC");
//   // UI feedback
//   const [toast, setToast] = useState<string | null>(null);
//   // Chat ต่อ change
//   const [chatById, setChatById] = useState<Record<number, ChatState>>({});
//   useEffect(() => {
//     if (id) loadDetail();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);
//   useEffect(() => {
//     if (!toast) return;
//     const t = setTimeout(() => setToast(null), 1600);
//     return () => clearTimeout(t);
//   }, [toast]);
//   const loadDetail = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`${API_BASE}/comparisons/${id}`, {
//         cache: "no-store",
//       });
//       if (!res.ok) throw new Error(`Failed to load (${res.status})`);
//       const data: ComparisonDetail = await res.json();
//       setDetail(data);
//       // init chat state สำหรับ change ใหม่ ๆ
//       setChatById((prev) => {
//         const next = { ...prev };
//         for (const ch of data.changes || []) {
//           if (!next[ch.id]) {
//             next[ch.id] = {
//               open: false,
//               mode: "risk",
//               question: "",
//               loading: false,
//               answer: "",
//               error: null,
//             };
//           }
//         }
//         return next;
//       });
//     } catch (err: any) {
//       setError(err?.message || "โหลดข้อมูลไม่สำเร็จ");
//       setDetail(null);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleAnnotate = async () => {
//     if (!id) return;
//     setAnnotating(true);
//     setAnnotateError(null);
//     try {
//       const res = await fetch(`${API_BASE}/comparisons/${id}/annotate`, {
//         method: "POST",
//       });
//       if (!res.ok) throw new Error(`Annotation failed (${res.status})`);
//       await loadDetail();
//       setToast("✅ วิเคราะห์เสร็จแล้ว");
//     } catch (err: any) {
//       setAnnotateError(err?.message || "วิเคราะห์ไม่สำเร็จ");
//     } finally {
//       setAnnotating(false);
//     }
//   };
//   const toggleChat = (changeId: number) => {
//     setChatById((prev) => ({
//       ...prev,
//       [changeId]: {
//         ...(prev[changeId] || {
//           open: true,
//           mode: "risk",
//           question: "",
//           loading: false,
//           answer: "",
//           error: null,
//         }),
//         open: !(prev[changeId]?.open ?? false),
//         error: null,
//       },
//     }));
//   };
//   const setChatField = (
//     changeId: number,
//     patch: Partial<Pick<ChatState, "mode" | "question">>
//   ) => {
//     setChatById((prev) => ({
//       ...prev,
//       [changeId]: {
//         ...(prev[changeId] || {
//           open: true,
//           mode: "risk",
//           question: "",
//           loading: false,
//           answer: "",
//           error: null,
//         }),
//         ...patch,
//       },
//     }));
//   };
//   const sendChat = async (changeId: number) => {
//     const st = chatById[changeId];
//     const question = normalizeText(st?.question);
//     const mode = (st?.mode || "risk") as AiMode;
//     if (!question) {
//       setChatById((prev) => ({
//         ...prev,
//         [changeId]: { ...prev[changeId], error: "พิมพ์คำถามก่อนครับ" },
//       }));
//       return;
//     }
//     setChatById((prev) => ({
//       ...prev,
//       [changeId]: { ...prev[changeId], loading: true, error: null },
//     }));
//     try {
//       const res = await fetch(`${API_BASE}/changes/${changeId}/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ question, mode }),
//       });
//       if (!res.ok) throw new Error(`Chat failed (${res.status})`);
//       const data = await res.json(); // {ok, change_id, mode, answer}
//       setChatById((prev) => ({
//         ...prev,
//         [changeId]: {
//           ...prev[changeId],
//           loading: false,
//           answer: normalizeText(data?.answer) || "",
//           error: null,
//         },
//       }));
//       setToast("✅ ได้คำตอบแล้ว");
//     } catch (e: any) {
//       setChatById((prev) => ({
//         ...prev,
//         [changeId]: {
//           ...prev[changeId],
//           loading: false,
//           error: e?.message || "ส่งคำถามไม่สำเร็จ",
//         },
//       }));
//     }
//   };
//   const filteredChanges = useMemo(() => {
//     const changes = detail?.changes || [];
//     const query = q.trim();
//     let list = changes.filter((c) => {
//       if (riskFilter !== "ALL") {
//         const lv = (c.risk_level || "LOW").toUpperCase();
//         if (lv !== riskFilter) return false;
//       }
//       if (typeFilter !== "ALL") {
//         if (c.change_type !== typeFilter) return false;
//       }
//       if (onlyNoAI) {
//         const hasComment = normalizeText(c.ai_comment).length > 0;
//         const hasSuggest = normalizeText(c.ai_suggestion).length > 0;
//         if (hasComment && hasSuggest) return false;
//       }
//       if (query.length > 0) {
//         const hay = [
//           c.section_label,
//           c.old_text,
//           c.new_text,
//           c.ai_comment,
//           c.ai_suggestion,
//           c.risk_reason,
//           c.change_type,
//           c.risk_level,
//         ]
//           .map((x) => normalizeText(x as any))
//           .join(" | ");
//         if (!contains(hay, query)) return false;
//       }
//       return true;
//     });
//     list = [...list].sort((a, b) => {
//       if (sortMode === "RISK_DESC") {
//         const r = riskRank(b.risk_level) - riskRank(a.risk_level);
//         if (r !== 0) return r;
//         return b.id - a.id;
//       }
//       if (sortMode === "RISK_ASC") {
//         const r = riskRank(a.risk_level) - riskRank(b.risk_level);
//         if (r !== 0) return r;
//         return a.id - b.id;
//       }
//       if (sortMode === "ID_ASC") return a.id - b.id;
//       return b.id - a.id;
//     });
//     return list;
//   }, [detail?.changes, q, riskFilter, typeFilter, onlyNoAI, sortMode]);
//   const totalCount = detail?.changes?.length || 0;
//   const shownCount = filteredChanges.length;
//   // ---------- Loading / Not found ----------
//   if (loading) {
//     return (
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
//           <ArrowPathIcon className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
//           <p className="mt-4 text-slate-900 font-semibold">
//             กำลังโหลดรายละเอียด...
//           </p>
//         </div>
//       </div>
//     );
//   }
//   if (error || !detail) {
//     return (
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
//           <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto" />
//           <h2 className="text-xl font-bold text-slate-900 mt-4">ไม่พบข้อมูล</h2>
//           <p className="text-slate-900 mt-2 font-semibold">
//             {error || "ไม่พบรายการเปรียบเทียบนี้"}
//           </p>
//           <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
//             <Link
//               href="/history"
//               className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-900 font-semibold"
//             >
//               ← กลับไปหน้าประวัติ
//             </Link>
//             <button
//               onClick={loadDetail}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
//             >
//               ลองอีกครั้ง
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }
//   // ---------- Main ----------
//   return (
//     <div className="max-w-6xl mx-auto text-slate-900">
//       {/* Toast */}
//       {toast && (
//         <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg font-semibold">
//           {toast}
//         </div>
//       )}
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
//           <Link
//             href="/history"
//             className="inline-flex items-center gap-2 text-slate-900 font-semibold hover:opacity-90"
//           >
//             <ArrowLeftIcon className="h-5 w-5" />
//             กลับไปหน้าประวัติ
//           </Link>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={handleAnnotate}
//               disabled={annotating}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-70"
//             >
//               {annotating ? (
//                 <>
//                   <ArrowPathIcon className="h-4 w-4 animate-spin" />
//                   กำลังวิเคราะห์...
//                 </>
//               ) : (
//                 <>
//                   <SparklesIcon className="h-4 w-4" />
//                   ให้ AI วิเคราะห์ใหม่
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//         {/* Document Info Card */}
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
//           <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
//             <div className="flex-1">
//               <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
//                 {detail.document_name}
//               </h1>
//               <div className="flex flex-wrap items-center gap-4 text-slate-900 font-semibold">
//                 <div className="flex items-center gap-2">
//                   <span className="px-2 py-1 bg-violet-100 text-violet-800 text-sm rounded font-semibold">
//                     {detail.version_old_label}
//                   </span>
//                   <span className="text-slate-900">→</span>
//                   <span className="px-2 py-1 bg-fuchsia-100 text-fuchsia-800 text-sm rounded font-semibold">
//                     {detail.version_new_label}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <ClockIcon className="h-4 w-4" />
//                   {formatDateTime(detail.created_at)}
//                 </div>
//                 <div className="text-sm">ID: {detail.id}</div>
//               </div>
//             </div>
//             <div className="flex flex-col items-end gap-3">
//               <div className="text-right">
//                 <div className="text-sm text-slate-900 font-semibold mb-1">
//                   ระดับความเสี่ยง
//                 </div>
//                 <div
//                   className={`text-lg font-bold ${
//                     detail.overall_risk_level?.includes("HIGH")
//                       ? "text-red-700"
//                       : detail.overall_risk_level?.includes("MEDIUM")
//                       ? "text-amber-700"
//                       : "text-emerald-700"
//                   }`}
//                 >
//                   {detail.overall_risk_level || "ไม่ระบุ"}
//                 </div>
//               </div>
//               <div className="text-right">
//                 <div className="text-sm text-slate-900 font-semibold mb-1">
//                   การเปลี่ยนแปลง
//                 </div>
//                 <div className="text-lg font-bold text-blue-700">
//                   {totalCount} จุด
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* AI Annotate Error */}
//           {annotateError && (
//             <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//               <p className="text-sm text-red-800 flex items-center gap-2 font-semibold">
//                 <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0" />
//                 {annotateError}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//       {/* Summary Section */}
//       <div className="mb-8">
//         <div className="bg-white rounded-xl border border-slate-200 p-6">
//           <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
//             <DocumentTextIcon className="h-6 w-6 text-blue-700" />
//             สรุปผลการเปรียบเทียบ
//           </h2>
//           <div className="prose max-w-none">
//             <p className="text-slate-900 whitespace-pre-line leading-relaxed font-semibold">
//               {detail.summary_text || "ไม่มีข้อความสรุปสำหรับการเปรียบเทียบนี้"}
//             </p>
//           </div>
//         </div>
//       </div>
//       {/* Filters */}
//       <div className="mb-6">
//         <div className="bg-white rounded-xl border border-slate-200 p-4">
//           <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
//             {/* Search */}
//             <div className="flex-1">
//               <div className="relative">
//                 <MagnifyingGlassIcon className="h-5 w-5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
//                 <input
//                   value={q}
//                   onChange={(e) => setQ(e.target.value)}
//                   placeholder="ค้นหา: หัวข้อ / old / new / AI comment / AI suggestion ..."
//                   className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 font-semibold placeholder:text-slate-400"
//                 />
//               </div>
//             </div>
//             {/* Risk/type/sort */}
//             <div className="flex items-center gap-2">
//               <FunnelIcon className="h-5 w-5 text-slate-900" />
//               <select
//                 value={riskFilter}
//                 onChange={(e) => setRiskFilter(e.target.value as any)}
//                 className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 font-semibold"
//               >
//                 <option value="ALL">Risk: ทั้งหมด</option>
//                 <option value="HIGH">Risk: HIGH</option>
//                 <option value="MEDIUM">Risk: MEDIUM</option>
//                 <option value="LOW">Risk: LOW</option>
//               </select>
//               <select
//                 value={typeFilter}
//                 onChange={(e) => setTypeFilter(e.target.value as any)}
//                 className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 font-semibold"
//               >
//                 <option value="ALL">Type: ทั้งหมด</option>
//                 <option value="ADDED">ADDED</option>
//                 <option value="REMOVED">REMOVED</option>
//                 <option value="MODIFIED">MODIFIED</option>
//               </select>
//               <select
//                 value={sortMode}
//                 onChange={(e) => setSortMode(e.target.value as any)}
//                 className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 font-semibold"
//               >
//                 <option value="RISK_DESC">เรียง: Risk สูง → ต่ำ</option>
//                 <option value="RISK_ASC">เรียง: Risk ต่ำ → สูง</option>
//                 <option value="ID_DESC">เรียง: ID ใหม่ → เก่า</option>
//                 <option value="ID_ASC">เรียง: ID เก่า → ใหม่</option>
//               </select>
//             </div>
//             {/* Only missing AI */}
//             <label className="inline-flex items-center gap-2 text-sm text-slate-900 font-semibold select-none">
//               <input
//                 type="checkbox"
//                 checked={onlyNoAI}
//                 onChange={(e) => setOnlyNoAI(e.target.checked)}
//                 className="h-4 w-4 rounded border-slate-300"
//               />
//               เฉพาะที่ AI ยังไม่ครบ
//             </label>
//             {/* Count */}
//             <div className="text-sm text-slate-900 font-semibold">
//               แสดง <span className="font-bold text-slate-900">{shownCount}</span> /{" "}
//               {totalCount}
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Changes List */}
//       <div className="space-y-6">
//         <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
//           <DocumentMagnifyingGlassIcon className="h-6 w-6 text-violet-700" />
//           รายการการเปลี่ยนแปลง ({shownCount} รายการ)
//         </h2>
//         {shownCount === 0 ? (
//           <div className="bg-white rounded-xl border border-slate-200 p-6 text-slate-900 font-semibold">
//             ไม่พบรายการตามเงื่อนไขที่เลือก
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredChanges.map((change) => {
//               const oldText = normalizeText(change.old_text);
//               const newText = normalizeText(change.new_text);
//               const aiComment = normalizeText(change.ai_comment);
//               const aiSuggest = normalizeText(change.ai_suggestion);
//               const chat = chatById[change.id] || {
//                 open: false,
//                 mode: "risk" as AiMode,
//                 question: "",
//                 loading: false,
//                 answer: "",
//                 error: null,
//               };
//               return (
//                 <div
//                   key={change.id}
//                   className="bg-white rounded-xl border border-slate-200 overflow-hidden"
//                 >
//                   {/* Change Header */}
//                   <div className="border-b border-slate-100 p-4 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
//                     <div className="flex items-center gap-3">
//                       {changeTypeBadge(change.change_type)}
//                       <span className="text-sm font-bold text-slate-900">
//                         {change.section_label || "ไม่มีหัวข้อ"}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       {riskBadge(change.risk_level)}
//                       <span className="text-xs text-slate-900 font-semibold">
//                         ID: {change.id}
//                       </span>
//                     </div>
//                   </div>
//                   {/* Change Content */}
//                   <div className="p-4">
//                     <div className="grid md:grid-cols-2 gap-4 mb-4">
//                       {/* Old Text */}
//                       <div>
//                         <div className="flex items-center justify-between mb-2">
//                           <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
//                             <span className="h-2 w-2 rounded-full bg-red-500"></span>
//                             เวอร์ชันเก่า
//                           </div>
//                           <CopyButton
//                             text={oldText}
//                             label="Copy old"
//                             onCopied={(ok) =>
//                               setToast(ok ? "คัดลอก old แล้ว" : "คัดลอกไม่สำเร็จ")
//                             }
//                           />
//                         </div>
//                         <div className="bg-red-50 border border-red-100 rounded-lg p-3">
//                           <div className="line-through">
//                             <ExpandableText
//                               text={change.old_text}
//                               emptyText="ไม่มีข้อความ"
//                               tone="old"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                       {/* New Text */}
//                       <div>
//                         <div className="flex items-center justify-between mb-2">
//                           <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
//                             <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
//                             เวอร์ชันใหม่
//                           </div>
//                           <CopyButton
//                             text={newText}
//                             label="Copy new"
//                             onCopied={(ok) =>
//                               setToast(ok ? "คัดลอก new แล้ว" : "คัดลอกไม่สำเร็จ")
//                             }
//                           />
//                         </div>
//                         <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
//                           <ExpandableText
//                             text={change.new_text}
//                             emptyText="ไม่มีข้อความ"
//                             tone="new"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     {/* AI Insights */}
//                     <div className="grid md:grid-cols-2 gap-4">
//                       {/* AI Comment */}
//                       <div>
//                         <div className="flex items-center justify-between mb-2">
//                           <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
//                             <span className="h-2 w-2 rounded-full bg-blue-500"></span>
//                             ความคิดเห็นจาก AI
//                           </div>
//                           <CopyButton
//                             text={aiComment}
//                             label="Copy comment"
//                             onCopied={(ok) =>
//                               setToast(ok ? "คัดลอก comment แล้ว" : "คัดลอกไม่สำเร็จ")
//                             }
//                           />
//                         </div>
//                         <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
//                           <ExpandableText
//                             text={change.ai_comment}
//                             emptyText="AI ยังไม่ได้แสดงความคิดเห็น"
//                             tone="aiComment"
//                           />
//                         </div>
//                         {normalizeText(change.risk_reason).length > 0 && (
//                           <div className="mt-2 text-xs text-slate-900 font-semibold">
//                             <span className="font-bold">เหตุผลความเสี่ยง:</span>{" "}
//                             {change.risk_reason}
//                           </div>
//                         )}
//                       </div>
//                       {/* AI Suggestion */}
//                       <div>
//                         <div className="flex items-center justify-between mb-2">
//                           <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
//                             <LightBulbIcon className="h-4 w-4 text-amber-600" />
//                             คำแนะนำจาก AI
//                           </div>
//                           <CopyButton
//                             text={aiSuggest}
//                             label="Copy suggestion"
//                             onCopied={(ok) =>
//                               setToast(
//                                 ok ? "คัดลอก suggestion แล้ว" : "คัดลอกไม่สำเร็จ"
//                               )
//                             }
//                           />
//                         </div>
//                         <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
//                           <ExpandableText
//                             text={change.ai_suggestion}
//                             emptyText="AI ยังไม่ได้ให้คำแนะนำ"
//                             tone="aiSuggestion"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     {/* Chat ต่อ change */}
//                     <div className="mt-4">
//                       <button
//                         type="button"
//                         onClick={() => toggleChat(change.id)}
//                         className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-semibold"
//                       >
//                         <ChatBubbleLeftRightIcon className="h-5 w-5" />
//                         ถาม AI เพิ่มเติม
//                         <span className="text-xs font-bold text-slate-900">
//                           {chat.open ? "▲" : "▼"}
//                         </span>
//                       </button>
//                       {chat.open && (
//                         <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
//                           <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
//                             <div className="flex items-center gap-2">
//                               <span className="text-sm font-bold text-slate-900">
//                                 โหมด:
//                               </span>
//                               <select
//                                 value={chat.mode}
//                                 onChange={(e) =>
//                                   setChatField(change.id, {
//                                     mode: e.target.value as AiMode,
//                                   })
//                                 }
//                                 className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 font-semibold"
//                               >
//                                 <option value="risk">Risk</option>
//                                 <option value="short">Short</option>
//                                 <option value="detailed">Detailed</option>
//                                 <option value="legal">Legal</option>
//                               </select>
//                             </div>
//                             <div className="flex-1" />
//                             <CopyButton
//                               text={chat.answer}
//                               label="Copy answer"
//                               onCopied={(ok) =>
//                                 setToast(ok ? "คัดลอกคำตอบแล้ว" : "คัดลอกไม่สำเร็จ")
//                               }
//                             />
//                           </div>
//                           <div className="mt-3">
//                             <textarea
//                               value={chat.question}
//                               onChange={(e) =>
//                                 setChatField(change.id, { question: e.target.value })
//                               }
//                               placeholder="พิมพ์คำถามเกี่ยวกับ change นี้ (อ้างอิง Old/New/AI เท่านั้น)"
//                               rows={3}
//                               className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                           </div>
//                           {chat.error && (
//                             <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 font-semibold">
//                               {chat.error}
//                             </div>
//                           )}
//                           <div className="mt-3 flex gap-2">
//                             <button
//                               type="button"
//                               onClick={() => sendChat(change.id)}
//                               disabled={
//                                 chat.loading || normalizeText(chat.question).length === 0
//                               }
//                               className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
//                             >
//                               {chat.loading ? (
//                                 <>
//                                   <ArrowPathIcon className="h-4 w-4 animate-spin" />
//                                   กำลังส่ง...
//                                 </>
//                               ) : (
//                                 <>
//                                   <PaperAirplaneIcon className="h-4 w-4" />
//                                   ส่งคำถาม
//                                 </>
//                               )}
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 setChatById((prev) => ({
//                                   ...prev,
//                                   [change.id]: {
//                                     ...prev[change.id],
//                                     question: "",
//                                     answer: "",
//                                     error: null,
//                                   },
//                                 }))
//                               }
//                               className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-semibold"
//                             >
//                               ล้าง
//                             </button>
//                           </div>
//                           <div className="mt-4">
//                             <div className="text-sm font-bold text-slate-900 mb-2">
//                               คำตอบ
//                             </div>
//                             <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
//                               <p className="text-sm whitespace-pre-wrap text-slate-900 font-semibold">
//                                 {chat.answer || "ยังไม่มีคำตอบ"}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                     {/* Quick copy all */}
//                     <div className="mt-4 flex flex-wrap gap-2">
//                       <CopyButton
//                         text={[
//                           `SECTION: ${change.section_label || "-"}`,
//                           `TYPE: ${change.change_type}`,
//                           `RISK: ${change.risk_level || "LOW"}`,
//                           "",
//                           "OLD:",
//                           oldText || "-",
//                           "",
//                           "NEW:",
//                           newText || "-",
//                           "",
//                           "AI COMMENT:",
//                           aiComment || "-",
//                           "",
//                           "AI SUGGESTION:",
//                           aiSuggest || "-",
//                         ].join("\n")}
//                         label="Copy ทั้งก้อน"
//                         onCopied={(ok) =>
//                           setToast(ok ? "คัดลอกทั้งก้อนแล้ว" : "คัดลอกไม่สำเร็จ")
//                         }
//                         className="text-slate-900"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// "use client";
// import { useParams } from "next/navigation";
// import { useEffect, useMemo, useState } from "react";
// /* ================= TYPES ================= */
// type ChangeType = "ADDED" | "REMOVED" | "MODIFIED";
// type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
// type ChangeItem = {
//   id: number;
//   change_type: ChangeType;
//   section_label: string | null;
//   old_text: string | null;
//   new_text: string | null;
//   risk_level?: RiskLevel | null;
// };
// type ComparisonDetail = {
//   id: number;
//   document_name: string;
//   version_old_label: string;
//   version_new_label: string;
//   created_at: string;
//   changes: ChangeItem[];
// };
// const API_BASE =
//   process.env.NEXT_PUBLIC_API_BASE?.trim() || "http://127.0.0.1:8000";
// /* ================= DIFF HELPERS ================= */
// function splitWords(text: string) {
//   return text.split(/(\s+)/);
// }
// function diffWords(oldText: string, newText: string) {
//   const oldWords = splitWords(oldText);
//   const newWords = splitWords(newText);
//   const oldSet = new Set(oldWords);
//   const newSet = new Set(newWords);
//   return {
//     old: oldWords.map((w) => ({
//       text: w,
//       removed: !newSet.has(w),
//     })),
//     new: newWords.map((w) => ({
//       text: w,
//       added: !oldSet.has(w),
//     })),
//   };
// }
// function OldDiff({ oldText, newText }: { oldText: string; newText: string }) {
//   const diff = diffWords(oldText, newText);
//   return (
//     <div style={{ textDecoration: "line-through", whiteSpace: "pre-wrap" }}>
//       {diff.old.map((w, i) => (
//         <span
//           key={i}
//           style={
//             w.removed
//               ? { backgroundColor: "#fee2e2" } // red-100
//               : undefined
//           }
//         >
//           {w.text}
//         </span>
//       ))}
//     </div>
//   );
// }
// function NewDiff({ oldText, newText }: { oldText: string; newText: string }) {
//   const diff = diffWords(oldText, newText);
//   return (
//     <div style={{ whiteSpace: "pre-wrap" }}>
//       {diff.new.map((w, i) => (
//         <span
//           key={i}
//           style={
//             w.added
//               ? { backgroundColor: "#dcfce7" } // green-100
//               : undefined
//           }
//         >
//           {w.text}
//         </span>
//       ))}
//     </div>
//   );
// }
// /* ================= PAGE ================= */
// export default function CompareReportPage() {
//   const { id } = useParams<{ id: string }>();
//   const [detail, setDetail] = useState<ComparisonDetail | null>(null);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     if (!id) return;
//     fetch(`${API_BASE}/comparisons/${id}`, { cache: "no-store" })
//       .then((r) => r.json())
//       .then(setDetail)
//       .finally(() => setLoading(false));
//   }, [id]);
//   const summary = useMemo(() => {
//     if (!detail) return null;
//     return {
//       HIGH: detail.changes.filter((c) => c.risk_level === "HIGH").length,
//       MEDIUM: detail.changes.filter((c) => c.risk_level === "MEDIUM").length,
//       LOW: detail.changes.filter((c) => c.risk_level === "LOW").length,
//     };
//   }, [detail]);
//   if (loading) return <div style={{ padding: 24 }}>กำลังโหลด...</div>;
//   if (!detail) return <div style={{ padding: 24 }}>ไม่พบข้อมูล</div>;
//   return (
//     <div style={{ padding: 24, fontFamily: "Tahoma, Arial, sans-serif" }}>
//       {/* ===== Summary ===== */}
//       <pre style={{ marginBottom: 16 }}>
// {`- HIGH (สูง): ${summary?.HIGH}
// - MEDIUM (ปานกลาง): ${summary?.MEDIUM}
// - LOW (ต่ำ): ${summary?.LOW}`}
//       </pre>
//       <h2 style={{ marginBottom: 8 }}>รายละเอียดการเปลี่ยนแปลง</h2>
//       <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
//         <thead>
//           <tr>
//             {["Type", "Risk", "Section", "Old Text", "New Text"].map((h) => (
//               <th
//                 key={h}
//                 style={{
//                   border: "1px solid #ccc",
//                   background: "#f2f2f2",
//                   padding: "6px 8px",
//                   textAlign: "left",
//                 }}
//               >
//                 {h}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {detail.changes.map((c) => (
//             <tr key={c.id} style={{ verticalAlign: "top" }}>
//               <td style={cell}>{c.change_type}</td>
//               <td style={cell}>{c.risk_level}</td>
//               <td style={cell}>{c.section_label}</td>
//               <td style={{ ...cell, background: "#fffbe6" }}>
//                 <OldDiff
//                   oldText={c.old_text || ""}
//                   newText={c.new_text || ""}
//                 />
//               </td>
//               <td style={{ ...cell, background: "#fffbe6" }}>
//                 <NewDiff
//                   oldText={c.old_text || ""}
//                   newText={c.new_text || ""}
//                 />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
// const cell: React.CSSProperties = {
//   border: "1px solid #ccc",
//   padding: "6px 8px",
// };
}),
"[project]/app/compare/[id]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/compare/[id]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e3050712._.js.map