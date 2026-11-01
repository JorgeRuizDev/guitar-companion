/**
 * Core Translation Dictionaries
 * @module core/i18n/translations
 */

import { Language, TranslationDictionary } from './types';

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    nav: {
      strumming: 'Strumming Trainer',
      noteTrainer: 'Note Trainer',
      brand: 'Guitar Companion',
    },
    footer: {
      tagline: 'Guitar Companion Platform • Real-time interactive tools for guitarists.',
    },
    common: {
      language: 'Language',
      english: 'EN',
      spanish: 'ES',
    },
  },
  es: {
    nav: {
      strumming: 'Entrenador de Ritmo',
      noteTrainer: 'Entrenador de Notas',
      brand: 'Guitar Companion',
    },
    footer: {
      tagline: 'Plataforma Guitar Companion • Herramientas interactivas en tiempo real para guitarristas.',
    },
    common: {
      language: 'Idioma',
      english: 'EN',
      spanish: 'ES',
    },
  },
};
