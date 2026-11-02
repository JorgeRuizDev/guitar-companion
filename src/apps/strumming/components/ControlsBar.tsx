import React, { useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Minus, Plus } from "lucide-react";
import { MetronomeSubdivision, getTempoMarking } from "../types";

export interface ControlsBarProps {
  isPlaying: boolean;
  bpm: number;
  accentFirstBeat: boolean;
  countInMeasures: 0 | 1 | 2 | 3;
  metronomeSubdivision: MetronomeSubdivision;
  activeBeatIndex: number;
  timeSignature?: [number, number];
  onTogglePlayPause: () => void;
  onReset: () => void;
  onBpmChange: (bpm: number) => void;
  onAccentToggle: (enabled: boolean) => void;
  onCountInChange: (measures: 0 | 1 | 2 | 3) => void;
  onSubdivisionChange: (sub: MetronomeSubdivision) => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  isPlaying,
  bpm,
  accentFirstBeat,
  countInMeasures,
  metronomeSubdivision,
  activeBeatIndex,
  timeSignature = [4, 4],
  onTogglePlayPause,
  onReset,
  onBpmChange,
  onAccentToggle,
  onCountInChange,
  onSubdivisionChange,
}) => {
  const tapTimesRef = useRef<number[]>([]);

  // Tap tempo handler
  const handleTap = () => {
    const now = performance.now();
    const recent = tapTimesRef.current.filter((t) => now - t < 2500);
    recent.push(now);
    tapTimesRef.current = recent;

    if (recent.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < recent.length; i++) {
        intervals.push(recent[i] - recent[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      if (avgInterval > 0) {
        const calculatedBpm = Math.round(60000 / avgInterval);
        const clamped = Math.min(240, Math.max(40, calculatedBpm));
        onBpmChange(clamped);
      }
    }
  };

  const tempoMarking = getTempoMarking(bpm);

  return (
    <div className="w-full rounded-3xl bg-slate-900/95 border border-slate-800 p-5 sm:p-7 shadow-2xl space-y-6">
      {/* 1. Large BPM & Italian Tempo Display (Reference Metronome Style) */}
      <div className="text-center space-y-1">
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-5xl sm:text-6xl font-black text-amber-500 tracking-tight font-mono tabular-nums">
            {bpm}
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-400/90 tracking-wider">
            BPM
          </span>
        </div>
        <div className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase">
          {tempoMarking}
        </div>
      </div>

      {/* 2. BPM Slider with - and + Round Buttons */}
      <div className="space-y-3 max-w-xl mx-auto">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => onBpmChange(Math.max(40, bpm - 1))}
            aria-label="Decrease BPM by 1"
            className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-md"
          >
            <Minus className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="relative flex-1 flex items-center min-h-[44px]">
            <input
              id="metronome-bpm-slider"
              type="range"
              min={40}
              max={240}
              step={1}
              value={bpm}
              onChange={(e) => onBpmChange(Number(e.target.value))}
              aria-label="Metronome tempo in beats per minute"
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <button
            type="button"
            onClick={() => onBpmChange(Math.min(240, bpm + 1))}
            aria-label="Increase BPM by 1"
            className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-md"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Fine adjustments: -5, -1, +1, +5 */}
        <div className="flex items-center justify-center gap-2">
          {[-5, -1, 1, 5].map((delta) => (
            <button
              key={delta}
              type="button"
              onClick={() => onBpmChange(Math.min(240, Math.max(40, bpm + delta)))}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            >
              {delta > 0 ? `+${delta}` : delta}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Real-Time Beat Dots (Reference circles, adapted to active timeSignature) */}
      <div className="flex items-center justify-center gap-2.5 sm:gap-3 py-1 flex-wrap">
        {Array.from({ length: timeSignature?.[0] ?? 4 }, (_, i) => i).map((b) => {
          const isActive = isPlaying && activeBeatIndex === b;
          const isAccentBeat = b === 0 && accentFirstBeat;
          return (
            <div
              key={b}
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-100 ${
                isActive
                  ? isAccentBeat
                    ? "bg-amber-400 border-amber-300 scale-125 shadow-lg shadow-amber-500/60"
                    : "bg-cyan-400 border-cyan-300 scale-125 shadow-lg shadow-cyan-500/60"
                  : "bg-transparent border-slate-600"
              }`}
            />
          );
        })}
      </div>

      {/* 4. Action Buttons: TAP Tempo and Play/Pause */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 pt-1">
        <button
          type="button"
          onClick={handleTap}
          aria-label="Tap tempo"
          className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border-2 border-slate-700 active:scale-95 text-amber-400 font-extrabold text-sm sm:text-base tracking-widest transition-all cursor-pointer shadow-lg min-h-[48px]"
        >
          TAP
        </button>

        <button
          type="button"
          onClick={onTogglePlayPause}
          aria-label={isPlaying ? "Pause practice (SPACE)" : "Start practice (SPACE)"}
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 flex items-center justify-center transition-all cursor-pointer shadow-xl shadow-amber-500/25 min-h-[48px] min-w-[48px]"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 fill-current ml-1" />
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          aria-label="Reset to Beat 1 (RETURN / BACKSPACE)"
          title="Reset to Beat 1 (RETURN / BACKSPACE)"
          className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 active:scale-95 text-slate-400 hover:text-white transition-all cursor-pointer min-h-[48px] min-w-[48px] flex items-center justify-center"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* 5. Accent Beat 1 Checkbox & Count-In Selection */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
        <label
          htmlFor="accent-toggle"
          className="flex items-center gap-3 cursor-pointer select-none group min-h-[44px]"
        >
          <input
            id="accent-toggle"
            type="checkbox"
            checked={accentFirstBeat}
            onChange={(e) => onAccentToggle(e.target.checked)}
            className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer accent-amber-500"
          />
          <div className="flex items-center gap-2">
            {accentFirstBeat ? (
              <Volume2 className="w-4 h-4 text-amber-400 group-hover:text-amber-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">
              Accent Beat 1
            </span>
          </div>
        </label>

        {/* Count-In Selection (0, 1, 2, 3) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Count-In:
          </span>
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            {([0, 1, 2, 3] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onCountInChange(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] min-w-[36px] flex items-center justify-center ${
                  countInMeasures === m
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {m === 0 ? "Off" : `${m}m`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Metronome Subdivisions Selector */}
      <div className="space-y-2 pt-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Metronome Subdivisions
        </div>
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {/* 1. Quarter Note (♩) */}
          <button
            type="button"
            onClick={() => onSubdivisionChange("quarter")}
            title="Quarter note (1 click per beat)"
            aria-label="Quarter note subdivision"
            className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer min-h-[56px] ${
              metronomeSubdivision === "quarter"
                ? "bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/25 scale-[1.02]"
                : "bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300"
            }`}
          >
            <svg viewBox="0 0 32 32" className="w-6 h-6 fill-current">
              <ellipse cx="12" cy="22" rx="4.5" ry="3.5" transform="rotate(-25 12 22)" />
              <rect x="15.5" y="7" width="2" height="15" rx="1" />
            </svg>
            <span className="text-[10px] mt-1 font-semibold leading-none">Quarter</span>
          </button>

          {/* 2. Eighth Notes (♫) */}
          <button
            type="button"
            onClick={() => onSubdivisionChange("eighth")}
            title="Eighth notes (2 clicks per beat, alternating down & up)"
            aria-label="Eighth notes subdivision"
            className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer min-h-[56px] ${
              metronomeSubdivision === "eighth"
                ? "bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/25 scale-[1.02]"
                : "bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300"
            }`}
          >
            <svg viewBox="0 0 32 32" className="w-6 h-6 fill-current">
              <ellipse cx="9" cy="22" rx="3.5" ry="2.8" transform="rotate(-25 9 22)" />
              <ellipse cx="21" cy="20" rx="3.5" ry="2.8" transform="rotate(-25 21 20)" />
              <rect x="11.5" y="9" width="1.8" height="13" />
              <rect x="23.5" y="7" width="1.8" height="13" />
              <polygon points="11.5,9 25.3,7 25.3,10.5 11.5,12.5" />
            </svg>
            <span className="text-[10px] mt-1 font-semibold leading-none">Eighths</span>
          </button>

          {/* 3. Sixteenth Notes (4 clicks per beat) */}
          <button
            type="button"
            onClick={() => onSubdivisionChange("sixteenth")}
            title="Sixteenth notes (4 clicks per beat)"
            aria-label="Sixteenth notes subdivision"
            className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer min-h-[56px] ${
              metronomeSubdivision === "sixteenth"
                ? "bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/25 scale-[1.02]"
                : "bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300"
            }`}
          >
            <svg viewBox="0 0 36 32" className="w-7 h-6 fill-current">
              <ellipse cx="6" cy="23" rx="2.6" ry="2.2" transform="rotate(-25 6 23)" />
              <ellipse cx="14" cy="22" rx="2.6" ry="2.2" transform="rotate(-25 14 22)" />
              <ellipse cx="22" cy="21" rx="2.6" ry="2.2" transform="rotate(-25 22 21)" />
              <ellipse cx="30" cy="20" rx="2.6" ry="2.2" transform="rotate(-25 30 20)" />
              <rect x="8" y="7" width="1.5" height="16" />
              <rect x="16" y="6" width="1.5" height="16" />
              <rect x="24" y="5" width="1.5" height="16" />
              <rect x="32" y="4" width="1.5" height="16" />
              <polygon points="8,7 33.5,4 33.5,6.5 8,9.5" />
              <polygon points="8,11 33.5,8 33.5,10.5 8,13.5" />
            </svg>
            <span className="text-[10px] mt-1 font-semibold leading-none">16ths</span>
          </button>

          {/* 4. Triplets (3 clicks per beat) */}
          <button
            type="button"
            onClick={() => onSubdivisionChange("triplet")}
            title="Triplets (3 clicks per beat)"
            aria-label="Triplets subdivision"
            className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer min-h-[56px] ${
              metronomeSubdivision === "triplet"
                ? "bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/25 scale-[1.02]"
                : "bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300"
            }`}
          >
            <svg viewBox="0 0 34 32" className="w-6 h-6 fill-current">
              <text x="17" y="7" textAnchor="middle" fontSize="8" fontWeight="bold" fontStyle="italic" fill="currentColor">3</text>
              <ellipse cx="7" cy="23" rx="3" ry="2.4" transform="rotate(-25 7 23)" />
              <ellipse cx="17" cy="22" rx="3" ry="2.4" transform="rotate(-25 17 22)" />
              <ellipse cx="27" cy="21" rx="3" ry="2.4" transform="rotate(-25 27 21)" />
              <rect x="9.2" y="9.5" width="1.6" height="13.5" />
              <rect x="19.2" y="8.5" width="1.6" height="13.5" />
              <rect x="29.2" y="7.5" width="1.6" height="13.5" />
              <polygon points="9.2,9.5 30.8,7.5 30.8,10.5 9.2,12.5" />
            </svg>
            <span className="text-[10px] mt-1 font-semibold leading-none">Triplets</span>
          </button>

          {/* 5. Shuffle / Swing */}
          <button
            type="button"
            onClick={() => onSubdivisionChange("swing")}
            title="Swing / Shuffle rhythm"
            aria-label="Shuffle swing subdivision"
            className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer min-h-[56px] ${
              metronomeSubdivision === "swing"
                ? "bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/25 scale-[1.02]"
                : "bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300"
            }`}
          >
            <svg viewBox="0 0 34 32" className="w-6 h-6 fill-current">
              <text x="17" y="7" textAnchor="middle" fontSize="8" fontWeight="bold" fontStyle="italic" fill="currentColor">3</text>
              <path d="M7 8 L7 6 L27 6 L27 8" fill="none" stroke="currentColor" strokeWidth="1" />
              <ellipse cx="10" cy="22" rx="3.4" ry="2.6" transform="rotate(-25 10 22)" />
              <ellipse cx="24" cy="22" rx="3.4" ry="2.6" transform="rotate(-25 24 22)" />
              <rect x="12.6" y="9" width="1.6" height="13" />
              <rect x="26.6" y="9" width="1.6" height="13" />
              <polygon points="12.6,9 28.2,9 28.2,11.5 12.6,11.5" />
            </svg>
            <span className="text-[10px] mt-1 font-semibold leading-none">Swing</span>
          </button>
        </div>
      </div>
    </div>
  );
};
