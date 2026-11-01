'use client';

import React, { useEffect, useCallback } from 'react';
import { TrainerConfig } from '../types';
import { useChordTrainerSession } from '../hooks/useChordTrainerSession';
import { useChordPostMessage } from '../hooks/useChordPostMessage';
import { DrawChallenge } from './DrawChallenge';
import { IdentifyChallenge } from './IdentifyChallenge';
import { Flame, Target, CheckCircle2, RotateCcw, Shuffle, Edit3, Eye } from 'lucide-react';

interface ChordTrainerAppProps {
  config: TrainerConfig;
  onAnswerEvaluated?: (payload: any) => void;
  onProgressUpdate?: (payload: any) => void;
  className?: string;
}

export const ChordTrainerApp: React.FC<ChordTrainerAppProps> = ({
  config,
  onAnswerEvaluated,
  onProgressUpdate,
  className = '',
}) => {
  const lang = config.lang || 'en';
  const isCompact = Boolean(config.compact || config.embed);

  // PostMessage bridge for embedded mobile WebViews (iOS WKWebView / Android WebView)
  const { sendAnswer, sendProgress } = useChordPostMessage({
    isEnabled: Boolean(config.embed),
  });

  const handleInternalAnswer = useCallback(
    (data: any) => {
      sendAnswer(data);
      onAnswerEvaluated?.(data);
    },
    [sendAnswer, onAnswerEvaluated]
  );

  const handleInternalProgress = useCallback(
    (data: any) => {
      sendProgress(data);
      onProgressUpdate?.(data);
    },
    [sendProgress, onProgressUpdate]
  );

  const {
    challenge,
    userState,
    status,
    selectedChordId,
    evaluation,
    metrics,
    mode,
    handleFretClick,
    handleNutToggle,
    handleCheck,
    handleSkip,
    handleSelectOption,
    handleNext,
    resetSession,
  } = useChordTrainerSession(
    config,
    handleInternalAnswer,
    handleInternalProgress
  );

  // Global Keyboard Shortcuts handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if typing inside input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (status === 'PENDING') {
        if (challenge.type === 'identify' && challenge.options) {
          // Number keys 1-4 for options
          const digit = parseInt(e.key, 10);
          if (digit >= 1 && digit <= 4 && challenge.options[digit - 1]) {
            e.preventDefault();
            handleSelectOption(challenge.options[digit - 1]);
          }
        } else if (challenge.type === 'draw') {
          // Enter checks, 's' skips
          if (e.key === 'Enter') {
            e.preventDefault();
            handleCheck();
          } else if (e.key.toLowerCase() === 's') {
            e.preventDefault();
            handleSkip();
          }
        }
      } else {
        // When answered, Enter or Space advances
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNext();
        }
      }
    },
    [status, challenge, handleSelectOption, handleCheck, handleSkip, handleNext]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const modeIcon =
    mode === 'draw' ? (
      <Edit3 className="w-3.5 h-3.5" />
    ) : mode === 'identify' ? (
      <Eye className="w-3.5 h-3.5" />
    ) : (
      <Shuffle className="w-3.5 h-3.5" />
    );

  const modeLabel =
    mode === 'draw'
      ? lang === 'es'
        ? 'Dibuja'
        : 'Draw'
      : mode === 'identify'
      ? lang === 'es'
        ? 'Identifica'
        : 'Identify'
      : lang === 'es'
      ? 'Alternado'
      : 'Alternating';

  return (
    <div
      className={`w-full flex flex-col items-center justify-start ${
        isCompact ? 'p-2 max-w-sm' : 'p-3 sm:p-5 max-w-md'
      } mx-auto bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl select-none ${className}`}
    >
      {/* Live Metrics Header Bar */}
      <div className="w-full flex items-center justify-between gap-1.5 pb-2.5 mb-2 border-b border-slate-800 text-xs">
        {/* Mode Badge */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 font-medium">
          {modeIcon}
          <span className="hidden xs:inline">{modeLabel}</span>
        </div>

        {/* Stats: Streak, Accuracy, Hits */}
        <div className="flex items-center gap-2 sm:gap-3 text-slate-300 font-mono">
          <div
            className="flex items-center gap-1"
            title={lang === 'es' ? 'Racha actual' : 'Current streak'}
          >
            <Flame
              className={`w-4 h-4 ${
                metrics.currentStreak > 0
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-500'
              }`}
            />
            <span className="font-bold">{metrics.currentStreak}</span>
          </div>

          <div
            className="flex items-center gap-1"
            title={lang === 'es' ? 'Precisión' : 'Accuracy'}
          >
            <Target className="w-3.5 h-3.5 text-blue-400" />
            <span>{metrics.accuracy}%</span>
          </div>

          <div
            className="flex items-center gap-1"
            title={lang === 'es' ? 'Aciertos' : 'Correct answers'}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-bold">{metrics.hits}</span>
          </div>
        </div>

        {/* Reset Session Button */}
        <button
          type="button"
          onClick={() => resetSession()}
          title={lang === 'es' ? 'Reiniciar sesión' : 'Reset session'}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Challenge Area */}
      <main className="w-full">
        {challenge.type === 'draw' ? (
          <DrawChallenge
            challenge={challenge}
            userState={userState}
            status={status}
            evaluation={evaluation}
            onFretClick={handleFretClick}
            onNutToggle={handleNutToggle}
            onCheck={handleCheck}
            onSkip={handleSkip}
            onNext={handleNext}
            lang={lang}
            compact={isCompact}
          />
        ) : (
          <IdentifyChallenge
            challenge={challenge}
            status={status}
            selectedChordId={selectedChordId}
            onSelectOption={handleSelectOption}
            onNext={handleNext}
            lang={lang}
            compact={isCompact}
          />
        )}
      </main>
    </div>
  );
};
