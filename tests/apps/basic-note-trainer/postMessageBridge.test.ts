import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  dispatchAnswerMessage,
  dispatchProgressMessage,
} from '@/apps/basic-note-trainer/hooks/usePostMessageBridge';

describe('postMessage Bridge Protocol (User Story 4)', () => {
  let postMessageSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    postMessageSpy = vi.fn();
    if (typeof window !== 'undefined') {
      window.parent = { postMessage: postMessageSpy } as unknown as Window;
    }
  });

  it('dispatches NOTE_TRAINER_ANSWER event with contract payload format', () => {
    const success = dispatchAnswerMessage(
      {
        cardId: 'test_card_1',
        isCorrect: true,
        isFirstAttempt: true,
        selectedOption: 'La',
        correctAnswer: 'La',
        noteReference: 'A',
        sessionStats: {
          okeys: 1,
          failures: 0,
          currentStreak: 1,
          bestStreak: 1,
          accuracy: 100,
        },
      },
      { isEnabled: true }
    );

    expect(success).toBe(true);
    expect(postMessageSpy).toHaveBeenCalledTimes(1);
    const [message, targetOrigin] = postMessageSpy.mock.calls[0];
    expect(targetOrigin).toBe('*');
    expect(message.source).toBe('guitar-companion-note-trainer');
    expect(message.event).toBe('NOTE_TRAINER_ANSWER');
    expect(message.payload.cardId).toBe('test_card_1');
    expect(message.payload.isCorrect).toBe(true);
    expect(message.payload.selectedOption).toBe('La');
    expect(message.payload.sessionStats.okeys).toBe(1);
  });

  it('dispatches NOTE_TRAINER_PROGRESS event with contract payload format', () => {
    const success = dispatchProgressMessage(
      {
        totalSolved: 5,
        okeys: 5,
        failures: 1,
        currentStreak: 3,
        bestStreak: 4,
        accuracy: 83,
      },
      { isEnabled: true }
    );

    expect(success).toBe(true);
    expect(postMessageSpy).toHaveBeenCalledTimes(1);
    const [message] = postMessageSpy.mock.calls[0];
    expect(message.source).toBe('guitar-companion-note-trainer');
    expect(message.event).toBe('NOTE_TRAINER_PROGRESS');
    expect(message.payload.totalSolved).toBe(5);
    expect(message.payload.accuracy).toBe(83);
  });

  it('does not dispatch events when isEnabled is false', () => {
    const success = dispatchAnswerMessage(
      {
        cardId: 'test_card_2',
        isCorrect: false,
        isFirstAttempt: true,
        selectedOption: 'Do',
        correctAnswer: 'Re',
        noteReference: 'D',
        sessionStats: {
          okeys: 0,
          failures: 1,
          currentStreak: 0,
          bestStreak: 0,
          accuracy: 0,
        },
      },
      { isEnabled: false }
    );

    expect(success).toBe(false);
    expect(postMessageSpy).not.toHaveBeenCalled();
  });
});
