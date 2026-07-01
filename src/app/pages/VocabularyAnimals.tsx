import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Volume2, Check, Mic, Square, Loader2, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { KidioPageHeader } from '../../components/KidioPageHeader';
import { getVocabularyByLesson, VocabularyResponse } from '../services/vocabularyApi';
import { submitPronunciation, PronunciationScoreResponse } from '../services/pronunciationApi';
import { useVoiceRecorder } from '../utils/useVoiceRecorder';

// The "Pets" lesson ID from backend Seed Data
const PETS_LESSON_ID = "cb123456-1111-2222-3333-000000000005";

export function VocabularyAnimals() {
  const navigate = useNavigate();
  const [vocabularies, setVocabularies] = useState<VocabularyResponse[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [learnedAnimals, setLearnedAnimals] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Scoring states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastScore, setLastScore] = useState<PronunciationScoreResponse | null>(null);

  const { isRecording, audioBlob, startRecording, stopRecording, clearAudio } = useVoiceRecorder();

  useEffect(() => {
    const fetchVocabs = async () => {
      try {
        const res = await getVocabularyByLesson(PETS_LESSON_ID, 1, 50);
        if (res.success && res.data) {
          setVocabularies(res.data.items);
        }
      } catch (error) {
        console.error("Failed to fetch vocabularies", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchVocabs();
  }, []);

  const currentAnimal = vocabularies[currentIndex];
  const isLearned = currentAnimal ? learnedAnimals.includes(currentAnimal.id) : false;

  const playSound = () => {
    if (!currentAnimal) return;
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(currentAnimal.word);
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    utterance.onend = () => setIsPlaying(false);
    speechSynthesis.speak(utterance);
  };

  const markAsLearned = () => {
    if (currentAnimal && !isLearned) {
      const newLearned = [...learnedAnimals, currentAnimal.id];
      setLearnedAnimals(newLearned);
      
      if (newLearned.length === vocabularies.length && vocabularies.length > 0) {
        setTimeout(() => setShowCelebration(true), 1500);
      }
    }
  };

  const nextAnimal = () => {
    if (currentIndex < vocabularies.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setLastScore(null);
      clearAudio();
    }
  };

  const prevAnimal = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setLastScore(null);
      clearAudio();
    }
  };

  // Submit audio when blob is ready
  useEffect(() => {
    const submitAudio = async () => {
      if (audioBlob && currentAnimal) {
        setIsSubmitting(true);
        try {
          const childId = localStorage.getItem('currentKidId');
          if (!childId) {
            alert("No child is currently logged in!");
            return;
          }
          
          const response = await submitPronunciation(
            childId,
            currentAnimal.id,
            audioBlob,
            PETS_LESSON_ID
          );
          
          if (response.success && response.data) {
            setLastScore(response.data);
            if (response.data.isPassed) {
              markAsLearned();
            }
          }
        } catch (error) {
          console.error("Failed to submit audio", error);
        } finally {
          setIsSubmitting(false);
          clearAudio();
        }
      }
    };

    submitAudio();
  }, [audioBlob, currentAnimal]); // eslint-disable-line react-hooks/exhaustive-deps

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
            You learned and pronounced all the animal names!
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

  if (isLoadingData) {
    return (
      <div className="min-h-screen app-sky-background flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-white animate-spin" />
      </div>
    );
  }

  if (vocabularies.length === 0) {
    return (
      <div className="min-h-screen app-sky-background flex flex-col items-center justify-center px-6">
        <h2 className="text-3xl font-bold text-white mb-6">No vocabulary found!</h2>
        <button onClick={() => navigate('/learning-map')} className="px-6 py-3 bg-white text-sky-500 rounded-full font-bold">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-sky-background px-6 py-12 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        <KidioPageHeader
          backLabel="Back"
          backTo="/learning-map"
          title={<div className="text-2xl font-bold text-gray-800">Vocabulary: Animals</div>}
          rightContent={<div className="text-lg font-semibold text-[#2BADEE]">{learnedAnimals.length}/{vocabularies.length} Learned</div>}
        />

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
          <motion.div
            className="bg-gradient-to-r from-[#2BADEE] to-teal-500 h-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(learnedAnimals.length / vocabularies.length) * 100}%` }}
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
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl relative"
          >
            {/* Animal Image */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto mb-6 rounded-3xl overflow-hidden shadow-lg">
              <img
                src={currentAnimal.imageUrl || '/images/animals/placeholder.png'}
                alt={currentAnimal.word}
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
              className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-2"
            >
              {currentAnimal.word}
            </motion.h2>

            <p className="text-xl text-center text-gray-500 mb-8 italic">
              {currentAnimal.pronunciation}
            </p>

            {/* Pronunciation Feedback */}
            {lastScore && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mb-8 p-4 rounded-2xl max-w-md mx-auto border-2 ${lastScore.isPassed ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-bold text-lg ${lastScore.isPassed ? 'text-green-700' : 'text-amber-700'}`}>
                    Score: {lastScore.overallScore}%
                  </span>
                  {lastScore.isPassed ? (
                    <span className="flex text-amber-400"><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /></span>
                  ) : (
                    <span className="flex text-gray-400"><Star /><Star /><Star /></span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm text-center mb-2">
                  <div className="bg-white rounded-lg p-2 shadow-sm">
                    <div className="text-gray-500 text-xs uppercase font-bold">Accuracy</div>
                    <div className="font-semibold text-gray-800">{lastScore.accuracyScore}</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 shadow-sm">
                    <div className="text-gray-500 text-xs uppercase font-bold">Fluency</div>
                    <div className="font-semibold text-gray-800">{lastScore.fluencyScore}</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 shadow-sm">
                    <div className="text-gray-500 text-xs uppercase font-bold">Completeness</div>
                    <div className="font-semibold text-gray-800">{lastScore.completenessScore}</div>
                  </div>
                </div>
                <p className={`text-sm text-center font-medium ${lastScore.isPassed ? 'text-green-600' : 'text-amber-600'}`}>
                  {lastScore.feedback}
                </p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={playSound}
                disabled={isPlaying}
                className={`flex items-center justify-center w-full sm:w-auto gap-3 px-8 py-4 rounded-full text-xl font-bold shadow-lg transition-all ${
                  isPlaying
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-indigo-500 text-white hover:bg-indigo-600'
                }`}
              >
                <Volume2 className={`w-7 h-7 ${isPlaying ? 'animate-pulse' : ''}`} />
                Listen
              </motion.button>

              <motion.button
                whileHover={{ scale: isRecording || isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isRecording || isSubmitting ? 1 : 0.95 }}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isSubmitting || isLearned}
                className={`flex items-center justify-center w-full sm:w-auto gap-3 px-8 py-4 rounded-full text-xl font-bold shadow-lg transition-all ${
                  isLearned 
                    ? 'bg-green-100 text-green-600 border-2 border-green-500 opacity-70'
                    : isSubmitting
                    ? 'bg-gray-200 text-gray-500 cursor-wait'
                    : isRecording
                    ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.5)]'
                    : 'bg-gradient-to-r from-sky-400 to-sky-500 text-white hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-7 h-7 animate-spin" />
                    Scoring...
                  </>
                ) : isLearned ? (
                  <>
                    <Check className="w-7 h-7" />
                    Passed!
                  </>
                ) : isRecording ? (
                  <>
                    <Square className="w-7 h-7 fill-white" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-7 h-7" />
                    Record Voice
                  </>
                )}
              </motion.button>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevAnimal}
                disabled={currentIndex === 0}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full text-sm sm:text-lg font-bold transition-all ${
                  currentIndex === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="hidden sm:inline">Previous</span>
              </motion.button>

              {/* Dots indicator */}
              <div className="flex gap-2">
                {vocabularies.map((animal, index) => (
                  <button
                    key={animal.id}
                    onClick={() => {
                      setCurrentIndex(index);
                      setLastScore(null);
                      clearAudio();
                    }}
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
                disabled={currentIndex === vocabularies.length - 1}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full text-sm sm:text-lg font-bold transition-all ${
                  currentIndex === vocabularies.length - 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#2BADEE] to-teal-500 text-white hover:shadow-lg'
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Animal Thumbnails */}
        <div className="mt-8 grid grid-cols-4 md:grid-cols-8 gap-4">
          {vocabularies.map((animal, index) => (
            <motion.button
              key={animal.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setCurrentIndex(index);
                setLastScore(null);
                clearAudio();
              }}
              className={`relative p-2 rounded-2xl transition-all ${
                index === currentIndex
                  ? 'bg-[#2BADEE] shadow-lg'
                  : learnedAnimals.includes(animal.id)
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-white shadow-md'
              }`}
            >
              <img
                src={animal.imageUrl || '/images/animals/placeholder.png'}
                alt={animal.word}
                className="w-full aspect-square object-cover rounded-xl"
              />
              {learnedAnimals.includes(animal.id) && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow">
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
