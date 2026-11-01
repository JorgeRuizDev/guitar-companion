'use client';

import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export const PlatformHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-white hover:text-amber-400 transition-colors"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
            🎸
          </span>
          <span>{t.nav.brand}</span>
        </a>
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="flex items-center gap-1 sm:gap-2">
            <a
              href="/strumming"
              className="text-sm font-medium px-3 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 transition-all min-h-[44px] flex items-center"
            >
              {t.nav.strumming}
            </a>
            <a
              href="/basic-note-trainer"
              className="text-sm font-medium px-3 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 transition-all min-h-[44px] flex items-center"
            >
              {t.nav.noteTrainer}
            </a>
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};
