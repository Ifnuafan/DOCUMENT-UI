"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  DocumentMagnifyingGlassIcon,
  ClipboardIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  InformationCircleIcon,
  DocumentArrowDownIcon,
  AdjustmentsHorizontalIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

/* ================= TYPES ================= */

type ChangeType = "ADDED" | "REMOVED" | "MODIFIED";
type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

type ChangeItem = {
  id: number;
  change_type: ChangeType;
  section_label: string | null;
  old_text: string | null;
  new_text: string | null;
  risk_level?: RiskLevel | null;
  ai_comment?: string | null;
  ai_suggestion?: string | null;
  risk_reason?: string | null;
};

type ComparisonDetail = {
  id: number;
  document_name: string;
  version_old_label: string;
  version_new_label: string;
  created_at: string;
  overall_risk_level?: string | null;
  summary_text?: string | null;
  changes: ChangeItem[];
};

type ChatState = {
  open: boolean;
  question: string;
  loading: boolean;
  answer: string;
  error: string | null;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.trim() || "http://127.0.0.1:8000";

/* ================= HELPERS ================= */

function normalizeText(s?: string | null) {
  return (s || "").toString().trim();
}

function contains(hay: string, needle: string) {
  return hay.toLowerCase().includes(needle.toLowerCase());
}

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function riskBadge(risk?: string | null) {
  const base = "px-3 py-1 rounded-md font-bold";
  const level = (risk || "LOW").toUpperCase();

  if (level === "HIGH")
    return <span className={`${base} bg-gradient-to-r from-red-500 to-red-600 text-white text-sm shadow-sm`}>HIGH</span>;
  if (level === "MEDIUM")
    return <span className={`${base} bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm shadow-sm`}>MEDIUM</span>;
  return <span className={`${base} bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm shadow-sm`}>LOW</span>;
}

function changeTypeBadge(type: ChangeType) {
  const base = "px-3 py-1 rounded-md font-bold";
  if (type === "ADDED")
    return <span className={`${base} bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm shadow-sm`}>ADDED</span>;
  if (type === "REMOVED")
    return <span className={`${base} bg-gradient-to-r from-red-500 to-red-600 text-white text-sm shadow-sm`}>REMOVED</span>;
  return <span className={`${base} bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm shadow-sm`}>MODIFIED</span>;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      return true;
    } catch {
      return false;
    }
  }
}

function CopyButton({ text, label = "คัดลอก", size = "md", variant = "default" }: {
  text: string;
  label?: string;
  size?: "sm" | "md";
  variant?: "default" | "primary";
}) {
  const disabled = !text || text.trim().length === 0;
  
  const baseClasses = `
    inline-flex items-center gap-1 ${size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-base"}
    rounded-lg font-medium transition-all duration-200
    ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"}
  `;
  
  const variantClasses = variant === "primary" 
    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-sm"
    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={async () => await copyToClipboard(text)}
      className={`${baseClasses} ${variantClasses}`}
    >
      <ClipboardIcon className="h-4 w-4" />
      {label}
    </button>
  );
}

/* ================= DIFF VIEW COMPONENT ================= */

function DiffView({ oldText, newText }: { oldText: string; newText: string }) {
  const oldWords = oldText.split(/(\s+)/);
  const newWords = newText.split(/(\s+)/);
  const oldSet = new Set(oldWords.filter(w => w.trim().length > 0));
  const newSet = new Set(newWords.filter(w => w.trim().length > 0));

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="grid grid-cols-2 divide-x divide-gray-200">
        {/* Old Version - เพิ่มสีพื้นหลังเด่นชัด */}
        <div className="p-4 bg-gradient-to-b from-red-50/70 via-white to-red-50/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-3 w-3 bg-red-500 rounded-full shadow-sm"></div>
            <div className="text-sm font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full">OLD VERSION</div>
          </div>
          <div className="text-base leading-relaxed text-gray-800 bg-white/50 p-3 rounded-lg border border-red-100">
            {oldWords.map((w, i) => (
              <span
                key={i}
                className={!newSet.has(w) && w.trim().length > 0 ? 
                  "bg-red-100 text-red-900 px-1 py-0.5 rounded mx-0.5 border border-red-200 font-medium shadow-sm" : 
                  "text-gray-700"
                }
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        {/* New Version - เพิ่มสีพื้นหลังเด่นชัด */}
        <div className="p-4 bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-3 w-3 bg-emerald-500 rounded-full shadow-sm"></div>
            <div className="text-sm font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">NEW VERSION</div>
          </div>
          <div className="text-base leading-relaxed text-gray-800 bg-white/50 p-3 rounded-lg border border-emerald-100">
            {newWords.map((w, i) => (
              <span
                key={i}
                className={!oldSet.has(w) && w.trim().length > 0 ? 
                  "bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded mx-0.5 border border-emerald-200 font-medium shadow-sm" : 
                  "text-gray-700"
                }
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= FULLSCREEN DIFF COMPONENT ================= */

function FullscreenDiffViewer({ detail, onClose }: { detail: ComparisonDetail; onClose: () => void }) {
  const [currentChangeIndex, setCurrentChangeIndex] = useState(0);
  const changes = detail.changes;
  const currentChange = changes[currentChangeIndex];

  const handlePrev = () => {
    setCurrentChangeIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentChangeIndex(prev => Math.min(changes.length - 1, prev + 1));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Minimal Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-full px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="ปิด (ESC)"
            >
              <XMarkIcon className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h2 className="font-semibold text-gray-900 line-clamp-1">{detail.document_name}</h2>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-medium text-blue-600">{detail.version_old_label}</span>
                <span>→</span>
                <span className="font-medium text-emerald-600">{detail.version_new_label}</span>
                <span className="mx-1">•</span>
                <span>Change {currentChangeIndex + 1} of {changes.length}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentChangeIndex === 0}
              className="p-2 disabled:opacity-30 hover:bg-gray-100 rounded-lg transition-colors"
              title="ก่อนหน้า (←)"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            
            <div className="min-w-[80px] text-center text-sm font-medium text-gray-700">
              {currentChangeIndex + 1}/{changes.length}
            </div>
            
            <button
              onClick={handleNext}
              disabled={currentChangeIndex === changes.length - 1}
              className="p-2 disabled:opacity-30 hover:bg-gray-100 rounded-lg transition-colors"
              title="ถัดไป (→)"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - True Fullscreen */}
      <div className="flex-1 grid grid-cols-2 pt-12 overflow-hidden">
        {/* Old Version Panel */}
        <div className="h-full overflow-auto p-8 bg-gradient-to-b from-red-50/20 to-white">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                <h3 className="text-lg font-bold text-red-700">OLD VERSION</h3>
                <span className="ml-auto text-sm font-medium bg-red-100 text-red-700 px-3 py-1 rounded-full">
                  {detail.version_old_label}
                </span>
              </div>
              <p className="text-sm text-gray-500">ข้อความที่ถูกลบออกจะถูกไฮไลท์ด้วยสีแดง</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-red-100 shadow-sm">
              <div className="text-gray-800 leading-relaxed text-base whitespace-pre-wrap">
                {currentChange.old_text?.split(/(\s+)/).map((w, i) => {
                  const newWords = currentChange.new_text?.split(/(\s+)/).filter(w => w.trim().length > 0) || [];
                  const newSet = new Set(newWords);
                  const isRemoved = !newSet.has(w) && w.trim().length > 0;
                  
                  return (
                    <span
                      key={i}
                      className={isRemoved ? 
                        "bg-red-100 text-red-900 px-1 py-0.5 rounded border border-red-200 font-medium" : 
                        "text-gray-700"
                      }
                    >
                      {w}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* New Version Panel */}
        <div className="h-full overflow-auto p-8 bg-gradient-to-b from-emerald-50/20 to-white border-l border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-4 w-4 bg-emerald-500 rounded-full"></div>
                <h3 className="text-lg font-bold text-emerald-700">NEW VERSION</h3>
                <span className="ml-auto text-sm font-medium bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                  {detail.version_new_label}
                </span>
              </div>
              <p className="text-sm text-gray-500">ข้อความที่เพิ่มเข้ามาจะถูกไฮไลท์ด้วยสีเขียว</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-emerald-100 shadow-sm">
              <div className="text-gray-800 leading-relaxed text-base whitespace-pre-wrap">
                {currentChange.new_text?.split(/(\s+)/).map((w, i) => {
                  const oldWords = currentChange.old_text?.split(/(\s+)/).filter(w => w.trim().length > 0) || [];
                  const oldSet = new Set(oldWords);
                  const isAdded = !oldSet.has(w) && w.trim().length > 0;
                  
                  return (
                    <span
                      key={i}
                      className={isAdded ? 
                        "bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded border border-emerald-200 font-medium" : 
                        "text-gray-700"
                      }
                    >
                      {w}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Footer with Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-full px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">Section:</span>
              <span className="font-semibold">{currentChange.section_label || "No Section"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Type:</span>
              {changeTypeBadge(currentChange.change_type)}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Risk:</span>
              {riskBadge(currentChange.risk_level)}
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300">ESC</kbd> to close • 
            <kbd className="mx-1 px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300">←</kbd>
            <kbd className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300">→</kbd> to navigate
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpandableText({ text, title, maxLength = 300, type = "normal" }: { 
  text: string | null | undefined; 
  title?: string;
  maxLength?: number;
  type?: "normal" | "ai";
}) {
  const raw = normalizeText(text);
  const [expanded, setExpanded] = useState(false);
  const isLong = raw.length > maxLength;
  const shown = expanded ? raw : raw.slice(0, maxLength) + (isLong ? "..." : "");

  const bgColor = type === "ai" ? "bg-gradient-to-br from-blue-50/80 to-blue-100/50" : "bg-gray-50";

  return (
    <div className={`rounded-xl p-4 ${bgColor} border ${type === "ai" ? "border-blue-200" : "border-gray-200"}`}>
      {title && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-bold text-gray-900">{title}</span>
        </div>
      )}
      <div className="text-base text-gray-800 whitespace-pre-wrap leading-relaxed font-normal">
        {raw || <span className="text-gray-400 italic">ไม่มีข้อมูล</span>}
      </div>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          {expanded ? "ย่อข้อความ" : "อ่านต่อ..."}
        </button>
      )}
    </div>
  );
}

/* ================= AI CHAT COMPONENT ================= */

function AIChat({ change }: { change: ChangeItem }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatAnswer, setChatAnswer] = useState("");
  const [chatError, setChatError] = useState<string | null>(null);

  const sendChat = async () => {
    const question = normalizeText(chatQuestion);
    if (!question) return;

    setChatLoading(true);
    setChatError(null);

    try {
      const res = await fetch(`${API_BASE}/changes/${change.id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question,
          mode: "detailed"
        }),
      });

      if (!res.ok) throw new Error(`Chat failed (${res.status})`);
      const data = await res.json();

      setChatAnswer(normalizeText(data?.answer) || "");
    } catch (e: any) {
      setChatError(e?.message || "ส่งคำถามไม่สำเร็จ");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Analysis Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* AI Comment */}
        <div className="rounded-xl overflow-hidden border border-blue-200 bg-gradient-to-br from-blue-50/80 to-white shadow-sm">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <InformationCircleIcon className="h-5 w-5 text-white" />
                <h3 className="text-base font-bold text-white">ความคิดเห็นจาก AI</h3>
              </div>
              <CopyButton text={normalizeText(change.ai_comment)} size="sm" variant="primary" />
            </div>
          </div>
          <div className="p-4">
            <ExpandableText text={change.ai_comment} type="ai" />
          </div>
        </div>

        {/* AI Suggestion */}
        <div className="rounded-xl overflow-hidden border border-amber-200 bg-gradient-to-br from-amber-50/80 to-white shadow-sm">
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LightBulbIcon className="h-5 w-5 text-white" />
                <h3 className="text-base font-bold text-white">คำแนะนำจาก AI</h3>
              </div>
              <CopyButton text={normalizeText(change.ai_suggestion)} size="sm" variant="primary" />
            </div>
          </div>
          <div className="p-4">
            <ExpandableText text={change.ai_suggestion} type="ai" />
          </div>
        </div>
      </div>

      {/* Risk Reason */}
      {normalizeText(change.risk_reason) && (
        <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50/80 to-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-gray-700" />
            <h3 className="text-base font-bold text-gray-900">เหตุผลระดับความเสี่ยง</h3>
          </div>
          <div className="text-base text-gray-700 leading-relaxed">{change.risk_reason}</div>
        </div>
      )}

      {/* AI Chat Interface */}
      <div className="rounded-xl border border-purple-200 overflow-hidden bg-gradient-to-br from-purple-50/30 to-white shadow-sm">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-between hover:from-purple-700 hover:to-purple-800 transition-all"
        >
          <div className="flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
            <span className="text-base font-bold text-white">ถาม AI เพิ่มเติมเกี่ยวกับจุดนี้</span>
          </div>
          <span className="text-white font-bold">{chatOpen ? "▲" : "▼"}</span>
        </button>

        {chatOpen && (
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">คำถามของคุณ</label>
              <textarea
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                placeholder="พิมพ์คำถามเกี่ยวกับการเปลี่ยนแปลงนี้..."
                rows={3}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {chatError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  {chatError}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={sendChat}
                disabled={chatLoading || !chatQuestion.trim()}
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium disabled:opacity-50 transition-all"
              >
                {chatLoading ? (
                  <div className="flex items-center gap-2">
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    กำลังวิเคราะห์...
                  </div>
                ) : "ส่งคำถาม"}
              </button>
              <CopyButton text={chatAnswer} label="คัดลอกคำตอบ" variant="primary" />
            </div>

            {chatAnswer && (
              <div className="mt-4 p-4 bg-gradient-to-br from-blue-50/50 to-white border border-blue-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <SparklesIcon className="h-5 w-5 text-blue-600" />
                  <h4 className="text-base font-bold text-gray-900">คำตอบจาก AI</h4>
                </div>
                <div className="text-base text-gray-800 whitespace-pre-wrap leading-relaxed">{chatAnswer}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= MAIN PAGE ================= */

export default function CompareReportPage() {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<ComparisonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"ALL" | RiskLevel>("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | ChangeType>("ALL");
  const [annotating, setAnnotating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenChangeIndex, setFullscreenChangeIndex] = useState(0);

  useEffect(() => {
    if (id) loadDetail();
  }, [id]);

  const loadDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/comparisons/${id}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const data: ComparisonDetail = await res.json();
      setDetail(data);
    } catch (err: any) {
      setError(err?.message || "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const handleAnnotate = async () => {
    if (!id) return;
    setAnnotating(true);
    try {
      const res = await fetch(`${API_BASE}/comparisons/${id}/annotate`, { method: "POST" });
      if (!res.ok) throw new Error(`Annotation failed (${res.status})`);
      await loadDetail();
    } catch (err: any) {
      console.error("Annotation error:", err);
    } finally {
      setAnnotating(false);
    }
  };

  const handleOpenFullscreen = (index: number) => {
    setFullscreenChangeIndex(index);
    setShowFullscreen(true);
  };

  const filteredChanges = useMemo(() => {
    const changes = detail?.changes || [];
    const query = searchQuery.trim();

    return changes.filter(c => {
      if (riskFilter !== "ALL") {
        const lv = (c.risk_level || "LOW").toUpperCase();
        if (lv !== riskFilter) return false;
      }

      if (typeFilter !== "ALL") {
        if (c.change_type !== typeFilter) return false;
      }

      if (query.length > 0) {
        const hay = [
          c.section_label,
          c.old_text,
          c.new_text,
          c.ai_comment,
          c.ai_suggestion,
          c.risk_reason,
          c.change_type,
          c.risk_level,
        ]
          .map(x => normalizeText(x as any))
          .join(" | ");

        if (!contains(hay, query)) return false;
      }

      return true;
    });
  }, [detail?.changes, searchQuery, riskFilter, typeFilter]);

  const riskSummary = useMemo(() => {
    const changes = detail?.changes || [];
    return {
      HIGH: changes.filter(c => c.risk_level === "HIGH").length,
      MEDIUM: changes.filter(c => c.risk_level === "MEDIUM").length,
      LOW: changes.filter(c => c.risk_level === "LOW").length,
      TOTAL: changes.length,
    };
  }, [detail?.changes]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-700 font-medium">กำลังโหลดรายงาน...</p>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white border border-red-200 rounded-xl p-8 max-w-md shadow-sm">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-gray-900 mt-4 text-center">ไม่พบรายงาน</h2>
          <p className="text-gray-600 mt-2 text-center">{error || "ไม่พบข้อมูลการเปรียบเทียบนี้"}</p>
          <button
            onClick={loadDetail}
            className="mt-6 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium shadow-sm"
          >
            โหลดใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {showFullscreen && detail && (
        <FullscreenDiffViewer 
          detail={detail} 
          onClose={() => setShowFullscreen(false)} 
        />
      )}
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-gray-100 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    {detail.document_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-gray-700 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg font-semibold shadow-sm">
                        {detail.version_old_label}
                      </span>
                      <span className="text-gray-500">→</span>
                      <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm rounded-lg font-semibold shadow-sm">
                        {detail.version_new_label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">•</span>
                      {formatDateTime(detail.created_at)}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">•</span>
                      <span>ID: {detail.id}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start lg:items-end gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-600 font-medium mb-1">ความเสี่ยงรวม</div>
                    <div className={`text-2xl font-bold ${
                      detail.overall_risk_level?.includes("HIGH") ? "text-red-600" :
                      detail.overall_risk_level?.includes("MEDIUM") ? "text-amber-600" :
                      "text-emerald-600"
                    }`}>
                      {detail.overall_risk_level || "ไม่ระบุ"}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link
                      href={`/reports/generate?comparisonId=${detail.id}`}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium shadow-sm"
                    >
                      <DocumentArrowDownIcon className="h-4 w-4" />
                      สร้างรายงาน
                    </Link>
                    
                    <button
                      onClick={handleAnnotate}
                      disabled={annotating}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-70 font-medium shadow-sm"
                    >
                      {annotating ? (
                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                      ) : (
                        <SparklesIcon className="h-4 w-4" />
                      )}
                      {annotating ? "กำลังวิเคราะห์..." : "AI วิเคราะห์ใหม่"}
                    </button>
                    
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium shadow-sm"
                    >
                      <AdjustmentsHorizontalIcon className="h-4 w-4" />
                      ฟิลเตอร์
                    </button>
                  </div>
                </div>
              </div>

              {/* Risk Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-red-50 to-white border border-red-200 rounded-xl p-4 shadow-sm">
                    <div className="text-2xl font-bold text-red-700">{riskSummary.HIGH}</div>
                    <div className="text-sm font-medium text-red-600">HIGH RISK</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-xl p-4 shadow-sm">
                    <div className="text-2xl font-bold text-amber-700">{riskSummary.MEDIUM}</div>
                    <div className="text-sm font-medium text-amber-600">MEDIUM RISK</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-xl p-4 shadow-sm">
                    <div className="text-2xl font-bold text-emerald-700">{riskSummary.LOW}</div>
                    <div className="text-sm font-medium text-emerald-600">LOW RISK</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-4 shadow-sm">
                    <div className="text-2xl font-bold text-blue-700">{riskSummary.TOTAL}</div>
                    <div className="text-sm font-medium text-blue-600">TOTAL CHANGES</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            {detail.summary_text && (
              <div className="mt-6 bg-gradient-to-br from-blue-50/80 to-white rounded-2xl border border-blue-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DocumentMagnifyingGlassIcon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">สรุปผลการวิเคราะห์</h2>
                </div>
                <div className="text-base text-gray-800 leading-relaxed bg-white/50 border border-blue-100 rounded-xl p-4">
                  {detail.summary_text}
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mb-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FunnelIcon className="h-5 w-5 text-gray-700" />
                  <h3 className="font-bold text-gray-900">ค้นหาและกรองข้อมูล</h3>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  ปิด
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ค้นหาคำ</label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ค้นหาคำในรายการเปลี่ยนแปลง..."
                      className="w-full pl-10 pr-3 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">กรองความเสี่ยง</label>
                    <select
                      value={riskFilter}
                      onChange={(e) => setRiskFilter(e.target.value as any)}
                      className="w-full px-3 py-3 text-base border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ALL">ความเสี่ยงทั้งหมด</option>
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">กรองประเภท</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as any)}
                      className="w-full px-3 py-3 text-base border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ALL">ประเภททั้งหมด</option>
                      <option value="ADDED">ADDED</option>
                      <option value="REMOVED">REMOVED</option>
                      <option value="MODIFIED">MODIFIED</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                แสดง {filteredChanges.length} จาก {detail.changes.length} รายการ
              </div>
            </div>
          )}

          {/* Changes List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">รายการเปลี่ยนแปลง</h2>
              <div className="text-sm text-gray-600">
                {filteredChanges.length} รายการ
              </div>
            </div>

            {filteredChanges.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
                <p className="text-lg text-gray-500">ไม่พบรายการเปลี่ยนแปลงตามเงื่อนไขที่เลือก</p>
              </div>
            ) : (
              filteredChanges.map((change, index) => (
                <div key={change.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {changeTypeBadge(change.change_type)}
                        <h3 className="text-lg font-bold text-gray-900">
                          {change.section_label || "ไม่มีหัวข้อ"}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        {riskBadge(change.risk_level)}
                        <span className="text-sm text-gray-500">ID: {change.id}</span>
                        <button
                          onClick={() => handleOpenFullscreen(index)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium shadow-sm"
                        >
                          <ArrowsPointingOutIcon className="h-4 w-4" />
                          เปิดเต็มจอ
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-6">
                    {/* Diff View with highlighted changes */}
                    <div>
                      <h4 className="text-base font-bold text-gray-800 mb-3">การเปลี่ยนแปลงข้อความ</h4>
                      <DiffView
                        oldText={normalizeText(change.old_text)}
                        newText={normalizeText(change.new_text)}
                      />
                    </div>

                    {/* AI Analysis Section */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
                        <h4 className="text-lg font-bold text-gray-900">การวิเคราะห์ด้วย AI</h4>
                      </div>
                      <AIChat change={change} />
                    </div>

                    {/* Quick Copy */}
                    <div className="border-t border-gray-200 pt-4">
                      <CopyButton
                        text={`[${change.section_label || "-"}]\n` +
                          `ประเภท: ${change.change_type} | ความเสี่ยง: ${change.risk_level}\n\n` +
                          `OLD:\n${change.old_text || "-"}\n\n` +
                          `NEW:\n${change.new_text || "-"}\n\n` +
                          `AI COMMENT:\n${change.ai_comment || "-"}\n\n` +
                          `AI SUGGESTION:\n${change.ai_suggestion || "-"}`
                        }
                        label="คัดลอกข้อมูลทั้งหมด"
                        variant="primary"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}