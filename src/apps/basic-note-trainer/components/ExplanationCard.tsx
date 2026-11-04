'use client';

import React, { useEffect, useRef } from 'react';
import { Lightbulb, BookOpen } from 'lucide-react';
import { Language, QuestionCategory } from '../types';
import { ChromaticScaleVisualizer } from './ChromaticScaleVisualizer';
import { MnemonicBanner, ActionNextButton } from '@/core/ui/questions';

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
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-scroll smoothly into view so the explanation and action button are immediately visible on mobile
  useEffect(() => {
    const timer = setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  // Split explanation if it contains the full ASCII scale diagram to avoid viewport overflow
  const scaleMarkerIndex = explanation.indexOf('🎼');
  const mainExplanation =
    scaleMarkerIndex !== -1
      ? explanation.slice(0, scaleMarkerIndex).trim()
      : explanation.trim();
  const scaleText =
    scaleMarkerIndex !== -1
      ? explanation.slice(scaleMarkerIndex).trim()
      : null;

  return (
    <div
      ref={cardRef}
      className={`w-full max-w-md mt-3 p-3.5 sm:p-5 rounded-2xl bg-slate-900/95 border border-amber-500/30 shadow-xl backdrop-blur-md flex flex-col gap-3 animate-fadeIn transition-all ${className}`}
      role="region"
      aria-label={isEs ? 'Consejo didáctico y regla nemotécnica' : 'Pedagogical Explanation and Memory Trick'}
    >
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>{isEs ? 'Consejo didáctico' : 'Pedagogical Tip & Memory Trick'}</span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {isEs ? 'Recuperación' : 'Recovery Mode'}
        </span>
      </div>

      {/* Theoretical Explanation with Pre-Line Formatting */}
      <div className="space-y-1.5 text-left">
        <div className="flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-line font-sans">
            {mainExplanation}
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

      {/* Optional Collapsible Text Scale Reference */}
      {scaleText && (
        <details className="group rounded-xl bg-slate-950/60 border border-slate-800 p-2.5 text-xs text-slate-300 transition-all">
          <summary className="cursor-pointer font-medium text-amber-400 hover:text-amber-300 flex items-center justify-between select-none list-none outline-none">
            <span className="flex items-center gap-1.5">
              <span>🎼</span>
              <span>{isEs ? 'Ver escala cromática en texto' : 'View chromatic scale text'}</span>
            </span>
            <span className="text-[10px] text-slate-400 group-open:rotate-180 transition-transform duration-200">
              ▼
            </span>
          </summary>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] leading-relaxed whitespace-pre-line font-mono text-slate-300 overflow-x-auto max-h-48 overflow-y-auto">
            {scaleText}
          </div>
        </details>
      )}

      {/* Mnemonic Trick Banner */}
      <MnemonicBanner mnemonic={mnemonic} />

      {/* Next Card Button */}
      <ActionNextButton
        label={isEs ? 'Siguiente tarjeta' : 'Next Card'}
        onClick={onNextCard}
        autoFocus
      />

      <p className="text-center text-[11px] text-slate-500">
        {isEs
          ? 'Pulsa Enter o Espacio para continuar'
          : 'Press Enter or Space to proceed'}
      </p>
    </div>
  );
};
