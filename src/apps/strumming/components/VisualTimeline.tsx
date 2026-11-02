import React, { useRef, useEffect } from "react";
import { StrummingPattern } from "../types";
import { BeatSlotBlock } from "./BeatSlotBlock";
import { CountInIndicator } from "./CountInIndicator";
import { AnimationDriver } from "../engine/AnimationDriver";

export interface VisualTimelineProps {
  pattern: StrummingPattern;
  animationDriver: AnimationDriver | null;
  isCountingIn: boolean;
  countInBeatRemaining: number | null;
  totalCountInBeats: number;
  onSlotClick?: (index: number) => void;
  isInteractive?: boolean;
}

export const VisualTimeline: React.FC<VisualTimelineProps> = ({
  pattern,
  animationDriver,
  isCountingIn,
  countInBeatRemaining,
  totalCountInBeats,
  onSlotClick,
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
      className="relative w-full rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-4 sm:p-6 min-h-[148px] sm:min-h-[168px] shadow-2xl overflow-hidden select-none flex flex-col justify-center"
    >
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
        beatsPerMeasure={pattern.timeSignature?.[0] ?? 4}
      />
    </div>
  );
};
