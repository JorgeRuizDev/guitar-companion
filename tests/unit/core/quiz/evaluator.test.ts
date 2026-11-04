import { describe, it, expect } from 'vitest';
import { evaluateAnswer } from '@/core/quiz/engine/evaluator';
import type { Question } from '@/core/quiz/types/schema';

describe('Answer Evaluator (Pure Function)', () => {
  const dummySingleChoice: Question = {
    id: 'q-single-1',
    type: 'single-choice',
    course: 1,
    difficulty: 'beginner',
    topics: ['notes'],
    notation: 'letters',
    prompt: { en: 'What note is this?', es: '¿Qué nota es esta?' },
    options: [
      { id: 'opt-a', label: { en: 'A', es: 'La' } },
      { id: 'opt-b', label: { en: 'B', es: 'Si' } },
      { id: 'opt-c', label: { en: 'C', es: 'Do' } },
    ],
    correctAnswer: ['opt-a'],
    remediation: {
      explanation: { en: 'Explanation A', es: 'Explicación A' },
    },
  };

  const dummyMultiChoice: Question = {
    id: 'q-multi-1',
    type: 'multiple-choice',
    course: 1,
    difficulty: 'intermediate',
    topics: ['chords'],
    notation: 'letters',
    prompt: { en: 'Select all roots of C major', es: 'Selecciona todas las notas de Do mayor' },
    options: [
      { id: 'c', label: { en: 'C', es: 'Do' } },
      { id: 'e', label: { en: 'E', es: 'Mi' } },
      { id: 'g', label: { en: 'G', es: 'Sol' } },
      { id: 'b', label: { en: 'B', es: 'Si' } },
    ],
    correctAnswer: ['c', 'e', 'g'],
    remediation: {
      explanation: { en: 'C major consists of C, E, and G.', es: 'Do mayor consiste en Do, Mi y Sol.' },
    },
  };

  describe('Single-choice evaluation', () => {
    it('evaluates correct answer as isCorrect: true with no false positives or negatives', () => {
      const result = evaluateAnswer(dummySingleChoice, ['opt-a']);
      expect(result.isCorrect).toBe(true);
      expect(result.falsePositives).toEqual([]);
      expect(result.falseNegatives).toEqual([]);
    });

    it('evaluates incorrect answer with falsePositive and falseNegative diagnostics', () => {
      const result = evaluateAnswer(dummySingleChoice, ['opt-b']);
      expect(result.isCorrect).toBe(false);
      expect(result.falsePositives).toEqual(['opt-b']);
      expect(result.falseNegatives).toEqual(['opt-a']);
    });

    it('evaluates empty selection as incorrect with falseNegative diagnostic', () => {
      const result = evaluateAnswer(dummySingleChoice, []);
      expect(result.isCorrect).toBe(false);
      expect(result.falsePositives).toEqual([]);
      expect(result.falseNegatives).toEqual(['opt-a']);
    });
  });

  describe('Multiple-choice evaluation (All-or-Nothing)', () => {
    it('evaluates fully matching selection as isCorrect: true', () => {
      const result = evaluateAnswer(dummyMultiChoice, ['c', 'e', 'g']);
      expect(result.isCorrect).toBe(true);
      expect(result.falsePositives).toEqual([]);
      expect(result.falseNegatives).toEqual([]);
    });

    it('evaluates partially correct selection with missing item as incorrect (false negative)', () => {
      const result = evaluateAnswer(dummyMultiChoice, ['c', 'e']);
      expect(result.isCorrect).toBe(false);
      expect(result.falsePositives).toEqual([]);
      expect(result.falseNegatives).toEqual(['g']);
    });

    it('evaluates selection with an extra wrong item as incorrect (false positive)', () => {
      const result = evaluateAnswer(dummyMultiChoice, ['c', 'e', 'g', 'b']);
      expect(result.isCorrect).toBe(false);
      expect(result.falsePositives).toEqual(['b']);
      expect(result.falseNegatives).toEqual([]);
    });

    it('evaluates selection with both missing and extra items correctly', () => {
      const result = evaluateAnswer(dummyMultiChoice, ['c', 'b']);
      expect(result.isCorrect).toBe(false);
      expect(result.falsePositives).toEqual(['b']);
      expect(result.falseNegatives).toEqual(['e', 'g']);
    });
  });
});
