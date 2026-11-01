'use client';

import React from 'react';
import { SessionStats, Language } from '../types';
import { Flame, CheckCircle, XCircle } from 'lucide-react';

export interface LiveProgressBarProps {
  stats: SessionStats;
  isEmbed?: boolean;
  compact?: boolean;
  lang?: Language;
  className?: string;
}

export const LiveProgressBar: React.FC<LiveProgressBarProps> = ({
  stats,
  isEmbed = false,
  compact = false,
  lang = 'en',
  className = '',
}) => {
  const isEs = lang === 'es';
  const totalAttempts = stats.okeys + stats.failures;
  const okeyPercentage = totalAttempts > 0 ? (stats.okeys / totalAttempts) * 100 : 100;
  const failurePercentage = totalAttempts > 0 ? (stats.failures / totalAttempts) * 100 : 0;

  const okLabel = isEs ? 'OK' : 'OK';
  const missLabel = isEs ? 'Fallos' : 'Miss';

  if (compact) {
    return (
      <div
        className={`w-full max-w-md flex flex-col gap-1.5 p-2 px-3 rounded-xl bg-neutral-900/95 border border-neutral-800 shadow-sm select-none backdrop-blur-md ${className}`}
        role="region"
        aria-label="Training Progress"
      >
        <div className="flex items-center justify-between text-xs">
          {/* Left Counts */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold">{stats.okeys}</span>
              <span className="text-[10px] text-emerald-500/80">{okLabel}</span>
            </div>

            <div className="flex items-center gap-1 text-rose-400 font-semibold">
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              <span className="font-bold">{stats.failures}</span>
              <span className="text-[10px] text-rose-500/80">{missLabel}</span>
            </div>
          </div>

          {/* Right Metrics */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span className="font-bold">{stats.currentStreak}</span>
            </div>
            <div className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-200 font-mono text-[11px] font-medium border border-neutral-700/60">
              {stats.accuracy}%
            </div>
          </div>
        </div>

        {/* Ultra-slim progress line */}
        <div
          className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden flex"
          role="progressbar"
          aria-valuenow={stats.accuracy}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            style={{ width: `${okeyPercentage}%` }}
            className="h-full bg-emerald-500 transition-all duration-300 rounded-l-full"
          />
          <div
            style={{ width: `${failurePercentage}%` }}
            className="h-full bg-rose-500 transition-all duration-300 rounded-r-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full flex flex-col gap-2 p-3 sm:p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-md select-none backdrop-blur-md ${className}`}
      role="region"
      aria-label="Live Training Progress Metrics"
    >
      {/* Top Metric Indicators */}
      <div className="flex items-center justify-between text-xs sm:text-sm">
        {/* Left: Okeys & Failures Counts */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1.5 text-emerald-400 font-semibold"
            aria-label={`Okeys: ${stats.okeys}`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-base font-bold">{stats.okeys}</span>
            <span className="text-[11px] text-emerald-500/80 font-normal">{okLabel}</span>
          </div>

          <div
            className="flex items-center gap-1.5 text-rose-400 font-semibold"
            aria-label={`Failures: ${stats.failures}`}
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            <span className="text-base font-bold">{stats.failures}</span>
            <span className="text-[11px] text-rose-500/80 font-normal">{missLabel}</span>
          </div>
        </div>

        {/* Right: Streak & Accuracy */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1 text-amber-400 font-semibold"
            aria-label={`Current Streak: ${stats.currentStreak}`}
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <span className="text-base font-bold">{stats.currentStreak}</span>
            {!isEmbed && stats.bestStreak > 0 && (
              <span className="text-[10px] text-neutral-400 font-normal hidden sm:inline">
                ({isEs ? 'Récord' : 'Best'}: {stats.bestStreak})
              </span>
            )}
          </div>

          <div
            className="px-2.5 py-0.5 rounded-lg bg-neutral-800 text-neutral-200 font-mono text-xs font-medium border border-neutral-700/60"
            aria-label={`Accuracy: ${stats.accuracy} percent`}
          >
            {stats.accuracy}%
          </div>
        </div>
      </div>

      {/* Visual Dual-Colored Ratio Bar */}
      <div
        className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden flex"
        role="progressbar"
        aria-valuenow={stats.accuracy}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          style={{ width: `${okeyPercentage}%` }}
          className="h-full bg-emerald-500 transition-all duration-300 rounded-l-full"
        />
        <div
          style={{ width: `${failurePercentage}%` }}
          className="h-full bg-rose-500 transition-all duration-300 rounded-r-full"
        />
      </div>
    </div>
  );
};
