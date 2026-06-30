import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Check,
  ChevronRight,
  Gift,
  Headphones,
  Lock,
  Map,
  Play,
  Sparkles,
  UserRound,
  Volume2,
} from "lucide-react";
import { PageBackground } from "../../components/PageBackground";
import { KidioPageHeader } from "../../components/KidioPageHeader";
import { getJourneyProgress } from "../utils/journeyProgress";
import { ensureCurrentKidId } from "../utils/kidId";

type PathKey = "starter" | "explorer" | "builder" | "story" | "speaking";
type JourneyStatus = "current" | "next" | "locked" | "completed";

type LearningPathData = {
  pathName: string;
  todayAdventure: string;
  mission: string;
  activities: string[];
  lessonId: string;
  lessonRoute: string;
  mapTheme: {
    current: string;
    next: string;
    connector: string;
    icon: string;
  };
  journey: Array<{ label: string; icon: string; status: JourneyStatus; route?: string }>;
};

const learningPathConfig: Record<PathKey, LearningPathData> = {
  starter: {
    pathName: "Starter Adventure",
    todayAdventure: "Alphabet",
    mission: "Learn letters and sounds",
    activities: ["Listen", "Say", "Play"],
    lessonId: "abc-letter-a",
    lessonRoute: "/trace-letter",
    mapTheme: {
      current:
        "border-pink-400 bg-gradient-to-br from-yellow-100 to-pink-100 text-pink-800",
      next: "border-amber-200 bg-amber-50 text-amber-700",
      connector: "border-pink-200",
      icon: "bg-pink-500 text-white",
    },
    journey: [
      { label: "Alphabet", icon: "ABC", status: "current" },
      { label: "Numbers", icon: "123", status: "next", route: "/number-land" },
      { label: "Colors", icon: "COLOR", status: "locked" },
      { label: "Basic Animals", icon: "PET", status: "locked" },
      { label: "Simple Objects", icon: "TOY", status: "locked" },
    ],
  },
  explorer: {
    pathName: "Explorer Adventure",
    todayAdventure: "Body Parts",
    mission: "Learn head, hands, and feet",
    activities: ["Listen", "Say", "Play"],
    lessonId: "body-parts",
    lessonRoute: "/adventure/body-parts",
    mapTheme: {
      current:
        "border-emerald-400 bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-800",
      next: "border-sky-200 bg-sky-50 text-sky-700",
      connector: "border-emerald-200",
      icon: "bg-emerald-500 text-white",
    },
    journey: [
      { label: "Body Parts", icon: "BODY", status: "current" },
      { label: "Clothes", icon: "SHIRT", status: "next" },
      { label: "House", icon: "HOME", status: "locked" },
      { label: "Shapes", icon: "SHAPE", status: "locked" },
      { label: "Family", icon: "FAMILY", status: "locked" },
      { label: "Classroom Objects", icon: "CLASS", status: "locked" },
    ],
  },
  builder: {
    pathName: "Builder Adventure",
    todayAdventure: "Weather",
    mission: "Learn sunny, rainy, and windy",
    activities: ["Listen", "Say", "Play"],
    lessonId: "food-apple",
    lessonRoute: "/video-lesson",
    mapTheme: {
      current:
        "border-orange-400 bg-gradient-to-br from-orange-100 to-amber-100 text-orange-800",
      next: "border-yellow-200 bg-yellow-50 text-yellow-700",
      connector: "border-orange-200",
      icon: "bg-orange-500 text-white",
    },
    journey: [
      { label: "Weather", icon: "SUN", status: "current" },
      { label: "Hobbies", icon: "HOBBY", status: "next" },
      { label: "Food", icon: "FOOD", status: "locked" },
      { label: "Actions", icon: "RUN", status: "locked" },
      { label: "Simple Adjectives", icon: "WORDS", status: "locked" },
      { label: "Basic Feelings", icon: "HAPPY", status: "locked" },
    ],
  },
  story: {
    pathName: "Story Explorer",
    todayAdventure: "School Subjects",
    mission: "Explore English, math, and art",
    activities: ["Listen", "Read", "Play"],
    lessonId: "story-tom-dog",
    lessonRoute: "/video-lesson",
    mapTheme: {
      current:
        "border-violet-400 bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-800",
      next: "border-indigo-200 bg-indigo-50 text-indigo-700",
      connector: "border-violet-200",
      icon: "bg-violet-600 text-white",
    },
    journey: [
      { label: "School Subjects", icon: "BOOK", status: "current" },
      { label: "School Objects", icon: "BAG", status: "next" },
      { label: "Sports", icon: "SPORT", status: "locked" },
      { label: "Jobs", icon: "JOB", status: "locked" },
      { label: "Transportation", icon: "BUS", status: "locked" },
      { label: "Places", icon: "PLACE", status: "locked" },
    ],
  },
  speaking: {
    pathName: "Speaking Hero",
    todayAdventure: "Nature",
    mission: "Talk about plants, animals, and the sky",
    activities: ["Listen", "Speak", "Play"],
    lessonId: "conversation-greetings",
    lessonRoute: "/video-lesson",
    mapTheme: {
      current:
        "border-rose-400 bg-gradient-to-br from-rose-100 to-pink-100 text-rose-800",
      next: "border-pink-200 bg-pink-50 text-pink-700",
      connector: "border-rose-200",
      icon: "bg-rose-500 text-white",
    },
    journey: [
      { label: "Nature", icon: "NATURE", status: "current" },
      { label: "Emotions", icon: "HAPPY", status: "next" },
      { label: "Science / Space", icon: "SPACE", status: "locked" },
      { label: "Daily Routines", icon: "DAY", status: "locked" },
      { label: "Mini Storytelling", icon: "STORY", status: "locked" },
      { label: "Speaking Practice", icon: "SPEAK", status: "locked" },
    ],
  },
};

function normalizePathKey(value: string | null): PathKey {
  if (value === "starter" || value === "first_steps") return "starter";
  if (value === "builder") return "builder";
  if (value === "story" || value === "story_explorer") return "story";
  if (value === "speaking" || value === "speaking_hero") return "speaking";
  if (value === "explorer") return "explorer";
  return "starter";
}

const activityIcons = [Headphones, Volume2, Play];
const activityColors = [
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
];

export function KidDashboard() {
  const navigate = useNavigate();
  const [kidName, setKidName] = useState("");
  const [kidId, setKidId] = useState("");
  const [stars, setStars] = useState("0");
  const [dashboardData, setDashboardData] = useState<LearningPathData>(
    learningPathConfig.starter,
  );

  useEffect(() => {
    const storedName = localStorage.getItem("currentKidName");
    if (!storedName) {
      navigate("/kid-login", { replace: true });
      return;
    }

    const storedExperience = localStorage.getItem("currentKidExperience");
    const storedLevel = localStorage.getItem("currentKidLevel");
    const pathKey =
      storedExperience === "no" || storedLevel === "starter"
        ? "starter"
        : normalizePathKey(
            localStorage.getItem("kidioPath") ||
              storedLevel ||
              localStorage.getItem("currentKidPath"),
          );
    const data = learningPathConfig[pathKey];
    const journeyIndex = getJourneyProgress(pathKey, data.journey.length);
    const journey = data.journey.map((world, index) => ({
      ...world,
      status:
        index < journeyIndex
          ? ("completed" as const)
          : index === journeyIndex
            ? ("current" as const)
            : index === journeyIndex + 1
              ? ("next" as const)
              : ("locked" as const),
    }));
    const currentWorld = journey[journeyIndex];
    const dashboardData = {
      ...data,
      todayAdventure: currentWorld.label,
      mission:
        journeyIndex === 0 ? data.mission : `Explore ${currentWorld.label}`,
      lessonId:
        journeyIndex === 0
          ? data.lessonId
          : currentWorld.label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      lessonRoute:
        journeyIndex === 0
          ? data.lessonRoute
          : currentWorld.route || "/video-lesson",
      journey,
    };

    localStorage.setItem("kidioPath", pathKey);
    localStorage.setItem("kidioLevel", pathKey);
    localStorage.setItem("currentKidLevel", pathKey);
    localStorage.setItem("currentKidCurrentTopic", currentWorld.label);

    console.log("Assigned KIDIO path:", pathKey);
    console.log("Dashboard data:", dashboardData);

    setKidName(storedName);
    setKidId(ensureCurrentKidId());
    setStars(localStorage.getItem("currentKidStars") || "0");
    setDashboardData(dashboardData);
  }, [navigate]);

  const startAdventure = () => {
    localStorage.setItem("currentLessonId", dashboardData.lessonId);
    navigate(dashboardData.lessonRoute);
  };

  return (
    <PageBackground variant="kid" className="kidio-kid-shell overflow-x-hidden">
      <span className="kidio-sparkle left-[7%] top-24 text-4xl">★</span>
      <span className="kidio-sparkle right-[9%] top-36 text-3xl">✦</span>
      <span className="kidio-cloud-puff bottom-16 left-[6%] h-8 w-20" />
      <KidioPageHeader backLabel="Exit" backTo="/" />

      <main className="relative z-10 mx-auto w-full max-w-[900px] px-1 pb-8 sm:px-3">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[30px] border border-white/90 bg-white/95 p-5 shadow-[0_28px_70px_rgba(43,128,190,0.18)] sm:rounded-[38px] sm:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1
                className="text-3xl font-black text-[#1a3a5c] sm:text-4xl"
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                Hi, {kidName}!
              </h1>
              <span className="mt-2 inline-flex rounded-full bg-violet-100 px-4 py-2 text-sm font-black text-violet-700 sm:text-base">
                {dashboardData.pathName}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-2 text-sm font-black text-amber-700 shadow-sm sm:px-4 sm:text-base">
                <Sparkles className="h-5 w-5" />
                {stars} Stars
              </span>
              <button
                type="button"
                className="group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-3 border-white bg-gradient-to-br from-slate-100 to-sky-100 text-slate-400 shadow-[0_8px_20px_rgba(43,128,190,0.2)] outline-none sm:h-12 sm:w-12"
                aria-label={`${kidName}'s avatar`}
              >
                <UserRound className="h-7 w-7 fill-current sm:h-8 sm:w-8" />
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#58CF8B]" />
                <span className="pointer-events-none absolute right-0 top-[calc(100%+10px)] z-50 hidden w-max max-w-[220px] rounded-xl border border-sky-100 bg-white px-4 py-3 text-left text-sm shadow-xl group-hover:block group-focus:block">
                  <span className="block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Kid ID
                  </span>
                  <span className="mt-1 block font-black tracking-wider text-[#167EAF]">
                    {kidId}
                  </span>
                  <span className="mt-1 block whitespace-normal text-xs font-semibold text-slate-500">
                    Give this ID to your parent.
                  </span>
                </span>
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_270px]">
            <div className="text-center lg:text-left">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600 sm:text-sm">
                Today&apos;s Adventure
              </p>
              <div className="mt-1">
                <h2
                  className={`relative inline-block text-4xl font-black drop-shadow-sm sm:text-5xl ${
                    dashboardData.mapTheme.icon.includes("pink") ||
                    dashboardData.mapTheme.icon.includes("rose")
                      ? "text-pink-600"
                      : dashboardData.mapTheme.icon.includes("emerald")
                        ? "text-emerald-600"
                        : dashboardData.mapTheme.icon.includes("orange")
                          ? "text-orange-600"
                          : "text-violet-600"
                  }`}
                  style={{ fontFamily: "Fredoka, sans-serif" }}
                >
                  {dashboardData.todayAdventure}
                  <span
                    className={`absolute -bottom-1 left-0 -z-10 h-3 w-full rounded-full opacity-60 ${
                      dashboardData.mapTheme.icon.includes("pink") ||
                      dashboardData.mapTheme.icon.includes("rose")
                        ? "bg-pink-200"
                        : dashboardData.mapTheme.icon.includes("emerald")
                          ? "bg-emerald-200"
                          : dashboardData.mapTheme.icon.includes("orange")
                            ? "bg-orange-200"
                            : "bg-violet-200"
                    }`}
                    aria-hidden="true"
                  />
                </h2>
              </div>

              <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-[#38536d]">
                Today&apos;s Mission
              </p>
              <div className="mt-3 rounded-[20px] border-2 border-sky-100 bg-sky-50 px-5 py-4 text-lg font-black text-[#234668]">
                {dashboardData.mission}
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 sm:gap-4 lg:justify-start">
                {dashboardData.activities.map((activity, index) => {
                  const Icon = activityIcons[index];

                  return (
                    <div
                      key={activity}
                      className="flex items-center gap-2 sm:gap-4"
                    >
                      <div
                        className={`flex min-w-[70px] flex-col items-center gap-1 rounded-2xl px-3 py-3 font-black ${activityColors[index]}`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-sm">{activity}</span>
                      </div>
                      {index < dashboardData.activities.length - 1 && (
                        <span className="font-black text-sky-300">→</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={startAdventure}
                className="mt-7 inline-flex h-16 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#29b8ff] to-[#0877f2] px-7 text-xl font-black text-white shadow-[0_18px_34px_rgba(8,119,242,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(8,119,242,0.34)] sm:w-auto sm:min-w-[280px]"
              >
                <Play className="h-6 w-6 fill-current" />
                Start Adventure
              </button>
            </div>

            <div className="relative flex min-h-[240px] items-start justify-center rounded-[28px] bg-gradient-to-br from-sky-50 via-white to-violet-50 p-5">
              <div className="rounded-[22px] border border-white bg-white/90 px-5 py-4 text-center text-lg font-black text-[#234668] shadow-[0_12px_26px_rgba(43,128,190,0.12)]">
                Let&apos;s learn together!
              </div>
              <motion.img
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                src="/assets/mascot.png"
                alt="KIDIO cow mascot"
                className="absolute -bottom-6 left-1/2 h-44 w-44 -translate-x-1/2 object-contain drop-shadow-[0_16px_24px_rgba(43,128,190,0.24)] sm:h-82 sm:w-82"
                draggable={false}
              />
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate("/reward")}
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full border-2 border-amber-200 bg-amber-50 px-5 text-sm font-black text-amber-700 transition hover:-translate-y-0.5 hover:bg-amber-100 sm:h-14 sm:text-base"
            >
              <Gift className="h-5 w-5" />
              My Rewards
            </button>
            <button
              type="button"
              onClick={() => navigate("/learning-journey")}
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full border-2 border-violet-200 bg-violet-50 px-5 text-sm font-black text-violet-700 transition hover:-translate-y-0.5 hover:bg-violet-100 sm:h-14 sm:text-base"
            >
              <Play className="h-5 w-5" />
              Learning Journey
            </button>
          </div>
        </motion.section>

        <section className="mt-5 rounded-[26px] border border-white/90 bg-white/88 p-4 shadow-[0_16px_36px_rgba(43,128,190,0.12)] sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <Map className="h-5 w-5 text-sky-600" />
            <h3 className="font-black text-[#1a3a5c]">Your Adventure Map</h3>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-[760px] items-center">
              {dashboardData.journey.map((world, index) => {
                const isCurrent = world.status === "current";
                const isCompleted = world.status === "completed";
                const isNext = world.status === "next";

                return (
                  <div key={world.label} className="flex flex-1 items-center">
                    <button
                      type="button"
                      disabled={!world.route || world.status === "locked"}
                      onClick={() => {
                        if (!world.route || world.status === "locked") return;
                        localStorage.setItem(
                          "currentLessonId",
                          world.label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                        );
                        navigate(world.route);
                      }}
                      className={`relative z-10 flex min-h-[108px] min-w-0 flex-1 flex-col items-center justify-center gap-2 rounded-2xl border-2 px-3 py-3 text-center ${
                        isCurrent
                          ? `${dashboardData.mapTheme.current} shadow-[0_10px_22px_rgba(124,58,237,0.16)]`
                          : isCompleted
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : isNext
                              ? dashboardData.mapTheme.next
                              : "border-slate-100 bg-slate-50 text-slate-400"
                      } ${world.route && world.status !== "locked" ? "cursor-pointer transition hover:-translate-y-0.5" : "cursor-default"}`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          isCurrent
                            ? dashboardData.mapTheme.icon
                            : isCompleted
                              ? "bg-emerald-500 text-white"
                              : isNext
                                ? "bg-sky-400 text-white"
                                : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {isCurrent ? (
                          <span className="text-[9px] font-black">
                            {world.icon}
                          </span>
                        ) : isCompleted ? (
                          <Check className="h-5 w-5" strokeWidth={3} />
                        ) : isNext ? (
                          <ChevronRight className="h-5 w-5" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </span>
                      <span className="text-xs font-black sm:text-sm">
                        {world.label}
                      </span>
                      {isCurrent && (
                        <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-black uppercase">
                          Current
                        </span>
                      )}
                    </button>
                    {index < dashboardData.journey.length - 1 && (
                      <span
                        className={`h-0 w-5 shrink-0 border-t-2 border-dashed sm:w-7 ${dashboardData.mapTheme.connector}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </PageBackground>
  );
}
