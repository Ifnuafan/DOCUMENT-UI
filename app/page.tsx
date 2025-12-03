"use client";

import React, { useState } from "react";

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
  json_report_path: string;
  html_report_path: string;
  run_id: number;
};

export default function Home() {
  const [docName, setDocName] = useState("TestDoc");
  const [v1Label, setV1Label] = useState("v1");
  const [v2Label, setV2Label] = useState("v2");
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
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `เรียก API ไม่สำเร็จ (status ${res.status})`);
      }

      const data: CompareResult = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">
          🔍 Document Versioning Compare
        </h1>
        <p className="text-sm text-slate-600">
          อัปโหลดเอกสาร 2 เวอร์ชัน แล้วให้ระบบช่วยเปรียบเทียบความแตกต่าง
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ข้อมูลเอกสาร */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                ชื่อเอกสาร (doc_name)
              </label>
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Label เวอร์ชัน 1
              </label>
              <input
                type="text"
                value={v1Label}
                onChange={(e) => setV1Label(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Label เวอร์ชัน 2
              </label>
              <input
                type="text"
                value={v2Label}
                onChange={(e) => setV2Label(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* เลือกไฟล์ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                เวอร์ชัน 1 (PDF)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFileV1(e.target.files?.[0] || null)}
                className="w-full text-sm"
              />
              {fileV1 && (
                <p className="text-xs text-slate-500 mt-1">
                  เลือกไฟล์: {fileV1.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                เวอร์ชัน 2 (PDF)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFileV2(e.target.files?.[0] || null)}
                className="w-full text-sm"
              />
              {fileV2 && (
                <p className="text-xs text-slate-500 mt-1">
                  เลือกไฟล์: {fileV2.name}
                </p>
              )}
            </div>
          </div>

          {/* ปุ่ม + error */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 disabled:bg-slate-400"
          >
            {loading ? "กำลังเปรียบเทียบ..." : "เปรียบเทียบเอกสาร"}
          </button>
        </form>

        {/* แสดงผลลัพธ์ */}
        {result && (
          <div className="mt-4 border-t pt-4 space-y-3">
            <h2 className="text-lg font-semibold text-slate-800">
              ✅ ผลการเปรียบเทียบ
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Document:</span> {result.doc_name}
                </p>
                <p>
                  <span className="font-medium">Compare:</span>{" "}
                  {result.v1_label} → {result.v2_label}
                </p>
                <p>
                  <span className="font-medium">Pages:</span>{" "}
                  v1={result.pages_v1}, v2={result.pages_v2}
                </p>
                <p>
                  <span className="font-medium">Paragraphs:</span>{" "}
                  v1={result.paragraphs_v1}, v2={result.paragraphs_v2}
                </p>
                <p>
                  <span className="font-medium">Changes:</span>{" "}
                  {result.changes_count}
                </p>
                <p>
                  <span className="font-medium">Risk Level:</span>{" "}
                  {result.risk_level}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-medium">สรุปจาก AI:</p>
              <div className="border rounded-lg bg-slate-50 px-3 py-2 max-h-60 overflow-auto whitespace-pre-wrap">
                {result.summary_text}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <a
                href={result.html_report_path}
                target="_blank"
                rel="noreferrer"
                className="text-sky-700 underline"
              >
                เปิด HTML report (ฝั่งเซิร์ฟเวอร์)
              </a>
              <span className="text-xs text-slate-500">
                Run ID: {result.run_id}
              </span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
