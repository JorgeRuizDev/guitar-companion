import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateAccuracy,
  createInitialSessionState,
  trainerSessionReducer,
} from '@/apps/basic-note-trainer/hooks/useTrainerSession';
import { TrainerConfig } from '@/apps/basic-note-trainer/types';

describe('Trainer Session State Machine & Reducer (User Story 3)', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  });

  const baseConfig: TrainerConfig = {
    mode: 'translation',
    direction: 'letters-to-solfege',
    difficulty: 'beginner',
    embed: false,
  };

  it('accurately computes accuracy percentages', () => {
    expect(calculateAccuracy(0, 0)).toBe(100);
    expect(calculateAccuracy(5, 0)).toBe(100);
    expect(calculateAccuracy(1, 1)).toBe(50);
    expect(calculateAccuracy(3, 1)).toBe(75);
    expect(calculateAccuracy(0, 4)).toBe(0);
  });

  it('handles first-attempt success: increments okeys & streak, marks SOLVED_DIRECT', () => {
    const initialState = createInitialSessionState(baseConfig);
    const correctAnswer = initialState.currentCard.correctAnswer;

    const nextState = trainerSessionReducer(initialState, {
      type: 'SELECT_OPTION',
      option: correctAnswer,
    });

    expect(nextState.status).toBe('SOLVED_DIRECT');
    expect(nextState.isFirstAttemptSuccess).toBe(true);
    expect(nextState.showExplanation).toBe(false);
    expect(nextState.stats.okeys).toBe(1);
    expect(nextState.stats.failures).toBe(0);
    expect(nextState.stats.currentStreak).toBe(1);
    expect(nextState.stats.accuracy).toBe(100);
  });

  it('handles in-place retry: increments failures, reveals explanation upon recovery without auto-advance', () => {
    const initialState = createInitialSessionState(baseConfig);
    const correctAnswer = initialState.currentCard.correctAnswer;
    const wrongOptions = initialState.currentCard.options.filter((opt) => opt !== correctAnswer);
    const firstWrong = wrongOptions[0];
    const secondWrong = wrongOptions[1];

    // First miss
    const stateAfterMiss1 = trainerSessionReducer(initialState, {
      type: 'SELECT_OPTION',
      option: firstWrong,
    });

    expect(stateAfterMiss1.status).toBe('RETRYING');
    expect(stateAfterMiss1.disabledOptions).toContain(firstWrong);
    expect(stateAfterMiss1.stats.failures).toBe(1);
    expect(stateAfterMiss1.stats.currentStreak).toBe(0);
    expect(stateAfterMiss1.attemptsOnCurrentCard).toBe(1);
    expect(stateAfterMiss1.reviewQueue).toContain(initialState.currentCard.noteReference);

    // Second miss on same card
    const stateAfterMiss2 = trainerSessionReducer(stateAfterMiss1, {
      type: 'SELECT_OPTION',
      option: secondWrong,
    });

    expect(stateAfterMiss2.status).toBe('RETRYING');
    expect(stateAfterMiss2.disabledOptions).toContain(secondWrong);
    expect(stateAfterMiss2.stats.failures).toBe(2);
    expect(stateAfterMiss2.attemptsOnCurrentCard).toBe(2);

    // Now select correct answer
    const stateRecovered = trainerSessionReducer(stateAfterMiss2, {
      type: 'SELECT_OPTION',
      option: correctAnswer,
    });

    // Should resolve with SOLVED_AFTER_ERROR and show explanation
    expect(stateRecovered.status).toBe('SOLVED_AFTER_ERROR');
    expect(stateRecovered.isFirstAttemptSuccess).toBe(false);
    expect(stateRecovered.showExplanation).toBe(true);
    expect(stateRecovered.stats.okeys).toBe(1);
    expect(stateRecovered.stats.failures).toBe(2);
    expect(stateRecovered.stats.currentStreak).toBe(0);
    expect(stateRecovered.stats.accuracy).toBe(33); // 1 / (1 + 2) * 100 = 33%

    // Manual advancement via NEXT_CARD
    const stateNextCard = trainerSessionReducer(stateRecovered, {
      type: 'NEXT_CARD',
      config: baseConfig,
    });

    expect(stateNextCard.status).toBe('IDLE');
    expect(stateNextCard.disabledOptions).toEqual([]);
    expect(stateNextCard.showExplanation).toBe(false);
    expect(stateNextCard.attemptsOnCurrentCard).toBe(0);
    expect(stateNextCard.stats.totalCardsSeen).toBe(2);
  });

  it('ignores clicks on already disabled options or after card is resolved', () => {
    const initialState = createInitialSessionState(baseConfig);
    const correctAnswer = initialState.currentCard.correctAnswer;
    const wrong = initialState.currentCard.options.find((opt) => opt !== correctAnswer)!;

    const stateMiss = trainerSessionReducer(initialState, {
      type: 'SELECT_OPTION',
      option: wrong,
    });

    // Clicking the same wrong option again should be a no-op
    const stateRepeat = trainerSessionReducer(stateMiss, {
      type: 'SELECT_OPTION',
      option: wrong,
    });

    expect(stateRepeat.stats.failures).toBe(1);
    expect(stateRepeat.attemptsOnCurrentCard).toBe(1);

    // Solve card
    const stateSolved = trainerSessionReducer(stateRepeat, {
      type: 'SELECT_OPTION',
      option: correctAnswer,
    });

    // Clicking any option after solved should be a no-op
    const stateAfterSolved = trainerSessionReducer(stateSolved, {
      type: 'SELECT_OPTION',
      option: correctAnswer,
    });

    expect(stateAfterSolved.stats.okeys).toBe(1);
  });
});
