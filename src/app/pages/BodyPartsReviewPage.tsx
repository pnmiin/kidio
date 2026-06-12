import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Home,
  RotateCcw,
  Sparkles,
  Star,
  Volume2,
} from "lucide-react";
import { motion } from "motion/react";
import { KidioPageHeader } from "../../components/KidioPageHeader";
import { advanceJourney } from "../utils/journeyProgress";

const bodyPartsReview = [
  { id: "head", label: "Head", emoji: "👦" },
  { id: "hair", label: "Hair", emoji: "✨" },
  { id: "eyes", label: "Eyes", emoji: "👀" },
  { id: "ears", label: "Ears", emoji: "👂" },
  { id: "nose", label: "Nose", emoji: "👃" },
  { id: "mouth", label: "Mouth", emoji: "👄" },
  { id: "arms", label: "Arms", emoji: "💪" },
  { id: "hands", label: "Hands", emoji: "👐" },
  { id: "fingers", label: "Fingers", emoji: "☝️" },
  { id: "legs", label: "Legs", emoji: "🦵" },
  { id: "knees", label: "Knees", emoji: "🦵" },
  { id: "feet", label: "Feet", emoji: "🦶" },
] as const;

const bodyPartImageByLabel: Record<string, string> = {
  Head: "/assets/head.png",
  Hair: "/assets/hair.png",
  Eyes: "/assets/eyes.png",
  Ears: "/assets/ears.png",
  Nose: "/assets/nose.png",
  Mouth: "/assets/mouth.png",
  Arms: "/assets/arms.png",
  Hands: "/assets/hands.png",
  Fingers: "/assets/fingers.png",
  Legs: "/assets/legs.png",
  Knees: "/assets/knees.png",
  Feet: "/assets/feet.png",
};

const quizQuestions = [
  {
    question: "Which one is HEAD?",
    options: ["Head", "Hands", "Feet"],
    answer: "Head",
  },
  {
    question: "Which one is HAIR?",
    options: ["Mouth", "Hair", "Legs"],
    answer: "Hair",
  },
  {
    question: "Which one is EYES?",
    options: ["Eyes", "Ears", "Arms"],
    answer: "Eyes",
  },
  {
    question: "Which one is EARS?",
    options: ["Fingers", "Nose", "Ears"],
    answer: "Ears",
  },
  {
    question: "Which one is NOSE?",
    options: ["Eyes", "Nose", "Ears"],
    answer: "Nose",
  },
  {
    question: "Which one is MOUTH?",
    options: ["Mouth", "Hair", "Knees"],
    answer: "Mouth",
  },
  {
    question: "Which one is ARMS?",
    options: ["Feet", "Arms", "Eyes"],
    answer: "Arms",
  },
  {
    question: "Which one is HANDS?",
    options: ["Feet", "Mouth", "Hands"],
    answer: "Hands",
  },
  {
    question: "Which one is FINGERS?",
    options: ["Fingers", "Legs", "Head"],
    answer: "Fingers",
  },
  {
    question: "Which one is LEGS?",
    options: ["Nose", "Hands", "Legs"],
    answer: "Legs",
  },
  {
    question: "Which one is KNEES?",
    options: ["Hair", "Knees", "Mouth"],
    answer: "Knees",
  },
  {
    question: "Which one is FEET?",
    options: ["Arms", "Feet", "Ears"],
    answer: "Feet",
  },
] as const;

export function BodyPartsReviewPage() {
  const navigate = useNavigate();
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const hasLockedVoiceRef = useRef(false);
  const rewardSavedRef = useRef(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [quizMode, setQuizMode] = useState(
    () => new URLSearchParams(window.location.search).get("mode") === "quiz",
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const currentCard = bodyPartsReview[currentCardIndex];
  const quizQuestion = quizQuestions[currentQuestion];

  const speakWord = useCallback((word: string) => {
    try {
      if (!("speechSynthesis" in window)) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);

      if (!hasLockedVoiceRef.current) {
        const englishVoices = window.speechSynthesis
          .getVoices()
          .filter((voice) => voice.lang.toLowerCase().startsWith("en-us"));
        const preferredVoiceNames = [
          "microsoft jenny online",
          "microsoft aria online",
          "google us english",
          "samantha",
          "microsoft zira",
          "ava",
        ];

        voiceRef.current =
          preferredVoiceNames
            .map((name) =>
              englishVoices.find((voice) =>
                voice.name.toLowerCase().includes(name),
              ),
            )
            .find(Boolean) ??
          englishVoices[0] ??
          null;
        hasLockedVoiceRef.current = true;
      }

      utterance.lang = "en-US";
      utterance.voice = voiceRef.current;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Audio is optional; review remains usable without it.
    }
  }, []);

  const startQuiz = () => {
    setQuizMode(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  const handleNextCard = () => {
    if (currentCardIndex === bodyPartsReview.length - 1) {
      startQuiz();
      return;
    }
    setCurrentCardIndex((index) => index + 1);
  };

  const handleAnswer = (option: string) => {
    if (feedback === "correct") return;

    const isCorrect = option === quizQuestion.answer;
    setSelectedAnswer(option);
    setFeedback(isCorrect ? "correct" : "wrong");

    if (!isCorrect) return;

    setScore((value) => value + 1);
    window.setTimeout(() => {
      if (currentQuestion === quizQuestions.length - 1) {
        if (!rewardSavedRef.current) {
          const currentStars = Number(
            localStorage.getItem("currentKidStars") || "0",
          );
          localStorage.setItem("currentKidStars", String(currentStars + 3));
          advanceJourney("explorer", 6);
          rewardSavedRef.current = true;
        }
        setIsComplete(true);
        return;
      }

      setCurrentQuestion((question) => question + 1);
      setSelectedAnswer(null);
      setFeedback(null);
    }, 850);
  };

  const playAgain = () => {
    setCurrentCardIndex(0);
    setQuizMode(false);
    setCurrentQuestion(0);
    setScore(0);
    setIsComplete(false);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  if (isComplete) {
    return (
      <div className="app-sky-background min-h-screen px-4 py-8">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full rounded-[2rem] bg-white p-7 text-center shadow-xl sm:p-10"
          >
            <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-[#FFF2B8]">
              <Sparkles className="h-12 w-12 text-[#F4B400]" />
            </div>
            <h1 className="text-4xl font-black text-[#153B5B]">Amazing!</h1>
            <p className="mt-3 text-xl font-bold text-[#5F7790]">
              You reviewed Body Parts!
            </p>
            <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-2xl bg-[#FFF7D6] px-6 py-3 text-xl font-black text-[#B87800]">
              <Star className="h-6 w-6 fill-[#FFD447] text-[#E6A900]" />
              +3 Stars
            </div>
            <p className="mt-3 font-bold text-[#6C5CE7]">
              Quiz score: {score} / {quizQuestions.length}
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={playAgain}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#EEE8FF] px-5 py-4 text-lg font-black text-[#6C5CE7] transition hover:bg-[#E2D9FF]"
              >
                <RotateCcw className="h-5 w-5" />
                Play Again
              </button>
              <button
                type="button"
                onClick={() => navigate("/kid-dashboard")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2BADEE] px-5 py-4 text-lg font-black text-white shadow-lg transition hover:bg-[#1A9AD4]"
              >
                <Home className="h-5 w-5" />
                Back Home
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-sky-background min-h-screen overflow-x-hidden px-4 py-6">
      <div className="mx-auto max-w-3xl">
        <KidioPageHeader
          backLabel="Back"
          backTo="/adventure/body-parts"
          title={
            <div>
              <h1 className="text-2xl font-black text-[#153B5B] sm:text-3xl">
                Review Body Parts
              </h1>
              <p className="mt-1 font-bold text-[#5F7790]">
                Let&apos;s remember what we learned!
              </p>
            </div>
          }
        />

        {!quizMode ? (
          <main>
            <div className="mx-auto mb-4 flex max-w-xl items-center justify-between gap-3">
              <p className="text-lg font-black text-[#153B5B]">
                {currentCardIndex + 1} / {bodyPartsReview.length} cards
              </p>
              <button
                type="button"
                onClick={startQuiz}
                className="inline-flex items-center gap-2 rounded-full bg-[#6C5CE7] px-5 py-2.5 font-black text-white shadow-md transition hover:bg-[#5949D6]"
              >
                <Sparkles className="h-5 w-5" />
                Start Quiz
              </button>
            </div>

            <motion.div
              key={currentCard.id}
              initial={{ opacity: 0, x: 24, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              className="mx-auto flex min-h-[390px] max-w-xl flex-col items-center justify-center rounded-[2.25rem] bg-white p-7 text-center shadow-xl"
            >
              <div className="flex h-64 w-full items-center justify-center overflow-hidden rounded-3xl bg-[#F8FCFF] sm:h-72">
                <img
                  src={bodyPartImageByLabel[currentCard.label]}
                  alt={currentCard.label}
                  className="h-full w-full object-contain"
                />
              </div>
              <h2 className="mt-5 text-5xl font-black text-[#153B5B]">
                {currentCard.label}
              </h2>
              <button
                type="button"
                onClick={() => speakWord(currentCard.label)}
                className="mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD447] text-[#704E00] shadow-lg transition hover:scale-105"
                aria-label={`Hear ${currentCard.label}`}
              >
                <Volume2 className="h-8 w-8" />
              </button>
            </motion.div>

            <div className="mx-auto mt-6 grid max-w-xl grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() =>
                  setCurrentCardIndex((index) => Math.max(0, index - 1))
                }
                disabled={currentCardIndex === 0}
                className="inline-flex items-center justify-center gap-1 rounded-full bg-white px-3 py-3 font-black text-[#153B5B] shadow-md disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <button
                type="button"
                onClick={handleNextCard}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5BCB8A] px-3 py-3 font-black text-white shadow-md transition hover:bg-[#43B976]"
              >
                <Check className="h-5 w-5" />
                I know it!
              </button>
              <button
                type="button"
                onClick={handleNextCard}
                className="inline-flex items-center justify-center gap-1 rounded-full bg-[#2BADEE] px-3 py-3 font-black text-white shadow-md transition hover:bg-[#1A9AD4]"
              >
                <span className="hidden sm:inline">
                  {currentCardIndex === bodyPartsReview.length - 1
                    ? "Quiz"
                    : "Next"}
                </span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </main>
        ) : (
          <main className="mx-auto max-w-xl">
            <p className="mb-4 text-center text-lg font-black text-[#153B5B]">
              Quiz {currentQuestion + 1} / {quizQuestions.length}
            </p>
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2rem] bg-white p-6 text-center shadow-xl sm:p-9"
            >
              <h2 className="text-3xl font-black text-[#153B5B]">
                {quizQuestion.question}
              </h2>
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {quizQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = feedback === "correct" && isSelected;
                  const isWrong = feedback === "wrong" && isSelected;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleAnswer(option)}
                      className={`overflow-hidden rounded-2xl border-4 p-3 text-xl font-black transition ${
                        isCorrect
                          ? "border-[#5BCB8A] bg-[#E5FAEE] text-[#208552]"
                          : isWrong
                            ? "border-[#FF9B8F] bg-[#FFF0ED] text-[#C95E50]"
                            : "border-[#DDECF6] bg-[#F8FCFF] text-[#153B5B] hover:border-[#8DD8FA]"
                      }`}
                    >
                      <span className="flex h-32 items-center justify-center overflow-hidden rounded-xl bg-white sm:h-36">
                        <img
                          src={bodyPartImageByLabel[option]}
                          alt={option}
                          className="h-full w-full object-contain"
                        />
                      </span>
                      <span className="mt-3 block">{option}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 min-h-9">
                {feedback === "correct" && (
                  <p className="text-2xl font-black text-[#31A96B]">
                    Great job!
                  </p>
                )}
                {feedback === "wrong" && (
                  <p className="text-2xl font-black text-[#E07A5F]">
                    Try again!
                  </p>
                )}
              </div>
            </motion.div>
          </main>
        )}
      </div>
    </div>
  );
}
