import { apiRequest } from "./apiClient";

export type ChildResponse = {
  id: string;
  name?: string | null;
  age: number;
  avatarUrl?: string | null;
  totalStars: number;
  currentStreakDays: number;
  lastLessonAt?: string | null;
  createdAt?: string;
  isRecommendedAge?: boolean;
};

export type ChildSummaryResponse = {
  id: string;
  name?: string | null;
  age: number;
  avatarUrl?: string | null;
  totalStars: number;
  currentStreakDays: number;
};

export type PagedResponse<T> = {
  items?: T[] | null;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export function createChildProfile(name: string, age: number, avatarUrl = "") {
  return apiRequest<ChildResponse>("/api/Child", {
    method: "POST",
    body: {
      name,
      age,
      avatarUrl,
    },
  });
}

export function getChildren(pageNumber = 1, pageSize = 20) {
  return apiRequest<PagedResponse<ChildSummaryResponse>>(
    `/api/Child?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  );
}

export function updateChildProfile(id: string, name: string, age: number, avatarUrl = "") {
  return apiRequest<ChildResponse>(`/api/Child/${id}`, {
    method: "PUT",
    body: {
      name,
      age,
      avatarUrl,
    },
  });
}

export function deleteChildProfile(id: string) {
  return apiRequest<any>(`/api/Child/${id}`, {
    method: "DELETE",
  });
}
