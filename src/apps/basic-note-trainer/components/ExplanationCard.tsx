'use client';

import React from 'react';
import { Lightbulb, ArrowRight, BookOpen } from 'lucide-react';
import { Language, QuestionCategory } from '../types';
import { ChromaticScaleVisualizer } from './ChromaticScaleVisualizer';

export interface ExplanationCardProps {
  explanation: string;
  mnemonic: string;
  onNextCard: () => void;
  lang?: Language;
  noteReference?: string;
  category?: QuestionCategory;
  className?: string;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  explanation,
  mnemonic,
  onNextCard,
  lang = 'en',
  noteReference,
  category,
  className = '',
}) => {
  const isEs = lang === 'es';

  return (
    <div
      className={`w-full max-w-md mt-4 p-4 sm:p-5 rounded-2xl bg-neutral-900/95 border border-amber-500/30 shadow-xl backdrop-blur-md flex flex-col gap-3 animate-fadeIn transition-all ${className}`}
      role="region"
      aria-label={isEs ? 'Consejo didáctico y regla nemotécnica' : 'Pedagogical Explanation and Memory Trick'}
    >
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>{isEs ? 'Consejo didáctico' : 'Pedagogical Tip & Memory Trick'}</span>
        </div>
        <span className="text-[11px] text-neutral-400 font-mono">
          {isEs ? 'Recuperación' : 'Recovery Mode'}
        </span>
      </div>

      {/* Theoretical Explanation with Pre-Line Formatting */}
      <div className="space-y-1.5 text-left">
        <div className="flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
          <div className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal whitespace-pre-line font-sans">
            {explanation}
          </div>
        </div>
      </div>

      {/* Visual Chromatic Scale Map for Accidentals, Sequence, or when note reference is provided */}
      {category !== 'translation' && (
        <ChromaticScaleVisualizer
          highlightNote={noteReference}
          lang={lang}
        />
      )}

      {/* Mnemonic Trick Banner */}
      <div className="px-3 py-2 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs sm:text-sm font-medium flex items-center gap-2">
        <span className="text-base select-none">💡</span>
        <span className="leading-snug">{mnemonic}</span>
      </div>

      {/* Next Card Button */}
      <button
        type="button"
        onClick={onNextCard}
        autoFocus
        className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.99] text-neutral-950 font-bold text-sm sm:text-base transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 select-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-neutral-950"
      >
        <span>{isEs ? 'Siguiente tarjeta' : 'Next Card'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <p className="text-center text-[11px] text-neutral-500">
        {isEs
          ? 'Pulsa Enter o Espacio para continuar'
          : 'Press Enter or Space to proceed'}
      </p>
    </div>
  );
};
