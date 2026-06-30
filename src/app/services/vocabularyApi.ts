import { apiRequest } from "./apiClient";
import type { PagedResponse } from "./topicApi";

export type VocabularyResponse = {
  id: string;
  lessonId: string;
  lessonTitle: string;
  word: string;
  meaning: string;
  pronunciation?: string;
  imageUrl?: string;
  audioUrl?: string;
  exampleSentence?: string;
  difficultyLevel: number;
  orderIndex: number;
  createdAt: string;
};

export async function getVocabularyByLesson(lessonId: string, pageNumber = 1, pageSize = 100) {
  return apiRequest<PagedResponse<VocabularyResponse>>(`/api/Vocabulary/lesson/${lessonId}?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
    method: "GET",
    auth: false,
  });
}

export async function getVocabularyById(vocabId: string) {
  return apiRequest<VocabularyResponse>(`/api/Vocabulary/${vocabId}`, {
    method: "GET",
    auth: false,
  });
}
