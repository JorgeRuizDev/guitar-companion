'use client';

import React from 'react';
import { StringNumber, UserFretboardState } from '../types';

interface NutStringToggleProps {
  fretboardState: UserFretboardState;
  onToggle: (stringNumber: StringNumber) => void;
  isInteractive?: boolean;
  compact?: boolean;
  lang?: 'en' | 'es';
}

const STRING_LABELS: Record<StringNumber, { name: string; standardTune: string }> = {
  6: { name: '6', standardTune: 'E' },
  5: { name: '5', standardTune: 'A' },
  4: { name: '4', standardTune: 'D' },
  3: { name: '3', standardTune: 'G' },
  2: { name: '2', standardTune: 'B' },
  1: { name: '1', standardTune: 'e' },
};

export const NutStringToggle: React.FC<NutStringToggleProps> = ({
  fretboardState,
  onToggle,
  isInteractive = true,
  compact = false,
  lang = 'en',
}) => {
  // Ordered strings 6 down to 1
  const strings: StringNumber[] = [6, 5, 4, 3, 2, 1];

  return (
    <div
      className={`w-full flex items-center justify-between gap-1 max-w-[280px] mx-auto select-none ${
        compact ? 'mb-1' : 'mb-2'
      }`}
      aria-label={
        lang === 'es'
          ? 'Controles de cuerdas al aire o apagadas'
          : 'Open or muted string toggles'
      }
    >
      {strings.map((strNum) => {
        const strState = fretboardState.find((s) => s.stringNumber === strNum);
        const state = strState?.state ?? 'open';
        const isMuted = state === 'muted';
        const isFretted = state === 'fretted';
        const isOpen = state === 'open';

        return (
          <button
            key={strNum}
            type="button"
            disabled={!isInteractive}
            onClick={() => onToggle(strNum)}
            title={
              lang === 'es'
                ? `Cuerda ${strNum} (${STRING_LABELS[strNum].standardTune}): ${
                    isMuted ? 'Apagada (X)' : isOpen ? 'Al aire (O)' : `Traste ${strState?.fret}`
                  }. Pulsa para alternar.`
                : `String ${strNum} (${STRING_LABELS[strNum].standardTune}): ${
                    isMuted ? 'Muted (X)' : isOpen ? 'Open (O)' : `Fret ${strState?.fret}`
                  }. Click to toggle.`
            }
            className={`flex flex-col items-center justify-center rounded-lg transition-all min-w-[42px] sm:min-w-[44px] min-h-[44px] p-1 border text-center ${
              !isInteractive
                ? 'cursor-default opacity-85'
                : 'hover:scale-105 active:scale-95 cursor-pointer'
            } ${
              isMuted
                ? 'bg-rose-950/40 border-rose-600/70 text-rose-300 shadow-sm shadow-rose-950'
                : isOpen
                ? 'bg-emerald-950/30 border-emerald-600/60 text-emerald-300'
                : 'bg-amber-950/40 border-amber-600/60 text-amber-300 font-semibold'
            }`}
          >
            {/* Status indicator (O, X, or Fret) */}
            <span className="text-base font-black leading-none tracking-tight">
              {isMuted ? '✕' : isOpen ? '○' : strState?.fret ?? '●'}
            </span>

            {/* String note & number */}
            <span className="text-[10px] text-slate-400 font-mono leading-none mt-1">
              {STRING_LABELS[strNum].standardTune}
              <span className="text-[9px] text-slate-500 ml-0.5">({strNum})</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
