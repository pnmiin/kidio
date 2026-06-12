import {
  Activity, Award, BarChart3, BookOpen, BrainCircuit, HeartPulse,
  LayoutDashboard, Mic2, Users, WalletCards,
} from "lucide-react";

export const adminSections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "User Analytics", icon: Users },
  { id: "learning", label: "Learning Analytics", icon: BookOpen },
  { id: "pronunciation", label: "Pronunciation Analytics", icon: Mic2 },
  { id: "ai", label: "AI Analytics", icon: BrainCircuit },
  { id: "achievements", label: "Achievement Analytics", icon: Award },
  { id: "parents", label: "Parent Analytics", icon: BarChart3 },
  { id: "revenue", label: "Revenue Analytics", icon: WalletCards },
  { id: "content", label: "Content Analytics", icon: Activity },
  { id: "system", label: "System Health", icon: HeartPulse },
];

export function AdminSidebar({ activeSection }: { activeSection: string }) {
  return (
    <aside className="border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex h-16 items-center gap-3 px-5 lg:h-20">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 font-black text-white">K</div>
        <div>
          <p className="font-bold text-slate-900">KIDIO Admin</p>
          <p className="text-xs text-slate-400">Platform intelligence</p>
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
        {adminSections.map(({ id, label, icon: Icon }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              activeSection === id
                ? "bg-sky-50 text-sky-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Icon className="h-4.5 w-4.5" />
            {label}
          </a>
        ))}
      </nav>
      <div className="absolute bottom-5 left-4 right-4 hidden rounded-xl bg-slate-50 p-3 text-xs text-slate-500 lg:block">
        <span className="font-semibold text-slate-700">Development access</span>
        <br />
        Role guard pending auth integration.
      </div>
    </aside>
  );
}
