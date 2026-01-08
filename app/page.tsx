"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DocumentMagnifyingGlassIcon,
  CloudArrowUpIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

type CompareResult = {
  doc_name: string;
  v1_label: string;
  v2_label: string;
  pages_v1: number;
  pages_v2: number;
  paragraphs_v1: number;
  paragraphs_v2: number;
  changes_count: number;
  risk_level: string;
  summary_text: string;
  run_id: number;
  html_report_url: string;
  json_report_url: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE?.trim() || "http://127.0.0.1:8000";

const COLORS = {
  primary: "#1877F2",
  primaryHover: "#166FE5",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  background: "#F8FAFC",
};

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm font-medium">กำลังประมวลผล...</span>
    </div>
  );
}

export default function Home() {
  const [docName, setDocName] = useState("");
  const [v1Label, setV1Label] = useState("Draft");
  const [v2Label, setV2Label] = useState("Final");
  const [fileV1, setFileV1] = useState<File | null>(null);
  const [fileV2, setFileV2] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompareResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!fileV1 || !fileV2) {
      setError("กรุณาเลือกไฟล์ PDF ทั้งสองเวอร์ชัน");
      return;
    }

    const safeDocName = docName?.trim() || (fileV1?.name ? fileV1.name.replace(/\.pdf$/i, "") : "document");
    const safeV1 = v1Label?.trim() || "v1";
    const safeV2 = v2Label?.trim() || "v2";

    const formData = new FormData();
    formData.append("doc_name", safeDocName);
    formData.append("v1_label", safeV1);
    formData.append("v2_label", safeV2);
    formData.append("file_v1", fileV1);
    formData.append("file_v2", fileV2);

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/compare`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error ${res.status}: ${text}`);
      }

      const data: CompareResult = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || "เกิดข้อผิดพลาดในการประมวลผล");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDocName("");
    setV1Label("Draft");
    setV2Label("Final");
    setFileV1(null);
    setFileV2(null);
    setError(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ backgroundColor: COLORS.primary }}>
            <DocumentMagnifyingGlassIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            เปรียบเทียบเอกสาร PDF
          </h1>
          <p className="text-gray-600">
            อัปโหลดเอกสาร 2 เวอร์ชันเพื่อวิเคราะห์ความแตกต่างและประเมินความเสี่ยง
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Upload Form */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <DocumentTextIcon className="h-6 w-6" style={{ color: COLORS.primary }} />
              <h2 className="text-lg font-semibold text-gray-900">อัปโหลดเอกสาร</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Document Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อเอกสาร (ไม่บังคับ)
                  </label>
                  <input
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    placeholder="เช่น ใบเสนอราคา-บริษัท-ABC"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:border-transparent focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เวอร์ชัน 1
                    </label>
                    <input
                      // value={v1Label}
                      onChange={(e) => setV1Label(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:border-transparent focus:ring-blue-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เวอร์ชัน 2
                    </label>
                    <input
                      // value={v2Label}
                      onChange={(e) => setV2Label(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:border-transparent focus:ring-blue-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Version 1 */}
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 hover:border-blue-400 transition-colors">
                    <div className="text-center">
                      <CloudArrowUpIcon className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {fileV1 ? "ไฟล์ที่เลือก:" : "เลือกไฟล์เวอร์ชัน 1"}
                      </p>
                      {fileV1 ? (
                        <p className="text-xs text-gray-600 truncate">{fileV1.name}</p>
                      ) : (
                        <p className="text-xs text-gray-500">PDF เท่านั้น</p>
                      )}
                    </div>
                    <div className="mt-4">
                      <label className="block">
                        <span className="cursor-pointer inline-flex items-center justify-center w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          style={{
                            backgroundColor: fileV1 ? "#16d913ff" : COLORS.primary,
                            color: "white"
                          }}>
                          {fileV1 ? "เปลี่ยนไฟล์" : "เลือกไฟล์"}
                        </span>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => setFileV1(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Version 2 */}
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 hover:border-blue-400 transition-colors">
                    <div className="text-center">
                      <CloudArrowUpIcon className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {fileV2 ? "ไฟล์ที่เลือก:" : "เลือกไฟล์เวอร์ชัน 2"}
                      </p>
                      {fileV2 ? (
                        <p className="text-xs text-gray-600 truncate">{fileV2.name}</p>
                      ) : (
                        <p className="text-xs text-gray-500">PDF เท่านั้น</p>
                      )}
                    </div>
                    <div className="mt-4">
                      <label className="block">
                        <span className="cursor-pointer inline-flex items-center justify-center w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          style={{
                            backgroundColor: fileV2 ? "#16d913ff" : COLORS.primary,
                            color: "white"
                          }}>
                          {fileV2 ? "เปลี่ยนไฟล์" : "เลือกไฟล์"}
                        </span>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => setFileV2(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading || !fileV1 || !fileV2}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                  style={{
                    backgroundColor: COLORS.primary,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && fileV1 && fileV2) {
                      e.currentTarget.style.backgroundColor = COLORS.primaryHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && fileV1 && fileV2) {
                      e.currentTarget.style.backgroundColor = COLORS.primary;
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                      กำลังวิเคราะห์...
                    </>
                  ) : (
                    <>
                      เริ่มเปรียบเทียบ
                      <ArrowRightIcon className="h-4 w-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  ล้างข้อมูล
                </button>
              </div>
            </form>
          </Card>

          {/* Results - Show only when there's a result */}
          {result && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">ผลการวิเคราะห์</h2>
                <span className="text-sm text-gray-500">Run ID: {result.run_id}</span>
              </div>

              <Card className="p-6">
                {/* Document Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{result.doc_name}</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium">{result.v1_label}</span>
                    <ArrowRightIcon className="h-4 w-4" />
                    <span className="font-medium">{result.v2_label}</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">จำนวนหน้า</p>
                    <p className="text-xl font-bold text-gray-900">
                      {result.pages_v1} → {result.pages_v2}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">จำนวนย่อหน้า</p>
                    <p className="text-xl font-bold text-gray-900">
                      {result.paragraphs_v1} → {result.paragraphs_v2}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">การเปลี่ยนแปลง</p>
                    <p className="text-xl font-bold text-gray-900">{result.changes_count}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">ระดับความเสี่ยง</p>
                    <div className="mt-1">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        result.risk_level.includes('สูง') || result.risk_level.includes('HIGH')
                          ? 'bg-red-100 text-red-800'
                          : result.risk_level.includes('กลาง') || result.risk_level.includes('MEDIUM')
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {result.risk_level}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">สรุปผลการวิเคราะห์</h4>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700 whitespace-pre-line">{result.summary_text}</p>
                  </div>
                </div>

                {/* Report Links */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`${API_BASE}${result.html_report_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
                  >
                    ดูรายงาน HTML
                  </a>
                  <a
                    href={`${API_BASE}${result.json_report_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    ดาวน์โหลด JSON
                  </a>
                  <Link
                    href="/history"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                  >
                    ดูประวัติทั้งหมด
                  </Link>
                </div>
              </Card>
            </div>
          )}

          {/* Quick Guide */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">วิธีใช้งาน</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <p className="text-gray-600">กรอกข้อมูลเอกสารและเลือกไฟล์ PDF ทั้งสองเวอร์ชัน</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <p className="text-gray-600">กดปุ่ม "เริ่มเปรียบเทียบ" เพื่อวิเคราะห์ความแตกต่าง</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <p className="text-gray-600">ดูผลการวิเคราะห์และดาวน์โหลดรายงาน</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}