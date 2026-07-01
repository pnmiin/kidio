import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Building2,
  Castle,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Play,
  RefreshCcw,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import { KidioPageHeader } from "../../components/KidioPageHeader";
import {
  buildQuestions,
  findQuestions,
  getBigNumberValue,
  getBigNumberWord,
  getOnesWord,
  getTensWord,
  onesOptions,
  patternExamples,
  tensOptions,
  type BigNumberQuestion,
} from "../data/bigNumberCityData";
import {
  getBigNumberCityStars,
  saveBigNumberCityResult,
} from "../utils/numberLandProgress";
import { speak, stopSpeech } from "../utils/speech";
import { submitGameProgress } from "../utils/gameProgress";

type CityScreen = "welcome" | "learn" | "build" | "find" | "complete";
type BuildPracticeQuestion = BigNumberQuestion & {
  tensChoices: number[];
  onesChoices: number[];
};
type FindPracticeQuestion = BigNumberQuestion & {
  choices: number[];
};

function speakCity(text: string) {
  speak(text, { rate: 0.75, pitch: 1.14 });
}

function getPatternSpeech(question: BigNumberQuestion) {
  return `${getTensWord(question.tens)} plus ${getOnesWord(question.ones)} makes ${getBigNumberWord(question.tens, question.ones)}. This is ${getBigNumberWord(question.tens, question.ones)}.`;
}

function getBigNumberWordFromValue(value: number) {
  const tens = Math.floor(value / 10) * 10;
  const ones = value % 10;
  return getBigNumberWord(tens, ones);
}

function shuffleArray<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

function generateTensChoices(correctTens: number) {
  const nearby = tensOptions
    .map((option) => option.value)
    .filter((value) => value !== correctTens)
    .sort((a, b) => Math.abs(a - correctTens) - Math.abs(b - correctTens));

  return shuffleArray([correctTens, ...nearby.slice(0, 2)]);
}

function generateOnesChoices(correctOnes: number) {
  const nearby = onesOptions
    .map((option) => option.value)
    .filter((value) => value !== correctOnes)
    .sort((a, b) => Math.abs(a - correctOnes) - Math.abs(b - correctOnes));

  return shuffleArray([correctOnes, ...nearby.slice(0, 2)]);
}

function generateNearbyChoices(correctNumber: number) {
  const tens = Math.floor(correctNumber / 10) * 10;
  const ones = correctNumber % 10;
  const reversed = ones * 10 + Math.floor(correctNumber / 10);
  const sameTens = tens + (ones <= 6 ? ones + 3 : ones - 3);
  const sameOnes = Math.max(20, Math.min(90, tens + (tens <= 50 ? 10 : -10))) + ones;
  const fallback = [
    correctNumber - 10,
    correctNumber + 10,
    correctNumber - 3,
    correctNumber + 3,
    21,
    35,
    48,
    76,
    89,
    99,
  ];

  const choices = new Set<number>([correctNumber]);
  [reversed, sameTens, sameOnes, ...fallback].forEach((choice) => {
    if (
      choices.size < 3 &&
      choice !== correctNumber &&
      choice >= 21 &&
      choice <= 99 &&
      choice % 10 !== 0
    ) {
      choices.add(choice);
    }
  });

  return shuffleArray(Array.from(choices));
}

function generateBuildPractice() {
  return buildQuestions.map((question) => ({
    ...question,
    tensChoices: generateTensChoices(question.tens),
    onesChoices: generateOnesChoices(question.ones),
  }));
}

function generateFindPractice() {
  return shuffleArray(findQuestions).map((question) => ({
    ...question,
    choices: generateNearbyChoices(getBigNumberValue(question.tens, question.ones)),
  }));
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

function CityProgress({ count, total }: { count: number; total: number }) {
  return (
    <div className="mx-auto mt-6 max-w-2xl rounded-[1.75rem] bg-rose-50 p-4">
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
        {Array.from({ length: total }, (_, index) => (
          <div
            key={index}
            className={`flex h-12 items-center justify-center rounded-2xl shadow-sm ${
              index < count ? "bg-rose-400 text-white" : "bg-white text-rose-200"
            }`}
          >
            <Building2 className="h-6 w-6" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BigNumberCityGame() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<CityScreen>("welcome");
  const [learnIndex, setLearnIndex] = useState(0);
  const [buildPractice, setBuildPractice] = useState<BuildPracticeQuestion[]>(() =>
    generateBuildPractice(),
  );
  const [findPractice, setFindPractice] = useState<FindPracticeQuestion[]>(() =>
    generateFindPractice(),
  );
  const [buildIndex, setBuildIndex] = useState(0);
  const [findIndex, setFindIndex] = useState(0);
  const [buildScore, setBuildScore] = useState(0);
  const [findScore, setFindScore] = useState(0);
  const [selectedTens, setSelectedTens] = useState<number | null>(null);
  const [selectedOnes, setSelectedOnes] = useState<number | null>(null);
  const [hasBuildMistake, setHasBuildMistake] = useState(false);
  const [hasFindMistake, setHasFindMistake] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isBuildCorrect, setIsBuildCorrect] = useState(false);
  const [wrongFindChoice, setWrongFindChoice] = useState<number | null>(null);
  const [correctFindChoice, setCorrectFindChoice] = useState<number | null>(null);
  const lastLearnSpeechRef = useRef<{ text: string; time: number } | null>(null);
  const lastAnswerSpeechRef = useRef<{ text: string; time: number } | null>(null);
  const startTime = useState<number>(() => Date.now())[0];

  const learnExample = patternExamples[learnIndex];
  const buildQuestion = buildPractice[buildIndex];
  const findQuestion = findPractice[findIndex];
  const findTarget = getBigNumberValue(findQuestion.tens, findQuestion.ones);
  const passed = findScore >= 7;
  const stars = useMemo(() => getBigNumberCityStars(findScore), [findScore]);

  const resetBuildChoiceState = () => {
    setSelectedTens(null);
    setSelectedOnes(null);
    setHasBuildMistake(false);
    setFeedback("");
    setIsBuildCorrect(false);
  };

  const resetFindChoiceState = () => {
    setHasFindMistake(false);
    setFeedback("");
    setWrongFindChoice(null);
    setCorrectFindChoice(null);
  };

  const speakLearnCardImmediately = (text: string) => {
    lastLearnSpeechRef.current = { text, time: Date.now() };
    speakCity(text);
  };

  const speakLearnCardIfNeeded = (text: string) => {
    const last = lastLearnSpeechRef.current;
    if (last?.text === text && Date.now() - last.time < 900) return;
    speakLearnCardImmediately(text);
  };

  const speakAnswerImmediately = (text: string) => {
    lastAnswerSpeechRef.current = { text, time: Date.now() };
    speakCity(text);
  };

  const speakAnswerIfNeeded = (text: string) => {
    const last = lastAnswerSpeechRef.current;
    if (last?.text === text && Date.now() - last.time < 900) return;
    speakAnswerImmediately(text);
  };

  const startBuildPractice = () => {
    stopSpeech();
    setBuildPractice(generateBuildPractice());
    setBuildIndex(0);
    setBuildScore(0);
    resetBuildChoiceState();
    setScreen("build");
  };

  const goToNextBuildQuestion = () => {
    stopSpeech();

    if (buildIndex === buildPractice.length - 1) {
      setFindPractice(generateFindPractice());
      setFindIndex(0);
      setFindScore(0);
      resetFindChoiceState();
      setScreen("find");
      return;
    }

    setBuildIndex((value) => value + 1);
    resetBuildChoiceState();
  };

  const evaluateBuildChoice = (nextTens: number | null, nextOnes: number | null) => {
    if (isBuildCorrect || nextTens === null || nextOnes === null) return;

    if (nextTens === buildQuestion.tens && nextOnes === buildQuestion.ones) {
      if (!hasBuildMistake) setBuildScore((value) => value + 1);
      setIsBuildCorrect(true);
      setFeedback(`Great job! ${nextTens} + ${nextOnes} = ${getBigNumberValue(nextTens, nextOnes)}`);
      speakCity(getBigNumberWord(nextTens, nextOnes));
      return;
    }

    setHasBuildMistake(true);
    setFeedback("Try again!");
  };

  const chooseTens = (choice: number) => {
    setSelectedTens(choice);
    evaluateBuildChoice(choice, selectedOnes);
  };

  const chooseOnes = (choice: number) => {
    setSelectedOnes(choice);
    evaluateBuildChoice(selectedTens, choice);
  };

  const checkFindAnswer = (choice: number) => {
    if (correctFindChoice !== null) return;

    if (choice === findTarget) {
      if (!hasFindMistake) setFindScore((value) => value + 1);
      setCorrectFindChoice(choice);
      setFeedback("Great job!");
      return;
    }

    setHasFindMistake(true);
    setWrongFindChoice(choice);
    setFeedback("Try again!");
  };

  const playAgain = () => {
    stopSpeech();
    setLearnIndex(0);
    setBuildPractice(generateBuildPractice());
    setFindPractice(generateFindPractice());
    setBuildIndex(0);
    setFindIndex(0);
    setBuildScore(0);
    setFindScore(0);
    resetBuildChoiceState();
    resetFindChoiceState();
    setScreen("welcome");
  };

  const goToNextFindQuestion = async () => {
    stopSpeech();

    if (findIndex === findPractice.length - 1) {
      saveBigNumberCityResult(findScore);

      const earnedStars = getBigNumberCityStars(findScore);
      const currentStars = parseInt(localStorage.getItem("currentKidStars") || "0");
      localStorage.setItem("currentKidStars", (currentStars + earnedStars).toString());

      const scorePercent = Math.round((findScore / findPractice.length) * 100);
      await submitGameProgress(scorePercent, startTime);

      setScreen("complete");
      return;
    }

    setFindIndex((value) => value + 1);
    resetFindChoiceState();
  };

  const renderChoiceButton = ({
    choice,
    selected,
    correct,
    wrong,
    speechText,
    onClick,
  }: {
    choice: number;
    selected?: boolean;
    correct?: boolean;
    wrong?: boolean;
    speechText?: string;
    onClick: () => void;
  }) => (
    <motion.button
      key={choice}
      type="button"
      onPointerDown={() => {
        if (speechText) speakAnswerImmediately(speechText);
      }}
      onClick={() => {
        if (speechText) speakAnswerIfNeeded(speechText);
        onClick();
      }}
      animate={
        correct
          ? { scale: [1, 1.08, 1] }
          : wrong
            ? { x: [0, -7, 7, -4, 4, 0] }
            : {}
      }
      className={`min-h-20 rounded-[1.75rem] border-4 px-5 py-4 text-4xl font-black shadow-md transition ${
        correct
          ? "border-emerald-300 bg-emerald-100 text-emerald-700"
          : wrong
            ? "border-amber-300 bg-amber-100 text-amber-700"
            : selected
              ? "border-rose-300 bg-rose-100 text-rose-700"
              : "border-rose-100 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100"
      }`}
    >
      {choice}
    </motion.button>
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#FFE6EE_0%,#F4F8FF_48%,#FFF4DB_100%)] px-4 py-5 text-slate-700 sm:px-7">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute left-[-52px] top-28 h-20 w-44 rounded-full bg-white/70" />
        <span className="absolute right-[-34px] top-40 h-16 w-40 rounded-full bg-white/65" />
        <span className="absolute bottom-28 left-[7%] h-10 w-10 rounded-full bg-rose-200/70" />
        <span className="absolute bottom-40 right-[8%] h-12 w-12 rounded-full bg-amber-200/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <KidioPageHeader
          backLabel="Back to Number Land"
          backTo="/number-land"
          title={
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-wide text-rose-500">
                Big Number City
              </p>
              <h1 className="text-2xl font-black text-[#183B5B] sm:text-3xl">
                Build Big Number City
              </h1>
            </div>
          }
          rightContent={
            screen === "find" ? (
              <div className="rounded-full bg-white/90 px-4 py-3 text-base font-black text-rose-700 shadow-md">
                {findIndex + 1} / {findPractice.length}
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
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-rose-100 text-rose-600 shadow-inner">
              <Castle className="h-16 w-16" />
            </div>
            <h2 className="mt-6 text-4xl font-black leading-tight text-[#183B5B]">
              Welcome to Big Number City!
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-xl font-bold text-slate-500">
              Let's build numbers from 21 to 99.
            </p>
            <p className="mt-3 text-lg font-black text-rose-600">
              Choose tens and ones to make big numbers.
            </p>
            <CityProgress count={0} total={10} />
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setScreen("learn")}
                className="inline-flex min-h-16 items-center justify-center gap-3 rounded-full bg-rose-500 px-8 py-4 text-xl font-black text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
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
            <p className="text-xl font-black text-rose-500">Learn the Pattern</p>
            <p className="mt-1 text-lg font-bold text-slate-500">
              Put numbers together.
            </p>
            <div className="relative my-7 overflow-hidden rounded-[2rem] bg-rose-50 px-4 py-8 shadow-inner">
              <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-2 w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-200/70 md:block" />
              <div className="relative z-10 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-5">
                <motion.button
                  type="button"
                  onPointerDown={() => speakLearnCardImmediately(getTensWord(learnExample.tens))}
                  onClick={() => speakLearnCardIfNeeded(getTensWord(learnExample.tens))}
                  key={`tens-${learnIndex}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24 }}
                  className="w-full max-w-44 cursor-pointer rounded-[1.75rem] border-4 border-sky-100 bg-white px-6 py-6 shadow-md transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
                  aria-label={`Hear ${getTensWord(learnExample.tens)}`}
                >
                  <p className="text-6xl font-black leading-none text-sky-600">
                    {learnExample.tens}
                  </p>
                  <p className="mt-3 text-xl font-black lowercase text-slate-500">
                    {getTensWord(learnExample.tens)}
                  </p>
                </motion.button>

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-5xl font-black leading-none text-rose-400 shadow-sm">
                  +
                </div>

                <motion.button
                  type="button"
                  onPointerDown={() => speakLearnCardImmediately(getOnesWord(learnExample.ones))}
                  onClick={() => speakLearnCardIfNeeded(getOnesWord(learnExample.ones))}
                  key={`ones-${learnIndex}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, delay: 0.08 }}
                  className="w-full max-w-44 cursor-pointer rounded-[1.75rem] border-4 border-amber-100 bg-white px-6 py-6 shadow-md transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg"
                  aria-label={`Hear ${getOnesWord(learnExample.ones)}`}
                >
                  <p className="text-6xl font-black leading-none text-amber-600">
                    {learnExample.ones}
                  </p>
                  <p className="mt-3 text-xl font-black lowercase text-slate-500">
                    {getOnesWord(learnExample.ones)}
                  </p>
                </motion.button>

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-5xl font-black leading-none text-rose-400 shadow-sm">
                  =
                </div>

                <motion.button
                  type="button"
                  onPointerDown={() =>
                    speakLearnCardImmediately(getBigNumberWord(learnExample.tens, learnExample.ones))
                  }
                  onClick={() =>
                    speakLearnCardIfNeeded(getBigNumberWord(learnExample.tens, learnExample.ones))
                  }
                  key={`result-${learnIndex}`}
                  initial={{ opacity: 0, scale: 0.86, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.18, type: "spring", stiffness: 220, damping: 14 }}
                  className="relative w-full max-w-56 cursor-pointer rounded-[2rem] border-4 border-rose-200 bg-white px-7 py-7 shadow-2xl shadow-rose-200/80 ring-8 ring-rose-100/80 transition hover:-translate-y-1 hover:shadow-rose-300/80"
                  aria-label={`Hear ${getBigNumberWord(learnExample.tens, learnExample.ones)}`}
                >
                  <Sparkles className="absolute -left-4 -top-4 h-9 w-9 fill-amber-300 text-amber-300" />
                  <Sparkles className="absolute -right-4 top-4 h-8 w-8 fill-rose-300 text-rose-300" />
                  <Star className="absolute -bottom-4 right-5 h-8 w-8 fill-amber-300 text-amber-300" />
                  <p className="text-7xl font-black leading-none text-rose-600 sm:text-8xl">
                    {getBigNumberValue(learnExample.tens, learnExample.ones)}
                  </p>
                  <p className="mt-3 text-2xl font-black lowercase text-rose-600">
                    {getBigNumberWord(learnExample.tens, learnExample.ones)}
                  </p>
                </motion.button>
              </div>

              <div className="relative z-10 mx-auto mt-7 max-w-xl rounded-[1.5rem] bg-white/80 px-5 py-4 text-xl font-black leading-snug text-[#183B5B] shadow-sm">
                <p>
                  {learnExample.tens} and {learnExample.ones} make{" "}
                  {getBigNumberValue(learnExample.tens, learnExample.ones)}.
                </p>
                <p className="mt-1 text-rose-600">
                  This is {getBigNumberWord(learnExample.tens, learnExample.ones)}.
                </p>
              </div>
            </div>
            <p className="text-lg font-black text-slate-500">
              {learnIndex + 1} / {patternExamples.length}
            </p>
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
              {learnIndex === patternExamples.length - 1 ? (
                <button
                  type="button"
                  onClick={startBuildPractice}
                  className="min-h-14 rounded-full bg-rose-500 px-8 py-3 text-xl font-black text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
                >
                  I'm Ready
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setLearnIndex((value) => Math.min(patternExamples.length - 1, value + 1))
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

        {screen === "build" ? (
          <motion.main
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-8 rounded-[2rem] bg-white/90 p-5 text-center shadow-xl ring-1 ring-white sm:p-8"
          >
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="rounded-full bg-rose-100 px-5 py-2 text-lg font-black text-rose-700">
                Build {buildIndex + 1} / {buildPractice.length}
              </div>
              <div className="rounded-full bg-amber-100 px-5 py-2 text-lg font-black text-amber-700">
                Score {buildScore}
              </div>
            </div>
            <CityProgress count={buildIndex} total={buildPractice.length} />
            <section className="mt-7">
              <p className="text-xl font-black text-rose-500">Build the Number</p>
              <p className="mt-4 text-3xl font-black text-[#183B5B]">
                Build number {getBigNumberWord(buildQuestion.tens, buildQuestion.ones)}.
              </p>
              <button
                type="button"
                onClick={() =>
                  speakCity(`Build number ${getBigNumberWord(buildQuestion.tens, buildQuestion.ones)}`)
                }
                className="mx-auto mt-5 flex min-h-14 items-center justify-center gap-2 rounded-full bg-rose-100 px-7 py-3 text-lg font-black text-rose-700 shadow-md transition hover:bg-rose-200"
              >
                <Headphones className="h-6 w-6" />
                Listen
              </button>
            </section>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <section className="rounded-[1.75rem] bg-rose-50 p-4">
                <p className="mb-4 text-xl font-black text-rose-700">Choose tens.</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-1">
                  {buildQuestion.tensChoices.map((choice) =>
                    renderChoiceButton({
                      choice,
                      selected: selectedTens === choice,
                      correct: isBuildCorrect && choice === buildQuestion.tens,
                      speechText: getTensWord(choice),
                      onClick: () => chooseTens(choice),
                    }),
                  )}
                </div>
              </section>
              <section className="rounded-[1.75rem] bg-amber-50 p-4">
                <p className="mb-4 text-xl font-black text-amber-700">Choose ones.</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-1">
                  {buildQuestion.onesChoices.map((choice) =>
                    renderChoiceButton({
                      choice,
                      selected: selectedOnes === choice,
                      correct: isBuildCorrect && choice === buildQuestion.ones,
                      speechText: getOnesWord(choice),
                      onClick: () => chooseOnes(choice),
                    }),
                  )}
                </div>
              </section>
            </div>
            <div className="mt-7 min-h-16">
              {feedback ? (
                <motion.div
                  key={feedback}
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`mx-auto flex max-w-md items-center justify-center gap-2 rounded-[1.5rem] px-5 py-4 text-2xl font-black shadow-sm ${
                    feedback.startsWith("Great")
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  <Sparkles className="h-7 w-7" />
                  {feedback}
                </motion.div>
              ) : null}
            </div>
            {isBuildCorrect ? (
              <button
                type="button"
                onClick={goToNextBuildQuestion}
                className="mt-2 min-h-14 min-w-44 rounded-full bg-rose-500 px-8 py-3 text-xl font-black text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
              >
                {buildIndex === buildPractice.length - 1 ? "Start Find Game" : "Next"}
              </button>
            ) : hasBuildMistake ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedTens(null);
                  setSelectedOnes(null);
                  setFeedback("");
                }}
                className="mt-2 min-h-14 min-w-44 rounded-full bg-amber-100 px-8 py-3 text-xl font-black text-amber-700 shadow-md transition hover:bg-amber-200"
              >
                Try Again
              </button>
            ) : null}
          </motion.main>
        ) : null}

        {screen === "find" ? (
          <motion.main
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-8 rounded-[2rem] bg-white/90 p-5 text-center shadow-xl ring-1 ring-white sm:p-8"
          >
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="rounded-full bg-amber-100 px-5 py-2 text-lg font-black text-amber-700">
                Score {findScore}
              </div>
              <StarRating stars={getBigNumberCityStars(findScore)} />
            </div>
            <CityProgress count={findIndex} total={findPractice.length} />
            <section className="mt-7">
              <p className="text-xl font-black text-rose-500">Find the Number</p>
              <p className="mt-4 text-3xl font-black text-[#183B5B]">
                Find number {getBigNumberWord(findQuestion.tens, findQuestion.ones)}.
              </p>
              <button
                type="button"
                onClick={() =>
                  speakCity(`Find number ${getBigNumberWord(findQuestion.tens, findQuestion.ones)}`)
                }
                className="mx-auto mt-5 flex min-h-14 items-center justify-center gap-2 rounded-full bg-rose-100 px-7 py-3 text-lg font-black text-rose-700 shadow-md transition hover:bg-rose-200"
              >
                <Headphones className="h-6 w-6" />
                Listen
              </button>
            </section>
            <section className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              {findQuestion.choices.map((choice) =>
                renderChoiceButton({
                  choice,
                  correct: correctFindChoice === choice,
                  wrong: wrongFindChoice === choice,
                  speechText: getBigNumberWordFromValue(choice),
                  onClick: () => checkFindAnswer(choice),
                }),
              )}
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
            {correctFindChoice !== null ? (
              <button
                type="button"
                onClick={goToNextFindQuestion}
                className="mt-2 min-h-14 min-w-44 rounded-full bg-rose-500 px-8 py-3 text-xl font-black text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
              >
                {findIndex === findPractice.length - 1 ? "See Result" : "Next"}
              </button>
            ) : hasFindMistake ? (
              <button
                type="button"
                onClick={() => {
                  setWrongFindChoice(null);
                  setFeedback("");
                }}
                className="mt-2 min-h-14 min-w-44 rounded-full bg-amber-100 px-8 py-3 text-xl font-black text-amber-700 shadow-md transition hover:bg-amber-200"
              >
                Try Again
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
              {passed ? <Trophy className="h-16 w-16" /> : <Castle className="h-16 w-16 text-rose-500" />}
            </div>
            <h2 className="mt-6 text-4xl font-black leading-tight text-[#183B5B]">
              {passed ? "Big Number City Completed!" : "Good try!"}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-xl font-bold text-slate-500">
              {passed ? "You built the whole city!" : "Let's build more big numbers."}
            </p>
            <p className="mt-4 text-2xl font-black text-rose-600">
              You got {findScore} / {findPractice.length} correct!
            </p>
            <div className="mt-5">
              <StarRating stars={stars} />
            </div>
            {passed ? (
              <p className="mx-auto mt-6 w-fit rounded-full bg-rose-100 px-6 py-3 text-xl font-black text-rose-700">
                Review Park unlocked!
              </p>
            ) : null}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={playAgain}
                className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-rose-500 px-7 py-3 text-lg font-black text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
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
