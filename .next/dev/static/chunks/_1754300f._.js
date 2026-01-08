(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/history/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// // app/history/page.tsx
// "use client";
// import React, { useEffect, useState, useMemo } from "react";
// import Link from "next/link";
// import {
//   ClockIcon,
//   DocumentMagnifyingGlassIcon,
//   ArrowPathIcon,
//   ExclamationTriangleIcon,
//   EyeIcon,
//   TrashIcon,
//   FunnelIcon,
//   MagnifyingGlassIcon,
//   ArrowDownIcon,
//   ArrowUpIcon,
//   DocumentArrowDownIcon,
//   TagIcon,
//   CalendarIcon,
// } from "@heroicons/react/24/outline";
// type ComparisonItem = {
//   id: number;
//   document_name: string;
//   version_old_label: string;
//   version_new_label: string;
//   created_at: string;
//   overall_risk_level?: string | null;
//   changes_count?: number;
// };
// const API_BASE = "http://127.0.0.1:8000";
// type SortField = "name" | "date" | "risk" | "changes";
// type SortDirection = "asc" | "desc";
// type DateFilter = "ALL" | "TODAY" | "WEEK" | "MONTH";
// export default function HistoryPage() {
//   // Core states
//   const [items, setItems] = useState<ComparisonItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [deletingId, setDeletingId] = useState<number | null>(null);
//   // 🔍 Search & Filter states
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterRisk, setFilterRisk] = useState<string>("ALL");
//   const [filterDateRange, setFilterDateRange] = useState<DateFilter>("ALL");
//   const [showFilters, setShowFilters] = useState(false);
//   // 📊 Sorting states
//   const [sortField, setSortField] = useState<SortField>("date");
//   const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
//   // 🗑️ Bulk operations
//   const [selectedItems, setSelectedItems] = useState<number[]>([]);
//   // 📈 Statistics
//   const stats = useMemo(() => {
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//     const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//     return {
//       total: items.length,
//       highRisk: items.filter((i) => i.overall_risk_level === "HIGH").length,
//       mediumRisk: items.filter((i) => i.overall_risk_level === "MEDIUM").length,
//       lowRisk: items.filter((i) => i.overall_risk_level === "LOW").length,
//       today: items.filter((i) => new Date(i.created_at) >= today).length,
//       thisWeek: items.filter((i) => new Date(i.created_at) >= weekAgo).length,
//       thisMonth: items.filter((i) => new Date(i.created_at) >= monthAgo).length,
//     };
//   }, [items]);
//   // 🔄 Load data
//   useEffect(() => {
//     fetchList();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
//   const fetchList = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`${API_BASE}/comparisons?limit=100`);
//       if (!res.ok) {
//         const errData = await res.json().catch(() => ({}));
//         throw new Error(
//           errData.detail ||
//             `ไม่สามารถโหลดข้อมูลได้ (รหัส ${res.status}). ตรวจสอบว่า API server กำลังรันอยู่ที่ ${API_BASE}`
//         );
//       }
//       const data: ComparisonItem[] = await res.json();
//       setItems(data);
//     } catch (err: any) {
//       console.error("Fetch error:", err);
//       setError(err.message || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
//     } finally {
//       setLoading(false);
//     }
//   };
//   // 🔍 Filter and sort items
//   const filteredAndSortedItems = useMemo(() => {
//     let filtered = items.filter((item) => {
//       // Search filter
//       if (
//         searchTerm &&
//         !item.document_name.toLowerCase().includes(searchTerm.toLowerCase())
//       ) {
//         return false;
//       }
//       // Risk filter
//       if (filterRisk !== "ALL" && item.overall_risk_level !== filterRisk) {
//         return false;
//       }
//       // Date filter
//       if (filterDateRange !== "ALL") {
//         const itemDate = new Date(item.created_at);
//         const now = new Date();
//         const diffTime = now.getTime() - itemDate.getTime();
//         const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
//         if (filterDateRange === "TODAY" && diffDays > 0) return false;
//         if (filterDateRange === "WEEK" && diffDays > 7) return false;
//         if (filterDateRange === "MONTH" && diffDays > 30) return false;
//       }
//       return true;
//     });
//     // Sorting
//     filtered.sort((a, b) => {
//       let aVal: any, bVal: any;
//       switch (sortField) {
//         case "name":
//           aVal = a.document_name.toLowerCase();
//           bVal = b.document_name.toLowerCase();
//           break;
//         case "date":
//           aVal = new Date(a.created_at).getTime();
//           bVal = new Date(b.created_at).getTime();
//           break;
//         case "risk": {
//           const riskOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 } as const;
//           aVal = riskOrder[a.overall_risk_level as keyof typeof riskOrder] || 0;
//           bVal = riskOrder[b.overall_risk_level as keyof typeof riskOrder] || 0;
//           break;
//         }
//         case "changes":
//           aVal = a.changes_count || 0;
//           bVal = b.changes_count || 0;
//           break;
//         default:
//           return 0;
//       }
//       return sortDirection === "asc"
//         ? aVal > bVal
//           ? 1
//           : -1
//         : aVal < bVal
//         ? 1
//         : -1;
//     });
//     return filtered;
//   }, [items, searchTerm, filterRisk, filterDateRange, sortField, sortDirection]);
//   // 🗑️ Delete single item
//   const deleteItem = async (id: number) => {
//     if (!confirm("คุณต้องการลบรายการนี้ใช่หรือไม่?")) return;
//     setDeletingId(id);
//     try {
//       const res = await fetch(`${API_BASE}/comparisons/${id}`, {
//         method: "DELETE",
//       });
//       if (!res.ok) {
//         throw new Error("ลบไม่สำเร็จ");
//       }
//       setItems((prev) => prev.filter((item) => item.id !== id));
//       setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
//     } catch (err: any) {
//       alert("ลบไม่สำเร็จ: " + (err.message || "โปรดลองอีกครั้ง"));
//     } finally {
//       setDeletingId(null);
//     }
//   };
//   // 🗑️ Bulk delete
//   const deleteSelected = async () => {
//     if (
//       !selectedItems.length ||
//       !confirm(`คุณต้องการลบ ${selectedItems.length} รายการที่เลือกใช่หรือไม่?`)
//     )
//       return;
//     try {
//       const promises = selectedItems.map((id) =>
//         fetch(`${API_BASE}/comparisons/${id}`, { method: "DELETE" }).then((res) =>
//           res.ok ? { success: true, id } : { success: false, id }
//         )
//       );
//       const results = await Promise.all(promises);
//       const failed = results.filter((r) => !r.success);
//       if (failed.length > 0) {
//         alert(`ลบ ${failed.length} รายการไม่สำเร็จ`);
//       }
//       fetchList();
//       setSelectedItems([]);
//     } catch {
//       alert("เกิดข้อผิดพลาดในการลบหลายรายการ");
//     }
//   };
//   // 📋 Bulk selection
//   const toggleSelectItem = (id: number) => {
//     setSelectedItems((prev) =>
//       prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
//     );
//   };
//   const selectAllVisible = () => {
//     const visibleIds = filteredAndSortedItems.map((item) => item.id);
//     if (selectedItems.length === visibleIds.length) {
//       setSelectedItems([]);
//     } else {
//       setSelectedItems(visibleIds);
//     }
//   };
//   // 📊 Export functions
//   const exportToCSV = () => {
//     const headers = [
//       "ID",
//       "Document Name",
//       "Version Old",
//       "Version New",
//       "Created At",
//       "Risk Level",
//       "Changes Count",
//     ];
//     const csvRows = [
//       headers.join(","),
//       ...filteredAndSortedItems.map((item) =>
//         [
//           item.id,
//           `"${item.document_name.replace(/"/g, '""')}"`,
//           item.version_old_label,
//           item.version_new_label,
//           new Date(item.created_at).toISOString(),
//           item.overall_risk_level || "N/A",
//           item.changes_count || 0,
//         ].join(",")
//       ),
//     ];
//     const csvString = csvRows.join("\n");
//     const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `document_comparisons_${new Date()
//       .toISOString()
//       .split("T")[0]}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
//   };
//   const exportToJSON = () => {
//     const dataStr = JSON.stringify(filteredAndSortedItems, null, 2);
//     const blob = new Blob([dataStr], { type: "application/json" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `document_comparisons_${new Date().getTime()}.json`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
//   };
//   // 🔄 Sorting handler
//   const handleSort = (field: SortField) => {
//     if (sortField === field) {
//       setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
//     } else {
//       setSortField(field);
//       setSortDirection("desc");
//     }
//   };
//   // 📅 Format date
//   const formatDate = (iso: string) => {
//     try {
//       const date = new Date(iso);
//       return date.toLocaleDateString("th-TH", {
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch {
//       return iso;
//     }
//   };
//   // 📈 Risk badge
//   const RiskBadge = ({ risk }: { risk?: string | null }) => {
//     const base = "px-2 py-1 rounded-full text-xs font-medium";
//     const level = risk || "UNKNOWN";
//     if (level.includes("HIGH")) {
//       return <span className={`${base} bg-red-100 text-red-700`}>สูง</span>;
//     }
//     if (level.includes("MEDIUM")) {
//       return <span className={`${base} bg-amber-100 text-amber-700`}>กลาง</span>;
//     }
//     if (level.includes("LOW")) {
//       return (
//         <span className={`${base} bg-emerald-100 text-emerald-700`}>ต่ำ</span>
//       );
//     }
//     return <span className={`${base} bg-slate-100 text-slate-600`}>ไม่ระบุ</span>;
//   };
//   return (
//     <div className="max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
//           <div>
//             <div className="flex items-center gap-3 mb-2">
//               <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
//                 <ClockIcon className="h-6 w-6" />
//               </div>
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
//                   ประวัติการเปรียบเทียบเอกสาร
//                 </h1>
//                 <p className="text-slate-600 mt-1">
//                   จัดการและค้นหาประวัติการเปรียบเทียบทั้งหมดของคุณ
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="flex flex-wrap gap-3">
//             <button
//               onClick={exportToCSV}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-100 font-medium"
//             >
//               <DocumentArrowDownIcon className="h-4 w-4" />
//               Export CSV
//             </button>
//             <button
//               onClick={exportToJSON}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 font-medium"
//             >
//               <DocumentArrowDownIcon className="h-4 w-4" />
//               Export JSON
//             </button>
//             <Link
//               href="/"
//               className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 font-medium"
//             >
//               <DocumentMagnifyingGlassIcon className="h-4 w-4" />
//               เปรียบเทียบใหม่
//             </Link>
//           </div>
//         </div>
//       </div>
//       {/* 📊 Statistics */}
//       <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
//         <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
//           <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
//           <div className="text-sm text-slate-600 flex items-center gap-2 mt-1">
//             <TagIcon className="h-4 w-4" />
//             ทั้งหมด
//           </div>
//         </div>
//         <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
//           <div className="text-2xl font-bold text-red-600">{stats.highRisk}</div>
//           <div className="text-sm text-slate-600">ความเสี่ยงสูง</div>
//         </div>
//         <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
//           <div className="text-2xl font-bold text-amber-600">
//             {stats.mediumRisk}
//           </div>
//           <div className="text-sm text-slate-600">ความเสี่ยงกลาง</div>
//         </div>
//         <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
//           <div className="text-2xl font-bold text-emerald-600">{stats.lowRisk}</div>
//           <div className="text-sm text-slate-600">ความเสี่ยงต่ำ</div>
//         </div>
//         <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
//           <div className="text-2xl font-bold text-slate-600">{stats.thisWeek}</div>
//           <div className="text-sm text-slate-600 flex items-center gap-2 mt-1">
//             <CalendarIcon className="h-4 w-4" />
//             สัปดาห์นี้
//           </div>
//         </div>
//         <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
//           <div className="text-2xl font-bold text-slate-600">{stats.today}</div>
//           <div className="text-sm text-slate-600">วันนี้</div>
//         </div>
//       </div>
//       {/* 🔍 Search & Filter Bar */}
//       <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
//         <div className="p-4 border-b border-slate-100">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
//                   showFilters
//                     ? "bg-blue-50 text-blue-700 border border-blue-200"
//                     : "bg-slate-50 text-slate-700 border border-slate-200"
//                 }`}
//               >
//                 <FunnelIcon className="h-4 w-4" />
//                 {showFilters ? "ซ่อนตัวกรอง" : "แสดงตัวกรอง"}
//               </button>
//               <div className="text-sm text-slate-600">
//                 แสดง{" "}
//                 <span className="font-bold">{filteredAndSortedItems.length}</span>{" "}
//                 จาก {items.length} รายการ
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={fetchList}
//                 disabled={loading}
//                 className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium disabled:opacity-50"
//               >
//                 <ArrowPathIcon
//                   className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
//                 />
//                 รีเฟรช
//               </button>
//             </div>
//           </div>
//           {showFilters && (
//             <div className="mt-4 pt-4 border-t border-slate-100">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {/* Search */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     ค้นหาเอกสาร
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       placeholder="พิมพ์ชื่อเอกสาร..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                     <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
//                   </div>
//                 </div>
//                 {/* Risk */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     ระดับความเสี่ยง
//                   </label>
//                   <select
//                     value={filterRisk}
//                     onChange={(e) => setFilterRisk(e.target.value)}
//                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="ALL">ทั้งหมด</option>
//                     <option value="HIGH">สูง</option>
//                     <option value="MEDIUM">กลาง</option>
//                     <option value="LOW">ต่ำ</option>
//                   </select>
//                 </div>
//                 {/* Date */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     ช่วงเวลา
//                   </label>
//                   <select
//                     value={filterDateRange}
//                     onChange={(e) =>
//                       setFilterDateRange(e.target.value as DateFilter)
//                     }
//                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="ALL">ทุกเวลา</option>
//                     <option value="TODAY">วันนี้</option>
//                     <option value="WEEK">สัปดาห์นี้</option>
//                     <option value="MONTH">เดือนนี้</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       {/* 🗑️ Bulk Actions */}
//       {selectedItems.length > 0 && (
//         <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div className="flex items-center gap-3">
//               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">
//                 {selectedItems.length}
//               </div>
//               <div>
//                 <h3 className="font-medium text-blue-900">
//                   เลือก {selectedItems.length} รายการ
//                 </h3>
//                 <p className="text-sm text-blue-700">
//                   คุณสามารถดำเนินการกับรายการที่เลือกทั้งหมดพร้อมกัน
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={deleteSelected}
//                 className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
//               >
//                 <TrashIcon className="h-4 w-4" />
//                 ลบที่เลือก
//               </button>
//               <button
//                 onClick={() => setSelectedItems([])}
//                 className="px-3 py-1.5 text-sm text-blue-700 hover:text-blue-900"
//               >
//                 ยกเลิกการเลือกทั้งหมด
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* Table */}
//       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//         <div className="border-b border-slate-200 p-4 grid grid-cols-12 gap-4 text-sm font-semibold text-slate-700 bg-slate-50">
//           <div className="col-span-1">
//             <input
//               type="checkbox"
//               checked={
//                 selectedItems.length > 0 &&
//                 selectedItems.length === filteredAndSortedItems.length
//               }
//               onChange={selectAllVisible}
//               className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
//             />
//           </div>
//           <div
//             className="col-span-4 flex items-center gap-1 cursor-pointer hover:text-blue-600 select-none"
//             onClick={() => handleSort("name")}
//           >
//             ชื่อเอกสาร
//             {sortField === "name" &&
//               (sortDirection === "asc" ? (
//                 <ArrowUpIcon className="h-3 w-3" />
//               ) : (
//                 <ArrowDownIcon className="h-3 w-3" />
//               ))}
//           </div>
//           <div className="col-span-2">เวอร์ชัน</div>
//           <div
//             className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-blue-600 select-none"
//             onClick={() => handleSort("date")}
//           >
//             วันที่เปรียบเทียบ
//             {sortField === "date" &&
//               (sortDirection === "asc" ? (
//                 <ArrowUpIcon className="h-3 w-3" />
//               ) : (
//                 <ArrowDownIcon className="h-3 w-3" />
//               ))}
//           </div>
//           <div
//             className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-blue-600 select-none"
//             onClick={() => handleSort("risk")}
//           >
//             ระดับความเสี่ยง
//             {sortField === "risk" &&
//               (sortDirection === "asc" ? (
//                 <ArrowUpIcon className="h-3 w-3" />
//               ) : (
//                 <ArrowDownIcon className="h-3 w-3" />
//               ))}
//           </div>
//           <div className="col-span-1 text-right">การดำเนินการ</div>
//         </div>
//         {loading && (
//           <div className="p-8 text-center">
//             <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto text-blue-600" />
//             <p className="mt-4 text-slate-600 font-medium">กำลังโหลดข้อมูล...</p>
//             <p className="text-sm text-slate-500 mt-1">กรุณารอสักครู่</p>
//           </div>
//         )}
//         {error && !loading && (
//           <div className="p-8 text-center">
//             <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
//               <ExclamationTriangleIcon className="h-6 w-6" />
//             </div>
//             <h3 className="font-bold text-slate-900 mb-2">ไม่สามารถโหลดข้อมูล</h3>
//             <p className="text-slate-600 mb-4 max-w-md mx-auto">{error}</p>
//             <div className="flex flex-col sm:flex-row gap-3 justify-center">
//               <button
//                 onClick={fetchList}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
//               >
//                 ลองอีกครั้ง
//               </button>
//               <Link
//                 href="/"
//                 className="px-4 py-2 bg-slate-100 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-200 font-medium"
//               >
//                 ไปเปรียบเทียบเอกสารใหม่
//               </Link>
//             </div>
//           </div>
//         )}
//         {!loading && !error && filteredAndSortedItems.length === 0 && (
//           <div className="p-8 text-center">
//             <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
//               <DocumentMagnifyingGlassIcon className="h-8 w-8" />
//             </div>
//             <h3 className="font-bold text-slate-900 mb-2">
//               {items.length === 0 ? "ยังไม่มีประวัติการเปรียบเทียบ" : "ไม่พบผลลัพธ์"}
//             </h3>
//             <p className="text-slate-600 mb-6 max-w-md mx-auto">
//               {items.length === 0
//                 ? "เริ่มต้นด้วยการเปรียบเทียบเอกสารสองเวอร์ชันเพื่อสร้างประวัติแรกของคุณ"
//                 : "ลองเปลี่ยนคำค้นหาหรือตัวกรองเพื่อดูผลลัพธ์อื่นๆ"}
//             </p>
//             <Link
//               href="/"
//               className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:opacity-90"
//             >
//               <DocumentMagnifyingGlassIcon className="h-5 w-5" />
//               ไปเปรียบเทียบเอกสาร
//             </Link>
//           </div>
//         )}
//         {!loading && !error && filteredAndSortedItems.length > 0 && (
//           <div className="divide-y divide-slate-100">
//             {filteredAndSortedItems.map((item) => (
//               <div
//                 key={item.id}
//                 className={`p-4 grid grid-cols-12 gap-4 items-center transition-colors ${
//                   selectedItems.includes(item.id) ? "bg-blue-50" : "hover:bg-slate-50"
//                 }`}
//               >
//                 <div className="col-span-1">
//                   <input
//                     type="checkbox"
//                     checked={selectedItems.includes(item.id)}
//                     onChange={() => toggleSelectItem(item.id)}
//                     className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="col-span-4">
//                   <div className="font-medium text-slate-900 line-clamp-1">
//                     {item.document_name}
//                   </div>
//                   <div className="flex items-center gap-2 mt-1">
//                     <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
//                       ID: {item.id}
//                     </span>
//                     {item.changes_count !== undefined && (
//                       <span className="text-xs px-1.5 py-0.5 bg-violet-100 text-violet-700 rounded">
//                         {item.changes_count} การเปลี่ยนแปลง
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <div className="col-span-2">
//                   <div className="flex items-center gap-2">
//                     <span className="px-2 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded">
//                       {item.version_old_label}
//                     </span>
//                     <span className="text-slate-400">→</span>
//                     <span className="px-2 py-1 bg-fuchsia-100 text-fuchsia-700 text-xs font-medium rounded">
//                       {item.version_new_label}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="col-span-2">
//                   <div className="text-sm text-slate-900 font-medium">
//                     {formatDate(item.created_at)}
//                   </div>
//                 </div>
//                 <div className="col-span-2">
//                   <RiskBadge risk={item.overall_risk_level} />
//                 </div>
//                 <div className="col-span-1">
//                   <div className="flex items-center justify-end gap-1">
//                     <Link
//                       href={`/compare/${item.id}`}
//                       className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                       title="ดูรายละเอียด"
//                     >
//                       <EyeIcon className="h-5 w-5" />
//                     </Link>
//                     <button
//                       onClick={() => deleteItem(item.id)}
//                       disabled={deletingId === item.id}
//                       className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
//                       title="ลบรายการ"
//                     >
//                       {deletingId === item.id ? (
//                         <ArrowPathIcon className="h-5 w-5 animate-spin" />
//                       ) : (
//                         <TrashIcon className="h-5 w-5" />
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//         {!loading && !error && filteredAndSortedItems.length > 0 && (
//           <div className="border-t border-slate-200 p-4 bg-slate-50">
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//               <div className="text-sm text-slate-600">
//                 แสดง <span className="font-medium">{filteredAndSortedItems.length}</span>{" "}
//                 รายการ{searchTerm && ` สำหรับ "${searchTerm}"`}
//               </div>
//               <div className="text-sm text-slate-600">
//                 เรียงตาม:
//                 <select
//                   value={sortField}
//                   onChange={(e) => setSortField(e.target.value as SortField)}
//                   className="ml-2 px-2 py-1 border border-slate-300 rounded text-sm"
//                 >
//                   <option value="date">วันที่ (ล่าสุด)</option>
//                   <option value="name">ชื่อเอกสาร</option>
//                   <option value="risk">ระดับความเสี่ยง</option>
//                   <option value="changes">จำนวนการเปลี่ยนแปลง</option>
//                 </select>
//                 <select
//                   value={sortDirection}
//                   onChange={(e) =>
//                     setSortDirection(e.target.value as SortDirection)
//                   }
//                   className="ml-2 px-2 py-1 border border-slate-300 rounded text-sm"
//                 >
//                   <option value="desc">จากมากไปน้อย</option>
//                   <option value="asc">จากน้อยไปมาก</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>HistoryPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ClockIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClockIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ClockIcon.js [app-client] (ecmascript) <export default as ClockIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowPathIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowPathIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ArrowPathIcon.js [app-client] (ecmascript) <export default as ArrowPathIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$EyeIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/EyeIcon.js [app-client] (ecmascript) <export default as EyeIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$TrashIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrashIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/TrashIcon.js [app-client] (ecmascript) <export default as TrashIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$FunnelIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FunnelIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/FunnelIcon.js [app-client] (ecmascript) <export default as FunnelIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$MagnifyingGlassIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MagnifyingGlassIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/MagnifyingGlassIcon.js [app-client] (ecmascript) <export default as MagnifyingGlassIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$DocumentArrowDownIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DocumentArrowDownIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/DocumentArrowDownIcon.js [app-client] (ecmascript) <export default as DocumentArrowDownIcon>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
/* =======================
   Config
======================= */ const API_BASE = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_BASE?.trim() || "http://127.0.0.1:8000";
function HistoryPage() {
    _s();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [deletingId, setDeletingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // search / filter
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [filterRisk, setFilterRisk] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("ALL");
    const [filterDateRange, setFilterDateRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("ALL");
    const [showFilters, setShowFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // sort
    const [sortField, setSortField] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("date");
    const [sortDirection, setSortDirection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("desc");
    // bulk
    const [selectedItems, setSelectedItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    /* =======================
     Load
  ======================= */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HistoryPage.useEffect": ()=>{
            fetchList();
        }
    }["HistoryPage.useEffect"], []);
    const fetchList = async ()=>{
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/comparisons?limit=100`);
            if (!res.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ");
            const data = await res.json();
            setItems(data);
        } catch (err) {
            setError(err.message || "เกิดข้อผิดพลาด");
        } finally{
            setLoading(false);
        }
    };
    /* =======================
     Filter + Sort
  ======================= */ const filteredAndSortedItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HistoryPage.useMemo[filteredAndSortedItems]": ()=>{
            let filtered = items.filter({
                "HistoryPage.useMemo[filteredAndSortedItems].filtered": (item)=>{
                    if (searchTerm && !item.document_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
                    if (filterRisk !== "ALL" && item.overall_risk_level !== filterRisk) return false;
                    if (filterDateRange !== "ALL") {
                        const d = new Date(item.created_at);
                        const now = new Date();
                        const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
                        if (filterDateRange === "TODAY" && diffDays > 1) return false;
                        if (filterDateRange === "WEEK" && diffDays > 7) return false;
                        if (filterDateRange === "MONTH" && diffDays > 30) return false;
                    }
                    return true;
                }
            }["HistoryPage.useMemo[filteredAndSortedItems].filtered"]);
            filtered.sort({
                "HistoryPage.useMemo[filteredAndSortedItems]": (a, b)=>{
                    let aVal;
                    let bVal;
                    switch(sortField){
                        case "name":
                            aVal = a.document_name.toLowerCase();
                            bVal = b.document_name.toLowerCase();
                            break;
                        case "date":
                            aVal = new Date(a.created_at).getTime();
                            bVal = new Date(b.created_at).getTime();
                            break;
                        case "risk":
                            {
                                const order = {
                                    HIGH: 3,
                                    MEDIUM: 2,
                                    LOW: 1
                                };
                                aVal = order[a.overall_risk_level || "LOW"];
                                bVal = order[b.overall_risk_level || "LOW"];
                                break;
                            }
                        case "changes":
                            aVal = a.changes_count || 0;
                            bVal = b.changes_count || 0;
                            break;
                    }
                    return sortDirection === "asc" ? aVal > bVal ? 1 : -1 : aVal < bVal ? 1 : -1;
                }
            }["HistoryPage.useMemo[filteredAndSortedItems]"]);
            return filtered;
        }
    }["HistoryPage.useMemo[filteredAndSortedItems]"], [
        items,
        searchTerm,
        filterRisk,
        filterDateRange,
        sortField,
        sortDirection
    ]);
    /* =======================
     Utils
  ======================= */ const formatDate = (iso)=>new Date(iso).toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        });
    const RiskBadge = ({ risk })=>{
        if (risk === "HIGH") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "px-2 py-1 rounded-full text-xs bg-red-100 text-red-700",
            children: "สูง"
        }, void 0, false, {
            fileName: "[project]/app/history/page.tsx",
            lineNumber: 971,
            columnNumber: 9
        }, this);
        if (risk === "MEDIUM") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700",
            children: "กลาง"
        }, void 0, false, {
            fileName: "[project]/app/history/page.tsx",
            lineNumber: 977,
            columnNumber: 9
        }, this);
        if (risk === "LOW") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700",
            children: "ต่ำ"
        }, void 0, false, {
            fileName: "[project]/app/history/page.tsx",
            lineNumber: 983,
            columnNumber: 9
        }, this);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-600",
            children: "-"
        }, void 0, false, {
            fileName: "[project]/app/history/page.tsx",
            lineNumber: 988,
            columnNumber: 7
        }, this);
    };
    /* =======================
     Delete
  ======================= */ const deleteItem = async (id)=>{
        if (!confirm("ต้องการลบรายการนี้หรือไม่")) return;
        setDeletingId(id);
        try {
            await fetch(`${API_BASE}/comparisons/${id}`, {
                method: "DELETE"
            });
            setItems((prev)=>prev.filter((i)=>i.id !== id));
        } finally{
            setDeletingId(null);
        }
    };
    /* =======================
     Render
  ======================= */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-7xl mx-auto p-6 space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ClockIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClockIcon$3e$__["ClockIcon"], {
                                className: "h-6 w-6 text-blue-600"
                            }, void 0, false, {
                                fileName: "[project]/app/history/page.tsx",
                                lineNumber: 1016,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-xl font-bold",
                                children: "ประวัติการเปรียบเทียบ"
                            }, void 0, false, {
                                fileName: "[project]/app/history/page.tsx",
                                lineNumber: 1017,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/history/page.tsx",
                        lineNumber: 1015,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium",
                        children: "เปรียบเทียบใหม่"
                    }, void 0, false, {
                        fileName: "[project]/app/history/page.tsx",
                        lineNumber: 1019,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/history/page.tsx",
                lineNumber: 1014,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white border rounded-lg p-3 flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$MagnifyingGlassIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MagnifyingGlassIcon$3e$__["MagnifyingGlassIcon"], {
                        className: "h-5 w-5 text-slate-400"
                    }, void 0, false, {
                        fileName: "[project]/app/history/page.tsx",
                        lineNumber: 1029,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: searchTerm,
                        onChange: (e)=>setSearchTerm(e.target.value),
                        placeholder: "ค้นหาชื่อเอกสาร...",
                        className: "flex-1 outline-none text-sm"
                    }, void 0, false, {
                        fileName: "[project]/app/history/page.tsx",
                        lineNumber: 1030,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowFilters((v)=>!v),
                        className: "text-sm text-slate-600",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$FunnelIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FunnelIcon$3e$__["FunnelIcon"], {
                                className: "h-4 w-4 inline"
                            }, void 0, false, {
                                fileName: "[project]/app/history/page.tsx",
                                lineNumber: 1040,
                                columnNumber: 11
                            }, this),
                            " ตัวกรอง"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/history/page.tsx",
                        lineNumber: 1036,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/history/page.tsx",
                lineNumber: 1028,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white border rounded-xl overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold bg-slate-50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-span-4",
                                children: "เอกสาร"
                            }, void 0, false, {
                                fileName: "[project]/app/history/page.tsx",
                                lineNumber: 1047,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-span-2",
                                children: "เวอร์ชัน"
                            }, void 0, false, {
                                fileName: "[project]/app/history/page.tsx",
                                lineNumber: 1048,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-span-2",
                                children: "วันที่"
                            }, void 0, false, {
                                fileName: "[project]/app/history/page.tsx",
                                lineNumber: 1049,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-span-2",
                                children: "ความเสี่ยง"
                            }, void 0, false, {
                                fileName: "[project]/app/history/page.tsx",
                                lineNumber: 1050,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-span-2 text-right",
                                children: "การดำเนินการ"
                            }, void 0, false, {
                                fileName: "[project]/app/history/page.tsx",
                                lineNumber: 1051,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/history/page.tsx",
                        lineNumber: 1046,
                        columnNumber: 9
                    }, this),
                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowPathIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowPathIcon$3e$__["ArrowPathIcon"], {
                            className: "h-6 w-6 animate-spin mx-auto text-blue-600"
                        }, void 0, false, {
                            fileName: "[project]/app/history/page.tsx",
                            lineNumber: 1056,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/history/page.tsx",
                        lineNumber: 1055,
                        columnNumber: 11
                    }, this),
                    !loading && filteredAndSortedItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-12 gap-4 px-4 py-3 border-t items-center hover:bg-slate-50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "font-medium",
                                            children: item.document_name
                                        }, void 0, false, {
                                            fileName: "[project]/app/history/page.tsx",
                                            lineNumber: 1067,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-slate-500",
                                            children: [
                                                item.changes_count ?? 0,
                                                " การเปลี่ยนแปลง"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/history/page.tsx",
                                            lineNumber: 1068,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/history/page.tsx",
                                    lineNumber: 1066,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2 text-xs",
                                    children: [
                                        item.version_old_label,
                                        " → ",
                                        item.version_new_label
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/history/page.tsx",
                                    lineNumber: 1073,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2 text-sm",
                                    children: formatDate(item.created_at)
                                }, void 0, false, {
                                    fileName: "[project]/app/history/page.tsx",
                                    lineNumber: 1077,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RiskBadge, {
                                        risk: item.overall_risk_level
                                    }, void 0, false, {
                                        fileName: "[project]/app/history/page.tsx",
                                        lineNumber: 1082,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/history/page.tsx",
                                    lineNumber: 1081,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2 flex justify-end gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/compare/${item.id}`,
                                            className: "p-2 hover:bg-blue-50 rounded",
                                            title: "ดูรายละเอียด",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$EyeIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeIcon$3e$__["EyeIcon"], {
                                                className: "h-5 w-5 text-slate-600"
                                            }, void 0, false, {
                                                fileName: "[project]/app/history/page.tsx",
                                                lineNumber: 1091,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/history/page.tsx",
                                            lineNumber: 1086,
                                            columnNumber: 17
                                        }, this),
                                        item.html_report_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: `${API_BASE}${item.html_report_url}`,
                                            target: "_blank",
                                            className: "p-2 hover:bg-emerald-50 rounded",
                                            title: "HTML report",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$DocumentArrowDownIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DocumentArrowDownIcon$3e$__["DocumentArrowDownIcon"], {
                                                className: "h-5 w-5 text-emerald-600"
                                            }, void 0, false, {
                                                fileName: "[project]/app/history/page.tsx",
                                                lineNumber: 1101,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/history/page.tsx",
                                            lineNumber: 1095,
                                            columnNumber: 19
                                        }, this),
                                        item.json_report_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: `${API_BASE}${item.json_report_url}`,
                                            target: "_blank",
                                            className: "p-2 hover:bg-violet-50 rounded",
                                            title: "JSON report",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$DocumentArrowDownIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DocumentArrowDownIcon$3e$__["DocumentArrowDownIcon"], {
                                                className: "h-5 w-5 text-violet-600"
                                            }, void 0, false, {
                                                fileName: "[project]/app/history/page.tsx",
                                                lineNumber: 1112,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/history/page.tsx",
                                            lineNumber: 1106,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>deleteItem(item.id),
                                            disabled: deletingId === item.id,
                                            className: "p-2 hover:bg-red-50 rounded",
                                            children: deletingId === item.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowPathIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowPathIcon$3e$__["ArrowPathIcon"], {
                                                className: "h-5 w-5 animate-spin text-red-600"
                                            }, void 0, false, {
                                                fileName: "[project]/app/history/page.tsx",
                                                lineNumber: 1122,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$TrashIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrashIcon$3e$__["TrashIcon"], {
                                                className: "h-5 w-5 text-red-600"
                                            }, void 0, false, {
                                                fileName: "[project]/app/history/page.tsx",
                                                lineNumber: 1124,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/history/page.tsx",
                                            lineNumber: 1116,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/history/page.tsx",
                                    lineNumber: 1085,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, item.id, true, {
                            fileName: "[project]/app/history/page.tsx",
                            lineNumber: 1062,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/app/history/page.tsx",
                lineNumber: 1045,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/history/page.tsx",
        lineNumber: 1012,
        columnNumber: 5
    }, this);
}
_s(HistoryPage, "SFvepYSnaSm9al5/2hCtBUt0UDA=");
_c = HistoryPage;
var _c;
__turbopack_context__.k.register(_c, "HistoryPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/@heroicons/react/24/outline/esm/ArrowPathIcon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
function ArrowPathIcon({ title, titleId, ...props }, svgRef) {
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("svg", Object.assign({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: svgRef,
        "aria-labelledby": titleId
    }, props), title ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("title", {
        id: titleId
    }, title) : null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
    }));
}
const ForwardRef = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](ArrowPathIcon);
const __TURBOPACK__default__export__ = ForwardRef;
}),
"[project]/node_modules/@heroicons/react/24/outline/esm/ArrowPathIcon.js [app-client] (ecmascript) <export default as ArrowPathIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArrowPathIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowPathIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowPathIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ArrowPathIcon.js [app-client] (ecmascript)");
}),
"[project]/node_modules/@heroicons/react/24/outline/esm/EyeIcon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
function EyeIcon({ title, titleId, ...props }, svgRef) {
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("svg", Object.assign({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: svgRef,
        "aria-labelledby": titleId
    }, props), title ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("title", {
        id: titleId
    }, title) : null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    }), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    }));
}
const ForwardRef = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](EyeIcon);
const __TURBOPACK__default__export__ = ForwardRef;
}),
"[project]/node_modules/@heroicons/react/24/outline/esm/EyeIcon.js [app-client] (ecmascript) <export default as EyeIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EyeIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$EyeIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$EyeIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/EyeIcon.js [app-client] (ecmascript)");
}),
"[project]/node_modules/@heroicons/react/24/outline/esm/TrashIcon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
function TrashIcon({ title, titleId, ...props }, svgRef) {
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("svg", Object.assign({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: svgRef,
        "aria-labelledby": titleId
    }, props), title ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("title", {
        id: titleId
    }, title) : null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    }));
}
const ForwardRef = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](TrashIcon);
const __TURBOPACK__default__export__ = ForwardRef;
}),
"[project]/node_modules/@heroicons/react/24/outline/esm/TrashIcon.js [app-client] (ecmascript) <export default as TrashIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TrashIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$TrashIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$TrashIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/TrashIcon.js [app-client] (ecmascript)");
}),
"[project]/node_modules/@heroicons/react/24/outline/esm/FunnelIcon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
function FunnelIcon({ title, titleId, ...props }, svgRef) {
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("svg", Object.assign({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: svgRef,
        "aria-labelledby": titleId
    }, props), title ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("title", {
        id: titleId
    }, title) : null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
    }));
}
const ForwardRef = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](FunnelIcon);
const __TURBOPACK__default__export__ = ForwardRef;
}),
"[project]/node_modules/@heroicons/react/24/outline/esm/FunnelIcon.js [app-client] (ecmascript) <export default as FunnelIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FunnelIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$FunnelIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$FunnelIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/FunnelIcon.js [app-client] (ecmascript)");
}),
"[project]/node_modules/@heroicons/react/24/outline/esm/DocumentArrowDownIcon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
function DocumentArrowDownIcon({ title, titleId, ...props }, svgRef) {
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("svg", Object.assign({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: svgRef,
        "aria-labelledby": titleId
    }, props), title ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("title", {
        id: titleId
    }, title) : null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
    }));
}
const ForwardRef = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](DocumentArrowDownIcon);
const __TURBOPACK__default__export__ = ForwardRef;
}),
"[project]/node_modules/@heroicons/react/24/outline/esm/DocumentArrowDownIcon.js [app-client] (ecmascript) <export default as DocumentArrowDownIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DocumentArrowDownIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$DocumentArrowDownIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$DocumentArrowDownIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/DocumentArrowDownIcon.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_1754300f._.js.map