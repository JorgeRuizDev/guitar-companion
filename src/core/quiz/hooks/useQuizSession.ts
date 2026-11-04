import { useReducer, useEffect, useCallback, useMemo } from 'react';
import type { Question } from '../types/schema';
import type {
  QuizSessionState,
  QuestionFilter,
  SessionStatus,
  SessionStats,
  QuizSessionAction,
} from '../types/session';
import { filterQuestions } from '../engine/filter';
import { shuffleQuestions, drawNextEligible } from '../engine/carousel';
import { evaluateAnswer, type EvaluationResult } from '../engine/evaluator';
import { typedStorage } from '@/core/storage/typedStorage';

const STORAGE_KEY = 'guitar_companion_quiz_metrics';

export interface PersistedQuizMetrics {
  ownerId: null; // Zero-Mock UI guest persistence (Constitution IV)
  bestStreak: number;
  totalAnswered: number;
  totalHits: number;
  lastUpdated: string;
}



export interface ExtendedSessionState extends QuizSessionState {
  evaluation: EvaluationResult | null;
}

export function calculateQuizAccuracy(hits: number, misses: number): number {
  const total = hits + misses;
  return total > 0 ? Math.round((hits / total) * 100) : 100;
}

export function loadPersistedMetrics(): PersistedQuizMetrics {
  return typedStorage.get<PersistedQuizMetrics>(STORAGE_KEY, {
    ownerId: null,
    bestStreak: 0,
    totalAnswered: 0,
    totalHits: 0,
    lastUpdated: new Date().toISOString(),
  });
}

export function saveMetrics(hitsDelta: number, missesDelta: number, currentBestStreak: number): void {
  const existing = loadPersistedMetrics();
  const updated: PersistedQuizMetrics = {
    ownerId: null,
    bestStreak: Math.max(existing.bestStreak, currentBestStreak),
    totalAnswered: existing.totalAnswered + hitsDelta + missesDelta,
    totalHits: existing.totalHits + hitsDelta,
    lastUpdated: new Date().toISOString(),
  };
  typedStorage.set(STORAGE_KEY, updated);
}

export function createInitialQuizSessionState(
  questions: Question[],
  filter?: QuestionFilter
): ExtendedSessionState {
  const matched = filterQuestions(questions, filter);
  const shuffled = shuffleQuestions(matched);

  const initialExcluded = new Set<string>();
  const { drawn, remainingPool, updatedExcludedFamilies } = drawNextEligible(
    shuffled,
    initialExcluded
  );

  const persisted = loadPersistedMetrics();
  const servedSet = new Set<string>();
  if (drawn) {
    servedSet.add(drawn.id);
  }

  return {
    filter: filter || {},
    candidatePool: remainingPool,
    activeQuestion: drawn,
    excludedFamilyIds: updatedExcludedFamilies,
    servedQuestionIds: servedSet,
    selectedOptionIds: [],
    evaluation: null,
    status: drawn ? 'IDLE' : 'SESSION_EXHAUSTED',
    stats: {
      hits: 0,
      misses: 0,
      currentStreak: 0,
      bestStreak: persisted.bestStreak,
      accuracy: 100,
      totalCompleted: 0,
    },
  };
}

export function quizSessionReducer(
  state: ExtendedSessionState,
  action: QuizSessionAction
): ExtendedSessionState {
  switch (action.type) {
    case 'INIT_SESSION': {
      return createInitialQuizSessionState(action.payload.questions, action.payload.filter);
    }

    case 'SELECT_OPTION': {
      if (
        state.status === 'EVALUATED_CORRECT' ||
        state.status === 'EVALUATED_INCORRECT' ||
        !state.activeQuestion
      ) {
        return state;
      }

      const { optionId } = action.payload;
      const isMulti = state.activeQuestion.type === 'multiple-choice';

      let newSelected: string[];
      if (isMulti) {
        newSelected = state.selectedOptionIds.includes(optionId)
          ? state.selectedOptionIds.filter((id) => id !== optionId)
          : [...state.selectedOptionIds, optionId];
      } else {
        newSelected = [optionId];
      }

      return {
        ...state,
        selectedOptionIds: newSelected,
        status: 'ANSWERING',
      };
    }

    case 'SUBMIT_ANSWER': {
      if (
        !state.activeQuestion ||
        state.selectedOptionIds.length === 0 ||
        state.status === 'EVALUATED_CORRECT' ||
        state.status === 'EVALUATED_INCORRECT'
      ) {
        return state;
      }

      const evalResult = evaluateAnswer(state.activeQuestion, state.selectedOptionIds);
      const isCorrect = evalResult.isCorrect;

      const newHits = isCorrect ? state.stats.hits + 1 : state.stats.hits;
      const newMisses = isCorrect ? state.stats.misses : state.stats.misses + 1;
      const newCurrentStreak = isCorrect ? state.stats.currentStreak + 1 : 0;
      const newBestStreak = Math.max(state.stats.bestStreak, newCurrentStreak);
      const newAccuracy = calculateQuizAccuracy(newHits, newMisses);

      saveMetrics(isCorrect ? 1 : 0, isCorrect ? 0 : 1, newBestStreak);

      return {
        ...state,
        evaluation: evalResult,
        status: isCorrect ? 'EVALUATED_CORRECT' : 'EVALUATED_INCORRECT',
        stats: {
          ...state.stats,
          hits: newHits,
          misses: newMisses,
          currentStreak: newCurrentStreak,
          bestStreak: newBestStreak,
          accuracy: newAccuracy,
          totalCompleted: state.stats.totalCompleted + 1,
        },
      };
    }

    case 'NEXT_QUESTION': {
      const { drawn, remainingPool, updatedExcludedFamilies } = drawNextEligible(
        state.candidatePool,
        state.excludedFamilyIds
      );

      const nextServed = new Set(state.servedQuestionIds);
      if (drawn) {
        nextServed.add(drawn.id);
      }

      return {
        ...state,
        candidatePool: remainingPool,
        activeQuestion: drawn,
        excludedFamilyIds: updatedExcludedFamilies,
        servedQuestionIds: nextServed,
        selectedOptionIds: [],
        evaluation: null,
        status: drawn ? 'IDLE' : 'SESSION_EXHAUSTED',
      };
    }

    case 'RESET_SESSION': {
      // Re-trigger INIT_SESSION with existing filter and served pool
      const fullPool = [...state.candidatePool];
      if (state.activeQuestion) {
        fullPool.push(state.activeQuestion);
      }
      return quizSessionReducer(state, {
        type: 'INIT_SESSION',
        payload: { questions: fullPool, filter: state.filter },
      });
    }

    default:
      return state;
  }
}

export function useQuizSession(questions: Question[], filter?: QuestionFilter) {
  const initialState = useMemo(() => {
    return createInitialQuizSessionState(questions, filter);
  }, [questions, filter]);

  const [state, dispatch] = useReducer(quizSessionReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'INIT_SESSION', payload: { questions, filter } });
  }, [questions, filter]);

  const selectOption = useCallback((optionId: string) => {
    dispatch({ type: 'SELECT_OPTION', payload: { optionId } });
  }, []);

  const submitAnswer = useCallback(() => {
    dispatch({ type: 'SUBMIT_ANSWER' });
  }, []);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  const resetSession = useCallback(() => {
    dispatch({ type: 'RESET_SESSION' });
  }, []);

  return {
    state,
    selectOption,
    submitAnswer,
    nextQuestion,
    resetSession,
  };
}
