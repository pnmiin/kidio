import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useDrag, useDrop } from "react-dnd";
import { Check, Star, Play, RotateCcw } from "lucide-react";
import { KidioPageHeader } from "../../components/KidioPageHeader";

const ItemTypes = {
  FURNITURE: "furniture",
};

type FurnitureItem = {
  id: string;
  word: string;
  emoji: string;
  position: { top: string; left: string; width: string; height: string };
};

const homeItems: FurnitureItem[] = [
  {
    id: "bed",
    word: "Bed",
    emoji: "🛏️",
    position: { top: "60%", left: "15%", width: "20%", height: "20%" },
  },
  {
    id: "door",
    word: "Door",
    emoji: "🚪",
    position: { top: "45%", left: "45%", width: "15%", height: "35%" },
  },
  {
    id: "window",
    word: "Window",
    emoji: "🪟",
    position: { top: "30%", left: "75%", width: "15%", height: "25%" },
  },
  {
    id: "chair",
    word: "Chair",
    emoji: "🪑",
    position: { top: "70%", left: "65%", width: "15%", height: "20%" },
  },
  {
    id: "tv",
    word: "TV",
    emoji: "📺",
    position: { top: "40%", left: "10%", width: "15%", height: "20%" },
  },
];

function shuffleArray<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function DraggableFurniture({ item, matched, isWrong }: { item: FurnitureItem, matched: boolean, isWrong: boolean }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.FURNITURE,
    item: { id: item.id },
    canDrag: !matched,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [matched, item.id]);

  return (
    <button
      ref={dragRef as any}
      type="button"
      disabled={matched}
      className={`relative flex min-h-32 flex-col items-center justify-center rounded-[1.5rem] bg-white p-4 shadow-sm transition ${
        matched
          ? "opacity-30 cursor-default"
          : isDragging
            ? "opacity-50 cursor-grabbing bg-sky-50"
            : isWrong
              ? "bg-red-50 text-red-600 animate-pulse cursor-grab"
              : "hover:bg-sky-50 cursor-grab ring-2 ring-transparent hover:ring-sky-200"
      }`}
    >
      <span className="text-6xl">{item.emoji}</span>
    </button>
  );
}

function DroppableShadow({ item, matched, isWrong, onDrop }: { item: FurnitureItem, matched: boolean, isWrong: boolean, onDrop: (id: string) => void }) {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: ItemTypes.FURNITURE,
    drop: (dropped: { id: string }) => onDrop(dropped.id),
    canDrop: () => !matched,
    collect: (monitor) => ({
      isOver: monitor.isOver() && monitor.canDrop(),
    }),
  }), [matched, onDrop]);

  return (
    <motion.div
      ref={dropRef as any}
      animate={isWrong ? { x: [0, -8, 8, -8, 8, 0] } : {}}
      style={{
        position: 'absolute',
        top: item.position.top,
        left: item.position.left,
        width: item.position.width,
        height: item.position.height,
      }}
      className={`flex flex-col items-center justify-center transition-all ${
        matched
          ? ""
          : isOver
            ? "scale-110"
            : ""
      }`}
    >
      {matched ? (
        <div className="relative flex flex-col items-center">
          <span className="text-7xl lg:text-8xl filter drop-shadow-lg">{item.emoji}</span>
          <div className="absolute -top-4 -right-4 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md z-10">
            <Check className="h-5 w-5 stroke-[4]" />
          </div>
        </div>
      ) : (
        <div className={`flex w-full h-full flex-col items-center justify-center rounded-xl border-4 border-dashed bg-black/40 backdrop-blur-sm transition-colors ${isOver ? 'border-sky-300 bg-sky-900/50' : 'border-white/50'}`}>
          <span className="text-xl lg:text-2xl font-black text-white px-2 py-1 bg-black/30 rounded-lg">{item.word}</span>
        </div>
      )}
    </motion.div>
  );
}

export function MyHomeGame() {
  const navigate = useNavigate();
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [isIntro, setIsIntro] = useState(true);

  const draggableItems = useMemo(() => shuffleArray(homeItems), []);
  const isCompleted = matchedIds.length === homeItems.length;

  useEffect(() => {
    if (isCompleted) {
      const currentStars = parseInt(localStorage.getItem("currentKidStars") || "0");
      localStorage.setItem("currentKidStars", (currentStars + 5).toString());
    }
  }, [isCompleted]);

  const handleDrop = (draggedId: string, targetId: string) => {
    if (matchedIds.includes(targetId)) return;

    if (draggedId === targetId) {
      const nextMatched = [...matchedIds, targetId];
      setMatchedIds(nextMatched);
      setFeedback("Great job!");
      setWrongId(null);

      // Play correct sound or TTS here
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(homeItems.find(i => i.id === targetId)?.word || "");
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
      }
    } else {
      setFeedback("Try again!");
      setWrongId(targetId);
      window.setTimeout(() => setWrongId(null), 600);
    }
  };

  const resetGame = () => {
    setMatchedIds([]);
    setFeedback("");
    setWrongId(null);
  };

  if (isIntro) {
    return (
      <div className="min-h-screen bg-sky-50 px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <KidioPageHeader
            backLabel="Back to Map"
            backTo="/learning-journey"
            title={<h1 className="text-3xl font-black text-[#183B5B]">My Home</h1>}
          />
          <main className="mt-8 rounded-[2rem] bg-white p-8 text-center shadow-xl">
            <div className="text-8xl mb-6">🏠</div>
            <h2 className="text-5xl font-black text-[#183B5B]">Room Decorator</h2>
            <p className="mt-4 text-2xl font-bold text-slate-500">
              Match the objects to furnish the room!
            </p>
            <button
              type="button"
              onClick={() => setIsIntro(false)}
              className="mt-8 inline-flex min-h-14 items-center gap-2 rounded-full bg-emerald-500 px-10 py-3 text-xl font-black text-white shadow-lg transition hover:bg-emerald-600 hover:scale-105"
            >
              <Play className="h-6 w-6" />
              Play Game
            </button>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 px-4 py-5 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <KidioPageHeader
          backLabel="Back"
          backTo="/learning-journey"
          title={<h1 className="text-2xl font-black text-[#183B5B]">Room Decorator</h1>}
          rightContent={
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-lg font-black text-amber-600 shadow-sm">
              <Star className="h-5 w-5 fill-amber-300 text-amber-300" />
              {matchedIds.length} / {homeItems.length}
            </div>
          }
        />

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Main Room Area */}
          <div className="relative flex-1 rounded-[2rem] bg-white p-2 shadow-lg overflow-hidden">
            <div className="relative aspect-[4/3] w-full rounded-[1.5rem] bg-sky-100 overflow-hidden">
              {/* Background Image */}
              <img
                src="/assets/my_home_room.png"
                alt="Room Background"
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
              
              {/* Drop Zones */}
              {homeItems.map((item) => (
                <DroppableShadow
                  key={item.id}
                  item={item}
                  matched={matchedIds.includes(item.id)}
                  isWrong={wrongId === item.id}
                  onDrop={(draggedId) => handleDrop(draggedId, item.id)}
                />
              ))}

              {/* Completion Overlay */}
              {isCompleted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-20"
                >
                  <div className="text-7xl mb-4">🎉</div>
                  <h2 className="text-5xl font-black text-[#183B5B]">Perfect!</h2>
                  <p className="mt-2 text-2xl font-bold text-slate-600">+5 Stars</p>
                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={resetGame}
                      className="flex items-center gap-2 rounded-full bg-sky-100 px-6 py-3 text-lg font-black text-sky-700 hover:bg-sky-200"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Play Again
                    </button>
                    <button
                      onClick={() => navigate("/learning-journey")}
                      className="rounded-full bg-emerald-500 px-8 py-3 text-lg font-black text-white hover:bg-emerald-600"
                    >
                      Next Lesson
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Draggable Items Sidebar */}
          <div className="flex shrink-0 flex-row gap-3 overflow-x-auto pb-4 lg:w-72 lg:flex-col lg:overflow-visible lg:pb-0">
            {draggableItems.map((item) => (
              <DraggableFurniture
                key={item.id}
                item={item}
                matched={matchedIds.includes(item.id)}
                isWrong={false}
              />
            ))}
          </div>
        </div>

        {feedback && !isCompleted ? (
          <div className="mt-6 mx-auto max-w-sm text-center">
            <div className={`rounded-xl px-4 py-3 text-xl font-black ${
              feedback === "Great job!" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            }`}>
              {feedback}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
