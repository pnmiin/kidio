import { apiRequest } from "./apiClient";
import type { PagedResponse } from "./topicApi";

export type LessonSummaryResponse = {
  id: string;
  topicId: string;
  topicName: string;
  title: string;
  description?: string;
  orderIndex: number;
  rewardPoints: number;
  isPublished: boolean;
  contentJson?: string;
  createdAt: string;
};

export type LessonResponse = {
  id: string;
  topicId: string;
  topicName: string;
  title: string;
  description?: string;
  orderIndex: number;
  rewardPoints: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
};

export async function getLessonsByTopic(topicId: string, pageNumber = 1, pageSize = 100) {
  return apiRequest<PagedResponse<LessonSummaryResponse>>(`/api/Lesson/topic/${topicId}?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
    method: "GET",
    auth: false, // Allow anonymous for lessons
  });
}

export async function getLessonById(lessonId: string) {
  return apiRequest<LessonResponse>(`/api/Lesson/${lessonId}`, {
    method: "GET",
    auth: false,
  });
}
