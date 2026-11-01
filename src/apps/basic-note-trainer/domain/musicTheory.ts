/**
 * Pure Music Theory Engine for Basic Note Trainer
 * Canonical mappings between Anglo-Saxon letters (A-G) and European Solfège (Do-Si),
 * 12-pitch chromatic sequence, natural semitones, and accidental rules.
 * @module apps/basic-note-trainer/domain/musicTheory
 */

import {
  NaturalLetter,
  SolfegeNote,
  ChromaticNoteInfo,
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
 * Translates an Anglo-Saxon letter note (A-G) to European Solfège (La-Si-Do-Re-Mi-Fa-Sol).
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
 * Returns chromatic index for a natural letter.
 */
export function getChromaticIndex(letter: NaturalLetter): number {
  return CHROMATIC_NOTE_INFOS[letter].chromaticIndex;
}
