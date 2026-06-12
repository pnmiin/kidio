import { Gamepad2 } from "lucide-react";

export function JourneyPracticeCTA({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border-4 border-white bg-gradient-to-r from-violet-500 to-sky-500 px-6 py-3 text-left text-white shadow-[0_18px_40px_rgba(99,102,241,0.34)] transition hover:-translate-y-1 sm:px-8"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
        <Gamepad2 className="h-6 w-6" />
      </span>
      <span>
        <span className="block text-lg font-black">Review &amp; Play</span>
        <span className="block text-xs font-semibold text-white/85">
          Practice what you&apos;ve learned!
        </span>
      </span>
    </button>
  );
}
