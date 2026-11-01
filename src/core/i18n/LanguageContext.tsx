'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, TranslationDictionary } from './types';
import { TRANSLATIONS } from './translations';
import { typedStorage } from '../storage/typedStorage';

const STORAGE_KEY = 'guitar-companion:language';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectInitialLanguage(fallback: Language = 'en'): Language {
  if (typeof window === 'undefined') return fallback;

  // 1. Query parameter has highest priority: ?lang=es or ?lang=en
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const queryLang = urlParams.get('lang') || urlParams.get('locale');
    if (queryLang === 'es' || queryLang === 'en') {
      return queryLang;
    }
  } catch {
    // ignore URL parsing error
  }

  // 2. Local storage
  const stored = typedStorage.get<string | null>(STORAGE_KEY, null);
  if (stored === 'es' || stored === 'en') {
    return stored;
  }

  // 3. Browser locale
  if (typeof navigator !== 'undefined' && navigator.language) {
    if (navigator.language.toLowerCase().startsWith('es')) {
      return 'es';
    }
  }

  return fallback;
}

export interface LanguageProviderProps {
  children: React.ReactNode;
  initialLanguage?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  initialLanguage,
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return initialLanguage ?? detectInitialLanguage('en');
  });

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    typedStorage.set(STORAGE_KEY, newLang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLang;
    }
  }, []);

  // On client mount, sync with stored or detected language in case SSR defaulted to 'en'
  useEffect(() => {
    const detected = detectInitialLanguage(language);
    if (detected !== language) {
      setLanguageState(detected);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = detected;
      }
    }
  }, []);

  // Sync with document lang and listen for query params changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t: TRANSLATIONS[language] || TRANSLATIONS.en,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'en',
      setLanguage: () => {},
      t: TRANSLATIONS.en,
    };
  }
  return context;
}
