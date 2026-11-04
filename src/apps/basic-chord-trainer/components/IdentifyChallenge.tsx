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
import { OptionButton } from '@/core/ui/OptionButton';
import { ActionNextButton } from '@/core/ui/questions';

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

  const prompt = formatPromptTitle(targetChord, lang, 'identify', challenge.notation);
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

      {/* 4 Multiple-Choice Options in 2x2 Grid */}
      <div className="w-full max-w-[340px] grid grid-cols-2 gap-2 mt-2.5">
        {challenge.options?.map((option, idx) => {
          const isThisSelected = selectedChordId === option.id;
          const isThisTarget = option.id === targetChord.id;

          return (
            <OptionButton
              key={option.id}
              label={formatOptionLabel(option, challenge.notation, lang)}
              index={idx}
              isCorrect={!isPending && isThisTarget}
              isIncorrect={!isPending && isThisSelected && !isThisTarget}
              isDisabled={!isPending && !isThisTarget}
              compact={compact}
              onClick={() => onSelectOption(option)}
            />
          );
        })}
      </div>

      {/* Advance Button (shown after answering) */}
      {!isPending && (
        <div className="w-full max-w-[340px] mt-3 animate-in fade-in slide-in-from-bottom-2">
          <ActionNextButton
            label={lang === 'es' ? 'Siguiente Acorde' : 'Next Chord'}
            onClick={onNext}
            autoFocus
          />
        </div>
      )}
    </div>
  );
};
