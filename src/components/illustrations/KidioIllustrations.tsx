import type { ReactNode } from "react";
import { BookOpen, Eye, Gamepad2, Headphones, Mic2 } from "lucide-react";

type IconTone = "sky" | "pink" | "mint" | "sun";

const toneMap: Record<IconTone, { bg: string; shadow: string; icon: string }> = {
  sky: {
    bg: "from-sky-100 via-white to-blue-200",
    shadow: "shadow-[0_16px_30px_rgba(56,189,248,0.22)]",
    icon: "text-sky-500",
  },
  pink: {
    bg: "from-pink-100 via-white to-rose-200",
    shadow: "shadow-[0_16px_30px_rgba(244,114,182,0.22)]",
    icon: "text-pink-500",
  },
  mint: {
    bg: "from-emerald-100 via-white to-teal-200",
    shadow: "shadow-[0_16px_30px_rgba(45,212,191,0.22)]",
    icon: "text-emerald-500",
  },
  sun: {
    bg: "from-amber-100 via-white to-yellow-200",
    shadow: "shadow-[0_16px_30px_rgba(251,191,36,0.24)]",
    icon: "text-amber-500",
  },
};

function ClayOrb({
  children,
  tone,
  className = "",
}: {
  children: ReactNode;
  tone: IconTone;
  className?: string;
}) {
  const toneClass = toneMap[tone];

  return (
    <div
      className={`relative flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br ${toneClass.bg} ${toneClass.shadow} ${className}`}
    >
      <span className="absolute left-4 top-3 h-4 w-7 rounded-full bg-white/80 blur-[1px]" />
      <div className={toneClass.icon}>{children}</div>
    </div>
  );
}

export function FeatureClayIcon({ name }: { name: "Watch" | "Listen" | "Speak" | "Play" }) {
  const iconProps = { className: "h-9 w-9", strokeWidth: 2.4 };
  const config = {
    Watch: { tone: "sky" as const, icon: <Eye {...iconProps} /> },
    Listen: { tone: "pink" as const, icon: <Headphones {...iconProps} /> },
    Speak: { tone: "mint" as const, icon: <Mic2 {...iconProps} /> },
    Play: { tone: "sun" as const, icon: <Gamepad2 {...iconProps} /> },
  }[name];

  return <ClayOrb tone={config.tone}>{config.icon}</ClayOrb>;
}

export function LevelAvatar({
  tone,
  label,
}: {
  tone: "pink" | "sky" | "mint" | "sun";
  label: string;
}) {
  const colors = {
    pink: { shirt: "#fb7185", hair: "#7c2d12", bg: "#ffe4ef" },
    sky: { shirt: "#38bdf8", hair: "#92400e", bg: "#dff5ff" },
    mint: { shirt: "#34d399", hair: "#78350f", bg: "#dff8ed" },
    sun: { shirt: "#fbbf24", hair: "#713f12", bg: "#fff1c7" },
  }[tone];

  return (
    <div className="relative mx-auto h-24 w-24">
      <div
        className="absolute inset-0 rounded-[34px] shadow-[inset_0_12px_18px_rgba(255,255,255,0.7),0_16px_26px_rgba(91,142,166,0.16)]"
        style={{ backgroundColor: colors.bg }}
      />
      <svg viewBox="0 0 96 96" className="relative h-24 w-24" aria-hidden="true">
        <ellipse cx="48" cy="84" rx="29" ry="8" fill="rgba(83,124,145,0.12)" />
        <path d="M28 79c2-17 12-26 20-26s18 9 20 26H28Z" fill={colors.shirt} />
        <circle cx="48" cy="40" r="18" fill="#ffd1b8" />
        <path d="M31 38c4-16 24-23 36-7 1 3 1 7 0 11-9-8-23-9-36-4Z" fill={colors.hair} />
        <circle cx="41" cy="42" r="2.3" fill="#20344c" />
        <circle cx="55" cy="42" r="2.3" fill="#20344c" />
        <path d="M42 50c4 4 9 4 13 0" fill="none" stroke="#20344c" strokeLinecap="round" strokeWidth="2.4" />
        <circle cx="33" cy="50" r="4" fill="#ffb4b8" opacity="0.5" />
        <circle cx="63" cy="50" r="4" fill="#ffb4b8" opacity="0.5" />
      </svg>
      <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-black text-[#1a3a5c] shadow-[0_10px_20px_rgba(43,173,238,0.16)]">
        {label}
      </span>
    </div>
  );
}

export function FloatingIsland() {
  return (
    <svg viewBox="0 0 360 220" className="h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id="islandGrass" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#b7f7d4" />
          <stop offset="1" stopColor="#6ee7b7" />
        </linearGradient>
        <linearGradient id="castlePink" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#ffe0ee" />
          <stop offset="1" stopColor="#f9a8d4" />
        </linearGradient>
      </defs>
      <ellipse cx="180" cy="178" rx="122" ry="20" fill="rgba(69,126,151,0.12)" />
      <path d="M72 136c22-42 55-62 106-62 63 0 96 25 114 62-36 34-183 35-220 0Z" fill="url(#islandGrass)" />
      <path d="M95 139c36 20 135 27 173 1-19 36-50 57-88 62-39-5-69-26-85-63Z" fill="#d8b88d" />
      <path d="M128 84h104v58H128Z" fill="#fef3c7" />
      <path d="M144 58h26v84h-26Z" fill="url(#castlePink)" />
      <path d="M190 52h30v90h-30Z" fill="url(#castlePink)" />
      <path d="M138 61l19-23 20 23H138Z" fill="#60a5fa" />
      <path d="M184 55l21-27 23 27H184Z" fill="#60a5fa" />
      <path d="M166 102h26v40h-26Z" fill="#93c5fd" />
      <circle cx="155" cy="89" r="5" fill="#fff" opacity="0.75" />
      <circle cx="207" cy="88" r="5" fill="#fff" opacity="0.75" />
    </svg>
  );
}

export function BookMascotDecor() {
  return (
    <div className="relative h-40 w-40">
      <div className="absolute inset-x-3 bottom-3 h-20 rounded-[34px] bg-gradient-to-br from-sky-100 to-blue-200 shadow-[inset_0_10px_20px_rgba(255,255,255,0.7),0_18px_28px_rgba(43,173,238,0.14)]" />
      <div className="absolute left-10 top-8 flex h-24 w-24 items-center justify-center rounded-[28px] bg-white shadow-[0_16px_28px_rgba(91,142,166,0.18)]">
        <BookOpen className="h-12 w-12 text-[#2BADEE]" />
      </div>
      <span className="absolute right-6 top-4 h-9 w-9 rounded-full bg-yellow-200 shadow-[inset_0_6px_10px_rgba(255,255,255,0.65)]" />
      <span className="absolute left-4 top-20 h-6 w-6 rounded-full bg-pink-200 shadow-[inset_0_5px_8px_rgba(255,255,255,0.65)]" />
    </div>
  );
}
