'use client';

import React from 'react';
import { FlashcardQuestion, CardStatus, Language } from '../types';
import { OptionButton } from './OptionButton';
import { Lightbulb, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import { ChromaticScaleVisualizer } from './ChromaticScaleVisualizer';

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
    return (
      <div
        className="w-full max-w-md mx-auto flex flex-col items-center bg-neutral-900/95 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md animate-fadeIn transition-all"
        role="region"
        aria-label={isEs ? 'Explicación pedagógica' : 'Pedagogical explanation'}
      >
        {/* Compact Recovery Header */}
        <div className="flex items-center justify-between w-full mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isEs ? '¡Correcto tras revisión!' : 'Correct on review!'}</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
            {card.noteReference}
          </span>
        </div>

        {/* Theoretical Explanation with Pre-Line Formatting */}
        <div className="w-full space-y-1 text-left mb-2.5">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
            <div className="text-xs sm:text-sm text-neutral-200 leading-snug whitespace-pre-line font-sans">
              {card.explanation}
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

        {/* Mnemonic Banner */}
        <div className="w-full px-3 py-2 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs sm:text-sm font-medium flex items-center gap-2 mb-3">
          <span className="text-sm select-none">💡</span>
          <span className="leading-tight">{card.mnemonic}</span>
        </div>

        {/* Compact Next Card Action Button */}
        {onNextCard && (
          <button
            type="button"
            onClick={onNextCard}
            autoFocus
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.99] text-neutral-950 font-bold text-sm transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 select-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-neutral-950"
          >
            <span>{isEs ? 'Siguiente tarjeta' : 'Next Card'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  const containerPadding = compact ? 'p-3.5 sm:p-4' : 'p-5 md:p-8';
  const promptMinHeight = compact ? 'min-h-[44px]' : 'min-h-[56px]';
  const promptTextSize = compact ? 'text-lg sm:text-xl' : 'text-xl md:text-2xl';

  return (
    <div
      className={`w-full max-w-md mx-auto flex flex-col items-center bg-neutral-900/70 border border-neutral-800 rounded-2xl ${containerPadding} shadow-xl backdrop-blur-sm transition-all`}
    >
      {/* Category Tag & Difficulty Badge */}
      <div className={`flex items-center gap-2 ${compact ? 'mb-2' : 'mb-4'}`}>
        <span
          className={`text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${
            card.category === 'translation'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : card.category === 'accidentals'
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}
        >
          {categoryLabel}
        </span>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
          {difficultyLabel}
        </span>
      </div>

      {/* Primary Prompt */}
      <h2
        className={`${promptTextSize} font-bold text-center text-neutral-100 ${promptMinHeight} flex items-center justify-center mb-1 leading-snug`}
      >
        {card.prompt}
      </h2>

      {/* Sub-prompt / Secondary Context */}
      {card.subPrompt && (
        <p className={`text-xs sm:text-sm text-neutral-400 ${compact ? 'mb-3' : 'mb-6'} text-center font-medium`}>
          {card.subPrompt}
        </p>
      )}

      {/* Retry Hint Notification */}
      {status === 'RETRYING' && (
        <div
          className={`w-full ${compact ? 'mb-3 py-1.5 px-2.5 text-[11px]' : 'mb-4 py-2 px-3 text-xs'} rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-center flex items-center justify-center gap-1.5 animate-fadeIn`}
        >
          <span>💡</span>
          <span>{card.hint}</span>
        </div>
      )}

      {/* 2x2 Options Grid */}
      <div className={`grid grid-cols-2 ${compact ? 'gap-2.5' : 'gap-3'} w-full ${compact ? 'mt-1' : 'mt-2'}`}>
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
