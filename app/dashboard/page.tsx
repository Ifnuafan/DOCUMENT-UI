export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white/80 backdrop-blur p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          ภาพรวมเอกสาร เวอร์ชัน และการเปรียบเทียบล่าสุด
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Documents</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">—</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Versions</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">—</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Comparisons</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">—</p>
        </div>
      </div>
    </div>
  );
}
