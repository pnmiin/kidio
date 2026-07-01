import { apiRequest } from "./apiClient";

export type PronunciationScoreResponse = {
  id: string;
  vocabularyId: string;
  word: string;
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  overallScore: number;
  isPassed: boolean;
  feedback: string;
  audioStorageUrl: string;
  createdAt: string;
};

export async function submitPronunciation(
  childId: string,
  vocabularyId: string,
  audioBlob: Blob,
  lessonId?: string
) {
  const formData = new FormData();
  formData.append("ChildId", childId);
  formData.append("VocabularyId", vocabularyId);
  
  if (lessonId) {
    formData.append("LessonId", lessonId);
  }
  
  // We need to name the file for the backend to accept it.
  formData.append("AudioFile", audioBlob, "recording.wav");

  return apiRequest<PronunciationScoreResponse>("/api/Pronunciation/submit", {
    method: "POST",
    body: formData,
    auth: true,
  });
}
