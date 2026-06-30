import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Headphones, Palette, Play, Star, Volume2 } from "lucide-react";
import { KidioPageHeader } from "../../components/KidioPageHeader";

type ColorItem = {
  name: string;
  hex: string;
};

const basicColors: ColorItem[] = [
  { name: "Red", hex: "#EF4444" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Yellow", hex: "#FCD34D" },
  { name: "Green", hex: "#22C55E" },
  { name: "Orange", hex: "#F97316" },
  { name: "Purple", hex: "#8B5CF6" },
];

const moreColors: ColorItem[] = [
  { name: "Pink", hex: "#EC4899" },
  { name: "Black", hex: "#1F2937" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Brown", hex: "#A16207" },
  { name: "Gray", hex: "#9CA3AF" },
];

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const clearEnglishVoice =
    voices.find((voice) => voice.lang === "en-US" && /female|samantha|jenny|aria|zira/i.test(voice.name)) ??
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

function ColorCard({
  color,
  onListen,
}: {
  color: ColorItem;
  onListen: (colorName: string) => void;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onListen(color.name)}
      className="flex min-h-40 flex-col items-center justify-center rounded-[1.5rem] bg-white p-4 text-center shadow-md ring-1 ring-slate-100 transition hover:shadow-lg"
    >
      <span
        className="h-20 w-20 rounded-[1.35rem] shadow-md"
        style={{
          backgroundColor: color.hex,
          border: color.name === "White" ? "2px solid #E5E7EB" : "none",
        }}
      />
      <span className="mt-3 text-2xl font-black text-[#183B5B]">{color.name}</span>
      <span className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-base font-black text-sky-700">
        <Volume2 className="h-5 w-5" />
        Listen
      </span>
    </motion.button>
  );
}

export function ColorGamesPage() {
  const navigate = useNavigate();

  const listenToColor = (colorName: string) => {
    speak(colorName);
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
          backLabel="Back to Journey"
          backTo="/learning-map"
          title={
            <div className="text-center">
              <h1 className="text-3xl font-black text-[#183B5B] sm:text-5xl">
                Color World
              </h1>
              <p className="mt-2 text-lg font-bold text-slate-500 sm:text-xl">
                Learn color names, listen, and play!
              </p>
            </div>
          }
          rightContent={
            <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-3 text-lg font-black text-amber-600 shadow-md">
              <Star className="h-6 w-6 fill-amber-300 text-amber-300" />
              0
            </div>
          }
        />

        <main className="mt-7 space-y-7">
          <section className="grid items-center gap-5 rounded-[2rem] bg-white/88 p-5 shadow-xl ring-1 ring-white lg:grid-cols-[1.1fr_.9fr] lg:p-7">
            <div className="relative min-h-72 overflow-hidden rounded-[1.75rem] bg-[linear-gradient(135deg,#FFE6F0_0%,#EAF7FF_48%,#FFF3C7_100%)] p-6">
              <div className="absolute left-7 top-7 h-16 w-16 rounded-full bg-red-300 shadow-lg" />
              <div className="absolute left-24 top-12 h-16 w-16 rounded-full bg-yellow-300 shadow-lg" />
              <div className="absolute left-16 top-28 h-16 w-16 rounded-full bg-blue-300 shadow-lg" />
              <div className="absolute right-5 top-7 grid h-44 w-44 grid-cols-3 gap-2 rounded-full bg-white/85 p-6 shadow-xl sm:right-8">
                {basicColors.map((color) => (
                  <span key={color.name} className="rounded-full" style={{ backgroundColor: color.hex }} />
                ))}
              </div>
              <Palette className="absolute bottom-7 left-1/2 h-28 w-28 -translate-x-1/2 text-violet-500 drop-shadow-md" />
            </div>
            <div className="text-center lg:text-left">
              <p className="text-lg font-black text-sky-600">Welcome to Color World!</p>
              <h2 className="mt-2 text-4xl font-black leading-tight text-[#183B5B]">
                Listen, tap, and play with colors.
              </h2>
              <p className="mt-3 text-xl font-bold text-slate-500">
                Learn color names, then play a quick color game.
              </p>
              <button
                type="button"
                onClick={() => speak("Welcome to Color World. Listen, tap, and play with colors.")}
                className="mt-6 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-sky-500 px-8 py-3 text-xl font-black text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600"
              >
                <Headphones className="h-6 w-6" />
                Listen
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white/90 p-5 shadow-xl ring-1 ring-white">
            <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <div>
                <h2 className="text-3xl font-black text-[#183B5B]">Color Game</h2>
                <p className="text-base font-bold text-slate-500">
                  Find colorful things and learn colors.
                </p>
              </div>
              <div className="rounded-full bg-violet-100 px-5 py-3 text-lg font-black text-violet-700">
                6 rounds
              </div>
            </div>

            <div className="mt-5 rounded-[1.75rem] bg-[linear-gradient(135deg,#EAF7FF_0%,#F4ECFF_100%)] p-5 text-center shadow-inner sm:p-6">
              <h3 className="text-4xl font-black text-[#183B5B]">Choose a game</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] bg-white p-5 text-center shadow-md ring-1 ring-violet-100">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-violet-100 text-3xl">
                    🎨
                  </div>
                  <h4 className="mt-4 text-3xl font-black text-[#183B5B]">Color Hunt</h4>
                  <p className="mt-2 text-lg font-bold text-slate-500">
                    Find colorful things.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/color-world/color-hunt")}
                    className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-violet-500 px-7 py-3 text-lg font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-600"
                  >
                    <Play className="h-6 w-6 fill-white" />
                    Start
                  </button>
                </div>

                <div className="rounded-[1.5rem] bg-white p-5 text-center shadow-md ring-1 ring-sky-100">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-sky-100 text-3xl">
                    🧪
                  </div>
                  <h4 className="mt-4 text-3xl font-black text-[#183B5B]">Mix Colors</h4>
                  <p className="mt-2 text-lg font-bold text-slate-500">
                    Mix two colors.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/color-world/mix")}
                    className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-sky-500 px-7 py-3 text-lg font-black text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600"
                  >
                    <Play className="h-6 w-6 fill-white" />
                    Play
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white/90 p-5 shadow-xl ring-1 ring-white">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-black text-[#183B5B]">Learn Colors</h2>
              <p className="text-base font-bold text-slate-500">Tap a color and listen.</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {basicColors.map((color) => (
                  <ColorCard key={color.name} color={color} onListen={listenToColor} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mx-auto lg:max-w-5xl lg:grid-cols-5">
                {moreColors.map((color) => (
                  <ColorCard key={color.name} color={color} onListen={listenToColor} />
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
