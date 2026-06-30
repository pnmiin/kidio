import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Check, Headphones, Star } from "lucide-react";
import { KidioPageHeader } from "../../components/KidioPageHeader";

type HuntColor = "Red" | "Blue" | "Yellow" | "Green" | "Orange" | "Purple";

type HuntObject = {
  id: string;
  name: string;
  imageSrc?: string;
  color: HuntColor;
};

type HuntRound = {
  color: HuntColor;
  hex: string;
  objects: HuntObject[];
};

const objectBank: Record<HuntColor, Omit<HuntObject, "color">[]> = {
  Red: [
    { id: "red-apple", name: "red apple", imageSrc: "/assets/game_color/red_apple.png" },
    { id: "red-car", name: "red car", imageSrc: "/assets/game_color/red_car.png" },
    { id: "red-balloon", name: "red balloon", imageSrc: "/assets/game_color/red_balloon.png" },
  ],
  Blue: [
    { id: "blue-ball", name: "blue ball", imageSrc: "/assets/game_color/blue_ball.png" },
    { id: "blue-bag", name: "blue bag", imageSrc: "/assets/game_color/blue_bag.png" },
  ],
  Yellow: [
    { id: "yellow-chick", name: "yellow chick", imageSrc: "/assets/game_color/yellow_chick.png" },
    { id: "yellow-banana", name: "yellow banana", imageSrc: "/assets/game_color/yellow_banana.png" },
    { id: "yellow-cheese", name: "yellow cheese", imageSrc: "/assets/game_color/yellow_cheese.png" },
  ],
  Green: [
    { id: "green-tree", name: "green tree", imageSrc: "/assets/game_color/green_tree.png" },
    { id: "green-frog", name: "green frog", imageSrc: "/assets/game_color/green_frog.png" },
  ],
  Orange: [
    { id: "orange-fruit", name: "orange fruit", imageSrc: "/assets/game_color/orange_fruit.png" },
    { id: "orange-carrot", name: "orange carrot", imageSrc: "/assets/game_color/orange_carrot.png" },
    { id: "orange-fox", name: "orange fox", imageSrc: "/assets/game_color/orange_fox.png" },
  ],
  Purple: [
    { id: "purple-grapes", name: "purple grapes", imageSrc: "/assets/game_color/purple_grapes.png" },
    { id: "purple-flowers", name: "purple flowers", imageSrc: "/assets/game_color/purple_flowers.png" },
  ],
};

const colorHex: Record<HuntColor, string> = {
  Red: "#EF4444",
  Blue: "#3B82F6",
  Yellow: "#FCD34D",
  Green: "#22C55E",
  Orange: "#F97316",
  Purple: "#8B5CF6",
};

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const clearEnglishVoice =
    voices.find(
      (voice) =>
        voice.lang === "en-US" &&
        /female|samantha|jenny|aria|zira/i.test(voice.name),
    ) ??
    voices.find((voice) => voice.lang === "en-US") ??
    voices.find((voice) => voice.lang.startsWith("en"));

  if (clearEnglishVoice) {
    utterance.voice = clearEnglishVoice;
  }

  utterance.lang = "en-US";
  utterance.rate = 0.72;
  utterance.pitch = 1.08;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

function shuffleArray<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function makeObject(
  color: HuntColor,
  object: Omit<HuntObject, "color">,
): HuntObject {
  return { ...object, color };
}

function buildRounds(): HuntRound[] {
  const colors: HuntColor[] = ["Red", "Blue", "Yellow", "Green", "Orange", "Purple"];

  return colors.map((targetColor, index) => {
    const correctCount = index % 2 === 0 ? 3 : 2;
    const correctObjects = objectBank[targetColor]
      .slice(0, correctCount)
      .map((object) => makeObject(targetColor, object));
    const wrongObjects = colors
      .filter((color) => color !== targetColor)
      .flatMap((color) =>
        objectBank[color]
          .slice(0, 1)
          .map((object) => makeObject(color, object)),
      )
      .slice(0, 6 - correctObjects.length);

    return {
      color: targetColor,
      hex: colorHex[targetColor],
      objects: shuffleArray([...correctObjects, ...wrongObjects]),
    };
  });
}

export function ColorHuntGame() {
  const navigate = useNavigate();
  const rounds = useMemo(() => buildRounds(), []);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [stars, setStars] = useState(0);
  const [roundComplete, setRoundComplete] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const currentRound = rounds[roundIndex];
  const targetColor = currentRound.color;
  const targetName = targetColor.toLowerCase();
  const correctObjects = currentRound.objects.filter((object) => object.color === targetColor);
  const selectedObjects = currentRound.objects.filter((object) => selectedIds.includes(object.id));
  const selectedCorrectCount = selectedObjects.filter((object) => object.color === targetColor).length;

  const toggleObject = (object: HuntObject) => {
    if (roundComplete) return;
    setFeedback("");
    speak(object.name);
    setSelectedIds((ids) =>
      ids.includes(object.id) ? ids.filter((id) => id !== object.id) : [...ids, object.id],
    );
  };

  const checkAnswer = () => {
    const wrongObject = selectedObjects.find((object) => object.color !== targetColor);

    if (wrongObject) {
      setFeedback(`Oops! This is ${wrongObject.color.toLowerCase()}. Find ${targetName}.`);
      return;
    }

    if (selectedCorrectCount < correctObjects.length) {
      setFeedback(`Find more ${targetName} things.`);
      return;
    }

    setFeedback(`Great! These are ${targetName}.`);
    setRoundComplete(true);
    setStars((value) => value + 1);
  };

  const nextRound = () => {
    if (roundIndex === rounds.length - 1) {
      setGameComplete(true);
      return;
    }

    setRoundIndex((value) => value + 1);
    setSelectedIds([]);
    setFeedback("");
    setRoundComplete(false);
  };

  const playAgain = () => {
    setRoundIndex(0);
    setSelectedIds([]);
    setFeedback("");
    setStars(0);
    setRoundComplete(false);
    setGameComplete(false);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden app-sky-background px-4 py-5 text-slate-700 sm:px-7">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute left-[-42px] top-28 h-20 w-44 rounded-full bg-white/65" />
        <span className="absolute right-[-30px] top-44 h-16 w-40 rounded-full bg-white/60" />
        <span className="absolute bottom-28 left-[8%] h-12 w-12 rounded-full bg-pink-200/70" />
        <span className="absolute bottom-48 right-[9%] h-10 w-10 rounded-full bg-amber-200/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <KidioPageHeader
          backLabel="Back to Color World"
          backTo="/color-world"
          title={
            <div className="text-center">
              <h1 className="text-3xl font-black text-[#183B5B] sm:text-5xl">
                Color Hunt
              </h1>
              <p className="mt-2 text-lg font-bold text-slate-500 sm:text-xl">
                Listen and find the right things.
              </p>
            </div>
          }
          rightContent={
            <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-3 text-lg font-black text-amber-600 shadow-md">
              <Star className="h-6 w-6 fill-amber-300 text-amber-300" />
              {stars}
            </div>
          }
        />

        <main className="mt-7">
          {gameComplete ? (
            <section className="mx-auto max-w-3xl rounded-[2rem] bg-white/92 p-7 text-center shadow-xl ring-1 ring-white">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <Star className="h-12 w-12 fill-amber-300 text-amber-300" />
              </div>
              <h2 className="mt-5 text-5xl font-black text-[#183B5B]">
                Amazing!
              </h2>
              <p className="mt-3 text-2xl font-black text-slate-600">
                You found many colors!
              </p>
              <p className="mt-3 text-3xl font-black text-amber-600">
                +3 Stars
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={playAgain}
                  className="min-h-14 rounded-full bg-violet-500 px-8 py-3 text-lg font-black text-white shadow-md transition hover:bg-violet-600"
                >
                  Play Again
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/color-world")}
                  className="min-h-14 rounded-full bg-sky-100 px-8 py-3 text-lg font-black text-sky-700 shadow-md transition hover:bg-sky-200"
                >
                  Back to Color World
                </button>
              </div>
            </section>
          ) : (
            <section className="rounded-[2rem] bg-white/92 p-5 shadow-xl ring-1 ring-white sm:p-7">
              <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
                <div>
                  <p className="text-lg font-black text-violet-600">
                    Color {roundIndex + 1} / {rounds.length}
                  </p>
                  <h2 className="text-4xl font-black text-[#183B5B]">
                    Find {targetName} things.
                  </h2>
                </div>
                <div className="rounded-full bg-amber-100 px-5 py-3 text-lg font-black text-amber-700">
                  Selected: {selectedCorrectCount} / {correctObjects.length}
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
                <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,#EAF7FF_0%,#F4ECFF_100%)] p-5 text-center shadow-inner">
                  <span
                    className="mx-auto block h-28 w-28 rounded-[2rem] shadow-lg"
                    style={{ backgroundColor: currentRound.hex }}
                  />
                  <h3 className="mt-4 text-5xl font-black text-[#183B5B]">
                    {targetColor}
                  </h3>
                  <p className="mt-2 text-2xl font-black text-slate-600">
                    This is {targetName}.
                  </p>
                  <button
                    type="button"
                    onClick={() => speak(targetColor)}
                    className="mt-5 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-sky-500 px-8 py-3 text-xl font-black text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600"
                  >
                    <Headphones className="h-6 w-6" />
                    Listen
                  </button>
                  <p className="mt-5 text-2xl font-black text-violet-700">
                    Find {targetName} things.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {currentRound.objects.map((object) => {
                    const isSelected = selectedIds.includes(object.id);

                    return (
                      <motion.button
                        key={object.id}
                        type="button"
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => toggleObject(object)}
                        className={`relative flex min-h-44 flex-col items-center justify-center rounded-[1.5rem] bg-white p-4 text-center shadow-md ring-4 transition ${
                          isSelected
                            ? "ring-sky-400"
                            : "ring-transparent hover:ring-sky-100"
                        }`}
                      >
                        {isSelected ? (
                          <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white shadow-md">
                            <Check className="h-5 w-5 stroke-[4]" />
                          </span>
                        ) : null}
                        {object.imageSrc ? (
                          <img
                            src={object.imageSrc}
                            alt={object.name}
                            className="h-24 w-24 object-contain drop-shadow-sm sm:h-28 sm:w-28"
                            draggable={false}
                          />
                        ) : (
                          <span className="text-5xl font-black text-[#183B5B]">?</span>
                        )}
                        <span className="mt-3 text-lg font-black capitalize text-[#183B5B]">
                          {object.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 text-center">
                {feedback ? (
                  <div
                    className={`mx-auto max-w-xl rounded-[1.25rem] px-5 py-4 text-xl font-black ${
                      roundComplete
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {feedback}
                  </div>
                ) : null}

                <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                  {!roundComplete ? (
                    <button
                      type="button"
                      onClick={checkAnswer}
                      className="min-h-14 rounded-full bg-violet-500 px-10 py-3 text-xl font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-600"
                    >
                      Check
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={nextRound}
                      className="min-h-14 rounded-full bg-emerald-500 px-10 py-3 text-xl font-black text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-600"
                    >
                      Next Color
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
