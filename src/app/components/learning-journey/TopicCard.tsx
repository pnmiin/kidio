import { motion } from "motion/react";
import type { JourneyTopic, TopicStatus } from "../../data/learningJourneyData";
import { StatusBadge } from "./StatusBadge";

export function TopicCard({
  topic,
  status,
  onClick,
}: {
  topic: JourneyTopic;
  status: TopicStatus;
  onClick: () => void;
}) {
  const locked = status === "locked";
  return (
    <motion.button
      type="button"
      whileHover={locked ? undefined : { y: -5 }}
      onClick={onClick}
      disabled={locked}
      className={`relative h-[190px] min-w-[180px] overflow-hidden rounded-2xl bg-white text-left shadow-[0_14px_34px_rgba(64,124,168,0.13)] transition sm:h-[205px] ${
        status === "current"
          ? "ring-4 ring-violet-400 shadow-[0_18px_38px_rgba(139,92,246,0.24)]"
          : ""
      } ${locked ? "cursor-not-allowed opacity-55 grayscale-[0.35]" : "cursor-pointer"}`}
    >
      <div className="h-[125px] w-full overflow-hidden sm:h-[138px]">
        <img
          src={topic.image}
          alt={topic.title}
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>
      <div className="px-4 py-3">
        <h3 className="line-clamp-2 text-base font-black text-[#183B5B]">
          {topic.title}
        </h3>
      </div>
      <StatusBadge status={status} />
    </motion.button>
  );
}
