import { Bell, CalendarDays, Search, ShieldCheck } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Platform Overview</h1>
          <p className="hidden text-sm text-slate-500 sm:block">Monitor growth, learning quality and operations.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 md:flex">
            <Search className="h-4 w-4" />
            Search metrics
          </div>
          <button className="rounded-xl border border-slate-200 p-2.5 text-slate-500"><CalendarDays className="h-5 w-5" /></button>
          <button className="rounded-xl border border-slate-200 p-2.5 text-slate-500"><Bell className="h-5 w-5" /></button>
          <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-white">
            <ShieldCheck className="h-5 w-5" />
            <span className="hidden text-sm font-semibold sm:inline">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
