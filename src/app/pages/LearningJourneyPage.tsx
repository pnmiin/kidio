import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { KidioPageHeader } from "../../components/KidioPageHeader";
import { LevelRow } from "../components/learning-journey/LevelRow";
import { JourneyPracticeCTA } from "../components/learning-journey/JourneyPracticeCTA";
import {
  getCurrentJourneyState,
  getTopicStatus,
  learningJourneyLevels as defaultLevels,
  JourneyLevel,
} from "../data/learningJourneyData";
import { getTopicsPaged } from "../services/topicApi";
import { getLessonsByTopic } from "../services/lessonApi";

import { getChildProgressSummary } from "../services/progressApi";
import { ensureCurrentKidId } from "../utils/kidId";

export function LearningJourneyPage() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState<JourneyLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const state = useMemo(() => getCurrentJourneyState(), []);
  const stars = localStorage.getItem("currentKidStars") || "0";

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        // Sync completed topics from backend
        try {
          const kidId = ensureCurrentKidId();
          const summaryRes = await getChildProgressSummary(kidId);
          if (summaryRes.success && summaryRes.data) {
            const completed = summaryRes.data.topicProgresses
              .filter((t) => t.completedLessons > 0) // Treat topic as completed if any lesson is done
              .map((t) => t.topicId);
            localStorage.setItem("completedTopicIds", JSON.stringify(completed));
          }
        } catch (e) {
          console.error("Failed to sync progress summary", e);
        }

        const response = await getTopicsPaged(1, 50); // Get up to 50 topics
        if (response.success && response.data?.items.length) {
          const apiTopics = response.data.items;
          
          // Group topics into levels (5 topics per level max)
          const newLevels: JourneyLevel[] = [];
          for (let i = 0; i < defaultLevels.length; i++) {
            const levelTemplate = defaultLevels[i];
            const topicsForLevel = apiTopics.slice(i * 5, (i + 1) * 5);
            
            if (topicsForLevel.length > 0) {
              newLevels.push({
                ...levelTemplate,
                topics: topicsForLevel.map((t, index) => ({
                  id: t.id,
                  title: t.name,
                  image: t.thumbnailUrl || levelTemplate.topics[index]?.image || "/assets/ABC adventure.png",
                  order: t.orderIndex,
                  mission: t.description || `Learn ${t.name}`,
                  practiceModes: ["listen", "say", "play"],
                  practiceRoute: `/video-lesson`,
                }))
              });
            }
          }
          setLevels(newLevels.length > 0 ? newLevels : defaultLevels);
        } else {
          setLevels(defaultLevels);
        }
      } catch (error) {
        console.error("Failed to fetch topics:", error);
        setLevels(defaultLevels);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const openTopicLesson = async (levelNumber: number, topicId: string) => {
    const level = levels.find((item) => item.levelNumber === levelNumber) || defaultLevels.find((item) => item.levelNumber === levelNumber);
    const topic = level?.topics.find((item) => item.id === topicId);
    if (!topic) return;

    localStorage.setItem("currentKidCurrentTopic", topic.title);

    try {
      setIsLoading(true);
      const res = await getLessonsByTopic(topicId, 1, 1);
      let route = topic.practiceRoute || "/video-lesson";
      
      if (res.success && res.data?.items.length) {
        const lesson = res.data.items[0];
        localStorage.setItem("currentLessonId", lesson.id);
        localStorage.setItem("currentTopicId", topicId);
        if (lesson.contentJson) {
          try {
            const content = JSON.parse(lesson.contentJson);
            if (content.route) {
              route = content.route;
            }
          } catch (e) {
            console.error("Failed to parse lesson contentJson", e);
          }
        }
      } else {
        localStorage.setItem("currentLessonId", topic.id);
      }
      
      navigate(route, { state: { fromLearningJourney: true } });
    } catch (error) {
      console.error("Failed to fetch lesson", error);
      localStorage.setItem("currentLessonId", topic.id);
      navigate(topic.practiceRoute || "/video-lesson", { state: { fromLearningJourney: true } });
    } finally {
      setIsLoading(false);
    }
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

        {isLoading ? (
          <div className="flex h-[40vh] w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
          </div>
        ) : (
          <div className="space-y-5">
            {levels.map((level) => (
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
        )}
      </div>

      {!isLoading && (
        <JourneyPracticeCTA
          onClick={() =>
            openTopicLesson(state.kidCurrentLevel, state.currentTopicId)
          }
        />
      )}
    </div>
  );
}
