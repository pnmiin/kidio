import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, ArrowRight, Palette, Paintbrush, Search } from 'lucide-react';
import { KidioPageHeader } from '../../components/KidioPageHeader';

// Color mixing combinations
const colorCombinations = [
  { colors: ['Red', 'Blue'], result: 'Purple', hex1: '#EF4444', hex2: '#3B82F6', resultHex: '#8B5CF6' },
  { colors: ['Red', 'Yellow'], result: 'Orange', hex1: '#EF4444', hex2: '#FBBF24', resultHex: '#F97316' },
  { colors: ['Blue', 'Yellow'], result: 'Green', hex1: '#3B82F6', hex2: '#FBBF24', resultHex: '#22C55E' },
  { colors: ['Red', 'White'], result: 'Pink', hex1: '#EF4444', hex2: '#FFFFFF', resultHex: '#EC4899' },
  { colors: ['Blue', 'White'], result: 'Light Blue', hex1: '#3B82F6', hex2: '#FFFFFF', resultHex: '#7DD3FC' },
  { colors: ['Black', 'White'], result: 'Gray', hex1: '#1F2937', hex2: '#FFFFFF', resultHex: '#9CA3AF' },
];

const primaryColors = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Yellow', hex: '#FBBF24' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#1F2937' },
];

const answerColors = [
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Light Blue', hex: '#7DD3FC' },
  { name: 'Gray', hex: '#9CA3AF' },
];

// Confetti component
function Confetti() {
  const colors = ['#EF4444', '#3B82F6', '#FBBF24', '#22C55E', '#8B5CF6', '#EC4899', '#F97316'];
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.5,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: -20, x: `${piece.x}vw`, rotate: 0, opacity: 1 }}
          animate={{
            y: '100vh',
            rotate: piece.rotation + 720,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 3, delay: piece.delay, ease: 'easeOut' }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </div>
  );
}

// Floating background shapes
function FloatingShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            background: ['#EF4444', '#3B82F6', '#FBBF24', '#22C55E', '#8B5CF6'][i % 5],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

type GameScreen = 'hero' | 'game' | 'menu';

export function ColorMixGame() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<GameScreen>('hero');
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [bucketColors, setBucketColors] = useState<string[]>([]);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [bucketShaking, setBucketShaking] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(false);

  // Find the correct result based on selected colors
  const findCorrectResult = (colors: string[]) => {
    if (colors.length !== 2) return null;
    const sorted = [...colors].sort();
    for (const combo of colorCombinations) {
      const comboSorted = [...combo.colors].sort();
      if (comboSorted[0] === sorted[0] && comboSorted[1] === sorted[1]) {
        return combo;
      }
    }
    return null;
  };

  const [currentCombination, setCurrentCombination] = useState<typeof colorCombinations[0] | null>(null);

  // Get answer options based on the actual mixed colors
  const getAnswerOptions = (correctResult: string) => {
    const correctAnswer = answerColors.find(c => c.name === correctResult)!;
    const wrongAnswers = answerColors.filter(c => c.name !== correctResult);
    const shuffledWrong = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 2);
    return [correctAnswer, ...shuffledWrong].sort(() => Math.random() - 0.5);
  };

  const [answerOptions, setAnswerOptions] = useState<typeof answerColors>([]);

  const handleColorSelect = (colorName: string) => {
    if (selectedColors.length >= 2 || selectedColors.includes(colorName)) return;

    const newSelected = [...selectedColors, colorName];
    setSelectedColors(newSelected);
    setBucketColors([...bucketColors, colorName]);

    // When 2 colors are selected, find the result
    if (newSelected.length === 2) {
      const result = findCorrectResult(newSelected);
      if (result) {
        setCurrentCombination(result);
        setAnswerOptions(getAnswerOptions(result.result));
        setTimeout(() => {
          setBucketShaking(true);
          setTimeout(() => {
            setBucketShaking(false);
            setShowQuestion(true);
          }, 800);
        }, 300);
      } else {
        // Invalid combination - show error and reset
        setWrongAnswer(true);
        setTimeout(() => {
          setWrongAnswer(false);
          setSelectedColors([]);
          setBucketColors([]);
        }, 800);
      }
    }
  };

  const handleAnswerSelect = (colorName: string) => {
    if (!currentCombination) return;
    const correct = colorName === currentCombination.result;
    setIsCorrect(correct);

    if (correct) {
      setShowConfetti(true);
      setScore(score + 1);
      setTotalRounds(totalRounds + 1);
      setTimeout(() => {
        setShowResult(true);
        setShowConfetti(false);
      }, 1500);
    } else {
      setWrongAnswer(true);
      setTimeout(() => setWrongAnswer(false), 500);
    }
  };

  const handleNext = () => {
    setCurrentRound(currentRound + 1);
    resetGame();
  };

  const handlePlayAgain = () => {
    resetGame();
  };

  const resetGame = () => {
    setSelectedColors([]);
    setBucketColors([]);
    setShowQuestion(false);
    setShowResult(false);
    setIsCorrect(null);
    setWrongAnswer(false);
    setCurrentCombination(null);
    setAnswerOptions([]);
  };

  const startGame = () => {
    setScreen('game');
    setScore(0);
    setTotalRounds(0);
    setCurrentRound(0);
    resetGame();
  };

  // Hero Screen
  if (screen === 'hero') {
    return (
      <div className="min-h-screen app-sky-background relative overflow-hidden">
        <FloatingShapes />
        
        <div className="relative z-10 px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <KidioPageHeader backLabel="Back" backTo="/learning-map" />
          </div>

          <div className="max-w-4xl mx-auto mt-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 mb-4">
                Mix Colors Lab
              </h1>
              <p className="text-xl text-gray-600 mb-8">Mix colors and discover magic!</p>
            </motion.div>

            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative w-64 h-64 mx-auto mb-8"
            >
              {/* Color splashes */}
              <motion.div
                className="absolute -left-8 top-0 w-20 h-20 rounded-full bg-red-400 opacity-80"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute -right-8 top-0 w-16 h-16 rounded-full bg-blue-400 opacity-80"
                animate={{ scale: [1, 1.15, 1], rotate: [0, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
              />
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 -top-4 w-14 h-14 rounded-full bg-yellow-400 opacity-80"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              />

              {/* Cute bucket */}
              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="relative">
                  {/* Bucket body */}
                  <div className="w-40 h-32 bg-gradient-to-b from-gray-200 to-gray-300 rounded-b-3xl rounded-t-lg relative overflow-hidden">
                    {/* Bucket shine */}
                    <div className="absolute left-2 top-2 bottom-2 w-4 bg-white/30 rounded-full" />
                    {/* Cute face */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
                      <div className="w-4 h-4 bg-gray-700 rounded-full" />
                      <div className="w-4 h-4 bg-gray-700 rounded-full" />
                    </div>
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 w-8 h-4 border-b-4 border-gray-700 rounded-b-full" />
                  </div>
                  {/* Bucket handle */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-28 h-8 border-4 border-gray-400 rounded-t-full" />
                </div>
              </motion.div>
            </motion.div>

            {/* Play Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
            >
              <Play className="w-8 h-8 fill-white" />
              Play Now
            </motion.button>

            {/* Game Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16"
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={startGame}
                className="bg-gradient-to-br from-purple-400 to-pink-400 p-6 rounded-3xl shadow-lg cursor-pointer"
              >
                <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Mix Colors</h3>
                <p className="text-white/80 text-sm">Mix two colors and discover a new one!</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-gradient-to-br from-orange-400 to-yellow-400 p-6 rounded-3xl shadow-lg cursor-pointer opacity-70"
              >
                <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Paintbrush className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Paint Object</h3>
                <p className="text-white/80 text-sm">Color objects with the correct color!</p>
                <span className="text-xs text-white/60 mt-2 block">Coming Soon</span>
              </motion.div>

              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-gradient-to-br from-green-400 to-teal-400 p-6 rounded-3xl shadow-lg cursor-pointer opacity-70"
              >
                <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Color Hunt</h3>
                <p className="text-white/80 text-sm">Find all objects with the target color!</p>
                <span className="text-xs text-white/60 mt-2 block">Coming Soon</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="min-h-screen app-sky-background relative overflow-hidden">
      <FloatingShapes />
      {showConfetti && <Confetti />}

      <div className="relative z-10 px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <KidioPageHeader
            backLabel="Back"
            backTo="/learning-map"
            rightContent={
              <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md">
                <span className="text-lg font-bold text-purple-600">Score: {score}/{totalRounds}</span>
              </div>
            }
          />

          {/* Game Title */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center text-purple-600 mb-6"
          >
            Mix Colors Lab
          </motion.h1>

          {/* Instruction */}
          <AnimatePresence mode="wait">
            {!showResult && (
              <motion.p
                key="instruction"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-lg text-gray-600 mb-8"
              >
                {showQuestion 
                  ? "What color do we get?"
                  : "Pick 2 colors and drop into the bucket"
                }
              </motion.p>
            )}
          </AnimatePresence>

          {/* Main Game Area */}
          <div className="flex flex-col items-center">
            {/* Color Selection - Show all 5 primary colors */}
            {!showQuestion && !showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8"
              >
                {primaryColors.map((color) => (
                  <motion.button
                    key={color.name}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleColorSelect(color.name)}
                    disabled={selectedColors.includes(color.name)}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg transition-all flex items-center justify-center ${
                      selectedColors.includes(color.name) ? 'opacity-30 scale-75' : 'hover:shadow-xl'
                    }`}
                    style={{ 
                      backgroundColor: color.hex,
                      border: color.name === 'White' ? '3px solid #E5E7EB' : 'none'
                    }}
                  >
                    <span className={`text-xs md:text-sm font-bold ${color.name === 'White' || color.name === 'Yellow' ? 'text-gray-700' : 'text-white'}`}>
                      {color.name}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Bucket - Hide when showing result */}
            {!showResult && (
            <motion.div
              animate={bucketShaking ? { 
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1.1, 1.1, 1.1, 1]
              } : {}}
              transition={{ duration: 0.5 }}
              className="relative mb-8"
            >
              {/* Glow effect when full */}
              {bucketColors.length === 2 && currentCombination && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -inset-4 rounded-3xl"
                  style={{ 
                    background: `radial-gradient(circle, ${showResult ? currentCombination.resultHex : '#A855F7'}40 0%, transparent 70%)` 
                  }}
                />
              )}

              <div className="relative">
                {/* Bucket body */}
                <motion.div 
                  className="w-48 h-40 rounded-b-[3rem] rounded-t-xl relative overflow-hidden transition-colors duration-500"
                  style={{ 
                    background: showResult && currentCombination
                      ? `linear-gradient(to bottom, ${currentCombination.resultHex}, ${currentCombination.resultHex}dd)`
                      : 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)'
                  }}
                >
                  {/* Bucket shine */}
                  <div className="absolute left-3 top-3 bottom-3 w-5 bg-white/30 rounded-full" />
                  
                  {/* Colors in bucket */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {bucketColors.map((colorName, index) => {
                      const color = primaryColors.find(c => c.name === colorName);
                      return (
                        <motion.div
                          key={index}
                          initial={{ y: -50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ type: 'spring', bounce: 0.5 }}
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: color?.hex }}
                        />
                      );
                    })}
                  </div>

                  {/* Cute face */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-6">
                    <motion.div 
                      animate={showResult && isCorrect ? { scale: [1, 1.2, 1] } : {}}
                      className="w-5 h-5 bg-gray-700 rounded-full"
                    />
                    <motion.div 
                      animate={showResult && isCorrect ? { scale: [1, 1.2, 1] } : {}}
                      className="w-5 h-5 bg-gray-700 rounded-full"
                    />
                  </div>
                  <motion.div 
                    animate={showResult && isCorrect ? { scaleY: 1.5 } : {}}
                    className="absolute top-16 left-1/2 -translate-x-1/2 w-10 h-5 border-b-4 border-gray-700 rounded-b-full"
                  />
                </motion.div>
                
                {/* Bucket handle */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-8 border-4 border-gray-400 rounded-t-full" />
              </div>
            </motion.div>
            )}

            {/* Answer Options */}
            {showQuestion && !showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap justify-center gap-4 mb-8"
              >
                {answerOptions.map((color) => (
                  <motion.button
                    key={color.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={wrongAnswer ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                    onClick={() => handleAnswerSelect(color.name)}
                    className="px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                    style={{ backgroundColor: color.hex }}
                  >
                    {color.name}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Try Again Message */}
            <AnimatePresence>
              {wrongAnswer && !showQuestion && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xl font-bold text-orange-500 mb-4"
                >
                  These colors don&apos;t mix! Try another pair.
                </motion.p>
              )}
              {wrongAnswer && showQuestion && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xl font-bold text-orange-500 mb-4"
                >
                  Not quite! Try again!
                </motion.p>
              )}
            </AnimatePresence>

            {/* Result */}
            <AnimatePresence>
              {showResult && currentCombination && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center bg-white z-20 px-4 py-8"
                >
                  {/* Color equation with squares and names below */}
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
                          backgroundColor: currentCombination.hex1,
                          border: currentCombination.colors[0] === 'White' ? '2px solid #D1D5DB' : 'none'
                        }}
                      />
                      <span className="text-sm md:text-base font-semibold text-gray-700 mt-2">{currentCombination.colors[0]}</span>
                    </div>

                    <span className="text-2xl md:text-3xl font-bold text-gray-800">+</span>

                    {/* Second color */}
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-lg"
                        style={{ 
                          backgroundColor: currentCombination.hex2,
                          border: currentCombination.colors[1] === 'White' ? '2px solid #D1D5DB' : 'none'
                        }}
                      />
                      <span className="text-sm md:text-base font-semibold text-gray-700 mt-2">{currentCombination.colors[1]}</span>
                    </div>

                    <span className="text-2xl md:text-3xl font-bold text-gray-800">=</span>

                    {/* Result color */}
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-lg"
                        style={{ backgroundColor: currentCombination.resultHex }}
                      />
                      <span className="text-sm md:text-base font-semibold text-gray-700 mt-2">{currentCombination.result}</span>
                    </div>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="text-3xl font-bold text-green-500 mb-6"
                  >
                    Correct!
                  </motion.p>

                  <div className="flex gap-3 md:gap-4 justify-center flex-wrap">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePlayAgain}
                      className="flex items-center gap-2 px-5 py-3 md:px-6 bg-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-300 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Play Again
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNext}
                      className="flex items-center gap-2 px-5 py-3 md:px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-full hover:shadow-lg transition-all"
                    >
                      Next
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
