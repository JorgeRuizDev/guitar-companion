import { StrummingPlayer } from "@/apps/strumming/components/StrummingPlayer";
import { beginnerPresets } from "@/apps/strumming/presets/beginnerPatterns";
import { Music, Zap, Sliders, CheckCircle2 } from "lucide-react";

export default function StrummingTrainerPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Educational Header & Intro */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Music className="w-3.5 h-3.5" />
          <span>Rhythm & Timing Mastery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Guitar Strumming Pattern Trainer
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          Practice acoustic and electric rhythm with real-time visual feedback and an audio-synchronized metronome. Select beginner presets, toggle stroke directions, adjust BPM, and lock in your hand motion.
        </p>
      </div>

      {/* Main Interactive Single-Page Player */}
      <StrummingPlayer initialPattern={beginnerPresets[0]} />

      {/* Educational Guide & Reference */}
      <section className="border-t border-slate-800/80 pt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <Zap className="w-4 h-4" />
            <span>Keyboard Shortcuts</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[11px]">SPACE</kbd> anywhere on the page to start or pause practice. Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[11px]">⌫ BACKSPACE</kbd> (or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[11px]">RETURN</kbd>) to instantly return to Count-In and restart the measure.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
            <Sliders className="w-4 h-4" />
            <span>Rhythmic Subdivisions</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Standard 8th notes divide each 4/4 measure into 8 counts (<code className="text-slate-200">1 & 2 & 3 & 4 &</code>). 16th notes divide into 16 micro-slots (<code className="text-slate-200">1 e & a</code>) for funk and detailed strumming.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Screen Wake Lock</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your device screen stays active automatically while practice is running, so you can practice with both hands on the fretboard without your phone or laptop dimming.
          </p>
        </div>
      </section>
    </div>
  );
}
