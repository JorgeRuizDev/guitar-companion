'use client';

import React from 'react';
import { SessionStats, Language } from '../types';
import { Flame, Target, CheckCircle2, RotateCcw, BookOpen } from 'lucide-react';

export interface LiveProgressBarProps {
  stats: SessionStats;
  isEmbed?: boolean;
  compact?: boolean;
  lang?: Language;
  className?: string;
  onReset?: () => void;
  categoryLabel?: string;
}

/**
 * Live Metrics Header Bar for Note Trainer.
 * Unified completely with the Chord Trainer metrics header:
 * - Slate bottom border separator (border-slate-800)
 * - Category pill with BookOpen icon
 * - Mono stats with Flame (streak), Target (accuracy %), and CheckCircle2 (hits)
 * - Reset button
 */
export const LiveProgressBar: React.FC<LiveProgressBarProps> = ({
  stats,
  isEmbed = false,
  compact = false,
  lang = 'en',
  className = '',
  onReset,
  categoryLabel,
}) => {
  const isEs = lang === 'es';
  const label = categoryLabel || (isEs ? 'Notas' : 'Notes');

  return (
    <div
      className={`w-full flex items-center justify-between gap-1.5 pb-2.5 mb-2 border-b border-slate-800 text-xs select-none ${className}`}
      role="region"
      aria-label="Training Progress"
    >
      {/* Mode / Category Badge */}
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 font-medium">
        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden xs:inline">{label}</span>
      </div>

      {/* Stats: Streak, Accuracy, Hits */}
      <div className="flex items-center gap-2 sm:gap-3 text-slate-300 font-mono">
        <div
          className="flex items-center gap-1"
          title={isEs ? 'Racha actual' : 'Current streak'}
        >
          <Flame
            className={`w-4 h-4 ${
              stats.currentStreak > 0
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-500'
            }`}
          />
          <span className="font-bold text-slate-100">{stats.currentStreak}</span>
        </div>

        <div
          className="flex items-center gap-1"
          title={isEs ? 'Precisión' : 'Accuracy'}
        >
          <Target className="w-3.5 h-3.5 text-blue-400" />
          <span>{stats.accuracy}%</span>
        </div>

        <div
          className="flex items-center gap-1"
          title={isEs ? 'Aciertos' : 'Correct answers'}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-bold">{stats.okeys}</span>
        </div>
      </div>

      {/* Right Action / Reset */}
      {onReset ? (
        <button
          type="button"
          onClick={onReset}
          title={isEs ? 'Reiniciar sesión' : 'Reset session'}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      ) : (
        <div className="w-6" />
      )}
    </div>
  );
};
