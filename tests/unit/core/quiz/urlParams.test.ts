import { describe, it, expect } from 'vitest';
import {
  parseQuizUrlParams,
  urlParamsToFilter,
  QuizUrlParamsSchema,
} from '@/core/quiz/hooks/useQuizUrlParams';

describe('Quiz URL Parameters Parser (User Story 3)', () => {
  it('parses empty or undefined params with defaults', () => {
    const result = parseQuizUrlParams(undefined);
    expect(result.difficulty).toBe('any');
    expect(result.notation).toBe('any');
    expect(result.lang).toBe('en');
    expect(result.embed).toBe(false);
    expect(result.compact).toBe(false);
    expect(result.courses).toBeUndefined();
    expect(result.topics).toBeUndefined();
  });

  it('transforms course ranges like "1-5" to [1, 2, 3, 4, 5]', () => {
    const params = new URLSearchParams('courses=1-5');
    const result = parseQuizUrlParams(params);
    expect(result.courses).toEqual([1, 2, 3, 4, 5]);
  });

  it('transforms comma-separated courses like "1,3,7" to [1, 3, 7]', () => {
    const params = new URLSearchParams('courses=1,3,7');
    const result = parseQuizUrlParams(params);
    expect(result.courses).toEqual([1, 3, 7]);
  });

  it('transforms comma-separated topics into string array', () => {
    const params = new URLSearchParams('topics=notes,chords,theory');
    const result = parseQuizUrlParams(params);
    expect(result.topics).toEqual(['notes', 'chords', 'theory']);
  });

  it('parses boolean string flags for embed and compact', () => {
    const params = new URLSearchParams('embed=true&compact=true');
    const result = parseQuizUrlParams(params);
    expect(result.embed).toBe(true);
    expect(result.compact).toBe(true);
  });

  it('sanitizes invalid values and falls back gracefully to defaults', () => {
    const params = new URLSearchParams('difficulty=super-hard&notation=alien&lang=fr');
    const result = parseQuizUrlParams(params);
    // Invalid enums trigger fallback to safe default schema
    expect(result.difficulty).toBe('any');
    expect(result.notation).toBe('any');
    expect(result.lang).toBe('en');
  });

  it('converts parsed params to domain QuestionFilter correctly', () => {
    const parsed = parseQuizUrlParams(
      new URLSearchParams('courses=2-4&difficulty=intermediate&topics=scales&notation=solfege')
    );
    const filter = urlParamsToFilter(parsed);
    expect(filter.courses).toEqual([2, 3, 4]);
    expect(filter.difficulties).toEqual(['intermediate']);
    expect(filter.topics).toEqual(['scales']);
    expect(filter.notation).toBe('solfege');
  });
});
