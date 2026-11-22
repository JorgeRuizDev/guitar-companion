/**
 * Pure Music Theory Engine for Basic Note Trainer
 * Canonical mappings between Anglo-Saxon letters (A-G) and Solfège (Do-Si),
 * 12-pitch chromatic sequence, natural semitones, and accidental rules.
 * @module apps/basic-note-trainer/domain/musicTheory
 */

import {
  NaturalLetter,
  SolfegeNote,
  ChromaticNoteInfo,
  IntervalDefinition,
} from '../types';

export const NATURAL_LETTERS: readonly NaturalLetter[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;

export const NATURAL_LETTERS_ALPHABETICAL: readonly NaturalLetter[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;

export const SOLFEGE_NOTES: readonly SolfegeNote[] = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'] as const;

export const LETTER_TO_SOLFEGE: Readonly<Record<NaturalLetter, SolfegeNote>> = {
  C: 'Do',
  D: 'Re',
  E: 'Mi',
  F: 'Fa',
  G: 'Sol',
  A: 'La',
  B: 'Si',
} as const;

export const SOLFEGE_TO_LETTER: Readonly<Record<SolfegeNote, NaturalLetter>> = {
  Do: 'C',
  Re: 'D',
  Mi: 'E',
  Fa: 'F',
  Sol: 'G',
  La: 'A',
  Si: 'B',
} as const;

export interface ChromaticPitch {
  index: number; // 0 to 11 (C = 0, C# = 1 ... B = 11)
  name: string; // e.g. "C", "C# / Db"
  solfegeName: string; // e.g. "Do", "Do# / Reb"
  isNatural: boolean;
  naturalLetter?: NaturalLetter;
  naturalSolfege?: SolfegeNote;
}

export const CHROMATIC_SCALE: readonly ChromaticPitch[] = [
  { index: 0, name: 'C', solfegeName: 'Do', isNatural: true, naturalLetter: 'C', naturalSolfege: 'Do' },
  { index: 1, name: 'C# / Db', solfegeName: 'Do# / Reb', isNatural: false },
  { index: 2, name: 'D', solfegeName: 'Re', isNatural: true, naturalLetter: 'D', naturalSolfege: 'Re' },
  { index: 3, name: 'D# / Eb', solfegeName: 'Re# / Mib', isNatural: false },
  { index: 4, name: 'E', solfegeName: 'Mi', isNatural: true, naturalLetter: 'E', naturalSolfege: 'Mi' },
  { index: 5, name: 'F', solfegeName: 'Fa', isNatural: true, naturalLetter: 'F', naturalSolfege: 'Fa' },
  { index: 6, name: 'F# / Gb', solfegeName: 'Fa# / Solb', isNatural: false },
  { index: 7, name: 'G', solfegeName: 'Sol', isNatural: true, naturalLetter: 'G', naturalSolfege: 'Sol' },
  { index: 8, name: 'G# / Ab', solfegeName: 'Sol# / Lab', isNatural: false },
  { index: 9, name: 'A', solfegeName: 'La', isNatural: true, naturalLetter: 'A', naturalSolfege: 'La' },
  { index: 10, name: 'A# / Bb', solfegeName: 'La# / Sib', isNatural: false },
  { index: 11, name: 'B', solfegeName: 'Si', isNatural: true, naturalLetter: 'B', naturalSolfege: 'Si' },
] as const;

export const CHROMATIC_NOTE_INFOS: Readonly<Record<NaturalLetter, ChromaticNoteInfo>> = {
  C: { letter: 'C', solfege: 'Do', chromaticIndex: 0, hasNaturalSharp: true, hasNaturalFlat: false },
  D: { letter: 'D', solfege: 'Re', chromaticIndex: 2, hasNaturalSharp: true, hasNaturalFlat: true },
  E: { letter: 'E', solfege: 'Mi', chromaticIndex: 4, hasNaturalSharp: false, hasNaturalFlat: true },
  F: { letter: 'F', solfege: 'Fa', chromaticIndex: 5, hasNaturalSharp: true, hasNaturalFlat: false },
  G: { letter: 'G', solfege: 'Sol', chromaticIndex: 7, hasNaturalSharp: true, hasNaturalFlat: true },
  A: { letter: 'A', solfege: 'La', chromaticIndex: 9, hasNaturalSharp: true, hasNaturalFlat: true },
  B: { letter: 'B', solfege: 'Si', chromaticIndex: 11, hasNaturalSharp: false, hasNaturalFlat: true },
} as const;

/**
 * Natural semitone pairs with NO intermediate accidental (half-step distance between them).
 */
export const NATURAL_SEMITONES: readonly [NaturalLetter, NaturalLetter][] = [
  ['B', 'C'],
  ['E', 'F'],
] as const;

/**
 * Natural whole tone pairs (whole step distance with an intermediate accidental).
 */
export const NATURAL_WHOLE_TONES: readonly [NaturalLetter, NaturalLetter][] = [
  ['C', 'D'],
  ['D', 'E'],
  ['F', 'G'],
  ['G', 'A'],
  ['A', 'B'],
] as const;

/**
 * Enharmonic equivalence pairs for chromatic accidentals.
 */
export interface EnharmonicPair {
  sharp: string;
  flat: string;
  solfegeSharp: string;
  solfegeFlat: string;
}

export const ENHARMONIC_PAIRS: readonly EnharmonicPair[] = [
  { sharp: 'C#', flat: 'Db', solfegeSharp: 'Do#', solfegeFlat: 'Reb' },
  { sharp: 'D#', flat: 'Eb', solfegeSharp: 'Re#', solfegeFlat: 'Mib' },
  { sharp: 'F#', flat: 'Gb', solfegeSharp: 'Fa#', solfegeFlat: 'Solb' },
  { sharp: 'G#', flat: 'Ab', solfegeSharp: 'Sol#', solfegeFlat: 'Lab' },
  { sharp: 'A#', flat: 'Bb', solfegeSharp: 'La#', solfegeFlat: 'Sib' },
] as const;

/**
 * Translates an Anglo-Saxon letter note (A-G) to Solfège (La-Si-Do-Re-Mi-Fa-Sol).
 */
export function letterToSolfege(letter: NaturalLetter): SolfegeNote {
  return LETTER_TO_SOLFEGE[letter];
}

/**
 * Translates a Solfège note (Do-Si) to Anglo-Saxon letter (C-B).
 */
export function solfegeToLetter(solfege: SolfegeNote): NaturalLetter {
  return SOLFEGE_TO_LETTER[solfege];
}

/**
 * Checks whether a natural note has a sharp (#) in standard chromatic division.
 * In the natural diatonic scale, B and E do NOT have a natural sharp because
 * B -> C and E -> F are natural half-steps (semitones).
 */
export function hasNaturalSharp(note: NaturalLetter): boolean {
  return note !== 'B' && note !== 'E';
}

/**
 * Checks whether a natural note has a flat (b) in standard chromatic division.
 * In the natural diatonic scale, C and F do NOT have a natural flat because
 * C -> B and F -> E are natural half-steps.
 */
export function hasNaturalFlat(note: NaturalLetter): boolean {
  return note !== 'C' && note !== 'F';
}

/**
 * Checks if two consecutive natural letters form a natural semitone (no intermediate accidental).
 */
export function isNaturalSemitonePair(n1: NaturalLetter, n2: NaturalLetter): boolean {
  return (
    (n1 === 'B' && n2 === 'C') ||
    (n1 === 'C' && n2 === 'B') ||
    (n1 === 'E' && n2 === 'F') ||
    (n1 === 'F' && n2 === 'E')
  );
}

/**
 * Gets the next chromatic pitch (one half-step above) given a chromatic index (0-11).
 */
export function getNextChromatic(index: number): ChromaticPitch {
  const nextIndex = (index + 1) % 12;
  return CHROMATIC_SCALE[nextIndex];
}

/**
 * Gets the previous chromatic pitch (one half-step below) given a chromatic index (0-11).
 */
export function getPreviousChromatic(index: number): ChromaticPitch {
  const prevIndex = (index - 1 + 12) % 12;
  return CHROMATIC_SCALE[prevIndex];
}

/**
 * Returns chromatic index for a natural letter.
 */
export function getChromaticIndex(letter: NaturalLetter): number {
  return CHROMATIC_NOTE_INFOS[letter].chromaticIndex;
}

// --- Musical Intervals Engine & Diatonic Transposition ---

export const INTERVAL_DEFINITIONS: readonly IntervalDefinition[] = [
  { id: 'unison', semitones: 0, degree: 1, shortName: 'P1', nameEn: 'Perfect Unison', nameEs: 'Unísono' },
  { id: 'minor-2nd', semitones: 1, degree: 2, shortName: 'm2', nameEn: 'Minor 2nd', nameEs: '2ª menor' },
  { id: 'major-2nd', semitones: 2, degree: 2, shortName: 'M2', nameEn: 'Major 2nd', nameEs: '2ª Mayor' },
  { id: 'minor-3rd', semitones: 3, degree: 3, shortName: 'm3', nameEn: 'Minor 3rd', nameEs: '3ª menor' },
  { id: 'major-3rd', semitones: 4, degree: 3, shortName: 'M3', nameEn: 'Major 3rd', nameEs: '3ª Mayor' },
  { id: 'perfect-4th', semitones: 5, degree: 4, shortName: 'P4', nameEn: 'Perfect 4th', nameEs: '4ª Justa' },
  { id: 'tritone', semitones: 6, degree: 4, shortName: 'TT', nameEn: 'Tritone', nameEs: 'Tritono' },
  { id: 'perfect-5th', semitones: 7, degree: 5, shortName: 'P5', nameEn: 'Perfect 5th', nameEs: '5ª Justa' },
  { id: 'minor-6th', semitones: 8, degree: 6, shortName: 'm6', nameEn: 'Minor 6th', nameEs: '6ª menor' },
  { id: 'major-6th', semitones: 9, degree: 6, shortName: 'M6', nameEn: 'Major 6th', nameEs: '6ª Mayor' },
  { id: 'minor-7th', semitones: 10, degree: 7, shortName: 'm7', nameEn: 'Minor 7th', nameEs: '7ª menor' },
  { id: 'major-7th', semitones: 11, degree: 7, shortName: 'M7', nameEn: 'Major 7th', nameEs: '7ª Mayor' },
  { id: 'perfect-octave', semitones: 12, degree: 8, shortName: 'P8', nameEn: 'Perfect Octave', nameEs: 'Octava' },
] as const;

/**
 * Parses a note string in either Anglo-Saxon or Solfège format.
 * Examples: 'C', 'F#', 'Eb', 'Do', 'Fa#', 'Mib', 'Sol'.
 */
export function parseNote(noteStr: string): {
  baseLetter: NaturalLetter;
  accidental: string;
  pitchIndex: number;
} {
  const trimmed = noteStr.trim();
  let baseLetter: NaturalLetter;
  let accidental = '';

  if (trimmed.startsWith('Sol')) {
    baseLetter = 'G';
    accidental = trimmed.slice(3);
  } else if (/^(Do|Re|Mi|Fa|La|Si)/.test(trimmed)) {
    const solfegePrefix = trimmed.slice(0, 2) as SolfegeNote;
    baseLetter = SOLFEGE_TO_LETTER[solfegePrefix] ?? 'C';
    accidental = trimmed.slice(2);
  } else {
    baseLetter = (trimmed[0].toUpperCase() as NaturalLetter) ?? 'C';
    accidental = trimmed.slice(1);
  }

  let pitch = CHROMATIC_NOTE_INFOS[baseLetter]?.chromaticIndex ?? 0;
  if (accidental === '#') pitch = (pitch + 1) % 12;
  else if (accidental === '##') pitch = (pitch + 2) % 12;
  else if (accidental === 'b') pitch = (pitch - 1 + 12) % 12;
  else if (accidental === 'bb') pitch = (pitch - 2 + 12) % 12;

  return {
    baseLetter,
    accidental,
    pitchIndex: pitch,
  };
}

/**
 * Formats semitone distances with step and tone explanations.
 */
export function formatSemitonesText(semitones: number, lang: 'en' | 'es' = 'en'): string {
  if (lang === 'es') {
    if (semitones === 1) return '1 semitono (medio tono)';
    if (semitones === 2) return '2 semitonos (1 tono)';
    if (semitones % 2 === 0) return `${semitones} semitonos (${semitones / 2} tonos)`;
    return `${semitones} semitonos (${(semitones - 1) / 2} tonos y medio)`;
  }
  if (semitones === 1) return '1 semitone (half step)';
  if (semitones === 2) return '2 semitones (1 whole step)';
  if (semitones % 2 === 0) return `${semitones} semitones (${semitones / 2} whole steps)`;
  return `${semitones} semitones (${(semitones - 1) / 2} and a half steps)`;
}

/**
 * Calculates the exact diatonic target note for a given root and interval.
 * Strictly respects letter notation or solfege notation according to requested format.
 */
export function calculateIntervalTargetNote(
  rootNote: string,
  interval: IntervalDefinition,
  notation: 'letters' | 'solfege'
): string {
  const { baseLetter, pitchIndex: rootPitch } = parseNote(rootNote);
  const naturalLetters: readonly NaturalLetter[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  const baseLetterIndex = naturalLetters.indexOf(baseLetter);
  const targetDegree = interval.degree;
  const targetLetterIndex = (baseLetterIndex + (targetDegree - 1)) % 7;
  const targetNaturalLetter = naturalLetters[targetLetterIndex];

  const targetNaturalPitch = CHROMATIC_NOTE_INFOS[targetNaturalLetter].chromaticIndex;
  const targetPitchNeeded = (rootPitch + interval.semitones) % 12;
  const diff = ((targetPitchNeeded - targetNaturalPitch) % 12 + 12) % 12;

  let accidental = '';
  if (diff === 0) accidental = '';
  else if (diff === 1) accidental = '#';
  else if (diff === 2) accidental = '##';
  else if (diff === 11) accidental = 'b';
  else if (diff === 10) accidental = 'bb';

  if (notation === 'solfege') {
    const solfegeBase = LETTER_TO_SOLFEGE[targetNaturalLetter];
    return `${solfegeBase}${accidental}`;
  }

  return `${targetNaturalLetter}${accidental}`;
}

/**
 * Identifies the interval relationship between a root note and a target note.
 */
export function identifyInterval(
  rootNote: string,
  targetNote: string
): IntervalDefinition | null {
  const root = parseNote(rootNote);
  const target = parseNote(targetNote);
  const naturalLetters: readonly NaturalLetter[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  const rIdx = naturalLetters.indexOf(root.baseLetter);
  const tIdx = naturalLetters.indexOf(target.baseLetter);
  let degree = ((tIdx - rIdx + 7) % 7) + 1;
  const semitones = ((target.pitchIndex - root.pitchIndex + 12) % 12);

  // Distinguish unison vs octave if degree is 1
  if (degree === 1 && semitones === 0) {
    // Return unison as default for same pitch class and degree 1
    return INTERVAL_DEFINITIONS.find((i) => i.id === 'unison') ?? null;
  }

  // Handle tritone (degree 4 Augmented 4th vs degree 5 Diminished 5th)
  if (semitones === 6) {
    return INTERVAL_DEFINITIONS.find((i) => i.id === 'tritone') ?? null;
  }

  return (
    INTERVAL_DEFINITIONS.find(
      (i) => i.degree === degree && i.semitones === semitones
    ) ??
    INTERVAL_DEFINITIONS.find((i) => i.semitones === semitones) ??
    null
  );
}
