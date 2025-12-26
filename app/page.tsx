"use client";

import React, { useState } from "react";
import Link from "next/link";

import {
  DocumentMagnifyingGlassIcon,
  CloudArrowUpIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChartBarIcon,
  DocumentTextIcon,
  AdjustmentsHorizontalIcon,
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
  json_report_path: string;
  html_report_path: string;
  run_id: number;

  html_report_url: string;
  json_report_url: string;
};

type ChangeType = "ADDED" | "REMOVED" | "MODIFIED";

type ChangeItem = {
  change_type: ChangeType;
  section_label: string | null;
  old_text: string | null;
  new_text: string | null;
  risk_level?: "LOW" | "MEDIUM" | "HIGH" | null;
  ai_comment?: string | null;
};

type JsonReport = {
  document_name: string;
  version_old: string;
  version_new: string;
  overall_risk_level: string | null;
  summary_text: string | null;
  changes: ChangeItem[];
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

  // state สำหรับ diff summary
  const [changes, setChanges] = useState<ChangeItem[]>([]);
  const [filterType, setFilterType] = useState<"ALL" | ChangeType>("ALL");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setChanges([]);

    if (!fileV1 || !fileV2) {
      setError("กรุณาเลือกไฟล์ PDF ทั้งสองเวอร์ชันก่อนเริ่มเปรียบเทียบ");
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

      // ดึง JSON report เพื่อเอา changes มาแสดงบนหน้าเว็บ
      try {
        const jsonRes = await fetch(`http://127.0.0.1:8000${data.json_report_url}`);
        if (jsonRes.ok) {
          const json: JsonReport = await jsonRes.json();
          setChanges(json.changes || []);
        }
      } catch (err) {
        console.warn("โหลด JSON report ไม่สำเร็จ", err);
      }
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
    } finally {
      setLoading(false);
    }
  };

  const riskColor = (risk: string) => {
    const level = risk.toLowerCase();
    if (level.includes("สูง") || level.includes("high")) {
      return "bg-red-100 text-red-700 border-red-200";
    }
    if (level.includes("กลาง") || level.includes("medium")) {
      return "bg-amber-100 text-amber-700 border-amber-200";
    }
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  };

  const riskBadgeForChange = (risk?: string | null) => {
    const base =
      "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border";
    const level = (risk || "LOW").toUpperCase();

    if (level === "HIGH") {
      return (
        <span className={`${base} bg-red-100 text-red-700 border-red-200`}>
          HIGH
        </span>
      );
    }
    if (level === "MEDIUM") {
      return (
        <span className={`${base} bg-amber-100 text-amber-700 border-amber-200`}>
          MEDIUM
        </span>
      );
    }
    return (
      <span className={`${base} bg-emerald-100 text-emerald-700 border-emerald-200`}>
        LOW
      </span>
    );
  };

  const filteredChanges =
    filterType === "ALL" ? changes : changes.filter((c) => c.change_type === filterType);

  const renderChangeBadge = (t: ChangeType) => {
    const base =
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold";
    if (t === "ADDED")
      return (
        <span className={`${base} bg-emerald-100 text-emerald-700`}>
          <span className="text-xs">＋</span> ADDED
        </span>
      );
    if (t === "REMOVED")
      return (
        <span className={`${base} bg-rose-100 text-rose-700`}>
          <span className="text-xs">−</span> REMOVED
        </span>
      );
    return (
      <span className={`${base} bg-amber-100 text-amber-700`}>
        <AdjustmentsHorizontalIcon className="h-3 w-3" />
        MODIFIED
      </span>
    );
  };

  const truncate = (text: string | null, len = 260) => {
    if (!text) return "";
    return text.length > len ? text.slice(0, len) + "..." : text;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* ใช้ gradient เฉพาะ “การ์ด” เพื่อไม่ชนกับ AppShell */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f6e9ff] via-[#f7f0ff] to-[#e3d4ff] p-4 md:p-6">
        <div className="relative overflow-hidden rounded-3xl bg-white/80 shadow-2xl border border-white/60 backdrop-blur-md">
          {/* bubble background decoration */}
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-fuchsia-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 -bottom-32 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl" />

          {/* แถบไล่สีด้านบน */}
          <div className="h-2 w-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-pink-400" />

          {/* ส่วนบน: ฟอร์ม + ผลลัพธ์หลัก */}
          <div className="grid gap-8 p-6 md:p-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] relative z-10">
            {/* ซ้าย: ฟอร์ม */}
            <section className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-pink-400 shadow-lg text-white">
                    <DocumentMagnifyingGlassIcon className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 border border-violet-100 mb-1">
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[9px] text-white">
                        AI
                      </span>
                      Document Diff Assistant
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
                      เปรียบเทียบเอกสาร 2 เวอร์ชัน
                      <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-600 border border-sky-100">
                        PDF Only
                      </span>
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                      อัปโหลดไฟล์ PDF สองเวอร์ชัน ระบบจะช่วยหาความแตกต่าง สรุปผล และประเมินระดับความเสี่ยงให้โดยอัตโนมัติ
                    </p>
                  </div>
                </div>

                <Link
                  href="/history"
                  className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <ClockIcon className="h-4 w-4 text-violet-500" />
                  ดูประวัติเปรียบเทียบ
                </Link>
              </div>

              {/* ฟอร์ม */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* ชื่อเอกสาร + labels */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                      <DocumentTextIcon className="h-4 w-4 text-violet-500" />
                      ข้อมูลเอกสาร
                    </p>
                    <span className="text-[11px] text-slate-400">
                      ตั้งชื่อให้จำง่าย ใช้ใน report
                    </span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        ชื่อเอกสาร (doc_name)
                      </label>
                      <input
                        type="text"
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        Label เวอร์ชัน 1
                      </label>
                      <input
                        type="text"
                        value={v1Label}
                        onChange={(e) => setV1Label(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        Label เวอร์ชัน 2
                      </label>
                      <input
                        type="text"
                        value={v2Label}
                        onChange={(e) => setV2Label(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
                      />
                    </div>
                  </div>
                </div>

                {/* เลือกไฟล์ */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/60 px-4 py-3">
                    <label className="flex items-center justify-between gap-2">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700 flex items-center gap-1.5">
                          <CloudArrowUpIcon className="h-4 w-4" />
                          เวอร์ชัน 1 (PDF)
                        </p>
                        <p className="text-xs text-violet-700/80">
                          เลือกไฟล์เวอร์ชันเก่า เช่น draft แรก หรือเวอร์ชันก่อนปรับ
                        </p>
                      </div>
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm border border-violet-100">
                        <span className="text-[10px] font-semibold text-violet-500">V1</span>
                      </div>
                    </label>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setFileV1(e.target.files?.[0] || null)}
                        className="w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-violet-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-violet-600"
                      />
                      {fileV1 && (
                        <p className="mt-1 text-xs text-violet-800 truncate">
                          เลือกไฟล์: <span className="font-medium">{fileV1.name}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-fuchsia-200 bg-fuchsia-50/60 px-4 py-3">
                    <label className="flex items-center justify-between gap-2">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-700 flex items-center gap-1.5">
                          <CloudArrowUpIcon className="h-4 w-4" />
                          เวอร์ชัน 2 (PDF)
                        </p>
                        <p className="text-xs text-fuchsia-700/80">
                          เลือกไฟล์เวอร์ชันใหม่ เช่น เวอร์ชันล่าสุดหลังแก้ไข
                        </p>
                      </div>
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm border border-fuchsia-100">
                        <span className="text-[10px] font-semibold text-fuchsia-500">V2</span>
                      </div>
                    </label>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setFileV2(e.target.files?.[0] || null)}
                        className="w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-fuchsia-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-fuchsia-600"
                      />
                      {fileV2 && (
                        <p className="mt-1 text-xs text-fuchsia-800 truncate">
                          เลือกไฟล์: <span className="font-medium">{fileV2.name}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* error */}
                {error && (
                  <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50/80 px-3 py-2.5 text-xs text-red-700">
                    <ExclamationTriangleIcon className="mt-0.5 h-4 w-4" />
                    <p>{error}</p>
                  </div>
                )}

                {/* ปุ่ม */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:brightness-105 disabled:from-slate-400 disabled:via-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? (
                      <>
                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                        กำลังเปรียบเทียบ...
                      </>
                    ) : (
                      <>
                        เริ่มเปรียบเทียบเอกสาร
                        <ArrowRightIcon className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-[9px] text-white">
                      API
                    </span>
                    ส่งขึ้นไปที่{" "}
                    <span className="font-medium text-slate-700">
                      http://127.0.0.1:8000/compare
                    </span>
                  </p>
                </div>
              </form>
            </section>

            {/* ขวา: ผลลัพธ์ / Hint */}
            <section className="space-y-4">
              {result ? (
                <div className="rounded-2xl border border-slate-100 bg-white/90 shadow-sm p-4 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                      <ChartBarIcon className="h-4 w-4 text-violet-500" />
                      ผลการเปรียบเทียบล่าสุด
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-[11px] font-semibold ${riskColor(
                        result.risk_level
                      )}`}
                    >
                      ระดับความเสี่ยง: <span>{result.risk_level}</span>
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid gap-3 text-xs md:grid-cols-2">
                    <div className="space-y-1.5">
                      <p className="text-slate-500 flex items-center gap-1.5">
                        <DocumentTextIcon className="h-4 w-4 text-slate-500" />
                        เอกสาร
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {result.doc_name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        เปรียบเทียบจาก{" "}
                        <span className="font-medium text-violet-700">{result.v1_label}</span>{" "}
                        →{" "}
                        <span className="font-medium text-fuchsia-700">{result.v2_label}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-slate-50 px-3 py-2 flex flex-col gap-1">
                        <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-400" />
                          Pages (v1 / v2)
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {result.pages_v1} / {result.pages_v2}
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-50 px-3 py-2 flex flex-col gap-1">
                        <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
                          Paragraphs (v1 / v2)
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {result.paragraphs_v1} / {result.paragraphs_v2}
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-50 px-3 py-2 col-span-2 flex flex-col gap-1">
                        <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          จำนวนจุดที่เปลี่ยนแปลง
                        </p>
                        <p className="text-lg font-extrabold text-violet-600">
                          {result.changes_count.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Summary text */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <DocumentTextIcon className="h-4 w-4 text-emerald-500" />
                      สรุปจาก AI
                    </p>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 max-h-60 overflow-auto text-xs text-slate-700 whitespace-pre-wrap">
                      {result.summary_text}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <a
                      href={`http://127.0.0.1:8000${result.html_report_url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 font-medium text-violet-700 hover:bg-violet-100"
                    >
                      <DocumentTextIcon className="h-4 w-4" />
                      เปิด HTML report
                    </a>
                    <a
                      href={`http://127.0.0.1:8000${result.json_report_url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-medium text-slate-700 hover:bg-slate-100"
                    >
                      <DocumentMagnifyingGlassIcon className="h-4 w-4" />
                      ดาวน์โหลด JSON
                    </a>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <ClockIcon className="h-3.5 w-3.5" />
                      Run ID: {result.run_id}
                    </span>
                  </div>

                  {/* ✅ ลิงก์ไปหน้า compare detail ถ้าคุณสร้าง comparison record แล้ว */}
                  <div className="pt-2">
                    <Link
                      href="/history"
                      className="inline-flex items-center justify-center w-full rounded-xl bg-slate-900 text-white text-sm font-semibold py-2 hover:bg-slate-800"
                    >
                      ไปดูใน History
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl border border-slate-100 bg-white/90 shadow-sm p-4 space-y-3">
                    <p className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                      <ChartBarIcon className="h-4 w-4 text-violet-500" />
                      วิธีใช้งานแบบเร็ว ๆ
                    </p>
                    <ol className="space-y-1.5 text-xs text-slate-600 list-decimal list-inside">
                      <li>ใส่ชื่อเอกสาร และกำหนด label เช่น v1 / v2</li>
                      <li>เลือกไฟล์ PDF เวอร์ชันเก่า และเวอร์ชันใหม่</li>
                      <li>กดปุ่ม “เริ่มเปรียบเทียบเอกสาร”</li>
                      <li>ดูจำนวนการเปลี่ยนแปลง + สรุปจาก AI ด้านล่าง</li>
                    </ol>
                  </div>

                  <div className="rounded-2xl border border-dashed border-violet-200 bg-gradient-to-br from-violet-50/90 via-fuchsia-50/90 to-pink-50/90 p-5 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 shadow-md border border-violet-100">
                      <DocumentMagnifyingGlassIcon className="h-8 w-8 text-violet-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        ยังไม่มีผลลัพธ์การเปรียบเทียบ
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        ลองเลือกไฟล์ PDF สองเวอร์ชัน แล้วกดปุ่มเปรียบเทียบ เพื่อดูความต่างทั้งหมดในคลิกเดียว
                      </p>
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>

          {/* ล่าง: Summary เต็มความกว้าง */}
          {result && changes.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/70 px-6 md:px-10 pb-6 pt-4 relative z-10">
              <div className="rounded-2xl border border-slate-100 bg-white/95 shadow-sm p-4 md:p-5 max-h-[560px] overflow-auto">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      📄
                    </span>
                    รายการการเปลี่ยนแปลง (Summary)
                  </h3>

                  <div className="flex gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setFilterType("ALL")}
                      className={`px-3 py-1 rounded-full border flex items-center gap-1 ${
                        filterType === "ALL"
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      ทั้งหมด
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType("ADDED")}
                      className={`px-3 py-1 rounded-full border ${
                        filterType === "ADDED"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      ADDED
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType("REMOVED")}
                      className={`px-3 py-1 rounded-full border ${
                        filterType === "REMOVED"
                          ? "bg-rose-100 text-rose-800 border-rose-300"
                          : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      REMOVED
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType("MODIFIED")}
                      className={`px-3 py-1 rounded-full border ${
                        filterType === "MODIFIED"
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      MODIFIED
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-xs md:text-[13px] text-slate-800">
                  {filteredChanges.map((c, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {renderChangeBadge(c.change_type)}
                          <span className="text-[11px] text-slate-500">
                            {c.section_label || "-"}
                          </span>
                        </div>
                        {riskBadgeForChange(c.risk_level)}
                      </div>

                      <div className="grid gap-2 md:grid-cols-2 mt-1">
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                            Old Text
                          </p>
                          <p className="rounded-md bg-rose-50 text-rose-900 px-2 py-1 whitespace-pre-wrap line-through">
                            {truncate(c.old_text)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                            New Text
                          </p>
                          <p className="rounded-md bg-emerald-50 text-emerald-900 px-2 py-1 whitespace-pre-wrap">
                            {truncate(c.new_text)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredChanges.length === 0 && (
                    <p className="text-[12px] text-slate-500">ไม่มีรายการประเภทนี้</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* mobile shortcut */}
      <div className="md:hidden mt-3">
        <Link
          href="/history"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ClockIcon className="h-5 w-5 text-violet-500" />
          ดูประวัติเปรียบเทียบ
        </Link>
      </div>
    </div>
  );
}
