import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Star, Award, ArrowRight, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { KidioPageHeader } from '../../components/KidioPageHeader';

export function RewardPage() {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen app-sky-background px-6 py-12 relative overflow-hidden">
      <KidioPageHeader backLabel="Back" backTo="/kid-dashboard" />

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: -20,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 20,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                ease: 'linear',
                repeat: Infinity,
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][
                  Math.floor(Math.random() * 5)
                ],
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Celebration Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h1
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 mb-4"
          >
            🎉 Amazing Work! 🎉
          </motion.h1>
          <p className="text-3xl text-gray-700">You completed the lesson!</p>
        </motion.div>

        {/* Reindeer Mascot */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <motion.img
            src="https://images.unsplash.com/photo-1757251211602-679057dcf0bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGF1biUyMHNoZWVwJTIwY2FydG9vbiUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NzI3NzA1NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Shaun the Sheep celebrating"
            className="w-64 h-64 rounded-full object-cover shadow-2xl"
            animate={{
              rotate: [-5, 5, -5],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Rewards Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-12 shadow-2xl mb-8"
        >
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Your Rewards
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Stars Earned */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: 'spring' }}
              className="bg-gradient-to-br from-amber-200 to-amber-300 rounded-2xl p-8 text-center"
            >
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3].map((star, index) => (
                  <motion.div
                    key={star}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.9 + index * 0.2, type: 'spring' }}
                  >
                    <Star className="w-16 h-16 fill-amber-500 text-amber-500" />
                  </motion.div>
                ))}
              </div>
              <h3 className="text-3xl font-bold text-gray-900">3 Stars!</h3>
              <p className="text-gray-700">Perfect score!</p>
            </motion.div>

            {/* Badge Earned */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="bg-gradient-to-br from-purple-200 to-purple-300 rounded-2xl p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1, type: 'spring' }}
                className="flex justify-center mb-4"
              >
                <Award className="w-16 h-16 text-purple-700" />
              </motion.div>
              <h3 className="text-3xl font-bold text-gray-900">New Badge!</h3>
              <p className="text-gray-700">Animal Expert</p>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-100 rounded-2xl p-4 text-center">
              <div className="text-4xl font-bold text-blue-600">+50</div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
            <div className="bg-green-100 rounded-2xl p-4 text-center">
              <div className="text-4xl font-bold text-green-600">8/8</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="bg-orange-100 rounded-2xl p-4 text-center">
              <div className="text-4xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/kid-dashboard')}
            className="flex items-center gap-3 px-8 py-4 bg-gray-600 text-white rounded-full shadow-lg text-lg font-bold hover:shadow-xl transition-all"
          >
            <Home className="w-6 h-6" />
            Back Home
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/learning-map')}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#2BADEE] to-[#1E90D0] text-white rounded-full shadow-lg text-lg font-bold hover:shadow-xl transition-all"
          >
            Next Lesson
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Encouragement Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 text-center"
        >
          <p className="text-3xl font-bold text-gray-700">
            Keep up the fantastic work! 🌟
          </p>
        </motion.div>
      </div>
    </div>
  );
}
