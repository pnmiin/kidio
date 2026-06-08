import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Volume2, Check } from 'lucide-react';
import { useState } from 'react';
import { KidioPageHeader } from '../../components/KidioPageHeader';

const animals = [
  { id: 1, name: 'Dog', image: '/images/animals/dog.png', sound: 'Woof woof!' },
  { id: 2, name: 'Cat', image: '/images/animals/cat.png', sound: 'Meow!' },
  { id: 3, name: 'Elephant', image: '/images/animals/elephant.png', sound: 'Trumpet!' },
  { id: 4, name: 'Lion', image: '/images/animals/lion.png', sound: 'Roar!' },
  { id: 5, name: 'Bird', image: '/images/animals/bird.png', sound: 'Tweet tweet!' },
  { id: 6, name: 'Fish', image: '/images/animals/fish.png', sound: 'Blub blub!' },
  { id: 7, name: 'Rabbit', image: '/images/animals/rabbit.png', sound: 'Squeak!' },
  { id: 8, name: 'Bear', image: '/images/animals/bear.png', sound: 'Growl!' },
];

export function VocabularyAnimals() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [learnedAnimals, setLearnedAnimals] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentAnimal = animals[currentIndex];
  const isLearned = learnedAnimals.includes(currentAnimal.id);
  const allLearned = learnedAnimals.length === animals.length;

  const playSound = () => {
    setIsPlaying(true);
    // Simulate sound playing
    const utterance = new SpeechSynthesisUtterance(currentAnimal.name);
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    utterance.onend = () => setIsPlaying(false);
    speechSynthesis.speak(utterance);
  };

  const markAsLearned = () => {
    if (!isLearned) {
      const newLearned = [...learnedAnimals, currentAnimal.id];
      setLearnedAnimals(newLearned);
      
      if (newLearned.length === animals.length) {
        setTimeout(() => setShowCelebration(true), 500);
      }
    }
  };

  const nextAnimal = () => {
    if (currentIndex < animals.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevAnimal = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Celebration Screen
  if (showCelebration) {
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
            <div className="text-9xl mb-4">🎓</div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2BADEE] to-teal-500 mb-4"
          >
            Amazing!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl text-gray-700 mb-8"
          >
            You learned all the animal names!
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
            onClick={() => navigate('/learning-map')}
            className="w-full py-5 rounded-full bg-gradient-to-r from-[#2BADEE] to-[#1E90D0] text-white text-2xl font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
          >
            CONTINUE
            <ArrowRight className="w-7 h-7" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-sky-background px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <KidioPageHeader
          backLabel="Back"
          backTo="/learning-map"
          title={<div className="text-2xl font-bold text-gray-800">Vocabulary: Animals</div>}
          rightContent={<div className="text-lg font-semibold text-[#2BADEE]">{learnedAnimals.length}/{animals.length} Learned</div>}
        />

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
          <motion.div
            className="bg-gradient-to-r from-[#2BADEE] to-teal-500 h-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(learnedAnimals.length / animals.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Main Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAnimal.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-8 shadow-2xl"
          >
            {/* Animal Image */}
            <div className="relative w-64 h-64 mx-auto mb-6 rounded-3xl overflow-hidden shadow-lg">
              <img
                src={currentAnimal.image}
                alt={currentAnimal.name}
                className="w-full h-full object-cover"
              />
              {isLearned && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>
              )}
            </div>

            {/* Animal Name */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-center text-gray-800 mb-4"
            >
              {currentAnimal.name}
            </motion.h2>

            {/* Sound Text */}
            <p className="text-2xl text-center text-gray-500 mb-8 italic">
              &quot;{currentAnimal.sound}&quot;
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={playSound}
                disabled={isPlaying}
                className={`flex items-center gap-3 px-8 py-4 rounded-full text-xl font-bold shadow-lg transition-all ${
                  isPlaying
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl'
                }`}
              >
                <Volume2 className={`w-7 h-7 ${isPlaying ? 'animate-pulse' : ''}`} />
                {isPlaying ? 'Playing...' : 'Listen'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={markAsLearned}
                disabled={isLearned}
                className={`flex items-center gap-3 px-8 py-4 rounded-full text-xl font-bold shadow-lg transition-all ${
                  isLearned
                    ? 'bg-green-100 text-green-600 border-2 border-green-500'
                    : 'bg-gradient-to-r from-[#2BADEE] to-teal-500 text-white hover:shadow-xl'
                }`}
              >
                <Check className="w-7 h-7" />
                {isLearned ? 'Learned!' : 'I Know This!'}
              </motion.button>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevAnimal}
                disabled={currentIndex === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold transition-all ${
                  currentIndex === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ArrowLeft className="w-6 h-6" />
                Previous
              </motion.button>

              {/* Dots indicator */}
              <div className="flex gap-2">
                {animals.map((animal, index) => (
                  <button
                    key={animal.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-[#2BADEE] scale-125'
                        : learnedAnimals.includes(animal.id)
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextAnimal}
                disabled={currentIndex === animals.length - 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold transition-all ${
                  currentIndex === animals.length - 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#2BADEE] to-teal-500 text-white hover:shadow-lg'
                }`}
              >
                Next
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Animal Thumbnails */}
        <div className="mt-8 grid grid-cols-4 md:grid-cols-8 gap-4">
          {animals.map((animal, index) => (
            <motion.button
              key={animal.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentIndex(index)}
              className={`relative p-2 rounded-2xl transition-all ${
                index === currentIndex
                  ? 'bg-[#2BADEE] shadow-lg'
                  : learnedAnimals.includes(animal.id)
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-white shadow-md'
              }`}
            >
              <img
                src={animal.image}
                alt={animal.name}
                className="w-full aspect-square object-cover rounded-xl"
              />
              {learnedAnimals.includes(animal.id) && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
