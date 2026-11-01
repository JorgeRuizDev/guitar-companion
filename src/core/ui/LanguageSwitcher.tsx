'use client';

import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Globe } from 'lucide-react';

export interface LanguageSwitcherProps {
  className?: string;
  showIcon?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  showIcon = true,
}) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl select-none ${className}`}
      role="group"
      aria-label="Language selection"
    >
      {showIcon && (
        <span className="pl-2 pr-1 text-slate-500">
          <Globe className="w-3.5 h-3.5" />
        </span>
      )}
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`min-h-[44px] min-w-[36px] px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center justify-center ${
          language === 'en'
            ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('es')}
        aria-pressed={language === 'es'}
        className={`min-h-[44px] min-w-[36px] px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center justify-center ${
          language === 'es'
            ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        ES
      </button>
    </div>
  );
};
