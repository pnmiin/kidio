import { motion } from "motion/react";
import { Brain, CheckCircle2, Volume2 } from "lucide-react";

export type BodyPartId =
  | "head"
  | "hair"
  | "eyes"
  | "ears"
  | "nose"
  | "mouth"
  | "arms"
  | "hands"
  | "fingers"
  | "legs"
  | "knees"
  | "feet";

export type BodyPart = {
  id: BodyPartId;
  label: string;
  icon: string;
  audio: string;
  side: "left" | "right";
  color: string;
  softColor: string;
  labelY: number;
  connectorTarget: { x: number; y: number };
};

export type BodyHotspot = {
  id: string;
  target: BodyPartId;
  top: string;
  left: string;
  width: string;
  height: string;
  rounded?: string;
};

export function ModeToggle({
  mode,
  onChange,
}: {
  mode: "learn" | "quiz";
  onChange: (mode: "learn" | "quiz") => void;
}) {
  return (
    <div className="inline-flex rounded-full border-4 border-white bg-white/85 p-1.5 shadow-[0_12px_30px_rgba(43,128,190,0.14)]">
      {[
        { id: "learn" as const, label: "Learn Mode", icon: Volume2 },
        { id: "quiz" as const, label: "Quiz Mode", icon: Brain },
      ].map((item) => {
        const active = mode === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`inline-flex min-h-12 items-center gap-2 rounded-full px-5 py-2 text-base font-black transition sm:px-7 ${
              active
                ? "bg-gradient-to-r from-[#2BADEE] to-[#7C6CF2] text-white shadow-md"
                : "text-[#45637D] hover:bg-sky-50"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function BodyPartLabel({
  part,
  active,
  playing,
  shaking,
  onClick,
}: {
  part: BodyPart;
  active: boolean;
  playing: boolean;
  shaking: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      animate={
        shaking
          ? { x: [0, -7, 7, -5, 5, 0] }
          : active
            ? { y: [0, -6, 0], scale: [1, 1.04, 1] }
            : { x: 0, y: 0, scale: 1 }
      }
      transition={{ duration: shaking ? 0.35 : 0.45 }}
      onClick={onClick}
      className={`relative z-20 flex min-h-16 w-full items-center gap-3 rounded-full border-[3px] bg-white px-3 py-2 text-left shadow-[0_10px_24px_rgba(43,128,190,0.12)] transition hover:-translate-y-1 ${
        active ? "ring-4 ring-white/90 shadow-[0_14px_30px_rgba(43,128,190,0.23)]" : ""
      }`}
      style={{ borderColor: part.color }}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full"
        style={{ backgroundColor: part.softColor }}
      >
        <img src={part.icon} alt="" className="h-full w-full object-contain" />
      </span>
      <span className="flex-1 text-lg font-black capitalize text-[#173B59]">
        {part.label}
      </span>
      {playing && (
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: part.color }}
        >
          <Volume2 className="h-5 w-5" />
        </span>
      )}
    </motion.button>
  );
}

export function BodyMapCharacter({
  hotspots,
  selectedPart,
  shakingPart,
  onPartClick,
}: {
  hotspots: BodyHotspot[];
  selectedPart: BodyPartId | null;
  shakingPart: BodyPartId | null;
  onPartClick: (part: BodyPartId) => void;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[370px]">
      <motion.div
        animate={shakingPart ? { x: [0, -5, 5, -3, 3, 0] } : { x: 0 }}
        className="relative"
      >
        <div className="absolute inset-x-[16%] bottom-[4%] h-10 rounded-full bg-sky-200/35 blur-xl" />
        <img
          src="/assets/body-parts/body-child.png"
          alt="3D cartoon child body map"
          className="relative z-[1] block h-auto w-full select-none drop-shadow-[0_20px_24px_rgba(43,128,190,0.16)]"
          draggable={false}
        />
        {hotspots.map((hotspot) => {
          const active = hotspot.target === selectedPart;
          return (
            <motion.button
              key={hotspot.id}
              type="button"
              aria-label={`Select ${hotspot.target}`}
              onClick={() => onPartClick(hotspot.target)}
              animate={
                active
                  ? {
                      boxShadow: [
                        "0 0 0 3px rgba(255,212,71,0.35)",
                        "0 0 0 10px rgba(255,212,71,0.08)",
                        "0 0 0 3px rgba(255,212,71,0.35)",
                      ],
                    }
                  : { boxShadow: "0 0 0 0 rgba(0,0,0,0)" }
              }
              transition={{ repeat: active ? Infinity : 0, duration: 1.2 }}
              className={`absolute z-10 min-h-7 min-w-7 border-2 transition ${
                active
                  ? "border-[#FFD447] bg-[#FFD447]/30"
                  : "border-transparent bg-transparent hover:border-sky-300/70 hover:bg-sky-200/20"
              }`}
              style={{
                top: hotspot.top,
                left: hotspot.left,
                width: hotspot.width,
                height: hotspot.height,
                borderRadius: hotspot.rounded ?? "999px",
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

export function FeedbackBubble({
  message,
  kind,
}: {
  message: string;
  kind: "positive" | "retry" | "prompt";
}) {
  const styles = {
    positive: "border-emerald-200 bg-emerald-50 text-emerald-700",
    retry: "border-rose-200 bg-rose-50 text-rose-600",
    prompt: "border-violet-200 bg-violet-50 text-violet-700",
  };

  return (
    <motion.div
      key={message}
      initial={{ opacity: 0, y: 8, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-5 py-2.5 text-lg font-black shadow-sm ${styles[kind]}`}
    >
      {kind === "positive" && <CheckCircle2 className="h-5 w-5" />}
      {message}
    </motion.div>
  );
}
