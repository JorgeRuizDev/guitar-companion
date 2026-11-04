import { describe, it, expect, beforeEach } from 'vitest';
import type { Question } from '@/core/quiz/types/schema';
import {
  createInitialQuizSessionState,
  quizSessionReducer,
  calculateQuizAccuracy,
} from '@/core/quiz/hooks/useQuizSession';
import { typedStorage } from '@/core/storage/typedStorage';

describe('Quiz Session Reducer & State Machine (User Story 4)', () => {
  const dummyQuestions: Question[] = [
    {
      id: 'q1',
      familyIds: ['fam-1'],
      type: 'single-choice',
      course: 1,
      difficulty: 'beginner',
      topics: ['notes'],
      notation: 'letters',
      prompt: { en: 'Q1', es: 'Q1' },
      options: [
        { id: 'opt-correct', label: { en: 'A', es: 'A' } },
        { id: 'opt-wrong', label: { en: 'B', es: 'B' } },
      ],
      correctAnswer: ['opt-correct'],
      remediation: { explanation: { en: 'E', es: 'E' } },
    },
    {
      id: 'q2',
      familyIds: ['fam-2'],
      type: 'single-choice',
      course: 1,
      difficulty: 'beginner',
      topics: ['notes'],
      notation: 'letters',
      prompt: { en: 'Q2', es: 'Q2' },
      options: [
        { id: 'opt-correct', label: { en: 'A', es: 'A' } },
        { id: 'opt-wrong', label: { en: 'B', es: 'B' } },
      ],
      correctAnswer: ['opt-correct'],
      remediation: { explanation: { en: 'E', es: 'E' } },
    },
  ];

  beforeEach(() => {
    typedStorage.remove('guitar_companion_quiz_metrics');
  });

  it('accurately computes accuracy percentage', () => {
    expect(calculateQuizAccuracy(0, 0)).toBe(100);
    expect(calculateQuizAccuracy(10, 0)).toBe(100);
    expect(calculateQuizAccuracy(1, 1)).toBe(50);
    expect(calculateQuizAccuracy(3, 1)).toBe(75);
    expect(calculateQuizAccuracy(0, 5)).toBe(0);
  });

  it('initializes in IDLE state with activeQuestion drawn', () => {
    const state = createInitialQuizSessionState(dummyQuestions);
    expect(state.status).toBe('IDLE');
    expect(state.activeQuestion).toBeDefined();
    expect(state.stats.hits).toBe(0);
    expect(state.stats.misses).toBe(0);
    expect(state.stats.currentStreak).toBe(0);
    expect(state.candidatePool.length).toBe(1);
    expect(state.servedQuestionIds.size).toBe(1);
  });

  it('accurately calculates accuracy and streaks across correct and incorrect submissions', () => {
    const state0 = createInitialQuizSessionState(dummyQuestions);

    // Select option
    const state1 = quizSessionReducer(state0, {
      type: 'SELECT_OPTION',
      payload: { optionId: 'opt-correct' },
    });
    expect(state1.status).toBe('ANSWERING');
    expect(state1.selectedOptionIds).toEqual(['opt-correct']);

    // Submit correct answer
    const state2 = quizSessionReducer(state1, { type: 'SUBMIT_ANSWER' });
    expect(state2.status).toBe('EVALUATED_CORRECT');
    expect(state2.stats.hits).toBe(1);
    expect(state2.stats.currentStreak).toBe(1);
    expect(state2.stats.accuracy).toBe(100);

    // Next question
    const state3 = quizSessionReducer(state2, { type: 'NEXT_QUESTION' });
    expect(state3.status).toBe('IDLE');
    expect(state3.selectedOptionIds).toEqual([]);

    // Select wrong option
    const state4 = quizSessionReducer(state3, {
      type: 'SELECT_OPTION',
      payload: { optionId: 'opt-wrong' },
    });
    const state5 = quizSessionReducer(state4, { type: 'SUBMIT_ANSWER' });
    expect(state5.status).toBe('EVALUATED_INCORRECT');
    expect(state5.stats.misses).toBe(1);
    expect(state5.stats.currentStreak).toBe(0);
    expect(state5.stats.accuracy).toBe(50);
  });

  it('transitions to SESSION_EXHAUSTED when candidate pool is depleted', () => {
    const singleItemPool: Question[] = [dummyQuestions[0]];
    const state0 = createInitialQuizSessionState(singleItemPool);

    const state1 = quizSessionReducer(state0, {
      type: 'SELECT_OPTION',
      payload: { optionId: 'opt-correct' },
    });
    const state2 = quizSessionReducer(state1, { type: 'SUBMIT_ANSWER' });
    const state3 = quizSessionReducer(state2, { type: 'NEXT_QUESTION' });

    expect(state3.status).toBe('SESSION_EXHAUSTED');
    expect(state3.activeQuestion).toBeNull();
  });
});
