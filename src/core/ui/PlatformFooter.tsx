'use client';

import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export const PlatformFooter: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4">
        <p>{t.footer.tagline}</p>
      </div>
    </footer>
  );
};
