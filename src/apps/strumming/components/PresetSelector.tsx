import React from "react";
import { StrummingPattern, SubdivisionUnit, MetronomeSubdivision } from "../types";
import { beginnerPresets } from "../presets/beginnerPatterns";
import { ListMusic, Layers } from "lucide-react";
import { ShareConfigButton } from "./ShareConfigButton";

export interface PresetSelectorProps {
  activePatternId: string;
  activeSubdivision: SubdivisionUnit;
  strictAlternation: boolean;
  onSelectPreset: (pattern: StrummingPattern) => void;
  onSubdivisionChange: (subdivision: SubdivisionUnit) => void;
  onToggleStrictAlternation: () => void;
  shareProps?: {
    pattern: StrummingPattern;
    bpm: number;
    accent: boolean;
    countIn: 0 | 1 | 2 | 3;
    metroSub: MetronomeSubdivision;
    strict: boolean;
  };
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  activePatternId,
  activeSubdivision,
  strictAlternation,
  onSelectPreset,
  onSubdivisionChange,
  onToggleStrictAlternation,
  shareProps,
}) => {
  const isCustom = !beginnerPresets.some((p) => p.id === activePatternId);

  return (
    <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
      {/* Preset Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-1">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <ListMusic className="w-4 h-4 text-amber-400" />
          <span>Preset:</span>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <select
            value={activePatternId}
            onChange={(e) => {
              const selected = beginnerPresets.find((p) => p.id === e.target.value);
              if (selected) onSelectPreset(selected);
            }}
            aria-label="Select strumming pattern preset"
            className="w-full bg-slate-950 text-slate-100 font-medium text-sm rounded-xl px-3.5 py-2.5 border border-slate-700/80 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 min-h-[44px] cursor-pointer appearance-none pr-8"
          >
            {isCustom && (
              <option value={activePatternId}>
                Custom Pattern
              </option>
            )}
            {beginnerPresets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name} ({preset.subdivision === "eighth" ? "8-count" : "16-count"})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
            ▼
          </div>
        </div>
      </div>

      {/* Right side controls: Alternation toggle, Subdivision selection & Share Button */}
      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
        {/* Discreet toggle: Alternating UDUD vs Free-form */}
        <button
          type="button"
          onClick={onToggleStrictAlternation}
          title={
            strictAlternation
              ? "Alternating D/U mode active (odds: Down, evens: Up)"
              : "Free-form mode active (allows any arrow sequence like DDDU)"
          }
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all min-h-[38px] cursor-pointer ${
            strictAlternation
              ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
              : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              strictAlternation ? "bg-amber-400 shadow-sm shadow-amber-400" : "bg-slate-600"
            }`}
          />
          <span>Alternate D/U</span>
        </button>

        {/* Subdivision Toggle: 8th vs 16th */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => onSubdivisionChange("eighth")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[34px] flex items-center justify-center cursor-pointer ${
              activeSubdivision === "eighth"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            8th
          </button>
          <button
            type="button"
            onClick={() => onSubdivisionChange("sixteenth")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[34px] flex items-center justify-center cursor-pointer ${
              activeSubdivision === "sixteenth"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            16th
          </button>
        </div>

        {/* Share / Copy URL Button */}
        {shareProps && <ShareConfigButton {...shareProps} />}
      </div>
    </div>
  );
};
