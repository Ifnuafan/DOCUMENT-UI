module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// "use client";
// import React, { useState } from "react";
// import {
//   DocumentMagnifyingGlassIcon,
//   CloudArrowUpIcon,
//   ArrowPathIcon,
//   ArrowRightIcon,
//   ExclamationTriangleIcon,
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
//   json_report_path: string;
//   html_report_path: string;
//   run_id: number;
//   html_report_url: string;
//   json_report_url: string;
// };
// export default function Home() {
//   const [docName, setDocName] = useState("TestDoc");
//   const [v1Label, setV1Label] = useState("v1");
//   const [v2Label, setV2Label] = useState("v2");
//   const [fileV1, setFileV1] = useState<File | null>(null);
//   const [fileV2, setFileV2] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [result, setResult] = useState<CompareResult | null>(null);
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setResult(null);
//     if (!fileV1 || !fileV2) {
//       setError("กรุณาเลือกไฟล์ PDF ทั้งสองเวอร์ชันก่อนเริ่มเปรียบเทียบ");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("doc_name", docName);
//     formData.append("v1_label", v1Label);
//     formData.append("v2_label", v2Label);
//     formData.append("file_v1", fileV1);
//     formData.append("file_v2", fileV2);
//     setLoading(true);
//     try {
//       const res = await fetch("http://127.0.0.1:8000/compare", {
//         method: "POST",
//         body: formData,
//       });
//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         throw new Error(
//           data.error || `เรียก API ไม่สำเร็จ (status ${res.status})`
//         );
//       }
//       const data: CompareResult = await res.json();
//       setResult(data);
//     } catch (err: any) {
//       setError(err.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const riskColor = (risk: string) => {
//     const level = risk.toLowerCase();
//     if (level.includes("สูง") || level.includes("high")) {
//       return "bg-red-100 text-red-700 border-red-200";
//     }
//     if (level.includes("กลาง") || level.includes("medium")) {
//       return "bg-amber-100 text-amber-700 border-amber-200";
//     }
//     return "bg-emerald-100 text-emerald-700 border-emerald-200";
//   };
//   return (
//     <main className="min-h-screen bg-gradient-to-br from-[#f6e9ff] via-[#f7f0ff] to-[#e3d4ff] flex items-center justify-center px-4 py-8">
//       <div className="w-full max-w-6xl">
//         {/* Card หลัก */}
//         <div className="relative overflow-hidden rounded-3xl bg-white/80 shadow-2xl border border-white/60 backdrop-blur-md">
//           {/* แถบไล่สีด้านบน */}
//           <div className="h-2 w-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-pink-400" />
//           <div className="grid gap-8 p-6 md:p-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
//             {/* ซ้าย: ฟอร์ม */}
//             <section className="space-y-6">
//               {/* Header */}
//               <div className="flex items-start gap-3">
//                 <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-pink-400 shadow-lg text-white">
//                   <DocumentMagnifyingGlassIcon className="h-7 w-7" />
//                 </div>
//                 <div>
//                   <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 border border-violet-100 mb-1">
//                     Document Diff Assistant
//                   </div>
//                   <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
//                     เปรียบเทียบเอกสาร 2 เวอร์ชันแบบฉลาด
//                   </h1>
//                   <p className="mt-1 text-sm text-slate-600">
//                     อัปโหลดไฟล์ PDF สองเวอร์ชัน ระบบจะช่วยหาความแตกต่าง
//                     สรุปผล และประเมินระดับความเสี่ยงให้โดยอัตโนมัติ
//                   </p>
//                 </div>
//               </div>
//               {/* ฟอร์ม */}
//               <form onSubmit={handleSubmit} className="space-y-5">
//                 {/* ชื่อเอกสาร + labels */}
//                 <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
//                   <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
//                     ข้อมูลเอกสาร
//                   </p>
//                   <div className="grid gap-3 md:grid-cols-3">
//                     <div className="space-y-1.5">
//                       <label className="text-xs font-medium text-slate-700">
//                         ชื่อเอกสาร (doc_name)
//                       </label>
//                       <input
//                         type="text"
//                         value={docName}
//                         onChange={(e) => setDocName(e.target.value)}
//                         className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
//                       />
//                     </div>
//                     <div className="space-y-1.5">
//                       <label className="text-xs font-medium text-slate-700">
//                         Label เวอร์ชัน 1
//                       </label>
//                       <input
//                         type="text"
//                         value={v1Label}
//                         onChange={(e) => setV1Label(e.target.value)}
//                         className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
//                       />
//                     </div>
//                     <div className="space-y-1.5">
//                       <label className="text-xs font-medium text-slate-700">
//                         Label เวอร์ชัน 2
//                       </label>
//                       <input
//                         type="text"
//                         value={v2Label}
//                         onChange={(e) => setV2Label(e.target.value)}
//                         className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 {/* เลือกไฟล์ */}
//                 <div className="grid gap-4 md:grid-cols-2">
//                   <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/60 px-4 py-3">
//                     <label className="flex items-center justify-between gap-2">
//                       <div className="space-y-1">
//                         <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
//                           เวอร์ชัน 1 (PDF)
//                         </p>
//                         <p className="text-xs text-violet-700/80">
//                           เลือกไฟล์เวอร์ชันเก่า เช่น draft แรก หรือเวอร์ชันก่อนปรับ
//                         </p>
//                       </div>
//                       <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm border border-violet-100">
//                         <CloudArrowUpIcon className="h-5 w-5 text-violet-500" />
//                       </div>
//                     </label>
//                     <div className="mt-2">
//                       <input
//                         type="file"
//                         accept="application/pdf"
//                         onChange={(e) =>
//                           setFileV1(e.target.files?.[0] || null)
//                         }
//                         className="w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-violet-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-violet-600"
//                       />
//                       {fileV1 && (
//                         <p className="mt-1 text-xs text-violet-800 truncate">
//                           เลือกไฟล์: <span className="font-medium">{fileV1.name}</span>
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="rounded-2xl border border-dashed border-fuchsia-200 bg-fuchsia-50/60 px-4 py-3">
//                     <label className="flex items-center justify-between gap-2">
//                       <div className="space-y-1">
//                         <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-700">
//                           เวอร์ชัน 2 (PDF)
//                         </p>
//                         <p className="text-xs text-fuchsia-700/80">
//                           เลือกไฟล์เวอร์ชันใหม่ เช่น เวอร์ชันล่าสุดหลังแก้ไข
//                         </p>
//                       </div>
//                       <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm border border-fuchsia-100">
//                         <CloudArrowUpIcon className="h-5 w-5 text-fuchsia-500" />
//                       </div>
//                     </label>
//                     <div className="mt-2">
//                       <input
//                         type="file"
//                         accept="application/pdf"
//                         onChange={(e) =>
//                           setFileV2(e.target.files?.[0] || null)
//                         }
//                         className="w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-fuchsia-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-fuchsia-600"
//                       />
//                       {fileV2 && (
//                         <p className="mt-1 text-xs text-fuchsia-800 truncate">
//                           เลือกไฟล์: <span className="font-medium">{fileV2.name}</span>
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 {/* error */}
//                 {error && (
//                   <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50/80 px-3 py-2.5 text-xs text-red-700">
//                     <ExclamationTriangleIcon className="mt-0.5 h-4 w-4" />
//                     <p>{error}</p>
//                   </div>
//                 )}
//                 {/* ปุ่ม */}
//                 <div className="flex items-center justify-between gap-3 flex-wrap">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:brightness-105 disabled:from-slate-400 disabled:via-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed transition-all"
//                   >
//                     {loading ? (
//                       <>
//                         <ArrowPathIcon className="h-4 w-4 animate-spin" />
//                         กำลังเปรียบเทียบ...
//                       </>
//                     ) : (
//                       <>
//                         เริ่มเปรียบเทียบเอกสาร
//                         <ArrowRightIcon className="h-4 w-4" />
//                       </>
//                     )}
//                   </button>
//                   <p className="text-[11px] text-slate-500">
//                     ระบบจะอัปโหลดไฟล์ไปที่เซิร์ฟเวอร์ FastAPI ที่{" "}
//                     <span className="font-medium text-slate-700">
//                       http://127.0.0.1:8000/compare
//                     </span>
//                   </p>
//                 </div>
//               </form>
//             </section>
//             {/* ขวา: ผลลัพธ์ / Hint */}
//             <section className="space-y-4">
//               {result ? (
//                 <>
//                   <div className="rounded-2xl border border-slate-100 bg-white/90 shadow-sm p-4 space-y-4">
//                     <div className="flex items-center justify-between gap-2">
//                       <h2 className="text-sm font-semibold text-slate-900">
//                         ✅ ผลการเปรียบเทียบล่าสุด
//                       </h2>
//                       <span
//                         className={`inline-flex items-center rounded-full border px-3 py-0.5 text-[11px] font-semibold ${riskColor(
//                           result.risk_level
//                         )}`}
//                       >
//                         ระดับความเสี่ยง: {result.risk_level}
//                       </span>
//                     </div>
//                     {/* Stats */}
//                     <div className="grid gap-3 text-xs md:grid-cols-2">
//                       <div className="space-y-1.5">
//                         <p className="text-slate-500">เอกสาร</p>
//                         <p className="text-sm font-semibold text-slate-900">
//                           {result.doc_name}
//                         </p>
//                         <p className="text-[11px] text-slate-500">
//                           เปรียบเทียบจาก{" "}
//                           <span className="font-medium text-violet-700">
//                             {result.v1_label}
//                           </span>{" "}
//                           →{" "}
//                           <span className="font-medium text-fuchsia-700">
//                             {result.v2_label}
//                           </span>
//                         </p>
//                       </div>
//                       <div className="grid grid-cols-2 gap-2">
//                         <div className="rounded-xl bg-slate-50 px-3 py-2">
//                           <p className="text-[11px] text-slate-500">
//                             Pages (v1 / v2)
//                           </p>
//                           <p className="text-sm font-semibold text-slate-900">
//                             {result.pages_v1} / {result.pages_v2}
//                           </p>
//                         </div>
//                         <div className="rounded-xl bg-slate-50 px-3 py-2">
//                           <p className="text-[11px] text-slate-500">
//                             Paragraphs (v1 / v2)
//                           </p>
//                           <p className="text-sm font-semibold text-slate-900">
//                             {result.paragraphs_v1} / {result.paragraphs_v2}
//                           </p>
//                         </div>
//                         <div className="rounded-xl bg-slate-50 px-3 py-2 col-span-2">
//                           <p className="text-[11px] text-slate-500">
//                             จำนวนจุดที่เปลี่ยนแปลง
//                           </p>
//                           <p className="text-lg font-extrabold text-violet-600">
//                             {result.changes_count.toLocaleString()}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     {/* Summary */}
//                     <div className="space-y-1.5">
//                       <p className="text-xs font-semibold text-slate-800">
//                         สรุปจาก AI
//                       </p>
//                       <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 max-h-60 overflow-auto text-xs text-slate-700 whitespace-pre-wrap">
//                         {result.summary_text}
//                       </div>
//                     </div>
//                     {/* Links */}
//                     <div className="flex flex-wrap items-center gap-3 text-xs">
//                       <a
//                         href={`http://127.0.0.1:8000${result.html_report_url}`}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 font-medium text-violet-700 hover:bg-violet-100"
//                       >
//                         เปิด HTML report
//                       </a>
//                       <a
//                         href={`http://127.0.0.1:8000${result.json_report_url}`}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-medium text-slate-700 hover:bg-slate-100"
//                       >
//                         ดาวน์โหลด JSON
//                       </a>
//                       <span className="text-[11px] text-slate-400">
//                         Run ID: {result.run_id}
//                       </span>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   {/* Empty state / Hint */}
//                   <div className="rounded-2xl border border-slate-100 bg-white/90 shadow-sm p-4 space-y-3">
//                     <p className="text-xs font-semibold text-slate-900">
//                       📝 วิธีใช้งานแบบเร็ว ๆ
//                     </p>
//                     <ol className="space-y-1.5 text-xs text-slate-600 list-decimal list-inside">
//                       <li>ใส่ชื่อเอกสาร และกำหนด label เช่น v1 / v2</li>
//                       <li>เลือกไฟล์ PDF เวอร์ชันเก่า และเวอร์ชันใหม่</li>
//                       <li>กดปุ่ม “เริ่มเปรียบเทียบเอกสาร”</li>
//                       <li>ดูจำนวนการเปลี่ยนแปลง + สรุปจาก AI ด้านล่าง</li>
//                     </ol>
//                   </div>
//                   <div className="rounded-2xl border border-dashed border-violet-200 bg-gradient-to-br from-violet-50/90 via-fuchsia-50/90 to-pink-50/90 p-5 flex flex-col items-center justify-center text-center space-y-3">
//                     <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 shadow-md border border-violet-100">
//                       <DocumentMagnifyingGlassIcon className="h-8 w-8 text-violet-500" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-slate-900">
//                         ยังไม่มีผลลัพธ์การเปรียบเทียบ
//                       </p>
//                       <p className="mt-1 text-xs text-slate-600">
//                         ลองเลือกไฟล์ PDF สองเวอร์ชัน แล้วกดปุ่มเปรียบเทียบ
//                         เพื่อดูความต่างทั้งหมดในคลิกเดียว
//                       </p>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </section>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function Home() {
    const [docName, setDocName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("TestDoc");
    const [v1Label, setV1Label] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("v1");
    const [v2Label, setV2Label] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("v2");
    const [fileV1, setFileV1] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [fileV2, setFileV2] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // 🆕 เก็บ change จาก JSON report
    const [changes, setChanges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filterType, setFilterType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("ALL");
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError(null);
        setResult(null);
        setChanges([]);
        if (!fileV1 || !fileV2) {
            setError("กรุณาเลือกไฟล์ PDF ทั้งสองเวอร์ชัน");
            return;
        }
        const formData = new FormData();
        formData.append("doc_name", docName);
        formData.append("v1_label", v1Label);
        formData.append("v2_label", v2Label);
        formData.append("file_v1", fileV1);
        formData.append("file_v2", fileV2);
        setLoading(true);
        try {
            const res = await fetch("http://127.0.0.1:8000/compare", {
                method: "POST",
                body: formData
            });
            if (!res.ok) {
                const data = await res.json().catch(()=>({}));
                throw new Error(data.error || `เรียก API ไม่สำเร็จ (status ${res.status})`);
            }
            const data = await res.json();
            setResult(data);
            // 🆕 ดึง JSON report เพิ่ม
            try {
                const jsonRes = await fetch(`http://127.0.0.1:8000${data.json_report_url}`);
                if (jsonRes.ok) {
                    const json = await jsonRes.json();
                    setChanges(json.changes || []);
                }
            } catch (e) {
                console.warn("โหลด JSON report ไม่สำเร็จ", e);
            }
        } catch (err) {
            setError(err.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
        } finally{
            setLoading(false);
        }
    };
    const filteredChanges = filterType === "ALL" ? changes : changes.filter((c)=>c.change_type === filterType);
    const renderChangeBadge = (t)=>{
        const base = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold";
        if (t === "ADDED") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `${base} bg-emerald-100 text-emerald-700`,
            children: "ADDED"
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 525,
            columnNumber: 9
        }, this);
        if (t === "REMOVED") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `${base} bg-rose-100 text-rose-700`,
            children: "REMOVED"
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 531,
            columnNumber: 9
        }, this);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `${base} bg-amber-100 text-amber-700`,
            children: "MODIFIED"
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 536,
            columnNumber: 7
        }, this);
    };
    const truncate = (text, len = 200)=>{
        if (!text) return "";
        return text.length > len ? text.slice(0, len) + "..." : text;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-slate-100 flex items-center justify-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-6xl bg-white shadow-lg rounded-2xl p-6 space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-2xl font-bold text-slate-800",
                    children: "🔍 Document Versioning Compare"
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 550,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-slate-600",
                    children: "อัปโหลดเอกสาร 2 เวอร์ชัน แล้วให้ระบบช่วยเปรียบเทียบความแตกต่าง"
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 553,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-slate-700 mb-1",
                                            children: "ชื่อเอกสาร (doc_name)"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 561,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: docName,
                                            onChange: (e)=>setDocName(e.target.value),
                                            className: "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 564,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 560,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-slate-700 mb-1",
                                            children: "Label เวอร์ชัน 1"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 572,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: v1Label,
                                            onChange: (e)=>setV1Label(e.target.value),
                                            className: "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 575,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 571,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-slate-700 mb-1",
                                            children: "Label เวอร์ชัน 2"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 583,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: v2Label,
                                            onChange: (e)=>setV2Label(e.target.value),
                                            className: "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 586,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 582,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 559,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-slate-700 mb-1",
                                            children: "เวอร์ชัน 1 (PDF)"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 598,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "file",
                                            accept: "application/pdf",
                                            onChange: (e)=>setFileV1(e.target.files?.[0] || null),
                                            className: "w-full text-sm"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 601,
                                            columnNumber: 15
                                        }, this),
                                        fileV1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-slate-500 mt-1",
                                            children: [
                                                "เลือกไฟล์: ",
                                                fileV1.name
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 608,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 597,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-slate-700 mb-1",
                                            children: "เวอร์ชัน 2 (PDF)"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 614,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "file",
                                            accept: "application/pdf",
                                            onChange: (e)=>setFileV2(e.target.files?.[0] || null),
                                            className: "w-full text-sm"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 617,
                                            columnNumber: 15
                                        }, this),
                                        fileV2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-slate-500 mt-1",
                                            children: [
                                                "เลือกไฟล์: ",
                                                fileV2.name
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 624,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 613,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 596,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2",
                            children: [
                                "⚠️ ",
                                error
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 633,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            disabled: loading,
                            className: "inline-flex items-center px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 disabled:bg-slate-400",
                            children: loading ? "กำลังเปรียบเทียบ..." : "เปรียบเทียบเอกสาร"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 638,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 557,
                    columnNumber: 9
                }, this),
                result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4 border-t pt-4 space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-semibold text-slate-800",
                            children: "✅ ผลการเปรียบเทียบ"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 650,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-3 text-sm",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: "Document:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 657,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            result.doc_name
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 656,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: "Compare:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 661,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            result.v1_label,
                                            " → ",
                                            result.v2_label
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 660,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: "Pages:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 665,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            "v1=",
                                            result.pages_v1,
                                            ", v2=",
                                            result.pages_v2
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 664,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: "Paragraphs:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 669,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            "v1=",
                                            result.paragraphs_v1,
                                            ", v2=",
                                            result.paragraphs_v2
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 668,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: "Changes:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 673,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            result.changes_count
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 672,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: "Risk Level:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 677,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            result.risk_level
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 676,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 655,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 654,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2 text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-medium",
                                    children: "สรุปจาก AI:"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 684,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border rounded-lg bg-slate-50 px-3 py-2 max-h-60 overflow-auto whitespace-pre-wrap",
                                    children: result.summary_text
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 685,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 683,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-3 text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: `http://127.0.0.1:8000${result.html_report_url}`,
                                    target: "_blank",
                                    rel: "noreferrer",
                                    className: "text-sky-700 underline",
                                    children: "เปิด HTML report (ฝั่งเซิร์ฟเวอร์)"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 691,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: `http://127.0.0.1:8000${result.json_report_url}`,
                                    target: "_blank",
                                    rel: "noreferrer",
                                    className: "text-slate-700 underline",
                                    children: "ดาวน์โหลด JSON report"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 700,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-slate-500",
                                    children: [
                                        "Run ID: ",
                                        result.run_id
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 709,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 690,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 649,
                    columnNumber: 11
                }, this),
                changes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6 border-t pt-4 space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-semibold text-slate-800",
                                    children: "📄 รายการการเปลี่ยนแปลง (Summary บนหน้าเว็บ)"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 720,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2 text-xs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setFilterType("ALL"),
                                            className: `px-2 py-1 rounded-full border ${filterType === "ALL" ? "bg-slate-800 text-white" : "bg-white text-slate-700"}`,
                                            children: "ALL"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 724,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setFilterType("ADDED"),
                                            className: `px-2 py-1 rounded-full border ${filterType === "ADDED" ? "bg-emerald-100 text-emerald-800" : "bg-white text-slate-700"}`,
                                            children: "ADDED"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 735,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setFilterType("REMOVED"),
                                            className: `px-2 py-1 rounded-full border ${filterType === "REMOVED" ? "bg-rose-100 text-rose-800" : "bg-white text-slate-700"}`,
                                            children: "REMOVED"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 746,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setFilterType("MODIFIED"),
                                            className: `px-2 py-1 rounded-full border ${filterType === "MODIFIED" ? "bg-amber-100 text-amber-800" : "bg-white text-slate-700"}`,
                                            children: "MODIFIED"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 757,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 723,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 719,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3 max-h-[480px] overflow-auto pr-1 text-sm",
                            children: [
                                filteredChanges.map((c, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border rounded-lg p-3 bg-slate-50 space-y-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between gap-2",
                                                children: [
                                                    renderChangeBadge(c.change_type),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-slate-500",
                                                        children: c.section_label
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 779,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 777,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 md:grid-cols-2 gap-3 mt-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs font-medium text-slate-500 mb-1",
                                                                children: "Old Text"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 785,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs bg-rose-50 text-rose-900 rounded-md px-2 py-1 line-through whitespace-pre-wrap",
                                                                children: truncate(c.old_text)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 788,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 784,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs font-medium text-slate-500 mb-1",
                                                                children: "New Text"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 793,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs bg-emerald-50 text-emerald-900 rounded-md px-2 py-1 whitespace-pre-wrap",
                                                                children: truncate(c.new_text)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 796,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 792,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 783,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 773,
                                        columnNumber: 17
                                    }, this)),
                                filteredChanges.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-slate-500",
                                    children: "ไม่มีรายการประเภทนี้"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 804,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 771,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 718,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 549,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 548,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__73ae023d._.js.map