import React from "react";

export interface CountInIndicatorProps {
  isCountingIn: boolean;
  beatRemaining: number | null;
  totalBeats: number;
}

export const CountInIndicator: React.FC<CountInIndicatorProps> = ({
  isCountingIn,
  beatRemaining,
  totalBeats,
}) => {
  if (!isCountingIn || beatRemaining === null) return null;

  // Calculate current beat (1, 2, 3, 4) in the active measure
  const currentBeatInMeasure = 4 - ((beatRemaining - 1) % 4);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm rounded-2xl animate-in fade-in duration-150 p-2">
      <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
        <span className="text-[11px] sm:text-xs uppercase tracking-widest font-bold text-amber-400">
          Get Ready &bull; Count In
        </span>
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black text-3xl sm:text-4xl shadow-xl shadow-amber-500/40">
          {currentBeatInMeasure}
        </div>
        <div className="flex gap-2 mt-0.5">
          {[1, 2, 3, 4].map((b) => (
            <div
              key={b}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-150 ${
                b === currentBeatInMeasure
                  ? "bg-amber-400 scale-125 shadow-md shadow-amber-400/50"
                  : b < currentBeatInMeasure
                  ? "bg-amber-600/40"
                  : "bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
