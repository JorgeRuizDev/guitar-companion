import React, { useRef, useEffect } from "react";
import { StrummingPattern } from "../types";
import { BeatSlotBlock } from "./BeatSlotBlock";
import { CountInIndicator } from "./CountInIndicator";
import { AnimationDriver } from "../engine/AnimationDriver";
import { ArrowDownUp, SlidersHorizontal } from "lucide-react";

export interface VisualTimelineProps {
  pattern: StrummingPattern;
  animationDriver: AnimationDriver | null;
  isCountingIn: boolean;
  countInBeatRemaining: number | null;
  totalCountInBeats: number;
  strictAlternation?: boolean;
  onSlotClick?: (index: number) => void;
  onToggleStrictAlternation?: () => void;
  isInteractive?: boolean;
}

export const VisualTimeline: React.FC<VisualTimelineProps> = ({
  pattern,
  animationDriver,
  isCountingIn,
  countInBeatRemaining,
  totalCountInBeats,
  strictAlternation = true,
  onSlotClick,
  onToggleStrictAlternation,
  isInteractive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);

  // Attach DOM elements directly to AnimationDriver to bypass React VDOM re-renders
  useEffect(() => {
    if (animationDriver && containerRef.current && playheadRef.current) {
      animationDriver.attach(containerRef.current, playheadRef.current);
    }
  }, [animationDriver, pattern.slots.length]);

  // Handle resize updates
  useEffect(() => {
    const handleResize = () => {
      animationDriver?.updateDimensions();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [animationDriver]);

  return (
    <div
      className="relative w-full rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-3 sm:p-5 pt-7 sm:pt-8 min-h-[148px] sm:min-h-[168px] shadow-2xl overflow-hidden select-none"
    >
      {/* Top-Right Mode Toggle Icon: Alternating D/U vs Free Direction (e.g. DDDU) */}
      {onToggleStrictAlternation && (
        <button
          type="button"
          onClick={onToggleStrictAlternation}
          title={
            strictAlternation
              ? "Alternate D/U Mode (Odds: Down, Evens: Up) - Click to enable Free Direction"
              : "Free Direction Mode (Any direction allowed) - Click to enforce Alternate D/U"
          }
          aria-label={
            strictAlternation
              ? "Alternate D/U Mode active (Odds: Down, Evens: Up). Click to enable Free Direction"
              : "Free Direction Mode active. Click to enforce Alternate D/U"
          }
          className={`absolute top-2 right-2 sm:top-2.5 sm:right-3 z-30 flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg border text-[11px] font-bold tracking-tight transition-all cursor-pointer shadow-md min-h-[30px] ${
            strictAlternation
              ? "bg-amber-500/15 border-amber-500/50 text-amber-300 hover:bg-amber-500/25"
              : "bg-cyan-500/15 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/25"
          }`}
        >
          {strictAlternation ? (
            <>
              <ArrowDownUp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden xs:inline sm:inline">D / U</span>
            </>
          ) : (
            <>
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="hidden xs:inline sm:inline">Free D/U</span>
            </>
          )}
        </button>
      )}

      {/* 6 Guitar Fretboard Strings Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="fretboard-string top-[20%]" />
        <div className="fretboard-string top-[32%]" />
        <div className="fretboard-string top-[44%]" />
        <div className="fretboard-string top-[56%]" />
        <div className="fretboard-string top-[68%]" />
        <div className="fretboard-string top-[80%]" />
      </div>

      {/* Grid of Beat Slots with Playhead Track */}
      <div ref={containerRef} className="relative z-10 w-full">
        <div
          className="grid gap-1 sm:gap-2 w-full"
          style={{
            gridTemplateColumns: `repeat(${pattern.slots.length}, minmax(0, 1fr))`,
          }}
        >
          {pattern.slots.map((slot) => (
            <BeatSlotBlock
              key={slot.index}
              slot={slot}
              onClick={onSlotClick}
              isInteractive={isInteractive}
            />
          ))}
        </div>

        {/* 60/120 FPS GPU Accelerated Playhead Line */}
        <div
          ref={playheadRef}
          aria-hidden="true"
          className="absolute -top-3 -bottom-3 left-0 w-1 pointer-events-none z-20 will-change-transform"
          style={{
            transform: "translate3d(0px, 0, 0)",
          }}
        >
          <div className="w-full h-full bg-cyan-400 shadow-[0_0_12px_#06b6d4,0_0_24px_#06b6d4]" />
          <div className="absolute -top-1 -left-1.5 w-4 h-4 rounded-full bg-cyan-300 border-2 border-cyan-500 shadow-md" />
          <div className="absolute -bottom-1 -left-1.5 w-4 h-4 rounded-full bg-cyan-300 border-2 border-cyan-500 shadow-md" />
        </div>
      </div>

      {/* Count-In Overlay */}
      <CountInIndicator
        isCountingIn={isCountingIn}
        beatRemaining={countInBeatRemaining}
        totalBeats={totalCountInBeats}
      />
    </div>
  );
};
