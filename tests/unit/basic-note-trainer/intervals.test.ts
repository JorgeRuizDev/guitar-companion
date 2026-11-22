import { describe, it, expect } from 'vitest';
import {
  INTERVAL_DEFINITIONS,
  calculateIntervalTargetNote,
  identifyInterval,
  formatSemitonesText,
  parseNote,
} from '@/apps/basic-note-trainer/domain/musicTheory';

describe('Musical Intervals Engine (basic-note-trainer)', () => {
  const getInterval = (id: string) => {
    const interval = INTERVAL_DEFINITIONS.find((i) => i.id === id);
    if (!interval) throw new Error(`Interval ${id} not found`);
    return interval;
  };

  describe('Interval Taxonomy & Definitions', () => {
    it('contains all 13 canonical intervals from Unison to Octave', () => {
      expect(INTERVAL_DEFINITIONS).toHaveLength(13);
      const semitones = INTERVAL_DEFINITIONS.map((i) => i.semitones);
      expect(semitones).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });

    it('has valid English and Spanish names for all intervals', () => {
      for (const interval of INTERVAL_DEFINITIONS) {
        expect(interval.nameEn).toBeTruthy();
        expect(interval.nameEs).toBeTruthy();
        expect(interval.shortName).toBeTruthy();
        expect(interval.degree).toBeGreaterThanOrEqual(1);
        expect(interval.degree).toBeLessThanOrEqual(8);
      }
    });
  });

  describe('Note Parsing (Dual Notation)', () => {
    it('parses Anglo-Saxon natural and accidental notes', () => {
      expect(parseNote('C')).toMatchObject({ baseLetter: 'C', accidental: '', pitchIndex: 0 });
      expect(parseNote('F#')).toMatchObject({ baseLetter: 'F', accidental: '#', pitchIndex: 6 });
      expect(parseNote('Eb')).toMatchObject({ baseLetter: 'E', accidental: 'b', pitchIndex: 3 });
      expect(parseNote('Bb')).toMatchObject({ baseLetter: 'B', accidental: 'b', pitchIndex: 10 });
    });

    it('parses Solfège natural and accidental notes', () => {
      expect(parseNote('Do')).toMatchObject({ baseLetter: 'C', accidental: '', pitchIndex: 0 });
      expect(parseNote('Fa#')).toMatchObject({ baseLetter: 'F', accidental: '#', pitchIndex: 6 });
      expect(parseNote('Mib')).toMatchObject({ baseLetter: 'E', accidental: 'b', pitchIndex: 3 });
      expect(parseNote('Sol')).toMatchObject({ baseLetter: 'G', accidental: '', pitchIndex: 7 });
      expect(parseNote('Sib')).toMatchObject({ baseLetter: 'B', accidental: 'b', pitchIndex: 10 });
    });
  });

  describe('Diatonic Transposition & Interval Calculation', () => {
    it('calculates major and minor 3rds with strict diatonic spelling in letters', () => {
      const major3rd = getInterval('major-3rd');
      const minor3rd = getInterval('minor-3rd');

      // C -> E (Major 3rd), C -> Eb (Minor 3rd, NEVER D#)
      expect(calculateIntervalTargetNote('C', major3rd, 'letters')).toBe('E');
      expect(calculateIntervalTargetNote('C', minor3rd, 'letters')).toBe('Eb');

      // D -> F# (Major 3rd), D -> F (Minor 3rd)
      expect(calculateIntervalTargetNote('D', major3rd, 'letters')).toBe('F#');
      expect(calculateIntervalTargetNote('D', minor3rd, 'letters')).toBe('F');

      // A -> C# (Major 3rd), A -> C (Minor 3rd)
      expect(calculateIntervalTargetNote('A', major3rd, 'letters')).toBe('C#');
      expect(calculateIntervalTargetNote('A', minor3rd, 'letters')).toBe('C');
    });

    it('calculates perfect 5ths correctly', () => {
      const p5 = getInterval('perfect-5th');
      expect(calculateIntervalTargetNote('C', p5, 'letters')).toBe('G');
      expect(calculateIntervalTargetNote('D', p5, 'letters')).toBe('A');
      expect(calculateIntervalTargetNote('E', p5, 'letters')).toBe('B');
      expect(calculateIntervalTargetNote('F', p5, 'letters')).toBe('C');
      expect(calculateIntervalTargetNote('G', p5, 'letters')).toBe('D');
      expect(calculateIntervalTargetNote('A', p5, 'letters')).toBe('E');
      expect(calculateIntervalTargetNote('B', p5, 'letters')).toBe('F#');
    });

    it('calculates intervals in Solfège with strict Solfège output', () => {
      const major3rd = getInterval('major-3rd');
      const minor3rd = getInterval('minor-3rd');
      const p5 = getInterval('perfect-5th');

      expect(calculateIntervalTargetNote('Do', major3rd, 'solfege')).toBe('Mi');
      expect(calculateIntervalTargetNote('Do', minor3rd, 'solfege')).toBe('Mib');
      expect(calculateIntervalTargetNote('Re', major3rd, 'solfege')).toBe('Fa#');
      expect(calculateIntervalTargetNote('Do', p5, 'solfege')).toBe('Sol');
      expect(calculateIntervalTargetNote('Re', p5, 'solfege')).toBe('La');
    });
  });

  describe('Interval Identification', () => {
    it('identifies interval between two notes accurately', () => {
      expect(identifyInterval('C', 'E')?.id).toBe('major-3rd');
      expect(identifyInterval('C', 'Eb')?.id).toBe('minor-3rd');
      expect(identifyInterval('C', 'G')?.id).toBe('perfect-5th');
      expect(identifyInterval('D', 'F#')?.id).toBe('major-3rd');
      expect(identifyInterval('A', 'E')?.id).toBe('perfect-5th');
      expect(identifyInterval('C', 'F')?.id).toBe('perfect-4th');
      expect(identifyInterval('C', 'B')?.id).toBe('major-7th');
      expect(identifyInterval('C', 'Bb')?.id).toBe('minor-7th');
    });

    it('identifies intervals given Solfège note names', () => {
      expect(identifyInterval('Do', 'Mi')?.id).toBe('major-3rd');
      expect(identifyInterval('Do', 'Sol')?.id).toBe('perfect-5th');
      expect(identifyInterval('Re', 'Fa#')?.id).toBe('major-3rd');
    });
  });

  describe('Semitone Formatting & Remediation', () => {
    it('formats semitones in Spanish and English with tone breakdown', () => {
      expect(formatSemitonesText(1, 'en')).toBe('1 semitone (half step)');
      expect(formatSemitonesText(1, 'es')).toBe('1 semitono (medio tono)');

      expect(formatSemitonesText(4, 'en')).toBe('4 semitones (2 whole steps)');
      expect(formatSemitonesText(4, 'es')).toBe('4 semitonos (2 tonos)');

      expect(formatSemitonesText(7, 'en')).toBe('7 semitones (3 and a half steps)');
      expect(formatSemitonesText(7, 'es')).toBe('7 semitonos (3 tonos y medio)');
    });
  });
});
