import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Sparkles, Volume2 } from "lucide-react";
import { numberWords } from "../../data/numberVillageData";
import { speak } from "../../utils/speech";

const learnNumbers = Array.from({ length: 11 }, (_, number) => number);

function NumberVisual({ number }: { number: number }) {
  if (number === 0) {
    return (
      <div className="flex h-16 items-center justify-center rounded-2xl bg-amber-50 px-3 text-center text-sm font-black text-amber-600">
        No stars
      </div>
    );
  }

  return (
    <div className="grid min-h-16 grid-cols-5 place-items-center gap-1 rounded-2xl bg-sky-50 p-2">
      {Array.from({ length: number }, (_, index) => (
        <span key={index} className="text-xl leading-none">
          ⭐
        </span>
      ))}
    </div>
  );
}

export function NumberLearningBoard({ onStartPractice }: { onStartPractice: () => void }) {
  const [tappedNumbers, setTappedNumbers] = useState<number[]>([]);
  const [activeNumber, setActiveNumber] = useState<number | null>(null);

  const handleTap = (number: number) => {
    setActiveNumber(number);
    setTappedNumbers((current) =>
      current.includes(number) ? current : [...current, number],
    );
    speak(numberWords[number]);
    window.setTimeout(() => setActiveNumber(null), 500);
  };

  const listenToAll = () => {
    speak(learnNumbers.map((number) => numberWords[number]).join(". "));
    setTappedNumbers(learnNumbers);
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mt-8 rounded-[2rem] bg-white/90 p-5 text-center shadow-xl ring-1 ring-white sm:p-8"
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-amber-100 text-amber-500 shadow-inner">
        <Sparkles className="h-11 w-11 fill-amber-300" />
      </div>

      <h2 className="mt-5 text-4xl font-black text-[#183B5B]">Meet the Numbers</h2>
      <p className="mt-2 text-xl font-bold text-slate-500">Tap a number to hear it!</p>

      <section className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {learnNumbers.map((number) => {
          const isTapped = tappedNumbers.includes(number);
          const isActive = activeNumber === number;

          return (
            <motion.button
              key={number}
              type="button"
              onClick={() => handleTap(number)}
              animate={isActive ? { scale: [1, 1.06, 1] } : {}}
              className={`relative min-h-48 rounded-[1.75rem] border-4 p-4 text-center shadow-md transition hover:-translate-y-0.5 hover:shadow-lg ${
                isTapped
                  ? "border-emerald-200 bg-emerald-50 ring-4 ring-emerald-100"
                  : "border-sky-100 bg-gradient-to-br from-white to-sky-50 hover:border-sky-200"
              }`}
            >
              {isTapped ? (
                <CheckCircle2 className="absolute right-3 top-3 h-7 w-7 text-emerald-500" />
              ) : null}
              <div className="text-6xl font-black leading-none text-sky-600">{number}</div>
              <div className="mt-2 text-xl font-black capitalize text-[#183B5B]">
                {numberWords[number]}
              </div>
              <div className="mt-3">
                <NumberVisual number={number} />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm font-black text-violet-600">
                <Volume2 className="h-5 w-5" />
                Tap to hear
              </div>
            </motion.button>
          );
        })}
      </section>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={listenToAll}
          className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-violet-100 px-7 py-3 text-lg font-black text-violet-700 shadow-md transition hover:bg-violet-200"
        >
          <Volume2 className="h-6 w-6" />
          Listen to all numbers
        </button>
        <button
          type="button"
          onClick={onStartPractice}
          className="min-h-14 rounded-full bg-[#2BADEE] px-8 py-3 text-xl font-black text-white shadow-lg shadow-sky-200 transition hover:bg-[#1E90D0]"
        >
          I'm Ready!
        </button>
      </div>
    </motion.main>
  );
}
