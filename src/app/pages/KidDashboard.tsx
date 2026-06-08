import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle2, Lightbulb, Mic, Play, Gift, Sun, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PageBackground } from '../../components/PageBackground';
import { KidioPageHeader } from '../../components/KidioPageHeader';

export function KidDashboard() {
  const navigate = useNavigate();
  const [kidName, setKidName] = useState('');

  useEffect(() => {
    const currentKid = localStorage.getItem('currentKid');
    if (!currentKid) {
      navigate('/kid-login');
      return;
    }
    setKidName(currentKid);
  }, [navigate]);

  const actionCards = [
    {
      title: 'Continue Lesson',
      subtitle: 'Resume Unit 3',
      image: '/images/card-book.jpg',
      bgColor: 'bg-emerald-100',
      path: '/video-lesson',
      icon: Play,
    },
    {
      title: 'Learning Topic',
      subtitle: 'Animals & Colors',
      image: '/images/card-map.jpg',
      bgColor: 'bg-sky-100',
      path: '/learning-map',
      icon: Play,
    },
    {
      title: 'Speak',
      subtitle: 'Practice Speaking',
      image: '/images/card-speak.jpg',
      bgColor: 'bg-pink-100',
      path: '/video-lesson',
      icon: Mic,
    },
    {
      title: 'Rewards',
      subtitle: 'See Prizes & Badges',
      image: '/images/card-rewards.jpg',
      bgColor: 'bg-amber-100',
      path: '/reward',
      icon: Gift,
    },
  ];

  const todayPlan = [
    { text: 'Complete Lesson', icon: CheckCircle2, completed: true },
    { text: 'Learn a New Topic', icon: Lightbulb, completed: false },
    { text: 'Practice Speaking', icon: Mic, completed: false },
  ];

  const rewards = [
    { points: 30, emoji: '⭐' },
    { points: 50, emoji: '🐶' },
    { points: 50, emoji: '🎁' },
    { points: 100, emoji: '🎁' },
  ];

  const currentPoints = 10;
  const dailyGoal = 30;
  const level = 3;
  const totalPoints = 120;

  return (
    <PageBackground variant="kid" className="kidio-kid-shell">
      <span className="kidio-sparkle top-24 left-[7%] text-4xl">★</span>
      <span className="kidio-sparkle top-36 right-[9%] text-3xl">✦</span>
      <span className="kidio-cloud-puff bottom-16 left-[6%] h-8 w-20" />
      <KidioPageHeader backLabel="Exit" backTo="/" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="kidio-kid-panel p-5 md:p-6 flex flex-col sm:flex-row items-center gap-5"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-full overflow-hidden border-4 border-sky-200 shadow-[0_10px_20px_rgba(43,173,238,0.18)] flex-shrink-0"
          >
            <img
              src="/images/kid-avatar.jpg"
              alt="Kid avatar"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a3a5c]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Hello {kidName}! 🎉
            </h1>
            <p className="text-gray-600 text-lg md:text-xl leading-8">
              Ready for today&apos;s adventure? Let&apos;s learn together!
            </p>
          </div>
        </motion.div>

        {/* Daily Progress & Daily Goal */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Daily Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="kidio-kid-panel p-5 md:p-6 relative overflow-hidden"
          >
            {/* Badge */}
            <div className="kidio-kid-pill bg-amber-50 border-amber-300 px-4 py-1.5 mb-4">
              <Sun className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-amber-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>Daily Progress</span>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#1a3a5c] mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>Today&apos;s Plan</h3>
                <div className="space-y-3">
                  {todayPlan.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {item.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                          {index === 1 ? (
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                          ) : (
                            <span className="text-sm">🎤</span>
                          )}
                        </div>
                      )}
                      <span className={`text-lg font-semibold ${item.completed ? 'text-gray-800' : 'text-gray-600'}`} style={{ fontFamily: 'Fredoka, sans-serif' }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <motion.img
                src="/images/treasure-chest.jpg"
                alt="Treasure chest"
                className="w-28 h-28 object-contain"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Progress bar */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 kidio-progress-track">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '66%' }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="h-full bg-sky-400 rounded-full"
                />
              </div>
              <span className="bg-[#1a3a5c] text-white text-sm px-3 py-1 rounded-full font-bold">2/3 done</span>
            </div>
          </motion.div>

          {/* Daily Goal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="kidio-kid-panel p-5 md:p-6 relative overflow-hidden"
          >
            {/* Badge */}
            <div className="kidio-kid-pill bg-pink-50 border-pink-300 px-4 py-1.5 mb-4">
              <Target className="w-5 h-5 text-pink-500" />
              <span className="font-semibold text-pink-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>Daily Goal</span>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#1a3a5c] mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>Earn {dailyGoal} points to win:</h3>
                <div className="flex gap-3 mb-4">
                  {rewards.map((reward, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-white border-2 border-amber-100 shadow-sm flex items-center justify-center text-2xl">
                        {reward.emoji}
                      </div>
                      <span className="text-sm text-gray-600 mt-1">{reward.points}</span>
                    </div>
                  ))}
                </div>
              </div>
              <motion.img
                src="/images/sheep-mascot.jpg"
                alt="Sheep mascot"
                className="w-28 h-28 object-contain"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Progress bar */}
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 kidio-progress-track relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentPoints / dailyGoal) * 100}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="h-full bg-emerald-400 rounded-full"
                  />
                  {/* Dashed line for remaining */}
                  <div className="absolute right-0 top-0 h-full flex items-center" style={{ width: `${100 - (currentPoints / dailyGoal) * 100}%` }}>
                    <div className="w-full border-t-2 border-dashed border-gray-300" />
                  </div>
                </div>
                <span className="text-xl">⭐</span>
              </div>
              <p className="text-center text-gray-600 mt-3 text-lg" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                You need <span className="font-bold text-gray-800">{dailyGoal - currentPoints}</span> more points!
              </p>
            </div>
          </motion.div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actionCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              onClick={() => navigate(card.path)}
              className={`${card.bgColor} kidio-kid-panel kidio-kid-panel-hover rounded-[26px] p-4 md:p-5 cursor-pointer flex flex-col items-center min-h-[230px]`}
            >
              <motion.img
                src={card.image}
                alt={card.title}
                className="w-24 h-24 object-contain mb-3"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
              />
              <h3 className="text-xl font-bold text-[#1a3a5c] text-center" style={{ fontFamily: 'Fredoka, sans-serif' }}>{card.title}</h3>
              <button className="mt-3 bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-sm border border-white/80">
                <card.icon className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">{card.subtitle}</span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom Encouragement Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="kidio-kid-panel bg-sky-100/90 rounded-[28px] py-4 px-5 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <p className="text-gray-700 text-lg leading-7" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              <span className="font-bold">Keep going, {kidName}!</span> — Complete today&apos;s plan to level up your progress!
            </p>
          </div>
          <div className="kidio-kid-pill bg-amber-300 px-4 py-2 flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <span className="font-bold text-gray-800" style={{ fontFamily: 'Fredoka, sans-serif' }}>Level {level} • {totalPoints} pts</span>
          </div>
        </motion.div>
      </div>
    </PageBackground>
  );
}
