'use client';

import React from 'react';
import { TrainerConfig } from '../types';
import { useLanguage } from '@/core/i18n/LanguageContext';
import { useTrainerSession } from '../hooks/useTrainerSession';
import { useTrainerKeyboard } from '../hooks/useTrainerKeyboard';
import { usePostMessageBridge } from '../hooks/usePostMessageBridge';
import { Flashcard } from './Flashcard';
import { ExplanationCard } from './ExplanationCard';
import { LiveProgressBar } from './LiveProgressBar';

export interface NoteTrainerAppProps {
  config: TrainerConfig;
  className?: string;
}

export const NoteTrainerApp: React.FC<NoteTrainerAppProps> = ({
  config,
  className = '',
}) => {
  const { language: contextLang } = useLanguage();
  // Query param lang takes precedence; otherwise fallback to context language
  const effectiveLang = config.lang ?? contextLang ?? 'en';
  const effectiveConfig: TrainerConfig = {
    ...config,
    lang: effectiveLang,
  };

  const isCompact = config.compact ?? config.embed ?? false;

  // PostMessage event bridge for external host applications / web-views
  const { dispatchAnswer, dispatchProgress } = usePostMessageBridge({
    isEnabled: effectiveConfig.embed,
  });

  const {
    card,
    status,
    disabledOptions,
    showExplanation,
    stats,
    selectOption,
    nextCard,
  } = useTrainerSession({
    config: effectiveConfig,
    onAnswer: dispatchAnswer,
    onProgress: dispatchProgress,
  });

  // Hook keyboard shortcuts 1-4 and Enter/Space
  useTrainerKeyboard({
    optionsCount: card.options.length,
    onSelectOptionIndex: (index) => {
      const option = card.options[index];
      if (option) selectOption(option);
    },
    onNextCard: nextCard,
    isNextActive: showExplanation,
  });

  const isEs = effectiveLang === 'es';

  // Compact layout (used in embed mode or whenever compact is requested)
  if (isCompact) {
    return (
      <div
        className={`w-full max-w-md mx-auto flex flex-col items-center justify-center p-2 transition-all ${className}`}
      >
        {/* Sleek slimline progress bar */}
        <LiveProgressBar
          stats={stats}
          isEmbed={effectiveConfig.embed}
          compact={true}
          lang={effectiveLang}
          className="mb-2 sm:mb-3"
        />

        {/* Compact in-place card (capping height <= 340px) */}
        <Flashcard
          card={card}
          status={status}
          disabledOptions={disabledOptions}
          compact={true}
          lang={effectiveLang}
          onSelectOption={selectOption}
          onNextCard={nextCard}
        />
      </div>
    );
  }

  // Standard standalone layout
  return (
    <div
      className={`w-full max-w-2xl mx-auto flex flex-col items-center justify-between min-h-[480px] p-2 sm:p-4 ${className}`}
    >
      {/* Live Progress Bar (Okeys vs Failures, Streak, Accuracy) */}
      <LiveProgressBar
        stats={stats}
        isEmbed={effectiveConfig.embed}
        compact={false}
        lang={effectiveLang}
        className="mb-4 sm:mb-6"
      />

      {/* Main Flashcard Container */}
      <div className="w-full flex flex-col items-center justify-center flex-1 my-auto">
        <Flashcard
          card={card}
          status={status}
          disabledOptions={disabledOptions}
          compact={false}
          lang={effectiveLang}
          onSelectOption={selectOption}
          onNextCard={nextCard}
        />

        {/* Pedagogical Explanation and Mnemonic Display upon Error Recovery */}
        {showExplanation && (
          <ExplanationCard
            explanation={card.explanation}
            mnemonic={card.mnemonic}
            noteReference={card.noteReference}
            category={card.category}
            lang={effectiveLang}
            onNextCard={nextCard}
          />
        )}
      </div>

      {/* Footer Instructions / Keyboard shortcuts hint */}
      <footer className="w-full mt-6 text-center text-xs text-neutral-500">
        <p className="hidden sm:block">
          {isEs ? (
            <>
              Usa los números <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">1</kbd> - <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">4</kbd> para responder, y <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">Enter</kbd> para avanzar.
            </>
          ) : (
            <>
              Use hotkeys <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">1</kbd> - <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">4</kbd> to answer, <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">Enter</kbd> to advance.
            </>
          )}
        </p>
      </footer>
    </div>
  );
};
