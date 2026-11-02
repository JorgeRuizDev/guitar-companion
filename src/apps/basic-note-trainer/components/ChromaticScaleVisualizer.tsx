'use client';

import React from 'react';
import { CHROMATIC_SCALE } from '../domain/musicTheory';
import { Language } from '../types';

export interface ChromaticScaleVisualizerProps {
  highlightNote?: string;
  lang?: Language;
  compact?: boolean;
  className?: string;
}

export const ChromaticScaleVisualizer: React.FC<ChromaticScaleVisualizerProps> = ({
  highlightNote,
  lang = 'es',
  compact = false,
  className = '',
}) => {
  const isEs = lang === 'es';

  // Normalize highlight target for comparison
  const normalizedTarget = highlightNote?.trim().toUpperCase() ?? '';

  const isNoteHighlighted = (letterName: string, solfegeName: string): boolean => {
    if (!normalizedTarget) return false;

    // Check direct letter or solfege match
    if (normalizedTarget === letterName.toUpperCase()) return true;
    if (normalizedTarget === solfegeName.toUpperCase()) return true;

    // If highlight is "B-C" or "E-F" (natural semitone pair)
    if (normalizedTarget.includes('B') && normalizedTarget.includes('C')) {
      if (letterName === 'B' || letterName === 'C') return true;
    }
    if (normalizedTarget.includes('E') && normalizedTarget.includes('F')) {
      if (letterName === 'E' || letterName === 'F') return true;
    }

    // Check accidental tokens (e.g., "C#" in "C# / Db")
    const parts = letterName.split('/').map((s) => s.trim().toUpperCase());
    if (parts.some((p) => normalizedTarget.includes(p) || p.includes(normalizedTarget))) {
      return true;
    }

    return false;
  };

  return (
    <div
      className={`w-full rounded-xl bg-neutral-950/80 border border-neutral-800 p-2.5 sm:p-3 flex flex-col gap-2 ${className}`}
      role="region"
      aria-label={isEs ? 'Mapa visual de las 12 notas cromáticas' : 'Visual 12-Note Chromatic Map'}
    >
      {/* Header Badge */}
      <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium">
        <span className="flex items-center gap-1.5 text-neutral-300 font-semibold">
          <span>🎹</span>
          <span>{isEs ? 'Escala cromática completa (12 notas)' : '12-Note Chromatic Scale'}</span>
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">
          {isEs ? '12 semitonos' : '12 half-steps'}
        </span>
      </div>

      {/* 12-Note Interactive Strip */}
      <div className="w-full overflow-x-auto pb-1 -mx-0.5 px-0.5 scrollbar-thin">
        <div className="grid grid-cols-12 gap-1 min-w-[360px] sm:min-w-0">
          {CHROMATIC_SCALE.map((pitch) => {
            const isHighlighted = isNoteHighlighted(pitch.name, pitch.solfegeName);
            const isEF = pitch.name === 'E' || pitch.name === 'F';
            const isBC = pitch.name === 'B' || pitch.name === 'C';
            const isNatural = pitch.isNatural;

            return (
              <div
                key={pitch.index}
                className={`flex flex-col items-center justify-center p-1 rounded-lg border transition-all text-center relative ${
                  isHighlighted
                    ? 'bg-amber-500 border-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-500/30 scale-105 z-10'
                    : isNatural
                    ? 'bg-neutral-900 border-neutral-700/80 text-neutral-200'
                    : 'bg-neutral-950 border-amber-500/20 text-amber-300/90'
                }`}
                title={`${pitch.name} (${pitch.solfegeName})`}
              >
                {/* Natural semitone bridge indicator */}
                {(pitch.name === 'E' || pitch.name === 'B') && (
                  <span
                    className={`absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border z-20 ${
                      isHighlighted
                        ? 'bg-neutral-950 border-amber-400'
                        : 'bg-emerald-400 border-emerald-300 shadow-sm shadow-emerald-400/50'
                    }`}
                    title={
                      isEs
                        ? 'Semitono natural directo (sin # ni b)'
                        : 'Natural semitone (zero fret gap)'
                    }
                  />
                )}

                {/* Primary Letter Notation */}
                <span
                  className={`font-mono text-xs leading-tight tracking-tight ${
                    isHighlighted ? 'font-extrabold text-neutral-950' : isNatural ? 'font-bold' : 'font-semibold text-[11px]'
                  }`}
                >
                  {pitch.name.length > 3 ? pitch.name.split(' / ')[0] : pitch.name}
                </span>

                {/* Secondary Solfège Label */}
                <span
                  className={`text-[9px] leading-tight truncate max-w-full ${
                    isHighlighted ? 'text-neutral-900 font-semibold' : 'text-neutral-400'
                  }`}
                >
                  {pitch.solfegeName.split(' / ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Legend / Pedagogical Memory Cue */}
      <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-neutral-400 pt-1 border-t border-neutral-800/80">
        <div className="flex items-center gap-1 text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          <span>{isEs ? 'Mi-Fa y Si-Do: semitono natural' : 'E-F & B-C: natural half-step'}</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <span>
            <strong className="text-amber-400">#</strong> {isEs ? '+1 traste' : '+1 fret'}
          </span>
          <span>
            <strong className="text-amber-400">b</strong> {isEs ? '-1 traste' : '-1 fret'}
          </span>
        </div>
      </div>
    </div>
  );
};
