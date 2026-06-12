import type {
  AdminKpi,
  AgeDistribution,
  BadgeMetric,
  ChartDataPoint,
  ContentLessonMetric,
  DifficultWord,
  ParentReportMetric,
  RetentionMetric,
  RevenueMetric,
  SystemHealthMetric,
  TopicMetric,
} from "@/types/admin";

export const overviewKpis: AdminKpi[] = [
  { title: "Total Registered Users", value: "128", helper: "All parent and kid accounts", trend: "+12% this week", icon: "users", accent: "sky" },
  { title: "Active Children", value: "87", helper: "Active learners this month", trend: "+8% this week", icon: "child", accent: "emerald" },
  { title: "Lessons Completed", value: "2,431", helper: "Across all learning paths", trend: "+16% this month", icon: "book", accent: "violet" },
  { title: "Total Learning Hours", value: "356", helper: "Time spent learning", trend: "+9% this month", icon: "clock", accent: "amber" },
  { title: "Vocabulary Learned", value: "4,820", helper: "Unique word completions", trend: "+14% this month", icon: "words", accent: "rose" },
  { title: "Pronunciation Attempts", value: "1,936", helper: "Speech practice submissions", trend: "+21% this month", icon: "mic", accent: "sky" },
  { title: "Avg. Pronunciation Score", value: "82%", helper: "Overall pronunciation quality", trend: "+4.2% this month", icon: "target", accent: "emerald" },
  { title: "Stories Generated", value: "1,245", helper: "Personalized kid stories", trend: "+18% this month", icon: "sparkles", accent: "violet" },
  { title: "Parent Dashboard Visits", value: "642", helper: "Parent engagement sessions", trend: "+11% this month", icon: "parent", accent: "amber" },
];

export const userGrowth: ChartDataPoint[] = [
  { label: "Mon", value: 8, secondary: 46 }, { label: "Tue", value: 12, secondary: 51 },
  { label: "Wed", value: 10, secondary: 49 }, { label: "Thu", value: 16, secondary: 58 },
  { label: "Fri", value: 19, secondary: 64 }, { label: "Sat", value: 24, secondary: 72 },
  { label: "Sun", value: 21, secondary: 69 },
];

export const returningUsers: ChartDataPoint[] = [
  { label: "W1", value: 52 }, { label: "W2", value: 61 }, { label: "W3", value: 67 },
  { label: "W4", value: 74 }, { label: "W5", value: 79 }, { label: "W6", value: 84 },
];

export const retentionMetrics: RetentionMetric[] = [
  { label: "D1 Retention", value: 80 },
  { label: "D7 Retention", value: 55 },
  { label: "D30 Retention", value: 30 },
];

export const ageDistribution: AgeDistribution[] = [
  { age: "5 years", value: 14 }, { age: "6 years", value: 20 },
  { age: "7 years", value: 25 }, { age: "8 years", value: 23 },
  { age: "9 years", value: 18 }, { age: "10 years", value: 12 },
];

export const lessonsPerDay: ChartDataPoint[] = [
  { label: "Mon", value: 48 }, { label: "Tue", value: 55 }, { label: "Wed", value: 62 },
  { label: "Thu", value: 58 }, { label: "Fri", value: 71 }, { label: "Sat", value: 86 },
  { label: "Sun", value: 79 },
];

export const studiedTopics: TopicMetric[] = [
  { topic: "Animals", value: 488, completion: 91 },
  { topic: "Space", value: 420, completion: 84 },
  { topic: "Food", value: 376, completion: 88 },
  { topic: "Family", value: 331, completion: 81 },
  { topic: "Body Parts", value: 298, completion: 86 },
];

export const pronunciationTrend: ChartDataPoint[] = [
  { label: "Jan", value: 74, secondary: 70 }, { label: "Feb", value: 76, secondary: 72 },
  { label: "Mar", value: 79, secondary: 75 }, { label: "Apr", value: 80, secondary: 77 },
  { label: "May", value: 82, secondary: 79 }, { label: "Jun", value: 84, secondary: 81 },
];

export const difficultWords: DifficultWord[] = [
  { word: "Elephant", topic: "Animals", attempts: 184, averageScore: 61, status: "Needs practice" },
  { word: "Vegetable", topic: "Food", attempts: 153, averageScore: 64, status: "Needs practice" },
  { word: "Library", topic: "School", attempts: 129, averageScore: 66, status: "Watch" },
  { word: "Shoulder", topic: "Body Parts", attempts: 118, averageScore: 68, status: "Watch" },
  { word: "Breakfast", topic: "Daily Life", attempts: 102, averageScore: 70, status: "Improving" },
];

export const storyTopics: TopicMetric[] = [
  { topic: "Animals", value: 342 }, { topic: "Dinosaurs", value: 286 },
  { topic: "Space", value: 251 }, { topic: "Cars", value: 198 },
  { topic: "Princess", value: 168 },
];

export const storyTrend: ChartDataPoint[] = [
  { label: "Jan", value: 126 }, { label: "Feb", value: 158 }, { label: "Mar", value: 181 },
  { label: "Apr", value: 213 }, { label: "May", value: 264 }, { label: "Jun", value: 303 },
];

export const badges: BadgeMetric[] = [
  { badge: "First Lesson", earned: 112, unlockRate: 88 },
  { badge: "7-Day Streak", earned: 68, unlockRate: 53 },
  { badge: "10 Lessons Completed", earned: 61, unlockRate: 48 },
  { badge: "Speaking Star", earned: 49, unlockRate: 38 },
  { badge: "Vocabulary Hero", earned: 42, unlockRate: 33 },
];

export const parentEngagement: ChartDataPoint[] = [
  { label: "W1", value: 82 }, { label: "W2", value: 94 }, { label: "W3", value: 101 },
  { label: "W4", value: 116 }, { label: "W5", value: 124 }, { label: "W6", value: 139 },
];

export const parentReports: ParentReportMetric[] = [
  { report: "Weekly Learning Report", views: 312, openRate: 78 },
  { report: "Pronunciation Report", views: 244, openRate: 72 },
  { report: "Vocabulary Report", views: 198, openRate: 68 },
  { report: "Progress Summary", views: 176, openRate: 64 },
];

export const revenueTrend: RevenueMetric[] = [
  { month: "Jan", revenue: 1850000, premiumUsers: 19 },
  { month: "Feb", revenue: 2140000, premiumUsers: 22 },
  { month: "Mar", revenue: 2480000, premiumUsers: 25 },
  { month: "Apr", revenue: 2760000, premiumUsers: 28 },
  { month: "May", revenue: 3180000, premiumUsers: 32 },
  { month: "Jun", revenue: 3465000, premiumUsers: 35 },
];

export const planDistribution = [
  { name: "Free", value: 93 },
  { name: "Premium Monthly", value: 24 },
  { name: "Premium Yearly", value: 11 },
];

export const contentLessons: ContentLessonMetric[] = [
  { lesson: "Letter A Adventure", topic: "Alphabet", learners: 224, completionRate: 95 },
  { lesson: "Animal Island", topic: "Animals", learners: 198, completionRate: 92 },
  { lesson: "Body Parts Adventure", topic: "Body Parts", learners: 183, completionRate: 89 },
  { lesson: "Food Garden", topic: "Food", learners: 171, completionRate: 86 },
  { lesson: "Rainbow Colors", topic: "Colors", learners: 164, completionRate: 84 },
  { lesson: "Family House", topic: "Family", learners: 148, completionRate: 82 },
  { lesson: "Weather World", topic: "Weather", learners: 137, completionRate: 78 },
  { lesson: "Space Adventure", topic: "Space", learners: 125, completionRate: 74 },
  { lesson: "Reading Castle", topic: "Stories", learners: 112, completionRate: 69 },
  { lesson: "Conversation Club", topic: "Speaking", learners: 96, completionRate: 67 },
];

export const systemTrend: SystemHealthMetric[] = [
  { label: "Mon", requests: 12400, responseTime: 184, errorRate: 1.2 },
  { label: "Tue", requests: 13700, responseTime: 176, errorRate: 1.0 },
  { label: "Wed", requests: 14200, responseTime: 181, errorRate: 1.4 },
  { label: "Thu", requests: 15800, responseTime: 169, errorRate: 0.9 },
  { label: "Fri", requests: 17100, responseTime: 172, errorRate: 1.1 },
  { label: "Sat", requests: 19600, responseTime: 188, errorRate: 1.5 },
  { label: "Sun", requests: 18300, responseTime: 179, errorRate: 1.0 },
];
