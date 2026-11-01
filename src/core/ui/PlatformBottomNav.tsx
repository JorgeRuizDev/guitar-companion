'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Music2, BookOpen } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const PlatformBottomNav: React.FC = () => {
  const { t } = useLanguage();
  const pathname = usePathname();

  // Suppress navigation completely on dedicated embed views
  if (pathname?.includes('/embed')) {
    return null;
  }

  const isHomeActive = pathname === '/';
  const isStrummingActive =
    pathname === '/strumming' || pathname?.startsWith('/strumming/');
  const isNoteTrainerActive =
    pathname === '/basic-note-trainer' || pathname?.startsWith('/basic-note-trainer/');

  const navItems = [
    {
      href: '/',
      label: t.nav.home,
      shortLabel: t.nav.home,
      icon: Home,
      isActive: isHomeActive,
    },
    {
      href: '/strumming',
      label: t.nav.strumming,
      shortLabel: t.nav.strummingShort,
      icon: Music2,
      isActive: isStrummingActive,
    },
    {
      href: '/basic-note-trainer',
      label: t.nav.noteTrainer,
      shortLabel: t.nav.noteTrainerShort,
      icon: BookOpen,
      isActive: isNoteTrainerActive,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1 pb-[env(safe-area-inset-bottom,0px)]"
      aria-label={t.nav.mobileNavLabel}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.isActive ? 'page' : undefined}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-h-[52px] select-none ${
                item.isActive
                  ? 'text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 active:bg-slate-800/40'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  item.isActive ? 'bg-amber-500/15 scale-110' : ''
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    item.isActive ? 'text-amber-400' : 'text-slate-400'
                  }`}
                />
              </div>
              <span className="text-[11px] leading-tight mt-0.5 text-center truncate max-w-[90px]">
                {item.shortLabel}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
