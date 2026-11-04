/**
 * PostMessage Bridge Event Contracts for Quiz Engine
 * Defines cross-window and webview communication contracts.
 * @module core/quiz/types/postmessage
 */

export interface QuizAnswerEventPayload {
  questionId: string;
  isCorrect: boolean;
  selectedOptionIds: string[];
  correctAnswerIds: string[];
  sessionStats: {
    hits: number;
    misses: number;
    currentStreak: number;
    bestStreak: number;
    accuracy: number;
  };
}

export interface QuizProgressEventPayload {
  hits: number;
  misses: number;
  currentStreak: number;
  bestStreak: number;
  accuracy: number;
  totalAnswered: number;
}

export interface QuizSessionExhaustedPayload {
  totalAnswered: number;
  finalAccuracy: number;
  peakStreak: number;
}

export type QuizBridgeEvent =
  | {
      source: 'guitar-companion-quiz';
      event: 'QUIZ_ANSWER';
      payload: QuizAnswerEventPayload;
    }
  | {
      source: 'guitar-companion-quiz';
      event: 'QUIZ_PROGRESS';
      payload: QuizProgressEventPayload;
    }
  | {
      source: 'guitar-companion-quiz';
      event: 'QUIZ_EXHAUSTED';
      payload: QuizSessionExhaustedPayload;
    };
