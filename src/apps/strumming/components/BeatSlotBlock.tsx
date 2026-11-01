import React from "react";
import { BeatSlot, StrokeDirection } from "../types";
import { ArrowDown, ArrowUp } from "lucide-react";

export interface BeatSlotBlockProps {
  slot: BeatSlot;
  onClick?: (index: number) => void;
  isInteractive?: boolean;
}

export const BeatSlotBlock: React.FC<BeatSlotBlockProps> = ({
  slot,
  onClick,
  isInteractive = true,
}) => {
  const getDirectionVisual = (direction: StrokeDirection) => {
    switch (direction) {
      case "down":
        return (
          <div className="w-9 h-11 sm:w-11 sm:h-14 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <ArrowDown className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.5]" />
          </div>
        );
      case "up":
        return (
          <div className="w-9 h-11 sm:w-11 sm:h-14 rounded-xl bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <ArrowUp className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.5]" />
          </div>
        );
      case "none":
      default:
        return (
          <div className="w-9 h-11 sm:w-11 sm:h-14 rounded-xl border border-dashed border-slate-700/80 bg-slate-900/40 flex items-center justify-center text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
          </div>
        );
    }
  };

  return (
    <button
      type="button"
      onClick={() => onClick?.(slot.index)}
      disabled={!isInteractive}
      aria-label={`Beat ${slot.beatLabel}: ${slot.strokeDirection === "none" ? "Rest" : slot.strokeDirection + " stroke"}`}
      className={`flex flex-col items-center justify-between p-1 sm:p-2 rounded-xl transition-all select-none min-h-[44px] min-w-[44px] ${
        isInteractive ? "hover:bg-slate-800/60 active:scale-95 cursor-pointer" : "cursor-default"
      } ${slot.isMeasureStart ? "bg-amber-500/5 ring-1 ring-amber-500/20" : ""}`}
    >
      <div className="flex items-center justify-center mb-1">
        <span
          className={`text-xs font-mono font-bold ${
            slot.isMeasureStart
              ? "text-amber-400 font-extrabold text-sm"
              : slot.isQuarterBeat
              ? "text-slate-200"
              : "text-slate-500"
          }`}
        >
          {slot.beatLabel}
        </span>
      </div>

      <div className="my-auto flex items-center justify-center">
        {getDirectionVisual(slot.strokeDirection)}
      </div>

      <div className="mt-1 h-1 w-full flex justify-center">
        {slot.isQuarterBeat && (
          <div
            className={`h-1 rounded-full ${
              slot.isMeasureStart ? "w-4 bg-amber-400" : "w-2 bg-slate-600"
            }`}
          />
        )}
      </div>
    </button>
  );
};
