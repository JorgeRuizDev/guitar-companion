'use client';

import Link from "next/link";
import { ArrowRight, Music2, Clock, Sparkles, BookOpen } from "lucide-react";
import { useLanguage } from "@/core/i18n/LanguageContext";

export default function PlatformHomePage() {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:py-20 flex-1 flex flex-col justify-center">
      <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isEs ? 'Suite Interactiva para Guitarristas' : 'Interactive Guitar Suite'}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {isEs
            ? 'Domina el ritmo, el compás y el diapasón.'
            : 'Master rhythm, timing, and fretboard mechanics.'}
        </h1>
        <p className="text-base sm:text-lg text-slate-400">
          {isEs
            ? 'Herramientas ligeras con aceleración por hardware diseñadas para guitarra acústica y eléctrica. Modo invitado sin registro, privacidad total, sin fricción.'
            : 'Lightweight, hardware-accelerated practice tools designed for acoustic and electric guitarists. Zero-mock, privacy-first, zero friction.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
        {/* App 001: Strumming Pattern Trainer */}
        <Link
          href="/strumming"
          className="group relative p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all duration-200 flex flex-col justify-between shadow-xl shadow-black/40 min-h-[44px]"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Music2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {isEs ? 'Aplicación 001' : 'Application 001'}
              </span>
              <h2 className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors mt-1">
                {isEs ? 'Entrenador de Ritmo' : 'Strumming Pattern Trainer'}
              </h2>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {isEs
                ? 'Línea de tiempo interactiva con metrónomo sincronizado de alta precisión, subdivisiones de corcheas y semicorcheas, patrones clásicos y temporizador de práctica.'
                : 'Interactive visual timeline with synchronized precision metronome, customizable 8th and 16th subdivisions, popular beginner presets, and dedicated practice timer.'}
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>{isEs ? 'Abrir Entrenador' : 'Launch Trainer'}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        {/* App 002: Basic Note Trainer */}
        <Link
          href="/basic-note-trainer"
          className="group relative p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all duration-200 flex flex-col justify-between shadow-xl shadow-black/40 min-h-[44px]"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {isEs ? 'Aplicación 002' : 'Application 002'}
              </span>
              <h2 className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors mt-1">
                {isEs ? 'Entrenador de Notas' : 'Basic Note Trainer'}
              </h2>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {isEs
                ? 'Traduce con soltura entre letras anglosajonas (A-G) y el solfeo europeo (Do-Si), domina las alteraciones cromáticas (#/b) y los semitonos naturales con tarjetas interactivas.'
                : 'Translate effortlessly between Anglo-Saxon letters (A-G) and European Solfège (Do-Si), master chromatic accidentals, and memorize natural semitones with interactive flashcards.'}
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>{isEs ? 'Abrir Entrenador' : 'Launch Trainer'}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Coming Soon: Fretboard Navigator */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800/50 flex flex-col justify-between opacity-75">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isEs ? 'Próximamente' : 'Coming Soon'}
              </span>
              <h2 className="text-2xl font-bold text-slate-400 mt-1">
                {isEs ? 'Navegador del Diapasón' : 'Fretboard Navigator'}
              </h2>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              {isEs
                ? 'Visualización interactiva para escalas, tríadas e intervalos en todas las afinaciones de guitarra y posiciones CAGED.'
                : 'Interactive visualization for scales, triads, and intervals across all guitar tunings and CAGED positions.'}
            </p>
          </div>
          <div className="mt-8 text-xs font-medium text-slate-600">
            {isEs ? 'En desarrollo' : 'In Development'}
          </div>
        </div>
      </div>
    </div>
  );
}
