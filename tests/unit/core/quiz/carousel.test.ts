import { describe, it, expect } from 'vitest';
import {
  shuffleQuestions,
  findNextEligibleQuestion,
  drawNextEligible,
} from '@/core/quiz/engine/carousel';
import type { Question } from '@/core/quiz/types/schema';

describe('Carousel Engine & Multi-Family Mutual Exclusion (User Story 4)', () => {
  const createMockQuestion = (id: string, familyIds?: string[]): Question => ({
    id,
    familyIds,
    type: 'single-choice',
    course: 1,
    difficulty: 'beginner',
    topics: ['notes'],
    notation: 'letters',
    prompt: { en: `Prompt ${id}`, es: `Pregunta ${id}` },
    options: [
      { id: '1', label: { en: 'A', es: 'A' } },
      { id: '2', label: { en: 'B', es: 'B' } },
    ],
    correctAnswer: ['1'],
    remediation: { explanation: { en: 'E', es: 'E' } },
  });

  describe('Fisher-Yates Shuffle', () => {
    it('returns an array with identical elements without mutating original', () => {
      const original = [1, 2, 3, 4, 5, 6, 7, 8];
      const cloned = [...original];
      const shuffled = shuffleQuestions(original);

      expect(original).toEqual(cloned);
      expect(shuffled.sort()).toEqual(original.sort());
    });

    it('shuffles predictably with custom seeded RNG', () => {
      const items = ['a', 'b', 'c', 'd'];
      let call = 0;
      const fakeRng = () => {
        call++;
        return 0.1; // deterministic
      };
      const shuffled = shuffleQuestions(items, fakeRng);
      expect(shuffled.length).toBe(items.length);
    });
  });

  describe('drawNextEligible & Multi-Family Exclusion', () => {
    it('draws items sequentially when no familyIds exist', () => {
      const pool = [
        createMockQuestion('q1'),
        createMockQuestion('q2'),
        createMockQuestion('q3'),
      ];
      let excluded = new Set<string>();

      const step1 = drawNextEligible(pool, excluded);
      expect(step1.drawn?.id).toBe('q1');
      expect(step1.remainingPool.length).toBe(2);

      const step2 = drawNextEligible(step1.remainingPool, step1.updatedExcludedFamilies);
      expect(step2.drawn?.id).toBe('q2');
      expect(step2.remainingPool.length).toBe(1);

      const step3 = drawNextEligible(step2.remainingPool, step2.updatedExcludedFamilies);
      expect(step3.drawn?.id).toBe('q3');
      expect(step3.remainingPool.length).toBe(0);

      const step4 = drawNextEligible(step3.remainingPool, step3.updatedExcludedFamilies);
      expect(step4.drawn).toBeNull();
    });

    it('immediately excludes sister questions sharing even one family ID', () => {
      // q1 belongs to family A and B
      // q2 belongs to family A
      // q3 belongs to family C
      const pool = [
        createMockQuestion('q1', ['fam-A', 'fam-B']),
        createMockQuestion('q2', ['fam-A']),
        createMockQuestion('q3', ['fam-C']),
      ];

      const excluded = new Set<string>();
      const step1 = drawNextEligible(pool, excluded);
      expect(step1.drawn?.id).toBe('q1');
      expect(step1.updatedExcludedFamilies.has('fam-A')).toBe(true);
      expect(step1.updatedExcludedFamilies.has('fam-B')).toBe(true);

      // Now drawing next from remaining pool [q2, q3]:
      // q2 has 'fam-A' which is in excluded, so q2 must be skipped!
      // q3 has 'fam-C' which is NOT in excluded, so q3 must be drawn!
      const step2 = drawNextEligible(step1.remainingPool, step1.updatedExcludedFamilies);
      expect(step2.drawn?.id).toBe('q3');

      // Now drawing again: remaining is [q2]. q2 is still excluded.
      // Therefore no eligible question remains -> returns null!
      const step3 = drawNextEligible(step2.remainingPool, step2.updatedExcludedFamilies);
      expect(step3.drawn).toBeNull();
    });

    it('findNextEligibleQuestion correctly identifies eligible candidate without modifying pool', () => {
      const pool = [
        createMockQuestion('q1', ['fam-1']),
        createMockQuestion('q2', ['fam-2']),
      ];
      const excluded = new Set(['fam-1']);
      const next = findNextEligibleQuestion(pool, excluded);
      expect(next?.id).toBe('q2');
    });
  });
});
