'use client';

import React from 'react';
import {
  ChallengeStatus,
  ChordDefinition,
  PracticeChallenge,
} from '../types';
import { formatOptionLabel, formatPromptTitle } from '../domain/dualNotation';
import { chordDefinitionToFretboardState } from '../domain/fretboardEvaluator';
import { FretboardDiagram } from './FretboardDiagram';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface IdentifyChallengeProps {
  challenge: PracticeChallenge;
  status: ChallengeStatus;
  selectedChordId?: string | null;
  onSelectOption: (chord: ChordDefinition) => void;
  onNext: () => void;
  lang?: 'en' | 'es';
  compact?: boolean;
}

export const IdentifyChallenge: React.FC<IdentifyChallengeProps> = ({
  challenge,
  status,
  selectedChordId,
  onSelectOption,
  onNext,
  lang = 'en',
  compact = false,
}) => {
  const targetChord = challenge.targetChord;
  const isPending = status === 'PENDING';
  const isCorrect = status === 'EVALUATED_CORRECT';
  const isIncorrect = status === 'EVALUATED_INCORRECT';

  const prompt = formatPromptTitle(targetChord, lang, 'identify');
  const targetFretboardState = chordDefinitionToFretboardState(targetChord);

  return (
    <div className="w-full flex flex-col items-center max-w-md mx-auto">
      {/* Header / Prompt */}
      <div className="w-full text-center mb-2">
        <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
          {prompt.title}
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
          {prompt.subtitle}
        </h2>
      </div>

      {/* Target Fretboard Display (Read-Only) */}
      <FretboardDiagram
        fretboardState={targetFretboardState}
        targetChord={targetChord}
        isInteractive={false}
        showFingerNumbers={true}
        compact={compact}
        lang={lang}
      />

      {/* 4 Multiple-Choice Options */}
      <div className="w-full max-w-[320px] grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
        {challenge.options?.map((option, idx) => {
          const isThisSelected = selectedChordId === option.id;
          const isThisTarget = option.id === targetChord.id;

          let btnStyle =
            'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200';

          if (!isPending) {
            if (isThisTarget) {
              btnStyle =
                'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/50';
            } else if (isThisSelected && !isThisTarget) {
              btnStyle =
                'bg-rose-950/60 border-rose-500 text-rose-200 line-through opacity-85';
            } else {
              btnStyle = 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60';
            }
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={!isPending}
              onClick={() => onSelectOption(option)}
              className={`relative flex items-center justify-between min-h-[48px] px-3 py-2.5 rounded-xl border text-left transition-all active:scale-98 cursor-pointer select-none ${btnStyle} ${
                !isPending ? 'cursor-default pointer-events-none' : ''
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-5 h-5 rounded-md bg-slate-900/70 border border-slate-700/60 text-[11px] font-mono font-bold flex items-center justify-center text-slate-400 shrink-0">
                  {idx + 1}
                </span>
                <span className="text-sm font-semibold truncate">
                  {formatOptionLabel(option)}
                </span>
              </div>

              {!isPending && isThisTarget && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
              )}
              {!isPending && isThisSelected && !isThisTarget && (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Advance Button (shown after answering) */}
      {!isPending && (
        <div className="w-full max-w-[320px] mt-3 animate-in fade-in slide-in-from-bottom-2">
          <button
            type="button"
            onClick={onNext}
            autoFocus
            className="w-full flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm shadow-md shadow-amber-500/25 transition-all active:scale-95 cursor-pointer"
          >
            <span>{lang === 'es' ? 'Siguiente Acorde' : 'Next Chord'}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      )}
    </div>
  );
};
