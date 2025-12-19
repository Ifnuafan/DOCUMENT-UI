// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// export default function ComparisonDetailPage() {
//   const params = useParams();
//   const id = Array.isArray(params.id) ? params.id[0] : params.id;

//   const [detail, setDetail] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   // 🆕 state สำหรับเรียก AI
//   const [annotating, setAnnotating] = useState(false);
//   const [annotateError, setAnnotateError] = useState<string | null>(null);

//   const API_BASE = "http://127.0.0.1:8000";

//   // โหลด detail ครั้งแรก + เวลา id เปลี่ยน
//   useEffect(() => {
//     async function load() {
//       setLoading(true);
//       setAnnotateError(null); // เคลียร์ error รอบเก่า
//       try {
//         const res = await fetch(`${API_BASE}/comparisons/${id}`);
//         if (!res.ok) {
//           const data = await res.json().catch(() => ({}));
//           throw new Error(
//             data.detail || `โหลดรายละเอียดไม่สำเร็จ (status ${res.status})`
//           );
//         }
//         const data = await res.json();
//         setDetail(data);
//       } catch (err: any) {
//         setDetail(null);
//       } finally {
//         setLoading(false);
//       }
//     }
//     if (id) {
//       load();
//     }
//   }, [id]);

//   // 🆕 ฟังก์ชันเรียก AI เติม ai_comment
//   const handleAnnotate = async () => {
//     if (!id) return;
//     setAnnotating(true);
//     setAnnotateError(null);

//     try {
//       const res = await fetch(`${API_BASE}/comparisons/${id}/annotate`, {
//         method: "POST",
//         headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         },

//       });

//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         throw new Error(
//           data.detail || `เรียก AI วิเคราะห์ไม่สำเร็จ (status ${res.status})`
//         );
//       }

//       // เรียก detail อีกรอบ เพื่อดึง ai_comment ที่เพิ่งถูกเขียน
//       const detailRes = await fetch(`${API_BASE}/comparisons/${id}`);
//       const detailData = await detailRes.json();
//       setDetail(detailData);
//     } catch (err: any) {
//       setAnnotateError(
//         err.message || "เกิดข้อผิดพลาดขณะเรียก AI วิเคราะห์"
//       );
//     } finally {
//       setAnnotating(false);
//     }
//   };

//   if (loading) return <div className="p-6">Loading detail...</div>;
//   if (!detail) return <div className="p-6">Not found</div>;

//   return (
//     <div className="p-8 space-y-6">
//       <h1 className="text-2xl font-bold">
//         Comparison Detail — #{detail.id}
//       </h1>

//       {/* Summary Panel */}
//       <div className="p-4 border bg-white rounded shadow-sm space-y-3">
//         <div className="flex justify-between items-start gap-3">
//           <div>
//             <div className="font-semibold">
//               {detail.document_name} — {detail.version_old_label} →{" "}
//               {detail.version_new_label}
//             </div>

//             <div className="text-sm text-gray-600 mt-1">
//               Run at: {new Date(detail.created_at).toLocaleString()}
//             </div>
//           </div>

//           <div className="flex flex-col items-end gap-2">
//             {/* ปุ่มให้ AI วิเคราะห์ */}
//             <button
//               type="button"
//               onClick={handleAnnotate}
//               disabled={annotating}
//               className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-xs font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-60 disabled:cursor-not-allowed"
//             >
//               {annotating ? "กำลังให้ AI วิเคราะห์..." : "ให้ AI วิเคราะห์การเปลี่ยนแปลง"}
//             </button>

//             {/* Overall risk */}
//             <span
//               className={`px-3 py-1 rounded text-white text-xs ${
//                 detail.overall_risk_level === "HIGH"
//                   ? "bg-red-600"
//                   : detail.overall_risk_level === "MEDIUM"
//                   ? "bg-yellow-600"
//                   : "bg-green-600"
//               }`}
//             >
//              {detail.overall_risk_level ?? "UNKNOWN"}

//             </span>
//           </div>
//         </div>

//         {/* แสดง error จาก AI ถ้ามี */}
//         {annotateError && (
//           <div className="mt-1 text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">
//             {annotateError}
//           </div>
//         )}

//         <p className="text-sm mt-2 whitespace-pre-line">
//           {detail.summary_text}
//         </p>
//       </div>

//       {/* Change items */}
//       <div className="space-y-4">
//         <h2 className="text-xl font-semibold">Changes</h2>

//         {Array.isArray(detail.changes) && detail.changes.map((c: any) => (
//           <div
//             key={c.id}
//             className="border p-4 rounded bg-gray-50 shadow-sm space-y-2"
//           >
//             <div className="flex justify-between items-center">
//               <div className="font-semibold">{c.change_type}</div>

//               {/* Risk badge */}
//               <span
//                 className={`px-2 py-1 rounded text-white text-xs ${
//                   c.risk_level === "HIGH"
//                     ? "bg-red-500"
//                     : c.risk_level === "MEDIUM"
//                     ? "bg-yellow-500"
//                     : "bg-green-500"
//                 }`}
//               >
//                 {c.risk_level}
//               </span>
//             </div>

//             <div className="text-sm text-gray-600">{c.section_label}</div>

//             <div className="mt-2 space-y-1">
//               {c.old_text && (
//                 <p className="text-xs text-red-700">
//                   <strong>Old:</strong> {c.old_text}
//                 </p>
//               )}
//               {c.new_text && (
//                 <p className="text-xs text-green-700 mt-1">
//                   <strong>New:</strong> {c.new_text}
//                 </p>
//               )}
//             </div>

//            {c.ai_comment && (
//        <div className="mt-2 text-xs text-blue-700 bg-blue-100 p-2 rounded">
//     <strong>AI Comment:</strong> {c.ai_comment}
//   </div>
// )}

//       {c.ai_suggestion && (
//         <div className="mt-2 text-xs text-indigo-700 bg-indigo-100 p-2 rounded">
//        <strong>AI Suggestion:</strong> {c.ai_suggestion}
//     </div>
// )}

//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
