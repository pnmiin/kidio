import { Bell, CalendarDays, LogOut, Search, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";

import { clearAdminSession } from "@/app/utils/adminAuth";

export function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminSession();
    navigate("/parent-login", { replace: true });
  };

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
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-100 hover:text-rose-700"
            aria-label="Log out admin"
          >
            <LogOut className="h-5 w-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
