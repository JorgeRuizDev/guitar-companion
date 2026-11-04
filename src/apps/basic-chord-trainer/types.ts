/**
 * Domain types and entity definitions for the Basic Chord Trainer
 * @module apps/basic-chord-trainer/types
 */

export type StringNumber = 1 | 2 | 3 | 4 | 5 | 6; // 6 = Low E, 1 = High E

export type StringState = 'open' | 'muted' | 'fretted';

export type FingerNumber = 1 | 2 | 3 | 4; // 1=Index, 2=Middle, 3=Ring, 4=Pinky

export interface ChordStringDefinition {
  stringNumber: StringNumber;
  state: StringState;
  fret: number | null; // 0 for open, 1-4 for fretted, null for muted
  finger?: FingerNumber | null;
}

export type ChordCategory =
  | 'open-major'
  | 'open-minor'
  | 'open-7th'
  | 'open-variation';

export interface ChordDefinition {
  id: string; // e.g. "c-major", "a-minor", "f-beginner", "cadd9"
  symbol: string; // Anglo-Saxon notation: e.g. "C", "Am", "G7", "Fmaj7"
  solfegeName: string; // Solfège: e.g. "Do Mayor", "La menor", "Sol 7ª"
  category: ChordCategory;
  // Strings ordered from 6 (Low E) down to 1 (High E)
  strings: [
    ChordStringDefinition,
    ChordStringDefinition,
    ChordStringDefinition,
    ChordStringDefinition,
    ChordStringDefinition,
    ChordStringDefinition
  ];
  rootString: StringNumber; // 6, 5, or 4
  barre?: {
    fret: number;
    fromString: StringNumber;
    toString: StringNumber;
  } | null;
  description?: {
    en: string;
    es: string;
  };
}

export type PracticeMode = 'alternate' | 'draw' | 'identify';

export type ChallengeType = 'draw' | 'identify';

export type ChallengeNotation = 'letters' | 'solfege';

export interface PracticeChallenge {
  id: string;
  targetChord: ChordDefinition;
  type: ChallengeType;
  notation?: ChallengeNotation;
  familyId?: string;
  // Multiple-choice options for 'identify' mode (exactly 4 unique chords)
  options?: [ChordDefinition, ChordDefinition, ChordDefinition, ChordDefinition];
}

export interface UserStringFretting {
  stringNumber: StringNumber;
  state: StringState;
  fret: number | null; // null if muted, 0 if open, 1-4 if fretted
}

export type UserFretboardState = [
  UserStringFretting, // String 6 (Low E)
  UserStringFretting, // String 5 (A)
  UserStringFretting, // String 4 (D)
  UserStringFretting, // String 3 (G)
  UserStringFretting, // String 2 (B)
  UserStringFretting // String 1 (High E)
];

export type ChallengeStatus =
  | 'PENDING'
  | 'EVALUATED_CORRECT'
  | 'EVALUATED_INCORRECT'
  | 'SKIPPED';

export interface StringVerificationResult {
  stringNumber: StringNumber;
  isCorrect: boolean;
  expectedState: StringState;
  expectedFret: number | null;
  actualState: StringState;
  actualFret: number | null;
}

export interface ChallengeEvaluation {
  isCorrect: boolean;
  stringResults?: StringVerificationResult[];
  explanation: {
    en: string;
    es: string;
  };
}

export interface SessionMetrics {
  hits: number;
  misses: number;
  skipped: number;
  currentStreak: number;
  bestStreak: number;
  accuracy: number;
  totalCompleted: number;
}

export interface StoredChordTrainerPreferences {
  version: 1;
  ownerId: null; // Zero-Mock UI guest mode
  selectedChordIds: string[];
  selectedMode: PracticeMode;
  lifetimeHits: number;
  lifetimeMisses: number;
  allTimeBestStreak: number;
  lastPlayedAt: string; // ISO 8601 timestamp
}

export interface TrainerConfig {
  chords?: string[];
  mode: PracticeMode;
  embed: boolean;
  compact?: boolean;
  lang?: 'en' | 'es';
}
