import { apiRequest } from "./apiClient";

export type SubmitProgressRequest = {
  childId: string;
  lessonId: string;
  scorePercent: number; // 0-100
  timeSpentSeconds: number;
};

export type AchievementResponse = {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  badgeType: string;
};

export type ProgressResponse = {
  id: string;
  childId: string;
  childName: string;
  lessonId: string;
  lessonTitle: string;
  isCompleted: boolean;
  starsEarned: number;
  scorePercent: number;
  timeSpentSeconds: number;
  attemptCount: number;
  completedAt?: string;
  createdAt: string;
  newAchievements: AchievementResponse[];
};

export type TopicProgressItem = {
  topicId: string;
  topicName: string;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
};

export type ChildProgressSummary = {
  childId: string;
  childName: string;
  totalLessonsCompleted: number;
  totalStars: number;
  currentStreakDays: number;
  lastLessonAt?: string;
  topicProgresses: TopicProgressItem[];
};

export async function submitProgress(request: SubmitProgressRequest) {
  return apiRequest<ProgressResponse>("/api/Progress/submit", {
    method: "POST",
    body: request,
  });
}

export async function getChildProgressSummary(childId: string) {
  return apiRequest<ChildProgressSummary>(`/api/Progress/child/${childId}/summary`, {
    method: "GET",
  });
}
