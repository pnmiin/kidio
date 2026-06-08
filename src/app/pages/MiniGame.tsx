import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { KidioPageHeader } from '../../components/KidioPageHeader';

const initialWords = [
  { id: 1, text: 'Dog', image: '/images/animals/dog.png', matched: false },
  { id: 2, text: 'Cat', image: '/images/animals/cat.png', matched: false },
  { id: 3, text: 'Elephant', image: '/images/animals/elephant.png', matched: false },
  { id: 4, text: 'Lion', image: '/images/animals/lion.png', matched: false },
];

export function MiniGame() {
  const navigate = useNavigate();
  const [gameWords, setGameWords] = useState(initialWords);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [draggedWord, setDraggedWord] = useState<string | null>(null);
  const [hoveredZone, setHoveredZone] = useState<number | null>(null);
  const [wrongDropZone, setWrongDropZone] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, text: string) => {
    setDraggedWord(text);
    e.dataTransfer.setData('text/plain', text);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedWord(null);
    setHoveredZone(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setHoveredZone(id);
  };

  const handleDragLeave = () => {
    setHoveredZone(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, correctText: string, id: number) => {
    e.preventDefault();
    const droppedText = e.dataTransfer.getData('text/plain');
    setHoveredZone(null);
    setDraggedWord(null);

    if (droppedText === correctText) {
      setGameWords((prev) =>
        prev.map((w) => (w.text === droppedText ? { ...w, matched: true } : w))
      );
      setScore((prev) => {
        const newScore = prev + 1;
        if (newScore === initialWords.length) {
          setTimeout(() => setIsCompleted(true), 500);
        }
        return newScore;
      });
    } else {
      // Wrong answer - show shake animation and red color
      setWrongDropZone(id);
      setTimeout(() => setWrongDropZone(null), 600);
    }
  };

  // Completion Screen
  if (isCompleted) {
    return (
      <div className="min-h-screen app-sky-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full bg-white rounded-3xl p-12 shadow-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <div className="text-9xl mb-4">🎉</div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2BADEE] to-teal-500 mb-4"
          >
            Congratulations!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl text-gray-700 mb-8"
          >
            You matched all the words perfectly!
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-4 mb-8"
          >
            {[1, 2, 3].map((star) => (
              <motion.div
                key={star}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.7 + star * 0.1, type: 'spring' }}
                className="text-5xl"
              >
                ⭐
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/vocabulary-animals')}
            className="w-full py-5 rounded-full bg-gradient-to-r from-[#2BADEE] to-[#1E90D0] text-white text-2xl font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
          >
            NEXT
            <ArrowRight className="w-7 h-7" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-sky-background px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <KidioPageHeader
          backLabel="Back"
          backTo="/kid-dashboard"
          title={<div className="text-2xl font-bold text-gray-800">Match the Words!</div>}
          rightContent={<div className="text-lg font-bold text-[#2BADEE]">Score: {score}/{initialWords.length}</div>}
        />

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-lg mb-8"
        >
          <p className="text-xl text-gray-700 text-center">
            Drag each word from the right and drop it on the matching animal picture!
          </p>
        </motion.div>

        {/* Game Area */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Drop Zones - Animals */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Animals</h3>
            <div className="grid grid-cols-2 gap-4">
              {initialWords.map((word) => {
                const isMatched = gameWords.find((w) => w.id === word.id)?.matched || false;
                const isHovered = hoveredZone === word.id;

                const isWrong = wrongDropZone === word.id;

                return (
                  <motion.div
                    key={word.id}
                    animate={isWrong ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    onDragOver={(e) => !isMatched && handleDragOver(e, word.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => !isMatched && handleDrop(e, word.text, word.id)}
                    className={`bg-white rounded-3xl p-4 shadow-lg flex flex-col items-center justify-center min-h-[220px] transition-all duration-200 ${
                      isHovered && !isMatched ? 'ring-4 ring-[#2BADEE] scale-105 bg-blue-50' : ''
                    } ${isMatched ? 'bg-green-100 ring-4 ring-green-500' : ''} ${
                      isWrong ? 'ring-4 ring-red-500 bg-red-50' : ''
                    }`}
                  >
                    <div className="w-32 h-32 rounded-2xl overflow-hidden mb-4 shadow-md">
                      <img
                        src={word.image}
                        alt={word.text}
                        className="w-full h-full object-cover object-center"
                        draggable={false}
                      />
                    </div>
                    {isMatched ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-xl font-bold text-green-600"
                      >
                        {word.text}
                      </motion.div>
                    ) : (
                      <div className="text-gray-400 text-center text-sm">Drop word here</div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Draggable Words */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Words</h3>
            <div className="flex flex-col gap-4">
              {gameWords.map((word) => {
                if (word.matched) return null;

                return (
                  <div
                    key={word.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, word.text)}
                    onDragEnd={handleDragEnd}
                    className={`bg-gradient-to-br from-blue-400 to-blue-600 text-white px-6 py-4 rounded-2xl text-xl font-bold shadow-lg cursor-grab active:cursor-grabbing transition-all hover:scale-105 select-none ${
                      draggedWord === word.text ? 'opacity-50' : 'opacity-100'
                    }`}
                  >
                    {word.text}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`mt-12 rounded-3xl p-6 ${
            score === initialWords.length
              ? 'bg-gradient-to-r from-green-100 to-blue-100 border-4 border-green-400'
              : 'bg-amber-100 border-4 border-amber-300'
          }`}
        >
          {score === initialWords.length ? (
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="text-5xl">🎉</span>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2BADEE] to-teal-500">
                  Congratulations!
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/vocabulary-animals')}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#2BADEE] to-[#1E90D0] text-white text-xl font-bold shadow-lg transition-all duration-300 flex items-center gap-3"
              >
                NEXT LESSON
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </div>
          ) : (
            <p className="text-xl font-bold text-gray-700 text-center">
              Drag each word to its matching animal picture!
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
