import type { JourneyLevel, TopicStatus } from "../../data/learningJourneyData";
import { LevelBadgePanel } from "./LevelBadgePanel";
import { TopicCard } from "./TopicCard";

export function LevelRow({
  level,
  getStatus,
  onTopicClick,
}: {
  level: JourneyLevel;
  getStatus: (topicId: string) => TopicStatus;
  onTopicClick: (topicId: string) => void;
}) {
  return (
    <section className="grid gap-4 rounded-[30px] border border-white/80 bg-white/55 p-4 shadow-[0_18px_44px_rgba(64,124,168,0.1)] backdrop-blur-sm lg:grid-cols-[190px_1fr]">
      <LevelBadgePanel level={level} />
      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[930px] grid-cols-5 gap-4">
          {level.topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              status={getStatus(topic.id)}
              onClick={() => onTopicClick(topic.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
