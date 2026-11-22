/**
 * Contract: Musical Intervals Engine & Dual Notation
 */

export type IntervalDirection = 'calculate-note' | 'identify-interval';

export type NotationFormat = 'letters' | 'solfege';

export interface IntervalDefinition {
  id: string;
  semitones: number;
  degree: number;
  shortName: string;
  nameEn: string;
  nameEs: string;
}

export interface IntervalQuestionContract {
  id: string;
  category: 'intervals';
  direction: IntervalDirection;
  notation: NotationFormat;
  prompt: {
    en: string;
    es: string;
  };
  subPrompt?: {
    en: string;
    es: string;
  };
  options: [string, string, string, string];
  correctAnswer: string;
  remediation: {
    explanation: {
      en: string;
      es: string;
    };
    hint?: {
      en: string;
      es: string;
    };
    mnemonic?: {
      en: string;
      es: string;
    };
  };
}
