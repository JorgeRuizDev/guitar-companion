'use client';

import React from 'react';
import {
  ChallengeEvaluation,
  ChallengeStatus,
  PracticeChallenge,
  StringNumber,
  UserFretboardState,
} from '../types';
import { formatPromptTitle } from '../domain/dualNotation';
import { FretboardDiagram } from './FretboardDiagram';
import { NutStringToggle } from './NutStringToggle';
import { Check, SkipForward, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DrawChallengeProps {
  challenge: PracticeChallenge;
  userState: UserFretboardState;
  status: ChallengeStatus;
  evaluation: ChallengeEvaluation | null;
  onFretClick: (stringNumber: StringNumber, fret: number) => void;
  onNutToggle: (stringNumber: StringNumber) => void;
  onCheck: () => void;
  onSkip: () => void;
  onNext: () => void;
  lang?: 'en' | 'es';
  compact?: boolean;
}

export const DrawChallenge: React.FC<DrawChallengeProps> = ({
  challenge,
  userState,
  status,
  evaluation,
  onFretClick,
  onNutToggle,
  onCheck,
  onSkip,
  onNext,
  lang = 'en',
  compact = false,
}) => {
  const targetChord = challenge.targetChord;
  const isPending = status === 'PENDING';
  const isCorrect = status === 'EVALUATED_CORRECT';
  const isIncorrect = status === 'EVALUATED_INCORRECT';
  const isSkipped = status === 'SKIPPED';

  const prompt = formatPromptTitle(targetChord, lang, 'draw', challenge.notation);

  return (
    <div className="w-full flex flex-col items-center max-w-md mx-auto">
      {/* Header / Prompt with Dual Notation */}
      <div className="w-full text-center mb-2">
        <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
          {prompt.title}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
          {prompt.subtitle}
        </h2>
        {targetChord.description && !compact && (
          <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 line-clamp-1">
            {lang === 'es' ? targetChord.description.es : targetChord.description.en}
          </p>
        )}
      </div>

      {/* Nut String Toggle Controls (Strings 6 down to 1) */}
      <NutStringToggle
        fretboardState={userState}
        onToggle={onNutToggle}
        isInteractive={isPending}
        compact={compact}
        lang={lang}
      />

      {/* Interactive Fretboard Diagram */}
      <FretboardDiagram
        fretboardState={userState}
        targetChord={targetChord}
        evaluation={evaluation}
        isInteractive={isPending}
        showFingerNumbers={!isPending}
        compact={compact}
        onFretClick={onFretClick}
        onNutClick={onNutToggle}
        lang={lang}
      />

      {/* Feedback Banner on Evaluation */}
      {!isPending && evaluation && (
        <div
          className={`w-full max-w-[280px] p-2.5 rounded-xl border mt-2 flex items-start gap-2 text-xs leading-snug animate-in fade-in slide-in-from-bottom-2 ${
            isCorrect
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
              : isSkipped
              ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
              : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
          }`}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          )}
          <p>
            {isSkipped
              ? lang === 'es'
                ? `Solución mostrada para ${targetChord.symbol} (${targetChord.solfegeName}).`
                : `Solution revealed for ${targetChord.symbol} (${targetChord.solfegeName}).`
              : lang === 'es'
              ? evaluation.explanation.es
              : evaluation.explanation.en}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="w-full max-w-[280px] flex items-center justify-between gap-2.5 mt-3">
        {isPending ? (
          <>
            <button
              type="button"
              onClick={onSkip}
              className="flex-1 flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-all active:scale-95 cursor-pointer"
            >
              <SkipForward className="w-4 h-4 text-slate-400" />
              <span>{lang === 'es' ? 'Saltar' : 'Skip'}</span>
            </button>

            <button
              type="button"
              onClick={onCheck}
              className="flex-1 flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{lang === 'es' ? 'Comprobar' : 'Check'}</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onNext}
            autoFocus
            className="w-full flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm shadow-md shadow-amber-500/25 transition-all active:scale-95 cursor-pointer"
          >
            <span>{lang === 'es' ? 'Siguiente Acorde' : 'Next Chord'}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
};
