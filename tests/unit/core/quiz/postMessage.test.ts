import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  dispatchQuizAnswerMessage,
  dispatchQuizProgressMessage,
  dispatchQuizExhaustedMessage,
  QUIZ_BRIDGE_SOURCE,
} from '@/core/quiz/hooks/useQuizPostMessage';

describe('postMessage Bridge Protocol (Phase 9)', () => {
  let postMessageSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    postMessageSpy = vi.fn();
    if (typeof window !== 'undefined') {
      window.parent = { postMessage: postMessageSpy } as unknown as Window;
    }
  });

  it('dispatches QUIZ_ANSWER event when enabled', () => {
    const success = dispatchQuizAnswerMessage(
      {
        questionId: 'q-test',
        isCorrect: true,
        selectedOptionIds: ['opt-1'],
        correctAnswerIds: ['opt-1'],
        sessionStats: {
          hits: 1,
          misses: 0,
          currentStreak: 1,
          bestStreak: 1,
          accuracy: 100,
        },
      },
      { isEnabled: true }
    );

    expect(success).toBe(true);
    expect(postMessageSpy).toHaveBeenCalledTimes(1);
    const sentEvent = postMessageSpy.mock.calls[0][0];
    expect(sentEvent.source).toBe(QUIZ_BRIDGE_SOURCE);
    expect(sentEvent.event).toBe('QUIZ_ANSWER');
    expect(sentEvent.payload.questionId).toBe('q-test');
    expect(sentEvent.payload.isCorrect).toBe(true);
  });

  it('dispatches QUIZ_PROGRESS and QUIZ_EXHAUSTED events', () => {
    dispatchQuizProgressMessage(
      {
        hits: 5,
        misses: 1,
        currentStreak: 3,
        bestStreak: 4,
        accuracy: 83,
        totalAnswered: 6,
      },
      { isEnabled: true }
    );

    dispatchQuizExhaustedMessage(
      {
        totalAnswered: 10,
        finalAccuracy: 90,
        peakStreak: 8,
      },
      { isEnabled: true }
    );

    expect(postMessageSpy).toHaveBeenCalledTimes(2);
    expect(postMessageSpy.mock.calls[0][0].event).toBe('QUIZ_PROGRESS');
    expect(postMessageSpy.mock.calls[1][0].event).toBe('QUIZ_EXHAUSTED');
  });

  it('does not dispatch events when isEnabled is false', () => {
    const success = dispatchQuizAnswerMessage(
      {
        questionId: 'q-test',
        isCorrect: true,
        selectedOptionIds: ['opt-1'],
        correctAnswerIds: ['opt-1'],
        sessionStats: { hits: 1, misses: 0, currentStreak: 1, bestStreak: 1, accuracy: 100 },
      },
      { isEnabled: false }
    );

    expect(success).toBe(false);
    expect(postMessageSpy).not.toHaveBeenCalled();
  });
});
