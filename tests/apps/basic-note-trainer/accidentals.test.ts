import { describe, it, expect } from 'vitest';
import {
  generateAccidentalQuestion,
  generateNaturalSemitoneQuestion,
  generateNextChromaticQuestion,
  generatePreviousChromaticQuestion,
  generateEnharmonicQuestion,
  generateTranslationCard,
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

      // Explanation must contain visual chromatic scale
      expect(card.explanation).toContain('C ➔ C#');
      expect(card.explanation).toContain('Do ➔ Do#');
    });
  });

  describe('Has Accidental Questions (Sharps and Flats)', () => {
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

      // Explanation must include the visual list of all notes
      expect(cardC.explanation).toContain('C ➔ C# ➔ D');
      expect(cardC.explanation).toContain('Do ➔ Do#');
    });

    it('generates a question testing whether a note has a natural flat', () => {
      const cardC = generateAccidentalQuestion('C', 'es', 'flat');
      expect(cardC.category).toBe('accidentals');
      expect(cardC.noteReference).toBe('C');
      expect(cardC.correctAnswer).toBe('No');
      expect(cardC.prompt).toContain('bemol (b)');

      const cardF = generateAccidentalQuestion('F', 'es', 'flat');
      expect(cardF.correctAnswer).toBe('No');

      const cardD = generateAccidentalQuestion('D', 'es', 'flat');
      expect(cardD.correctAnswer).toBe('Sí');

      // Explanation must include the visual list of all notes
      expect(cardD.explanation).toContain('C ➔ Db ➔ D');
      expect(cardD.explanation).toContain('Do ➔ Do#/Reb');
    });

    it('generates enharmonic questions linking sharps (#) and flats (b)', () => {
      const card = generateEnharmonicQuestion('es');
      expect(card.category).toBe('accidentals');
      expect(card.options).toHaveLength(4);
      expect(new Set(card.options).size).toBe(4);
      expect(card.options).toContain(card.correctAnswer);
      expect(card.explanation).toContain('enarmónica');
      // Visual scale check
      expect(card.explanation).toContain('C ➔ C#');
      expect(card.explanation).toContain('C ➔ Db');
    });
  });

  describe('Chromatic Sequence Questions (Next and Previous)', () => {
    it('correctly resolves half-step from E to F as a natural semitone', () => {
      const card = generateNextChromaticQuestion('E');
      expect(card.category).toBe('sequence');
      expect(card.correctAnswer).toBe('F');
      expect(card.options).toContain('F');
      expect(card.options).toHaveLength(4);
      expect(card.explanation).toContain('C ➔ C#');
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

    it('correctly resolves half-step down with previous chromatic question', () => {
      const cardC = generatePreviousChromaticQuestion('C', 'es');
      expect(cardC.category).toBe('sequence');
      expect(cardC.correctAnswer).toBe('B');
      expect(cardC.prompt).toContain('por debajo');

      const cardF = generatePreviousChromaticQuestion('F', 'es');
      expect(cardF.correctAnswer).toBe('E');

      const cardG = generatePreviousChromaticQuestion('G', 'es');
      expect(cardG.correctAnswer).toBe('F# / Gb');
    });
  });

  describe('Pedagogical Clarity & Prohibition of "Europeas"', () => {
    it('guarantees that no generated question mentions "europea" or "europeas"', () => {
      // Test 50 randomly generated cards in both languages
      for (const lang of ['es', 'en'] as const) {
        for (let i = 0; i < 30; i++) {
          const transCard = generateTranslationCard({ lang });
          expect(transCard.prompt.toLowerCase()).not.toContain('europea');
          expect(transCard.prompt.toLowerCase()).not.toContain('european');
          expect(transCard.subPrompt?.toLowerCase()).not.toContain('europea');
          expect(transCard.subPrompt?.toLowerCase()).not.toContain('european');

          const card = generateCard({ mode: 'mixed', direction: 'both', difficulty: 'intermediate', embed: false, lang });
          expect(card.prompt.toLowerCase()).not.toContain('europea');
          expect(card.prompt.toLowerCase()).not.toContain('european');
          if (card.subPrompt) {
            expect(card.subPrompt.toLowerCase()).not.toContain('europea');
            expect(card.subPrompt.toLowerCase()).not.toContain('european');
          }
        }
      }
    });

    it('guarantees that accidental and sequence questions include the complete visual note scale', () => {
      const sharpCard = generateAccidentalQuestion('G', 'es');
      expect(sharpCard.explanation).toContain('🎼 Escala cromática completa');
      expect(sharpCard.explanation).toContain('• Con sostenidos (#):');
      expect(sharpCard.explanation).toContain('• Con bemoles (b):');
      expect(sharpCard.explanation).toContain('• En solfeo:');

      const flatCard = generateAccidentalQuestion('D', 'es', 'flat');
      expect(flatCard.explanation).toContain('🎼 Escala cromática completa');

      const semitoneCard = generateNaturalSemitoneQuestion('es');
      expect(semitoneCard.explanation).toContain('🎼 Escala cromática completa');

      const nextCard = generateNextChromaticQuestion('A', 'es');
      expect(nextCard.explanation).toContain('🎼 Escala cromática completa');
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
