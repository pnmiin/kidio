import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Award,
  BookOpen,
  Calendar,
  Check,
  ChevronRight,
  Clock3,
  Gamepad2,
  KeyRound,
  Languages,
  Link,
  Loader2,
  MessageCircle,
  Plus,
  Settings,
  Repeat2,
  Sparkles,
  TrendingUp,
  User,
  Star,
  Play,
} from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PageBackground } from '../../components/PageBackground';
import { KidioPageHeader } from '../../components/KidioPageHeader';
import { getParentDashboardOverview, ParentDashboardChildItemResponse } from '../services/dashboardApi';
import { getChildProgressSummary, getRecentActivities, getChildAchievements, TopicProgressItem, ProgressResponse } from '../services/progressApi';
import { createChildProfile } from '../services/childApi';
import { logoutParent } from '../services/authApi';


interface Kid {
  kidId?: string;
  name: string;
  age: number;
  avatar: string;
  level?: string;
  topic?: string;
  stats: {
    learningTime: number;
    wordsLearned: number;
    completedLessons: number;
    badges: number;
    streak: number;
  };
}

interface ParentData {
  name?: string;
  email?: string;
  kids?: Kid[];
}

const cardClass =
  'rounded-3xl border border-white/80 bg-white/94 shadow-[0_16px_40px_rgba(45,120,160,0.09)]';

function createDashboardKid(child: ParentDashboardChildItemResponse): Kid {
  const name = child.childName || 'KIDIO Kid';

  return {
    kidId: child.childId,
    name,
    age: child.age,
    avatar: name.charAt(0).toUpperCase(),
    level: 'Starter A1',
    topic: 'Animals & Nature',
    stats: {
      learningTime: Math.round(child.timeSpentSeconds / 60),
      wordsLearned: 143, // Mocked for now until we have vocabulary progress
      completedLessons: child.completedLessons,
      badges: child.totalStars,
      streak: child.currentStreakDays,
    },
  };
}

export function ParentDashboard() {
  const navigate = useNavigate();
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [kids, setKids] = useState<Kid[]>([]);
  const [parentName, setParentName] = useState('');
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [showChildSwitcher, setShowChildSwitcher] = useState(false);
  const [kidNameInput, setKidNameInput] = useState('');
  const [kidAgeInput, setKidAgeInput] = useState('');
  const [kidExperience, setKidExperience] = useState<'No' | 'A little' | 'Yes' | ''>('');
  const [kidActionMessage, setKidActionMessage] = useState('');
  const [kidActionStatus, setKidActionStatus] = useState<'success' | 'error' | null>(null);
  const [isCreatingKid, setIsCreatingKid] = useState(false);

  const [weeklyChartData, setWeeklyChartData] = useState<{ label: string; minutes: number }[]>([]);
  const [topicProgresses, setTopicProgresses] = useState<TopicProgressItem[]>([]);
  const [recentActivities, setRecentActivities] = useState<ProgressResponse[]>([]);
  const [achievements, setAchievements] = useState<{ badge: string; title: string; detail: string }[]>([]);
  const ageOptions = ['5', '6', '7', '8', '9', '10'];
  const experienceOptions = [
    { value: 'No' as const, description: 'I am brand new', color: 'border-sky-200 bg-sky-50' },
    { value: 'A little' as const, description: 'I know some words', color: 'border-violet-200 bg-violet-50' },
    { value: 'Yes' as const, description: 'I can use English', color: 'border-amber-200 bg-amber-50' },
  ];

  useEffect(() => {
    let isMounted = true;
    const parentDataStr = localStorage.getItem('parentData');
    const currentParentStr = localStorage.getItem('currentParent');
    const currentUserStr = localStorage.getItem('currentUser');
    const parentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
    const createDefaultParent = (email = 'demo@kidio.com', name = 'Parent') => ({
      name,
      email,
      kids: [] as Kid[],
    });

    const loadLocalParent = () => {
      try {
        const parent: ParentData = parentDataStr
          ? JSON.parse(parentDataStr)
          : createDefaultParent(currentParentStr || 'parent@kidio.com', parentUser?.displayName || 'Parent');
        const linkedKids = (parent.kids || []).filter((kid) => Boolean(kid.kidId));
        const linkedKidId = localStorage.getItem('linkedKidId')?.toUpperCase();
        const activeKid =
          linkedKids.find((kid) => kid.kidId?.toUpperCase() === linkedKidId) || linkedKids[0] || null;

        parent.email ||= currentParentStr || undefined;
        parent.kids = linkedKids;
        localStorage.setItem('parentData', JSON.stringify(parent));
        setParentName(parent.name || parentUser?.displayName || 'Parent');
        setKids(linkedKids);
        setSelectedKid(activeKid);
        setShowLinkForm(!activeKid);
      } catch (error) {
        console.error('Error loading parent data:', error);
        const fallback = createDefaultParent(currentParentStr || 'parent@kidio.com', parentUser?.displayName || 'Parent');
        localStorage.setItem('parentData', JSON.stringify(fallback));
        setParentName(fallback.name);
        setShowLinkForm(true);
      }
    };

    const loadChildren = async () => {
      if (!localStorage.getItem('accessToken')) {
        loadLocalParent();
        return;
      }

      setParentName(parentUser?.displayName || 'Parent');

      try {
        const response = await getParentDashboardOverview();
        if (!isMounted) return;
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Could not load parent dashboard data.');
        }
        
        const dashboardData = response.data;
        if (dashboardData.parentName) {
           setParentName(dashboardData.parentName);
        }

        const apiKids = (dashboardData.children || []).map(createDashboardKid);
        const linkedKidId = localStorage.getItem('linkedKidId')?.toUpperCase();
        const activeKid =
          apiKids.find((kid) => kid.kidId?.toUpperCase() === linkedKidId) || apiKids[0] || null;

        const parent = createDefaultParent(currentParentStr || 'parent@kidio.com', dashboardData.parentName || parentUser?.displayName || 'Parent');
        parent.kids = apiKids;
        localStorage.setItem('parentData', JSON.stringify(parent));
        
        if (activeKid?.kidId) {
          localStorage.setItem('linkedKidId', activeKid.kidId);
        }

        setKids(apiKids);
        setSelectedKid(activeKid);
        setShowLinkForm(!activeKid);

        // Build weekly chart data from API (last 4 weeks → most recent first)
        if (dashboardData.weeklyProgress?.length) {
          const chart = dashboardData.weeklyProgress.map((w, index) => {
            return {
              label: `Week ${index + 1}`,
              minutes: Math.round(w.timeSpentSeconds / 60),
            };
          });
          setWeeklyChartData(chart);
        } else {
          // Fallback
          setWeeklyChartData(
            ['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((w) => ({ label: w, minutes: 0 })),
          );
        }



      } catch (error) {
        console.error('Error loading API dashboard data:', error);
        loadLocalParent();
      }
    };

    loadChildren();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch child-specific progress and activities whenever selectedKid changes
  useEffect(() => {
    let isMounted = true;
    if (!selectedKid) {
      setTopicProgresses([]);
      setRecentActivities([]);
      return;
    }

    const loadChildData = async () => {
      try {
        const [summaryRes, activitiesRes, achievementsRes] = await Promise.all([
          getChildProgressSummary(selectedKid.kidId),
          getRecentActivities(selectedKid.kidId, 1, 5),
          getChildAchievements(selectedKid.kidId, 1, 10)
        ]);

        if (isMounted) {
          if (summaryRes.success && summaryRes.data) {
            setTopicProgresses(summaryRes.data.topicProgresses || []);
          }
          if (activitiesRes.success && activitiesRes.data) {
            setRecentActivities(activitiesRes.data.items || []);
          }
          if (achievementsRes.success && achievementsRes.data) {
            const items = achievementsRes.data.items || [];
            if (items.length > 0) {
              setAchievements(items.map(a => ({
                badge: a.iconUrl || '🏆',
                title: a.name,
                detail: a.description
              })));
            } else {
              setAchievements([{ badge: '🌱', title: 'Just Getting Started', detail: 'Complete your first lesson!' }]);
            }
          } else {
            setAchievements([{ badge: '🌱', title: 'Just Getting Started', detail: 'Complete your first lesson!' }]);
          }
        }
      } catch (error) {
        console.error('Failed to load child specific progress', error);
      }
    };

    loadChildData();

    return () => {
      isMounted = false;
    };
  }, [selectedKid]);

  const handleCreateChild = async () => {
    const name = kidNameInput.trim();
    const age = Number(kidAgeInput);

    if (!name || !age || isNaN(age) || !kidExperience) {
      setKidActionStatus('error');
      setKidActionMessage('Please fill in all fields: name, age, and English level.');
      return;
    }

    setIsCreatingKid(true);
    setKidActionStatus(null);
    setKidActionMessage('');

    try {
      const response = await createChildProfile(name, age, '');
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create child profile.');
      }

      const kidId = response.data.id;
      // Save kid info to localStorage (same as KidLogin)
      localStorage.setItem('currentKidName', response.data.name || name);
      localStorage.setItem('currentKidAge', String(response.data.age || age));
      localStorage.setItem('currentKidId', kidId);
      localStorage.setItem('currentKid', kidId);
      localStorage.setItem('linkedKidId', kidId);
      const normalizedExperience = kidExperience === 'No' ? 'no' : kidExperience === 'A little' ? 'little' : 'yes';
      localStorage.setItem('currentKidExperience', normalizedExperience);
      ['starter', 'explorer', 'builder', 'story', 'speaking'].forEach((pathKey) => {
        localStorage.removeItem(`kidioJourneyIndex:${pathKey}`);
      });

      if (normalizedExperience === 'no') {
        localStorage.setItem('kidioPath', 'starter');
        localStorage.setItem('kidioLevel', 'starter');
        localStorage.setItem('currentKidLevel', 'starter');
        localStorage.setItem('currentKidPath', 'starter');
        localStorage.setItem('currentKidPathLabel', 'Starter Adventure');
        localStorage.setItem('currentKidCurrentTopic', 'Rainbow Valley');
      } else {
        localStorage.removeItem('kidioPath');
        localStorage.removeItem('kidioLevel');
        localStorage.removeItem('currentKidLevel');
        localStorage.removeItem('currentKidPath');
        localStorage.removeItem('currentKidPathLabel');
        localStorage.removeItem('currentKidCurrentTopic');
      }

      // Re-fetch dashboard data to update the UI
      const dashResponse = await getParentDashboardOverview();
      if (dashResponse.success && dashResponse.data) {
        const apiKids = (dashResponse.data.children || []).map(createDashboardKid);
        setKids(apiKids);
        
        const newKid = apiKids.find((k: Kid) => k.kidId === response.data?.id) || apiKids[apiKids.length - 1];
        if (newKid) {
          setSelectedKid(newKid);
          localStorage.setItem('linkedKidId', newKid.kidId || '');
        }
      }

      setKidActionStatus('success');
      setKidActionMessage(`${name}'s learning profile is now created!`);
      setKidNameInput('');
      setKidAgeInput('');
      setKidExperience('');
      setShowLinkForm(false);
    } catch (error) {
      setKidActionStatus('error');
      setKidActionMessage(error instanceof Error ? error.message : 'An error occurred.');
    } finally {
      setIsCreatingKid(false);
    }
  };

  const goToKidMode = (kid: Kid) => {
    if (kid.kidId) {
      localStorage.setItem('currentKidId', kid.kidId);
      localStorage.setItem('currentKid', kid.kidId);
      localStorage.setItem('linkedKidId', kid.kidId);
    }
    localStorage.setItem('currentKidName', kid.name);
    localStorage.setItem('currentKidAge', String(kid.age));
    navigate('/kid-dashboard');
  };

  const selectKid = (kid: Kid) => {
    setSelectedKid(kid);
    setShowChildSwitcher(false);
    if (kid.kidId) localStorage.setItem('linkedKidId', kid.kidId);
  };

  const openLinkForm = () => {
    setShowLinkForm(true);
    setShowChildSwitcher(false);
    setKidActionStatus(null);
    setKidActionMessage('');
  };

  const scrollToReport = () => {
    document.getElementById('weekly-report')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLogout = async () => {
    await logoutParent(); // This removes accessToken, refreshToken, currentUser, etc.
    navigate('/');
  };

  return (
    <PageBackground variant="parent" className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <KidioPageHeader
          backLabel="Home"
          backTo="/"
          title={
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-500">Parent dashboard</p>
              <h1 className="text-3xl font-bold text-gray-950 sm:text-4xl">Learning at a glance</h1>
            </div>
          }
          rightContent={
            <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/85 p-2 pl-4 shadow-sm">
              <span className="text-sm text-gray-600">Hi, <strong>{parentName}</strong></span>
              <button
                onClick={() => navigate('/parent-profile')}
                aria-label="Parent Profile & Settings"
                className="rounded-full p-2 text-gray-500 transition hover:bg-sky-50 hover:text-sky-500"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          }
        />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${cardClass} mb-6 p-5 sm:p-6`}
        >
          {selectedKid && !showLinkForm ? (
            <>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-[#2BADEE] to-[#1E90D0] text-2xl font-bold text-white shadow-[0_10px_24px_rgba(43,173,238,0.2)]">
                    {selectedKid.avatar}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-bold text-gray-950">{selectedKid.name}</h2>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Active</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">
                        <Calendar className="h-3.5 w-3.5" />
                        {selectedKid.age} years old
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 font-semibold text-sky-700">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Level: {selectedKid.level || 'Starter A1'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 font-semibold text-violet-700">
                        <BookOpen className="h-3.5 w-3.5" />
                        Topic: {selectedKid.topic || 'Animals & Nature'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowChildSwitcher((value) => !value)}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:border-sky-200 hover:text-sky-600"
                  >
                    <Repeat2 className="h-4 w-4" />
                    Switch Child
                  </button>
                  <button
                    onClick={openLinkForm}
                    className="inline-flex items-center gap-2 rounded-full bg-[#2BADEE] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1E90D0]"
                  >
                    <Plus className="h-4 w-4" />
                    Add Child
                  </button>
                </div>
              </div>

              {showChildSwitcher && (
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <p className="mb-3 text-sm font-semibold text-gray-500">Choose a linked child</p>
                  <div className="flex flex-wrap gap-3">
                    {kids.map((kid) => (
                      <button
                        key={kid.kidId}
                        onClick={() => selectKid(kid)}
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                          kid.kidId === selectedKid.kidId
                            ? 'border-sky-200 bg-sky-50'
                            : 'border-gray-100 bg-white hover:border-sky-100'
                        }`}
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 font-bold text-white">
                          {kid.avatar}
                        </span>
                        <span>
                          <span className="block font-bold text-gray-900">{kid.name}</span>
                          <span className="text-xs text-gray-500">{kid.age} years old</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="mx-auto max-w-2xl">
              <div className="text-center mb-2">
                <motion.img
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  src="/assets/kid-login-cow-mascot.png"
                  alt="Kiki mascot"
                  className="mx-auto h-20 w-20 object-contain drop-shadow-[0_12px_18px_rgba(43,128,190,0.2)]"
                  draggable={false}
                />
                <h2 className="mt-2 text-2xl font-black text-[#102d54]">
                  {selectedKid ? 'Add another child' : 'Hi there! Let\'s set up your child\'s profile'}
                </h2>
                <p className="mt-1 text-sm font-semibold text-gray-500">
                  This helps us create the perfect learning adventure.
                </p>
              </div>

              {/* Name input */}
              <div className="mt-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                    <User className="h-4 w-4" />
                  </span>
                  <span className="text-base font-black text-[#102d54]">What's your child's name?</span>
                </div>
                <input
                  type="text"
                  value={kidNameInput}
                  onChange={(e) => { setKidNameInput(e.target.value); setKidActionStatus(null); setKidActionMessage(''); }}
                  className="h-12 w-full rounded-2xl border-2 border-sky-200 bg-white px-4 text-base font-semibold text-[#102d54] outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:shadow-[0_0_0_5px_rgba(47,173,238,0.14)]"
                  placeholder="Enter their name"
                />
              </div>

              {/* Age selection */}
              <div className="mt-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <span className="text-base font-black text-[#102d54]">How old are they?</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {ageOptions.map((age) => {
                    const selected = kidAgeInput === age;
                    return (
                      <motion.button key={age} type="button" whileTap={{ scale: 0.96 }}
                        onClick={() => { setKidAgeInput(age); setKidActionStatus(null); setKidActionMessage(''); }}
                        className={`h-12 rounded-2xl border-2 text-xl font-black transition ${
                          selected
                            ? 'scale-[1.05] border-violet-500 bg-gradient-to-br from-sky-100 to-violet-200 text-violet-900 shadow-[0_12px_24px_rgba(124,58,237,0.22)]'
                            : 'border-sky-100 bg-sky-50/70 text-[#234668] hover:border-sky-300 hover:bg-sky-100'
                        }`}
                      >
                        {age}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Experience selection */}
              <div className="mt-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <Languages className="h-4 w-4" />
                  </span>
                  <span className="text-base font-black text-[#102d54]">Have they learned English before?</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  {experienceOptions.map((option) => {
                    const selected = kidExperience === option.value;
                    return (
                      <motion.button key={option.value} type="button" whileTap={{ scale: 0.98 }}
                        onClick={() => { setKidExperience(option.value); setKidActionStatus(null); setKidActionMessage(''); }}
                        className={`flex min-h-[70px] items-center gap-3 rounded-[18px] border-2 p-3 text-left transition ${
                          selected
                            ? 'scale-[1.02] border-violet-500 bg-gradient-to-br from-sky-100 to-violet-100 shadow-[0_14px_28px_rgba(124,58,237,0.18)]'
                            : `${option.color} hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md`
                        }`}
                      >
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                          selected ? 'border-violet-600 bg-violet-600 text-white' : 'border-gray-300 bg-white text-transparent'
                        }`}>
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                        <span>
                          <span className="block text-base font-black text-[#102d54]">{option.value}</span>
                          <span className="block text-xs font-semibold text-gray-500">{option.description}</span>
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {kidActionMessage && (
                <div className={`mt-4 rounded-2xl border px-4 py-3 text-center text-sm font-bold ${
                  kidActionStatus === 'success' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 'border-rose-100 bg-rose-50 text-rose-600'
                }`}>
                  {kidActionMessage}
                </div>
              )}

              <div className="mt-5 flex gap-3">
                <motion.button
                  whileHover={kidNameInput && kidAgeInput && kidExperience ? { y: -2, scale: 1.01 } : undefined}
                  whileTap={kidNameInput && kidAgeInput && kidExperience ? { scale: 0.98 } : undefined}
                  type="button"
                  onClick={handleCreateChild}
                  disabled={isCreatingKid || !kidNameInput.trim() || !kidAgeInput || !kidExperience}
                  className="h-14 flex-1 rounded-full bg-gradient-to-r from-[#29b8ff] to-[#0877f2] px-5 text-lg font-black text-white shadow-[0_18px_34px_rgba(8,119,242,0.28)] transition enabled:hover:shadow-[0_22px_40px_rgba(8,119,242,0.36)] disabled:cursor-not-allowed disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-500 disabled:shadow-none"
                >
                  {isCreatingKid ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    'Create Profile & Start'
                  )}
                </motion.button>
                {selectedKid && (
                  <button type="button" onClick={() => setShowLinkForm(false)}
                    className="rounded-full px-5 py-3 font-bold text-gray-500 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.section>

        {selectedKid && (
          <div className="space-y-6">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-violet-50 p-6 shadow-[0_16px_40px_rgba(45,120,160,0.08)] sm:p-8"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.12em] text-sky-600">This week</p>
                    <h2 className="mt-1 text-2xl font-bold text-gray-950 sm:text-3xl">
                      {selectedKid.name} is doing great this week
                    </h2>
                    <p className="mt-2 text-gray-600">
                      {selectedKid.stats.learningTime} minutes learned · {selectedKid.stats.streak}-day streak ·{' '}
                      {selectedKid.stats.completedLessons} lessons completed
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => goToKidMode(selectedKid)}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#29b8ff] to-[#0877f2] px-6 py-3 font-bold text-white shadow-[0_12px_24px_rgba(8,119,242,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(8,119,242,0.34)]"
                  >
                    <Gamepad2 className="h-5 w-5" />
                    Go to Kid Mode
                  </button>
                  <button
                    onClick={scrollToReport}
                    className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-5 py-3 font-bold text-sky-700 transition hover:bg-sky-50"
                  >
                    View report
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.section>

            <section className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: Clock3,
                  label: 'Learning Time',
                  value: `${selectedKid.stats.learningTime} min`,
                  helper: 'A consistent week',
                  color: 'bg-sky-50 text-sky-600',
                },
                {
                  icon: BookOpen,
                  label: 'New Words',
                  value: selectedKid.stats.wordsLearned.toString(),
                  helper: 'Vocabulary growing',
                  color: 'bg-emerald-50 text-emerald-600',
                },
                {
                  icon: TrendingUp,
                  label: 'Lessons Completed',
                  value: selectedKid.stats.completedLessons.toString(),
                  helper: 'On track this month',
                  color: 'bg-violet-50 text-violet-600',
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className={`${cardClass} p-5`}
                >
                  <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-2xl ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="text-3xl font-bold text-gray-950">{stat.value}</div>
                  <div className="mt-1 font-bold text-gray-800">{stat.label}</div>
                  <div className="mt-1 text-sm text-gray-500">{stat.helper}</div>
                </motion.div>
              ))}
            </section>

            <motion.section
              id="weekly-report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${cardClass} scroll-mt-6 p-5 sm:p-8`}
            >
              <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-950">Weekly Learning</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {selectedKid.name} learns most on Saturday. Try a 10-minute review on Wednesday.
                  </p>
                </div>
                <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                  Learning consistently
                </span>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyChartData.length ? weeklyChartData : [{ label: '-', minutes: 0 }]} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 6" stroke="#e8eef3" vertical={false} />
                  <XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #BEEBFF',
                      borderRadius: '16px',
                      boxShadow: '0 12px 30px rgba(45,120,160,0.12)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="minutes"
                    stroke="#2BADEE"
                    strokeWidth={4}
                    dot={{ fill: '#fff', stroke: '#2BADEE', strokeWidth: 3, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
                </ResponsiveContainer>
              </motion.section>

              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${cardClass} p-5 sm:p-6`}
                >
                  <div className="mb-5">
                    <h3 className="text-2xl font-bold text-gray-950">Recent Learning</h3>
                    <p className="mt-1 text-sm text-gray-500">The latest lessons your child completed.</p>
                  </div>
                  <div className="space-y-4">
                    {recentActivities.length === 0 ? (
                      <div className="py-6 text-center text-sm text-gray-400">
                        No recent activities found.
                      </div>
                    ) : (
                      recentActivities.map((activity, index) => {
                        const dt = new Date(activity.createdAt || new Date());
                        const timeStr = dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        return (
                          <div
                            key={activity.id || index}
                            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-sky-200 hover:shadow-sm"
                          >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                              {activity.isCompleted ? <BookOpen className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900">{activity.lessonTitle}</h4>
                              <p className="text-sm text-gray-500">{timeStr}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-sky-600">
                                {activity.scorePercent}% Score
                              </div>
                              <div className="text-xs text-amber-500 font-semibold flex items-center justify-end gap-1">
                                {activity.starsEarned} <Star className="w-3 h-3 fill-current" />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${cardClass} p-5 sm:p-6`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-950">Achievements</h3>
                    <p className="mt-1 text-sm text-gray-500">Small wins worth celebrating.</p>
                  </div>
                  <Award className="h-6 w-6 text-amber-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement) => (
                    <div key={achievement.title} className="rounded-2xl border border-amber-100 bg-amber-50/55 p-4">
                      <div className="text-2xl">{achievement.badge}</div>
                      <h4 className="mt-2 text-sm font-bold text-gray-900">{achievement.title}</h4>
                      <p className="mt-1 text-xs leading-5 text-gray-500">{achievement.detail}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            </div>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={`p-6 sm:p-8 ${cardClass}`}>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Topic Progress</h3>
                    <p className="text-sm text-gray-500">Mastery by subject</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
                    <Repeat2 className="h-5 w-5" />
                  </div>
                </div>

                {topicProgresses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <p>No topic progress data available yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {topicProgresses.map((topic, index) => {
                      const colors = [
                        { bg: 'bg-sky-400', text: 'text-sky-700', box: 'bg-sky-50' },
                        { bg: 'bg-amber-400', text: 'text-amber-700', box: 'bg-amber-50' },
                        { bg: 'bg-emerald-400', text: 'text-emerald-700', box: 'bg-emerald-50' },
                        { bg: 'bg-violet-400', text: 'text-violet-700', box: 'bg-violet-50' },
                        { bg: 'bg-pink-400', text: 'text-pink-700', box: 'bg-pink-50' },
                      ];
                      const colorSet = colors[index % colors.length];

                      return (
                        <div key={topic.topicId}>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-semibold text-gray-700">{topic.topicName}</span>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${colorSet.box} ${colorSet.text}`}
                            >
                              {topic.completedLessons}/{topic.totalLessons} Lessons
                            </span>
                          </div>
                          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${topic.progressPercent}%` }}
                              transition={{ duration: 1, ease: 'easeOut', delay: index * 0.1 }}
                              className={`h-full rounded-full ${colorSet.bg}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="mt-7 flex items-start gap-3 rounded-2xl bg-pink-50/70 p-4 text-sm text-gray-700">
                <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-pink-500" />
                <p>
                  <strong>What to do next:</strong> Practice one short speaking activity together this week to build confidence.
                </p>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 rounded-3xl border border-sky-100 bg-white/80 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900">Unlock more parent insights with Fluent Pro</h3>
                <p className="mt-1 text-sm text-gray-500">Get deeper progress guidance when your family is ready.</p>
              </div>
              <button
                onClick={() => navigate('/checkout?plan=pro')}
                className="shrink-0 rounded-full border border-sky-200 bg-sky-50 px-5 py-2.5 text-sm font-bold text-sky-700 transition hover:bg-sky-100"
              >
                View plan
              </button>
            </motion.section>
          </div>
        )}
      </div>
    </PageBackground>
  );
}
