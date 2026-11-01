'use client';

import { useCallback } from 'react';
import {
  NoteTrainerAnswerPayload,
  NoteTrainerProgressPayload,
  NoteTrainerAnswerEvent,
  NoteTrainerProgressEvent,
} from '../types';

export interface UsePostMessageBridgeOptions {
  isEnabled?: boolean;
  targetOrigin?: string;
}

export function dispatchAnswerMessage(
  payload: NoteTrainerAnswerPayload,
  options: UsePostMessageBridgeOptions = {}
): boolean {
  const { isEnabled = true, targetOrigin = '*' } = options;
  if (!isEnabled || typeof window === 'undefined' || !window.parent) return false;

  const message: NoteTrainerAnswerEvent = {
    source: 'guitar-companion-note-trainer',
    event: 'NOTE_TRAINER_ANSWER',
    payload,
  };

  try {
    window.parent.postMessage(message, targetOrigin);
    return true;
  } catch (err) {
    console.warn('Failed to dispatch postMessage NOTE_TRAINER_ANSWER', err);
    return false;
  }
}

export function dispatchProgressMessage(
  payload: NoteTrainerProgressPayload,
  options: UsePostMessageBridgeOptions = {}
): boolean {
  const { isEnabled = true, targetOrigin = '*' } = options;
  if (!isEnabled || typeof window === 'undefined' || !window.parent) return false;

  const message: NoteTrainerProgressEvent = {
    source: 'guitar-companion-note-trainer',
    event: 'NOTE_TRAINER_PROGRESS',
    payload,
  };

  try {
    window.parent.postMessage(message, targetOrigin);
    return true;
  } catch (err) {
    console.warn('Failed to dispatch postMessage NOTE_TRAINER_PROGRESS', err);
    return false;
  }
}

export function usePostMessageBridge(options: UsePostMessageBridgeOptions = {}) {
  const { isEnabled = true, targetOrigin = '*' } = options;

  const dispatchAnswer = useCallback(
    (payload: NoteTrainerAnswerPayload) => {
      dispatchAnswerMessage(payload, { isEnabled, targetOrigin });
    },
    [isEnabled, targetOrigin]
  );

  const dispatchProgress = useCallback(
    (payload: NoteTrainerProgressPayload) => {
      dispatchProgressMessage(payload, { isEnabled, targetOrigin });
    },
    [isEnabled, targetOrigin]
  );

  return {
    dispatchAnswer,
    dispatchProgress,
  };
}
