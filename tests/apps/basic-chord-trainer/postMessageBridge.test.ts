import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  dispatchChordAnswerMessage,
  dispatchChordProgressMessage,
  CHORD_TRAINER_SOURCE,
} from '@/apps/basic-chord-trainer/hooks/useChordPostMessage';

describe('postMessage Bridge Protocol (User Story 6)', () => {
  let postMessageSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    postMessageSpy = vi.fn();
    if (typeof window !== 'undefined') {
      window.parent = { postMessage: postMessageSpy } as unknown as Window;
    }
  });

  it('dispatches CHORD_TRAINER_ANSWER event with contract payload format', () => {
    const success = dispatchChordAnswerMessage(
      {
        challengeId: 'test_challenge_123',
        mode: 'draw',
        chordSymbol: 'C',
        chordSolfege: 'Do Mayor',
        isCorrect: true,
        isSkipped: false,
        sessionMetrics: {
          hits: 1,
          misses: 0,
          skipped: 0,
          currentStreak: 1,
          bestStreak: 1,
          accuracy: 100,
          totalCompleted: 1,
        },
      },
      { isEnabled: true }
    );

    expect(success).toBe(true);
    expect(postMessageSpy).toHaveBeenCalledTimes(1);

    const [message, targetOrigin] = postMessageSpy.mock.calls[0];
    expect(targetOrigin).toBe('*');
    expect(message.source).toBe(CHORD_TRAINER_SOURCE);
    expect(message.event).toBe('CHORD_TRAINER_ANSWER');
    expect(message.payload.challengeId).toBe('test_challenge_123');
    expect(message.payload.chordSymbol).toBe('C');
    expect(message.payload.chordSolfege).toBe('Do Mayor');
    expect(message.payload.isCorrect).toBe(true);
    expect(message.payload.isSkipped).toBe(false);
    expect(message.payload.sessionMetrics.currentStreak).toBe(1);
  });

  it('dispatches CHORD_TRAINER_PROGRESS event with contract payload format', () => {
    const success = dispatchChordProgressMessage(
      {
        totalCompleted: 5,
        hits: 4,
        misses: 1,
        skipped: 0,
        currentStreak: 2,
        bestStreak: 3,
        accuracy: 80,
      },
      { isEnabled: true }
    );

    expect(success).toBe(true);
    expect(postMessageSpy).toHaveBeenCalledTimes(1);

    const [message, targetOrigin] = postMessageSpy.mock.calls[0];
    expect(targetOrigin).toBe('*');
    expect(message.source).toBe(CHORD_TRAINER_SOURCE);
    expect(message.event).toBe('CHORD_TRAINER_PROGRESS');
    expect(message.payload.totalCompleted).toBe(5);
    expect(message.payload.hits).toBe(4);
    expect(message.payload.accuracy).toBe(80);
  });

  it('does not dispatch events when isEnabled is false', () => {
    const result = dispatchChordAnswerMessage(
      {
        challengeId: 'test_disabled',
        mode: 'identify',
        chordSymbol: 'Am',
        chordSolfege: 'La menor',
        isCorrect: true,
        isSkipped: false,
        sessionMetrics: {
          hits: 1,
          misses: 0,
          skipped: 0,
          currentStreak: 1,
          bestStreak: 1,
          accuracy: 100,
          totalCompleted: 1,
        },
      },
      { isEnabled: false }
    );

    expect(result).toBe(false);
    expect(postMessageSpy).not.toHaveBeenCalled();
  });
});
