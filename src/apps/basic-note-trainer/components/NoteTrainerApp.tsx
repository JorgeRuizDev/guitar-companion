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

  const isCompact = Boolean(config.compact || config.embed);

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

  return (
    <div
      className={`w-full flex flex-col items-center justify-start ${
        isCompact ? 'p-2 max-w-sm' : 'p-3 sm:p-5 max-w-md'
      } mx-auto bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl select-none ${className}`}
    >
      {/* Live Metrics Header Bar (Unified to Chord Trainer style) */}
      <LiveProgressBar
        stats={stats}
        isEmbed={effectiveConfig.embed}
        compact={isCompact}
        lang={effectiveLang}
      />

      {/* Main Flashcard Challenge Area */}
      <main className="w-full">
        <Flashcard
          card={card}
          status={status}
          disabledOptions={disabledOptions}
          compact={isCompact}
          lang={effectiveLang}
          onSelectOption={selectOption}
          onNextCard={nextCard}
        />

        {/* Pedagogical Explanation and Mnemonic Display upon Error Recovery */}
        {showExplanation && (
          <div className="w-full mt-3 animate-in fade-in slide-in-from-bottom-2">
            <ExplanationCard
              explanation={card.explanation}
              mnemonic={card.mnemonic}
              noteReference={card.noteReference}
              category={card.category}
              lang={effectiveLang}
              onNextCard={nextCard}
            />
          </div>
        )}
      </main>

      {/* Footer Instructions / Keyboard shortcuts hint */}
      {!isCompact && (
        <footer className="w-full mt-4 pt-2.5 border-t border-slate-800/80 text-center text-xs text-slate-500">
          <p className="hidden sm:block">
            {isEs ? (
              <>
                Usa los números <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">1</kbd> - <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">4</kbd> para responder, y <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Enter</kbd> para avanzar.
              </>
            ) : (
              <>
                Use hotkeys <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">1</kbd> - <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">4</kbd> to answer, <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Enter</kbd> to advance.
              </>
            )}
          </p>
        </footer>
      )}
    </div>
  );
};
