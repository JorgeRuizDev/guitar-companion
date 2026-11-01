'use client';

import React, { useState } from 'react';
import { PracticeMode } from '../types';
import { generateEmbedUrl } from '../domain/queryParams';
import { Copy, Check, ExternalLink, Play, SlidersHorizontal } from 'lucide-react';

interface EmbedLinkGeneratorProps {
  selectedChordSymbols: string[];
  activeMode: PracticeMode;
  onApplyConfig: (mode: PracticeMode) => void;
  lang?: 'en' | 'es';
}

export const EmbedLinkGenerator: React.FC<EmbedLinkGeneratorProps> = ({
  selectedChordSymbols,
  activeMode,
  onApplyConfig,
  lang = 'en',
}) => {
  const [mode, setMode] = useState<PracticeMode>(activeMode);
  const [isEmbedRoute, setIsEmbedRoute] = useState(true);
  const [selectedLang, setSelectedLang] = useState<'en' | 'es'>(lang);
  const [copied, setCopied] = useState(false);

  // Generate URL
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const relativeUrl = generateEmbedUrl({
    chords: selectedChordSymbols,
    mode,
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

  return (
    <section className="w-full max-w-4xl mx-auto mt-8 p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl select-none">
      <div className="flex items-center gap-2 mb-3">
        <SlidersHorizontal className="w-5 h-5 text-amber-400" />
        <h2 className="text-xl font-black text-white tracking-tight">
          {lang === 'es'
            ? 'Generador de Enlaces y Modo Embed para Apps'
            : 'Link Generator & Embed Webview Mode'}
        </h2>
      </div>

      <p className="text-xs sm:text-sm text-slate-400 mb-5">
        {lang === 'es'
          ? 'Personaliza los parámetros para generar un enlace directo o embeber este entrenador en una app móvil nativa (iOS WKWebView / Android WebView).'
          : 'Customize parameters to generate a direct link or embed this trainer into native mobile WebViews.'}
      </p>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {/* Mode Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {lang === 'es' ? 'Modo de Entrenamiento' : 'Practice Mode'}
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            {(['alternate', 'draw', 'identify'] as const).map((m) => (
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
                {m === 'alternate'
                  ? lang === 'es'
                    ? 'Alternado'
                    : 'Alternate'
                  : m === 'draw'
                  ? lang === 'es'
                    ? 'Dibuja'
                    : 'Draw'
                  : lang === 'es'
                  ? 'Identifica'
                  : 'Identify'}
              </button>
            ))}
          </div>
        </div>

        {/* Route / Embedding Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {lang === 'es' ? 'Tipo de Vista' : 'View Type'}
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
              {lang === 'es' ? 'Embed (Limpio)' : 'Embed (Clean)'}
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
              {lang === 'es' ? 'Página Completa' : 'Full Page'}
            </button>
          </div>
        </div>

        {/* Language Parameter */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {lang === 'es' ? 'Idioma del Enlace' : 'Link Language'}
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
                {lang === 'es' ? '¡Copiado!' : 'Copied!'}
              </span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{lang === 'es' ? 'Copiar' : 'Copy'}</span>
            </>
          )}
        </button>
      </div>

      {/* Action Buttons: Start Practice with this config & Open Preview */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onApplyConfig(mode)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>
            {lang === 'es'
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
          <span>{lang === 'es' ? 'Abrir vista previa' : 'Open preview'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
};
