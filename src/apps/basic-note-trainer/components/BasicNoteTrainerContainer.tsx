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

  // Embed view (suppresses header & footer, minimal scrollable container)
  if (config.embed) {
    return (
      <div className="fixed inset-0 z-50 bg-neutral-950 text-neutral-100 flex flex-col justify-start items-center p-2 sm:p-3 overflow-y-auto overflow-x-hidden overscroll-y-contain select-none">
        <NoteTrainerApp
          config={{ ...config, embed: true, compact: true, lang: activeLang }}
          className="w-full"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Header & Intro */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Music2 className="w-3.5 h-3.5" />
          <span>
            {isEs
              ? 'Fundamentos de Armonía y Diapasón'
              : 'Fretboard & Music Theory Foundations'}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {isEs ? 'Entrenador de Notas' : 'Basic Note Trainer'}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          {isEs ? (
            <>
              Traduce con fluidez entre la notación anglosajona (<code className="text-amber-300">A, B, C, D, E, F, G</code>) y el solfeo (<code className="text-amber-300">Do, Re, Mi, Fa, Sol, La, Si</code>), domina las alteraciones cromáticas y memoriza los semitonos naturales con tarjetas interactivas y trucos nemotécnicos.
            </>
          ) : (
            <>
              Translate effortlessly between Anglo-Saxon letter notation (<code className="text-amber-300">A, B, C, D, E, F, G</code>) and Solfège (<code className="text-amber-300">Do, Re, Mi, Fa, Sol, La, Si</code>), master chromatic accidentals, and memorize natural semitones with interactive flashcards and memory tricks.
            </>
          )}
        </p>
      </div>

      {/* Main Flashcard App Container */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-4 sm:p-8 backdrop-blur-sm">
        <NoteTrainerApp config={{ ...config, lang: activeLang }} />
      </div>

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
