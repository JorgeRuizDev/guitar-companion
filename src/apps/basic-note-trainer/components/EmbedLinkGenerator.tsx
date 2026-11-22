'use client';

import React, { useState, useEffect } from 'react';
import {
  DifficultyLevel,
  ExerciseType,
  TrainerConfig,
  TrainerMode,
  TranslationDirection,
} from '../types';
import { generateEmbedUrl } from '../domain/queryParams';
import { Copy, Check, ExternalLink, Play, SlidersHorizontal, CheckSquare, Square } from 'lucide-react';

export interface EmbedLinkGeneratorProps {
  activeMode: TrainerMode;
  activeExerciseTypes?: ExerciseType[];
  activeDirection?: TranslationDirection;
  activeDifficulty?: DifficultyLevel;
  onApplyConfig: (config: {
    mode: TrainerMode;
    exerciseTypes?: ExerciseType[];
    direction?: TranslationDirection;
    difficulty?: DifficultyLevel;
  }) => void;
  lang?: 'en' | 'es';
}

export const EmbedLinkGenerator: React.FC<EmbedLinkGeneratorProps> = ({
  activeMode,
  activeExerciseTypes = ['translation', 'accidentals', 'intervals'],
  activeDirection = 'both',
  activeDifficulty = 'beginner',
  onApplyConfig,
  lang = 'es',
}) => {
  const [mode, setMode] = useState<TrainerMode>(activeMode);
  const [selectedTypes, setSelectedTypes] = useState<ExerciseType[]>(activeExerciseTypes);
  const [direction, setDirection] = useState<TranslationDirection>(activeDirection);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(activeDifficulty);
  const [isEmbedRoute, setIsEmbedRoute] = useState(true);
  const [selectedLang, setSelectedLang] = useState<'en' | 'es'>(lang);
  const [copied, setCopied] = useState(false);

  // Sync mode and lang with parent if they change externally
  useEffect(() => {
    setMode(activeMode);
  }, [activeMode]);

  useEffect(() => {
    setSelectedLang(lang);
  }, [lang]);

  const toggleExerciseType = (type: ExerciseType) => {
    setSelectedTypes((prev) => {
      const exists = prev.includes(type);
      if (exists) {
        // Prevent deselecting all types (keep at least 1)
        if (prev.length <= 1) return prev;
        return prev.filter((t) => t !== type);
      }
      return [...prev, type];
    });
  };

  // Generate URL
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const relativeUrl = generateEmbedUrl({
    mode,
    exerciseTypes: mode === 'mixed' ? selectedTypes : undefined,
    direction,
    difficulty,
    embed: isEmbedRoute,
    lang: selectedLang,
  });
  const fullUrl = origin ? `${origin}${relativeUrl}` : relativeUrl;

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const handleApply = () => {
    onApplyConfig({
      mode,
      exerciseTypes: mode === 'mixed' ? selectedTypes : undefined,
      direction,
      difficulty,
    });
  };

  const isEs = lang === 'es';

  return (
    <section className="w-full max-w-4xl mx-auto mt-8 p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl select-none">
      <div className="flex items-center gap-2 mb-3">
        <SlidersHorizontal className="w-5 h-5 text-amber-400" />
        <h2 className="text-xl font-black text-white tracking-tight">
          {isEs
            ? 'Generador de Enlaces y Modo Embed para Apps'
            : 'Link Generator & Embed Webview Mode'}
        </h2>
      </div>

      <p className="text-xs sm:text-sm text-slate-400 mb-5">
        {isEs
          ? 'Personaliza los parámetros para generar un enlace directo o embeber este entrenador de notas en una app móvil nativa (iOS WKWebView / Android WebView).'
          : 'Customize parameters to generate a direct link or embed this note trainer into native mobile WebViews.'}
      </p>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* Mode Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {isEs ? 'Modo de Entrenamiento' : 'Practice Mode'}
          </label>
          <div className="grid grid-cols-2 gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            {(['mixed', 'translation', 'accidentals', 'intervals'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`text-xs py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  mode === m
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m === 'mixed'
                  ? isEs
                    ? 'Mixto'
                    : 'Mixed'
                  : m === 'translation'
                  ? isEs
                    ? 'Traducción'
                    : 'Translation'
                  : m === 'accidentals'
                  ? isEs
                    ? 'Alteraciones'
                    : 'Accidentals'
                  : isEs
                  ? 'Intervalos'
                  : 'Intervals'}
              </button>
            ))}
          </div>
        </div>

        {/* Direction / Notation */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {isEs ? 'Dirección de Notación' : 'Notation Direction'}
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            {(['both', 'letters-to-solfege', 'solfege-to-letters'] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => setDirection(dir)}
                className={`text-xs py-1.5 px-1 rounded-lg font-medium transition-colors cursor-pointer text-center truncate ${
                  direction === dir
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={
                  dir === 'both'
                    ? isEs
                      ? 'Ambas direcciones'
                      : 'Both directions'
                    : dir === 'letters-to-solfege'
                    ? isEs
                      ? 'Cifrado a Solfeo'
                      : 'Letters to Solfege'
                    : isEs
                    ? 'Solfeo a Cifrado'
                    : 'Solfege to Letters'
                }
              >
                {dir === 'both'
                  ? isEs
                    ? 'Ambas'
                    : 'Both'
                  : dir === 'letters-to-solfege'
                  ? isEs
                    ? 'A➔Do'
                    : 'A➔Do'
                  : isEs
                  ? 'Do➔A'
                  : 'Do➔A'}
              </button>
            ))}
          </div>
        </div>

        {/* Route / Embedding Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {isEs ? 'Tipo de Vista' : 'View Type'}
          </label>
          <div className="grid grid-cols-2 gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              type="button"
              onClick={() => setIsEmbedRoute(true)}
              className={`text-xs py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer ${
                isEmbedRoute
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isEs ? 'Embed (Limpio)' : 'Embed (Clean)'}
            </button>
            <button
              type="button"
              onClick={() => setIsEmbedRoute(false)}
              className={`text-xs py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer ${
                !isEmbedRoute
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isEs ? 'Página Completa' : 'Full Page'}
            </button>
          </div>
        </div>

        {/* Language Parameter */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {isEs ? 'Idioma del Enlace' : 'Link Language'}
          </label>
          <div className="grid grid-cols-2 gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              type="button"
              onClick={() => setSelectedLang('en')}
              className={`text-xs py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedLang === 'en'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setSelectedLang('es')}
              className={`text-xs py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedLang === 'es'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Español
            </button>
          </div>
        </div>
      </div>

      {/* Exercises included in Mixed Mode */}
      {mode === 'mixed' && (
        <div className="mb-5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-300">
              {isEs
                ? 'Ejercicios combinados en modo Mixto:'
                : 'Exercises combined in Mixed mode:'}
            </span>
            <span className="text-[11px] text-slate-400">
              {isEs
                ? '(Activa o desactiva qué tipos quieres incluir)'
                : '(Toggle which exercise types to include)'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'translation', labelEs: 'Traducción (Cifrado/Solfeo)', labelEn: 'Translation' },
                { id: 'accidentals', labelEs: 'Alteraciones (#, b, enarmonías)', labelEn: 'Accidentals' },
                { id: 'intervals', labelEs: 'Intervalos (3ª, 5ª, etc.)', labelEn: 'Intervals' },
              ] as const
            ).map((item) => {
              const active = selectedTypes.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleExerciseType(item.id)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-semibold shadow-sm'
                      : 'bg-slate-800/40 border-slate-700/40 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {active ? (
                    <CheckSquare className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  )}
                  <span className="truncate">{isEs ? item.labelEs : item.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* URL Display Box */}
      <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-xs text-amber-300 overflow-x-auto mb-4">
        <span className="truncate pr-20 select-all">{fullUrl}</span>

        <button
          type="button"
          onClick={handleCopy}
          className="absolute right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-sans text-xs font-semibold transition-all active:scale-95 cursor-pointer border border-slate-700"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
              <span className="text-emerald-400">
                {isEs ? '¡Copiado!' : 'Copied!'}
              </span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{isEs ? 'Copiar' : 'Copy'}</span>
            </>
          )}
        </button>
      </div>

      {/* Action Buttons: Start Practice with this config & Open Preview */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleApply}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>
            {isEs
              ? 'Practicar con esta selección'
              : 'Practice with this selection'}
          </span>
        </button>

        <a
          href={relativeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors p-2"
        >
          <span>{isEs ? 'Abrir vista previa' : 'Open preview'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
};
