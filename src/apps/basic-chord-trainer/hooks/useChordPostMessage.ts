/**
 * PostMessage Bridge Hook and Dispatcher for Embedded WebViews
 * Conforms to Interface Contract: specs/003-basic-chord-trainer/contracts/postmessage-api.md
 * @module apps/basic-chord-trainer/hooks/useChordPostMessage
 */

import { useCallback } from 'react';
import { SessionMetrics } from '../types';

export const CHORD_TRAINER_SOURCE = 'guitar-companion-chord-trainer';

export interface ChordTrainerAnswerPayload {
  challengeId: string;
  mode: 'draw' | 'identify';
  chordSymbol: string;
  chordSolfege: string;
  isCorrect: boolean;
  isSkipped: boolean;
  sessionMetrics: SessionMetrics;
}

export interface ChordTrainerProgressPayload {
  totalCompleted: number;
  hits: number;
  misses: number;
  skipped: number;
  currentStreak: number;
  bestStreak: number;
  accuracy: number;
}

export function dispatchChordAnswerMessage(
  payload: ChordTrainerAnswerPayload,
  options?: { isEnabled?: boolean; targetOrigin?: string }
): boolean {
  if (options?.isEnabled === false) return false;
  if (typeof window === 'undefined' || !window.parent) return false;

  const targetOrigin = options?.targetOrigin || '*';
  const message = {
    source: CHORD_TRAINER_SOURCE,
    event: 'CHORD_TRAINER_ANSWER' as const,
    payload,
  };

  try {
    window.parent.postMessage(message, targetOrigin);
    return true;
  } catch {
    return false;
  }
}

export function dispatchChordProgressMessage(
  payload: ChordTrainerProgressPayload,
  options?: { isEnabled?: boolean; targetOrigin?: string }
): boolean {
  if (options?.isEnabled === false) return false;
  if (typeof window === 'undefined' || !window.parent) return false;

  const targetOrigin = options?.targetOrigin || '*';
  const message = {
    source: CHORD_TRAINER_SOURCE,
    event: 'CHORD_TRAINER_PROGRESS' as const,
    payload,
  };

  try {
    window.parent.postMessage(message, targetOrigin);
    return true;
  } catch {
    return false;
  }
}

export function useChordPostMessage(options?: {
  isEnabled?: boolean;
  targetOrigin?: string;
}) {
  const isEnabled = options?.isEnabled ?? true;
  const targetOrigin = options?.targetOrigin ?? '*';

  const sendAnswer = useCallback(
    (payload: ChordTrainerAnswerPayload) => {
      return dispatchChordAnswerMessage(payload, { isEnabled, targetOrigin });
    },
    [isEnabled, targetOrigin]
  );

  const sendProgress = useCallback(
    (payload: ChordTrainerProgressPayload) => {
      return dispatchChordProgressMessage(payload, { isEnabled, targetOrigin });
    },
    [isEnabled, targetOrigin]
  );

  return { sendAnswer, sendProgress };
}
