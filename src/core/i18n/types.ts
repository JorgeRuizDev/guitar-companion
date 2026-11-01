/**
 * Core i18n Types
 * @module core/i18n/types
 */

export type Language = 'en' | 'es';

export interface TranslationDictionary {
  nav: {
    strumming: string;
    noteTrainer: string;
    brand: string;
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
