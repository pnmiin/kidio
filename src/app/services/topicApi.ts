import { apiRequest } from "./apiClient";

export type TopicSummaryResponse = {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  orderIndex: number;
  lessonCount: number;
  isPublished: boolean;
  createdAt: string;
};

export type TopicResponse = {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  orderIndex: number;
  isPublished: boolean;
  createdAt: string;
};

export type PagedResponse<T> = {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export async function getTopicsPaged(pageNumber = 1, pageSize = 100) {
  return apiRequest<PagedResponse<TopicSummaryResponse>>(`/api/Topic?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
    method: "GET",
    auth: false,
  });
}

export async function getTopicById(topicId: string) {
  return apiRequest<TopicResponse>(`/api/Topic/${topicId}`, {
    method: "GET",
    auth: false,
  });
}
