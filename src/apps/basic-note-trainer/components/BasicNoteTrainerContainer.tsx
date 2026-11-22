'use client';

import React from 'react';
import { TrainerConfig } from '../types';
import { NoteTrainerApp } from './NoteTrainerApp';
import { useLanguage } from '@/core/i18n/LanguageContext';
import { Music2, Sparkles, BookOpen, Repeat } from 'lucide-react';

export interface BasicNoteTrainerContainerProps {
  config: TrainerConfig;
}

export const BasicNoteTrainerContainer: React.FC<BasicNoteTrainerContainerProps> = ({ config }) => {
  const { language } = useLanguage();
  const activeLang = config.lang ?? language ?? 'en';
  const isEs = activeLang === 'es';
  const [currentMode, setCurrentMode] = React.useState(config.mode);

  // Sync mode if initial config changes
  React.useEffect(() => {
    setCurrentMode(config.mode);
  }, [config.mode]);

  // Embed view (suppresses header & footer, minimal scrollable container)
  if (config.embed) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col justify-start items-center p-2 sm:p-3 overflow-y-auto overflow-x-hidden overscroll-y-contain select-none">
        <NoteTrainerApp
          config={{ ...config, mode: currentMode, embed: true, compact: true, lang: activeLang }}
          className="w-full"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-8">
      {/* Header & Intro */}
      <header className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
          <Music2 className="w-3.5 h-3.5" />
          <span>
            {isEs
              ? 'Fundamentos de Armonía • Aplicación 002'
              : 'Fretboard Foundations • Application 002'}
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {isEs ? 'Entrenador de Notas' : 'Basic Note Trainer'}
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 mt-2 sm:mt-3 leading-relaxed">
          {isEs ? (
            <>
              Traduce con fluidez entre la notación anglosajona (<code className="text-amber-300 font-mono">A, B, C, D, E, F, G</code>) y el solfeo (<code className="text-amber-300 font-mono">Do, Re, Mi, Fa, Sol, La, Si</code>), domina las alteraciones cromáticas, calcula intervalos musicales y memoriza los semitonos naturales con tarjetas interactivas y trucos nemotécnicos.
            </>
          ) : (
            <>
              Translate effortlessly between Anglo-Saxon letter notation (<code className="text-amber-300 font-mono">A, B, C, D, E, F, G</code>) and Solfège (<code className="text-amber-300 font-mono">Do, Re, Mi, Fa, Sol, La, Si</code>), master chromatic accidentals, calculate musical intervals, and memorize natural semitones with interactive flashcards and memory tricks.
            </>
          )}
        </p>
      </header>

      {/* Mode Selector Tabs */}
      <div className="w-full max-w-md mx-auto flex items-center p-1 mb-6 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
        {(
          [
            { id: 'mixed', labelEn: 'Mixed', labelEs: 'Mixto' },
            { id: 'translation', labelEn: 'Translation', labelEs: 'Traducción' },
            { id: 'accidentals', labelEn: 'Accidentals', labelEs: 'Alteraciones' },
            { id: 'intervals', labelEn: 'Intervals', labelEs: 'Intervalos' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            data-testid={`mode-tab-${tab.id}`}
            onClick={() => setCurrentMode(tab.id)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentMode === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isEs ? tab.labelEs : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Main Flashcard App Container */}
      <section id="note-trainer-session" className="w-full flex flex-col items-center mb-10">
        <NoteTrainerApp key={`trainer-${currentMode}-${activeLang}`} config={{ ...config, mode: currentMode, lang: activeLang }} />
      </section>

      {/* Educational Guide & Mnemonic Reference */}
      <section className="border-t border-slate-800/80 pt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>{isEs ? 'Reglas Nemotécnicas' : 'Mnemonic Memory Tricks'}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isEs ? (
              <>
                Recuerda <strong>&quot;Si-Do y Mi-Fa&quot;</strong>: Las dos únicas parejas de notas naturales SIN sostenido ni bemol entre ellas son <strong>B-C</strong> y <strong>E-F</strong>. Son trastes contiguos directos en tu guitarra.
              </>
            ) : (
              <>
                Remember <strong>&quot;Big Cats Eat Fish&quot;</strong>: The only two natural note pairs with NO sharp or flat between them are <strong>B-C</strong> and <strong>E-F</strong>. They are directly adjacent frets on your guitar.
              </>
            )}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>{isEs ? 'Anglosajón vs Solfeo' : 'Anglo-Saxon vs Solfège'}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isEs ? (
              <>
                Mientras la tradición anglosajona nombra notas con letras desde <strong>A (La)</strong> hasta <strong>G (Sol)</strong>, la tradición latina parte de <strong>C (Do)</strong>. A440Hz es el tono de concierto de referencia.
              </>
            ) : (
              <>
                While English speakers name notes with letters starting from <strong>A (La)</strong> to <strong>G (Sol)</strong>, Latin traditions use Solfège starting on <strong>C (Do)</strong>. A440Hz is standard concert pitch.
              </>
            )}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Repeat className="w-4 h-4" />
            <span>{isEs ? 'Reintento en el Acto' : 'In-Place Retry & Spaced Learning'}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isEs ? (
              <>
                ¿Has fallado una opción? ¡No te preocupes! Sigue pulsando en la misma tarjeta para hallar la respuesta. Al acertar se revelará la regla nemotécnica y la nota reaparecerá más tarde para afianzarla.
              </>
            ) : (
              <>
                Missed a card? No problem! Continue tapping on the same card to find the right answer. The trainer reveals mnemonic tips upon recovery and reintroduces missed notes later to lock them in.
              </>
            )}
          </p>
        </div>
      </section>
    </div>
  );
};
