import React, { useState } from "react";
import { Timer, CheckCircle, RotateCcw, X } from "lucide-react";
import { usePracticeTimer } from "../hooks/usePracticeTimer";
import { WebAudioHost } from "../engine/WebAudioHost";
import { MetronomeSynth } from "../engine/MetronomeSynth";

export interface PracticeTimerProps {
  isPlaying: boolean;
}

export const PracticeTimer: React.FC<PracticeTimerProps> = ({ isPlaying }) => {
  const handleTimerComplete = () => {
    if (typeof window !== "undefined") {
      try {
        const host = new WebAudioHost();
        const synth = new MetronomeSynth(host.getContext());
        synth.scheduleCompletionChime(host.getCurrentTime());
      } catch (err) {
        console.warn("Could not play completion chime:", err);
      }
    }
  };

  const timer = usePracticeTimer({
    initialDurationSeconds: 300, // 5 min
    isPlaying,
    onComplete: handleTimerComplete,
  });

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = Math.min(
    100,
    Math.max(
      0,
      ((timer.targetDurationSeconds - timer.remainingSeconds) /
        timer.targetDurationSeconds) *
        100
    )
  );

  return (
    <div className="w-full rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header and Countdown */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Practice Timer
            </div>
            <div className="text-[11px] text-slate-500">
              Structured session routine
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-tight text-white tabular-nums">
            {formatTime(timer.remainingSeconds)}
          </div>
          <button
            type="button"
            onClick={timer.resetTimer}
            aria-label="Reset practice timer"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
        <div
          className={`h-full transition-all duration-300 ${
            timer.isCompleted ? "bg-emerald-400" : "bg-amber-500"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Duration Presets */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <span className="text-xs text-slate-400 font-medium">Session Goal:</span>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {[
            { label: "2m", seconds: 120 },
            { label: "5m", seconds: 300 },
            { label: "10m", seconds: 600 },
            { label: "15m", seconds: 900 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => timer.setDuration(preset.seconds)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[40px] cursor-pointer ${
                timer.targetDurationSeconds === preset.seconds
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Completion Notification Banner (FR-016: Pattern continues looping uninterrupted) */}
      {timer.isCompleted && !timer.isAlertDismissed && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold">Session goal complete! 🎉</span> Pattern continues looping for cool-down.
            </div>
          </div>
          <button
            type="button"
            onClick={timer.dismissAlert}
            aria-label="Dismiss completion alert"
            className="text-emerald-400 hover:text-emerald-200 p-1.5 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
