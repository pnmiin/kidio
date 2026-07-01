import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Building2,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Play,
  RefreshCcw,
  Sparkles,
  Star,
  Trophy,
  Volume2,
} from "lucide-react";
import { KidioPageHeader } from "../../components/KidioPageHeader";
import { getTeenWord, teenTownNumbers, type TeenNumber } from "../data/teenTownData";
import {
  getTeenTownStars,
  saveTeenTownResult,
} from "../utils/numberLandProgress";
import { speak, stopSpeech } from "../utils/speech";
import { submitGameProgress } from "../utils/gameProgress";

type TeenTownStep = "welcome" | "learn" | "game" | "complete";
type TeenQuestion = {
  number: TeenNumber;
  choices: number[];
};

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function makeTeenQuestions(): TeenQuestion[] {
  return shuffle(teenTownNumbers).map((number) => {
    const distractors = shuffle(
      teenTownNumbers
        .map((item) => item.value)
        .filter((value) => value !== number.value),
    ).slice(0, 2);

    return {
      number,
      choices: shuffle([number.value, ...distractors]),
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

export function TeenTownGame() {
  const navigate = useNavigate();
  const [step, setStep] = useState<TeenTownStep>("welcome");
  const [learnIndex, setLearnIndex] = useState(0);
  const [questions, setQuestions] = useState<TeenQuestion[]>(() => makeTeenQuestions());
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [wrongChoice, setWrongChoice] = useState<number | null>(null);
  const [correctChoice, setCorrectChoice] = useState<number | null>(null);

  const learnNumber = teenTownNumbers[learnIndex];
  const question = questions[questionIndex];
  const passed = score >= 7;
  const stars = useMemo(() => getTeenTownStars(score), [score]);

  const startGame = () => {
    stopSpeech();
    setQuestions(makeTeenQuestions());
    setQuestionIndex(0);
    setScore(0);
    setFeedback("");
    setWrongChoice(null);
    setCorrectChoice(null);
    setStep("game");
  };

  const startTime = useState<number>(() => Date.now())[0];

  const finishGame = async () => {
    stopSpeech();
    saveTeenTownResult(score);

    const earnedStars = getTeenTownStars(score);
    const currentStars = parseInt(localStorage.getItem("currentKidStars") || "0");
    localStorage.setItem("currentKidStars", (currentStars + earnedStars).toString());

    const scorePercent = Math.round((score / questions.length) * 100);
    await submitGameProgress(scorePercent, startTime);

    setStep("complete");
  };

  const checkAnswer = (choice: number) => {
    if (correctChoice !== null) return;

    if (choice === question.number.value) {
      const nextScore = score + 1;
      setScore(nextScore);
      setCorrectChoice(choice);
      setFeedback("Great job!");
      speak(`${getTeenWord(choice)}. Great job!`);
      return;
    }

    setWrongChoice(choice);
    setFeedback("Try again!");
    speak(`${getTeenWord(choice)}. Try again!`);
  };

  const goToNextQuestion = () => {
    stopSpeech();
    if (questionIndex === questions.length - 1) {
      finishGame();
      return;
    }

    setQuestionIndex((value) => value + 1);
    setFeedback("");
    setWrongChoice(null);
    setCorrectChoice(null);
  };

  const playAgain = () => {
    stopSpeech();
    setLearnIndex(0);
    setQuestions(makeTeenQuestions());
    setQuestionIndex(0);
    setScore(0);
    setFeedback("");
    setWrongChoice(null);
    setCorrectChoice(null);
    setStep("welcome");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#EEE7FF_0%,#E1F6FF_46%,#FFF2D8_100%)] px-4 py-5 text-slate-700 sm:px-7">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute left-[-52px] top-28 h-20 w-44 rounded-full bg-white/70" />
        <span className="absolute right-[-34px] top-40 h-16 w-40 rounded-full bg-white/65" />
        <span className="absolute bottom-28 left-[7%] h-10 w-10 rounded-full bg-violet-200/70" />
        <span className="absolute bottom-40 right-[8%] h-12 w-12 rounded-full bg-amber-200/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <KidioPageHeader
          backLabel="Back to Number Land"
          backTo="/number-land"
          title={
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-wide text-violet-500">Teen Town</p>
              <h1 className="text-2xl font-black text-[#183B5B] sm:text-3xl">
                Numbers 11-20
              </h1>
            </div>
          }
          rightContent={
            step === "game" ? (
              <div className="rounded-full bg-white/90 px-4 py-3 text-base font-black text-violet-700 shadow-md">
                Question {questionIndex + 1} / {questions.length}
              </div>
            ) : null
          }
        />

        {step === "welcome" ? (
          <motion.main
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-10 rounded-[2rem] bg-white/90 p-7 text-center shadow-xl ring-1 ring-white sm:p-10"
          >
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-violet-100 text-violet-600 shadow-inner">
              <Building2 className="h-16 w-16" />
            </div>
            <h2 className="mt-6 text-4xl font-black leading-tight text-[#183B5B]">
              Welcome to Teen Town!
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-xl font-bold text-slate-500">
              Let's learn numbers 11 to 20.
            </p>
            <button
              type="button"
              onClick={() => setStep("learn")}
              className="mt-8 inline-flex min-h-16 min-w-56 items-center justify-center gap-3 rounded-full bg-violet-500 px-8 py-4 text-xl font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-600"
            >
              <Play className="h-7 w-7 fill-white" />
              Start Learning
            </button>
          </motion.main>
        ) : null}

        {step === "learn" ? (
          <motion.main
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-8 rounded-[2rem] bg-white/90 p-6 text-center shadow-xl ring-1 ring-white sm:p-9"
          >
            <p className="text-xl font-black text-violet-500">Listen & Learn</p>
            <div className="my-6 text-[7rem] font-black leading-none text-violet-600 sm:text-[10rem]">
              {learnNumber.value}
            </div>
            <h2 className="text-4xl font-black capitalize text-[#183B5B]">
              {learnNumber.word}
            </h2>
            <button
              type="button"
              onClick={() => speak(learnNumber.word)}
              className="mx-auto mt-7 flex min-h-16 items-center justify-center gap-3 rounded-full bg-violet-100 px-8 py-4 text-xl font-black text-violet-700 shadow-md transition hover:bg-violet-200"
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
              <button
                type="button"
                onClick={() =>
                  setLearnIndex((value) =>
                    Math.min(teenTownNumbers.length - 1, value + 1),
                  )
                }
                disabled={learnIndex === teenTownNumbers.length - 1}
                className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-sky-100 px-6 py-3 text-lg font-black text-sky-700 shadow-sm transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-6 w-6" />
              </button>
              {learnIndex === teenTownNumbers.length - 1 ? (
                <button
                  type="button"
                  onClick={startGame}
                  className="min-h-14 rounded-full bg-violet-500 px-8 py-3 text-xl font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-600"
                >
                  I'm Ready
                </button>
              ) : null}
            </div>
          </motion.main>
        ) : null}

        {step === "game" ? (
          <motion.main
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-8 rounded-[2rem] bg-white/90 p-5 text-center shadow-xl ring-1 ring-white sm:p-8"
          >
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="rounded-full bg-amber-100 px-5 py-2 text-lg font-black text-amber-700">
                Score {score}
              </div>
              <StarRating stars={getTeenTownStars(score)} />
            </div>

            <section className="mt-7">
              <p className="text-3xl font-black text-[#183B5B]">
                Find number {question.number.word}
              </p>
              <button
                type="button"
                onClick={() => speak(`Find number ${question.number.word}`)}
                className="mx-auto mt-5 flex min-h-14 items-center justify-center gap-2 rounded-full bg-violet-100 px-7 py-3 text-lg font-black text-violet-700 shadow-md transition hover:bg-violet-200"
              >
                <Headphones className="h-6 w-6" />
                Listen
              </button>
            </section>

            <section className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              {question.choices.map((choice) => {
                const isCorrect = correctChoice === choice;
                const isWrong = wrongChoice === choice;

                return (
                  <motion.button
                    key={choice}
                    type="button"
                    onClick={() => checkAnswer(choice)}
                    animate={
                      isCorrect
                        ? { scale: [1, 1.08, 1] }
                        : isWrong
                          ? { x: [0, -7, 7, -4, 4, 0] }
                          : {}
                    }
                    className={`min-h-28 rounded-[1.75rem] border-4 px-6 py-5 text-5xl font-black shadow-md transition ${
                      isCorrect
                        ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                        : isWrong
                          ? "border-amber-300 bg-amber-100 text-amber-700"
                          : "border-violet-100 bg-violet-50 text-violet-700 hover:border-violet-300 hover:bg-violet-100"
                    }`}
                  >
                    {choice}
                  </motion.button>
                );
              })}
            </section>

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
                onClick={goToNextQuestion}
                className="mt-2 min-h-14 min-w-40 rounded-full bg-violet-500 px-8 py-3 text-xl font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-600"
              >
                {questionIndex === questions.length - 1 ? "See Result" : "Next"}
              </button>
            ) : null}
          </motion.main>
        ) : null}

        {step === "complete" ? (
          <motion.main
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mx-auto mt-10 rounded-[2rem] bg-white/90 p-7 text-center shadow-xl ring-1 ring-white sm:p-10"
          >
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-amber-100 text-amber-500 shadow-inner">
              <Trophy className="h-16 w-16" />
            </div>
            <h2 className="mt-6 text-4xl font-black leading-tight text-[#183B5B]">
              {passed ? "Teen Town Completed!" : "Good try! Let's practice again."}
            </h2>
            <p className="mt-4 text-2xl font-black text-violet-600">
              You found {score} / {questions.length} numbers!
            </p>
            <div className="mt-5">
              <StarRating stars={stars} />
            </div>
            {passed ? (
              <p className="mx-auto mt-6 w-fit rounded-full bg-emerald-100 px-6 py-3 text-xl font-black text-emerald-700">
                Tens Mountain unlocked!
              </p>
            ) : null}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={playAgain}
                className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-violet-500 px-7 py-3 text-lg font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-600"
              >
                <RefreshCcw className="h-6 w-6" />
                Play Again
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
