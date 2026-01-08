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
  DocumentArrowDownIcon,
  TagIcon,
  CalendarIcon,
  ChevronRightIcon,
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon,
  Bars3BottomLeftIcon,
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
  const [showFilters, setShowFilters] = useState(true);

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
      highRisk: items.filter((i) => i.overall_risk_level === "HIGH").length,
      mediumRisk: items.filter((i) => i.overall_risk_level === "MEDIUM").length,
      lowRisk: items.filter((i) => i.overall_risk_level === "LOW").length,
      today: items.filter((i) => new Date(i.created_at) >= today).length,
      thisWeek: items.filter((i) => new Date(i.created_at) >= weekAgo).length,
      thisMonth: items.filter((i) => new Date(i.created_at) >= monthAgo).length,
    };
  }, [items]);

  // 🔄 Load data
  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            `ไม่สามารถโหลดข้อมูลได้ (รหัส ${res.status}). ตรวจสอบว่า API server กำลังรันอยู่ที่ ${API_BASE}`
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
    let filtered = items.filter((item) => {
      // Search filter
      if (
        searchTerm &&
        !item.document_name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
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
        case "risk": {
          const riskOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 } as const;
          aVal = riskOrder[a.overall_risk_level as keyof typeof riskOrder] || 0;
          bVal = riskOrder[b.overall_risk_level as keyof typeof riskOrder] || 0;
          break;
        }
        case "changes":
          aVal = a.changes_count || 0;
          bVal = b.changes_count || 0;
          break;
        default:
          return 0;
      }

      return sortDirection === "asc"
        ? aVal > bVal
          ? 1
          : -1
        : aVal < bVal
        ? 1
        : -1;
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

      setItems((prev) => prev.filter((item) => item.id !== id));
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    } catch (err: any) {
      alert("ลบไม่สำเร็จ: " + (err.message || "โปรดลองอีกครั้ง"));
    } finally {
      setDeletingId(null);
    }
  };

  // 🗑️ Bulk delete
  const deleteSelected = async () => {
    if (
      !selectedItems.length ||
      !confirm(`คุณต้องการลบ ${selectedItems.length} รายการที่เลือกใช่หรือไม่?`)
    )
      return;

    try {
      const promises = selectedItems.map((id) =>
        fetch(`${API_BASE}/comparisons/${id}`, { method: "DELETE" }).then((res) =>
          res.ok ? { success: true, id } : { success: false, id }
        )
      );

      const results = await Promise.all(promises);
      const failed = results.filter((r) => !r.success);

      if (failed.length > 0) {
        alert(`ลบ ${failed.length} รายการไม่สำเร็จ`);
      }

      fetchList();
      setSelectedItems([]);
    } catch {
      alert("เกิดข้อผิดพลาดในการลบหลายรายการ");
    }
  };

  // 📋 Bulk selection
  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const selectAllVisible = () => {
    const visibleIds = filteredAndSortedItems.map((item) => item.id);
    if (selectedItems.length === visibleIds.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(visibleIds);
    }
  };

  // 📊 Export functions
  const exportToCSV = () => {
    const headers = [
      "ID",
      "Document Name",
      "Version Old",
      "Version New",
      "Created At",
      "Risk Level",
      "Changes Count",
    ];

    const csvRows = [
      headers.join(","),
      ...filteredAndSortedItems.map((item) =>
        [
          item.id,
          `"${item.document_name.replace(/"/g, '""')}"`,
          item.version_old_label,
          item.version_new_label,
          new Date(item.created_at).toISOString(),
          item.overall_risk_level || "N/A",
          item.changes_count || 0,
        ].join(",")
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `document_comparisons_${new Date()
      .toISOString()
      .split("T")[0]}.csv`;
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
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // 📅 Format date
  const formatDate = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleDateString("th-TH", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  // 📈 Risk badge
  const RiskBadge = ({ risk }: { risk?: string | null }) => {
    const base = "px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5";
    const level = risk || "UNKNOWN";

    if (level.includes("HIGH")) {
      return (
        <span className={`${base} bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200`}>
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          ความเสี่ยงสูง
        </span>
      );
    }
    if (level.includes("MEDIUM")) {
      return (
        <span className={`${base} bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border border-amber-200`}>
          <div className="h-2 w-2 rounded-full bg-amber-500"></div>
          ความเสี่ยงกลาง
        </span>
      );
    }
    if (level.includes("LOW")) {
      return (
        <span className={`${base} bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border border-emerald-200`}>
          <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
          ความเสี่ยงต่ำ
        </span>
      );
    }
    return (
      <span className={`${base} bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 border border-slate-200`}>
        <div className="h-2 w-2 rounded-full bg-slate-400"></div>
        ไม่ระบุความเสี่ยง
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              หน้าแรก
            </Link>
            <ChevronRightIcon className="h-3 w-3" />
            <span className="font-medium text-blue-700">ประวัติการเปรียบเทียบ</span>
          </nav>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="relative">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                    <ClockIcon className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                    <Bars3BottomLeftIcon className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    ประวัติการเปรียบเทียบเอกสาร
                  </h1>
                  <p className="text-slate-600 mt-1">
                    จัดการและค้นหาประวัติการเปรียบเทียบทั้งหมดของคุณในที่เดียว
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex gap-2">
                <button
                  onClick={exportToCSV}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-all duration-200 shadow-sm hover:shadow"
                >
                  <DocumentArrowDownIcon className="h-4 w-4" />
                  CSV
                </button>
                <button
                  onClick={exportToJSON}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-all duration-200 shadow-sm hover:shadow"
                >
                  <DocumentArrowDownIcon className="h-4 w-4" />
                  JSON
                </button>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:opacity-90 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <DocumentMagnifyingGlassIcon className="h-5 w-5" />
                เปรียบเทียบใหม่
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-slate-500 mt-1">ทั้งหมด</div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <TagIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-red-600">{stats.highRisk}</div>
                <div className="text-sm text-slate-500 mt-1">เสี่ยงสูง</div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${stats.total ? (stats.highRisk / stats.total * 100) : 0}%` }}></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-amber-600">{stats.mediumRisk}</div>
                <div className="text-sm text-slate-500 mt-1">เสี่ยงกลาง</div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <InformationCircleIcon className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${stats.total ? (stats.mediumRisk / stats.total * 100) : 0}%` }}></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-emerald-600">{stats.lowRisk}</div>
                <div className="text-sm text-slate-500 mt-1">เสี่ยงต่ำ</div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CheckIcon className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.total ? (stats.lowRisk / stats.total * 100) : 0}%` }}></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-violet-600">{stats.thisWeek}</div>
                <div className="text-sm text-slate-500 mt-1">สัปดาห์นี้</div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-violet-50 flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-violet-600" />
              </div>
            </div>
            <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 rounded-full" style={{ width: `${stats.total ? (stats.thisWeek / stats.total * 100) : 0}%` }}></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-cyan-600">{stats.today}</div>
                <div className="text-sm text-slate-500 mt-1">วันนี้</div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-cyan-50 flex items-center justify-center">
                <ClockIcon className="h-5 w-5 text-cyan-600" />
              </div>
            </div>
            <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${stats.total ? (stats.today / stats.total * 100) : 0}%` }}></div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">ตัวกรองข้อมูล</h2>
                <FunnelIcon className="h-5 w-5 text-slate-500" />
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    ค้นหาเอกสาร
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="พิมพ์ชื่อเอกสาร..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 transition-all duration-200"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  </div>
                </div>

                {/* Risk Level */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    ระดับความเสี่ยง
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "ALL", label: "ทั้งหมด", color: "bg-slate-200" },
                      { value: "HIGH", label: "สูง", color: "bg-red-500" },
                      { value: "MEDIUM", label: "กลาง", color: "bg-amber-500" },
                      { value: "LOW", label: "ต่ำ", color: "bg-emerald-500" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFilterRisk(option.value)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${filterRisk === option.value
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-slate-50"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${option.color}`}></div>
                          <span className="text-sm">{option.label}</span>
                        </div>
                        {filterRisk === option.value && (
                          <CheckIcon className="h-4 w-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    ช่วงเวลา
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "ALL", label: "ทุกเวลา" },
                      { value: "TODAY", label: "วันนี้" },
                      { value: "WEEK", label: "สัปดาห์นี้" },
                      { value: "MONTH", label: "เดือนนี้" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFilterDateRange(option.value as DateFilter)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${filterDateRange === option.value
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-slate-50"
                          }`}
                      >
                        <span className="text-sm">{option.label}</span>
                        {filterDateRange === option.value && (
                          <CheckIcon className="h-4 w-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results Count */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="text-sm text-slate-600">
                    <div className="flex justify-between mb-2">
                      <span>พบทั้งหมด</span>
                      <span className="font-bold text-slate-900">{filteredAndSortedItems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>จากทั้งหมด</span>
                      <span className="font-bold text-slate-900">{items.length}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={fetchList}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-medium transition-all duration-200 disabled:opacity-50"
                  >
                    <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    รีเฟรชข้อมูล
                  </button>
                  {(searchTerm || filterRisk !== "ALL" || filterDateRange !== "ALL") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setFilterRisk("ALL");
                        setFilterDateRange("ALL");
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 font-medium transition-all duration-200"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      ล้างตัวกรองทั้งหมด
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Table */}
          <div className="lg:w-3/4">
            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="mb-6 p-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
                      {selectedItems.length}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">
                        เลือก {selectedItems.length} รายการ
                      </h3>
                      <p className="text-blue-100">
                        เลือกดำเนินการกับรายการที่เลือกทั้งหมด
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={deleteSelected}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-red-600 rounded-xl hover:bg-red-50 font-bold transition-all duration-200"
                    >
                      <TrashIcon className="h-4 w-4" />
                      ลบที่เลือก
                    </button>
                    <button
                      onClick={() => setSelectedItems([])}
                      className="px-4 py-2.5 text-white hover:text-blue-100 font-medium transition-colors"
                    >
                      ยกเลิกการเลือก
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Table Header */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
              <div className="p-5 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">รายการเปรียบเทียบ</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      จัดเรียงและจัดการประวัติการเปรียบเทียบทั้งหมด
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={sortField}
                      onChange={(e) => setSortField(e.target.value as SortField)}
                      className="px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="date">เรียงตามวันที่</option>
                      <option value="name">เรียงตามชื่อ</option>
                      <option value="risk">เรียงตามความเสี่ยง</option>
                      <option value="changes">เรียงตามการเปลี่ยนแปลง</option>
                    </select>
                    <button
                      onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                      className="p-2 border border-slate-300 rounded-xl hover:bg-slate-50"
                    >
                      {sortDirection === "asc" ? (
                        <ArrowUpIcon className="h-4 w-4" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Table Content */}
              {loading && (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center">
                    <div className="relative">
                      <ArrowPathIcon className="h-12 w-12 animate-spin text-blue-600" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ClockIcon className="h-6 w-6 text-blue-400" />
                      </div>
                    </div>
                  </div>
                  <p className="mt-6 text-slate-700 font-medium">กำลังโหลดข้อมูล...</p>
                  <p className="text-sm text-slate-500 mt-2">กรุณารอสักครู่</p>
                </div>
              )}

              {error && !loading && (
                <div className="p-12 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-6">
                    <ExclamationTriangleIcon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">ไม่สามารถโหลดข้อมูล</h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">{error}</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={fetchList}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
                    >
                      ลองอีกครั้ง
                    </button>
                    <Link
                      href="/"
                      className="px-5 py-2.5 bg-slate-100 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-200 font-medium"
                    >
                      ไปเปรียบเทียบใหม่
                    </Link>
                  </div>
                </div>
              )}

              {!loading && !error && filteredAndSortedItems.length === 0 && (
                <div className="p-12 text-center">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 mb-6">
                    <DocumentMagnifyingGlassIcon className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {items.length === 0 ? "ยังไม่มีประวัติการเปรียบเทียบ" : "ไม่พบผลลัพธ์"}
                  </h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    {items.length === 0
                      ? "เริ่มต้นด้วยการเปรียบเทียบเอกสารสองเวอร์ชันเพื่อสร้างประวัติแรกของคุณ"
                      : "ลองเปลี่ยนคำค้นหาหรือตัวกรองเพื่อดูผลลัพธ์อื่นๆ"}
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:opacity-90 shadow-lg"
                  >
                    <DocumentMagnifyingGlassIcon className="h-5 w-5" />
                    เริ่มเปรียบเทียบเอกสาร
                  </Link>
                </div>
              )}

              {!loading && !error && filteredAndSortedItems.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-4">
                          <input
                            type="checkbox"
                            checked={
                              selectedItems.length > 0 &&
                              selectedItems.length === filteredAndSortedItems.length
                            }
                            onChange={selectAllVisible}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        <th className="p-4 text-left text-sm font-bold text-slate-700">เอกสาร</th>
                        <th className="p-4 text-left text-sm font-bold text-slate-700">เวอร์ชัน</th>
                        <th className="p-4 text-left text-sm font-bold text-slate-700">วันที่</th>
                        <th className="p-4 text-left text-sm font-bold text-slate-700">ความเสี่ยง</th>
                        <th className="p-4 text-left text-sm font-bold text-slate-700">การดำเนินการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAndSortedItems.map((item) => (
                        <tr
                          key={item.id}
                          className={`hover:bg-slate-50 transition-colors ${selectedItems.includes(item.id) ? "bg-blue-50" : ""
                            }`}
                        >
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => toggleSelectItem(item.id)}
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="font-semibold text-slate-900 mb-1">
                                {item.document_name}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">
                                  ID: {item.id}
                                </span>
                                {item.changes_count !== undefined && (
                                  <span className="text-xs px-2 py-1 bg-violet-100 text-violet-700 rounded-lg font-medium">
                                    {item.changes_count} การเปลี่ยนแปลง
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200">
                                {item.version_old_label}
                              </span>
                              <ArrowRightIcon className="h-4 w-4 text-slate-400" />
                              <span className="px-3 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg border border-purple-200">
                                {item.version_new_label}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-slate-900 font-medium">
                              {formatDate(item.created_at)}
                            </div>
                          </td>
                          <td className="p-4">
                            <RiskBadge risk={item.overall_risk_level} />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table Footer */}
              {!loading && !error && filteredAndSortedItems.length > 0 && (
                <div className="p-4 border-t border-slate-200 bg-slate-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-sm text-slate-600">
                      แสดง {filteredAndSortedItems.length} จาก {items.length} รายการ
                      {searchTerm && ` สำหรับ "${searchTerm}"`}
                    </div>
                    <div className="text-sm text-slate-600">
                      เรียงตาม <span className="font-medium">{sortField}</span> (
                      {sortDirection === "desc" ? "มากไปน้อย" : "น้อยไปมาก"})
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for Arrow Right icon
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);