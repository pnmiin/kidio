export type AdminKpi = {
  title: string;
  value: string;
  helper: string;
  trend: string;
  icon: string;
  accent: "sky" | "violet" | "emerald" | "amber" | "rose";
};

export type ChartDataPoint = {
  label: string;
  value: number;
  secondary?: number;
};

export type RetentionMetric = {
  label: string;
  value: number;
};

export type AgeDistribution = {
  age: string;
  value: number;
};

export type TopicMetric = {
  topic: string;
  value: number;
  completion?: number;
};

export type DifficultWord = {
  word: string;
  topic: string;
  attempts: number;
  averageScore: number;
  status: string;
};

export type BadgeMetric = {
  badge: string;
  earned: number;
  unlockRate: number;
};

export type ParentReportMetric = {
  report: string;
  views: number;
  openRate: number;
};

export type RevenueMetric = {
  month: string;
  revenue: number;
  premiumUsers: number;
};

export type ContentLessonMetric = {
  lesson: string;
  topic: string;
  learners: number;
  completionRate: number;
};

export type SystemHealthMetric = {
  label: string;
  requests: number;
  responseTime: number;
  errorRate: number;
};
