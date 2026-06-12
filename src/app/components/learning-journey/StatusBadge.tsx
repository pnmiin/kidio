import { Check, Lock } from "lucide-react";
import type { TopicStatus } from "../../data/learningJourneyData";

export function StatusBadge({ status }: { status: TopicStatus }) {
  if (status === "completed") {
    return (
      <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
        <Check className="h-5 w-5" />
      </span>
    );
  }
  if (status === "current") {
    return (
      <span className="absolute right-3 top-3 rounded-full bg-violet-600 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white shadow-lg">
        Current
      </span>
    );
  }
  if (status === "locked") {
    return (
      <span className="absolute bottom-3 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-white text-slate-400 shadow-lg">
        <Lock className="h-5 w-5" />
      </span>
    );
  }
  return null;
}
