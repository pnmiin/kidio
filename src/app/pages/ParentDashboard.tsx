import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { TrendingUp, Book, Clock, Award, Plus, UserPlus, LogOut } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { PageBackground } from '../../components/PageBackground';
import { KidioPageHeader } from '../../components/KidioPageHeader';

const weeklyData = [
  { day: 'Mon', minutes: 25, id: 'mon' },
  { day: 'Tue', minutes: 30, id: 'tue' },
  { day: 'Wed', minutes: 20, id: 'wed' },
  { day: 'Thu', minutes: 35, id: 'thu' },
  { day: 'Fri', minutes: 40, id: 'fri' },
  { day: 'Sat', minutes: 45, id: 'sat' },
  { day: 'Sun', minutes: 30, id: 'sun' },
];

// Mock achievements data
const achievements = [
  {
    badge: '🏆',
    title: 'Tuần hoàn hảo',
    desc: 'Hoàn thành tất cả bài học trong tuần',
    date: 'Hôm nay',
  },
  {
    badge: '⭐',
    title: 'Chuyên gia động vật',
    desc: 'Thành thạo tất cả từ vựng về động vật',
    date: 'Hôm qua',
  },
  {
    badge: '🎯',
    title: 'Chuỗi 7 ngày',
    desc: 'Học liên tục 7 ngày không nghỉ',
    date: '2 ngày trước',
  },
  {
    badge: '🌟',
    title: 'Siêu sao phát âm',
    desc: 'Phát âm đúng 50 từ liên tiếp',
    date: '3 ngày trước',
  },
];

// Mock skills data
const skillsData = [
  { skill: 'Từ vựng', progress: 85, color: 'bg-sky-300' },
  { skill: 'Phát âm', progress: 70, color: 'bg-emerald-300' },
  { skill: 'Đọc hiểu', progress: 65, color: 'bg-purple-300' },
  { skill: 'Nghe', progress: 90, color: 'bg-amber-300' },
  { skill: 'Giao tiếp', progress: 75, color: 'bg-pink-300' },
];

// Mock recent activities
const recentActivities = [
  { lesson: 'Animals in the Zoo', time: '15 phút trước', score: 95 },
  { lesson: 'Family Members', time: '2 giờ trước', score: 88 },
  { lesson: 'Colors & Shapes', time: 'Hôm qua', score: 92 },
];

interface Kid {
  name: string;
  age: number;
  avatar: string;
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

export function ParentDashboard() {
  const navigate = useNavigate();
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [kids, setKids] = useState<Kid[]>([]);
  const [showAddKid, setShowAddKid] = useState(false);
  const [newKidName, setNewKidName] = useState('');
  const [newKidAge, setNewKidAge] = useState('');
  const [parentName, setParentName] = useState('');

  useEffect(() => {
    // Load parent data
    const parentDataStr = localStorage.getItem('parentData');
    const currentParentStr = localStorage.getItem('currentParent');
    
    // Create default kid data
    const defaultKid = {
      name: 'Alex',
      age: 7,
      avatar: 'A',
      stats: {
        learningTime: 225,
        wordsLearned: 143,
        completedLessons: 24,
        badges: 12,
        streak: 7,
      },
    };

    const createDefaultParent = (email = 'demo@kidio.com', name = 'Phụ Huynh Demo') => ({
      name,
      email,
      kids: [defaultKid],
    });

    if (!parentDataStr && !currentParentStr) {
      // Create demo parent data for preview
      const demoParent = createDefaultParent();
      localStorage.setItem('parentData', JSON.stringify(demoParent));
      setParentName(demoParent.name);
      setKids(demoParent.kids);
      setSelectedKid(demoParent.kids[0]);
      return;
    }

    try {
      const parent: ParentData = parentDataStr
        ? JSON.parse(parentDataStr)
        : createDefaultParent(currentParentStr || 'parent@kidio.com', 'Phụ Huynh');

      if (!parent.email && currentParentStr) {
        parent.email = currentParentStr;
      }

      setParentName(parent.name || 'Phụ Huynh');

      // Ensure kids array exists and has at least one kid.
      const kidsArray = parent.kids?.length ? parent.kids : [defaultKid];
      parent.kids = kidsArray;
      localStorage.setItem('parentData', JSON.stringify(parent));

      setKids(kidsArray);
      setSelectedKid(kidsArray[0]);
    } catch (error) {
      console.error('Error loading parent data:', error);
      // Set default values on error without trying to parse currentParent,
      // because login stores it as the parent's email string.
      const errorFallback = createDefaultParent(currentParentStr || 'parent@kidio.com', 'Phụ Huynh');
      setParentName(errorFallback.name);
      setKids(errorFallback.kids);
      setSelectedKid(errorFallback.kids[0]);
      localStorage.setItem('parentData', JSON.stringify(errorFallback));
    }
  }, []);

  const handleAddKid = () => {
    if (newKidName.trim() && newKidAge) {
      const newKid: Kid = {
        name: newKidName,
        age: parseInt(newKidAge),
        avatar: newKidName.charAt(0).toUpperCase(),
        stats: {
          learningTime: 0,
          wordsLearned: 0,
          completedLessons: 0,
          badges: 0,
          streak: 0,
        },
      };

      const updatedKids = [...kids, newKid];
      setKids(updatedKids);
      setSelectedKid(newKid);

      // Save to localStorage
      const parentData = JSON.parse(localStorage.getItem('parentData') || '{}');
      parentData.kids = updatedKids;
      localStorage.setItem('parentData', JSON.stringify(parentData));

      setShowAddKid(false);
      setNewKidName('');
      setNewKidAge('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentParent');
    navigate('/');
  };

  // Show loading or default content if no kid selected yet
  if (!selectedKid) {
    return (
      <PageBackground variant="parent" className="px-6 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">Đang tải...</div>
        </div>
      </PageBackground>
    );
  }

  return (
    <PageBackground variant="parent" className="px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        <KidioPageHeader
          backLabel="Home"
          backTo="/"
          title={
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-500">Parent workspace</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-950">Dashboard Phụ Huynh</h1>
            </div>
          }
          rightContent={
            <div className="flex flex-col gap-3 rounded-3xl border border-white/80 bg-white/82 p-3 shadow-[0_12px_30px_rgba(45,120,160,0.09)] sm:flex-row sm:items-center">
              <span className="px-2 text-gray-700">Xin chào, <strong>{parentName}</strong></span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          }
        />

        {/* Kids Selection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/92 rounded-3xl p-5 sm:p-6 shadow-[0_16px_40px_rgba(45,120,160,0.1)] border border-white/80 mb-6"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quản lý các bé</h2>
              <p className="text-sm text-gray-500">Theo dõi nhanh hồ sơ và tiến độ học tập của từng bé.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddKid(!showAddKid)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2BADEE] px-5 py-2.5 text-white font-bold shadow-[0_10px_20px_rgba(43,173,238,0.18)] transition-all hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Thêm bé
            </motion.button>
          </div>

          {/* Add Kid Form */}
          {showAddKid && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-5 p-4 bg-sky-50/80 rounded-2xl border border-sky-100"
            >
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Tên bé"
                  value={newKidName}
                  onChange={(e) => setNewKidName(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-sky-200 bg-white outline-none focus:border-[#2BADEE]"
                />
                <input
                  type="number"
                  placeholder="Tuổi"
                  value={newKidAge}
                  onChange={(e) => setNewKidAge(e.target.value)}
                  min="5"
                  max="10"
                  className="px-4 py-3 rounded-xl border border-sky-200 bg-white outline-none focus:border-[#2BADEE]"
                />
                <button
                  onClick={handleAddKid}
                  className="px-4 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                >
                  Xác nhận
                </button>
              </div>
            </motion.div>
          )}

          {/* Kids List */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {kids.map((kid) => (
              <motion.div
                key={kid.name}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedKid(kid)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                  selectedKid.name === kid.name
                    ? 'bg-sky-50 text-gray-900 border-[#A9E3FF] shadow-[0_12px_28px_rgba(43,173,238,0.16)]'
                    : 'bg-white text-gray-800 border-gray-100 hover:border-sky-100 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${
                      selectedKid.name === kid.name
                        ? 'bg-[#2BADEE] text-white'
                        : 'bg-[#2BADEE] text-white'
                    }`}
                  >
                    {kid.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold truncate">{kid.name}</div>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">Active</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">{kid.age} tuổi</div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-white/80 p-2">
                        <div className="text-gray-500">Tuần này</div>
                        <div className="font-bold text-gray-900">{kid.stats.learningTime} phút</div>
                      </div>
                      <div className="rounded-xl bg-white/80 p-2">
                        <div className="text-gray-500">Bài học</div>
                        <div className="font-bold text-gray-900">{kid.stats.completedLessons}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Child Profile Card */}
        <motion.div
          key={selectedKid.name}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/94 rounded-3xl p-5 sm:p-7 shadow-[0_16px_40px_rgba(45,120,160,0.1)] border border-white/80 mb-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#2BADEE] to-[#1E90D0] rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-[0_14px_28px_rgba(43,173,238,0.22)]">
                {selectedKid.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-500">Progress summary</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-950">Tiến độ của {selectedKid.name}</h2>
                <p className="mt-1 text-gray-600">{selectedKid.age} tuổi • Đang học tại Kidio Learning</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[420px]">
              <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-4">
                <div className="text-sm text-gray-500">Chuỗi học</div>
                <div className="text-2xl font-bold text-[#2BADEE]">{selectedKid.stats.streak} ngày</div>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4">
                <div className="text-sm text-gray-500">Tuần này</div>
                <div className="text-2xl font-bold text-emerald-700">{selectedKid.stats.learningTime} phút</div>
              </div>
              <button className="col-span-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:border-sky-200 hover:text-[#2BADEE] sm:col-span-1">
                Xem báo cáo
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {[
            {
              icon: Clock,
              label: 'Thời gian học',
              value: `${selectedKid.stats.learningTime} phút`,
              subtext: 'Tuần này',
              chip: 'bg-sky-50 text-sky-600',
            },
            {
              icon: Book,
              label: 'Từ vựng đã học',
              value: selectedKid.stats.wordsLearned.toString(),
              subtext: 'Tổng từ vựng',
              chip: 'bg-emerald-50 text-emerald-600',
            },
            {
              icon: TrendingUp,
              label: 'Bài học hoàn thành',
              value: selectedKid.stats.completedLessons.toString(),
              subtext: '8 bài tuần này',
              chip: 'bg-violet-50 text-violet-600',
            },
            {
              icon: Award,
              label: 'Huy hiệu',
              value: selectedKid.stats.badges.toString(),
              subtext: '3 huy hiệu tuần này',
              chip: 'bg-amber-50 text-amber-600',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="min-h-[190px] rounded-3xl border border-white/80 bg-white/92 p-5 shadow-[0_12px_30px_rgba(45,120,160,0.08)]"
            >
              <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${stat.chip}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold mb-2 text-gray-950">{stat.value}</div>
              <div className="text-base font-semibold mb-1 text-gray-900">{stat.label}</div>
              <div className="text-sm text-gray-500">{stat.subtext}</div>
            </motion.div>
          ))}
        </div>

        {/* Weekly Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/94 rounded-3xl p-5 sm:p-7 shadow-[0_16px_40px_rgba(45,120,160,0.1)] border border-white/80 mb-6"
        >
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-950">Thời gian học trong tuần</h3>
              <p className="text-sm text-gray-500">Báo cáo phút học mỗi ngày và xu hướng duy trì thói quen.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2BADEE]" />
              {selectedKid.stats.learningTime} phút tuần này
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={weeklyData} key="weekly-chart">
              <CartesianGrid strokeDasharray="3 3" stroke="#e8eef3" key="grid" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#64748b"
                tickLine={false}
                axisLine={false}
                key="x-axis"
              />
              <YAxis 
                stroke="#64748b" 
                label={{ value: 'Phút', angle: -90, position: 'insideLeft' }} 
                tickLine={false}
                axisLine={false}
                key="y-axis"
              />
              <Tooltip
                key="tooltip"
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #BEEBFF',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(45,120,160,0.12)',
                }}
              />
              <Line
                key="line"
                type="monotone"
                dataKey="minutes"
                stroke="#2BADEE"
                strokeWidth={4}
                dot={{ fill: '#2BADEE', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {/* Recent Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/94 rounded-3xl p-5 sm:p-6 shadow-[0_16px_40px_rgba(45,120,160,0.1)] border border-white/80"
          >
            <h3 className="text-2xl font-bold text-gray-950 mb-5">Thành tích gần đây</h3>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-4 rounded-2xl border border-sky-50 bg-sky-50/50 p-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                    {achievement.badge}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <h4 className="font-bold text-gray-950">{achievement.title}</h4>
                      <div className="text-xs font-semibold text-gray-500">{achievement.date}</div>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-gray-600">{achievement.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/94 rounded-3xl p-5 sm:p-6 shadow-[0_16px_40px_rgba(45,120,160,0.1)] border border-white/80"
          >
            <h3 className="text-2xl font-bold text-gray-950 mb-5">Hoạt động gần đây</h3>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.lesson}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-50 bg-emerald-50/45 p-4"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#2BADEE] shadow-sm">
                      <Book className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate font-bold text-gray-950">{activity.lesson}</h4>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-xl font-bold text-emerald-600">{activity.score}%</div>
                    <div className="text-xs text-gray-500">Điểm số</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Skills Progress */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/94 rounded-3xl p-5 sm:p-7 shadow-[0_16px_40px_rgba(45,120,160,0.1)] border border-white/80"
        >
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-950">Tiến độ kỹ năng</h3>
            <p className="text-sm text-gray-500">Tổng quan các kỹ năng chính trong quá trình học.</p>
          </div>
          <div className="space-y-5">
            {skillsData.map((skill, index) => (
              <div key={skill.skill}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-700">{skill.skill}</span>
                  <span className="w-12 text-right font-bold text-gray-950">{skill.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.progress}%` }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 1 }}
                    className={`h-full ${skill.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upgrade Plan CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-6 rounded-3xl border border-sky-200/70 bg-gradient-to-r from-[#2BADEE] to-[#1E90D0] p-5 sm:p-6 shadow-[0_18px_38px_rgba(43,173,238,0.2)] text-white"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-1">Nâng cấp lên Fluent Pro</h3>
              <p className="text-base text-white/88">Mở khóa tất cả bài học, thư viện câu chuyện và chế độ offline.</p>
            </div>
            <button 
              onClick={() => navigate('/checkout?plan=pro')}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-bold text-[#2BADEE] shadow-lg transition-all hover:scale-[1.02]"
            >
              Nâng cấp ngay - 69,000 VND/tháng
            </button>
          </div>
        </motion.div>
      </div>
    </PageBackground>
  );
}
