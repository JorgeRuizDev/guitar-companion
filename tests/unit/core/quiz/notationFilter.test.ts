import { describe, it, expect } from 'vitest';
import { filterQuestions } from '@/core/quiz/engine/filter';
import type { Question } from '@/core/quiz/types/schema';

describe('Notation Segregation & Fallbacks (User Story 5)', () => {
  const sampleBank: Question[] = [
    {
      id: 'q-letter-1',
      type: 'single-choice',
      course: 2,
      difficulty: 'beginner',
      topics: ['accidentals'],
      notation: 'letters',
      prompt: { en: 'What note is F#?', es: '¿Qué nota es F#?' },
      options: [
        { id: '1', label: { en: 'F#', es: 'F#' } },
        { id: '2', label: { en: 'G', es: 'G' } },
      ],
      correctAnswer: ['1'],
      remediation: { explanation: { en: 'E', es: 'E' } },
    },
    {
      id: 'q-solfege-1',
      type: 'single-choice',
      course: 2,
      difficulty: 'beginner',
      topics: ['accidentals'],
      notation: 'solfege',
      prompt: { en: 'What note is Fa#?', es: '¿Qué nota es Fa#?' },
      options: [
        { id: '1', label: { en: 'Fa#', es: 'Fa#' } },
        { id: '2', label: { en: 'Sol', es: 'Sol' } },
      ],
      correctAnswer: ['1'],
      remediation: { explanation: { en: 'E', es: 'E' } },
    },
    {
      id: 'q-dual-1',
      type: 'single-choice',
      course: 2,
      difficulty: 'intermediate',
      topics: ['accidentals'],
      notation: 'dual',
      prompt: { en: 'Identify C# / Do#', es: 'Identifica C# / Do#' },
      options: [
        { id: '1', label: { en: 'C# (Do#)', es: 'C# (Do#)' } },
        { id: '2', label: { en: 'D (Re)', es: 'D (Re)' } },
      ],
      correctAnswer: ['1'],
      remediation: { explanation: { en: 'E', es: 'E' } },
    },
    {
      id: 'q-neutral-1',
      type: 'single-choice',
      course: 2,
      difficulty: 'beginner',
      topics: ['theory'],
      notation: 'neutral',
      prompt: { en: 'How many semitones in a whole step?', es: '¿Cuántos semitonos hay en un tono entero?' },
      options: [
        { id: '1', label: { en: '2', es: '2' } },
        { id: '2', label: { en: '1', es: '1' } },
      ],
      correctAnswer: ['1'],
      remediation: { explanation: { en: 'E', es: 'E' } },
    },
  ];

  it('strictly segregates letters: includes letters, dual, neutral; excludes solfege', () => {
    const results = filterQuestions(sampleBank, { notation: 'letters' });
    const ids = results.map((q) => q.id);
    expect(ids).toContain('q-letter-1');
    expect(ids).toContain('q-dual-1');
    expect(ids).toContain('q-neutral-1');
    expect(ids).not.toContain('q-solfege-1');
  });

  it('strictly segregates solfege: includes solfege, dual, neutral; excludes letters', () => {
    const results = filterQuestions(sampleBank, { notation: 'solfege' });
    const ids = results.map((q) => q.id);
    expect(ids).toContain('q-solfege-1');
    expect(ids).toContain('q-dual-1');
    expect(ids).toContain('q-neutral-1');
    expect(ids).not.toContain('q-letter-1');
  });

  it('includes all notation formats when notation is any', () => {
    const results = filterQuestions(sampleBank, { notation: 'any' });
    expect(results.length).toBe(4);
  });
});
