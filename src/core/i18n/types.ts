/**
 * Core i18n Types
 * @module core/i18n/types
 */

export type Language = 'en' | 'es';

export interface TranslationDictionary {
  nav: {
    home: string;
    strumming: string;
    noteTrainer: string;
    strummingShort: string;
    noteTrainerShort: string;
    brand: string;
    mobileNavLabel: string;
  };
  footer: {
    tagline: string;
  };
  common: {
    language: string;
    english: string;
    spanish: string;
  };
}
