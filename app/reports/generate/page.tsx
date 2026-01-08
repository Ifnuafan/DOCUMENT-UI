"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  DocumentArrowDownIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  SparklesIcon,
  PrinterIcon,
  ShareIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ================= TYPES ================= */

type ReportData = {
  id: string;
  title: string;
  documentName: string;
  versionFrom: string;
  versionTo: string;
  createdDate: string;
  createdBy: string;
  totalChanges: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  overallRisk: "LOW" | "MEDIUM" | "HIGH";
  executiveSummary: string;
  keyFindings: {
    id: number;
    description: string;
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    recommendation: string;
  }[];
  topRisks: string[];
  aiRecommendations: string[];
  preparedBy: string;
  preparedDate: string;
  approvalBy?: string;
  approvalDate?: string;
};

type ComparisonDetail = {
  id: number;
  document_name: string;
  version_old_label: string;
  version_new_label: string;
  created_at: string;
  overall_risk_level?: string | null;
  summary_text?: string | null;
  changes: Array<{
    id: number;
    section_label: string | null;
    risk_level?: "LOW" | "MEDIUM" | "HIGH" | null;
    ai_suggestion?: string | null;
  }>;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.trim() || "http://127.0.0.1:8000";

/* ================= HELPERS ================= */

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatDateShort(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("th-TH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function RiskBadge({ level }: { level: "LOW" | "MEDIUM" | "HIGH" }) {
  const styles = {
    HIGH: "bg-red-100 text-red-700 border-red-300",
    MEDIUM: "bg-amber-100 text-amber-700 border-amber-300",
    LOW: "bg-emerald-100 text-emerald-700 border-emerald-300",
  };

  return (
    <span className={`px-3 py-1 rounded-lg border font-bold text-sm ${styles[level]}`}>
      {level}
    </span>
  );
}

function RiskItem({ level, count }: { level: "LOW" | "MEDIUM" | "HIGH"; count: number }) {
  const styles = {
    HIGH: "bg-red-50 border-red-200 text-red-700",
    MEDIUM: "bg-amber-50 border-amber-200 text-amber-700",
    LOW: "bg-emerald-50 border-emerald-200 text-emerald-700",
  };

  return (
    <div className={`p-4 rounded-xl border ${styles[level]}`}>
      <div className="text-2xl font-bold">{count}</div>
      <div className="text-sm font-semibold mt-1">{level} RISK</div>
    </div>
  );
}

/* ================= REPORT GENERATOR ================= */

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const comparisonId = searchParams.get("comparisonId");
  
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [format, setFormat] = useState<"PDF" | "WORD">("PDF");
  const [showPreview, setShowPreview] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonDetail | null>(null);

  useEffect(() => {
    if (comparisonId) {
      fetchComparisonData();
    } else {
      // ถ้าไม่มี comparisonId ให้แสดงหน้าเลือก
      setLoading(false);
    }
  }, [comparisonId]);

  const fetchComparisonData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/comparisons/${comparisonId}`, { 
        cache: "no-store" 
      });
      
      if (!res.ok) throw new Error(`Failed to load comparison (${res.status})`);
      
      const data: ComparisonDetail = await res.json();
      setComparisonData(data);
      
      // แปลงข้อมูลจาก Comparison เป็น ReportData
      const changes = data.changes || [];
      const highRiskCount = changes.filter(c => c.risk_level === "HIGH").length;
      const mediumRiskCount = changes.filter(c => c.risk_level === "MEDIUM").length;
      const lowRiskCount = changes.filter(c => c.risk_level === "LOW").length;
      
      // กำหนดระดับความเสี่ยงรวม
      let overallRisk: "LOW" | "MEDIUM" | "HIGH" = "LOW";
      if (highRiskCount > 3) overallRisk = "HIGH";
      else if (highRiskCount > 0 || mediumRiskCount > 5) overallRisk = "MEDIUM";
      
      // สร้างรายงาน
      const report: ReportData = {
        id: `REP-${data.id}`,
        title: `รายงานสรุปผลการเปรียบเทียบเอกสาร ${data.document_name}`,
        documentName: data.document_name,
        versionFrom: data.version_old_label,
        versionTo: data.version_new_label,
        createdDate: data.created_at,
        createdBy: "ระบบวิเคราะห์เอกสารอัจฉริยะ",
        totalChanges: changes.length,
        highRisk: highRiskCount,
        mediumRisk: mediumRiskCount,
        lowRisk: lowRiskCount,
        overallRisk,
        executiveSummary: data.summary_text || "ไม่มีข้อมูลสรุปผลการวิเคราะห์",
        keyFindings: changes
          .filter(c => c.risk_level === "HIGH")
          .slice(0, 3)
          .map((c, i) => ({
            id: i + 1,
            description: c.section_label || "ประเด็นความเสี่ยงสูง",
            riskLevel: c.risk_level || "HIGH",
            recommendation: c.ai_suggestion || "ควรพิจารณาปรับปรุงเพื่อลดความเสี่ยง"
          })),
        topRisks: changes
          .filter(c => c.risk_level === "HIGH")
          .slice(0, 5)
          .map(c => c.section_label || "ประเด็นความเสี่ยงสูง") || [],
        aiRecommendations: changes
          .filter(c => c.ai_suggestion)
          .slice(0, 5)
          .map(c => c.ai_suggestion as string) || [
            "ควรตรวจสอบข้อกำหนดที่เปลี่ยนแปลงทั้งหมด",
            "ปรึกษาผู้เชี่ยวชาญด้านกฎหมายก่อนลงนาม",
            "บันทึกการเปลี่ยนแปลงทั้งหมดเป็นลายลักษณ์อักษร",
            "พิจารณาระยะเวลาสัญญาที่เหมาะสม",
            "กำหนดกลไกแก้ไขข้อขัดแย้งที่ชัดเจน"
          ],
        preparedBy: "ระบบวิเคราะห์เอกสารอัจฉริยะ",
        preparedDate: formatDate(new Date().toISOString()),
        approvalBy: undefined,
        approvalDate: undefined
      };
      
      setReportData(report);
    } catch (err: any) {
      setError(err?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      console.error("Error fetching comparison:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!reportRef.current || !reportData) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 190;
      const pageHeight = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`รายงานสรุปผล_${reportData.documentName}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateWord = () => {
    if (!reportData) return;
    
    // สร้างเนื้อหา Word
    const content = `
      ชื่อรายงาน: ${reportData.title}
      เอกสาร: ${reportData.documentName}
      เวอร์ชัน: ${reportData.versionFrom} → ${reportData.versionTo}
      วันที่จัดทำ: ${formatDate(reportData.createdDate)}
      ผู้จัดทำ: ${reportData.createdBy}
      
      สรุปผลการวิเคราะห์:
      ${reportData.executiveSummary}
      
      สถิติความเสี่ยง:
      - ความเสี่ยงสูง: ${reportData.highRisk} จุด
      - ความเสี่ยงปานกลาง: ${reportData.mediumRisk} จุด
      - ความเสี่ยงต่ำ: ${reportData.lowRisk} จุด
      - รวมทั้งหมด: ${reportData.totalChanges} จุด
      
      ประเด็นสำคัญที่ต้องพิจารณา:
      ${reportData.keyFindings.map(f => `  ${f.id}. ${f.description} (ความเสี่ยง: ${f.riskLevel})`).join('\n')}
      
      คำแนะนำจากระบบ AI:
      ${reportData.aiRecommendations.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}
      
      เตรียมโดย: ${reportData.preparedBy}
      วันที่: ${reportData.preparedDate}
      ${reportData.approvalBy ? `อนุมัติโดย: ${reportData.approvalBy}\nวันที่อนุมัติ: ${reportData.approvalDate}` : ''}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `รายงานสรุปผล_${reportData.documentName}_${new Date().toISOString().split('T')[0]}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateReport = () => {
    if (format === "PDF") {
      handleGeneratePDF();
    } else {
      handleGenerateWord();
    }
  };

  const handleBackToComparison = () => {
    if (comparisonId) {
      router.push(`/compare/${comparisonId}`);
    } else {
      router.push('/history');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-700 font-medium">กำลังเตรียมรายงาน...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white border border-red-200 rounded-xl p-8 max-w-md">
          <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-gray-900 mt-4 text-center">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mt-2 text-center">{error}</p>
          <div className="mt-6 flex gap-2">
            <button
              onClick={handleBackToComparison}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
            >
              กลับ
            </button>
            <button
              onClick={fetchComparisonData}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              ลองใหม่
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!comparisonId || !reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">เลือกรายการเปรียบเทียบ</h1>
            <p className="text-gray-600 mb-6">กรุณาเลือกรายการเปรียบเทียบจากประวัติเพื่อสร้างรายงาน</p>
            <button
              onClick={() => router.push('/history')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              ไปที่ประวัติ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={handleBackToComparison}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      📋 สร้างรายงานสรุปผล
                    </h1>
                    <p className="text-gray-600">
                      รายงานสรุปผลการเปรียบเทียบ: {reportData.documentName}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">จาก:</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{reportData.versionFrom}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">เป็น:</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">{reportData.versionTo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">วันที่:</span>
                    <span>{formatDateShort(reportData.createdDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">ID:</span>
                    <span>{comparisonId}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  {showPreview ? "ซ่อนตัวอย่าง" : "แสดงตัวอย่าง"}
                </button>
                <button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 flex items-center gap-2"
                >
                  <DocumentArrowDownIcon className="h-5 w-5" />
                  {isGenerating ? "กำลังสร้าง..." : `ดาวน์โหลด ${format}`}
                </button>
              </div>
            </div>

            {/* Format Selector */}
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">รูปแบบ:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormat("PDF")}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      format === "PDF" 
                        ? "bg-blue-100 text-blue-700 border border-blue-300" 
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => setFormat("WORD")}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      format === "WORD" 
                        ? "bg-blue-100 text-blue-700 border border-blue-300" 
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Word
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">ขนาด:</span>
                <select className="px-3 py-2 border border-gray-300 rounded-lg bg-white">
                  <option>A4</option>
                  <option>Letter</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">ภาษา:</span>
                <select className="px-3 py-2 border border-gray-300 rounded-lg bg-white">
                  <option>ภาษาไทย</option>
                  <option>English</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && reportData && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">ตัวอย่างรายงาน</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900"
                  >
                    <PrinterIcon className="h-5 w-5" />
                    พิมพ์
                  </button>
                </div>
              </div>
              
              {/* Report Content - สำหรับแปลงเป็น PDF */}
              <div 
                ref={reportRef}
                className="bg-white p-8 border border-gray-200 rounded-lg"
                style={{ 
                  minWidth: '210mm', 
                  minHeight: '297mm',
                  fontFamily: "'Sarabun', 'TH Sarabun New', 'Noto Sans Thai', sans-serif"
                }}
              >
                {/* Report Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-900">รายงานสรุปผลการเปรียบเทียบเอกสาร</h1>
                  </div>
                  <div className="text-sm text-gray-600">เลขที่รายงาน: {reportData.id}</div>
                </div>

                {/* Document Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">ข้อมูลเอกสาร</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">ชื่อเอกสาร</div>
                      <div className="font-medium">{reportData.documentName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">เวอร์ชันที่เปรียบเทียบ</div>
                      <div className="font-medium">{reportData.versionFrom} → {reportData.versionTo}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">วันที่จัดทำ</div>
                      <div className="font-medium">{formatDate(reportData.createdDate)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">ผู้จัดทำ</div>
                      <div className="font-medium">{reportData.createdBy}</div>
                    </div>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">สรุปผลการวิเคราะห์</h2>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">{reportData.executiveSummary}</p>
                  </div>
                </div>

                {/* Risk Analysis */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">การวิเคราะห์ความเสี่ยง</h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <RiskItem level="HIGH" count={reportData.highRisk} />
                    <RiskItem level="MEDIUM" count={reportData.mediumRisk} />
                    <RiskItem level="LOW" count={reportData.lowRisk} />
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                      <div className="text-2xl font-bold">{reportData.totalChanges}</div>
                      <div className="text-sm font-semibold mt-1">TOTAL CHANGES</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">ระดับความเสี่ยงรวม:</span>
                    <RiskBadge level={reportData.overallRisk} />
                  </div>
                </div>

                {/* Key Findings */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">ประเด็นสำคัญที่ต้องพิจารณา</h2>
                  <div className="space-y-3">
                    {reportData.keyFindings.map((finding) => (
                      <div key={finding.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-gray-900">{finding.description}</div>
                          <RiskBadge level={finding.riskLevel} />
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">คำแนะนำ:</span> {finding.recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <SparklesIcon className="h-5 w-5 text-purple-600" />
                    <h2 className="text-lg font-bold text-gray-900">คำแนะนำจากระบบ AI</h2>
                  </div>
                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                    <ul className="space-y-2">
                      {reportData.aiRecommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircleIcon className="h-5 w-5 text-purple-600 mt-0.5" />
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Top Risks */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                    <h2 className="text-lg font-bold text-gray-900">ความเสี่ยงสูงสุดที่ต้องเฝ้าระวัง</h2>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                    <ul className="space-y-1">
                      {reportData.topRisks.map((risk, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-2 w-2 bg-red-600 rounded-full mt-2"></div>
                          <span className="text-gray-700">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <UserIcon className="h-5 w-5 text-gray-600" />
                        <span className="font-medium text-gray-900">เตรียมโดย</span>
                      </div>
                      <div className="text-gray-700">{reportData.preparedBy}</div>
                      <div className="text-sm text-gray-600">วันที่: {reportData.preparedDate}</div>
                    </div>
                    
                    {reportData.approvalBy && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-gray-900">อนุมัติโดย</span>
                        </div>
                        <div className="text-gray-700">{reportData.approvalBy}</div>
                        <div className="text-sm text-gray-600">วันที่: {reportData.approvalDate}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <DocumentTextIcon className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">รายงานมาตรฐาน</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">รายงานสรุปผลแบบสมบูรณ์พร้อมข้อมูลทั้งหมด</p>
            <button 
              onClick={() => {
                setFormat("PDF");
                setShowPreview(true);
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              สร้างรายงาน
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <ChartBarIcon className="h-5 w-5 text-green-600" />
              <h3 className="font-bold text-gray-900">รายงานสรุปสั้น</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">สรุปเฉพาะประเด็นสำคัญสำหรับผู้บริหาร</p>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
              สร้างสรุปผู้บริหาร
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              <h3 className="font-bold text-gray-900">รายงานความเสี่ยง</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">เน้นเฉพาะประเด็นความเสี่ยงสูงที่ต้องแก้ไข</p>
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
              สร้างรายงานความเสี่ยง
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📌 ลักษณะสำคัญของ Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">✅ เหมาะสำหรับ</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
                  เสนอผู้บริหารและคณะกรรมการ
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
                  แนบใน TOR หรือเอกสารประกวดราคา
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
                  เก็บเป็น Record ทางการ
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
                  ใช้เป็นเอกสารประกอบการตัดสินใจ
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">🎯 คุณสมบัติ</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <DocumentArrowDownIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  Static Document (ไม่เปลี่ยนแปลง)
                </li>
                <li className="flex items-start gap-2">
                  <ClockIcon className="h-5 w-5 text-amber-600 mt-0.5" />
                  ใช้นอกระบบได้ (Offline)
                </li>
                <li className="flex items-start gap-2">
                  <ShareIcon className="h-5 w-5 text-purple-600 mt-0.5" />
                  ใช้เป็นหลักฐานและส่งต่อได้
                </li>
                <li className="flex items-start gap-2">
                  <PrinterIcon className="h-5 w-5 text-gray-600 mt-0.5" />
                  พิมพ์เป็นเอกสารได้
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}