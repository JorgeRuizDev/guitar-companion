import React from 'react';
import { Flame, Target, CheckCircle2, RotateCcw } from 'lucide-react';

export interface SessionMetricsHeaderProps {
  categoryLabel?: string;
  categoryIcon?: React.ReactNode;
  currentStreak: number;
  accuracy: number;
  hits: number;
  onReset?: () => void;
  lang?: 'en' | 'es';
  className?: string;
  compact?: boolean;
}

/**
 * Common metrics header bar extracted directly from the chord trainer aesthetic.
 * Integrates directly at the top of the question card with a bottom slate border.
 * Features:
 * - Left: Category or Mode pill with icon
 * - Center: Mono metrics: Flame (Streak), Target (Accuracy %), CheckCircle2 (Hits)
 * - Right: Reset action button
 */
export const SessionMetricsHeader: React.FC<SessionMetricsHeaderProps> = ({
  categoryLabel,
  categoryIcon,
  currentStreak,
  accuracy,
  hits,
  onReset,
  lang = 'en',
  className = '',
}) => {
  return (
    <div
      data-testid="session-metrics-header"
      className={`w-full flex items-center justify-between gap-1.5 pb-2.5 mb-2.5 border-b border-slate-800 text-xs select-none ${className}`}
    >
      {/* Category / Mode Badge */}
      {categoryLabel ? (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 font-medium">
          {categoryIcon}
          <span className="hidden xs:inline">{categoryLabel}</span>
        </div>
      ) : (
        <div />
      )}

      {/* Stats: Streak, Accuracy, Hits */}
      <div className="flex items-center gap-2 sm:gap-3 text-slate-300 font-mono">
        <div
          className="flex items-center gap-1"
          title={lang === 'es' ? 'Racha actual' : 'Current streak'}
        >
          <Flame
            className={`w-4 h-4 ${
              currentStreak > 0
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-500'
            }`}
          />
          <span className="font-bold">{currentStreak}</span>
        </div>

        <div
          className="flex items-center gap-1"
          title={lang === 'es' ? 'Precisión' : 'Accuracy'}
        >
          <Target className="w-3.5 h-3.5 text-blue-400" />
          <span>{accuracy}%</span>
        </div>

        <div
          className="flex items-center gap-1"
          title={lang === 'es' ? 'Aciertos' : 'Correct answers'}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-bold">{hits}</span>
        </div>
      </div>

      {/* Reset Session Button (if provided) */}
      {onReset ? (
        <button
          type="button"
          onClick={onReset}
          title={lang === 'es' ? 'Reiniciar sesión' : 'Reset session'}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      ) : (
        <div />
      )}
    </div>
  );
};
