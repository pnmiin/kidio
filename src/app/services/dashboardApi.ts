import { apiRequest } from "./apiClient";
import type { AdminKpi, ChartDataPoint, UserTableRow } from "@/types/admin";

export type AdminDashboardOverviewResponse = {
  totalParents: number;
  totalChildren: number;
  totalTopics: number;
  totalLessons: number;
  totalPublishedLessons: number;
  totalUnpublishedLessons: number;
  totalLessonCompletions: number;
  totalVocabularies: number;
  totalAchievementsEarned: number;
  generatedAt: string;
};

export type AdminRecentUserResponse = {
  userId: string;
  displayName: string;
  email: string;
  role: string;
  createdAt: string;
};

export type AdminTopLessonResponse = {
  lessonId: string;
  title: string;
  topicName: string;
  completionCount: number;
  avgScorePercent: number;
};

export type AdminRecentActivityResponse = {
  childId: string;
  childName: string;
  activityType: string;
  description: string;
  metaValue?: string | null;
  timestamp: string;
};

export type AdminDashboardDetailResponse = {
  overview: AdminDashboardOverviewResponse;
  recentUsers: AdminRecentUserResponse[];
  topLessons: AdminTopLessonResponse[];
  recentActivities: AdminRecentActivityResponse[];
};

export type ParentDashboardChildItemResponse = {
  childId: string;
  childName: string;
  age: number;
  avatarUrl?: string | null;
  completedLessons: number;
  totalStars: number;
  currentStreakDays: number;
  timeSpentSeconds: number;
  completionPercent: number;
  lastLessonAt?: string | null;
};

export type WeeklyProgressResponse = {
  weekStart: string;
  weekEnd: string;
  completedLessons: number;
  timeSpentSeconds: number;
  activeChildrenCount: number;
};

export type ChildComparisonResponse = {
  childId: string;
  childName: string;
  completedLessons: number;
  totalStars: number;
  timeSpentSeconds: number;
  rank: number;
};

export type ParentDashboardOverviewResponse = {
  parentId: string;
  parentName: string;
  totalChildren: number;
  totalPublishedLessons: number;
  totalLessonsCompleted: number;
  totalStars: number;
  totalTimeSpentSeconds: number;
  generatedAt: string;
  children: ParentDashboardChildItemResponse[];
  weeklyProgress: WeeklyProgressResponse[];
  comparisons: ChildComparisonResponse[];
};

export async function getAdminDashboardOverview() {
  return apiRequest<AdminDashboardOverviewResponse>("/api/admin/dashboard/overview", {
    method: "GET",
  });
}

export async function getAdminDashboardDetail(params?: { 
  recentUsersCount?: number; 
  topLessonsCount?: number; 
  recentActivitiesCount?: number 
}) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const url = query ? `/api/admin/dashboard/detail?${query}` : "/api/admin/dashboard/detail";
  
  return apiRequest<AdminDashboardDetailResponse>(url, {
    method: "GET",
  });
}

export async function getParentDashboardOverview(weeks: number = 4) {
  return apiRequest<ParentDashboardOverviewResponse>(`/api/ParentDashboard/overview?weeks=${weeks}`, {
    method: "GET",
  });
}
