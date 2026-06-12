import type { JourneyLevel } from "../../data/learningJourneyData";

const themes = {
  sky: "from-sky-400 to-cyan-500",
  emerald: "from-emerald-400 to-teal-500",
  amber: "from-amber-400 to-orange-500",
  violet: "from-violet-500 to-fuchsia-500",
  rose: "from-rose-400 to-pink-500",
};

export function LevelBadgePanel({ level }: { level: JourneyLevel }) {
  return (
    <div className={`flex min-h-[190px] flex-col justify-center rounded-[26px] bg-gradient-to-br ${themes[level.theme]} p-5 text-white shadow-lg sm:min-h-[205px]`}>
      <span className="text-xs font-black uppercase tracking-[0.18em] text-white/80">
        Level {level.levelNumber}
      </span>
      <h2 className="mt-2 text-2xl font-black">{level.title}</h2>
      <p className="mt-2 text-sm font-semibold leading-5 text-white/85">
        {level.subtitle}
      </p>
    </div>
  );
}
