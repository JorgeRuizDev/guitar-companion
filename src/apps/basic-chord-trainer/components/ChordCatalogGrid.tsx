'use client';

import React, { useMemo, useState } from 'react';
import { ChordCategory, ChordDefinition } from '../types';
import {
  CHORD_CATALOG,
  CHORD_PRESETS,
} from '../domain/chordCatalog';
import { chordDefinitionToFretboardState } from '../domain/fretboardEvaluator';
import { FretboardDiagram } from './FretboardDiagram';
import { Check, Sparkles, Filter } from 'lucide-react';

interface ChordCatalogGridProps {
  selectedChordIds: string[];
  onToggleChord: (chordId: string) => void;
  onApplyPreset: (chordSymbols: readonly string[]) => void;
  onSelectAll: () => void;
  lang?: 'en' | 'es';
}

const CATEGORY_TITLES: Record<ChordCategory, { en: string; es: string }> = {
  'open-major': { en: 'Open Majors', es: 'Mayores Abiertos' },
  'open-minor': { en: 'Open Minors', es: 'Menores Abiertos' },
  'open-7th': { en: 'Open Dominant 7ths', es: '7ªs Dominantes Abiertas' },
  'open-variation': {
    en: 'Open Variations & Sus Chords',
    es: 'Variaciones Abiertas y Suspendidos',
  },
};

export const ChordCatalogGrid: React.FC<ChordCatalogGridProps> = ({
  selectedChordIds,
  onToggleChord,
  onApplyPreset,
  onSelectAll,
  lang = 'en',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ChordCategory | 'all'>('all');

  const categories: ChordCategory[] = [
    'open-major',
    'open-minor',
    'open-7th',
    'open-variation',
  ];

  const filteredChords = useMemo(() => {
    if (selectedCategory === 'all') return CHORD_CATALOG;
    return CHORD_CATALOG.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section className="w-full max-w-4xl mx-auto mt-8 select-none">
      {/* Title & Counter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{lang === 'es' ? 'Catálogo de Acordes Abiertos' : 'Open Chords Catalog'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 font-mono border border-slate-700">
              {selectedChordIds.length} / {CHORD_CATALOG.length}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {lang === 'es'
              ? 'Toca cualquier acorde para incluirlo o excluirlo de tu práctica.'
              : 'Tap any chord to include or exclude it from your practice.'}
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CHORD_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                if (preset.id === 'all') {
                  onSelectAll();
                } else {
                  onApplyPreset(preset.chordSymbols);
                }
              }}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors active:scale-95 cursor-pointer whitespace-nowrap"
            >
              {lang === 'es' ? preset.labelEs : preset.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tab Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
          }`}
        >
          {lang === 'es' ? 'Todos los acordes' : 'All Chords'}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'es' ? CATEGORY_TITLES[cat].es : CATEGORY_TITLES[cat].en}
          </button>
        ))}
      </div>

      {/* Grid of Chord Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredChords.map((chord) => {
          const isSelected = selectedChordIds.includes(chord.id);
          const fretState = chordDefinitionToFretboardState(chord);

          return (
            <div
              key={chord.id}
              onClick={() => onToggleChord(chord.id)}
              className={`relative flex flex-col items-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-amber-500/70 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/30'
                  : 'bg-slate-900/60 border-slate-800/80 opacity-60 hover:opacity-85'
              }`}
            >
              {/* Checkbox badge */}
              <div
                className={`absolute top-2 right-2 w-4 h-4 rounded-md flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950'
                    : 'border border-slate-700 bg-slate-800/80'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>

              {/* Chord Title */}
              <div className="text-center mb-1">
                <span className="text-base font-black text-white leading-tight">
                  {chord.symbol}
                </span>
                <span className="block text-[11px] text-slate-400 font-medium leading-none">
                  {chord.solfegeName}
                </span>
              </div>

              {/* Fretboard Diagram preview */}
              <FretboardDiagram
                fretboardState={fretState}
                targetChord={chord}
                isInteractive={false}
                showFingerNumbers={true}
                compact={true}
                lang={lang}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};
