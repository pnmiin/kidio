import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Building2,
  Castle,
  CheckCircle2,
  FerrisWheel,
  Flag,
  Home,
  Lock,
  MapPin,
  Mountain,
  Play,
  Star,
} from "lucide-react";
import { KidioPageHeader } from "../../components/KidioPageHeader";
import { getNumberLandProgress } from "../utils/numberLandProgress";

type NumberWorld = {
  id: string;
  title: string;
  range: string;
  status: "completed" | "unlocked" | "locked";
  route?: string;
  badge?: string;
  helperText?: string;
  colors: {
    card: string;
    icon: string;
    accent: string;
    button: string;
  };
  Icon: typeof Home;
};

const worlds: NumberWorld[] = [
  {
    id: "number-village",
    title: "Number Village",
    range: "Numbers 1-10",
    status: "unlocked",
    badge: "Start here",
    route: "/number-land/village",
    colors: {
      card: "border-sky-200 bg-white",
      icon: "bg-sky-100 text-sky-600",
      accent: "bg-amber-100 text-amber-700",
      button: "bg-[#2BADEE] text-white shadow-sky-200 hover:bg-[#1E90D0]",
    },
    Icon: Home,
  },
  {
    id: "teen-town",
    title: "Teen Town",
    range: "Numbers 11-20",
    status: "locked",
    helperText: "Finish Number Village to unlock",
    route: "/number-land/teen-town",
    colors: {
      card: "border-violet-100 bg-white/78",
      icon: "bg-violet-100 text-violet-500",
      accent: "bg-violet-100 text-violet-600",
      button: "bg-slate-100 text-slate-500",
    },
    Icon: Building2,
  },
  {
    id: "tens-mountain",
    title: "Tens Mountain",
    range: "10, 20, 30...100",
    status: "locked",
    helperText: "Learn tens after Teen Town",
    route: "/number-land/tens-mountain",
    colors: {
      card: "border-emerald-100 bg-white/78",
      icon: "bg-emerald-100 text-emerald-600",
      accent: "bg-emerald-100 text-emerald-700",
      button: "bg-slate-100 text-slate-500",
    },
    Icon: Mountain,
  },
  {
    id: "big-number-city",
    title: "Big Number City",
    range: "Numbers 21-99",
    status: "locked",
    helperText: "Unlock after Tens Mountain",
    route: "/number-land/big-number-city",
    colors: {
      card: "border-pink-100 bg-white/78",
      icon: "bg-pink-100 text-pink-500",
      accent: "bg-pink-100 text-pink-600",
      button: "bg-slate-100 text-slate-500",
    },
    Icon: Castle,
  },
  {
    id: "review-park",
    title: "Review Park",
    range: "Review 1-100",
    status: "locked",
    helperText: "Unlock after Big Number City",
    route: "/number-land/review-park",
    colors: {
      card: "border-amber-100 bg-white/78",
      icon: "bg-amber-100 text-amber-600",
      accent: "bg-amber-100 text-amber-700",
      button: "bg-slate-100 text-slate-500",
    },
    Icon: FerrisWheel,
  },
];

function WorldCard({
  world,
  index,
  cardRef,
}: {
  world: NumberWorld;
  index: number;
  cardRef?: (element: HTMLElement | null) => void;
}) {
  const navigate = useNavigate();
  const isCompleted = world.status === "completed";
  const isUnlocked = world.status === "unlocked" || isCompleted;
  const isPlayable = Boolean(
    world.route &&
      (world.id === "number-village" ||
        world.id === "teen-town" ||
        world.id === "tens-mountain" ||
        world.id === "big-number-city" ||
        world.id === "review-park") &&
      isUnlocked,
  );
  const actionLabel = isPlayable
    ? isCompleted
      ? "Replay"
      : world.id === "review-park"
        ? "Play Review"
        : "Play"
    : isUnlocked
      ? "Unlocked"
      : "Locked";
  const Icon = world.Icon;
  const gridPlacement = index === worlds.length - 1 ? "md:col-span-2 md:justify-self-center" : "";

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 180 }}
      className={`relative z-10 flex min-h-[15.5rem] w-full max-w-[22.5rem] flex-col rounded-[1.75rem] border-2 p-5 shadow-xl shadow-sky-100/70 ${world.colors.card} ${
        isUnlocked ? "scale-[1.01] ring-4 ring-sky-100" : "opacity-75"
      } ${gridPlacement}`}
    >
      <div className="flex flex-1 items-start gap-4">
        <div className={`relative flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] ${world.colors.icon}`}>
          <Icon className="h-11 w-11" />
          {isCompleted ? (
            <CheckCircle2 className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-white p-1 text-emerald-500 shadow-sm" />
          ) : isUnlocked ? (
            <MapPin className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-white p-1 text-rose-400 shadow-sm" />
          ) : (
            <Lock className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-white p-1.5 text-slate-400 shadow-sm" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-h-[4.25rem] flex-wrap items-start gap-2">
            <h2 className="text-2xl font-black leading-tight text-[#183B5B]">{world.title}</h2>
            {world.badge ? (
              <span className={`rounded-full px-3 py-1 text-sm font-black ${world.colors.accent}`}>
                {world.badge}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-lg font-black text-slate-500">{world.range}</p>
          {world.helperText ? (
            <p className="mt-3 min-h-[2.75rem] max-w-[17rem] text-base font-bold leading-snug text-slate-500">
              {world.helperText}
            </p>
          ) : (
            <p className="mt-3 min-h-[2.75rem] text-base font-bold leading-snug text-sky-600">
              Ready for your first number adventure.
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto flex justify-center pt-5">
        <button
          type="button"
          disabled={!isPlayable}
          onClick={() => {
            if (isPlayable && world.route) navigate(world.route);
          }}
          className={`flex min-h-14 min-w-36 items-center justify-center gap-2 rounded-full px-7 py-3 text-lg font-black shadow-lg transition ${
            isPlayable
              ? ""
              : isUnlocked
                ? "cursor-default"
                : "disabled:cursor-not-allowed"
          } ${world.colors.button}`}
        >
          {isPlayable ? (
            <Play className="h-6 w-6 fill-white" />
          ) : isUnlocked ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <Lock className="h-5 w-5" />
          )}
          {actionLabel}
        </button>
      </div>
    </motion.article>
  );
}

export function NumberLandMap() {
  const mapRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [desktopPath, setDesktopPath] = useState("");
  const [mobilePath, setMobilePath] = useState("");
  const [progress] = useState(() => getNumberLandProgress());
  const numberVillageCompleted = progress.numberVillage?.completed === true;
  const teenTownUnlocked =
    progress.teenTown?.unlocked === true || numberVillageCompleted;
  const teenTownCompleted = progress.teenTown?.completed === true;
  const tensMountainUnlocked =
    progress.tensMountain?.unlocked === true || teenTownCompleted;
  const tensMountainCompleted = progress.tensMountain?.completed === true;
  const bigNumberCityUnlocked =
    progress.bigNumberCity?.unlocked === true || tensMountainCompleted;
  const bigNumberCityCompleted = progress.bigNumberCity?.completed === true;
  const reviewParkUnlocked =
    progress.reviewPark?.unlocked === true || bigNumberCityCompleted;
  const reviewParkCompleted = progress.reviewPark?.completed === true;
  const unlockedWorldCount =
    1 +
    (teenTownUnlocked ? 1 : 0) +
    (tensMountainUnlocked ? 1 : 0) +
    (bigNumberCityUnlocked ? 1 : 0) +
    (reviewParkUnlocked ? 1 : 0);
  const unlockedPercent = unlockedWorldCount * 20;
  const mapWorlds = worlds.map((world) => {
    if (world.id === "number-village" && numberVillageCompleted) {
      return {
        ...world,
        status: "completed" as const,
        badge: "Completed",
        helperText: "Great work! Replay anytime.",
        colors: {
          ...world.colors,
          accent: "bg-emerald-100 text-emerald-700",
        },
      };
    }

    if (world.id === "teen-town" && teenTownUnlocked) {
      return {
        ...world,
        status: teenTownCompleted ? ("completed" as const) : ("unlocked" as const),
        badge: teenTownCompleted ? "Completed" : "Unlocked",
        helperText: teenTownCompleted
          ? "Great work! Replay anytime."
          : "Practice numbers 11 to 20",
        colors: {
          ...world.colors,
          card: "border-violet-200 bg-white",
          accent: teenTownCompleted
            ? "bg-emerald-100 text-emerald-700"
            : world.colors.accent,
          button: "bg-violet-500 text-white shadow-violet-200 hover:bg-violet-600",
        },
      };
    }

    if (world.id === "tens-mountain" && tensMountainUnlocked) {
      return {
        ...world,
        status: tensMountainCompleted ? ("completed" as const) : ("unlocked" as const),
        badge: tensMountainCompleted ? "Completed" : "Unlocked",
        helperText: tensMountainCompleted
          ? "Great work! Replay anytime."
          : "Learn counting by tens.",
        colors: {
          ...world.colors,
          card: "border-emerald-200 bg-white",
          accent: tensMountainCompleted
            ? "bg-emerald-100 text-emerald-700"
            : world.colors.accent,
          button: "bg-emerald-500 text-white shadow-emerald-200 hover:bg-emerald-600",
        },
      };
    }

    if (world.id === "big-number-city" && bigNumberCityUnlocked) {
      return {
        ...world,
        status: bigNumberCityCompleted ? ("completed" as const) : ("unlocked" as const),
        badge: bigNumberCityCompleted ? "Completed" : "Unlocked",
        helperText: bigNumberCityCompleted
          ? "Great work! Replay anytime."
          : "Build big numbers with tens and ones.",
        colors: {
          ...world.colors,
          card: "border-pink-200 bg-white",
          accent: bigNumberCityCompleted
            ? "bg-emerald-100 text-emerald-700"
            : world.colors.accent,
          button: "bg-rose-500 text-white shadow-rose-200 hover:bg-rose-600",
        },
      };
    }

    if (world.id === "review-park" && reviewParkUnlocked) {
      return {
        ...world,
        status: reviewParkCompleted ? ("completed" as const) : ("unlocked" as const),
        badge: reviewParkCompleted ? "Completed" : "Unlocked",
        helperText: reviewParkCompleted
          ? "Great work! Replay anytime."
          : "Review all numbers from 1 to 100.",
        colors: {
          ...world.colors,
          card: "border-amber-200 bg-white",
          accent: reviewParkCompleted
            ? "bg-emerald-100 text-emerald-700"
            : world.colors.accent,
          button: "bg-amber-500 text-white shadow-amber-200 hover:bg-amber-600",
        },
      };
    }

    return world;
  });

  useEffect(() => {
    const updatePath = () => {
      const map = mapRef.current;
      const cards = cardRefs.current;
      if (!map || worlds.some((_, index) => !cards[index])) return;

      const mapRect = map.getBoundingClientRect();
      const box = (index: number) => {
        const rect = cards[index]!.getBoundingClientRect();
        return {
          left: rect.left - mapRect.left,
          right: rect.right - mapRect.left,
          top: rect.top - mapRect.top,
          bottom: rect.bottom - mapRect.top,
          centerX: rect.left - mapRect.left + rect.width / 2,
          centerY: rect.top - mapRect.top + rect.height / 2,
          width: rect.width,
        };
      };

      const inset = 18;
      const village = box(0);
      const teenTown = box(1);
      const tensMountain = box(2);
      const bigCity = box(3);
      const reviewPark = box(4);

      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        const x = Math.max(34, village.left + 32);
        const points = [
          { x, y: village.bottom - 18 },
          { x, y: teenTown.top + 18 },
          { x, y: teenTown.bottom - 18 },
          { x, y: tensMountain.top + 18 },
          { x, y: tensMountain.bottom - 18 },
          { x, y: bigCity.top + 18 },
          { x, y: bigCity.bottom - 18 },
          { x, y: reviewPark.top + 18 },
        ];

        setMobilePath(
          `M ${points[0].x} ${points[0].y}
           C ${points[0].x - 18} ${points[0].y + 36}, ${points[1].x + 18} ${points[1].y - 36}, ${points[1].x} ${points[1].y}
           L ${points[2].x} ${points[2].y}
           C ${points[2].x + 18} ${points[2].y + 36}, ${points[3].x - 18} ${points[3].y - 36}, ${points[3].x} ${points[3].y}
           L ${points[4].x} ${points[4].y}
           C ${points[4].x - 18} ${points[4].y + 36}, ${points[5].x + 18} ${points[5].y - 36}, ${points[5].x} ${points[5].y}
           L ${points[6].x} ${points[6].y}
           C ${points[6].x + 18} ${points[6].y + 36}, ${points[7].x - 18} ${points[7].y - 36}, ${points[7].x} ${points[7].y}`,
        );
        setDesktopPath("");
        return;
      }

      const p0 = { x: village.right - inset, y: village.centerY };
      const p1 = { x: teenTown.left + inset, y: teenTown.centerY };
      const p2 = { x: teenTown.left + Math.min(92, teenTown.width * 0.28), y: teenTown.bottom - inset };
      const p3 = { x: tensMountain.right - Math.min(92, tensMountain.width * 0.28), y: tensMountain.top + inset };
      const p4 = { x: tensMountain.right - inset, y: tensMountain.centerY };
      const p5 = { x: bigCity.left + inset, y: bigCity.centerY };
      const p6 = { x: bigCity.left + Math.min(112, bigCity.width * 0.34), y: bigCity.bottom - inset };
      const p7 = { x: reviewPark.right - Math.min(90, reviewPark.width * 0.28), y: reviewPark.top + inset };

      setDesktopPath(
        `M ${p0.x} ${p0.y}
         C ${p0.x + 70} ${p0.y}, ${p1.x - 70} ${p1.y}, ${p1.x} ${p1.y}
         C ${p2.x - 60} ${p2.y + 48}, ${p3.x + 62} ${p3.y - 48}, ${p3.x} ${p3.y}
         C ${p4.x + 70} ${p4.y}, ${p5.x - 70} ${p5.y}, ${p5.x} ${p5.y}
         C ${p6.x - 76} ${p6.y + 52}, ${p7.x + 76} ${p7.y - 52}, ${p7.x} ${p7.y}`,
      );
      setMobilePath("");
    };

    updatePath();
    window.addEventListener("resize", updatePath);
    const observer = new ResizeObserver(updatePath);
    if (mapRef.current) observer.observe(mapRef.current);
    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      window.removeEventListener("resize", updatePath);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#DFF5FF_0%,#F7FBFF_42%,#FFF3D8_100%)] px-4 pb-20 pt-5 text-slate-700 sm:px-7">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute left-[-52px] top-28 h-20 w-44 rounded-full bg-white/70" />
        <span className="absolute right-[-34px] top-40 h-16 w-40 rounded-full bg-white/65" />
        <span className="absolute left-[9%] top-[22%] text-3xl font-black text-amber-300">*</span>
        <span className="absolute right-[12%] top-[30%] text-4xl font-black text-sky-200">*</span>
        <span className="absolute bottom-28 left-[7%] h-10 w-10 rounded-full bg-amber-200/70" />
        <span className="absolute bottom-40 right-[8%] h-12 w-12 rounded-full bg-pink-200/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <KidioPageHeader
          backLabel="Back to Journey"
          backTo="/learning-map"
          title={
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <h1 className="text-3xl font-black text-[#183B5B] sm:text-5xl">
                Welcome to Number Land!
              </h1>
              <p className="mt-2 text-lg font-bold text-slate-500 sm:text-xl">
                Count, listen, and unlock new number worlds.
              </p>
            </motion.div>
          }
          rightContent={
            <div className="w-52 rounded-[1.25rem] bg-white/90 p-3 shadow-md">
              <div className="flex items-center justify-between gap-3 text-sm font-black text-[#183B5B]">
                <span>{unlockedWorldCount} of 5 worlds unlocked</span>
                <span className="text-sky-600">{unlockedPercent}%</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-sky-100">
                <div
                  className="h-full rounded-full bg-[#2BADEE]"
                  style={{ width: `${unlockedPercent}%` }}
                />
              </div>
            </div>
          }
        />

        <main ref={mapRef} className="relative mt-8">
          <svg className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full overflow-visible md:block" aria-hidden="true">
            {desktopPath ? (
              <path
                d={desktopPath}
                fill="none"
                stroke="#F3B93F"
                strokeLinecap="round"
                strokeDasharray="20 18"
                strokeOpacity="0.76"
                strokeWidth="9"
              />
            ) : null}
          </svg>
          <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible md:hidden" aria-hidden="true">
            {mobilePath ? (
              <path
                d={mobilePath}
                fill="none"
                stroke="#F3B93F"
                strokeLinecap="round"
                strokeDasharray="18 16"
                strokeOpacity="0.7"
                strokeWidth="8"
              />
            ) : null}
          </svg>

          <div className="grid justify-items-center gap-6 md:grid-cols-2 md:gap-x-12 md:gap-y-10">
            {mapWorlds.map((world, index) => (
              <WorldCard
                key={world.title}
                world={world}
                index={index}
                cardRef={(element) => {
                  cardRefs.current[index] = element;
                }}
              />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 rounded-[1.5rem] bg-white/75 px-4 py-4 text-center text-lg font-black text-[#183B5B] shadow-sm">
            <Flag className="h-7 w-7 text-emerald-500" />
            <span>Complete each world to unlock the next stop.</span>
            <Star className="h-7 w-7 fill-amber-300 text-amber-300" />
          </div>
        </main>
      </div>
    </div>
  );
}
