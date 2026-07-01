import { submitProgress } from "../services/progressApi";

/**
 * Submit game progress to backend.
 * Reads childId and lessonId from localStorage automatically.
 * Safe to call even if ids are missing (will just skip the API call silently).
 *
 * @param scorePercent  0-100 percent score
 * @param startTime     Date.now() value when the game started (optional, defaults to now)
 * @param overrideLessonId Optional explicit lesson ID to submit instead of the one in localStorage
 */
export async function submitGameProgress(
  scorePercent: number,
  startTime: number = Date.now(),
  overrideLessonId?: string
): Promise<void> {
  const childId = localStorage.getItem("currentKidId");
  const lessonId = overrideLessonId || localStorage.getItem("currentLessonId");

  if (!childId || !lessonId) {
    // Not launched from the learning map – skip silently
    return;
  }

  const timeSpentSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));

  try {
    await submitProgress({ childId, lessonId, scorePercent, timeSpentSeconds });
  } catch (err) {
    console.error("[gameProgress] Failed to submit progress:", err);
  }
}
