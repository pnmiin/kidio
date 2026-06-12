import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  LogOut,
  Sparkles,
  Volume2,
} from 'lucide-react';
import {
  placementQuestions,
  type PlacementQuestion,
} from '../data/placementQuestions';

type PlacementResult = {
  levelKey: string;
  levelNumber: string;
  levelName: string;
  pathLabel: string;
  currentTopic: string;
  description: string;
  score: number;
};

function getPlacementResult(score: number): PlacementResult {
  if (score <= 2) {
    return {
      levelKey: 'starter',
      levelNumber: '1',
      levelName: 'Starter Adventure',
      pathLabel: ' Starter Adventure',
      currentTopic: 'ABC',
      description: 'Start with letters, sounds, colors, numbers, and easy words.',
      score,
    };
  }

  if (score <= 4) {
    return {
      levelKey: 'explorer',
      levelNumber: '2',
      levelName: 'Explorer',
      pathLabel: ' Explorer',
      currentTopic: 'Animals',
      description: 'Build basic vocabulary with familiar topics and simple speaking.',
      score,
    };
  }

  if (score <= 6) {
    return {
      levelKey: 'builder',
      levelNumber: '3',
      levelName: 'Builder',
      pathLabel: ' Builder',
      currentTopic: 'Food',
      description: 'Grow vocabulary and begin using short sentences.',
      score,
    };
  }

  if (score === 7) {
    return {
      levelKey: 'story',
      levelNumber: '4',
      levelName: 'Story Explorer',
      pathLabel: ' Story Explorer',
      currentTopic: 'Stories',
      description: 'Practice short reading, listening, and simple story understanding.',
      score,
    };
  }

  return {
    levelKey: 'speaking',
    levelNumber: '5',
    levelName: 'Speaking Hero',
    pathLabel: ' Speaking Hero',
    currentTopic: 'Conversation',
    description: 'Practice full sentences, conversation, and confident speaking.',
    score,
  };
}

function QuestionVisual({
  question,
  onSpeak,
}: {
  question: PlacementQuestion;
  onSpeak: () => void;
}) {
  if (question.type === 'audio') {
    return (
      <motion.button
        type="button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onSpeak}
        className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-sky-400 to-violet-500 text-white shadow-[0_18px_38px_rgba(75,116,238,0.3)] focus:outline-none focus:ring-4 focus:ring-violet-200 sm:h-32 sm:w-32"
        aria-label={`Play the word for question ${question.id}`}
      >
        <Volume2 className="h-12 w-12 sm:h-14 sm:w-14" strokeWidth={2.5} />
      </motion.button>
    );
  }

  if (question.id === 1) {
    return (
      <img
        src="/images/animals/dog.png"
        alt="Dog"
        className="h-36 w-36 object-contain drop-shadow-[0_16px_22px_rgba(38,100,150,0.18)] sm:h-44 sm:w-44"
      />
    );
  }

  if (question.id === 2) {
    return (
      <div
        className="h-28 w-28 rounded-full border-[10px] border-white bg-red-500 shadow-[0_18px_35px_rgba(239,68,68,0.3)] sm:h-36 sm:w-36"
        aria-label="Red color circle"
      />
    );
  }

  if (question.visual) {
    return (
      <img
        src={question.visual}
        alt={`Illustration for question ${question.id}`}
        className="max-h-44 w-full max-w-sm object-contain drop-shadow-[0_16px_22px_rgba(38,100,150,0.14)] sm:max-h-52"
      />
    );
  }

  if (question.id === 5) {
    return <span className="text-7xl drop-shadow-sm sm:text-8xl" aria-hidden="true">🍎</span>;
  }

  if (question.id === 6) {
    return <span className="text-7xl drop-shadow-sm sm:text-8xl" aria-hidden="true">👩</span>;
  }

  if (question.id === 7) {
    return <span className="text-7xl drop-shadow-sm sm:text-8xl" aria-hidden="true">😊</span>;
  }

  return (
    <div className="flex items-center gap-4 rounded-[28px] border-2 border-amber-100 bg-white px-7 py-5 shadow-[0_16px_30px_rgba(43,128,190,0.12)]">
      <BookOpen className="h-16 w-16 text-violet-500" />
      <span className="text-6xl" aria-hidden="true">🐶</span>
    </div>
  );
}

export function PlacementQuizPage() {
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<PlacementResult | null>(null);

  const question = placementQuestions[questionIndex];
  const selectedAnswer = answers[question.id] ?? '';
  const isLastQuestion = questionIndex === placementQuestions.length - 1;

  useEffect(() => {
    if (!localStorage.getItem('currentKidName')) {
      navigate('/kid-login', { replace: true });
    }
  }, [navigate]);

  const speakAudio = () => {
    if (!question.audioText || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(question.audioText);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech is an enhancement; the quiz remains usable without it.
    }
  };

  const goBack = () => {
    if (questionIndex === 0) {
      navigate('/kid-login');
      return;
    }

    setQuestionIndex((current) => current - 1);
  };

  const goNext = () => {
    if (!selectedAnswer) return;

    if (!isLastQuestion) {
      setQuestionIndex((current) => current + 1);
      return;
    }

    const score = placementQuestions.reduce(
      (total, item) => total + (answers[item.id] === item.answer ? 1 : 0),
      0,
    );
    setResult(getPlacementResult(score));
  };

  const continueToKidHome = () => {
    if (!result) return;

    const pathKey = result.levelKey;
    localStorage.setItem('kidioPath', pathKey);
    localStorage.setItem('kidioLevel', pathKey);
    localStorage.setItem('currentKidScore', String(result.score));
    localStorage.setItem('currentKidLevel', pathKey);
    localStorage.setItem('currentKidLevelNumber', result.levelNumber);
    localStorage.setItem('currentKidPath', result.levelName);
    localStorage.setItem('currentKidPathLabel', result.pathLabel);
    localStorage.setItem('currentKidCurrentTopic', result.currentTopic);
    localStorage.setItem('currentKidLevelDescription', result.description);
    console.log('Assigned KIDIO path:', pathKey);
    navigate('/kid-dashboard');
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[linear-gradient(145deg,#dff5ff_0%,#f5fbff_46%,#fff2dc_100%)] px-4 py-5 text-[#102d54] sm:px-7 sm:py-7">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="absolute -left-20 top-32 h-28 w-60 rounded-full bg-white/65 before:absolute before:left-12 before:-top-10 before:h-24 before:w-24 before:rounded-full before:bg-white/75 after:absolute after:right-12 after:-top-6 after:h-20 after:w-20 after:rounded-full after:bg-white/70" />
        <span className="absolute -right-24 bottom-28 h-32 w-64 rounded-full bg-white/65 before:absolute before:left-12 before:-top-10 before:h-24 before:w-24 before:rounded-full before:bg-white/75 after:absolute after:right-10 after:-top-7 after:h-20 after:w-20 after:rounded-full after:bg-white/70" />
        <Sparkles className="absolute left-[12%] top-[28%] h-8 w-8 text-yellow-300/75" />
        <Sparkles className="absolute bottom-[22%] right-[13%] h-10 w-10 text-violet-200/75" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-full focus:outline-none focus:ring-4 focus:ring-sky-200"
          aria-label="Go to KIDIO home"
        >
          <img src="/assets/kidio-logo.png" alt="KIDIO" className="h-12 w-auto sm:h-16" />
        </button>
        <button
          type="button"
          onClick={() => navigate('/kid-login')}
          className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2.5 text-sm font-black shadow-[0_12px_28px_rgba(43,128,190,0.14)] transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-4 focus:ring-sky-200 sm:px-5 sm:text-base"
        >
          <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
          Exit
        </button>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-[820px] justify-center py-5 sm:py-8">
        <motion.section
          key={question.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-[30px] border border-white/90 bg-white p-5 shadow-[0_30px_90px_rgba(43,128,190,0.18)] sm:rounded-[40px] sm:p-8 lg:p-10"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600 sm:text-sm">
                KIDIO Placement Quiz
              </p>
              <p className="mt-1 text-sm font-bold text-gray-500">
                Question {questionIndex + 1} / {placementQuestions.length}
              </p>
            </div>
            <span className="rounded-full bg-violet-100 px-3 py-1.5 text-sm font-black text-violet-700">
              {Math.round(((questionIndex + 1) / placementQuestions.length) * 100)}%
            </span>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-sky-100">
            <motion.div
              initial={false}
              animate={{ width: `${((questionIndex + 1) / placementQuestions.length) * 100}%` }}
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-500"
            />
          </div>

          <div className="mt-6 flex min-h-[190px] items-center justify-center rounded-[26px] bg-gradient-to-br from-sky-50 via-white to-violet-50 p-5 sm:min-h-[230px]">
            <QuestionVisual question={question} onSpeak={speakAudio} />
          </div>

          <h1 className="mx-auto mt-6 max-w-2xl text-center text-2xl font-black leading-tight text-[#102d54] sm:text-3xl">
            {question.question}
          </h1>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {question.options.map((option) => {
              const selected = selectedAnswer === option;

              return (
                <motion.button
                  key={option}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    setAnswers((current) => ({ ...current, [question.id]: option }))
                  }
                  className={`relative min-h-[72px] rounded-[20px] border-2 px-4 py-3 text-lg font-black transition sm:min-h-[82px] ${
                    selected
                      ? 'scale-[1.02] border-violet-500 bg-gradient-to-br from-sky-100 to-violet-100 text-violet-900 shadow-[0_14px_28px_rgba(124,58,237,0.2)]'
                      : 'border-sky-100 bg-white text-[#234668] shadow-[0_8px_18px_rgba(43,128,190,0.08)] hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50'
                  }`}
                  aria-pressed={selected}
                >
                  {selected && (
                    <span className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-white">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                  )}
                  {option}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-7 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full border-2 border-sky-100 bg-white px-5 text-sm font-black text-[#234668] transition hover:border-sky-300 hover:bg-sky-50 sm:h-14 sm:px-7 sm:text-base"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            <motion.button
              type="button"
              whileHover={selectedAnswer ? { y: -2 } : undefined}
              whileTap={selectedAnswer ? { scale: 0.98 } : undefined}
              onClick={goNext}
              disabled={!selectedAnswer}
              className="inline-flex h-13 min-w-[150px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#29b8ff] to-[#0877f2] px-5 text-sm font-black text-white shadow-[0_16px_30px_rgba(8,119,242,0.24)] transition disabled:cursor-not-allowed disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-500 disabled:shadow-none sm:h-14 sm:min-w-[190px] sm:px-7 sm:text-base"
            >
              {isLastQuestion ? 'See My Path' : 'Next'}
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.section>
      </main>

      {result && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#102d54]/35 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="placement-result-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md rounded-[32px] border border-white bg-white p-6 text-center shadow-[0_30px_90px_rgba(16,45,84,0.28)] sm:p-8"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-200 to-amber-400 text-4xl shadow-[0_14px_30px_rgba(245,158,11,0.25)]">
              ⭐
            </div>
            <h2 id="placement-result-title" className="mt-5 text-3xl font-black text-[#102d54]">
              Great job!
            </h2>
            <p className="mt-2 text-lg font-semibold text-gray-500">
              Kiki found your learning path!
            </p>
            <p className="mt-4 text-base font-black text-[#38536d]">
              You got {result.score} / 8
            </p>
            <div className="mt-4 rounded-[24px] bg-gradient-to-br from-sky-100 to-violet-100 px-5 py-6">
              <span className="inline-flex rounded-full bg-white px-5 py-2 text-lg font-black text-sky-700 shadow-sm">
                Level {result.levelNumber}
              </span>
              <p className="mt-4 text-3xl font-black text-violet-700">
                {result.pathLabel}
              </p>
              <p className="mt-3 text-base font-black text-[#234668]">
                Start with: {result.currentTopic}
              </p>
              <p className="mx-auto mt-3 max-w-sm text-sm font-semibold leading-6 text-gray-600">
                {result.description}
              </p>
            </div>
            <button
              type="button"
              onClick={continueToKidHome}
              className="mt-6 h-14 w-full rounded-full bg-gradient-to-r from-[#29b8ff] to-[#0877f2] text-lg font-black text-white shadow-[0_16px_30px_rgba(8,119,242,0.25)] transition hover:-translate-y-0.5"
            >
              Continue to Home
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
