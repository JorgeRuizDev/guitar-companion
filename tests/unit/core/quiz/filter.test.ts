import { describe, it, expect } from 'vitest';
import { matchesFilter, filterQuestions } from '@/core/quiz/engine/filter';
import type { Question } from '@/core/quiz/types/schema';

describe('Multi-Dimensional Question Filter (User Story 3)', () => {
  const sampleQuestions: Question[] = [
    {
      id: 'q1',
      type: 'single-choice',
      course: 1,
      difficulty: 'beginner',
      topics: ['notes'],
      notation: 'letters',
      prompt: { en: 'Q1', es: 'Q1' },
      options: [
        { id: '1', label: { en: 'A', es: 'A' } },
        { id: '2', label: { en: 'B', es: 'B' } },
      ],
      correctAnswer: ['1'],
      remediation: { explanation: { en: 'E', es: 'E' } },
    },
    {
      id: 'q2',
      type: 'single-choice',
      course: 2,
      difficulty: 'intermediate',
      topics: ['accidentals'],
      notation: 'solfege',
      prompt: { en: 'Q2', es: 'Q2' },
      options: [
        { id: '1', label: { en: 'Do#', es: 'Do#' } },
        { id: '2', label: { en: 'Re', es: 'Re' } },
      ],
      correctAnswer: ['1'],
      remediation: { explanation: { en: 'E', es: 'E' } },
    },
    {
      id: 'q3',
      type: 'multiple-choice',
      course: 3,
      difficulty: 'advanced',
      topics: ['chords', 'harmony'],
      notation: 'dual',
      prompt: { en: 'Q3', es: 'Q3' },
      options: [
        { id: '1', label: { en: 'C/Do', es: 'C/Do' } },
        { id: '2', label: { en: 'G/Sol', es: 'G/Sol' } },
      ],
      correctAnswer: ['1', '2'],
      remediation: { explanation: { en: 'E', es: 'E' } },
    },
    {
      id: 'q4',
      type: 'single-choice',
      course: 1,
      difficulty: 'beginner',
      topics: ['rhythm'],
      notation: 'neutral',
      prompt: { en: 'Q4', es: 'Q4' },
      options: [
        { id: '1', label: { en: '4/4', es: '4/4' } },
        { id: '2', label: { en: '3/4', es: '3/4' } },
      ],
      correctAnswer: ['1'],
      remediation: { explanation: { en: 'E', es: 'E' } },
    },
  ];

  it('matches all questions when filter is undefined or empty', () => {
    expect(filterQuestions(sampleQuestions, undefined)).toEqual(sampleQuestions);
    expect(filterQuestions(sampleQuestions, {})).toEqual(sampleQuestions);
  });

  it('filters by course numbers', () => {
    const result = filterQuestions(sampleQuestions, { courses: [1] });
    expect(result.map((q) => q.id)).toEqual(['q1', 'q4']);

    const multiCourse = filterQuestions(sampleQuestions, { courses: [2, 3] });
    expect(multiCourse.map((q) => q.id)).toEqual(['q2', 'q3']);
  });

  it('filters by difficulty levels', () => {
    const beginners = filterQuestions(sampleQuestions, { difficulties: ['beginner'] });
    expect(beginners.map((q) => q.id)).toEqual(['q1', 'q4']);

    const advanced = filterQuestions(sampleQuestions, { difficulties: ['advanced'] });
    expect(advanced.map((q) => q.id)).toEqual(['q3']);
  });

  it('filters by topic intersections', () => {
    const harmonyResult = filterQuestions(sampleQuestions, { topics: ['harmony'] });
    expect(harmonyResult.map((q) => q.id)).toEqual(['q3']);

    const multiTopic = filterQuestions(sampleQuestions, { topics: ['notes', 'accidentals'] });
    expect(multiTopic.map((q) => q.id)).toEqual(['q1', 'q2']);
  });

  describe('Notation filter behavior', () => {
    it('strict letters filter includes questions with letters, neutral, and dual notation', () => {
      const lettersResult = filterQuestions(sampleQuestions, { notation: 'letters' });
      // q1 (letters), q3 (dual), q4 (neutral)
      expect(lettersResult.map((q) => q.id)).toEqual(['q1', 'q3', 'q4']);
    });

    it('strict solfege filter includes questions with solfege, neutral, and dual notation', () => {
      const solfegeResult = filterQuestions(sampleQuestions, { notation: 'solfege' });
      // q2 (solfege), q3 (dual), q4 (neutral)
      expect(solfegeResult.map((q) => q.id)).toEqual(['q2', 'q3', 'q4']);
    });

    it('notation any includes all questions', () => {
      const anyResult = filterQuestions(sampleQuestions, { notation: 'any' });
      expect(anyResult.length).toBe(sampleQuestions.length);
    });
  });

  it('combines multiple filter dimensions simultaneously', () => {
    const combined = filterQuestions(sampleQuestions, {
      courses: [1],
      difficulties: ['beginner'],
      topics: ['notes'],
      notation: 'letters',
    });
    expect(combined.map((q) => q.id)).toEqual(['q1']);
  });
});
