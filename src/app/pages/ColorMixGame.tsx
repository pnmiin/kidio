import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Palette, Play, RotateCcw, Star } from "lucide-react";
import { KidioPageHeader } from "../../components/KidioPageHeader";

type MixCombo = {
  colors: [string, string];
  result: string;
  hex1: string;
  hex2: string;
  resultHex: string;
};

type MixPhase = "selecting" | "mixing" | "result";

const colorCombinations: MixCombo[] = [
  { colors: ["Red", "Blue"], result: "Purple", hex1: "#EF4444", hex2: "#3B82F6", resultHex: "#8B5CF6" },
  { colors: ["Red", "Yellow"], result: "Orange", hex1: "#EF4444", hex2: "#FBBF24", resultHex: "#F97316" },
  { colors: ["Blue", "Yellow"], result: "Green", hex1: "#3B82F6", hex2: "#FBBF24", resultHex: "#22C55E" },
  { colors: ["Red", "White"], result: "Pink", hex1: "#EF4444", hex2: "#FFFFFF", resultHex: "#EC4899" },
  { colors: ["Blue", "White"], result: "Light Blue", hex1: "#3B82F6", hex2: "#FFFFFF", resultHex: "#7DD3FC" },
  { colors: ["Black", "White"], result: "Gray", hex1: "#1F2937", hex2: "#FFFFFF", resultHex: "#9CA3AF" },
];

const mixColors = [
  { name: "Red", hex: "#EF4444" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Yellow", hex: "#FBBF24" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#1F2937" },
];

function resultSentence(combo: MixCombo) {
  return `${combo.colors[0]} and ${combo.colors[1]} make ${combo.result}.`;
}

function ColorSwatch({
  name,
  hex,
  size = "large",
}: {
  name: string;
  hex: string;
  size?: "small" | "large";
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`${size === "large" ? "h-20 w-20" : "h-14 w-14"} rounded-[1.25rem] shadow-lg`}
        style={{
          backgroundColor: hex,
          border: name === "White" ? "2px solid #D1D5DB" : "none",
        }}
      />
      <span className="mt-2 text-sm font-black text-slate-600 sm:text-base">{name}</span>
    </div>
  );
}

export function ColorMixGame() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<MixPhase>("selecting");
  const [currentMixIndex, setCurrentMixIndex] = useState(0);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [currentCombination, setCurrentCombination] = useState<MixCombo | null>(null);
  const [completedMixes, setCompletedMixes] = useState(0);
  const [bucketShaking, setBucketShaking] = useState(false);
  const [feedback, setFeedback] = useState("");
  const targetCombination = colorCombinations[currentMixIndex];
  const distractorColor =
    mixColors.find((color) => !targetCombination.colors.includes(color.name)) ?? mixColors[0];
  const availableColors = mixColors.filter((color) =>
    [...targetCombination.colors, distractorColor.name].includes(color.name),
  );

  const resetSelection = () => {
    setPhase("selecting");
    setSelectedColors([]);
    setCurrentCombination(null);
    setBucketShaking(false);
    setFeedback("");
  };

  const startGame = () => {
    setStarted(true);
    setCompletedMixes(0);
    setCurrentMixIndex(0);
    resetSelection();
  };

  const handleColorSelect = (colorName: string) => {
    if (phase !== "selecting" || selectedColors.includes(colorName) || selectedColors.length >= 2) return;
    if (!targetCombination.colors.includes(colorName)) {
      setFeedback(`Pick ${targetCombination.colors[0]} and ${targetCombination.colors[1]}.`);
      return;
    }

    const nextColors = [...selectedColors, colorName];
    setSelectedColors(nextColors);
    if (nextColors.length === 2) {
      setCurrentCombination(targetCombination);
      setPhase("mixing");
      setFeedback("");
      setBucketShaking(true);

      window.setTimeout(() => {
        setBucketShaking(false);
        setPhase("result");
        setCompletedMixes((value) => {
          const nextValue = Math.min(value + 1, colorCombinations.length);
          if (nextValue === colorCombinations.length && value !== colorCombinations.length) {
            const currentStars = parseInt(localStorage.getItem("currentKidStars") || "0");
            localStorage.setItem("currentKidStars", (currentStars + 3).toString());
          }
          return nextValue;
        });
      }, 900);
    }
  };

  const handleNextMix = () => {
    setCurrentMixIndex((value) => (value + 1) % colorCombinations.length);
    resetSelection();
  };

  const instruction =
    phase === "mixing"
      ? "Mixing colors..."
      : phase === "result" && currentCombination
        ? `Look! We made ${currentCombination.result.toLowerCase()}!`
        : `Pick ${targetCombination.colors[0]} and ${targetCombination.colors[1]} to mix.`;

  const bucketColor =
    phase === "result" && currentCombination
      ? currentCombination.resultHex
      : "linear-gradient(to bottom, #E5E7EB, #D1D5DB)";
  const isLastMixComplete = phase === "result" && completedMixes >= colorCombinations.length;

  if (!started) {
    return (
      <div className="relative min-h-screen overflow-hidden app-sky-background px-4 py-5 text-slate-700 sm:px-7">
        <div className="relative z-10 mx-auto max-w-5xl">
          <KidioPageHeader backLabel="Back to Color World" backTo="/color-world" />

          <section className="mx-auto mt-12 max-w-3xl rounded-[2rem] bg-white/90 p-7 text-center shadow-xl ring-1 ring-white">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-violet-100 text-violet-600">
              <Palette className="h-14 w-14" />
            </div>
            <h1 className="mt-5 text-5xl font-black text-[#183B5B]">Mix Colors Lab</h1>
            <p className="mt-3 text-xl font-bold text-slate-500">
              Pick two colors and see what they make.
            </p>
            <button
              type="button"
              onClick={startGame}
              className="mt-7 inline-flex min-h-16 items-center justify-center gap-3 rounded-full bg-violet-500 px-10 py-4 text-xl font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-600"
            >
              <Play className="h-7 w-7 fill-white" />
              Play Now
            </button>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden app-sky-background px-4 py-5 text-slate-700 sm:px-7">
      <div className="relative z-10 mx-auto max-w-6xl">
        <KidioPageHeader
          backLabel="Back to Color World"
          backTo="/color-world"
          rightContent={
            <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-3 text-lg font-black text-amber-600 shadow-md">
              <Star className="h-6 w-6 fill-amber-300 text-amber-300" />
              Mix {currentMixIndex + 1} / {colorCombinations.length}
            </div>
          }
        />

        <main className="mt-7 rounded-[2rem] bg-white/92 p-5 text-center shadow-xl ring-1 ring-white sm:p-7">
          <h1 className="text-4xl font-black text-[#183B5B]">Mix Colors Lab</h1>
          <p className="mt-3 text-2xl font-black text-violet-700">{instruction}</p>

          {phase === "selecting" ? (
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {availableColors.map((color) => {
                const isSelected = selectedColors.includes(color.name);

                return (
                  <motion.button
                    key={color.name}
                    type="button"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleColorSelect(color.name)}
                    disabled={isSelected}
                    className={`flex h-24 w-24 flex-col items-center justify-center rounded-[1.5rem] text-base font-black shadow-lg transition ${
                      isSelected ? "scale-90 opacity-45" : "hover:shadow-xl"
                    }`}
                    style={{
                      backgroundColor: color.hex,
                      border: color.name === "White" ? "3px solid #E5E7EB" : "none",
                      color: color.name === "White" || color.name === "Yellow" ? "#334155" : "#FFFFFF",
                    }}
                  >
                    {color.name}
                  </motion.button>
                );
              })}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col items-center">
            <motion.div
              animate={
                bucketShaking
                  ? {
                      rotate: [0, -9, 9, -9, 9, 0],
                      scale: [1, 1.08, 1.08, 1.08, 1],
                    }
                  : {}
              }
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div
                className="relative h-44 w-56 overflow-hidden rounded-b-[3rem] rounded-t-2xl shadow-xl transition-colors duration-500"
                style={{ background: bucketColor }}
              >
                <div className="absolute left-4 top-4 bottom-4 w-6 rounded-full bg-white/30" />
                <div className="absolute top-11 left-1/2 flex -translate-x-1/2 items-center gap-8">
                  <div className="h-5 w-5 rounded-full bg-slate-700" />
                  <div className="h-5 w-5 rounded-full bg-slate-700" />
                </div>
                <div className="absolute top-24 left-1/2 h-5 w-12 -translate-x-1/2 rounded-b-full border-b-4 border-slate-700" />
                {phase !== "result" ? (
                  <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-3">
                    {selectedColors.map((colorName) => {
                      const color = mixColors.find((item) => item.name === colorName);
                      return color ? (
                        <motion.div
                          key={color.name}
                          initial={{ y: -30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="h-10 w-10 rounded-full shadow-md"
                          style={{
                            backgroundColor: color.hex,
                            border: color.name === "White" ? "2px solid #D1D5DB" : "none",
                          }}
                        />
                      ) : null;
                    })}
                  </div>
                ) : null}
              </div>
              <div className="absolute -top-7 left-1/2 h-10 w-40 -translate-x-1/2 rounded-t-full border-4 border-slate-400" />
            </motion.div>

            {phase === "mixing" ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-full bg-violet-100 px-6 py-3 text-xl font-black text-violet-700"
              >
                Mixing colors...
              </motion.div>
            ) : null}

            {feedback ? (
              <div className="mt-5 rounded-[1.25rem] bg-amber-100 px-5 py-4 text-lg font-black text-amber-700">
                {feedback}
              </div>
            ) : null}

            {phase === "result" && currentCombination ? (
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mt-7 w-full max-w-3xl rounded-[2rem] bg-white p-6 shadow-lg ring-1 ring-slate-100"
              >
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <ColorSwatch name={currentCombination.colors[0]} hex={currentCombination.hex1} />
                  <span className="text-4xl font-black text-[#183B5B]">+</span>
                  <ColorSwatch name={currentCombination.colors[1]} hex={currentCombination.hex2} />
                  <span className="text-4xl font-black text-[#183B5B]">=</span>
                  <ColorSwatch name={currentCombination.result} hex={currentCombination.resultHex} />
                </div>

                <p className="mt-6 text-3xl font-black text-[#183B5B]">
                  {currentCombination.colors[0]} + {currentCombination.colors[1]} = {currentCombination.result}
                </p>
                <p className="mt-2 text-2xl font-black text-slate-600">
                  {resultSentence(currentCombination)}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={resetSelection}
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-slate-100 px-6 py-3 text-lg font-black text-slate-700 shadow-md transition hover:bg-slate-200"
                  >
                    <RotateCcw className="h-5 w-5" />
                    Try Again
                  </button>
                  {isLastMixComplete ? (
                    <button
                      type="button"
                      onClick={() => navigate("/color-world")}
                      className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-lg font-black text-white shadow-md transition hover:bg-emerald-600"
                    >
                      Done
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextMix}
                      className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-lg font-black text-white shadow-md transition hover:bg-emerald-600"
                    >
                      Next Mix
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </motion.div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
