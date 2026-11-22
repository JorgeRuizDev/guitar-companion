/**
 * Contract: Chord Notes Drag-and-Drop & Harmonic Analysis
 */

export type StringNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type HarmonicIntervalAbbr = 'R' | 'm3' | '3M' | 'P4' | 'TT' | '5J' | 'm7' | '7M' | '9' | 'octave';

export interface StringHarmonicInfo {
  stringNumber: StringNumber;
  state: 'open' | 'fretted' | 'muted';
  fret: number | null;
  finger: number | null;
  pitchClass: number; // 0 to 11
  noteLetter: string; // e.g. "C"
  solfegeName: string; // e.g. "Do"
  semitonesFromRoot: number;
  intervalRole: string; // "Root", "Major 3rd", "Perfect 5th"
  intervalRoleEs: string; // "Tónica", "3ª Mayor", "5ª Justa"
  intervalAbbr: HarmonicIntervalAbbr;
}

export interface ChordHarmonicAnalysis {
  chordId: string;
  symbol: string;
  solfegeName: string;
  rootString: StringNumber;
  strings: StringHarmonicInfo[];
  uniqueNotes: string[];
  uniqueSolfege: string[];
  distractors: [string, string];
  distractorsSolfege: [string, string];
}

export interface ChordNotesUserState {
  assignments: Record<StringNumber, string | null>;
  isSubmitted: boolean;
  isComplete: boolean;
  isCorrect: boolean;
  revealedHarmonics: boolean;
  errorStrings: StringNumber[];
}
