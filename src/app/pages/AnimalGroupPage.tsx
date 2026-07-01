import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { useDrag, useDrop } from "react-dnd";
import { Check, Gamepad2, Headphones, Mic, Star } from "lucide-react";
import { KidioPageHeader } from "../../components/KidioPageHeader";
import {
  AnimalGroupId,
  AnimalItem,
  getAnimalGroup,
  getAnimalsByGroup,
  saveAnimalGroupCompleted,
} from "../data/animalData";
import { submitGameProgress } from "../utils/gameProgress";

type FlowStep = "intro" | "learn" | "game" | "complete";

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

  if (clearEnglishVoice) utterance.voice = clearEnglishVoice;
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  utterance.pitch = 1.08;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

function shuffleArray<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function AnimalVisual({
  animal,
  size = "large",
}: {
  animal: AnimalItem;
  size?: "small" | "large";
}) {
  if (animal.image) {
    return (
      <img
        src={animal.image}
        alt={animal.word}
        className={`${size === "large" ? "h-32 w-32" : "h-24 w-24 sm:h-28 sm:w-28"} object-contain`}
      />
    );
  }

  return (
    <span className={size === "large" ? "text-8xl" : "text-6xl"}>
      {animal.icon}
    </span>
  );
}

function ChoiceCard({
  animal,
  selected,
  matched,
  onClick,
}: {
  animal: AnimalItem;
  selected?: boolean;
  matched?: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: matched ? 0 : -4 }}
      whileTap={{ scale: matched ? 1 : 0.96 }}
      onClick={onClick}
      disabled={matched}
      className={`relative flex min-h-48 flex-col items-center justify-center rounded-[1.5rem] bg-white p-4 text-center shadow-md ring-4 transition ${
        matched
          ? "opacity-70 ring-emerald-300"
          : selected
            ? "ring-sky-400"
            : "ring-transparent hover:ring-sky-100"
      }`}
    >
      {matched ? (
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check className="h-5 w-5 stroke-[4]" />
        </span>
      ) : null}
      <AnimalVisual animal={animal} size="small" />
      <span className="mt-3 text-xl font-black text-[#183B5B]">
        {animal.word}
      </span>
    </motion.button>
  );
}

function makeChoices(answer: AnimalItem, animals: AnimalItem[], count = 4) {
  const wrong = shuffleArray(
    animals.filter((animal) => animal.id !== answer.id),
  ).slice(0, count - 1);
  return shuffleArray([answer, ...wrong]);
}

function PetsGame({
  animals,
  onComplete,
}: {
  animals: AnimalItem[];
  onComplete: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const answer = animals[index];
  const choices = useMemo(
    () => makeChoices(answer, animals),
    [answer, animals],
  );

  const choose = (animal: AnimalItem) => {
    if (answeredCorrectly) return;

    if (animal.id !== answer.id) {
      setFeedback("Try again!");
      return;
    }

    setFeedback("Great job!");
    setAnsweredCorrectly(true);
  };

  const nextQuestion = () => {
    if (index === animals.length - 1) {
      onComplete();
      return;
    }

    setIndex((value) => value + 1);
    setFeedback("");
    setAnsweredCorrectly(false);
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-lg font-black text-emerald-600">
          {index + 1} / {animals.length}
        </p>
        <h2 className="text-4xl font-black text-[#183B5B]">Who Lives Here?</h2>
      </div>
      <div className="mx-auto max-w-md rounded-[1.75rem] bg-amber-50 p-6 text-center shadow-inner">
        <div className="relative mx-auto flex min-h-36 max-w-xs items-center justify-center rounded-[1.5rem] bg-white/80 p-5 shadow-sm">
          {answer.homeImage ? (
            <img
              src={answer.homeImage}
              alt={answer.homeName}
              className="h-28 w-28 object-contain"
            />
          ) : (
            <div className="text-8xl">{answer.homeIcon}</div>
          )}
          <div className="absolute bottom-3 right-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-4xl shadow-md ring-2 ring-amber-100">
            {answer.clueItemImage ? (
              <img
                src={answer.clueItemImage}
                alt={answer.clueItemName}
                className="h-12 w-12 object-contain"
              />
            ) : (
              answer.clueItemIcon
            )}
          </div>
        </div>
        <p className="mt-3 text-3xl font-black text-[#183B5B]">
          {answer.homeName}
        </p>
        <p className="mt-2 text-xl font-black text-slate-600">
          Who lives here?
        </p>
        <button
          type="button"
          onClick={() => speak("Who lives here?")}
          className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-sky-500 px-6 py-2 text-lg font-black text-white shadow-md"
        >
          <Headphones className="h-5 w-5" />
          Listen
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {choices.map((animal) => (
          <ChoiceCard
            key={animal.id}
            animal={animal}
            onClick={() => choose(animal)}
          />
        ))}
      </div>
      {feedback ? (
        <Feedback text={feedback} correct={feedback === "Great job!"} />
      ) : null}
      {answeredCorrectly ? (
        <div className="text-center">
          <button
            type="button"
            onClick={nextQuestion}
            className="min-h-14 rounded-full bg-emerald-500 px-10 py-3 text-xl font-black text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-600"
          >
            {index === animals.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

const ItemTypes = {
  WORD: "word",
};

function DraggableWord({ animal, matched, isWrong }: { animal: AnimalItem, matched: boolean, isWrong: boolean }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.WORD,
    item: { id: animal.id },
    canDrag: !matched,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [matched, animal.id]);

  return (
    <button
      ref={dragRef as any}
      type="button"
      disabled={matched}
      className={`min-h-36 flex items-center justify-center rounded-[1.5rem] px-4 text-xl font-black shadow-sm transition ${
        matched
          ? "bg-emerald-100 text-emerald-700 opacity-50 cursor-default"
          : isDragging
            ? "bg-sky-200 text-sky-800 opacity-50 cursor-grabbing"
            : isWrong
              ? "bg-red-100 text-red-600 animate-pulse cursor-grab"
              : "bg-white text-[#183B5B] hover:bg-sky-100 cursor-grab"
      }`}
    >
      {animal.word}
    </button>
  );
}

function DroppableAnimal({ animal, matched, isWrong, onDrop }: { animal: AnimalItem, matched: boolean, isWrong: boolean, onDrop: (wordId: string) => void }) {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: ItemTypes.WORD,
    drop: (item: { id: string }) => onDrop(item.id),
    canDrop: () => !matched,
    collect: (monitor) => ({
      isOver: monitor.isOver() && monitor.canDrop(),
    }),
  }), [matched, onDrop]);

  return (
    <motion.div
      ref={dropRef as any}
      animate={isWrong ? { x: [0, -8, 8, -8, 8, 0] } : {}}
      className={`relative flex min-h-36 flex-col items-center justify-center rounded-[1.5rem] bg-white p-4 text-center shadow-md ring-4 transition ${
        matched
          ? "ring-emerald-300"
          : isOver
            ? "ring-sky-400 scale-105"
            : "ring-transparent"
      }`}
    >
      {matched ? (
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check className="h-5 w-5 stroke-[4]" />
        </span>
      ) : null}
      <AnimalVisual animal={animal} size="small" />
      {matched ? (
        <span className="mt-3 text-xl font-black text-[#183B5B]">
          {animal.word}
        </span>
      ) : null}
    </motion.div>
  );
}

function FarmGame({
  animals,
  onComplete,
}: {
  animals: AnimalItem[];
  onComplete: () => void;
}) {
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [roundIndex, setRoundIndex] = useState(0);
  const [showNextRound, setShowNextRound] = useState(false);
  const [wrongAnimalId, setWrongAnimalId] = useState<string | null>(null);

  const rounds = useMemo(
    () => [animals.slice(0, 4), animals.slice(4, 8)],
    [animals],
  );
  const roundAnimals = rounds[roundIndex] ?? [];
  const wordCards = useMemo(() => shuffleArray(roundAnimals), [roundAnimals]);
  const iconCards = useMemo(() => shuffleArray(roundAnimals), [roundAnimals]);

  const handleDrop = (wordId: string, animalId: string) => {
    if (matchedIds.includes(animalId)) return;

    if (wordId === animalId) {
      const nextMatched = [...matchedIds, animalId];
      setMatchedIds(nextMatched);
      setFeedback("Great job!");
      setWrongAnimalId(null);
      
      const nextRoundMatchedCount = roundAnimals.filter((roundAnimal) =>
        nextMatched.includes(roundAnimal.id),
      ).length;

      if (nextMatched.length === animals.length) {
        window.setTimeout(onComplete, 700);
      } else if (nextRoundMatchedCount === roundAnimals.length) {
        window.setTimeout(() => {
          setShowNextRound(true);
          setFeedback("");
        }, 500);
      }
    } else {
      setFeedback("Try again!");
      setWrongAnimalId(animalId);
      window.setTimeout(() => setWrongAnimalId(null), 600);
    }
  };

  if (showNextRound) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-5xl">
          ⭐
        </div>
        <h2 className="text-5xl font-black text-[#183B5B]">Great job!</h2>
        <p className="text-2xl font-black text-slate-600">Next round!</p>
        <button
          type="button"
          onClick={() => {
            setRoundIndex(1);
            setFeedback("");
            setShowNextRound(false);
          }}
          className="min-h-14 rounded-full bg-emerald-500 px-10 py-3 text-xl font-black text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-600"
        >
          Next Round
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full bg-sky-100 px-4 py-2 text-base font-black text-sky-700">
            Drag a word to the matching animal.
          </span>
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-base font-black text-emerald-700">
            {matchedIds.length} / {animals.length} matched
          </span>
          <span className="rounded-full bg-violet-100 px-4 py-2 text-base font-black text-violet-700">
            Round {roundIndex + 1} / 2
          </span>
        </div>
        <h2 className="text-4xl font-black text-[#183B5B]">Match the Animal</h2>
      </div>
      <div className="grid items-stretch gap-5 lg:grid-cols-2">
        <div className="flex h-full flex-col rounded-[1.75rem] bg-sky-50 p-5">
          <h3 className="mb-4 text-2xl font-black text-[#183B5B]">Words</h3>
          <div className="grid flex-1 grid-cols-2 gap-3">
            {wordCards.map((animal) => (
              <DraggableWord 
                key={animal.id} 
                animal={animal} 
                matched={matchedIds.includes(animal.id)} 
                isWrong={false} 
              />
            ))}
          </div>
        </div>
        <div className="flex h-full flex-col rounded-[1.75rem] bg-emerald-50 p-5">
          <h3 className="mb-4 text-2xl font-black text-[#183B5B]">Animals</h3>
          <div className="grid flex-1 grid-cols-2 gap-3">
            {iconCards.map((animal) => (
              <DroppableAnimal
                key={animal.id}
                animal={animal}
                matched={matchedIds.includes(animal.id)}
                isWrong={wrongAnimalId === animal.id}
                onDrop={(wordId) => handleDrop(wordId, animal.id)}
              />
            ))}
          </div>
        </div>
      </div>
      {feedback ? (
        <Feedback text={feedback} correct={feedback === "Great job!"} />
      ) : null}
    </div>
  );
}

function WildGame({
  animals,
  onComplete,
}: {
  animals: AnimalItem[];
  onComplete: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const answer = animals[index];
  const choices = useMemo(
    () => makeChoices(answer, animals),
    [answer, animals],
  );

  const choose = (animal: AnimalItem) => {
    if (animal.id !== answer.id) {
      setFeedback("Try again!");
      return;
    }

    setFeedback("Great job!");
    window.setTimeout(() => {
      if (index === animals.length - 1) {
        onComplete();
      } else {
        setIndex((value) => value + 1);
        setFeedback("");
      }
    }, 650);
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-lg font-black text-emerald-600">
          {index + 1} / {animals.length}
        </p>
        <h2 className="text-4xl font-black text-[#183B5B]">
          Listen and Choose
        </h2>
        <p className="mt-2 text-xl font-bold text-slate-500">
          Listen and choose the correct animal.
        </p>
        <button
          type="button"
          onClick={() => speak(`Find the ${answer.word.toLowerCase()}.`)}
          className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-sky-500 px-6 py-2 text-lg font-black text-white shadow-md"
        >
          <Headphones className="h-5 w-5" />
          Listen Again
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {choices.map((animal) => (
          <ChoiceCard
            key={animal.id}
            animal={animal}
            onClick={() => choose(animal)}
          />
        ))}
      </div>
      {feedback ? (
        <Feedback text={feedback} correct={feedback === "Great job!"} />
      ) : null}
    </div>
  );
}

function Feedback({ text, correct }: { text: string; correct: boolean }) {
  return (
    <div
      className={`mx-auto max-w-md rounded-[1.25rem] px-5 py-4 text-center text-xl font-black ${
        correct
          ? "bg-emerald-100 text-emerald-700"
          : "bg-amber-100 text-amber-700"
      }`}
    >
      {text}
    </div>
  );
}

export function AnimalGroupPage() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const group = getAnimalGroup(groupId);
  const animals = useMemo(
    () => (group ? getAnimalsByGroup(group.id as AnimalGroupId) : []),
    [group],
  );
  const [step, setStep] = useState<FlowStep>("intro");
  const [learnIndex, setLearnIndex] = useState(0);
  const [sayMessage, setSayMessage] = useState("");

  if (!group) {
    return (
      <div className="min-h-screen app-sky-background px-6 py-8 text-center">
        <h1 className="text-4xl font-black text-[#183B5B]">
          Animal group not found
        </h1>
        <button
          type="button"
          onClick={() => navigate("/animal-island")}
          className="mt-6 rounded-full bg-emerald-500 px-8 py-3 text-lg font-black text-white"
        >
          Back to Animal Island
        </button>
      </div>
    );
  }

  const currentAnimal = animals[learnIndex];
  const [startTime] = useState<number>(() => Date.now());
  const finishGroup = () => {
    saveAnimalGroupCompleted(group.id);
    const currentStars = parseInt(localStorage.getItem("currentKidStars") || "0");
    localStorage.setItem("currentKidStars", (currentStars + 3).toString());
    submitGameProgress(100, startTime);
    setStep("complete");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden app-sky-background px-4 py-5 text-slate-700 sm:px-7">
      <div className="relative z-10 mx-auto max-w-6xl">
        <KidioPageHeader
          backLabel="Back to Animal Island"
          backTo="/animal-island"
          title={
            <div className="text-center">
              <h1 className="text-3xl font-black text-[#183B5B] sm:text-5xl">
                {group.title}
              </h1>
              <p className="mt-2 text-lg font-bold text-slate-500 sm:text-xl">
                {group.subtitle}
              </p>
            </div>
          }
          rightContent={
            <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-3 text-lg font-black text-amber-600 shadow-md">
              <Star className="h-6 w-6 fill-amber-300 text-amber-300" />
              +3
            </div>
          }
        />

        <main className="mt-7 rounded-[2rem] bg-white/92 p-5 shadow-xl ring-1 ring-white sm:p-7">
          {step === "intro" ? (
            <section className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-[2rem] bg-emerald-100 p-4 text-7xl">
                {group.image ? (
                  <img
                    src={group.image}
                    alt={group.title}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  group.icon
                )}
              </div>
              <h2 className="mt-5 text-5xl font-black text-[#183B5B]">
                {group.title}
              </h2>
              <p className="mt-3 text-2xl font-bold text-slate-500">
                Listen, learn, and play!
              </p>
              <div className="mt-7 grid gap-3 lg:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setStep("learn")}
                  className="min-h-14 rounded-full bg-emerald-500 px-8 py-3 text-lg font-black text-white shadow-lg shadow-emerald-200"
                >
                  Start Learning
                </button>
                <button
                  type="button"
                  onClick={() => setStep("game")}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-violet-500 px-8 py-3 text-lg font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-600"
                >
                  <Gamepad2 className="h-5 w-5" />
                  Play Game
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/animal-island")}
                  className="min-h-14 rounded-full bg-sky-100 px-8 py-3 text-lg font-black text-sky-700 shadow-md"
                >
                  Back to Animal Island
                </button>
              </div>
            </section>
          ) : null}

          {step === "learn" && currentAnimal ? (
            <section className="mx-auto max-w-3xl text-center">
              <p className="text-lg font-black text-emerald-600">
                {learnIndex + 1} / {animals.length}
              </p>
              <div className="mx-auto mt-4 flex min-h-72 flex-col items-center justify-center rounded-[2rem] bg-emerald-50 p-6 shadow-inner">
                <AnimalVisual animal={currentAnimal} />
                <h2 className="mt-5 text-5xl font-black text-[#183B5B]">
                  {currentAnimal.word}
                </h2>
                <p className="mt-2 text-2xl font-black text-slate-600">
                  {currentAnimal.sentence}
                </p>
              </div>
              {sayMessage ? <Feedback text={sayMessage} correct /> : null}
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => speak(currentAnimal.audioText)}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-lg font-black text-white shadow-md"
                >
                  <Headphones className="h-5 w-5" />
                  Listen
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSayMessage("Great speaking!");
                    window.setTimeout(() => setSayMessage(""), 1000);
                  }}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-violet-500 px-6 py-3 text-lg font-black text-white shadow-md"
                >
                  <Mic className="h-5 w-5" />
                  Say it
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (learnIndex === animals.length - 1) {
                      setStep("game");
                    } else {
                      setLearnIndex((value) => value + 1);
                    }
                  }}
                  className="min-h-14 rounded-full bg-emerald-500 px-6 py-3 text-lg font-black text-white shadow-md"
                >
                  {learnIndex === animals.length - 1 ? "Play Game" : "Next"}
                </button>
              </div>
            </section>
          ) : null}

          {step === "game" && group.id === "pets" ? (
            <PetsGame animals={animals} onComplete={finishGroup} />
          ) : null}
          {step === "game" && group.id === "farm" ? (
            <FarmGame animals={animals} onComplete={finishGroup} />
          ) : null}
          {step === "game" && group.id === "wild" ? (
            <WildGame animals={animals} onComplete={finishGroup} />
          ) : null}

          {step === "complete" ? (
            <section className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 text-5xl">
                ⭐
              </div>
              <h2 className="mt-5 text-5xl font-black text-[#183B5B]">
                Great job!
              </h2>
              <p className="mt-3 text-2xl font-black text-slate-600">
                You finished {group.title}!
              </p>
              <p className="mt-3 text-3xl font-black text-amber-600">
                +3 stars
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => navigate("/animal-island")}
                  className="min-h-14 rounded-full bg-emerald-500 px-8 py-3 text-lg font-black text-white shadow-md"
                >
                  Back to Animal Island
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLearnIndex(0);
                    setStep("intro");
                  }}
                  className="min-h-14 rounded-full bg-sky-100 px-8 py-3 text-lg font-black text-sky-700 shadow-md"
                >
                  Play Again
                </button>
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}
