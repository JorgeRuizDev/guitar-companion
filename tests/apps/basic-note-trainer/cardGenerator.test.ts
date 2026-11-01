import { describe, it, expect } from 'vitest';
import {
  generateTranslationCard,
  generateNaturalSemitoneQuestion,
  generateAccidentalQuestion,
  generateNextChromaticQuestion,
  generateCard,
  retranslateCard,
} from '@/apps/basic-note-trainer/domain/cardGenerator';
import { NATURAL_LETTERS, SOLFEGE_NOTES } from '@/apps/basic-note-trainer/domain/musicTheory';

describe('Card Generator - User Story 1 (Translation Cards)', () => {
  it('generates a letter-to-solfege question with exactly 4 unique solfege options', () => {
    const card = generateTranslationCard({
      direction: 'letters-to-solfege',
      letter: 'A',
    });

    expect(card.category).toBe('translation');
    expect(card.correctAnswer).toBe('La');
    expect(card.noteReference).toBe('A');
    expect(card.prompt).toContain('A');
    expect(card.options).toHaveLength(4);

    // Verify uniqueness
    const uniqueOptions = new Set(card.options);
    expect(uniqueOptions.size).toBe(4);

    // Correct answer is present in options
    expect(card.options).toContain('La');

    // All options are valid Solfège notes
    for (const opt of card.options) {
      expect(SOLFEGE_NOTES).toContain(opt);
    }

    // Explanation and mnemonic are populated
    expect(card.explanation).toBeTruthy();
    expect(card.mnemonic).toBeTruthy();
  });

  it('generates a solfege-to-letter question with exactly 4 unique letter options', () => {
    const card = generateTranslationCard({
      direction: 'solfege-to-letters',
      solfege: 'Do',
    });

    expect(card.category).toBe('translation');
    expect(card.correctAnswer).toBe('C');
    expect(card.noteReference).toBe('C');
    expect(card.prompt).toContain('Do');
    expect(card.options).toHaveLength(4);

    // Verify uniqueness
    const uniqueOptions = new Set(card.options);
    expect(uniqueOptions.size).toBe(4);

    // Correct answer is present
    expect(card.options).toContain('C');

    // All options are valid natural letters
    for (const opt of card.options) {
      expect(NATURAL_LETTERS).toContain(opt);
    }

    expect(card.explanation).toBeTruthy();
    expect(card.mnemonic).toBeTruthy();
  });

  it('handles random generation with direction "both" producing valid cards', () => {
    for (let i = 0; i < 20; i++) {
      const card = generateCard({
        mode: 'translation',
        direction: 'both',
        difficulty: 'beginner',
        embed: false,
        lang: 'en',
      });

      expect(card.options).toHaveLength(4);
      expect(new Set(card.options).size).toBe(4);
      expect(card.options).toContain(card.correctAnswer);
      expect(card.id).toBeTruthy();
      expect(card.explanation.length).toBeGreaterThan(10);
      expect(card.mnemonic.length).toBeGreaterThan(5);
    }
  });

  it('distributes correct answer across various option positions (shuffled)', () => {
    const positions = new Set<number>();
    for (let i = 0; i < 30; i++) {
      const card = generateTranslationCard({ direction: 'letters-to-solfege' });
      const index = card.options.indexOf(card.correctAnswer);
      positions.add(index);
    }

    // Over 30 trials, correct answer should appear in at least 3 distinct slots
    expect(positions.size).toBeGreaterThanOrEqual(3);
  });

  describe('Spanish Localization (User Story 5)', () => {
    it('generates Spanish translation cards with localized prompt, subprompt, and explanation', () => {
      const card = generateTranslationCard({
        direction: 'letters-to-solfege',
        letter: 'B',
        lang: 'es',
      });

      expect(card.prompt).toBe("¿Qué nota europea (solfeo) corresponde a 'B'?");
      expect(card.subPrompt).toContain('anglosajona');
      expect(card.correctAnswer).toBe('Si');
      expect(card.explanation).toContain('equivale a Si');
      expect(card.mnemonic).toContain('Si-Do');
    });

    it('generates Spanish natural semitone questions with localized prompt and mnemonic', () => {
      const card = generateNaturalSemitoneQuestion('es');
      expect(card.prompt).toContain('semitono natural');
      expect(card.mnemonic).toContain('Si-Do y Mi-Fa');
    });

    it('generates Spanish accidental questions with "Sí" / "No" options', () => {
      const card = generateAccidentalQuestion('C', 'es');
      expect(card.prompt).toContain('¿Tiene la nota natural');
      expect(card.options).toContain('Sí');
      expect(card.options).toContain('No');
      expect(card.correctAnswer).toBe('Sí');
    });

    it('generates Spanish next chromatic questions with localized prompt', () => {
      const card = generateNextChromaticQuestion('E', 'es');
      expect(card.prompt).toContain('¿Qué nota está un semitono');
      expect(card.correctAnswer).toBe('F');
    });

    it('retranslates an English card to Spanish in-place without losing note reference', () => {
      const enCard = generateTranslationCard({
        direction: 'letters-to-solfege',
        letter: 'E',
        lang: 'en',
      });
      expect(enCard.prompt).toContain("What European Solfège note corresponds to 'E'?");
      expect(enCard.explanation).toContain('equals Mi');

      const esCard = retranslateCard(enCard, 'es');
      expect(esCard.prompt).toContain("¿Qué nota europea (solfeo) corresponde a 'E'?");
      expect(esCard.explanation).toContain('equivale a Mi');
      expect(esCard.mnemonic).toContain('Mi-Fa');
      expect(esCard.correctAnswer).toBe('Mi');
      expect(esCard.noteReference).toBe('E');
    });
  });
});
