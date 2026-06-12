export type TopicStatus = "completed" | "current" | "unlocked" | "locked";
export type PracticeMode = "listen" | "say" | "play";

export type JourneyTopic = {
  id: string;
  title: string;
  image: string;
  order: number;
  mission: string;
  practiceModes: PracticeMode[];
  practiceRoute?: string;
  reviewRoute?: string;
};

export type JourneyLevel = {
  levelNumber: number;
  pathKey: "starter" | "explorer" | "builder" | "story" | "speaking";
  title: string;
  subtitle: string;
  theme: "sky" | "emerald" | "amber" | "violet" | "rose";
  topics: JourneyTopic[];
};

const modes: PracticeMode[] = ["listen", "say", "play"];

export const learningJourneyLevels: JourneyLevel[] = [
  {
    levelNumber: 1,
    pathKey: "starter",
    title: "First Steps",
    subtitle: "Start your English adventure",
    theme: "sky",
    topics: [
      { id: "abc-adventure", title: "ABC Adventure", image: "/assets/ABC adventure.png", order: 1, mission: "Learn letters and their sounds", practiceModes: modes, practiceRoute: "/trace-letter" },
      { id: "number-land", title: "Number Land", image: "/assets/Numbers.png", order: 2, mission: "Learn numbers from 1 to 10", practiceModes: modes },
      { id: "color-world", title: "Color World", image: "/assets/Color.png", order: 3, mission: "Learn red, blue, and green", practiceModes: modes, practiceRoute: "/color-games" },
      { id: "animal-island", title: "Animal Island", image: "/assets/Animals.png", order: 4, mission: "Learn dog, cat, and bird", practiceModes: modes, practiceRoute: "/mini-game" },
      { id: "my-home", title: "My Home", image: "/assets/Home.png", order: 5, mission: "Learn easy objects at home", practiceModes: modes },
    ],
  },
  {
    levelNumber: 2,
    pathKey: "explorer",
    title: "Explorer",
    subtitle: "Explore familiar worlds",
    theme: "emerald",
    topics: [
      { id: "body-parts", title: "Body Parts", image: "/assets/Body parts.png", order: 1, mission: "Learn head, hands, and feet", practiceModes: modes, practiceRoute: "/adventure/body-parts", reviewRoute: "/review/body-parts" },
      { id: "clothes-corner", title: "Clothes Corner", image: "/assets/Clothes.png", order: 2, mission: "Learn shirt, pants, and shoes", practiceModes: modes },
      { id: "house-life", title: "House Life", image: "/assets/House Life.png", order: 3, mission: "Learn sofa, lamp, and table", practiceModes: modes },
      { id: "family-house", title: "Family House", image: "/assets/Family.png", order: 4, mission: "Learn mother, father, and family", practiceModes: modes },
      { id: "classroom-objects", title: "Classroom Objects", image: "/assets/Classroom.png", order: 5, mission: "Learn book, pencil, and bag", practiceModes: modes },
    ],
  },
  {
    levelNumber: 3,
    pathKey: "builder",
    title: "Builder",
    subtitle: "Build useful everyday English",
    theme: "amber",
    topics: [
      { id: "school-town", title: "School Town", image: "/assets/School.png", order: 1, mission: "Learn school places and subjects", practiceModes: modes },
      { id: "sports-arena", title: "Sports Arena", image: "/assets/Sports.png", order: 2, mission: "Learn football, swim, and run", practiceModes: modes },
      { id: "transport-city", title: "Transport City", image: "/assets/Transport City.png", order: 3, mission: "Learn car, bus, and bike", practiceModes: modes },
      { id: "daily-life", title: "Daily Life", image: "/assets/Daily Life.png", order: 4, mission: "Learn morning and evening routines", practiceModes: modes },
      { id: "action-world", title: "Action World", image: "/assets/Action world.png", order: 5, mission: "Learn jump, walk, and play", practiceModes: modes },
    ],
  },
  {
    levelNumber: 4,
    pathKey: "story",
    title: "Story Explorer",
    subtitle: "Listen, read, and discover stories",
    theme: "violet",
    topics: [
      { id: "story-forest", title: "Story Forest", image: "/assets/Story forest.png", order: 1, mission: "Explore your first short story", practiceModes: modes },
      { id: "listening-cave", title: "Listening Cave", image: "/assets/Listening cave.png", order: 2, mission: "Listen for words and story clues", practiceModes: modes },
      { id: "reading-castle", title: "Reading Castle", image: "/assets/Reading castle.png", order: 3, mission: "Read short sentences with confidence", practiceModes: modes },
      { id: "character-world", title: "Character World", image: "/assets/Character world.png", order: 4, mission: "Meet characters and describe them", practiceModes: modes },
      { id: "adventure-tales", title: "Adventure Tales", image: "/assets/Adventure tales.png", order: 5, mission: "Understand a complete mini adventure", practiceModes: modes },
    ],
  },
  {
    levelNumber: 5,
    pathKey: "speaking",
    title: "Speaking Hero",
    subtitle: "Speak with confidence",
    theme: "rose",
    topics: [
      { id: "feelings-forest", title: "Feelings Forest", image: "/assets/Feeling forest.png", order: 1, mission: "Talk about happy, sad, and excited", practiceModes: modes },
      { id: "job-village", title: "Job Village", image: "/assets/Job village.png", order: 2, mission: "Learn teacher, doctor, and firefighter", practiceModes: modes },
      { id: "nature-kingdom", title: "Nature Kingdom", image: "/assets/Nature Kingdom.png", order: 3, mission: "Talk about plants, animals, and weather", practiceModes: modes },
      { id: "space-adventure", title: "Space Adventure", image: "/assets/Space.png", order: 4, mission: "Learn planets, stars, and rockets", practiceModes: modes },
      { id: "conversation-club", title: "Conversation Club", image: "/assets/Conversation.png", order: 5, mission: "Practice friendly everyday conversations", practiceModes: modes },
    ],
  },
];

export function getTopicStatus(
  levelNumber: number,
  topicId: string,
  kidCurrentLevel: number,
  currentTopicId: string,
  completedTopicIds: string[],
): TopicStatus {
  if (completedTopicIds.includes(topicId)) return "completed";
  if (topicId === currentTopicId) return "current";
  if (levelNumber < kidCurrentLevel) return "unlocked";
  if (levelNumber === kidCurrentLevel) return "unlocked";
  return "locked";
}

export function normalizeJourneyLevel(value: string | null) {
  if (value === "starter" || value === "first_steps") return 1;
  if (value === "explorer") return 2;
  if (value === "builder") return 3;
  if (value === "story" || value === "story_explorer") return 4;
  if (value === "speaking" || value === "speaking_hero") return 5;
  return 1;
}

export function getCurrentJourneyState() {
  const kidCurrentLevel = normalizeJourneyLevel(
    localStorage.getItem("currentKidLevel") ||
      localStorage.getItem("kidioPath"),
  );
  const level = learningJourneyLevels[kidCurrentLevel - 1];
  const savedIndex = Number(
    localStorage.getItem(`kidioJourneyIndex:${level.pathKey}`) || "0",
  );
  const currentIndex = Math.min(
    Math.max(Number.isFinite(savedIndex) ? Math.floor(savedIndex) : 0, 0),
    level.topics.length - 1,
  );
  const currentTopic = level.topics[currentIndex];
  const storedCompleted = JSON.parse(
    localStorage.getItem("completedTopicIds") || "[]",
  ) as string[];
  const completedTopicIds = Array.from(
    new Set([
      ...storedCompleted,
      ...level.topics.slice(0, currentIndex).map((topic) => topic.id),
    ]),
  );

  return {
    kidCurrentLevel,
    currentTopicId: currentTopic.id,
    completedTopicIds,
    currentLevel: level,
    currentTopic,
  };
}
