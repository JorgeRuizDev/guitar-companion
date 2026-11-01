'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PracticeMode, TrainerConfig } from '../types';
import { useLanguage } from '@/core/i18n/LanguageContext';
import { CHORD_CATALOG, getChordById, getChordBySymbol } from '../domain/chordCatalog';
import { chordTrainerStorage } from '../storage/chordTrainerStorage';
import { ChordTrainerApp } from './ChordTrainerApp';
import { ChordCatalogGrid } from './ChordCatalogGrid';
import { EmbedLinkGenerator } from './EmbedLinkGenerator';
import { BookOpen, Layers } from 'lucide-react';

interface BasicChordTrainerContainerProps {
  initialConfig?: Partial<TrainerConfig>;
}

export const BasicChordTrainerContainer: React.FC<BasicChordTrainerContainerProps> = ({
  initialConfig,
}) => {
  const { language } = useLanguage();
  const lang = initialConfig?.lang || language;

  // Initial state from storage or config
  const [selectedChordIds, setSelectedChordIds] = useState<string[]>(() => {
    if (initialConfig?.chords && initialConfig.chords.length > 0) {
      const resolved = initialConfig.chords
        .map((s) => getChordBySymbol(s)?.id || getChordById(s)?.id)
        .filter((id): id is string => Boolean(id));
      if (resolved.length > 0) return resolved;
    }
    return chordTrainerStorage.getPreferences().selectedChordIds;
  });

  const [mode, setMode] = useState<PracticeMode>(
    initialConfig?.mode || chordTrainerStorage.getPreferences().selectedMode
  );

  // Key to force reload trainer app when config changes
  const [sessionKey, setSessionKey] = useState(0);

  // Sync state to local storage (Guest Mode, Zero-Mock)
  useEffect(() => {
    chordTrainerStorage.savePreferences({
      selectedChordIds,
      selectedMode: mode,
    });
  }, [selectedChordIds, mode]);

  const selectedChordSymbols = useMemo(() => {
    return selectedChordIds
      .map((id) => getChordById(id)?.symbol)
      .filter((s): s is string => Boolean(s));
  }, [selectedChordIds]);

  const activeConfig: TrainerConfig = useMemo(() => {
    return {
      chords: selectedChordSymbols,
      mode,
      embed: false,
      compact: false,
      lang,
    };
  }, [selectedChordSymbols, mode, lang]);

  const handleToggleChord = useCallback((chordId: string) => {
    setSelectedChordIds((prev) => {
      const exists = prev.includes(chordId);
      if (exists) {
        // Keep at least 1 chord
        if (prev.length <= 1) return prev;
        return prev.filter((id) => id !== chordId);
      }
      return [...prev, chordId];
    });
    setSessionKey((k) => k + 1);
  }, []);

  const handleApplyPreset = useCallback((chordSymbols: readonly string[]) => {
    const ids = chordSymbols
      .map((s) => getChordBySymbol(s)?.id)
      .filter((id): id is string => Boolean(id));
    if (ids.length > 0) {
      setSelectedChordIds(ids);
      setSessionKey((k) => k + 1);
    }
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedChordIds(CHORD_CATALOG.map((c) => c.id));
    setSessionKey((k) => k + 1);
  }, []);

  const handleApplyConfigFromGenerator = useCallback((newMode: PracticeMode) => {
    setMode(newMode);
    setSessionKey((k) => k + 1);
    // Smooth scroll to trainer card
    const trainerEl = document.getElementById('chord-trainer-session');
    trainerEl?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-8">
      {/* Hero Header */}
      <header className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>
            {lang === 'es'
              ? 'Herramienta Interactiva • Aplicación 003'
              : 'Interactive Tool • Application 003'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {lang === 'es' ? 'Entrenador de Acordes Básicos' : 'Basic Chord Trainer'}
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 mt-2 sm:mt-3 leading-relaxed">
          {lang === 'es'
            ? 'Domina los 22 acordes abiertos esenciales en la guitarra conectando la notación anglosajona (C, Am, G7) y el solfeo europeo (Do Mayor, La menor, Sol 7ª) mediante práctica bidireccional.'
            : 'Master the 22 essential beginner open guitar chords bridging Anglo-Saxon letter notation and European Solfège through interactive fretboard drawing and visual identification.'}
        </p>
      </header>

      {/* Main Trainer Card Container */}
      <section id="chord-trainer-session" className="w-full flex justify-center mb-10">
        <ChordTrainerApp
          key={`trainer-session-${sessionKey}-${mode}-${lang}`}
          config={activeConfig}
          onAnswerEvaluated={(data) => {
            chordTrainerStorage.recordSessionResult(
              data.isCorrect ? 1 : 0,
              data.isCorrect ? 0 : 1,
              data.sessionMetrics.currentStreak
            );
          }}
        />
      </section>

      {/* Open Chords Catalog Grid with Presets */}
      <ChordCatalogGrid
        selectedChordIds={selectedChordIds}
        onToggleChord={handleToggleChord}
        onApplyPreset={handleApplyPreset}
        onSelectAll={handleSelectAll}
        lang={lang}
      />

      {/* Embed Link Generator */}
      <EmbedLinkGenerator
        selectedChordSymbols={selectedChordSymbols}
        activeMode={mode}
        onApplyConfig={handleApplyConfigFromGenerator}
        lang={lang}
      />
    </div>
  );
};
