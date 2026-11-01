import { describe, it, expect } from 'vitest';
import {
  generateAccidentalQuestion,
  generateNaturalSemitoneQuestion,
  generateNextChromaticQuestion,
  generateCard,
} from '@/apps/basic-note-trainer/domain/cardGenerator';

describe('Accidentals and Chromatic Sequence Questions (User Story 2)', () => {
  describe('Natural Semitone Questions', () => {
    it('generates a question identifying a natural semitone pair with exactly 4 unique choices', () => {
      const card = generateNaturalSemitoneQuestion();

      expect(card.category).toBe('accidentals');
      expect(card.options).toHaveLength(4);
      expect(new Set(card.options).size).toBe(4);
      expect(card.options).toContain(card.correctAnswer);

      // Correct answer must be either B - C or E - F
      expect(['B - C', 'E - F']).toContain(card.correctAnswer);

      // Explanation should mention natural semitones
      expect(card.explanation).toContain('semitone');
      expect(card.mnemonic).toContain('Big Cats Eat Fish');
    });
  });

  describe('Has Accidental Questions', () => {
    it('generates a question testing whether a note has a natural sharp', () => {
      const cardB = generateAccidentalQuestion('B');
      expect(cardB.category).toBe('accidentals');
      expect(cardB.noteReference).toBe('B');
      expect(cardB.correctAnswer).toBe('No');
      expect(cardB.options).toContain('No');
      expect(cardB.options).toContain('Yes');

      const cardE = generateAccidentalQuestion('E');
      expect(cardE.correctAnswer).toBe('No');

      const cardC = generateAccidentalQuestion('C');
      expect(cardC.correctAnswer).toBe('Yes');
    });
  });

  describe('Next Chromatic Questions', () => {
    it('correctly resolves half-step from E to F as a natural semitone', () => {
      const card = generateNextChromaticQuestion('E');
      expect(card.category).toBe('sequence');
      expect(card.correctAnswer).toBe('F');
      expect(card.options).toContain('F');
      expect(card.options).toHaveLength(4);
    });

    it('correctly resolves half-step from B to C as a natural semitone with wrap', () => {
      const card = generateNextChromaticQuestion('B');
      expect(card.category).toBe('sequence');
      expect(card.correctAnswer).toBe('C');
      expect(card.options).toContain('C');
    });

    it('correctly resolves whole-tone stepping notes with enharmonic sharps/flats', () => {
      const card = generateNextChromaticQuestion('C');
      expect(card.correctAnswer).toBe('C# / Db');
      expect(card.options).toContain('C# / Db');
    });
  });

  describe('Card Generator in "accidentals" and "mixed" modes', () => {
    it('generates accidentals and sequence cards when mode is "accidentals"', () => {
      for (let i = 0; i < 20; i++) {
        const card = generateCard({
          mode: 'accidentals',
          direction: 'both',
          difficulty: 'intermediate',
          embed: false,
        });

        expect(['accidentals', 'sequence']).toContain(card.category);
        expect(card.options).toHaveLength(4);
        expect(new Set(card.options).size).toBe(4);
        expect(card.options).toContain(card.correctAnswer);
      }
    });

    it('generates both translation and accidentals cards when mode is "mixed"', () => {
      const categoriesSeen = new Set<string>();

      for (let i = 0; i < 40; i++) {
        const card = generateCard({
          mode: 'mixed',
          direction: 'both',
          difficulty: 'intermediate',
          embed: false,
        });

        categoriesSeen.add(card.category);
      }

      expect(categoriesSeen.has('translation')).toBe(true);
      expect(categoriesSeen.has('accidentals') || categoriesSeen.has('sequence')).toBe(true);
    });
  });
});
