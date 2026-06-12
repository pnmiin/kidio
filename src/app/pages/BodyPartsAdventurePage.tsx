import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { BookOpen, ChevronRight, Sparkles, Volume2 } from "lucide-react";
import { motion } from "motion/react";
import { KidioPageHeader } from "../../components/KidioPageHeader";
import {
  BodyMapCharacter,
  BodyPartLabel,
  FeedbackBubble,
  ModeToggle,
  type BodyHotspot,
  type BodyPart,
  type BodyPartId,
} from "../components/body-parts/BodyPartsGame";

const bodyParts: BodyPart[] = [
  {
    id: "head",
    label: "head",
    icon: "/assets/body-parts/head.png",
    audio: "/audio/body-parts/head.mp3",
    side: "left",
    color: "#34B3F1",
    softColor: "#E7F7FF",
    labelY: 8,
    connectorTarget: { x: 49, y: 13 },
  },
  {
    id: "hair",
    label: "hair",
    icon: "/assets/body-parts/hair.png",
    audio: "/audio/body-parts/hair.mp3",
    side: "right",
    color: "#9B7CF7",
    softColor: "#F1EDFF",
    labelY: 5,
    connectorTarget: { x: 50, y: 7 },
  },
  {
    id: "eyes",
    label: "eyes",
    icon: "/assets/body-parts/eyes.png",
    audio: "/audio/body-parts/eyes.mp3",
    side: "left",
    color: "#52C9A5",
    softColor: "#E8FAF4",
    labelY: 20,
    connectorTarget: { x: 50, y: 24 },
  },
  {
    id: "ears",
    label: "ears",
    icon: "/assets/body-parts/ears.png",
    audio: "/audio/body-parts/ears.mp3",
    side: "right",
    color: "#FF9F7E",
    softColor: "#FFF0EA",
    labelY: 18,
    connectorTarget: { x: 68, y: 25 },
  },
  {
    id: "nose",
    label: "nose",
    icon: "/assets/body-parts/nose.png",
    audio: "/audio/body-parts/nose.mp3",
    side: "left",
    color: "#F6BE3E",
    softColor: "#FFF7DD",
    labelY: 32,
    connectorTarget: { x: 50, y: 29 },
  },
  {
    id: "mouth",
    label: "mouth",
    icon: "/assets/body-parts/mouth.png",
    audio: "/audio/body-parts/mouth.mp3",
    side: "right",
    color: "#F477A6",
    softColor: "#FFF0F6",
    labelY: 31,
    connectorTarget: { x: 50, y: 34 },
  },
  {
    id: "arms",
    label: "arms",
    icon: "/assets/body-parts/arms.png",
    audio: "/audio/body-parts/arms.mp3",
    side: "left",
    color: "#6E9FF8",
    softColor: "#EDF3FF",
    labelY: 46,
    connectorTarget: { x: 30, y: 50 },
  },
  {
    id: "hands",
    label: "hands",
    icon: "/assets/body-parts/hands.png",
    audio: "/audio/body-parts/hands.mp3",
    side: "right",
    color: "#40C7C2",
    softColor: "#E8FBFA",
    labelY: 47,
    connectorTarget: { x: 70, y: 59 },
  },
  {
    id: "fingers",
    label: "fingers",
    icon: "/assets/body-parts/fingers.png",
    audio: "/audio/body-parts/fingers.mp3",
    side: "left",
    color: "#FF9D45",
    softColor: "#FFF3E7",
    labelY: 61,
    connectorTarget: { x: 28, y: 65 },
  },
  {
    id: "legs",
    label: "legs",
    icon: "/assets/body-parts/legs.png",
    audio: "/audio/body-parts/legs.mp3",
    side: "right",
    color: "#8D75E8",
    softColor: "#F1EEFF",
    labelY: 65,
    connectorTarget: { x: 58, y: 72 },
  },
  {
    id: "knees",
    label: "knees",
    icon: "/assets/body-parts/knees.png",
    audio: "/audio/body-parts/knees.mp3",
    side: "left",
    color: "#54BF79",
    softColor: "#EAF9EF",
    labelY: 76,
    connectorTarget: { x: 43, y: 75 },
  },
  {
    id: "feet",
    label: "feet",
    icon: "/assets/body-parts/feet.png",
    audio: "/audio/body-parts/feet.mp3",
    side: "right",
    color: "#ED7790",
    softColor: "#FFF0F3",
    labelY: 82,
    connectorTarget: { x: 58, y: 87 },
  },
];

const audioMap = Object.fromEntries(
  bodyParts.map((part) => [part.id, part.audio]),
) as Record<BodyPartId, string>;

const hotspots: BodyHotspot[] = [
  {
    id: "head",
    target: "head",
    top: "5%",
    left: "25%",
    width: "50%",
    height: "33%",
    rounded: "45%",
  },
  {
    id: "hair",
    target: "hair",
    top: "4%",
    left: "27%",
    width: "46%",
    height: "17%",
    rounded: "45%",
  },
  {
    id: "eyes",
    target: "eyes",
    top: "22%",
    left: "36%",
    width: "28%",
    height: "8%",
  },
  {
    id: "left-ear",
    target: "ears",
    top: "23%",
    left: "25%",
    width: "11%",
    height: "10%",
  },
  {
    id: "right-ear",
    target: "ears",
    top: "23%",
    left: "64%",
    width: "11%",
    height: "10%",
  },
  {
    id: "nose",
    target: "nose",
    top: "27%",
    left: "45%",
    width: "10%",
    height: "8%",
  },
  {
    id: "mouth",
    target: "mouth",
    top: "32%",
    left: "41%",
    width: "18%",
    height: "8%",
  },
  {
    id: "left-arm",
    target: "arms",
    top: "45%",
    left: "24%",
    width: "14%",
    height: "18%",
  },
  {
    id: "right-arm",
    target: "arms",
    top: "45%",
    left: "62%",
    width: "14%",
    height: "18%",
  },
  {
    id: "left-hand",
    target: "hands",
    top: "56%",
    left: "23%",
    width: "15%",
    height: "15%",
  },
  {
    id: "right-hand",
    target: "hands",
    top: "56%",
    left: "62%",
    width: "15%",
    height: "15%",
  },
  {
    id: "left-fingers",
    target: "fingers",
    top: "63%",
    left: "23%",
    width: "13%",
    height: "8%",
  },
  {
    id: "right-fingers",
    target: "fingers",
    top: "63%",
    left: "64%",
    width: "13%",
    height: "8%",
  },
  {
    id: "left-leg",
    target: "legs",
    top: "67%",
    left: "35%",
    width: "15%",
    height: "19%",
  },
  {
    id: "right-leg",
    target: "legs",
    top: "67%",
    left: "50%",
    width: "15%",
    height: "19%",
  },
  {
    id: "left-knee",
    target: "knees",
    top: "72%",
    left: "35%",
    width: "15%",
    height: "9%",
  },
  {
    id: "right-knee",
    target: "knees",
    top: "72%",
    left: "50%",
    width: "15%",
    height: "9%",
  },
  {
    id: "left-foot",
    target: "feet",
    top: "82%",
    left: "29%",
    width: "21%",
    height: "11%",
  },
  {
    id: "right-foot",
    target: "feet",
    top: "82%",
    left: "50%",
    width: "21%",
    height: "11%",
  },
];

const positiveMessages = ["Great!", "Good job!", "Listen again!"];

function createQuizRound() {
  return [...bodyParts]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5)
    .map((part) => part.id);
}

export function BodyPartsAdventurePage() {
  const navigate = useNavigate();
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const [mode, setMode] = useState<"learn" | "quiz">("learn");
  const [selectedPart, setSelectedPart] = useState<BodyPartId | null>(null);
  const [learnedParts, setLearnedParts] = useState<BodyPartId[]>([]);
  const [playingPart, setPlayingPart] = useState<BodyPartId | null>(null);
  const [feedback, setFeedback] = useState(
    "Tap a word or body part to hear it.",
  );
  const [feedbackKind, setFeedbackKind] = useState<
    "positive" | "retry" | "prompt"
  >("prompt");
  const [quizRound, setQuizRound] = useState<BodyPartId[]>(createQuizRound);
  const [quizIndex, setQuizIndex] = useState(0);
  const [shakingPart, setShakingPart] = useState<BodyPartId | null>(null);

  const selectClearEnglishVoice = useCallback(() => {
    if (!("speechSynthesis" in window)) return null;
    const englishVoices = window.speechSynthesis
      .getVoices()
      .filter((voice) => voice.lang.toLowerCase().startsWith("en"));
    const preferredNames = [
      "microsoft jenny online",
      "microsoft aria online",
      "google us english",
      "samantha",
      "microsoft zira",
      "ava",
    ];

    return (
      preferredNames
        .map((name) =>
          englishVoices.find((voice) =>
            voice.name.toLowerCase().includes(name),
          ),
        )
        .find(Boolean) ??
      englishVoices.find((voice) =>
        voice.lang.toLowerCase().startsWith("en-us"),
      ) ??
      englishVoices[0] ??
      null
    );
  }, []);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const loadVoice = () => {
      voiceRef.current = selectClearEnglishVoice();
    };
    loadVoice();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoice);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoice);
      window.speechSynthesis.cancel();
    };
  }, [selectClearEnglishVoice]);

  const playAudio = useCallback(
    (partId: BodyPartId) => {
      if (!("speechSynthesis" in window)) return;
      const part = bodyParts.find((item) => item.id === partId);
      if (!part) return;

      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      setPlayingPart(partId);
      const utterance = new SpeechSynthesisUtterance(part.label);
      voiceRef.current ||= selectClearEnglishVoice();
      utterance.lang = "en-US";
      utterance.voice = voiceRef.current;
      utterance.rate = 1.1;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.onend = () => setPlayingPart(null);
      utterance.onerror = () => setPlayingPart(null);
      window.speechSynthesis.speak(utterance);
    },
    [selectClearEnglishVoice],
  );

  const playSuccessSound = () => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.frequency.setValueAtTime(523, context.currentTime);
      oscillator.frequency.setValueAtTime(659, context.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.35);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.35);
    } catch {
      // The visual feedback is enough when Web Audio is unavailable.
    }
  };

  const resetQuiz = () => {
    setQuizRound(createQuizRound());
    setQuizIndex(0);
    setSelectedPart(null);
    setFeedback("Find the body part!");
    setFeedbackKind("prompt");
  };

  const changeMode = (nextMode: "learn" | "quiz") => {
    setMode(nextMode);
    setShakingPart(null);
    if (nextMode === "quiz") {
      resetQuiz();
    } else {
      setFeedback("Tap a word or body part to hear it.");
      setFeedbackKind("prompt");
    }
  };

  const handleSelection = (partId: BodyPartId) => {
    setSelectedPart(partId);
    playAudio(partId);

    if (mode === "learn") {
      setLearnedParts((parts) =>
        parts.includes(partId) ? parts : [...parts, partId],
      );
      setFeedback(
        positiveMessages[Math.floor(Math.random() * positiveMessages.length)],
      );
      setFeedbackKind("positive");
      return;
    }

    const target = quizRound[quizIndex];
    if (partId !== target) {
      setFeedback("Try again!");
      setFeedbackKind("retry");
      setShakingPart(partId);
      window.setTimeout(() => setShakingPart(null), 450);
      return;
    }

    playSuccessSound();
    setFeedback("Great job!");
    setFeedbackKind("positive");
    if (quizIndex === quizRound.length - 1) {
      window.setTimeout(() => {
        setFeedback("Amazing! You found all 5!");
        setFeedbackKind("positive");
      }, 350);
      return;
    }
    window.setTimeout(() => {
      setQuizIndex((index) => index + 1);
      setSelectedPart(null);
      setFeedback("Find the next body part!");
      setFeedbackKind("prompt");
    }, 800);
  };

  const currentQuizPart = bodyParts.find(
    (part) => part.id === quizRound[quizIndex],
  );
  const leftParts = bodyParts.filter((part) => part.side === "left");
  const rightParts = bodyParts.filter((part) => part.side === "right");

  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#DFF6FF_0%,#F6F2FF_48%,#FFF6E7_100%)] px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-7xl">
        <KidioPageHeader
          backLabel="Back"
          backTo="/learning-journey"
          title={
            <div>
              <h1 className="text-2xl font-black text-[#153B5B] sm:text-3xl">
                Body Parts Adventure
              </h1>
              <p className="mt-1 font-bold text-[#607A91]">
                Point, listen, and learn!
              </p>
            </div>
          }
          rightContent={
            <div className="rounded-full bg-white/85 px-4 py-2 text-sm font-black text-violet-700 shadow-sm">
              {mode === "quiz"
                ? `${Math.min(quizIndex + 1, 5)} / 5`
                : `${learnedParts.length} / 12 learned`}
            </div>
          }
        />

        <div className="mt-2 text-center">
          <ModeToggle mode={mode} onChange={changeMode} />
          <div className="mt-4 flex min-h-14 flex-col items-center gap-3">
            {mode === "quiz" && currentQuizPart ? (
              <motion.div
                key={currentQuizPart.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 rounded-3xl bg-white px-6 py-3 shadow-[0_12px_30px_rgba(43,128,190,0.12)]"
              >
                <span className="text-lg font-black text-[#607A91]">
                  Can you find:
                </span>
                <span className="text-2xl font-black capitalize text-violet-700">
                  {currentQuizPart.label}?
                </span>
              </motion.div>
            ) : null}
            <FeedbackBubble message={feedback} kind={feedbackKind} />
          </div>
        </div>

        <main className="mt-4 rounded-[2rem] border border-white/90 bg-white/60 p-3 shadow-[0_24px_70px_rgba(43,128,190,0.13)] backdrop-blur-sm sm:p-6">
          <div className="relative hidden min-h-[690px] grid-cols-[minmax(190px,1fr)_minmax(330px,430px)_minmax(190px,1fr)] items-stretch gap-4 lg:grid">
            <div className="relative z-20 flex flex-col justify-around gap-3 py-5">
              {leftParts.map((part) => (
                <BodyPartLabel
                  key={part.id}
                  part={part}
                  active={selectedPart === part.id}
                  playing={playingPart === part.id}
                  shaking={shakingPart === part.id}
                  onClick={() => handleSelection(part.id)}
                />
              ))}
            </div>

            <div className="relative z-20 flex items-center justify-center">
              <BodyMapCharacter
                hotspots={hotspots}
                selectedPart={selectedPart}
                shakingPart={shakingPart}
                onPartClick={handleSelection}
              />
            </div>

            <div className="relative z-20 flex flex-col justify-around gap-3 py-5">
              {rightParts.map((part) => (
                <BodyPartLabel
                  key={part.id}
                  part={part}
                  active={selectedPart === part.id}
                  playing={playingPart === part.id}
                  shaking={shakingPart === part.id}
                  onClick={() => handleSelection(part.id)}
                />
              ))}
            </div>
          </div>

          <div className="lg:hidden">
            <BodyMapCharacter
              hotspots={hotspots}
              selectedPart={selectedPart}
              shakingPart={shakingPart}
              onPartClick={handleSelection}
            />
            <div className="mt-5 grid max-h-[390px] grid-cols-2 gap-3 overflow-y-auto px-1 pb-2 sm:grid-cols-3">
              {bodyParts.map((part) => (
                <BodyPartLabel
                  key={part.id}
                  part={part}
                  active={selectedPart === part.id}
                  playing={playingPart === part.id}
                  shaking={shakingPart === part.id}
                  onClick={() => handleSelection(part.id)}
                />
              ))}
            </div>
          </div>
        </main>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {mode === "quiz" &&
            quizIndex === 4 &&
            feedbackKind === "positive" && (
              <button
                type="button"
                onClick={resetQuiz}
                className="inline-flex min-h-13 items-center gap-2 rounded-full bg-violet-500 px-6 py-3 text-lg font-black text-white shadow-lg transition hover:bg-violet-600"
              >
                <Sparkles className="h-5 w-5" />
                Play Again
              </button>
            )}
          <button
            type="button"
            onClick={() => navigate("/review/body-parts")}
            className="inline-flex min-h-13 items-center gap-2 rounded-full bg-white px-6 py-3 text-lg font-black text-[#167EAF] shadow-lg transition hover:bg-sky-50"
          >
            <BookOpen className="h-5 w-5" />
            Flashcards
          </button>
          <button
            type="button"
            onClick={() => navigate("/review/body-parts?mode=quiz")}
            className="inline-flex min-h-13 items-center gap-2 rounded-full bg-[#2BADEE] px-6 py-3 text-lg font-black text-white shadow-lg transition hover:bg-[#1A9AD4]"
          >
            More Quiz
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
