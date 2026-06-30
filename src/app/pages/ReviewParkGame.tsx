import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  FerrisWheel,
  Gift,
  Headphones,
  PartyPopper,
  Play,
  RefreshCcw,
  Sparkles,
  Star,
  Ticket,
} from "lucide-react";
import { KidioPageHeader } from "../../components/KidioPageHeader";
import {
  generateReviewQuestions,
  getReviewInstruction,
  type ReviewMiniGameType,
  type ReviewQuestion,
} from "../data/reviewParkData";
import { saveReviewParkResult } from "../utils/numberLandProgress";
import { speak, stopSpeech } from "../utils/speech";

type GameScreen = "start" | "play" | "end";
type AnswerStatus = "idle" | "correct" | "wrong";

function speakReview(text: string) {
  speak(text, { rate: 0.75, pitch: 1.14 });
}

function getMiniGameTitle(type: ReviewMiniGameType) {
  if (type === "balloon") return "Balloon Pop";
  if (type === "ferris") return "Ferris Wheel Seat";
  if (type === "ticket") return "Ticket Gate";
  return "Prize Box";
}

function getMiniGameHeader(type: ReviewMiniGameType) {
  if (type === "balloon") return "🎈 Balloon Pop";
  if (type === "ferris") return "🎡 Ferris Wheel";
  if (type === "ticket") return "🎟️ Ticket Gate";
  return "🎁 Prize Box";
}

function getMiniGameInstruction(type: ReviewMiniGameType) {
  if (type === "balloon") return "Listen to the number. Tap the right balloon.";
  if (type === "ferris") return "Listen to the number. Tap the right seat.";
  if (type === "ticket") return "Listen to the number. Pick the right ticket.";
  return "Listen to the number. Open the right box.";
}

function getChoiceClasses(type: ReviewMiniGameType, status: AnswerStatus, selected: boolean) {
  const base = "relative flex items-center justify-center font-black shadow-md transition hover:scale-105";
  const state =
    status === "correct" && selected
      ? "animate-[stampPop_.36s_ease-out] border-emerald-300 bg-emerald-100 text-emerald-700 shadow-emerald-100"
      : status === "wrong" && selected
        ? "animate-[shakeGentle_.36s_ease-in-out] border-amber-300 bg-amber-100 text-amber-700 shadow-amber-100"
        : "text-[#183B5B] hover:-translate-y-1";

  if (type === "balloon") {
    return `review-park-balloon ${base} h-32 w-28 animate-[float_3.2s_ease-in-out_infinite] rounded-[999px_999px_860px_860px] border-4 text-4xl after:absolute after:-bottom-3 after:left-1/2 after:h-4 after:w-4 after:-translate-x-1/2 after:rotate-45 after:bg-inherit sm:h-40 sm:w-32 ${state}`;
  }

  if (type === "ferris") {
    return `review-park-ferris-cabin ${base} h-20 w-24 rounded-[1.25rem] border-4 border-sky-200 bg-sky-100 text-3xl hover:border-sky-300 hover:bg-sky-200 ${state}`;
  }

  if (type === "ticket") {
    return `review-park-ticket-choice ${base} min-h-24 rounded-[1.25rem] border-4 border-dashed border-amber-300 bg-amber-50 px-5 text-4xl hover:border-amber-400 hover:bg-amber-100 before:absolute before:-left-3 before:top-1/2 before:h-7 before:w-7 before:-translate-y-1/2 before:rounded-full before:bg-white after:absolute after:-right-3 after:top-1/2 after:h-7 after:w-7 after:-translate-y-1/2 after:rounded-full after:bg-white ${state}`;
  }

  return `review-park-prize-box ${base} min-h-32 rounded-[1.5rem] border-4 border-violet-200 bg-violet-100 text-4xl hover:border-violet-300 hover:bg-violet-200 ${state}`;
}

function PassportStamps({ stamps, compact = false }: { stamps: number; compact?: boolean }) {
  return (
    <div
      className={`review-park-passport mx-auto mt-5 max-w-3xl rotate-[-1deg] rounded-[1.75rem] border-4 border-amber-200 bg-[linear-gradient(135deg,#FFF8E8_0%,#FFFFFF_54%,#FFE9F3_100%)] p-4 shadow-xl shadow-amber-100/70 ${
        compact ? "max-w-xl p-3" : "sm:p-5"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3 text-base font-black text-[#183B5B]">
        <span>Number Passport</span>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
          {stamps} / 10 stamps
        </span>
      </div>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
        {Array.from({ length: 10 }, (_, index) => (
          <div
            key={index}
            className={`review-park-stamp-slot flex ${compact ? "h-8" : "h-12"} items-center justify-center rounded-full border-2 text-lg font-black transition hover:scale-105 ${
              index < stamps
                ? "animate-[stampPop_.32s_ease-out] border-amber-300 bg-amber-100 text-amber-600"
                : "border-dashed border-amber-200 bg-white text-amber-200"
            }`}
          >
            {index < stamps ? <Star className={`${compact ? "h-4 w-4" : "h-6 w-6"} fill-amber-300 text-amber-300`} /> : compact ? "" : index + 1}
          </div>
        ))}
      </div>
      {!compact ? (
        <p className="mt-3 text-sm font-black text-slate-500">
          Complete all stops to finish Review Park!
        </p>
      ) : null}
    </div>
  );
}

function ParkGateHero() {
  return (
    <section className="review-park-gate relative mx-auto min-h-[17rem] max-w-3xl overflow-hidden rounded-[2.25rem] border-4 border-white bg-[linear-gradient(180deg,#CFF2FF_0%,#FFF5CC_72%,#BDEFCF_100%)] px-5 pt-6 shadow-2xl shadow-amber-100">
      <div className="absolute left-8 top-8 h-12 w-28 rounded-full bg-white/80" />
      <div className="absolute right-8 top-12 h-10 w-24 rounded-full bg-white/75" />
      <div className="absolute left-10 top-28 h-16 w-12 animate-[float_3.2s_ease-in-out_infinite] rounded-full bg-pink-300 shadow-md" />
      <div className="absolute left-14 top-[10.5rem] h-12 w-1 bg-pink-200" />
      <div className="absolute right-14 top-24 h-14 w-11 animate-[float_3.6s_ease-in-out_infinite] rounded-full bg-sky-300 shadow-md" />
      <div className="absolute right-[4.2rem] top-[9.2rem] h-12 w-1 bg-sky-200" />
      <span className="absolute left-[18%] top-16 animate-[twinkle_2.4s_ease-in-out_infinite] text-3xl font-black text-amber-300">*</span>
      <span className="absolute right-[24%] top-20 animate-[twinkle_2.8s_ease-in-out_infinite] text-3xl font-black text-pink-300">*</span>
      <div className="mx-auto flex max-w-xl justify-center gap-1">
        {["bg-pink-300", "bg-amber-300", "bg-sky-300", "bg-emerald-300", "bg-violet-300"].map((color, index) => (
          <span key={index} className={`h-9 w-12 rounded-b-full ${color}`} />
        ))}
      </div>
      <div className="relative mx-auto mt-1 max-w-xl">
        <div className="absolute left-0 top-12 h-36 w-16 rounded-t-[2rem] bg-amber-300 shadow-lg" />
        <div className="absolute right-0 top-12 h-36 w-16 rounded-t-[2rem] bg-amber-300 shadow-lg" />
        <div className="mx-auto h-24 max-w-md rounded-t-[4rem] border-8 border-amber-300 bg-white shadow-lg" />
        <div className="mx-auto -mt-12 flex h-24 max-w-sm items-center justify-center rounded-[2rem] border-4 border-pink-200 bg-white px-6 shadow-xl">
          <h2 className="text-4xl font-black text-[#183B5B] sm:text-5xl">Review Park</h2>
        </div>
        <div className="mx-auto mt-4 h-20 max-w-xs rounded-t-[5rem] border-[14px] border-rose-300 border-b-0 bg-white/35" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-emerald-200/70" />
    </section>
  );
}

function MascotHelper() {
  return (
    <section className="flex items-center justify-center gap-4 rounded-[2rem] bg-white/85 p-5 shadow-lg">
      <div className="review-park-mascot flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-pink-100 text-5xl shadow-inner">
        🐻
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.18, type: "spring", stiffness: 220 }}
        className="review-park-speech-bubble relative rounded-[1.5rem] bg-sky-100 px-5 py-4 text-left text-xl font-black text-[#183B5B] shadow-sm before:absolute before:-left-3 before:top-8 before:h-6 before:w-6 before:rotate-45 before:bg-sky-100"
      >
        Let's get 10 stamps!
      </motion.div>
    </section>
  );
}

function ReviewSteps() {
  const steps = [
    { icon: "🎧", title: "Listen", text: "Hear the number" },
    { icon: "👆", title: "Tap", text: "Pick the number" },
    { icon: "⭐", title: "Stamp", text: "Collect 10 stamps" },
  ];

  return (
    <section className="review-park-steps mt-5 grid gap-3 sm:grid-cols-3">
      {steps.map((step) => (
        <div
          key={step.title}
          className="review-park-step-card rounded-[1.5rem] border-4 border-white bg-white/90 p-4 text-center shadow-lg"
        >
          <div className="text-4xl">{step.icon}</div>
          <h3 className="mt-1 text-xl font-black text-[#183B5B]">{step.title}</h3>
          <p className="text-sm font-black text-slate-500">{step.text}</p>
        </div>
      ))}
    </section>
  );
}

function AttractionPreviews() {
  const attractions = [
    { title: "Balloon Pop", text: "Pop the right number!", icon: "🎈", color: "bg-pink-100 text-pink-700" },
    { title: "Ticket Gate", text: "Pick the ticket!", icon: "🎟️", color: "bg-amber-100 text-amber-700" },
    { title: "Ferris Wheel", text: "Choose a seat!", icon: "🎡", color: "bg-sky-100 text-sky-700" },
    { title: "Prize Box", text: "Open the box!", icon: "🎁", color: "bg-violet-100 text-violet-700" },
  ];

  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {attractions.map((attraction) => (
        <div
          key={attraction.title}
          className={`review-park-attraction-card rounded-[1.5rem] border-4 border-white p-4 text-center shadow-lg transition hover:-translate-y-1 ${attraction.color}`}
        >
          <div className="text-4xl">{attraction.icon}</div>
          <h3 className="mt-2 text-lg font-black text-[#183B5B]">{attraction.title}</h3>
          <p className="mt-1 text-sm font-black opacity-80">{attraction.text}</p>
        </div>
      ))}
    </section>
  );
}

function ReviewParkScene({
  question,
  selectedAnswer,
  answerStatus,
  onSelect,
}: {
  question: ReviewQuestion;
  selectedAnswer: number | null;
  answerStatus: AnswerStatus;
  onSelect: (choice: number) => void;
}) {
  const solved = answerStatus === "correct";
  const sceneBase =
    "mt-6 min-h-[18rem] overflow-hidden rounded-[2rem] border-4 border-white p-4 shadow-inner sm:min-h-[21rem] sm:p-5";

  return (
    <section>
      {question.miniGameType === "balloon" ? (
        <div className={`review-park-balloon-scene ${sceneBase} bg-[linear-gradient(180deg,#DFF6FF_0%,#FFF4FB_100%)]`}>
          <div className="pointer-events-none absolute h-0 w-0" />
          <div className="mx-auto grid max-w-4xl grid-cols-2 items-end gap-x-5 gap-y-10 pt-6 sm:grid-cols-4">
            {question.choices.map((choice, index) => (
              <ChoiceButton
                key={choice}
                choice={choice}
                question={question}
                selected={selectedAnswer === choice}
                answerStatus={answerStatus}
                onSelect={onSelect}
                extraClass={[
                  "mx-auto",
                  index === 0 ? "translate-y-5 bg-pink-100 border-pink-200 before:bg-pink-200" : "",
                  index === 1 ? "-translate-y-3 bg-sky-100 border-sky-200 before:bg-sky-200" : "",
                  index === 2 ? "translate-y-1 bg-amber-100 border-amber-200 before:bg-amber-200" : "",
                  index === 3 ? "-translate-y-1 bg-violet-100 border-violet-200 before:bg-violet-200" : "",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      ) : null}

      {question.miniGameType === "ticket" ? (
        <div className={`review-park-ticket-scene ${sceneBase} bg-[linear-gradient(180deg,#FFF1C9_0%,#FFFDF5_100%)]`}>
          <div className="relative mx-auto mb-5 h-32 max-w-lg">
            <div className="review-park-gate-arch absolute inset-x-8 top-0 h-28 rounded-t-[5rem] border-[14px] border-amber-300 border-b-0 bg-white/55 shadow-lg">
              <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white px-5 py-2 text-lg font-black text-amber-700 shadow-sm">
                Ticket Gate
              </div>
            </div>
            <div
              className={`review-park-gate-door-left absolute bottom-0 left-[calc(50%-5rem)] h-16 w-20 rounded-t-2xl bg-rose-200 transition duration-500 ${
                solved ? "-translate-x-7 rotate-[-8deg]" : ""
              }`}
            />
            <div
              className={`review-park-gate-door-right absolute bottom-0 right-[calc(50%-5rem)] h-16 w-20 rounded-t-2xl bg-sky-200 transition duration-500 ${
                solved ? "translate-x-7 rotate-[8deg]" : ""
              }`}
            />
          </div>
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {question.choices.map((choice) => (
              <ChoiceButton
                key={choice}
                choice={choice}
                question={question}
                selected={selectedAnswer === choice}
                answerStatus={answerStatus}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      ) : null}

      {question.miniGameType === "ferris" ? (
        <div className={`review-park-ferris-scene ${sceneBase} bg-[linear-gradient(180deg,#E6F6FF_0%,#FFF8DE_100%)]`}>
          <div className={`review-park-ferris-wheel relative mx-auto h-[18rem] max-w-[30rem] rounded-full border-[12px] border-sky-200/80 transition duration-500 ${solved ? "rotate-6 shadow-xl shadow-sky-100" : ""}`}>
            <div className="review-park-ferris-hub absolute left-1/2 top-1/2 z-10 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 shadow-md" />
            {[0, 45, 90, 135].map((rotation) => (
              <div
                key={rotation}
                className="review-park-ferris-spoke absolute left-1/2 top-1/2 h-1 w-[44%] origin-left bg-sky-200"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
            ))}
            {question.choices.map((choice, index) => {
              const positions = [
                "left-1/2 top-0 -translate-x-1/2 -translate-y-3",
                "right-0 top-1/2 translate-x-3 -translate-y-1/2",
                "bottom-0 left-1/2 -translate-x-1/2 translate-y-3",
                "left-0 top-1/2 -translate-x-3 -translate-y-1/2",
              ];
              return (
                <div key={choice} className={`absolute ${positions[index]}`}>
                  <ChoiceButton
                    choice={choice}
                    question={question}
                    selected={selectedAnswer === choice}
                    answerStatus={answerStatus}
                    onSelect={onSelect}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {question.miniGameType === "prizeBox" ? (
        <div className={`review-park-prize-scene ${sceneBase} bg-[linear-gradient(180deg,#F4EDFF_0%,#FFF7E8_100%)]`}>
          <div className="mx-auto grid max-w-4xl gap-5 pt-5 sm:grid-cols-2 lg:grid-cols-4">
            {question.choices.map((choice) => (
              <ChoiceButton
                key={choice}
                choice={choice}
                question={question}
                selected={selectedAnswer === choice}
                answerStatus={answerStatus}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ChoiceButton({
  choice,
  question,
  selected,
  answerStatus,
  onSelect,
  extraClass = "",
}: {
  choice: number;
  question: ReviewQuestion;
  selected: boolean;
  answerStatus: AnswerStatus;
  onSelect: (choice: number) => void;
  extraClass?: string;
}) {
  const isCorrect = answerStatus === "correct" && selected;
  const isWrong = answerStatus === "wrong" && selected;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(choice)}
      animate={
        isCorrect
          ? { scale: [1, 1.08, 1] }
          : isWrong
            ? { x: [0, -7, 7, -4, 4, 0] }
            : {}
      }
      className={`${getChoiceClasses(question.miniGameType, answerStatus, selected)} ${extraClass}`}
    >
      {question.miniGameType === "ticket" ? (
        <Ticket className="absolute left-3 top-3 h-6 w-6 opacity-45" />
      ) : null}
      {question.miniGameType === "prizeBox" ? (
        <>
          <div className={`review-park-prize-lid absolute -top-5 left-1/2 h-9 w-[82%] -translate-x-1/2 rounded-xl bg-inherit shadow-md transition ${isCorrect ? "-translate-y-4 rotate-[-5deg]" : ""}`} />
          <div className="review-park-prize-ribbon-vertical absolute left-1/2 top-0 h-full w-4 -translate-x-1/2 bg-white/45" />
          <div className="review-park-prize-ribbon-horizontal absolute left-0 top-1/2 h-4 w-full -translate-y-1/2 bg-white/45" />
          {isCorrect ? (
            <Star className="review-park-prize-star absolute -top-12 left-1/2 h-9 w-9 -translate-x-1/2 fill-amber-300 text-amber-300" />
          ) : null}
          <span className="review-park-prize-number relative z-10 rounded-full bg-white/75 px-4 py-1">
            {choice}
          </span>
        </>
      ) : (
        <span className={question.miniGameType === "ferris" ? "review-park-ferris-cabin-number" : ""}>
          {choice}
        </span>
      )}
    </motion.button>
  );
}

function ReviewPrompt({ question }: { question: ReviewQuestion }) {
  if (question.promptType === "wordToNumber") {
    return (
      <div className="review-park-prompt mx-auto mt-5 max-w-xl rounded-[1.75rem] bg-amber-50 px-5 py-5 shadow-inner">
        <p className="text-lg font-black text-amber-600">Read the number word:</p>
        <p className="mt-2 text-4xl font-black lowercase text-[#183B5B] sm:text-5xl">
          {question.targetWord}
        </p>
      </div>
    );
  }

  if (question.promptType === "findNumber") {
    return (
      <div className="review-park-prompt mx-auto mt-5 max-w-xl rounded-[1.75rem] bg-sky-50 px-5 py-5 shadow-inner">
        <p className="text-lg font-black text-sky-600">Find this number:</p>
        <p className="mt-1 text-7xl font-black text-[#183B5B] sm:text-8xl">
          {question.targetNumber}
        </p>
      </div>
    );
  }

  return (
    <div className="review-park-prompt mx-auto mt-5 max-w-xl rounded-[1.75rem] bg-pink-50 px-5 py-5 shadow-inner">
      <p className="text-3xl font-black text-[#183B5B] sm:text-4xl">
        What number did you hear?
      </p>
    </div>
  );
}

function CompactStampProgress({ stamps }: { stamps: number }) {
  return (
    <div className="review-park-progress mx-auto mt-3 flex max-w-2xl flex-col items-center gap-3 rounded-full bg-white/80 px-4 py-2.5 shadow-sm sm:flex-row">
      <div className="text-lg font-black text-amber-700">⭐ Stamps: {stamps}</div>
      <div className="grid flex-1 grid-cols-10 gap-1.5">
        {Array.from({ length: 10 }, (_, index) => (
          <div
            key={index}
            className={`h-5 rounded-full border-2 ${
              index < stamps
                ? "animate-[stampPop_.32s_ease-out] border-amber-300 bg-amber-300"
                : index === stamps
                  ? "animate-[pulseSoft_2s_ease-in-out_infinite] border-amber-300 bg-white"
                  : "border-amber-100 bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function ReviewParkGame() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<GameScreen>("start");
  const [questions, setQuestions] = useState<ReviewQuestion[]>(() => generateReviewQuestions());
  const [questionIndex, setQuestionIndex] = useState(0);
  const [stamps, setStamps] = useState(0);
  const [firstTryScore, setFirstTryScore] = useState(0);
  const [hasMistake, setHasMistake] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>("idle");
  const [feedback, setFeedback] = useState("");

  const question = questions[questionIndex];
  const speechLine = useMemo(() => getReviewInstruction(question), [question]);

  const resetAnswerState = () => {
    setHasMistake(false);
    setSelectedAnswer(null);
    setAnswerStatus("idle");
    setFeedback("");
  };

  const startAdventure = () => {
    stopSpeech();
    setQuestions(generateReviewQuestions());
    setQuestionIndex(0);
    setStamps(0);
    setFirstTryScore(0);
    resetAnswerState();
    setScreen("play");
  };

  const selectAnswer = (choice: number) => {
    if (answerStatus === "correct") return;

    setSelectedAnswer(choice);

    if (choice === question.targetNumber) {
      if (!hasMistake) setFirstTryScore((value) => value + 1);
      setStamps((value) => value + 1);
      setAnswerStatus("correct");
      setFeedback("Great job! You got a stamp!");
      return;
    }

    setHasMistake(true);
    setAnswerStatus("wrong");
    setFeedback("Try again!");
  };

  const goNext = () => {
    stopSpeech();

    if (questionIndex === questions.length - 1) {
      saveReviewParkResult(firstTryScore, 10);
      setScreen("end");
      return;
    }

    setQuestionIndex((value) => value + 1);
    resetAnswerState();
  };

  const tryAgain = () => {
    setSelectedAnswer(null);
    setAnswerStatus("idle");
    setFeedback("");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#FFF0D6_0%,#F1FBFF_46%,#FFEAF4_100%)] px-4 py-5 text-slate-700 sm:px-7">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: .45; transform: scale(.9); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes pulseSoft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.035); }
        }
        @keyframes shakeGentle {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-3px); }
        }
        @keyframes stampPop {
          0% { transform: scale(.92); }
          55% { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
      `}</style>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute left-[-52px] top-28 h-20 w-44 rounded-full bg-white/70" />
        <span className="absolute right-[-34px] top-40 h-16 w-40 rounded-full bg-white/65" />
        <span className="absolute bottom-24 left-[8%] h-12 w-12 rounded-full bg-amber-200/70" />
        <span className="absolute bottom-44 right-[9%] h-10 w-10 rounded-full bg-pink-200/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <KidioPageHeader
          backLabel="Back to Number Land"
          backTo="/number-land"
          title={
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-wide text-amber-500">
                Final World
              </p>
              <h1 className="text-2xl font-black text-[#183B5B] sm:text-3xl">
                Review Park
              </h1>
            </div>
          }
          rightContent={
            screen === "play" ? (
              <div className="rounded-full bg-white/90 px-4 py-3 text-base font-black text-amber-700 shadow-md">
                Question {questionIndex + 1} / {questions.length}
              </div>
            ) : null
          }
        />

        {screen === "start" ? (
          <motion.main
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="review-park-start mx-auto mt-5"
          >
            <div className="text-center">
              <p className="text-lg font-black text-amber-600">Review Park</p>
              <div className="mx-auto mt-3 max-w-2xl rounded-[1.75rem] bg-white/85 px-5 py-4 shadow-md">
                <p className="text-2xl font-black text-[#183B5B]">
                  Today we review numbers 1-100
                </p>
                <p className="mt-2 text-lg font-bold text-slate-500">
                  Listen to English numbers and tap the right number.
                </p>
              </div>
              <h2 className="mt-2 text-3xl font-black text-[#183B5B] sm:text-4xl">
                Listen. Tap. Collect stamps!
              </h2>
            </div>
            <ReviewSteps />
            <div className="mt-6 grid items-stretch gap-5 lg:grid-cols-[1fr_1.2fr]">
              <MascotHelper />
              <PassportStamps stamps={0} compact />
            </div>
            <AttractionPreviews />
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={startAdventure}
                className="inline-flex min-h-16 animate-[pulseSoft_2.4s_ease-in-out_infinite] items-center justify-center gap-3 rounded-full bg-amber-500 px-10 py-4 text-xl font-black text-white shadow-xl shadow-amber-200 transition hover:bg-amber-600"
              >
                <Play className="h-7 w-7 fill-white" />
                Start Playing
              </button>
              <button
                type="button"
                onClick={() => navigate("/number-land")}
                className="inline-flex min-h-16 items-center justify-center gap-3 rounded-full bg-sky-100 px-8 py-4 text-xl font-black text-sky-700 shadow-md transition hover:bg-sky-200"
              >
                <ArrowLeft className="h-7 w-7" />
                Back to Number Land
              </button>
            </div>
          </motion.main>
        ) : null}

        {screen === "play" ? (
          <motion.main
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="review-park-game mx-auto mt-6 rounded-[2rem] bg-white/88 p-4 text-center shadow-xl ring-1 ring-white sm:p-6"
          >
            <CompactStampProgress stamps={stamps} />
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-black text-sky-700">
                🔢 Numbers 1-100
              </span>
              <span className="rounded-full bg-pink-100 px-4 py-2 text-sm font-black text-pink-700">
                🎧 Listening
              </span>
            </div>

            <section className="mt-7">
              <p className="text-2xl font-black text-[#183B5B]">{getMiniGameHeader(question.miniGameType)}</p>
              <p className="mt-2 text-xl font-black text-slate-500">
                {getMiniGameInstruction(question.miniGameType)}
              </p>
              <button
                type="button"
                onClick={() => speakReview(speechLine)}
                className="mx-auto mt-5 flex min-h-16 min-w-44 items-center justify-center gap-3 rounded-full bg-amber-500 px-9 py-4 text-xl font-black text-white shadow-lg shadow-amber-200 transition hover:bg-amber-600"
              >
                <Headphones className="h-6 w-6" />
                Listen to the number
              </button>
              <p className="mt-2 text-sm font-black text-slate-500">
                Then tap the right answer.
              </p>
            </section>

            <ReviewPrompt question={question} />

            <ReviewParkScene
              question={question}
              selectedAnswer={selectedAnswer}
              answerStatus={answerStatus}
              onSelect={selectAnswer}
            />

            <div className="mt-7 min-h-16">
              {feedback ? (
                <motion.div
                  key={feedback}
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`review-park-feedback mx-auto flex max-w-md items-center justify-center gap-2 rounded-[1.5rem] px-5 py-4 shadow-sm ${
                    answerStatus === "correct"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  <Sparkles className="h-7 w-7" />
                  {answerStatus === "correct" ? (
                    <div className="text-center">
                      <p className="text-2xl font-black">Great job!</p>
                      <p className="mt-1 text-3xl font-black">
                        {question.targetNumber} = {question.targetWord}
                      </p>
                      <p className="mt-1 text-xl font-black">You got a stamp!</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-2xl font-black">Try again!</p>
                      <p className="mt-1 text-lg font-black">Listen one more time.</p>
                    </div>
                  )}
                </motion.div>
              ) : null}
            </div>

            {answerStatus === "correct" ? (
              <button
                type="button"
                onClick={goNext}
                className="mt-2 min-h-14 min-w-44 rounded-full bg-amber-500 px-8 py-3 text-xl font-black text-white shadow-lg shadow-amber-200 transition hover:bg-amber-600"
              >
                {questionIndex === questions.length - 1 ? "See Result" : "Next"}
              </button>
            ) : answerStatus === "wrong" ? (
              <button
                type="button"
                onClick={tryAgain}
                className="mt-2 min-h-14 min-w-44 rounded-full bg-pink-100 px-8 py-3 text-xl font-black text-pink-700 shadow-md transition hover:bg-pink-200"
              >
                Try Again
              </button>
            ) : null}
          </motion.main>
        ) : null}

        {screen === "end" ? (
          <motion.main
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative mx-auto mt-10 overflow-hidden rounded-[2rem] bg-white/90 p-7 text-center shadow-xl ring-1 ring-white sm:p-10"
          >
            <span className="absolute left-8 top-8 animate-[twinkle_2.4s_ease-in-out_infinite] text-4xl text-amber-300">*</span>
            <span className="absolute right-10 top-12 animate-[twinkle_2.8s_ease-in-out_infinite] text-4xl text-pink-300">*</span>
            <span className="absolute bottom-10 left-10 h-16 w-12 animate-[float_3.4s_ease-in-out_infinite] rounded-full bg-sky-200" />
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-amber-100 text-amber-500 shadow-inner">
              <PartyPopper className="h-16 w-16" />
            </div>
            <h2 className="mt-6 text-4xl font-black leading-tight text-[#183B5B]">
              Passport Complete!
            </h2>
            <div className="mx-auto mt-5 grid max-w-2xl gap-3 text-lg font-black sm:grid-cols-3">
              <div className="rounded-[1.25rem] bg-sky-50 px-4 py-3 text-sky-700">
                You reviewed numbers 1-100.
              </div>
              <div className="rounded-[1.25rem] bg-pink-50 px-4 py-3 text-pink-700">
                You practiced listening to English numbers.
              </div>
              <div className="rounded-[1.25rem] bg-amber-50 px-4 py-3 text-amber-700">
                You collected 10 stamps!
              </div>
            </div>
            <p className="mt-3 text-base font-black text-slate-500">
              First try score: {firstTryScore} / {questions.length}
            </p>
            <PassportStamps stamps={10} />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={startAdventure}
                className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-amber-500 px-7 py-3 text-lg font-black text-white shadow-lg shadow-amber-200 transition hover:bg-amber-600"
              >
                <RefreshCcw className="h-6 w-6" />
                Play Again
              </button>
              <button
                type="button"
                onClick={() => navigate("/number-land")}
                className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-sky-100 px-7 py-3 text-lg font-black text-sky-700 shadow-md transition hover:bg-sky-200"
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
