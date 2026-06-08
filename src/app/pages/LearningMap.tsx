import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Lock, Check } from 'lucide-react';
import { KidioPageHeader } from '../../components/KidioPageHeader';

export function LearningMap() {
  const navigate = useNavigate();

  const topics = [
    { 
      id: 1, 
      title: 'Alphabet', 
      icon: '🔤',
      iconBg: 'bg-blue-500',
      completed: 26, 
      total: 26, 
      status: 'completed',
    },
    { 
      id: 2, 
      title: 'Colors', 
      icon: '🎨',
      iconBg: 'bg-yellow-400',
      completed: 8, 
      total: 10, 
      status: 'progress',
      percent: 80,
    },
    { 
      id: 3, 
      title: 'Numbers', 
      icon: '🔢',
      iconBg: 'bg-green-400',
      completed: 12, 
      total: 20, 
      status: 'progress',
      percent: 60,
    },
    { 
      id: 4, 
      title: 'Animals', 
      icon: '🐻',
      iconBg: 'bg-yellow-300',
      completed: 10, 
      total: 25, 
      status: 'progress',
      percent: 40,
    },
    { 
      id: 5, 
      title: 'Family', 
      icon: '👨‍👩‍👧',
      iconBg: 'bg-teal-400',
      completed: 3, 
      total: 15, 
      status: 'progress',
      percent: 20,
    },
    { 
      id: 6, 
      title: 'Food', 
      icon: '🍎',
      iconBg: 'bg-rose-300',
      completed: 0, 
      total: 20, 
      status: 'locked',
    },
    { 
      id: 7, 
      title: 'Objects', 
      icon: '📦',
      iconBg: 'bg-emerald-400',
      completed: 0, 
      total: 18, 
      status: 'locked',
    },
    { 
      id: 8, 
      title: 'Weather', 
      icon: '🌤️',
      iconBg: 'bg-sky-300',
      completed: 0, 
      total: 12, 
      status: 'locked',
    },
    { 
      id: 9, 
      title: 'Actions', 
      icon: '🏃',
      iconBg: 'bg-orange-300',
      completed: 0, 
      total: 22, 
      status: 'locked',
    },
    { 
      id: 10, 
      title: 'Jobs', 
      icon: '👷',
      iconBg: 'bg-blue-400',
      completed: 0, 
      total: 16, 
      status: 'locked',
    },
    { 
      id: 11, 
      title: 'Body Parts', 
      icon: '🖐️',
      iconBg: 'bg-amber-300',
      completed: 0, 
      total: 14, 
      status: 'locked',
    },
    { 
      id: 12, 
      title: 'Clothes', 
      icon: '👕',
      iconBg: 'bg-teal-300',
      completed: 0, 
      total: 15, 
      status: 'locked',
    },
  ];

  const handleTopicClick = (topic: typeof topics[0]) => {
    if (topic.status !== 'locked') {
      if (topic.title === 'Alphabet') {
        navigate('/trace-letter');
      } else if (topic.title === 'Animals') {
        navigate('/mini-game');
      } else if (topic.title === 'Colors') {
        navigate('/color-games');
      } else {
        navigate('/video-lesson');
      }
    }
  };

  return (
    <div className="kidio-kid-shell">
      <span className="kidio-sparkle top-24 left-[8%] text-4xl">★</span>
      <span className="kidio-sparkle top-28 right-[10%] text-3xl">✦</span>
      <div className="relative z-10 max-w-6xl mx-auto">
        <KidioPageHeader
          backLabel="Back"
          backTo="/kid-dashboard"
          title={
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-[#1a3a5c]" style={{ fontFamily: 'Fredoka, sans-serif' }}>Learning Topic</h1>
              <p className="text-lg md:text-xl text-gray-600 leading-8 mt-3">
                Pick a topic and keep your English adventure going.
              </p>
            </motion.div>
          }
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Topics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={topic.status !== 'locked' ? { y: -8 } : {}}
              onClick={() => handleTopicClick(topic)}
              className={`relative kidio-kid-panel rounded-[28px] p-5 md:p-6 transition-all duration-300 min-h-[210px] ${
                topic.status !== 'locked' ? 'cursor-pointer kidio-kid-panel-hover' : 'opacity-75'
              }`}
            >
              {/* Status Badge */}
              {topic.status === 'completed' && (
                <div className="absolute top-3 right-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shadow-md">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              {topic.status === 'progress' && topic.percent && (
                <div className="absolute top-3 right-3">
                  <span className="bg-amber-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    {topic.percent}%
                  </span>
                </div>
              )}
              {topic.status === 'locked' && (
                <div className="absolute top-3 right-3">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 md:w-18 md:h-18 ${topic.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_12px_20px_rgba(0,0,0,0.12)]`}>
                <span className="text-3xl">{topic.icon}</span>
              </div>

              {/* Title */}
              <h3 className={`text-center text-xl font-bold mb-3 ${
                topic.status === 'locked' ? 'text-gray-400' : 'text-gray-900'
              }`} style={{ fontFamily: 'Fredoka, sans-serif' }}>
                {topic.title}
              </h3>

              {/* Progress Bar */}
              {topic.status !== 'locked' && (
                <div className="w-full kidio-progress-track mb-3">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${(topic.completed / topic.total) * 100}%` }}
                  />
                </div>
              )}

              {/* Lesson Count */}
              <p className={`text-center text-base font-semibold ${
                topic.status === 'locked' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {topic.status === 'locked' 
                  ? `${topic.total} lessons`
                  : `${topic.completed}/${topic.total} lessons`
                }
              </p>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <button className="kidio-cta-primary px-8 py-4 text-lg">
            View All Topics
          </button>
        </motion.div>
      </div>
    </div>
  );
}
