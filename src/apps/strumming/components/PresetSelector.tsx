import React from "react";
import { StrummingPattern, SubdivisionUnit, MetronomeSubdivision } from "../types";
import { beginnerPresets } from "../presets/beginnerPatterns";
import { ListMusic, Plus, Minus } from "lucide-react";
import { ShareConfigButton } from "./ShareConfigButton";

export interface PresetSelectorProps {
  activePatternId: string;
  activeSubdivision: SubdivisionUnit;
  timeSignature?: [number, number];
  slotCount?: number;
  strictAlternation: boolean;
  onSelectPreset: (pattern: StrummingPattern) => void;
  onSubdivisionChange: (subdivision: SubdivisionUnit) => void;
  onTimeSignatureChange?: (meter: "4/4" | "3/4" | "6/8") => void;
  onCustomClick?: () => void;
  onAddSlot?: () => void;
  onRemoveSlot?: () => void;
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
  timeSignature = [4, 4],
  slotCount = 8,
  strictAlternation,
  onSelectPreset,
  onSubdivisionChange,
  onTimeSignatureChange,
  onCustomClick,
  onAddSlot,
  onRemoveSlot,
  onToggleStrictAlternation,
  shareProps,
}) => {
  const isCustom = !beginnerPresets.some((p) => p.id === activePatternId);

  const is8thActive =
    timeSignature[0] === 4 &&
    activeSubdivision === "eighth" &&
    slotCount === 8;

  const is16thActive =
    timeSignature[0] === 4 &&
    activeSubdivision === "sixteenth" &&
    slotCount === 16;

  const is34Active = timeSignature[0] === 3 && slotCount === 3;
  const is68Active = timeSignature[0] === 6 && slotCount === 6;

  const isCustomActive =
    activeSubdivision === "custom" ||
    (!is8thActive && !is16thActive && !is34Active && !is68Active);

  return (
    <div className="w-full flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
      {/* Preset Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-1">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 shrink-0">
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
                Patrón Personalizado ({slotCount} bloques)
              </option>
            )}
            <optgroup label="Compás 4/4 Estándar">
              {beginnerPresets
                .filter((p) => !p.timeSignature || (p.timeSignature[0] === 4 && p.timeSignature[1] === 4))
                .map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name} ({preset.slots.length} bloques)
                  </option>
                ))}
            </optgroup>
            <optgroup label="Compás 3/4 (Vals / Ternario)">
              {beginnerPresets
                .filter((p) => p.timeSignature && p.timeSignature[0] === 3)
                .map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name} ({preset.slots.length} bloques)
                  </option>
                ))}
            </optgroup>
            <optgroup label="Compás 6/8 (Compuesto)">
              {beginnerPresets
                .filter((p) => p.timeSignature && p.timeSignature[0] === 6)
                .map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name} ({preset.slots.length} bloques)
                  </option>
                ))}
            </optgroup>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
            ▼
          </div>
        </div>
      </div>

      {/* Right side controls: Alternation toggle, Dynamic Block +/- buttons, Subdivision / Meter & Share */}
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

        {/* Subdivision / Meter Toggle: 8th, 16th, 3/4, 6/8, Custom */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1 flex-wrap">
          <button
            type="button"
            onClick={() => {
              onSubdivisionChange("eighth");
              onTimeSignatureChange?.("4/4");
            }}
            title="4/4 Corcheas (8 strums)"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[34px] flex items-center justify-center cursor-pointer ${
              is8thActive
                ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            8th
          </button>
          <button
            type="button"
            onClick={() => {
              onSubdivisionChange("sixteenth");
              onTimeSignatureChange?.("4/4");
            }}
            title="4/4 Semicorcheas (16 strums)"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[34px] flex items-center justify-center cursor-pointer ${
              is16thActive
                ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            16th
          </button>
          {onTimeSignatureChange && (
            <>
              <button
                type="button"
                onClick={() => onTimeSignatureChange("3/4")}
                title="Compás 3/4 (3 strums)"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[34px] flex items-center justify-center cursor-pointer ${
                  is34Active
                    ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                3/4 (3)
              </button>
              <button
                type="button"
                onClick={() => onTimeSignatureChange("6/8")}
                title="Compás 6/8 (6 strums)"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[34px] flex items-center justify-center cursor-pointer ${
                  is68Active
                    ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                6/8 (6)
              </button>
            </>
          )}
          {onCustomClick && (
            <button
              type="button"
              onClick={onCustomClick}
              title="Modo Personalizado (configura cualquier número de strums)"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[34px] flex items-center justify-center cursor-pointer ${
                isCustomActive
                  ? "bg-cyan-500 text-slate-950 shadow-md font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Custom
            </button>
          )}
        </div>

        {/* Dynamic Strum / Block Count (+ / - buttons) */}
        {onAddSlot && onRemoveSlot && (
          <div className="flex items-center bg-slate-950 px-2 py-0.5 rounded-xl border border-slate-800 gap-1.5 min-h-[38px] shadow-sm">
            <button
              type="button"
              onClick={onRemoveSlot}
              disabled={slotCount <= 2}
              title="Quitar un bloque de strum (mínimo 2)"
              aria-label="Remove a strum"
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 flex items-center justify-center font-bold text-xs cursor-pointer transition-all active:scale-95"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <span
              className="text-xs font-mono font-extrabold text-amber-400 px-1 tabular-nums text-center select-none min-w-[62px]"
              title={`${slotCount} strums configurados`}
            >
              {slotCount} strums
            </span>
            <button
              type="button"
              onClick={onAddSlot}
              disabled={slotCount >= 24}
              title="Añadir un bloque de strum (máximo 24)"
              aria-label="Add a strum"
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 flex items-center justify-center font-bold text-xs cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* Share / Copy URL Button */}
        {shareProps && <ShareConfigButton {...shareProps} />}
      </div>
    </div>
  );
};
