import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Flag,
  Headphones,
  Mountain,
  Play,
  RefreshCcw,
  Sparkles,
  Star,
  Trophy,
  Volume2,
} from "lucide-react";
import { KidioPageHeader } from "../../components/KidioPageHeader";
import { getTensWord, tensNumbers, type TensNumber } from "../data/tensMountainData";
import {
  getTensMountainStars,
  saveTensMountainResult,
} from "../utils/numberLandProgress";
import { speak, stopSpeech } from "../utils/speech";

type TensScreen = "welcome" | "learn" | "game" | "complete";
type TensQuestion = {
  number: TensNumber;
  choices: number[];
};

function speakTens(text: string) {
  speak(text, { rate: 0.82, pitch: 1.22 });
}

function speakTappedNumber(value: number) {
  speak(getTensWord(value), { rate: 0.82, pitch: 1.24 });
}

function shuffleArray<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

function generateChoices(correctNumber: number) {
  const confusionMap: Record<number, number> = {
    30: 13,
    40: 14,
    50: 15,
    60: 16,
    70: 17,
    80: 18,
    90: 19,
  };
  const choices = new Set<number>([correctNumber]);
  const confusion = confusionMap[correctNumber];

  if (confusion) choices.add(confusion);

  const nearbyTens = tensNumbers
    .map((number) => number.value)
    .filter((value) => value !== correctNumber)
    .sort((a, b) => Math.abs(a - correctNumber) - Math.abs(b - correctNumber));

  for (const value of nearbyTens) {
    choices.add(value);
    if (choices.size === 3) break;
  }

  return shuffleArray(Array.from(choices).slice(0, 3));
}

function generateQuestions(values = tensNumbers.map((number) => number.value)) {
  return shuffleArray(values).map((value) => {
    const number = tensNumbers.find((item) => item.value === value)!;
    return {
      number,
      choices: generateChoices(value),
    };
  });
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

function MountainProgress({ steps }: { steps: number }) {
  return (
    <div className="mx-auto mt-7 max-w-2xl rounded-[1.75rem] bg-emerald-50 p-4">
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
        {Array.from({ length: 10 }, (_, index) => (
          <div
            key={index}
            className={`flex h-12 items-center justify-center rounded-2xl text-lg font-black shadow-sm ${
              index < steps
                ? "bg-emerald-400 text-white"
                : "bg-white text-emerald-200"
            }`}
          >
            {index < steps ? "★" : index + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TensMountainGame() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<TensScreen>("welcome");
  const [learnIndex, setLearnIndex] = useState(0);
  const [mainQuestions, setMainQuestions] = useState<TensQuestion[]>(() =>
    generateQuestions(),
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [hasTriedWrong, setHasTriedWrong] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [wrongChoice, setWrongChoice] = useState<number | null>(null);
  const [correctChoice, setCorrectChoice] = useState<number | null>(null);
  const lastSpokenChoiceRef = useRef<{ value: number; time: number } | null>(null);

  const learnNumber = tensNumbers[learnIndex];
  const mainQuestion = mainQuestions[questionIndex];
  const passed = score >= 7;
  const stars = useMemo(() => getTensMountainStars(score), [score]);

  const resetChoiceState = () => {
    setHasTriedWrong(false);
    setFeedback("");
    setWrongChoice(null);
    setCorrectChoice(null);
  };

  const speakChoiceImmediately = (choice: number) => {
    lastSpokenChoiceRef.current = { value: choice, time: Date.now() };
    speakTappedNumber(choice);
  };

  const speakChoiceIfNeeded = (choice: number) => {
    const last = lastSpokenChoiceRef.current;
    if (last?.value === choice && Date.now() - last.time < 900) return;
    speakChoiceImmediately(choice);
  };

  const startMainGame = () => {
    stopSpeech();
    setMainQuestions(generateQuestions());
    setQuestionIndex(0);
    setScore(0);
    resetChoiceState();
    setScreen("game");
  };

  const finishGame = () => {
    stopSpeech();
    saveTensMountainResult(score);
    setScreen("complete");
  };

  const checkMainAnswer = (choice: number) => {
    if (correctChoice !== null) return;

    if (choice === mainQuestion.number.value) {
      const earnedPoint = !hasTriedWrong;
      setScore((value) => value + (earnedPoint ? 1 : 0));
      setCorrectChoice(choice);
      setFeedback("Great job!");
      speakChoiceIfNeeded(choice);
      return;
    }

    setHasTriedWrong(true);
    setWrongChoice(choice);
    setFeedback("Try again!");
    speakChoiceIfNeeded(choice);
  };

  const goToNextMainQuestion = () => {
    stopSpeech();

    if (questionIndex === mainQuestions.length - 1) {
      saveTensMountainResult(score);
      setScreen("complete");
      return;
    }

    setQuestionIndex((value) => value + 1);
    resetChoiceState();
  };

  const playAgain = () => {
    stopSpeech();
    setLearnIndex(0);
    setScore(0);
    setMainQuestions(generateQuestions());
    setQuestionIndex(0);
    resetChoiceState();
    setScreen("welcome");
  };

  const renderAnswerChoices = (
    choices: number[],
    onAnswer: (choice: number) => void,
  ) => (
    <section className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
      {choices.map((choice) => {
        const isCorrect = correctChoice === choice;
        const isWrong = wrongChoice === choice;

        return (
          <motion.button
            key={choice}
            type="button"
            onPointerDown={() => speakChoiceImmediately(choice)}
            onClick={() => onAnswer(choice)}
            animate={
              isCorrect
                ? { scale: [1, 1.08, 1] }
                : isWrong
                  ? { x: [0, -7, 7, -4, 4, 0] }
                  : {}
            }
            className={`min-h-24 rounded-[1.75rem] border-4 px-6 py-5 text-5xl font-black shadow-md transition ${
              isCorrect
                ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                : isWrong
                  ? "border-amber-300 bg-amber-100 text-amber-700"
                  : "border-emerald-100 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100"
            }`}
          >
            {choice}
          </motion.button>
        );
      })}
    </section>
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#DDF8EE_0%,#EAF8FF_46%,#FFF2D8_100%)] px-4 py-5 text-slate-700 sm:px-7">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute left-[-52px] top-28 h-20 w-44 rounded-full bg-white/70" />
        <span className="absolute right-[-34px] top-40 h-16 w-40 rounded-full bg-white/65" />
        <span className="absolute bottom-28 left-[7%] h-10 w-10 rounded-full bg-emerald-200/70" />
        <span className="absolute bottom-40 right-[8%] h-12 w-12 rounded-full bg-amber-200/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <KidioPageHeader
          backLabel="Back to Number Land"
          backTo="/number-land"
          title={
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-wide text-emerald-500">
                Tens Mountain
              </p>
              <h1 className="text-2xl font-black text-[#183B5B] sm:text-3xl">
                Climb Tens Mountain
              </h1>
            </div>
          }
          rightContent={
            screen === "game" ? (
              <div className="rounded-full bg-white/90 px-4 py-3 text-base font-black text-emerald-700 shadow-md">
                {questionIndex + 1} / {mainQuestions.length}
              </div>
            ) : null
          }
        />

        {screen === "welcome" ? (
          <motion.main
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-10 rounded-[2rem] bg-white/90 p-7 text-center shadow-xl ring-1 ring-white sm:p-10"
          >
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-emerald-100 text-emerald-600 shadow-inner">
              <Mountain className="h-16 w-16" />
            </div>
            <h2 className="mt-6 text-4xl font-black leading-tight text-[#183B5B]">
              Welcome to Tens Mountain!
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-xl font-bold text-slate-500">
              Let's learn counting by tens.
            </p>
            <p className="mt-3 text-lg font-black text-emerald-600">
              Listen, tap, and climb to the top!
            </p>
            <MountainProgress steps={0} />
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setScreen("learn")}
                className="inline-flex min-h-16 items-center justify-center gap-3 rounded-full bg-emerald-500 px-8 py-4 text-xl font-black text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-600"
              >
                <Play className="h-7 w-7 fill-white" />
                Start Learning
              </button>
              <button
                type="button"
                onClick={() => navigate("/number-land")}
                className="inline-flex min-h-16 items-center justify-center gap-3 rounded-full bg-amber-100 px-8 py-4 text-xl font-black text-amber-700 shadow-md transition hover:bg-amber-200"
              >
                <ArrowLeft className="h-7 w-7" />
                Back to Number Land
              </button>
            </div>
          </motion.main>
        ) : null}

        {screen === "learn" ? (
          <motion.main
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-8 rounded-[2rem] bg-white/90 p-6 text-center shadow-xl ring-1 ring-white sm:p-9"
          >
            <p className="text-xl font-black text-emerald-500">Listen & Learn</p>
            <p className="mt-1 text-lg font-bold text-slate-500">Listen to each number.</p>
            <div className="my-6 text-[6rem] font-black leading-none text-emerald-600 sm:text-[9rem]">
              {learnNumber.value}
            </div>
            <h2 className="text-4xl font-black capitalize text-[#183B5B]">
              {learnNumber.word}
            </h2>
            <p className="mt-4 text-lg font-black text-slate-500">
              {learnIndex + 1} / {tensNumbers.length}
            </p>
            <button
              type="button"
              onClick={() => speakTens(learnNumber.word)}
              className="mx-auto mt-6 flex min-h-16 items-center justify-center gap-3 rounded-full bg-emerald-100 px-8 py-4 text-xl font-black text-emerald-700 shadow-md transition hover:bg-emerald-200"
            >
              <Volume2 className="h-7 w-7" />
              Listen
            </button>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setLearnIndex((value) => Math.max(0, value - 1))}
                disabled={learnIndex === 0}
                className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-slate-100 px-6 py-3 text-lg font-black text-slate-600 shadow-sm transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-6 w-6" />
                Previous
              </button>
              {learnIndex === tensNumbers.length - 1 ? (
                <button
                  type="button"
                  onClick={startMainGame}
                  className="min-h-14 rounded-full bg-emerald-500 px-8 py-3 text-xl font-black text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-600"
                >
                  I'm Ready
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setLearnIndex((value) => Math.min(tensNumbers.length - 1, value + 1))
                  }
                  className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-sky-100 px-6 py-3 text-lg font-black text-sky-700 shadow-sm transition hover:bg-sky-200"
                >
                  Next
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>
          </motion.main>
        ) : null}

        {screen === "game" ? (
          <motion.main
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-8 rounded-[2rem] bg-white/90 p-5 text-center shadow-xl ring-1 ring-white sm:p-8"
          >
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="rounded-full bg-amber-100 px-5 py-2 text-lg font-black text-amber-700">
                Score {score}
              </div>
              <StarRating stars={getTensMountainStars(score)} />
            </div>
            <MountainProgress steps={questionIndex} />
            <section className="mt-7">
              <p className="text-xl font-black text-emerald-500">Climb Tens Mountain</p>
              <p className="mt-4 text-3xl font-black text-[#183B5B]">
                Find number {mainQuestion.number.word}.
              </p>
              <button
                type="button"
                onClick={() => speakTens(`Find number ${mainQuestion.number.word}`)}
                className="mx-auto mt-5 flex min-h-14 items-center justify-center gap-2 rounded-full bg-emerald-100 px-7 py-3 text-lg font-black text-emerald-700 shadow-md transition hover:bg-emerald-200"
              >
                <Headphones className="h-6 w-6" />
                Listen
              </button>
            </section>
            {renderAnswerChoices(mainQuestion.choices, checkMainAnswer)}
            <div className="mt-7 min-h-16">
              {feedback ? (
                <motion.div
                  key={feedback}
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`mx-auto flex max-w-md items-center justify-center gap-2 rounded-[1.5rem] px-5 py-4 text-2xl font-black shadow-sm ${
                    feedback === "Great job!"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  <Sparkles className="h-7 w-7" />
                  {feedback}
                </motion.div>
              ) : null}
            </div>
            {correctChoice !== null ? (
              <button
                type="button"
                onClick={goToNextMainQuestion}
                className="mt-2 min-h-14 min-w-40 rounded-full bg-emerald-500 px-8 py-3 text-xl font-black text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-600"
              >
                {questionIndex === mainQuestions.length - 1 ? "See Result" : "Next"}
              </button>
            ) : null}
          </motion.main>
        ) : null}

        {screen === "complete" ? (
          <motion.main
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mx-auto mt-10 rounded-[2rem] bg-white/90 p-7 text-center shadow-xl ring-1 ring-white sm:p-10"
          >
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-amber-100 text-amber-500 shadow-inner">
              {passed ? <Trophy className="h-16 w-16" /> : <Flag className="h-16 w-16 text-emerald-500" />}
            </div>
            <h2 className="mt-6 text-4xl font-black leading-tight text-[#183B5B]">
              {passed ? "Tens Mountain Completed!" : "Good try!"}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-xl font-bold text-slate-500">
              {passed
                ? "You climbed to the top!"
                : "Let's practice counting by tens again."}
            </p>
            <p className="mt-4 text-2xl font-black text-emerald-600">
              You got {score} / {mainQuestions.length} correct!
            </p>
            <div className="mt-5">
              <StarRating stars={stars} />
            </div>
            {passed ? (
              <p className="mx-auto mt-6 w-fit rounded-full bg-emerald-100 px-6 py-3 text-xl font-black text-emerald-700">
                Big Number City unlocked!
              </p>
            ) : null}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={playAgain}
                className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-emerald-500 px-7 py-3 text-lg font-black text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-600"
              >
                <RefreshCcw className="h-6 w-6" />
                {passed ? "Play Again" : "Practice Again"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/number-land")}
                className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-amber-100 px-7 py-3 text-lg font-black text-amber-700 shadow-md transition hover:bg-amber-200"
              >
                <ArrowLeft className="h-6 w-6" />
                Back to Number Land
              </button>
            </div>
          </motion.main>
        ) : null}
      </div>
    </div>
  );
}
