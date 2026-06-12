import { useMemo } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { KidioPageHeader } from "../../components/KidioPageHeader";
import { LevelRow } from "../components/learning-journey/LevelRow";
import { JourneyPracticeCTA } from "../components/learning-journey/JourneyPracticeCTA";
import {
  getCurrentJourneyState,
  getTopicStatus,
  learningJourneyLevels,
} from "../data/learningJourneyData";

export function LearningJourneyPage() {
  const navigate = useNavigate();
  const state = useMemo(() => getCurrentJourneyState(), []);
  const stars = localStorage.getItem("currentKidStars") || "0";

  const openTopicLesson = (levelNumber: number, topicId: string) => {
    const level = learningJourneyLevels.find(
      (item) => item.levelNumber === levelNumber,
    );
    const topic = level?.topics.find((item) => item.id === topicId);
    if (!topic) return;

    localStorage.setItem("currentLessonId", topic.id);
    localStorage.setItem("currentKidCurrentTopic", topic.title);
    navigate(topic.practiceRoute || "/video-lesson");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#DFF5FF_0%,#F4F8FF_46%,#FFF6E8_100%)] px-4 pb-32 pt-5 sm:px-7">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute left-[-60px] top-40 h-24 w-48 rounded-full bg-white/65" />
        <span className="absolute right-[-40px] top-24 h-20 w-44 rounded-full bg-white/60" />
        <span className="absolute left-[8%] top-[30%] text-3xl text-yellow-300">✦</span>
        <span className="absolute right-[10%] top-[52%] text-4xl text-violet-200">✦</span>
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px]">
        <KidioPageHeader
          backLabel="Exit"
          backTo="/kid-dashboard"
          title={
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-black text-[#183B5B] sm:text-4xl">
                My Learning Journey
              </h1>
              <p className="mt-1 font-semibold text-slate-500">
                Explore all the worlds and topics in your adventure!
              </p>
            </motion.div>
          }
          rightContent={
            <span className="rounded-full bg-amber-100 px-4 py-2 font-black text-amber-700 shadow-sm">
              ★ {stars} Stars
            </span>
          }
        />

        <div className="space-y-5">
          {learningJourneyLevels.map((level) => (
            <LevelRow
              key={level.levelNumber}
              level={level}
              getStatus={(topicId) =>
                getTopicStatus(
                  level.levelNumber,
                  topicId,
                  state.kidCurrentLevel,
                  state.currentTopicId,
                  state.completedTopicIds,
                )
              }
              onTopicClick={(topicId) => {
                const status = getTopicStatus(
                  level.levelNumber,
                  topicId,
                  state.kidCurrentLevel,
                  state.currentTopicId,
                  state.completedTopicIds,
                );
                if (status !== "locked") {
                  openTopicLesson(level.levelNumber, topicId);
                }
              }}
            />
          ))}
        </div>
      </div>

      <JourneyPracticeCTA
        onClick={() =>
          openTopicLesson(state.kidCurrentLevel, state.currentTopicId)
        }
      />
    </div>
  );
}
