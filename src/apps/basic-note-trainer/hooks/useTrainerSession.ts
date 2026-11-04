/**
 * Trainer Session State Machine & Reducer
 * Pure state transitions for in-place retry flow, streak calculation,
 * accuracy, review buffer, and pedagogical reveals.
 * @module apps/basic-note-trainer/hooks/useTrainerSession
 */

import { useReducer, useCallback, useRef, useEffect } from 'react';
import {
  CardStatus,
  FlashcardQuestion,
  SessionStats,
  TrainerConfig,
  Language,
  NoteTrainerAnswerPayload,
  NoteTrainerProgressPayload,
} from '../types';
import { generateCard, retranslateCard } from '../domain/cardGenerator';
import { trainerStorage } from '../storage/trainerStorage';

export interface TrainerSessionState {
  currentCard: FlashcardQuestion;
  status: CardStatus;
  attemptsOnCurrentCard: number;
  disabledOptions: string[];
  showExplanation: boolean;
  isFirstAttemptSuccess: boolean;
  reviewQueue: string[];
  recentNotes: string[];
  stats: SessionStats;
}

export type TrainerAction =
  | { type: 'SELECT_OPTION'; option: string }
  | { type: 'NEXT_CARD'; config: TrainerConfig }
  | { type: 'RESET_SESSION'; config: TrainerConfig }
  | { type: 'UPDATE_LANGUAGE'; lang: Language };

export function calculateAccuracy(okeys: number, failures: number): number {
  const total = okeys + failures;
  if (total === 0) return 100;
  return Math.round((okeys / total) * 100);
}

export function createInitialSessionState(config: TrainerConfig): TrainerSessionState {
  const initialCard = generateCard(config, []);
  return {
    currentCard: initialCard,
    status: 'IDLE',
    attemptsOnCurrentCard: 0,
    disabledOptions: [],
    showExplanation: false,
    isFirstAttemptSuccess: false,
    reviewQueue: [],
    recentNotes: [initialCard.noteReference],
    stats: {
      okeys: 0,
      failures: 0,
      currentStreak: 0,
      bestStreak: 0,
      accuracy: 100,
      totalCardsSeen: 1,
    },
  };
}

export function trainerSessionReducer(
  state: TrainerSessionState,
  action: TrainerAction
): TrainerSessionState {
  switch (action.type) {
    case 'SELECT_OPTION': {
      const { option } = action;

      // Prevent selecting if already resolved or option was already missed
      if (
        state.status === 'SOLVED_DIRECT' ||
        state.status === 'SOLVED_AFTER_ERROR' ||
        state.disabledOptions.includes(option)
      ) {
        return state;
      }

      const isCorrect = option === state.currentCard.correctAnswer;
      const isFirstAttempt = state.attemptsOnCurrentCard === 0;

      if (isCorrect) {
        if (isFirstAttempt) {
          // Solved on 1st Attempt (Direct Hit)
          const newOkeys = state.stats.okeys + 1;
          const newStreak = state.stats.currentStreak + 1;
          const newBestStreak = Math.max(state.stats.bestStreak, newStreak);
          const newAccuracy = calculateAccuracy(newOkeys, state.stats.failures);

          return {
            ...state,
            status: 'SOLVED_DIRECT',
            isFirstAttemptSuccess: true,
            showExplanation: false,
            stats: {
              ...state.stats,
              okeys: newOkeys,
              currentStreak: newStreak,
              bestStreak: newBestStreak,
              accuracy: newAccuracy,
            },
          };
        } else {
          // Solved after previous errors (In-Place Recovery)
          const newOkeys = state.stats.okeys + 1;
          const newAccuracy = calculateAccuracy(newOkeys, state.stats.failures);

          return {
            ...state,
            status: 'SOLVED_AFTER_ERROR',
            isFirstAttemptSuccess: false,
            showExplanation: true,
            stats: {
              ...state.stats,
              okeys: newOkeys,
              accuracy: newAccuracy,
            },
          };
        }
      } else {
        // Incorrect Option Selected
        const newFailures = state.stats.failures + 1;
        const newAccuracy = calculateAccuracy(state.stats.okeys, newFailures);

        // Add noteReference to review queue if not already there
        const noteRef = state.currentCard.noteReference;
        const updatedReviewQueue = state.reviewQueue.includes(noteRef)
          ? state.reviewQueue
          : [...state.reviewQueue, noteRef];

        return {
          ...state,
          status: 'RETRYING',
          attemptsOnCurrentCard: state.attemptsOnCurrentCard + 1,
          disabledOptions: [...state.disabledOptions, option],
          reviewQueue: updatedReviewQueue,
          stats: {
            ...state.stats,
            failures: newFailures,
            currentStreak: 0,
            accuracy: newAccuracy,
          },
        };
      }
    }

    case 'NEXT_CARD': {
      // Dequeue resolved note from reviewQueue
      const resolvedNote = state.currentCard.noteReference;
      const filteredQueue = state.reviewQueue.filter((n) => n !== resolvedNote);
      // Keep a buffer of the last 4 notes so sister questions and the same note family are spaced out
      const prevRecent = state.recentNotes || [];
      const updatedRecent = [resolvedNote, ...prevRecent.filter((n) => n !== resolvedNote)].slice(0, 4);
      const nextCard = generateCard(action.config, filteredQueue, updatedRecent);

      return {
        ...state,
        currentCard: nextCard,
        status: 'IDLE',
        attemptsOnCurrentCard: 0,
        disabledOptions: [],
        showExplanation: false,
        isFirstAttemptSuccess: false,
        reviewQueue: filteredQueue,
        recentNotes: updatedRecent,
        stats: {
          ...state.stats,
          totalCardsSeen: state.stats.totalCardsSeen + 1,
        },
      };
    }

    case 'RESET_SESSION': {
      return createInitialSessionState(action.config);
    }

    case 'UPDATE_LANGUAGE': {
      const newLang = action.lang;
      const updatedCard = retranslateCard(state.currentCard, newLang);
      const isEs = newLang === 'es';
      const updatedDisabledOptions = state.disabledOptions.map((opt) => {
        if (opt === 'Yes' && isEs) return 'Sí';
        if (opt === 'Sí' && !isEs) return 'Yes';
        if (opt === 'Only in flat keys' && isEs) return 'Solo con bemoles';
        if (opt === 'Solo con bemoles' && !isEs) return 'Only in flat keys';
        if (opt === 'Depends on octave' && isEs) return 'Depende de la octava';
        if (opt === 'Depende de la octava' && !isEs) return 'Depends on octave';
        return opt;
      });

      return {
        ...state,
        currentCard: updatedCard,
        disabledOptions: updatedDisabledOptions,
      };
    }

    default:
      return state;
  }
}

export interface UseTrainerSessionOptions {
  config: TrainerConfig;
  onAnswer?: (payload: NoteTrainerAnswerPayload) => void;
  onProgress?: (payload: NoteTrainerProgressPayload) => void;
  autoAdvanceDelayMs?: number;
}

export function useTrainerSession(options: UseTrainerSessionOptions) {
  const {
    config,
    onAnswer,
    onProgress,
    autoAdvanceDelayMs = 400,
  } = options;

  const [state, dispatch] = useReducer(
    trainerSessionReducer,
    config,
    createInitialSessionState
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastLangRef = useRef(config.lang);

  // If language changes dynamically, retranslate card in-place
  useEffect(() => {
    if (config.lang && lastLangRef.current !== config.lang) {
      lastLangRef.current = config.lang;
      dispatch({ type: 'UPDATE_LANGUAGE', lang: config.lang });
    }
  }, [config.lang]);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const nextCard = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    dispatch({ type: 'NEXT_CARD', config });

    if (onProgress) {
      onProgress({
        totalSolved: state.stats.okeys,
        okeys: state.stats.okeys,
        failures: state.stats.failures,
        currentStreak: state.stats.currentStreak,
        bestStreak: state.stats.bestStreak,
        accuracy: state.stats.accuracy,
      });
    }
  }, [config, onProgress, state.stats]);

  const selectOption = useCallback(
    (option: string) => {
      // Check eligibility before action
      if (
        state.status === 'SOLVED_DIRECT' ||
        state.status === 'SOLVED_AFTER_ERROR' ||
        state.disabledOptions.includes(option)
      ) {
        return;
      }

      const isCorrect = option === state.currentCard.correctAnswer;
      const isFirstAttempt = state.attemptsOnCurrentCard === 0;

      // Dispatch state update
      dispatch({ type: 'SELECT_OPTION', option });

      // Calculate projected stats for event and storage
      let newOkeys = state.stats.okeys;
      let newFailures = state.stats.failures;
      let newStreak = state.stats.currentStreak;

      if (isCorrect) {
        newOkeys += 1;
        if (isFirstAttempt) {
          newStreak += 1;
          trainerStorage.recordSessionResults(1, 0, newStreak);
          // Auto advance timer on direct hits
          timerRef.current = setTimeout(() => {
            dispatch({ type: 'NEXT_CARD', config });
          }, autoAdvanceDelayMs);
        } else {
          trainerStorage.recordSessionResults(1, 0, newStreak);
        }
      } else {
        newFailures += 1;
        newStreak = 0;
        trainerStorage.recordSessionResults(0, 1, 0);
      }

      const newAccuracy = calculateAccuracy(newOkeys, newFailures);

      if (onAnswer) {
        onAnswer({
          cardId: state.currentCard.id,
          isCorrect,
          isFirstAttempt,
          selectedOption: option,
          correctAnswer: state.currentCard.correctAnswer,
          noteReference: state.currentCard.noteReference,
          sessionStats: {
            okeys: newOkeys,
            failures: newFailures,
            currentStreak: newStreak,
            bestStreak: Math.max(state.stats.bestStreak, newStreak),
            accuracy: newAccuracy,
          },
        });
      }
    },
    [autoAdvanceDelayMs, config, onAnswer, state]
  );

  return {
    card: state.currentCard,
    status: state.status,
    disabledOptions: state.disabledOptions,
    showExplanation: state.showExplanation,
    isFirstAttemptSuccess: state.isFirstAttemptSuccess,
    attemptsOnCurrentCard: state.attemptsOnCurrentCard,
    reviewQueue: state.reviewQueue,
    stats: state.stats,
    selectOption,
    nextCard,
  };
}
