'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export const PlatformHeader: React.FC = () => {
  const { t } = useLanguage();
  const pathname = usePathname();

  // Suppress header completely when in dedicated embed mode
  if (pathname?.includes('/embed')) {
    return null;
  }

  const isStrummingActive =
    pathname === '/strumming' || pathname?.startsWith('/strumming/');
  const isNoteTrainerActive =
    pathname === '/basic-note-trainer' || pathname?.startsWith('/basic-note-trainer/');

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 w-full">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Brand link */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-2.5 font-bold text-base sm:text-lg tracking-tight text-white hover:text-amber-400 transition-colors shrink-0"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 shrink-0">
            🎸
          </span>
          <span className="whitespace-nowrap">{t.nav.brand}</span>
        </Link>

        {/* Right Section: Desktop Navigation & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Desktop Navigation Links: Hidden on phone viewports to prevent header overflow */}
          <nav
            className="hidden md:flex items-center gap-1 sm:gap-2"
            aria-label="Desktop Navigation"
          >
            <Link
              href="/strumming"
              className={`text-sm font-medium px-3 py-2 rounded-lg transition-all min-h-[44px] flex items-center whitespace-nowrap ${
                isStrummingActive
                  ? 'bg-slate-800 text-amber-400 font-semibold shadow-inner'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {t.nav.strumming}
            </Link>
            <Link
              href="/basic-note-trainer"
              className={`text-sm font-medium px-3 py-2 rounded-lg transition-all min-h-[44px] flex items-center whitespace-nowrap ${
                isNoteTrainerActive
                  ? 'bg-slate-800 text-amber-400 font-semibold shadow-inner'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {t.nav.noteTrainer}
            </Link>
          </nav>

          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};
