import { useCallback } from 'react';
import type {
  QuizAnswerEventPayload,
  QuizProgressEventPayload,
  QuizSessionExhaustedPayload,
  QuizBridgeEvent,
} from '../types/postmessage';

export const QUIZ_BRIDGE_SOURCE = 'guitar-companion-quiz';

export interface UseQuizPostMessageOptions {
  isEnabled?: boolean;
  targetOrigin?: string;
}

export function sendQuizBridgeMessage(
  event: QuizBridgeEvent,
  options: UseQuizPostMessageOptions = {}
): boolean {
  const { isEnabled = true, targetOrigin = '*' } = options;
  if (!isEnabled || typeof window === 'undefined') return false;

  const target = window.parent !== window ? window.parent : window;
  try {
    target.postMessage(event, targetOrigin);
    return true;
  } catch {
    return false;
  }
}

export function dispatchQuizAnswerMessage(
  payload: QuizAnswerEventPayload,
  options?: UseQuizPostMessageOptions
): boolean {
  return sendQuizBridgeMessage(
    {
      source: QUIZ_BRIDGE_SOURCE,
      event: 'QUIZ_ANSWER',
      payload,
    },
    options
  );
}

export function dispatchQuizProgressMessage(
  payload: QuizProgressEventPayload,
  options?: UseQuizPostMessageOptions
): boolean {
  return sendQuizBridgeMessage(
    {
      source: QUIZ_BRIDGE_SOURCE,
      event: 'QUIZ_PROGRESS',
      payload,
    },
    options
  );
}

export function dispatchQuizExhaustedMessage(
  payload: QuizSessionExhaustedPayload,
  options?: UseQuizPostMessageOptions
): boolean {
  return sendQuizBridgeMessage(
    {
      source: QUIZ_BRIDGE_SOURCE,
      event: 'QUIZ_EXHAUSTED',
      payload,
    },
    options
  );
}

export function useQuizPostMessage(options: UseQuizPostMessageOptions = {}) {
  const dispatchAnswer = useCallback(
    (payload: QuizAnswerEventPayload) => {
      dispatchQuizAnswerMessage(payload, options);
    },
    [options]
  );

  const dispatchProgress = useCallback(
    (payload: QuizProgressEventPayload) => {
      dispatchQuizProgressMessage(payload, options);
    },
    [options]
  );

  const dispatchExhausted = useCallback(
    (payload: QuizSessionExhaustedPayload) => {
      dispatchQuizExhaustedMessage(payload, options);
    },
    [options]
  );

  return {
    dispatchAnswer,
    dispatchProgress,
    dispatchExhausted,
  };
}
