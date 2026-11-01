/**
 * Core Translation Dictionaries
 * @module core/i18n/translations
 */

import { Language, TranslationDictionary } from './types';

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    nav: {
      home: 'Home',
      strumming: 'Strumming Trainer',
      noteTrainer: 'Note Trainer',
      strummingShort: 'Strumming',
      noteTrainerShort: 'Notes',
      brand: 'Guitar Companion',
      mobileNavLabel: 'Mobile navigation',
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
      home: 'Inicio',
      strumming: 'Entrenador de Ritmo',
      noteTrainer: 'Entrenador de Notas',
      strummingShort: 'Ritmo',
      noteTrainerShort: 'Notas',
      brand: 'Guitar Companion',
      mobileNavLabel: 'Navegación móvil',
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
