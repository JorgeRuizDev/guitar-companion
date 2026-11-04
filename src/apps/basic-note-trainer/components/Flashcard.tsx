'use client';

import React from 'react';
import { FlashcardQuestion, CardStatus, Language } from '../types';
import { OptionButton } from './OptionButton';
import { BookOpen, CheckCircle } from 'lucide-react';
import { ChromaticScaleVisualizer } from './ChromaticScaleVisualizer';
import {
  MnemonicBanner,
  ActionNextButton,
  FeedbackBanner,
} from '@/core/ui/questions';

export interface FlashcardProps {
  card: FlashcardQuestion;
  status: CardStatus;
  disabledOptions: string[];
  onSelectOption: (option: string) => void;
  compact?: boolean;
  lang?: Language;
  onNextCard?: () => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  card,
  status,
  disabledOptions,
  onSelectOption,
  compact = false,
  lang = 'en',
  onNextCard,
}) => {
  const isEs = lang === 'es';
  const isResolved = status === 'SOLVED_DIRECT' || status === 'SOLVED_AFTER_ERROR';

  // Localized category badge
  const categoryLabel =
    card.category === 'translation'
      ? isEs
        ? 'Traducción'
        : 'Translation'
      : card.category === 'accidentals'
      ? isEs
        ? 'Alteraciones'
        : 'Accidentals'
      : isEs
      ? 'Secuencia'
      : 'Sequence';

  // Localized difficulty label
  const difficultyLabel =
    card.difficulty === 'beginner'
      ? isEs
        ? 'Principiante'
        : 'Beginner'
      : card.difficulty === 'intermediate'
      ? isEs
        ? 'Intermedio'
        : 'Intermediate'
      : isEs
      ? 'Avanzado'
      : 'Advanced';

  // Compact In-Place Recovery View (eliminates vertical overflow in embed mode)
  if (compact && status === 'SOLVED_AFTER_ERROR') {
    const scaleMarkerIndex = card.explanation.indexOf('🎼');
    const mainExplanation =
      scaleMarkerIndex !== -1
        ? card.explanation.slice(0, scaleMarkerIndex).trim()
        : card.explanation.trim();
    const scaleText =
      scaleMarkerIndex !== -1
        ? card.explanation.slice(scaleMarkerIndex).trim()
        : null;

    return (
      <div
        className="w-full max-w-md mx-auto flex flex-col items-center bg-slate-900/95 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md animate-fadeIn transition-all"
        role="region"
        aria-label={isEs ? 'Explicación pedagógica' : 'Pedagogical explanation'}
      >
        {/* Compact Recovery Header */}
        <div className="flex items-center justify-between w-full mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isEs ? '¡Correcto tras revisión!' : 'Correct on review!'}</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
            {card.noteReference}
          </span>
        </div>

        {/* Theoretical Explanation with Pre-Line Formatting */}
        <div className="w-full space-y-1 text-left mb-2.5">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div className="text-xs sm:text-sm text-slate-200 leading-snug whitespace-pre-line font-sans">
              {mainExplanation}
            </div>
          </div>
        </div>

        {/* Visual Chromatic Scale Map */}
        {card.category !== 'translation' && (
          <ChromaticScaleVisualizer
            highlightNote={card.noteReference}
            lang={lang}
            compact={true}
            className="mb-2.5"
          />
        )}

        {/* Optional Collapsible Text Scale Reference */}
        {scaleText && (
          <details className="w-full mb-2.5 group rounded-xl bg-slate-950/60 border border-slate-800 p-2 text-xs text-slate-300 transition-all">
            <summary className="cursor-pointer font-medium text-amber-400 hover:text-amber-300 flex items-center justify-between select-none list-none outline-none">
              <span className="flex items-center gap-1.5">
                <span>🎼</span>
                <span>{isEs ? 'Ver escala en texto' : 'View scale text'}</span>
              </span>
              <span className="text-[10px] text-slate-400 group-open:rotate-180 transition-transform duration-200">
                ▼
              </span>
            </summary>
            <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 text-[10px] leading-relaxed whitespace-pre-line font-mono text-slate-300 overflow-x-auto max-h-36 overflow-y-auto">
              {scaleText}
            </div>
          </details>
        )}

        {/* Mnemonic Banner */}
        <MnemonicBanner mnemonic={card.mnemonic} compact={true} />

        {/* Compact Next Card Action Button */}
        {onNextCard && (
          <ActionNextButton
            label={isEs ? 'Siguiente tarjeta' : 'Next Card'}
            onClick={onNextCard}
            autoFocus
          />
        )}
      </div>
    );
  }

  const promptMinHeight = compact ? 'min-h-[44px]' : 'min-h-[52px]';
  const promptTextSize = compact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl';

  return (
    <div className="w-full flex flex-col items-center max-w-md mx-auto">
      {/* Category Tag & Difficulty Badge */}
      <div className={`flex items-center justify-center gap-2 ${compact ? 'mb-2' : 'mb-3'}`}>
        <span
          className={`text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
            card.category === 'translation'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : card.category === 'accidentals'
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}
        >
          {categoryLabel}
        </span>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
          {difficultyLabel}
        </span>
      </div>

      {/* Primary Prompt */}
      <h2
        className={`${promptTextSize} font-black text-center text-white tracking-tight ${promptMinHeight} flex items-center justify-center mb-1 leading-snug`}
      >
        {card.prompt}
      </h2>

      {/* Sub-prompt / Secondary Context */}
      {card.subPrompt && (
        <p className={`text-xs sm:text-sm text-slate-400 ${compact ? 'mb-2.5' : 'mb-4'} text-center font-medium`}>
          {card.subPrompt}
        </p>
      )}

      {/* Retry Hint Notification */}
      {status === 'RETRYING' && (
        <FeedbackBanner variant="hint" compact={compact}>
          {card.hint}
        </FeedbackBanner>
      )}

      {/* 2x2 Options Grid */}
      <div className={`w-full max-w-[340px] grid grid-cols-2 ${compact ? 'gap-2' : 'gap-2.5'} mt-2`}>
        {card.options.map((option, index) => {
          const isCorrectAnswer = isResolved && option === card.correctAnswer;
          const isChosenIncorrect = disabledOptions.includes(option);
          const isDisabled = isResolved && !isCorrectAnswer;

          return (
            <OptionButton
              key={`${card.id}-${option}-${index}`}
              label={option}
              index={index}
              isCorrect={isCorrectAnswer}
              isIncorrect={isChosenIncorrect}
              isDisabled={isDisabled}
              compact={compact}
              onClick={onSelectOption}
            />
          );
        })}
      </div>
    </div>
  );
};
