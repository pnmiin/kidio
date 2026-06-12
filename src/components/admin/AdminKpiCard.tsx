import type { ReactNode } from "react";
import type { AdminKpi } from "@/types/admin";

const accentClasses = {
  sky: "bg-sky-50 text-sky-600",
  violet: "bg-violet-50 text-violet-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
};

export function AdminKpiCard({
  kpi,
  icon,
}: {
  kpi: AdminKpi;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className={`rounded-xl p-2.5 ${accentClasses[kpi.accent]}`}>{icon}</div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          {kpi.trend}
        </span>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{kpi.title}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{kpi.value}</p>
      <p className="mt-1 text-xs text-slate-400">{kpi.helper}</p>
    </div>
  );
}
