import Link from "next/link";
import { ArrowRight, Music2, Clock, Sparkles } from "lucide-react";

export default function PlatformHomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-20 flex-1 flex flex-col justify-center">
      <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Guitar Suite</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Master rhythm, timing, and fretboard mechanics.
        </h1>
        <p className="text-base sm:text-lg text-slate-400">
          Lightweight, hardware-accelerated practice tools designed for acoustic and electric guitarists. Zero-mock, privacy-first, zero friction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
        <Link
          href="/strumming"
          className="group relative p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all duration-200 flex flex-col justify-between shadow-xl shadow-black/40 min-h-[44px]"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Music2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Application 001</span>
              <h2 className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors mt-1">
                Strumming Pattern Trainer
              </h2>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Interactive visual timeline with synchronized precision metronome, customizable 8th and 16th subdivisions, popular beginner presets, and dedicated practice timer.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>Launch Trainer</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800/50 flex flex-col justify-between opacity-75">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Coming Soon</span>
              <h2 className="text-2xl font-bold text-slate-400 mt-1">Fretboard Navigator</h2>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Interactive visualization for scales, triads, and intervals across all guitar tunings and CAGED positions.
            </p>
          </div>
          <div className="mt-8 text-xs font-medium text-slate-600">In Development</div>
        </div>
      </div>
    </div>
  );
}
