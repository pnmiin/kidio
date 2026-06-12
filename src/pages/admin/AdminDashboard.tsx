import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Activity, BookOpen, BrainCircuit, Clock3, Eye, Gauge, HardDrive,
  Languages, Mic2, Parentheses, Sparkles, Target, Users,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line,
  LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { AdminChartCard } from "@/components/admin/AdminChartCard";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminKpiCard } from "@/components/admin/AdminKpiCard";
import { AdminSidebar, adminSections } from "@/components/admin/AdminSidebar";
import {
  ageDistribution, badges, contentLessons, difficultWords, lessonsPerDay,
  overviewKpis, parentEngagement, parentReports, planDistribution,
  pronunciationTrend, retentionMetrics, revenueTrend, storyTopics, storyTrend,
  studiedTopics, systemTrend, userGrowth, returningUsers,
} from "@/data/adminMockData";
import type { AdminKpi } from "@/types/admin";
import { isAdminSession } from "@/app/utils/adminAuth";

const COLORS = ["#38BDF8", "#A78BFA", "#34D399", "#FBBF24", "#FB7185", "#818CF8"];
const money = new Intl.NumberFormat("vi-VN");

const iconMap: Record<string, typeof Users> = {
  users: Users, child: Users, book: BookOpen, clock: Clock3, words: Languages,
  mic: Mic2, target: Target, sparkles: Sparkles, parent: Parentheses,
};

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function MiniMetric({
  title,
  value,
  helper,
}: {
  title: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {helper && <p className="mt-1 text-xs text-slate-400">{helper}</p>}
    </div>
  );
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    if (!isAdminSession()) {
      navigate("/parent-login", { replace: true });
      return;
    }

    setHasAdminAccess(true);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0.05, 0.2, 0.5] },
    );
    adminSections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [navigate]);

  if (!hasAdminAccess) return null;

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-900">
      <AdminSidebar activeSection={activeSection} />
      <div className="lg:ml-64">
        <AdminHeader />
        <main className="space-y-12 p-4 sm:p-6 lg:p-8">
          <Section id="overview" title="Overview" subtitle="Executive view of KIDIO platform performance.">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {overviewKpis.map((kpi: AdminKpi) => {
                const Icon = iconMap[kpi.icon] ?? Activity;
                return <AdminKpiCard key={kpi.title} kpi={kpi} icon={<Icon className="h-5 w-5" />} />;
              })}
            </div>
          </Section>

          <Section id="users" title="User Analytics" subtitle="Acquisition, activity, retention and learner demographics.">
            <div className="grid gap-4 lg:grid-cols-2">
              <AdminChartCard title="New & Active Users" subtitle="Daily acquisition compared with active users">
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={userGrowth}>
                    <defs>
                      <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Area name="New users" type="monotone" dataKey="value" stroke="#0EA5E9" fill="url(#usersGradient)" />
                    <Line name="Active users" type="monotone" dataKey="secondary" stroke="#8B5CF6" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </AdminChartCard>
              <AdminChartCard title="Returning Users" subtitle="Weekly returning learner sessions">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={returningUsers}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} dot={{ fill: "#10B981" }} />
                  </LineChart>
                </ResponsiveContainer>
              </AdminChartCard>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.3fr]">
              <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
                {retentionMetrics.map((metric) => (
                  <MiniMetric key={metric.label} title={metric.label} value={`${metric.value}%`} helper="Cohort retention" />
                ))}
              </div>
              <AdminChartCard title="Age Distribution">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={ageDistribution} dataKey="value" nameKey="age" innerRadius={48} outerRadius={88} paddingAngle={3}>
                      {ageDistribution.map((entry, index) => <Cell key={entry.age} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </AdminChartCard>
            </div>
          </Section>

          <Section id="learning" title="Learning Analytics" subtitle="Lesson completion, study time and topic performance.">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <MiniMetric title="Average Learning Time" value="18 min/day" helper="Per active child" />
              <MiniMetric title="Total Vocabulary Learned" value="4,820 words" helper="+14% this month" />
              <MiniMetric title="Topic Completion" value="86%" helper="Average across paths" />
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <AdminChartCard title="Lessons Completed Per Day">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={lessonsPerDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </AdminChartCard>
              <AdminChartCard title="Most Studied Topics">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={studiedTopics} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis type="number" axisLine={false} tickLine={false} />
                    <YAxis dataKey="topic" type="category" width={80} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#38BDF8" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </AdminChartCard>
            </div>
            <AdminChartCard title="Topic Completion" className="mt-4">
              <AdminDataTable
                rows={studiedTopics}
                getKey={(row) => row.topic}
                columns={[
                  { header: "Topic", render: (row) => <span className="font-semibold text-slate-800">{row.topic}</span> },
                  { header: "Study Sessions", render: (row) => row.value },
                  { header: "Completion Rate", render: (row) => `${row.completion}%` },
                  { header: "Status", render: (row) => <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Healthy</span> },
                ]}
              />
            </AdminChartCard>
          </Section>

          <Section id="pronunciation" title="Pronunciation Analytics" subtitle="Accuracy, fluency and difficult-word intelligence.">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MiniMetric title="Pronunciation Attempts" value="1,936" helper="+21% this month" />
              <MiniMetric title="Average Accuracy" value="84%" helper="+3.4 points" />
              <MiniMetric title="Average Fluency" value="79%" helper="+2.8 points" />
              <MiniMetric title="Average Overall Score" value="82%" helper="+4.2 points" />
            </div>
            <AdminChartCard title="Pronunciation Score Trend" subtitle="Accuracy and fluency over time" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={pronunciationTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} />
                  <YAxis domain={[50, 100]} axisLine={false} tickLine={false} />
                  <Tooltip /><Legend />
                  <Line name="Accuracy" type="monotone" dataKey="value" stroke="#0EA5E9" strokeWidth={3} />
                  <Line name="Fluency" type="monotone" dataKey="secondary" stroke="#8B5CF6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </AdminChartCard>
            <AdminChartCard title="Difficult Words" subtitle="Words with the lowest average pronunciation scores" className="mt-4">
              <AdminDataTable
                rows={difficultWords}
                getKey={(row) => row.word}
                columns={[
                  { header: "Word", render: (row) => <span className="font-semibold text-slate-800">{row.word}</span> },
                  { header: "Topic", render: (row) => row.topic },
                  { header: "Attempts", render: (row) => row.attempts },
                  { header: "Average Score", render: (row) => `${row.averageScore}%` },
                  { header: "Status", render: (row) => <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{row.status}</span> },
                ]}
              />
            </AdminChartCard>
          </Section>

          <Section id="ai" title="AI Analytics" subtitle="Story generation demand and reading engagement.">
            <div className="grid gap-4 sm:grid-cols-2">
              <MiniMetric title="Stories Generated" value="1,245" helper="+18% this month" />
              <MiniMetric title="Average Story Completion" value="76%" helper="Read-to-end rate" />
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <AdminChartCard title="Popular Story Topics">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={storyTopics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="topic" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#A78BFA" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </AdminChartCard>
              <AdminChartCard title="Story Generation Trend">
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={storyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="#EDE9FE" />
                  </AreaChart>
                </ResponsiveContainer>
              </AdminChartCard>
            </div>
          </Section>

          <Section id="achievements" title="Achievement Analytics" subtitle="Badge adoption and motivation signals.">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
              <AdminChartCard title="Most Earned Badges">
                <AdminDataTable
                  rows={badges}
                  getKey={(row) => row.badge}
                  columns={[
                    { header: "Badge", render: (row) => <span className="font-semibold text-slate-800">{row.badge}</span> },
                    { header: "Earned", render: (row) => row.earned },
                    { header: "Unlock Rate", render: (row) => `${row.unlockRate}%` },
                  ]}
                />
              </AdminChartCard>
              <AdminChartCard title="Achievement Unlock Rate">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={badges} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} />
                    <YAxis dataKey="badge" type="category" width={120} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="unlockRate" fill="#FBBF24" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </AdminChartCard>
            </div>
          </Section>

          <Section id="parents" title="Parent Dashboard Analytics" subtitle="How parents consume progress and learning reports.">
            <div className="grid gap-4 sm:grid-cols-2">
              <MiniMetric title="Parent Dashboard Visits" value="642" helper="+11% this month" />
              <MiniMetric title="Weekly Report Open Rate" value="72%" helper="+5 points this month" />
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <AdminChartCard title="Parent Engagement Trend">
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={parentEngagement}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#10B981" fill="#D1FAE5" />
                  </AreaChart>
                </ResponsiveContainer>
              </AdminChartCard>
              <AdminChartCard title="Most Viewed Reports">
                <AdminDataTable
                  rows={parentReports}
                  getKey={(row) => row.report}
                  columns={[
                    { header: "Report", render: (row) => <span className="font-semibold text-slate-800">{row.report}</span> },
                    { header: "Views", render: (row) => row.views },
                    { header: "Open Rate", render: (row) => `${row.openRate}%` },
                  ]}
                />
              </AdminChartCard>
            </div>
          </Section>

          <Section id="revenue" title="Revenue Analytics" subtitle="Premium growth, conversion and plan mix.">
            <div className="grid gap-4 sm:grid-cols-3">
              <MiniMetric title="Premium Users" value="35" helper="+3 this month" />
              <MiniMetric title="Monthly Revenue" value="3,465,000 VND" helper="+9.6% MoM" />
              <MiniMetric title="Conversion Rate" value="8.5%" helper="+0.7 points" />
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <AdminChartCard title="Revenue Trend">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(value) => `${value / 1000000}m`} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value) => `${money.format(Number(value))} VND`} />
                    <Area type="monotone" dataKey="revenue" stroke="#0EA5E9" fill="#E0F2FE" />
                  </AreaChart>
                </ResponsiveContainer>
              </AdminChartCard>
              <AdminChartCard title="Plan Distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={planDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                      {planDistribution.map((item, index) => <Cell key={item.name} fill={COLORS[index]} />)}
                    </Pie>
                    <Tooltip /><Legend />
                  </PieChart>
                </ResponsiveContainer>
              </AdminChartCard>
            </div>
          </Section>

          <Section id="content" title="Content Analytics" subtitle="Lesson demand and completion quality.">
            <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
              <AdminChartCard title="Top 10 Lessons">
                <AdminDataTable
                  rows={contentLessons}
                  getKey={(row) => row.lesson}
                  columns={[
                    { header: "Lesson", render: (row) => <span className="font-semibold text-slate-800">{row.lesson}</span> },
                    { header: "Topic", render: (row) => row.topic },
                    { header: "Learners", render: (row) => row.learners },
                    { header: "Completion", render: (row) => `${row.completionRate}%` },
                  ]}
                />
              </AdminChartCard>
              <AdminChartCard title="Most Popular Lessons">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={contentLessons.slice(0, 6)} layout="vertical">
                    <XAxis type="number" axisLine={false} tickLine={false} />
                    <YAxis dataKey="topic" type="category" width={75} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="learners" fill="#38BDF8" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </AdminChartCard>
            </div>
            <AdminChartCard title="Low Completion Lessons" subtitle="Content requiring review" className="mt-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {contentLessons.slice(-3).map((lesson) => (
                  <div key={lesson.lesson} className="rounded-xl border border-rose-100 bg-rose-50/50 p-4">
                    <p className="font-semibold text-slate-800">{lesson.lesson}</p>
                    <p className="mt-2 text-2xl font-bold text-rose-600">{lesson.completionRate}%</p>
                  </div>
                ))}
              </div>
            </AdminChartCard>
          </Section>

          <Section id="system" title="System Health" subtitle="Infrastructure traffic, latency, errors and storage.">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <MiniMetric title="API Requests" value="111.1K" helper="Last 7 days" />
              <MiniMetric title="Avg. Response Time" value="178 ms" helper="Within target" />
              <MiniMetric title="Failed Requests" value="1.16%" helper="1,289 requests" />
              <MiniMetric title="Storage Used" value="18.4 GB" helper="61% of capacity" />
              <MiniMetric title="Media Files" value="4,318" helper="2,940 audio · 1,378 stories" />
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <AdminChartCard title="API Request Trend">
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={systemTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="requests" stroke="#0EA5E9" fill="#E0F2FE" />
                  </AreaChart>
                </ResponsiveContainer>
              </AdminChartCard>
              <AdminChartCard title="Error Rate">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={systemTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 3]} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="errorRate" stroke="#FB7185" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </AdminChartCard>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm"><Gauge className="text-emerald-500" /><div><p className="font-bold">API Operational</p><p className="text-xs text-slate-400">99.94% uptime</p></div></div>
              <div className="flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm"><HardDrive className="text-sky-500" /><div><p className="font-bold">Storage Healthy</p><p className="text-xs text-slate-400">12 GB available</p></div></div>
              <div className="flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm"><Eye className="text-violet-500" /><div><p className="font-bold">Monitoring Active</p><p className="text-xs text-slate-400">No critical alerts</p></div></div>
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
}
