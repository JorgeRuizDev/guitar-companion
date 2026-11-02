import { describe, it, expect, beforeEach } from 'vitest';
import {
  NATURAL_LETTERS,
  SOLFEGE_NOTES,
  letterToSolfege,
  solfegeToLetter,
  hasNaturalSharp,
  hasNaturalFlat,
  isNaturalSemitonePair,
  getNextChromatic,
  getChromaticIndex,
  CHROMATIC_SCALE,
  NATURAL_SEMITONES,
} from '@/apps/basic-note-trainer/domain/musicTheory';
import {
  trainerStorage,
  DEFAULT_STORED_STATS,
} from '@/apps/basic-note-trainer/storage/trainerStorage';

describe('Music Theory Engine', () => {
  describe('Bidirectional Translation', () => {
    it('correctly maps all 7 Anglo-Saxon letters to Solfège', () => {
      expect(letterToSolfege('C')).toBe('Do');
      expect(letterToSolfege('D')).toBe('Re');
      expect(letterToSolfege('E')).toBe('Mi');
      expect(letterToSolfege('F')).toBe('Fa');
      expect(letterToSolfege('G')).toBe('Sol');
      expect(letterToSolfege('A')).toBe('La');
      expect(letterToSolfege('B')).toBe('Si');
    });

    it('correctly maps all 7 Solfège notes to Anglo-Saxon letters', () => {
      expect(solfegeToLetter('Do')).toBe('C');
      expect(solfegeToLetter('Re')).toBe('D');
      expect(solfegeToLetter('Mi')).toBe('E');
      expect(solfegeToLetter('Fa')).toBe('F');
      expect(solfegeToLetter('Sol')).toBe('G');
      expect(solfegeToLetter('La')).toBe('A');
      expect(solfegeToLetter('Si')).toBe('B');
    });

    it('satisfies 100% bijective roundtrip for all natural notes', () => {
      for (const letter of NATURAL_LETTERS) {
        const solfege = letterToSolfege(letter);
        expect(solfegeToLetter(solfege)).toBe(letter);
      }

      for (const solfege of SOLFEGE_NOTES) {
        const letter = solfegeToLetter(solfege);
        expect(letterToSolfege(letter)).toBe(solfege);
      }
    });
  });

  describe('Natural Semitones and Accidentals', () => {
    it('correctly identifies that B and E have NO sharp in the natural diatonic scale', () => {
      expect(hasNaturalSharp('B')).toBe(false);
      expect(hasNaturalSharp('E')).toBe(false);

      expect(hasNaturalSharp('C')).toBe(true);
      expect(hasNaturalSharp('D')).toBe(true);
      expect(hasNaturalSharp('F')).toBe(true);
      expect(hasNaturalSharp('G')).toBe(true);
      expect(hasNaturalSharp('A')).toBe(true);
    });

    it('correctly identifies that C and F have NO flat in the natural diatonic scale', () => {
      expect(hasNaturalFlat('C')).toBe(false);
      expect(hasNaturalFlat('F')).toBe(false);

      expect(hasNaturalFlat('D')).toBe(true);
      expect(hasNaturalFlat('E')).toBe(true);
      expect(hasNaturalFlat('G')).toBe(true);
      expect(hasNaturalFlat('A')).toBe(true);
      expect(hasNaturalFlat('B')).toBe(true);
    });

    it('identifies natural semitone pairs (B-C and E-F)', () => {
      expect(isNaturalSemitonePair('B', 'C')).toBe(true);
      expect(isNaturalSemitonePair('C', 'B')).toBe(true);
      expect(isNaturalSemitonePair('E', 'F')).toBe(true);
      expect(isNaturalSemitonePair('F', 'E')).toBe(true);

      // Whole tones should return false
      expect(isNaturalSemitonePair('C', 'D')).toBe(false);
      expect(isNaturalSemitonePair('D', 'E')).toBe(false);
      expect(isNaturalSemitonePair('F', 'G')).toBe(false);
      expect(isNaturalSemitonePair('G', 'A')).toBe(false);
      expect(isNaturalSemitonePair('A', 'B')).toBe(false);
    });

    it('contains exactly 2 natural semitones', () => {
      expect(NATURAL_SEMITONES).toHaveLength(2);
      expect(NATURAL_SEMITONES).toEqual([['B', 'C'], ['E', 'F']]);
    });
  });

  describe('Chromatic Scale & Indexing', () => {
    it('contains exactly 12 chromatic pitches', () => {
      expect(CHROMATIC_SCALE).toHaveLength(12);
    });

    it('correctly identifies chromatic index of natural notes', () => {
      expect(getChromaticIndex('C')).toBe(0);
      expect(getChromaticIndex('D')).toBe(2);
      expect(getChromaticIndex('E')).toBe(4);
      expect(getChromaticIndex('F')).toBe(5);
      expect(getChromaticIndex('G')).toBe(7);
      expect(getChromaticIndex('A')).toBe(9);
      expect(getChromaticIndex('B')).toBe(11);
    });

    it('computes next chromatic pitch with circular wrapping', () => {
      // E (4) -> F (5) (natural half-step)
      expect(getNextChromatic(4).name).toBe('F');

      // B (11) -> C (0) (circular wrap)
      expect(getNextChromatic(11).name).toBe('C');

      // C (0) -> C# / Db (1)
      expect(getNextChromatic(0).name).toBe('C# / Db');
    });
  });
});

describe('Trainer Storage Adapter', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  });

  it('returns default initial stats when storage is empty', () => {
    const stats = trainerStorage.getStats();
    expect(stats.lifetimeOkeys).toBe(0);
    expect(stats.lifetimeFailures).toBe(0);
    expect(stats.allTimeBestStreak).toBe(0);
    expect(stats.ownerId).toBeNull();
    expect(stats.version).toBe(1);
  });

  it('persists session results and strictly enforces ownerId: null (Zero-Mock UI)', () => {
    trainerStorage.recordSessionResults(5, 2, 4);
    const updated = trainerStorage.getStats();

    expect(updated.lifetimeOkeys).toBe(5);
    expect(updated.lifetimeFailures).toBe(2);
    expect(updated.allTimeBestStreak).toBe(4);
    expect(updated.ownerId).toBeNull();

    // Adding more session results
    trainerStorage.recordSessionResults(3, 1, 6);
    const updated2 = trainerStorage.getStats();
    expect(updated2.lifetimeOkeys).toBe(8);
    expect(updated2.lifetimeFailures).toBe(3);
    expect(updated2.allTimeBestStreak).toBe(6);
  });

  it('resets stats to defaults', () => {
    trainerStorage.recordSessionResults(10, 5, 8);
    trainerStorage.resetStats();

    const resetStats = trainerStorage.getStats();
    expect(resetStats.lifetimeOkeys).toBe(0);
    expect(resetStats.lifetimeFailures).toBe(0);
    expect(resetStats.allTimeBestStreak).toBe(0);
  });
});
