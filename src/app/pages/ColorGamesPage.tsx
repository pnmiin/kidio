import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Paintbrush, Search, Check, X, RotateCcw } from 'lucide-react';
import { KidioPageHeader } from '../../components/KidioPageHeader';

type GameType = 'mix' | 'paint' | 'hunt';

// Mix Colors Lab Component - Quiz style with 2 colors + bucket + 3 answer options
function MixColorsLab() {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [bucketShaking, setBucketShaking] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);
  const [score, setScore] = useState(0);

  // All 12 color hex values (matching Color Vocabulary)
  const colorHex: Record<string, string> = {
    Red: '#EF4444',
    Orange: '#F97316',
    Yellow: '#FCD34D',
    Green: '#22C55E',
    Blue: '#3B82F6',
    Purple: '#8B5CF6',
    Pink: '#EC4899',
    Brown: '#A16207',
    Black: '#1F2937',
    White: '#FFFFFF',
    Gray: '#9CA3AF',
    Cyan: '#06B6D4',
  };

  // Quiz rounds - covers all mixable colors from the 12 vocabulary colors
  const rounds = [
    // Basic secondary colors
    { color1: 'Red', color2: 'Blue', correct: 'Purple', options: ['Purple', 'Green', 'Orange'] },
    { color1: 'Blue', color2: 'Yellow', correct: 'Green', options: ['Orange', 'Green', 'Purple'] },
    { color1: 'Red', color2: 'Yellow', correct: 'Orange', options: ['Green', 'Purple', 'Orange'] },
    // Tints with White
    { color1: 'Red', color2: 'White', correct: 'Pink', options: ['Pink', 'Gray', 'Cyan'] },
    { color1: 'Blue', color2: 'White', correct: 'Cyan', options: ['Pink', 'Cyan', 'Gray'] },
    { color1: 'Black', color2: 'White', correct: 'Gray', options: ['Gray', 'Pink', 'Brown'] },
    // Brown mixes
    { color1: 'Red', color2: 'Green', correct: 'Brown', options: ['Brown', 'Purple', 'Gray'] },
    { color1: 'Orange', color2: 'Black', correct: 'Brown', options: ['Gray', 'Brown', 'Purple'] },
  ];

  const currentQuestion = rounds[currentRound];

  const handleAnswerClick = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    setBucketShaking(true);

    setTimeout(() => {
      setBucketShaking(false);
      
      if (answer === currentQuestion.correct) {
        setIsCorrect(true);
        setScore(score + 1);
        setShowResult(true);
      } else {
        setIsCorrect(false);
        setWrongShake(true);
        setTimeout(() => {
          setWrongShake(false);
          setSelectedAnswer(null);
        }, 600);
      }
    }, 500);
  };

  const nextRound = () => {
    setCurrentRound((prev) => (prev + 1) % rounds.length);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  const resetGame = () => {
    setCurrentRound(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setScore(0);
  };

  return (
    <div className="relative flex flex-col items-center py-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Mix Colors Lab</h3>
      <p className="text-gray-600 mb-2">What color do these make?</p>
      
      {/* Score and round */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm text-gray-500">Round {currentRound + 1}/{rounds.length}</span>
        <span className="text-sm font-semibold text-teal-600">Score: {score}</span>
      </div>

      {/* Two color boxes to mix */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        {/* Color 1 */}
        <div className="flex flex-col items-center">
          <motion.div
            animate={bucketShaking ? { y: [0, -10, 0] } : {}}
            transition={{ duration: 0.3 }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-lg"
            style={{
              backgroundColor: colorHex[currentQuestion.color1],
              border: currentQuestion.color1 === 'White' ? '2px solid #E5E7EB' : 'none',
            }}
          />
          <span className="text-sm font-semibold text-gray-700 mt-2">{currentQuestion.color1}</span>
        </div>

        {/* Plus sign */}
        <span className="text-3xl font-bold text-gray-400">+</span>

        {/* Color 2 */}
        <div className="flex flex-col items-center">
          <motion.div
            animate={bucketShaking ? { y: [0, -10, 0] } : {}}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-lg"
            style={{
              backgroundColor: colorHex[currentQuestion.color2],
              border: currentQuestion.color2 === 'White' ? '2px solid #E5E7EB' : 'none',
            }}
          />
          <span className="text-sm font-semibold text-gray-700 mt-2">{currentQuestion.color2}</span>
        </div>
      </motion.div>

      {/* Bucket */}
      <motion.div
        animate={bucketShaking ? { rotate: [0, -8, 8, -8, 8, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <svg width="140" height="120" viewBox="0 0 160 140">
          <path
            d="M20 40 L30 130 C30 135 40 140 80 140 C120 140 130 135 130 130 L140 40 Z"
            fill={showResult && isCorrect ? colorHex[currentQuestion.correct] : '#E5E7EB'}
            stroke="#9CA3AF"
            strokeWidth="3"
          />
          <ellipse cx="80" cy="40" rx="62" ry="15" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="3" />
          <path
            d="M30 30 Q80 -10 130 30"
            fill="none"
            stroke="#6B7280"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Question mark or face */}
          {!showResult && (
            <text x="80" y="95" textAnchor="middle" fontSize="40" fill="#9CA3AF">?</text>
          )}
        </svg>
      </motion.div>

      {/* Answer options - 3 color boxes */}
      {!showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4"
        >
          {currentQuestion.options.map((option) => (
            <motion.button
              key={option}
              animate={wrongShake && selectedAnswer === option ? { x: [0, -8, 8, -8, 8, 0] } : {}}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswerClick(option)}
              disabled={!!selectedAnswer}
              className={`flex flex-col items-center transition-all ${
                selectedAnswer === option && !isCorrect ? 'ring-4 ring-red-500' : ''
              }`}
            >
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-lg transition-shadow hover:shadow-xl"
                style={{
                  backgroundColor: colorHex[option],
                  border: option === 'White' ? '2px solid #E5E7EB' : 'none',
                }}
              />
              <span className="text-xs md:text-sm font-semibold text-gray-700 mt-2">{option}</span>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Wrong answer feedback */}
      <AnimatePresence>
        {wrongShake && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-orange-500 font-bold mt-4"
          >
            Try again!
          </motion.p>
        )}
      </AnimatePresence>

      {/* Correct Result - Full overlay to cover answer options */}
      <AnimatePresence>
        {showResult && isCorrect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20"
          >
            {/* Confetti effect */}
            <div className="relative h-0">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 0 }}
                  animate={{
                    opacity: [1, 0],
                    scale: [0, 1],
                    x: [0, (Math.random() - 0.5) * 200],
                    y: [0, (Math.random() - 0.5) * 200],
                  }}
                  transition={{ duration: 1, delay: i * 0.04 }}
                  className="absolute left-1/2 w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: ['#EF4444', '#3B82F6', '#FCD34D', '#22C55E', '#8B5CF6', '#F97316'][i % 6],
                  }}
                />
              ))}
            </div>

            {/* Color equation with squares and names */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-3 md:gap-4 mb-6"
            >
              {/* First color */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-lg"
                  style={{ 
                    backgroundColor: colorHex[currentQuestion.color1],
                    border: currentQuestion.color1 === 'White' ? '2px solid #D1D5DB' : 'none'
                  }}
                />
                <span className="text-sm md:text-base font-semibold text-gray-700 mt-2">{currentQuestion.color1}</span>
              </div>

              <span className="text-2xl md:text-3xl font-bold text-gray-800">+</span>

              {/* Second color */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-lg"
                  style={{ 
                    backgroundColor: colorHex[currentQuestion.color2],
                    border: currentQuestion.color2 === 'White' ? '2px solid #D1D5DB' : 'none'
                  }}
                />
                <span className="text-sm md:text-base font-semibold text-gray-700 mt-2">{currentQuestion.color2}</span>
              </div>

              <span className="text-2xl md:text-3xl font-bold text-gray-800">=</span>

              {/* Result color */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-lg"
                  style={{ backgroundColor: colorHex[currentQuestion.correct] }}
                />
                <span className="text-sm md:text-base font-semibold text-gray-700 mt-2">{currentQuestion.correct}</span>
              </div>
            </motion.div>

            <p className="text-green-500 font-bold text-3xl mb-6">Correct!</p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={currentRound < rounds.length - 1 ? nextRound : resetGame}
              className="px-8 py-4 bg-teal-500 text-white font-bold text-lg rounded-full shadow-lg hover:bg-teal-600 transition-all flex items-center gap-2 mx-auto"
            >
              {currentRound < rounds.length - 1 ? (
                'Next'
              ) : (
                <>
                  <RotateCcw className="w-5 h-5" />
                  Play Again
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Color Vocabulary Component - Shows all basic colors with English names
function ColorVocabulary() {
  const basicColors = [
    { name: 'Red', hex: '#EF4444' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Yellow', hex: '#FCD34D' },
    { name: 'Green', hex: '#22C55E' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Purple', hex: '#8B5CF6' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Brown', hex: '#A16207' },
    { name: 'Black', hex: '#1F2937' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#9CA3AF' },
    { name: 'Cyan', hex: '#06B6D4' },
  ];

  return (
    <div className="flex flex-col items-center py-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Color Vocabulary</h3>
      <p className="text-gray-600 mb-8">Learn the names of basic colors in English</p>

      {/* Color Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 w-full max-w-2xl">
        {basicColors.map((color, index) => (
          <motion.div
            key={color.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.1, y: -5 }}
            className="flex flex-col items-center"
          >
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-lg mb-2 transition-shadow hover:shadow-xl"
              style={{ 
                backgroundColor: color.hex,
                border: color.name === 'White' ? '2px solid #E5E7EB' : 'none'
              }}
            />
            <span className={`text-sm md:text-base font-semibold text-gray-700`}>
              {color.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Color Hunt Component - Using recognizable objects for kids
function ColorHunt() {
  const [currentRound, setCurrentRound] = useState(0);
  const [foundObjects, setFoundObjects] = useState<number[]>([]);
  const [wrongObject, setWrongObject] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  // 10 rounds with all basic colors and recognizable objects
  const rounds = [
    {
      targetColor: 'Red',
      targetHex: '#EF4444',
      objects: [
        { id: 1, emoji: '🍎', color: 'Red', name: 'Apple' },
        { id: 2, emoji: '🎈', color: 'Red', name: 'Balloon' },
        { id: 3, emoji: '🚗', color: 'Red', name: 'Car' },
        { id: 4, emoji: '🍌', color: 'Yellow', name: 'Banana' },
        { id: 5, emoji: '🐸', color: 'Green', name: 'Frog' },
        { id: 6, emoji: '🐳', color: 'Blue', name: 'Whale' },
        { id: 7, emoji: '🍇', color: 'Purple', name: 'Grapes' },
        { id: 8, emoji: '🥕', color: 'Orange', name: 'Carrot' },
        { id: 9, emoji: '🍓', color: 'Red', name: 'Strawberry' },
      ],
    },
    {
      targetColor: 'Blue',
      targetHex: '#3B82F6',
      objects: [
        { id: 1, emoji: '🐟', color: 'Blue', name: 'Fish' },
        { id: 2, emoji: '🧢', color: 'Blue', name: 'Hat' },
        { id: 3, emoji: '🚙', color: 'Blue', name: 'Toy Car' },
        { id: 4, emoji: '🍎', color: 'Red', name: 'Apple' },
        { id: 5, emoji: '🍋', color: 'Yellow', name: 'Lemon' },
        { id: 6, emoji: '🥒', color: 'Green', name: 'Cucumber' },
        { id: 7, emoji: '🐳', color: 'Blue', name: 'Whale' },
        { id: 8, emoji: '🍊', color: 'Orange', name: 'Orange' },
        { id: 9, emoji: '🫐', color: 'Blue', name: 'Blueberry' },
      ],
    },
    {
      targetColor: 'Yellow',
      targetHex: '#FCD34D',
      objects: [
        { id: 1, emoji: '🍌', color: 'Yellow', name: 'Banana' },
        { id: 2, emoji: '🐥', color: 'Yellow', name: 'Chick' },
        { id: 3, emoji: '⭐', color: 'Yellow', name: 'Star' },
        { id: 4, emoji: '🍎', color: 'Red', name: 'Apple' },
        { id: 5, emoji: '🐸', color: 'Green', name: 'Frog' },
        { id: 6, emoji: '🍇', color: 'Purple', name: 'Grapes' },
        { id: 7, emoji: '🌻', color: 'Yellow', name: 'Sunflower' },
        { id: 8, emoji: '🐳', color: 'Blue', name: 'Whale' },
        { id: 9, emoji: '🍋', color: 'Yellow', name: 'Lemon' },
      ],
    },
    {
      targetColor: 'Green',
      targetHex: '#22C55E',
      objects: [
        { id: 1, emoji: '🌳', color: 'Green', name: 'Tree' },
        { id: 2, emoji: '🐸', color: 'Green', name: 'Frog' },
        { id: 3, emoji: '🍀', color: 'Green', name: 'Leaf' },
        { id: 4, emoji: '🍎', color: 'Red', name: 'Apple' },
        { id: 5, emoji: '🍌', color: 'Yellow', name: 'Banana' },
        { id: 6, emoji: '🐳', color: 'Blue', name: 'Whale' },
        { id: 7, emoji: '🥒', color: 'Green', name: 'Cucumber' },
        { id: 8, emoji: '🍊', color: 'Orange', name: 'Orange' },
        { id: 9, emoji: '🥦', color: 'Green', name: 'Broccoli' },
      ],
    },
    {
      targetColor: 'Orange',
      targetHex: '#F97316',
      objects: [
        { id: 1, emoji: '🍊', color: 'Orange', name: 'Orange' },
        { id: 2, emoji: '🥕', color: 'Orange', name: 'Carrot' },
        { id: 3, emoji: '🎃', color: 'Orange', name: 'Pumpkin' },
        { id: 4, emoji: '🍎', color: 'Red', name: 'Apple' },
        { id: 5, emoji: '🍌', color: 'Yellow', name: 'Banana' },
        { id: 6, emoji: '🐸', color: 'Green', name: 'Frog' },
        { id: 7, emoji: '🐳', color: 'Blue', name: 'Whale' },
        { id: 8, emoji: '🦊', color: 'Orange', name: 'Fox' },
        { id: 9, emoji: '🍇', color: 'Purple', name: 'Grapes' },
      ],
    },
    {
      targetColor: 'Purple',
      targetHex: '#8B5CF6',
      objects: [
        { id: 1, emoji: '🍇', color: 'Purple', name: 'Grapes' },
        { id: 2, emoji: '🌸', color: 'Purple', name: 'Flower' },
        { id: 3, emoji: '🍆', color: 'Purple', name: 'Eggplant' },
        { id: 4, emoji: '🍎', color: 'Red', name: 'Apple' },
        { id: 5, emoji: '🍌', color: 'Yellow', name: 'Banana' },
        { id: 6, emoji: '🐸', color: 'Green', name: 'Frog' },
        { id: 7, emoji: '🐳', color: 'Blue', name: 'Whale' },
        { id: 8, emoji: '🍊', color: 'Orange', name: 'Orange' },
        { id: 9, emoji: '🦄', color: 'Purple', name: 'Unicorn' },
      ],
    },
    {
      targetColor: 'Pink',
      targetHex: '#EC4899',
      objects: [
        { id: 1, emoji: '🐷', color: 'Pink', name: 'Pig' },
        { id: 2, emoji: '🌷', color: 'Pink', name: 'Flower' },
        { id: 3, emoji: '🎀', color: 'Pink', name: 'Ribbon' },
        { id: 4, emoji: '🍎', color: 'Red', name: 'Apple' },
        { id: 5, emoji: '🍌', color: 'Yellow', name: 'Banana' },
        { id: 6, emoji: '🐸', color: 'Green', name: 'Frog' },
        { id: 7, emoji: '🐳', color: 'Blue', name: 'Whale' },
        { id: 8, emoji: '🧁', color: 'Pink', name: 'Cupcake' },
        { id: 9, emoji: '🦩', color: 'Pink', name: 'Flamingo' },
      ],
    },
    {
      targetColor: 'Brown',
      targetHex: '#92400E',
      objects: [
        { id: 1, emoji: '🐻', color: 'Brown', name: 'Bear' },
        { id: 2, emoji: '🥔', color: 'Brown', name: 'Potato' },
        { id: 3, emoji: '🪵', color: 'Brown', name: 'Wood' },
        { id: 4, emoji: '🍎', color: 'Red', name: 'Apple' },
        { id: 5, emoji: '🍌', color: 'Yellow', name: 'Banana' },
        { id: 6, emoji: '🐸', color: 'Green', name: 'Frog' },
        { id: 7, emoji: '🐳', color: 'Blue', name: 'Whale' },
        { id: 8, emoji: '🍫', color: 'Brown', name: 'Chocolate' },
        { id: 9, emoji: '🐿️', color: 'Brown', name: 'Squirrel' },
      ],
    },
    {
      targetColor: 'Black',
      targetHex: '#1F2937',
      objects: [
        { id: 1, emoji: '🐈‍⬛', color: 'Black', name: 'Black Cat' },
        { id: 2, emoji: '🎩', color: 'Black', name: 'Hat' },
        { id: 3, emoji: '🕷️', color: 'Black', name: 'Spider' },
        { id: 4, emoji: '🍎', color: 'Red', name: 'Apple' },
        { id: 5, emoji: '🍌', color: 'Yellow', name: 'Banana' },
        { id: 6, emoji: '🐸', color: 'Green', name: 'Frog' },
        { id: 7, emoji: '🐳', color: 'Blue', name: 'Whale' },
        { id: 8, emoji: '🦇', color: 'Black', name: 'Bat' },
        { id: 9, emoji: '🐧', color: 'Black', name: 'Penguin' },
      ],
    },
    {
      targetColor: 'White',
      targetHex: '#E5E7EB',
      objects: [
        { id: 1, emoji: '☁️', color: 'White', name: 'Cloud' },
        { id: 2, emoji: '🐑', color: 'White', name: 'Sheep' },
        { id: 3, emoji: '🥚', color: 'White', name: 'Egg' },
        { id: 4, emoji: '🍎', color: 'Red', name: 'Apple' },
        { id: 5, emoji: '🍌', color: 'Yellow', name: 'Banana' },
        { id: 6, emoji: '🐸', color: 'Green', name: 'Frog' },
        { id: 7, emoji: '🐳', color: 'Blue', name: 'Whale' },
        { id: 8, emoji: '⛄', color: 'White', name: 'Snowman' },
        { id: 9, emoji: '🐰', color: 'White', name: 'Rabbit' },
      ],
    },
  ];

  const currentRoundData = rounds[currentRound];
  const correctObjects = currentRoundData.objects.filter(o => o.color === currentRoundData.targetColor);

  const handleObjectClick = (obj: typeof currentRoundData.objects[0]) => {
    if (foundObjects.includes(obj.id)) return;

    if (obj.color === currentRoundData.targetColor) {
      const newFound = [...foundObjects, obj.id];
      setFoundObjects(newFound);

      // Check if all correct objects found
      if (correctObjects.every(o => newFound.includes(o.id))) {
        setTimeout(() => setCompleted(true), 500);
      }
    } else {
      setWrongObject(obj.id);
      setTimeout(() => setWrongObject(null), 600);
    }
  };

  const nextRound = () => {
    setCurrentRound((prev) => (prev + 1) % rounds.length);
    setFoundObjects([]);
    setCompleted(false);
  };

  return (
    <div className="relative flex flex-col items-center py-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Color Hunt</h3>
      <p className="text-gray-600 mb-6">Find objects with the correct color!</p>

      {/* Target Color Prompt */}
      <motion.div
        key={currentRound}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6 px-6 py-4 rounded-2xl shadow-lg bg-white"
      >
        <span className="text-xl font-bold text-gray-700">Find all</span>
        <div
          className="w-10 h-10 rounded-xl shadow-md"
          style={{ 
            backgroundColor: currentRoundData.targetHex,
            border: currentRoundData.targetColor === 'White' ? '2px solid #D1D5DB' : 'none'
          }}
        />
        <span className="text-xl font-bold" style={{ color: currentRoundData.targetHex === '#E5E7EB' ? '#6B7280' : currentRoundData.targetHex }}>
          {currentRoundData.targetColor}
        </span>
        <span className="text-xl font-bold text-gray-700">objects</span>
      </motion.div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-gray-600">Found:</span>
        <span className="text-lg font-bold text-teal-600">
          {foundObjects.filter(id => correctObjects.some(o => o.id === id)).length}
        </span>
        <span className="text-gray-400">/</span>
        <span className="text-lg font-bold text-gray-600">{correctObjects.length}</span>
        <span className="text-sm text-gray-500 ml-2">
          (Round {currentRound + 1}/{rounds.length})
        </span>
      </div>

      {/* Objects Grid - Large touch-friendly cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {currentRoundData.objects.map((obj) => {
          const isFound = foundObjects.includes(obj.id);
          const isWrong = wrongObject === obj.id;

          return (
            <motion.button
              key={obj.id}
              animate={isWrong ? { x: [0, -8, 8, -8, 8, 0] } : {}}
              whileHover={!isFound ? { scale: 1.05 } : {}}
              whileTap={!isFound ? { scale: 0.95 } : {}}
              onClick={() => handleObjectClick(obj)}
              disabled={isFound || completed}
              className={`relative w-24 h-28 md:w-28 md:h-32 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all ${
                isFound 
                  ? 'bg-green-100 ring-4 ring-green-500' 
                  : isWrong 
                    ? 'bg-red-100 ring-4 ring-red-500'
                    : 'bg-white hover:shadow-xl cursor-pointer'
              }`}
            >
              <span className="text-5xl md:text-6xl mb-1">{obj.emoji}</span>
              <span className="text-xs md:text-sm font-medium text-gray-600">{obj.name}</span>
              {isFound && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-md"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Completion - Full overlay to cover objects grid */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20"
          >
            {/* Confetti */}
            <div className="relative h-0">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 0 }}
                  animate={{
                    opacity: [1, 0],
                    scale: [0, 1],
                    x: [0, (Math.random() - 0.5) * 180],
                    y: [0, (Math.random() - 0.5) * 180],
                  }}
                  transition={{ duration: 1, delay: i * 0.04 }}
                  className="absolute left-1/2 w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: ['#EF4444', '#3B82F6', '#FCD34D', '#22C55E', '#8B5CF6', '#EC4899'][i % 6],
                  }}
                />
              ))}
            </div>

            {/* Target color circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="w-28 h-28 rounded-full shadow-2xl mb-6"
              style={{ 
                backgroundColor: currentRoundData.targetHex,
                border: currentRoundData.targetColor === 'White' ? '2px solid #D1D5DB' : 'none'
              }}
            />

            <p className="text-green-500 font-bold text-3xl mb-2">Great job!</p>
            <p className="text-gray-600 text-lg mb-6">
              You found all {currentRoundData.targetColor} objects!
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextRound}
              className="px-8 py-4 bg-teal-500 text-white font-bold text-lg rounded-full shadow-lg hover:bg-teal-600 transition-all"
            >
              Next Color
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main Color Games Page
export function ColorGamesPage() {
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState<GameType>('mix');

  const games = [
    { id: 'mix' as GameType, title: 'Mix Colors Lab', icon: Palette, color: 'bg-purple-500' },
    { id: 'paint' as GameType, title: 'Color Vocabulary', icon: Paintbrush, color: 'bg-orange-500' },
    { id: 'hunt' as GameType, title: 'Color Hunt', icon: Search, color: 'bg-teal-500' },
  ];

  return (
    <div className="min-h-screen app-sky-background px-6 py-6">
      <div className="max-w-4xl mx-auto">
        <KidioPageHeader
          backLabel="Back"
          backTo="/learning-map"
          title={
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Color Games</h1>
              <p className="text-gray-600 text-lg">Play and learn colors in fun ways!</p>
            </motion.div>
          }
        />

        {/* Activity Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {games.map((game, index) => {
            const Icon = game.icon;
            const isActive = activeGame === game.id;

            return (
              <motion.button
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveGame(game.id)}
                className={`relative p-6 rounded-3xl shadow-lg transition-all ${
                  isActive
                    ? 'bg-white ring-4 ring-[#2BADEE] shadow-xl'
                    : 'bg-white hover:shadow-xl'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -top-2 -right-2 w-8 h-8 bg-[#2BADEE] rounded-full flex items-center justify-center"
                  >
                    <Check className="w-5 h-5 text-white" />
                  </motion.div>
                )}

                <div className={`w-16 h-16 ${game.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-center">{game.title}</h3>
              </motion.button>
            );
          })}
        </div>

        {/* Activity Panel */}
        <motion.div
          layout
          className="bg-white rounded-3xl shadow-lg p-8 min-h-[400px]"
        >
          <AnimatePresence mode="wait">
            {activeGame === 'mix' && (
              <motion.div
                key="mix"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MixColorsLab />
              </motion.div>
            )}
            {activeGame === 'paint' && (
              <motion.div
                key="paint"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ColorVocabulary />
              </motion.div>
            )}
            {activeGame === 'hunt' && (
              <motion.div
                key="hunt"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ColorHunt />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
