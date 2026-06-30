import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CheckCircle2,
  Headphones,
  Home,
  RefreshCcw,
  Star,
  Trophy,
  Volume2,
} from "lucide-react";
import { KidioPageHeader } from "../../components/KidioPageHeader";
import { NumberLearningBoard } from "../components/number-land/NumberLearningBoard";
import {
  NumberVillageQuestion,
  numberVillageQuestions,
  numberWords,
} from "../data/numberVillageData";
import {
  getNumberVillageStars,
  saveNumberVillageResult,
} from "../utils/numberLandProgress";
import { speak, stopSpeech } from "../utils/speech";
import { submitProgress } from "../services/progressApi";

type Feedback = {
  type: "correct" | "wrong";
  text: string;
};

type FlowStep = "learn" | "practice" | "result";

function ObjectGroup({ question }: { question: NumberVillageQuestion }) {
  if (!question.visualObjects) return null;

  return (
    <div
      className="mx-auto grid max-w-sm grid-cols-4 justify-items-center gap-3 rounded-[1.75rem] bg-sky-50 p-5 sm:max-w-md sm:grid-cols-5"
      aria-label={`${question.visualObjects.count} ${question.visualObjects.label}`}
    >
      {Array.from({ length: question.visualObjects.count }, (_, index) => (
        <motion.span
          key={`${question.id}-${index}`}
          initial={{ opacity: 0, y: 10, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: index * 0.04, type: "spring", stiffness: 220 }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-white bg-white text-4xl shadow-sm sm:h-16 sm:w-16"
        >
          {question.visualObjects.emoji}
        </motion.span>
      ))}
    </div>
  );
}

function QuestionVisual({
  question,
  hasListened,
  isSpeaking,
  onListen,
}: {
  question: NumberVillageQuestion;
  hasListened: boolean;
  isSpeaking: boolean;
  onListen: () => void;
}) {
  if (question.type === "listen-choose") {
    return (
      <AudioTapCard
        hasListened={hasListened}
        isSpeaking={isSpeaking}
        onListen={onListen}
      />
    );
  }

  if (question.type === "count-objects") {
    return <ObjectGroup question={question} />;
  }

  return (
    <div className="mx-auto flex flex-wrap items-center justify-center gap-3 rounded-[2rem] bg-violet-50 p-5">
      {question.sequence?.map((number) => (
        <span
          key={number}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-4xl font-black text-violet-600 shadow-sm"
        >
          {number}
        </span>
      ))}
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-4xl font-black text-amber-600 shadow-sm">
        ?
      </span>
    </div>
  );
}

function AudioTapCard({
  hasListened,
  isSpeaking,
  onListen,
}: {
  hasListened: boolean;
  isSpeaking: boolean;
  onListen: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onListen}
      whileTap={{ scale: 0.97 }}
      animate={isSpeaking ? { scale: [1, 1.02, 1] } : {}}
      transition={isSpeaking ? { duration: 1.1, repeat: Infinity } : undefined}
      aria-label="Tap to listen to the number"
      className={`mx-auto flex min-h-56 w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-[2rem] border-4 p-6 text-center shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl ${
        isSpeaking
          ? "border-violet-200 bg-gradient-to-br from-violet-100 to-sky-100"
          : hasListened
            ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-sky-100"
            : "border-amber-100 bg-gradient-to-br from-amber-100 to-sky-100"
      }`}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white/85 text-sky-600 shadow-inner">
        <Volume2 className="h-12 w-12" />
      </div>
      <div className="mt-4 text-3xl font-black text-[#183B5B]">
        {isSpeaking ? "Listening..." : hasListened ? "Listen Again" : "Tap to Listen"}
      </div>
      <div className="mt-2 text-lg font-bold text-slate-500">
        {isSpeaking
          ? "Great ears!"
          : hasListened
            ? "Tap to hear it one more time"
            : "Hear the number"}
      </div>
    </motion.button>
  );
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex justify-center gap-2" aria-label={`${stars} stars`}>
      {[1, 2, 3].map((star) => (
        <Star
          key={star}
          className={`h-11 w-11 ${
            star <= stars ? "fill-amber-300 text-amber-300" : "fill-slate-100 text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

export function NumberVillageGame() {
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [canGoNext, setCanGoNext] = useState(false);
  const [flowStep, setFlowStep] = useState<FlowStep>("learn");
  const [lastWrongAnswer, setLastWrongAnswer] = useState<number | null>(null);
  const [hasListened, setHasListened] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [startTime] = useState(Date.now());

  const question = numberVillageQuestions[questionIndex];
  const stars = useMemo(() => getNumberVillageStars(score), [score]);
  const passed = score >= 8;

  const resetQuestionState = () => {
    setSelectedAnswer(null);
    setFeedback(null);
    setCanGoNext(false);
    setLastWrongAnswer(null);
    setHasListened(false);
    setIsSpeaking(false);
  };

  const handleListen = () => {
    setHasListened(true);
    setIsSpeaking(true);
    const didSpeak = speak(question.spokenText, {
      onEnd: () => setIsSpeaking(false),
    });
    if (!didSpeak) setIsSpeaking(false);
  };

  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer);
    setIsSpeaking(false);

    if (answer === question.correctAnswer) {
      const word = numberWords[question.correctAnswer];
      setScore((value) => value + 1);
      setFeedback({
        type: "correct",
        text: `Great job! This is ${word}!`,
      });
      setCanGoNext(true);
      speak(`Great job! This is ${word}.`);
      return;
    }

    setLastWrongAnswer(answer);
    setFeedback({
      type: "wrong",
      text: "Good try! Listen again and try once more.",
    });
    setCanGoNext(false);
    speak("Good try. Listen again and try once more.");
  };

  const finishGame = async () => {
    stopSpeech();
    setIsSpeaking(false);
    saveNumberVillageResult(score);
    
    const earnedStars = getNumberVillageStars(score);
    const currentStars = parseInt(localStorage.getItem("currentKidStars") || "0");
    localStorage.setItem("currentKidStars", (currentStars + earnedStars).toString());

    const childId = localStorage.getItem("currentKidId");
    const lessonId = localStorage.getItem("currentLessonId");
    if (childId && lessonId) {
      try {
        await submitProgress({
          childId,
          lessonId,
          scorePercent: Math.round((score / numberVillageQuestions.length) * 100),
          timeSpentSeconds: Math.floor((Date.now() - startTime) / 1000)
        });
      } catch (err) {
        console.error("Failed to submit progress:", err);
      }
    }

    setFlowStep("result");
  };

  const handleNext = () => {
    stopSpeech();
    setIsSpeaking(false);

    if (questionIndex === numberVillageQuestions.length - 1) {
      finishGame();
      return;
    }

    setQuestionIndex((value) => value + 1);
    resetQuestionState();
  };

  const playAgain = () => {
    stopSpeech();
    setQuestionIndex(0);
    setScore(0);
    setFlowStep("learn");
    resetQuestionState();
  };

  if (flowStep === "result") {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#DFF5FF_0%,#FFF7DE_56%,#FDE7F3_100%)] px-4 py-5 text-slate-700 sm:px-7">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute left-[-60px] top-28 h-24 w-48 rounded-full bg-white/70" />
          <span className="absolute right-[-42px] top-44 h-20 w-44 rounded-full bg-white/65" />
          <span className="absolute bottom-24 left-[12%] h-12 w-12 rounded-full bg-sky-200/70" />
          <span className="absolute right-[14%] top-[20%] h-10 w-10 rounded-full bg-amber-200/80" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <KidioPageHeader
            backLabel="Back to Number Land"
            backTo="/number-land"
            title={
              <div className="text-center">
                <p className="text-sm font-black uppercase tracking-wide text-sky-500">Number Village</p>
                <h1 className="text-2xl font-black text-[#183B5B] sm:text-3xl">Numbers 1-10</h1>
              </div>
            }
          />

          <motion.main
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mx-auto mt-10 rounded-[2rem] bg-white/90 p-7 text-center shadow-xl ring-1 ring-white sm:p-10"
          >
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-amber-100 text-amber-500 shadow-inner">
              {passed ? <Trophy className="h-16 w-16" /> : <Home className="h-16 w-16 text-sky-500" />}
            </div>
            <h2 className="mt-6 text-4xl font-black leading-tight text-[#183B5B]">
              {passed
                ? "Amazing! You completed Number Village!"
                : "Good try! Practice again!"}
            </h2>
            <p className="mt-4 text-3xl font-black text-sky-600">
              {score} / {numberVillageQuestions.length}
            </p>
            <div className="mt-5">
              <StarRating stars={stars} />
            </div>
            {passed ? (
              <p className="mx-auto mt-6 w-fit rounded-full bg-violet-100 px-6 py-3 text-xl font-black text-violet-700">
                Teen Town unlocked!
              </p>
            ) : (
              <p className="mx-auto mt-6 max-w-xl text-xl font-bold text-slate-500">
                Try again to unlock Teen Town.
              </p>
            )}

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <button
                type="button"
                onClick={playAgain}
                className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-sky-500 px-7 py-3 text-lg font-black text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600"
              >
                <RefreshCcw className="h-6 w-6" />
                Play Again
              </button>
              <button
                type="button"
                onClick={() => navigate("/number-land")}
                className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-amber-100 px-7 py-3 text-lg font-black text-amber-700 shadow-md transition hover:bg-amber-200 lg:col-span-2"
              >
                <ArrowLeft className="h-6 w-6" />
                Back to Number Land
              </button>
            </div>
          </motion.main>
        </div>
      </div>
    );
  }

  if (flowStep === "learn") {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#DFF5FF_0%,#FFF7DE_56%,#FDE7F3_100%)] px-4 py-5 text-slate-700 sm:px-7">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute left-[-60px] top-28 h-24 w-48 rounded-full bg-white/70" />
          <span className="absolute right-[-42px] top-44 h-20 w-44 rounded-full bg-white/65" />
          <span className="absolute bottom-24 left-[12%] h-12 w-12 rounded-full bg-sky-200/70" />
          <span className="absolute right-[14%] top-[20%] h-10 w-10 rounded-full bg-amber-200/80" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <KidioPageHeader
            backLabel="Back to Number Land"
            backTo="/number-land"
            title={
              <div className="text-center">
                <p className="text-sm font-black uppercase tracking-wide text-sky-500">Number Village</p>
                <h1 className="text-2xl font-black text-[#183B5B] sm:text-3xl">
                  Numbers 0-10
                </h1>
              </div>
            }
          />

          <NumberLearningBoard
            onStartPractice={() => {
              setQuestionIndex(0);
              setScore(0);
              resetQuestionState();
              setFlowStep("practice");
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#DFF5FF_0%,#FFF7DE_56%,#FDE7F3_100%)] px-4 py-5 text-slate-700 sm:px-7">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute left-[-60px] top-28 h-24 w-48 rounded-full bg-white/70" />
        <span className="absolute right-[-42px] top-44 h-20 w-44 rounded-full bg-white/65" />
        <span className="absolute bottom-24 left-[12%] h-12 w-12 rounded-full bg-sky-200/70" />
        <span className="absolute right-[14%] top-[20%] h-10 w-10 rounded-full bg-amber-200/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <KidioPageHeader
          backLabel="Back to Number Land"
          backTo="/number-land"
          title={
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-wide text-sky-500">Number Village</p>
              <h1 className="text-2xl font-black text-[#183B5B] sm:text-3xl">
                Count, listen, and find numbers 1 to 10.
              </h1>
            </div>
          }
          rightContent={
            <div className="rounded-full bg-white/90 px-4 py-3 text-base font-black text-sky-700 shadow-md">
              Question {questionIndex + 1} / {numberVillageQuestions.length}
            </div>
          }
        />

        <main className="mx-auto mt-8 rounded-[2rem] bg-white/90 p-5 text-center shadow-xl ring-1 ring-white sm:p-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="rounded-full bg-amber-100 px-5 py-2 text-lg font-black text-amber-700">
              Score {score}
            </div>
            <StarRating stars={getNumberVillageStars(score)} />
          </div>

          <section className="mt-6">
            <p className="text-2xl font-black text-[#183B5B]">{question.prompt}</p>
            <button
              type="button"
              onClick={handleListen}
              className="mx-auto mt-5 flex min-h-16 items-center justify-center gap-3 rounded-full bg-violet-100 px-8 py-4 text-xl font-black text-violet-700 shadow-md transition hover:bg-violet-200"
            >
              <Volume2 className="h-7 w-7" />
              Listen
            </button>

            <div className="mt-7 min-h-44">
              <QuestionVisual
                question={question}
                hasListened={hasListened}
                isSpeaking={isSpeaking}
                onListen={handleListen}
              />
            </div>
          </section>

          <section className="mx-auto mt-7 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
            {question.options.map((option) => {
              const isCorrect = selectedAnswer === option && feedback?.type === "correct";
              const isWrong = lastWrongAnswer === option && feedback?.type === "wrong";

              return (
                <motion.button
                  key={option}
                  type="button"
                  onClick={() => handleAnswer(option)}
                  disabled={canGoNext}
                  animate={
                    isCorrect
                      ? { scale: [1, 1.07, 1] }
                      : isWrong
                        ? { x: [0, -7, 7, -4, 4, 0] }
                        : {}
                  }
                  className={`min-h-20 rounded-[1.5rem] border-4 px-6 py-4 text-4xl font-black shadow-md transition disabled:cursor-default ${
                    isCorrect
                      ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                      : isWrong
                        ? "border-amber-300 bg-amber-100 text-amber-700"
                        : "border-sky-100 bg-sky-50 text-sky-700 hover:border-sky-300 hover:bg-sky-100"
                  }`}
                >
                  {option}
                </motion.button>
              );
            })}
          </section>

          <div className="mt-6 min-h-20">
            {feedback ? (
              <motion.div
                key={feedback.text}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`mx-auto flex max-w-xl items-center justify-center gap-3 rounded-[1.5rem] px-5 py-4 text-xl font-black shadow-sm ${
                  feedback.type === "correct"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {feedback.type === "correct" ? (
                  <CheckCircle2 className="h-7 w-7" />
                ) : (
                  <Headphones className="h-7 w-7" />
                )}
                {feedback.text}
              </motion.div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext}
            className="mt-2 min-h-14 min-w-44 rounded-full bg-[#2BADEE] px-8 py-3 text-xl font-black text-white shadow-lg shadow-sky-200 transition hover:bg-[#1E90D0] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          >
            {questionIndex === numberVillageQuestions.length - 1 ? "See Result" : "Next"}
          </button>
        </main>
      </div>
    </div>
  );
}
