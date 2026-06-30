import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Play, RotateCcw, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { KidioPageHeader } from '../../components/KidioPageHeader';

export function VideoLesson() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen app-sky-background px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <KidioPageHeader
          backLabel="Back"
          backTo="/kid-dashboard"
          title={<div className="text-2xl font-bold text-gray-800">Animal Names</div>}
        />

        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl overflow-hidden shadow-2xl mb-8"
        >
          <div className="relative bg-gradient-to-br from-blue-200 to-purple-200 aspect-video flex items-center justify-center">
            {/* Placeholder Video Area */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1711802536733-121190966471?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY2FydG9vbiUyMGNhbWVsJTIwY2hpbGRyZW58ZW58MXx8fHwxNzcyNzUxODg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Camel teacher"
                className="w-full h-full object-cover opacity-60"
              />
            </div>

            {/* Play Button Overlay */}
            {!isPlaying && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(true)}
                className="relative z-10 w-24 h-24 bg-white/90 rounded-full flex items-center justify-center shadow-2xl hover:bg-white transition-all"
              >
                <Play className="w-12 h-12 text-[#2BADEE] ml-2" />
              </motion.button>
            )}

            {/* Camel Mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-4 left-4 z-10"
            >
              <div className="bg-white rounded-2xl p-3 shadow-lg">
                <p className="text-sm font-bold text-gray-700">
                  Hi! I'm Camel, your teacher! 🐪
                </p>
              </div>
            </motion.div>
          </div>

          {/* Video Progress Bar */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: isPlaying ? '45%' : '0%' }}
                transition={{ duration: 2 }}
                className="h-full bg-[#2BADEE]"
              />
            </div>
          </div>
        </motion.div>

        {/* Control Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-3 px-8 py-4 bg-[#2BADEE] text-white rounded-full shadow-lg text-lg font-bold hover:shadow-xl transition-all"
          >
            <Play className="w-6 h-6" />
            {isPlaying ? 'Pause' : 'Play'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(false)}
            className="flex items-center gap-3 px-8 py-4 bg-purple-500 text-white rounded-full shadow-lg text-lg font-bold hover:shadow-xl transition-all"
          >
            <RotateCcw className="w-6 h-6" />
            Replay
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/learning-journey')}
            className="flex items-center gap-3 px-8 py-4 bg-green-500 text-white rounded-full shadow-lg text-lg font-bold hover:shadow-xl transition-all"
          >
            Back to Map
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Lesson Content Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 shadow-lg"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Today's Words:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['🐶 Dog', '🐱 Cat', '🐘 Elephant', '🦁 Lion', '🐯 Tiger', '🐻 Bear', '🐰 Rabbit', '🐸 Frog'].map(
              (word, index) => (
                <motion.div
                  key={word}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-4 text-center text-xl font-bold text-gray-700"
                >
                  {word}
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
