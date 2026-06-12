export type JourneyPathKey =
  | "starter"
  | "explorer"
  | "builder"
  | "story"
  | "speaking";

export function getJourneyProgress(pathKey: JourneyPathKey, topicCount: number) {
  const savedProgress = Number(
    localStorage.getItem(`kidioJourneyIndex:${pathKey}`) || "0",
  );

  if (!Number.isFinite(savedProgress)) return 0;
  return Math.min(Math.max(Math.floor(savedProgress), 0), topicCount - 1);
}

export function advanceJourney(pathKey: JourneyPathKey, topicCount: number) {
  const currentProgress = getJourneyProgress(pathKey, topicCount);
  const nextProgress = Math.min(currentProgress + 1, topicCount - 1);

  localStorage.setItem(
    `kidioJourneyIndex:${pathKey}`,
    String(nextProgress),
  );

  return nextProgress;
}
