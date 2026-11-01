'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../i18n/LanguageContext';

export const PlatformFooter: React.FC = () => {
  const { t } = useLanguage();
  const pathname = usePathname();

  // Suppress footer on embed routes
  if (pathname?.includes('/embed')) {
    return null;
  }

  return (
    <footer className="border-t border-slate-900 py-6 mb-16 md:mb-0 text-center text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4">
        <p>{t.footer.tagline}</p>
      </div>
    </footer>
  );
};
