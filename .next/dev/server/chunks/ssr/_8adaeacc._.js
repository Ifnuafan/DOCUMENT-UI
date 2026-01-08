module.exports = [
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// "use client";
// import React, { useMemo, useState } from "react";
// import Link from "next/link";
// import {
//   DocumentMagnifyingGlassIcon,
//   CloudArrowUpIcon,
//   ArrowPathIcon,
//   ArrowRightIcon,
//   ExclamationTriangleIcon,
//   ClockIcon,
//   ChartBarIcon,
//   DocumentTextIcon,
//   AdjustmentsHorizontalIcon,
// } from "@heroicons/react/24/outline";
// type CompareResult = {
//   doc_name: string;
//   v1_label: string;
//   v2_label: string;
//   pages_v1: number;
//   pages_v2: number;
//   paragraphs_v1: number;
//   paragraphs_v2: number;
//   changes_count: number;
//   risk_level: string;
//   summary_text: string;
//   run_id: number;
//   html_report_url: string;
//   json_report_url: string;
// };
// type ChangeType = "ADDED" | "REMOVED" | "MODIFIED";
// type ChangeItem = {
//   change_type: ChangeType;
//   section_label: string | null;
//   old_text: string | null;
//   new_text: string | null;
//   risk_level?: "LOW" | "MEDIUM" | "HIGH" | null;
//   ai_comment?: string | null;
// };
// type JsonReport = {
//   changes: ChangeItem[];
// };
// const API_BASE =
//   process.env.NEXT_PUBLIC_API_BASE?.trim() || "http://127.0.0.1:8000";
// // Facebook-ish blues
// const FB_BLUE = "#1877F2";
// const FB_BLUE_HOVER = "#166FE5";
// function formatRisk(risk: string) {
//   const level = (risk || "").toLowerCase();
//   if (level.includes("สูง") || level.includes("high")) return "HIGH";
//   if (level.includes("กลาง") || level.includes("medium")) return "MEDIUM";
//   return "LOW";
// }
// function RiskPill({ risk }: { risk: string }) {
//   const r = formatRisk(risk);
//   const base =
//     "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold border";
//   if (r === "HIGH")
//     return (
//       <span className={`${base} bg-red-50 text-red-700 border-red-200`}>
//         HIGH
//       </span>
//     );
//   if (r === "MEDIUM")
//     return (
//       <span className={`${base} bg-amber-50 text-amber-700 border-amber-200`}>
//         MEDIUM
//       </span>
//     );
//   return (
//     <span
//       className={`${base} bg-emerald-50 text-emerald-700 border-emerald-200`}
//     >
//       LOW
//     </span>
//   );
// }
// function ChangeBadge({ t }: { t: ChangeType }) {
//   const base =
//     "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold border";
//   if (t === "ADDED")
//     return (
//       <span
//         className={`${base} bg-emerald-50 text-emerald-700 border-emerald-200`}
//       >
//         ADDED
//       </span>
//     );
//   if (t === "REMOVED")
//     return (
//       <span className={`${base} bg-rose-50 text-rose-700 border-rose-200`}>
//         REMOVED
//       </span>
//     );
//   return (
//     <span className={`${base} bg-amber-50 text-amber-700 border-amber-200`}>
//       MODIFIED
//     </span>
//   );
// }
// function truncate(text: string | null, len = 240) {
//   if (!text) return "";
//   return text.length > len ? text.slice(0, len) + "..." : text;
// }
// function Card({
//   children,
//   className = "",
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) {
//   return (
//     <div
//       className={[
//         "rounded-3xl border border-blue-100 bg-white shadow-sm",
//         "hover:shadow-md transition-shadow",
//         className,
//       ].join(" ")}
//     >
//       {children}
//     </div>
//   );
// }
// export default function Home() {
//   const [docName, setDocName] = useState("");
//   const [v1Label, setV1Label] = useState("");
//   const [v2Label, setV2Label] = useState("");
//   const [fileV1, setFileV1] = useState<File | null>(null);
//   const [fileV2, setFileV2] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [result, setResult] = useState<CompareResult | null>(null);
//   const [changes, setChanges] = useState<ChangeItem[]>([]);
//   const [filterType, setFilterType] = useState<"ALL" | ChangeType>("ALL");
//   const filteredChanges = useMemo(() => {
//     return filterType === "ALL"
//       ? changes
//       : changes.filter((c) => c.change_type === filterType);
//   }, [changes, filterType]);
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setResult(null);
//     setChanges([]);
//     if (!fileV1 || !fileV2) {
//       setError("กรุณาเลือกไฟล์ PDF ทั้งสองเวอร์ชันก่อนเริ่มเปรียบเทียบ");
//       return;
//     }
//     // ✅ fallback กัน 422 (doc_name เป็น required ที่ฝั่ง FastAPI)
//     const safeDocName =
//       docName?.trim() || (fileV1?.name ? fileV1.name.replace(/\.pdf$/i, "") : "document");
//     const safeV1 = v1Label?.trim() || "v1";
//     const safeV2 = v2Label?.trim() || "v2";
//     const formData = new FormData();
//     formData.append("doc_name", safeDocName);
//     formData.append("v1_label", safeV1);
//     formData.append("v2_label", safeV2);
//     formData.append("file_v1", fileV1);
//     formData.append("file_v2", fileV2);
//     // ✅ debug ดูว่าค่าส่งครบจริงไหม
//     console.log("API_BASE =", API_BASE);
//     console.log("FORMDATA doc_name =", safeDocName);
//     console.log("FORMDATA v1_label =", safeV1);
//     console.log("FORMDATA v2_label =", safeV2);
//     console.log("FORMDATA file_v1 =", fileV1?.name, fileV1?.type, fileV1?.size);
//     console.log("FORMDATA file_v2 =", fileV2?.name, fileV2?.type, fileV2?.size);
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/compare`, {
//         method: "POST",
//         body: formData,
//         // ❌ ห้าม set Content-Type เองนะ เพราะ FormData จะให้ browser ใส่ boundary ให้
//       });
//       if (!res.ok) {
//         // ✅ เอา detail ของ 422 ให้เห็นชัด
//         const text = await res.text();
//         console.log("COMPARE ERROR:", res.status, text);
//         throw new Error(`API error ${res.status}: ${text}`);
//       }
//       const data: CompareResult = await res.json();
//       setResult(data);
//       // load JSON report for changes
//       try {
//         const jsonRes = await fetch(`${API_BASE}${data.json_report_url}`, {
//           cache: "no-store",
//         });
//         if (jsonRes.ok) {
//           const json: JsonReport = await jsonRes.json();
//           setChanges(json.changes || []);
//         }
//       } catch (err) {
//         console.warn("โหลด JSON report ไม่สำเร็จ", err);
//       }
//     } catch (err: any) {
//       setError(err?.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
//       <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
//         {/* Header */}
//         <Card className="p-6">
//           <div className="flex items-start justify-between gap-4">
//             <div className="flex items-start gap-3">
//               <div
//                 className="h-11 w-11 rounded-2xl text-white flex items-center justify-center shadow-sm"
//                 style={{ backgroundColor: FB_BLUE }}
//               >
//                 <DocumentMagnifyingGlassIcon className="h-6 w-6" />
//               </div>
//               <div>
//                 <h1 className="text-xl md:text-2xl font-extrabold text-slate-900">
//                   เปรียบเทียบเอกสาร 2 เวอร์ชัน
//                 </h1>
//                 <p className="mt-1 text-sm text-slate-600 font-semibold">
//                   อัปโหลด PDF 2 เวอร์ชัน → ระบบสรุปความต่าง และประเมินความเสี่ยง
//                 </p>
//               </div>
//             </div>
//             <Link
//               href="/history"
//               className="hidden md:inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-extrabold"
//               style={{ color: FB_BLUE }}
//             >
//               <ClockIcon className="h-5 w-5" />
//               History
//             </Link>
//           </div>
//         </Card>
//         {/* Main grid */}
//         <div className="grid gap-4 lg:grid-cols-3">
//           {/* Form */}
//           <Card className="lg:col-span-2 p-6">
//             <div className="flex items-center gap-2">
//               <DocumentTextIcon className="h-5 w-5 text-slate-700" />
//               <div className="text-sm font-extrabold text-slate-900">
//                 Upload & Compare
//               </div>
//             </div>
//             <form onSubmit={handleSubmit} className="mt-5 space-y-5">
//               {/* meta */}
//               <div className="grid gap-3 md:grid-cols-3">
//                 <div>
//                   <label className="text-xs font-extrabold text-slate-700">
//                     doc_name
//                   </label>
//                   <input
//                     value={docName}
//                     onChange={(e) => setDocName(e.target.value)}
//                     placeholder="ถ้าไม่กรอก ระบบจะใช้ชื่อไฟล์ v1 แทน"
//                     className="mt-1 w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs font-extrabold text-slate-700">
//                     v1_label
//                   </label>
//                   <input
//                     value={v1Label}
//                     onChange={(e) => setV1Label(e.target.value)}
//                     placeholder="เช่น Draft"
//                     className="mt-1 w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs font-extrabold text-slate-700">
//                     v2_label
//                   </label>
//                   <input
//                     value={v2Label}
//                     onChange={(e) => setV2Label(e.target.value)}
//                     placeholder="เช่น Final"
//                     className="mt-1 w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none"
//                   />
//                 </div>
//               </div>
//               {/* files */}
//               <div className="grid gap-3 md:grid-cols-2">
//                 <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
//                   <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700">
//                     <CloudArrowUpIcon className="h-4 w-4" />
//                     File v1 (PDF)
//                   </div>
//                   <input
//                     type="file"
//                     accept="application/pdf"
//                     onChange={(e) => setFileV1(e.target.files?.[0] || null)}
//                     className="mt-3 w-full text-xs"
//                   />
//                   {fileV1 && (
//                     <p className="mt-2 text-xs text-slate-600 truncate">
//                       Selected:{" "}
//                       <span className="font-semibold text-slate-900">
//                         {fileV1.name}
//                       </span>
//                     </p>
//                   )}
//                 </div>
//                 <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
//                   <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700">
//                     <CloudArrowUpIcon className="h-4 w-4" />
//                     File v2 (PDF)
//                   </div>
//                   <input
//                     type="file"
//                     accept="application/pdf"
//                     onChange={(e) => setFileV2(e.target.files?.[0] || null)}
//                     className="mt-3 w-full text-xs"
//                   />
//                   {fileV2 && (
//                     <p className="mt-2 text-xs text-slate-600 truncate">
//                       Selected:{" "}
//                       <span className="font-semibold text-slate-900">
//                         {fileV2.name}
//                       </span>
//                     </p>
//                   )}
//                 </div>
//               </div>
//               {/* error */}
//               {error && (
//                 <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 font-semibold flex items-start gap-2">
//                   <ExclamationTriangleIcon className="h-5 w-5 mt-0.5" />
//                   <div className="break-words">{error}</div>
//                 </div>
//               )}
//               {/* actions */}
//               <div className="flex items-center justify-between gap-3 flex-wrap">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-60 shadow-sm"
//                   style={{ backgroundColor: FB_BLUE }}
//                   onMouseEnter={(e) => {
//                     if (!loading)
//                       e.currentTarget.style.backgroundColor = FB_BLUE_HOVER;
//                   }}
//                   onMouseLeave={(e) => {
//                     if (!loading)
//                       e.currentTarget.style.backgroundColor = FB_BLUE;
//                   }}
//                 >
//                   {loading ? (
//                     <>
//                       <ArrowPathIcon className="h-4 w-4 animate-spin" />
//                       Comparing...
//                     </>
//                   ) : (
//                     <>
//                       Compare
//                       <ArrowRightIcon className="h-4 w-4" />
//                     </>
//                   )}
//                 </button>
//                 <div className="text-xs font-semibold text-slate-500">
//                   Endpoint:{" "}
//                   <span className="font-bold text-slate-700">
//                     {API_BASE}/compare
//                   </span>
//                 </div>
//               </div>
//             </form>
//           </Card>
//           {/* Result side panel */}
//           <Card className="p-6">
//             <div className="flex items-center justify-between gap-2">
//               <div className="flex items-center gap-2">
//                 <ChartBarIcon className="h-5 w-5 text-slate-700" />
//                 <div className="text-sm font-extrabold text-slate-900">
//                   Latest Result
//                 </div>
//               </div>
//               {result && <RiskPill risk={result.risk_level} />}
//             </div>
//             {!result ? (
//               <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
//                 <p className="text-sm font-semibold text-slate-700">
//                   ยังไม่มีผลลัพธ์
//                 </p>
//                 <p className="mt-1 text-xs text-slate-600">
//                   เลือกไฟล์ v1 และ v2 แล้วกด Compare
//                 </p>
//                 <Link
//                   href="/history"
//                   className="mt-4 inline-flex items-center justify-center w-full rounded-xl border border-blue-100 bg-white px-4 py-2 text-sm font-extrabold hover:bg-blue-50"
//                   style={{ color: FB_BLUE }}
//                 >
//                   ไปหน้า History
//                 </Link>
//               </div>
//             ) : (
//               <div className="mt-4 space-y-4">
//                 <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 space-y-2">
//                   <div className="text-sm font-extrabold text-slate-900">
//                     {result.doc_name}
//                   </div>
//                   <div className="text-xs font-semibold text-slate-600">
//                     {result.v1_label} → {result.v2_label}
//                   </div>
//                   <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
//                     <div className="rounded-xl bg-white border border-blue-100 p-3">
//                       <div className="text-[11px] font-bold text-slate-500">
//                         Pages
//                       </div>
//                       <div className="mt-1 text-sm font-extrabold text-slate-900">
//                         {result.pages_v1} / {result.pages_v2}
//                       </div>
//                     </div>
//                     <div className="rounded-xl bg-white border border-blue-100 p-3">
//                       <div className="text-[11px] font-bold text-slate-500">
//                         Paragraphs
//                       </div>
//                       <div className="mt-1 text-sm font-extrabold text-slate-900">
//                         {result.paragraphs_v1} / {result.paragraphs_v2}
//                       </div>
//                     </div>
//                     <div className="col-span-2 rounded-xl bg-white border border-blue-100 p-3">
//                       <div className="text-[11px] font-bold text-slate-500">
//                         Changes
//                       </div>
//                       <div className="mt-1 text-2xl font-extrabold text-slate-900">
//                         {result.changes_count.toLocaleString()}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="text-xs font-extrabold text-slate-700">
//                     AI Summary
//                   </div>
//                   <div className="rounded-2xl border border-blue-100 bg-white p-3 text-xs text-slate-700 whitespace-pre-wrap max-h-56 overflow-auto">
//                     {result.summary_text}
//                   </div>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   <a
//                     href={`${API_BASE}${result.html_report_url}`}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-3 py-2 text-xs font-extrabold hover:bg-blue-50"
//                     style={{ color: FB_BLUE }}
//                   >
//                     HTML report
//                   </a>
//                   <a
//                     href={`${API_BASE}${result.json_report_url}`}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-3 py-2 text-xs font-extrabold hover:bg-blue-50"
//                     style={{ color: FB_BLUE }}
//                   >
//                     JSON report
//                   </a>
//                   <span className="ml-auto text-[11px] font-semibold text-slate-500">
//                     Run:{" "}
//                     <span className="font-bold text-slate-700">
//                       {result.run_id}
//                     </span>
//                   </span>
//                 </div>
//                 <Link
//                   href="/history"
//                   className="inline-flex items-center justify-center w-full rounded-xl px-4 py-2 text-sm font-extrabold text-white shadow-sm"
//                   style={{ backgroundColor: FB_BLUE }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.backgroundColor = FB_BLUE_HOVER;
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.backgroundColor = FB_BLUE;
//                   }}
//                 >
//                   ไปดูใน History
//                 </Link>
//               </div>
//             )}
//           </Card>
//         </div>
//         {/* Changes summary */}
//         {result && changes.length > 0 && (
//           <Card className="p-6">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//               <div>
//                 <div className="text-sm font-extrabold text-slate-900">
//                   Changes Summary
//                 </div>
//                 <div className="mt-1 text-xs font-semibold text-slate-600">
//                   แสดงรายการเปลี่ยนแปลงจาก JSON report
//                 </div>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {(["ALL", "ADDED", "REMOVED", "MODIFIED"] as const).map((k) => {
//                   const active = filterType === k;
//                   return (
//                     <button
//                       key={k}
//                       type="button"
//                       onClick={() => setFilterType(k as any)}
//                       className={[
//                         "rounded-full px-3 py-1 text-xs font-extrabold border transition-colors",
//                         active
//                           ? "text-white"
//                           : "bg-white text-slate-700 border-blue-100 hover:bg-blue-50",
//                       ].join(" ")}
//                       style={
//                         active
//                           ? { backgroundColor: FB_BLUE, borderColor: FB_BLUE }
//                           : undefined
//                       }
//                       onMouseEnter={(e) => {
//                         if (active)
//                           e.currentTarget.style.backgroundColor = FB_BLUE_HOVER;
//                       }}
//                       onMouseLeave={(e) => {
//                         if (active)
//                           e.currentTarget.style.backgroundColor = FB_BLUE;
//                       }}
//                     >
//                       {k}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//             <div className="mt-4 space-y-3">
//               {filteredChanges.map((c, i) => (
//                 <div
//                   key={i}
//                   className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
//                 >
//                   <div className="flex items-center justify-between gap-2">
//                     <div className="flex items-center gap-2">
//                       <ChangeBadge t={c.change_type} />
//                       <span className="text-xs font-semibold text-slate-600">
//                         {c.section_label || "—"}
//                       </span>
//                     </div>
//                     <RiskPill risk={c.risk_level || "LOW"} />
//                   </div>
//                   <div className="mt-3 grid gap-3 md:grid-cols-2 text-xs">
//                     <div>
//                       <div className="text-[11px] font-extrabold text-slate-500">
//                         Old
//                       </div>
//                       <div className="mt-1 rounded-xl border border-blue-100 bg-blue-50 p-3 text-slate-800 line-through whitespace-pre-wrap">
//                         {truncate(c.old_text)}
//                       </div>
//                     </div>
//                     <div>
//                       <div className="text-[11px] font-extrabold text-slate-500">
//                         New
//                       </div>
//                       <div className="mt-1 rounded-xl border border-blue-100 bg-blue-50 p-3 text-slate-800 whitespace-pre-wrap">
//                         {truncate(c.new_text)}
//                       </div>
//                     </div>
//                   </div>
//                   {c.ai_comment && (
//                     <div className="mt-3 rounded-xl border border-blue-100 bg-white p-3 text-xs text-slate-700">
//                       <div className="text-[11px] font-extrabold text-slate-500 flex items-center gap-1">
//                         <AdjustmentsHorizontalIcon className="h-4 w-4" />
//                         AI note
//                       </div>
//                       <div className="mt-1 whitespace-pre-wrap">
//                         {truncate(c.ai_comment, 320)}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//               {filteredChanges.length === 0 && (
//                 <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-sm font-semibold text-slate-600">
//                   ไม่มีรายการประเภทนี้
//                 </div>
//               )}
//             </div>
//           </Card>
//         )}
//         {/* Mobile history */}
//         <div className="md:hidden">
//           <Link
//             href="/history"
//             className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-white px-4 py-2 text-sm font-extrabold hover:bg-blue-50"
//             style={{ color: FB_BLUE }}
//           >
//             <ClockIcon className="h-5 w-5" />
//             ดูประวัติเปรียบเทียบ
//           </Link>
//         </div>
//         {/* global styles: file button + focus */}
//         <style jsx global>{`
//           input[type="file"]::file-selector-button {
//             background: ${FB_BLUE};
//             color: white;
//             border: 0;
//             border-radius: 9999px;
//             padding: 6px 12px;
//             font-weight: 800;
//             cursor: pointer;
//           }
//           input[type="file"]::file-selector-button:hover {
//             background: ${FB_BLUE_HOVER};
//           }
//           input:focus {
//             outline: none;
//             box-shadow: 0 0 0 3px rgba(24, 119, 242, 0.25);
//             border-color: rgba(24, 119, 242, 0.35);
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CloudArrowUpIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudArrowUpIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/CloudArrowUpIcon.js [app-ssr] (ecmascript) <export default as CloudArrowUpIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowPathIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowPathIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ArrowPathIcon.js [app-ssr] (ecmascript) <export default as ArrowPathIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$InformationCircleIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__InformationCircleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/InformationCircleIcon.js [app-ssr] (ecmascript) <export default as InformationCircleIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronDownIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ChevronDownIcon.js [app-ssr] (ecmascript) <export default as ChevronDownIcon>");
"use client";
;
;
;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE?.trim() || "http://127.0.0.1:8000";
function Home() {
    const [fileV1, setFileV1] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [fileV2, setFileV2] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [docName, setDocName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [showAdvanced, setShowAdvanced] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleSubmit = async ()=>{
        setError(null);
        if (!fileV1 || !fileV2) {
            setError("กรุณาเลือกไฟล์ PDF ทั้งสองเวอร์ชัน");
            return;
        }
        const formData = new FormData();
        formData.append("doc_name", docName || fileV1.name.replace(/\.pdf$/i, ""));
        formData.append("v1_label", "v1");
        formData.append("v2_label", "v2");
        formData.append("file_v1", fileV1);
        formData.append("file_v2", fileV2);
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/compare`, {
                method: "POST",
                body: formData
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "ไม่สามารถเปรียบเทียบเอกสารได้");
            }
            window.location.href = "/history";
        } catch (err) {
            setError(err?.message || "เกิดข้อผิดพลาด");
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 flex items-center justify-center px-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-xl space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center text-xs font-semibold text-slate-500",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-blue-600",
                            children: "1 Upload"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 728,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "mx-2",
                            children: "—"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 729,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "2 Compare"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 730,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "mx-2",
                            children: "—"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 731,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "3 Review"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 732,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 727,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-extrabold text-slate-900",
                            children: "เปรียบเทียบเอกสาร"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 737,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-sm text-slate-600",
                            children: "อัปโหลดไฟล์ PDF 2 เวอร์ชัน เพื่อดูความแตกต่าง"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 740,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 736,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl border shadow-sm p-6 space-y-5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: `border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition
              ${fileV1 ? "border-blue-500 bg-blue-50" : "hover:bg-slate-50"}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CloudArrowUpIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudArrowUpIcon$3e$__["CloudArrowUpIcon"], {
                                            className: "h-6 w-6 mx-auto text-slate-500"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 755,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 text-sm font-semibold text-slate-700",
                                            children: "เวอร์ชันเก่า (PDF)"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 756,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "file",
                                            accept: "application/pdf",
                                            className: "hidden",
                                            onChange: (e)=>setFileV1(e.target.files?.[0] || null)
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 759,
                                            columnNumber: 15
                                        }, this),
                                        fileV1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 text-xs text-slate-600 truncate",
                                            children: fileV1.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 766,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 751,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: `border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition
              ${fileV2 ? "border-blue-500 bg-blue-50" : "hover:bg-slate-50"}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CloudArrowUpIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudArrowUpIcon$3e$__["CloudArrowUpIcon"], {
                                            className: "h-6 w-6 mx-auto text-slate-500"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 777,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 text-sm font-semibold text-slate-700",
                                            children: "เวอร์ชันใหม่ (PDF)"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 778,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "file",
                                            accept: "application/pdf",
                                            className: "hidden",
                                            onChange: (e)=>setFileV2(e.target.files?.[0] || null)
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 781,
                                            columnNumber: 15
                                        }, this),
                                        fileV2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 text-xs text-slate-600 truncate",
                                            children: fileV2.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 788,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 773,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 749,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center gap-2 text-xs text-slate-500",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$InformationCircleIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__InformationCircleIcon$3e$__["InformationCircleIcon"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 797,
                                    columnNumber: 13
                                }, this),
                                "รองรับ PDF เท่านั้น · ระบบจะไม่เก็บไฟล์ถาวร"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 796,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-t border-slate-200"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 802,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setShowAdvanced((v)=>!v),
                            className: "flex items-center justify-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-800 w-full",
                            children: [
                                "ตั้งค่าเพิ่มเติม (Advanced)",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronDownIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
                                    className: `h-4 w-4 transition ${showAdvanced ? "rotate-180" : ""}`
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 811,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 805,
                            columnNumber: 11
                        }, this),
                        showAdvanced && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-xs font-semibold text-slate-700",
                                    children: "ชื่อเอกสาร (ไม่บังคับ)"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 820,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    value: docName,
                                    onChange: (e)=>setDocName(e.target.value),
                                    placeholder: "เช่น สัญญาเวอร์ชันล่าสุด",
                                    className: "w-full rounded-lg border px-3 py-2 text-sm"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 823,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 819,
                            columnNumber: 13
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm text-red-600 font-semibold text-center",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 834,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSubmit,
                            disabled: loading,
                            className: "w-full rounded-xl bg-blue-600 text-white py-3 text-sm font-extrabold hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2",
                            children: [
                                loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowPathIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowPathIcon$3e$__["ArrowPathIcon"], {
                                    className: "h-4 w-4 animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 845,
                                    columnNumber: 25
                                }, this),
                                loading ? "กำลังเปรียบเทียบ..." : "เริ่มเปรียบเทียบ"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 840,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-slate-400 text-center",
                            children: "หลังจากเปรียบเทียบแล้ว คุณสามารถดูรายงาน HTML หรือ JSON ได้"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 850,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 746,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 724,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 723,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/@heroicons/react/24/outline/esm/CloudArrowUpIcon.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
function CloudArrowUpIcon({ title, titleId, ...props }, svgRef) {
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"]("svg", Object.assign({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: svgRef,
        "aria-labelledby": titleId
    }, props), title ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"]("title", {
        id: titleId
    }, title) : null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"]("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
    }));
}
const ForwardRef = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](CloudArrowUpIcon);
const __TURBOPACK__default__export__ = ForwardRef;
}),
"[project]/node_modules/@heroicons/react/24/outline/esm/CloudArrowUpIcon.js [app-ssr] (ecmascript) <export default as CloudArrowUpIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CloudArrowUpIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CloudArrowUpIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CloudArrowUpIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/CloudArrowUpIcon.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/@heroicons/react/24/outline/esm/ArrowPathIcon.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
function ArrowPathIcon({ title, titleId, ...props }, svgRef) {
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"]("svg", Object.assign({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: svgRef,
        "aria-labelledby": titleId
    }, props), title ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"]("title", {
        id: titleId
    }, title) : null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"]("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
    }));
}
const ForwardRef = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](ArrowPathIcon);
const __TURBOPACK__default__export__ = ForwardRef;
}),
"[project]/node_modules/@heroicons/react/24/outline/esm/ArrowPathIcon.js [app-ssr] (ecmascript) <export default as ArrowPathIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArrowPathIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowPathIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowPathIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ArrowPathIcon.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/@heroicons/react/24/outline/esm/InformationCircleIcon.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
function InformationCircleIcon({ title, titleId, ...props }, svgRef) {
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"]("svg", Object.assign({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: svgRef,
        "aria-labelledby": titleId
    }, props), title ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"]("title", {
        id: titleId
    }, title) : null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"]("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
    }));
}
const ForwardRef = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](InformationCircleIcon);
const __TURBOPACK__default__export__ = ForwardRef;
}),
"[project]/node_modules/@heroicons/react/24/outline/esm/InformationCircleIcon.js [app-ssr] (ecmascript) <export default as InformationCircleIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InformationCircleIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$InformationCircleIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$InformationCircleIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/InformationCircleIcon.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/@heroicons/react/24/outline/esm/ChevronDownIcon.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
function ChevronDownIcon({ title, titleId, ...props }, svgRef) {
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"]("svg", Object.assign({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: svgRef,
        "aria-labelledby": titleId
    }, props), title ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"]("title", {
        id: titleId
    }, title) : null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"]("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "m19.5 8.25-7.5 7.5-7.5-7.5"
    }));
}
const ForwardRef = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](ChevronDownIcon);
const __TURBOPACK__default__export__ = ForwardRef;
}),
"[project]/node_modules/@heroicons/react/24/outline/esm/ChevronDownIcon.js [app-ssr] (ecmascript) <export default as ChevronDownIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChevronDownIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronDownIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronDownIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ChevronDownIcon.js [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=_8adaeacc._.js.map