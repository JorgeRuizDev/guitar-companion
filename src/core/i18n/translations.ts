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
      chordTrainer: 'Chord Trainer',
      strummingShort: 'Strumming',
      noteTrainerShort: 'Notes',
      chordTrainerShort: 'Chords',
      quiz: 'Quiz Framework',
      quizShort: 'Quiz',
      brand: 'Guitar Companion',
      mobileNavLabel: 'Mobile navigation',
    },
    footer: {
      tagline: 'Guitar Companion Platform • Real-time interactive tools for guitarists.',
      github: 'GitHub',
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
      chordTrainer: 'Entrenador de Acordes',
      strummingShort: 'Ritmo',
      noteTrainerShort: 'Notas',
      chordTrainerShort: 'Acordes',
      quiz: 'Cuestionarios',
      quizShort: 'Quiz',
      brand: 'Guitar Companion',
      mobileNavLabel: 'Navegación móvil',
    },
    footer: {
      tagline: 'Plataforma Guitar Companion • Herramientas interactivas en tiempo real para guitarristas.',
      github: 'GitHub',
    },
    common: {
      language: 'Idioma',
      english: 'EN',
      spanish: 'ES',
    },
  },
};
