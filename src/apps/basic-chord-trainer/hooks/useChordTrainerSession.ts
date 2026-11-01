/**
 * State Machine and Session Hook for Basic Chord Trainer
 * Handles Draw and Identify flows, alternation, metrics, and state transitions.
 * @module apps/basic-chord-trainer/hooks/useChordTrainerSession
 */

import { useReducer, useEffect, useCallback, useMemo } from 'react';
import {
  ChallengeEvaluation,
  ChallengeStatus,
  ChordDefinition,
  PracticeChallenge,
  PracticeMode,
  SessionMetrics,
  StringNumber,
  TrainerConfig,
  UserFretboardState,
} from '../types';
import {
  CHORD_CATALOG,
  getChordBySymbol,
  getChordById,
} from '../domain/chordCatalog';
import {
  createDefaultUserFretboardState,
  toggleFretDot,
  toggleNutState,
  evaluateFretboard,
  chordDefinitionToFretboardState,
} from '../domain/fretboardEvaluator';
import {
  generateNextChallenge,
  generateDrawChallenge,
} from '../domain/challengeGenerator';

export function calculateChordAccuracy(hits: number, misses: number): number {
  const total = hits + misses;
  if (total === 0) return 100;
  return Math.round((hits / total) * 100);
}

export interface ChordTrainerSessionState {
  challenge: PracticeChallenge;
  userState: UserFretboardState;
  status: ChallengeStatus;
  selectedChordId: string | null;
  evaluation: ChallengeEvaluation | null;
  metrics: SessionMetrics;
  mode: PracticeMode;
  chordPool: ChordDefinition[];
}

export type ChordTrainerAction =
  | { type: 'TOGGLE_FRET'; stringNumber: StringNumber; fret: number }
  | { type: 'TOGGLE_NUT'; stringNumber: StringNumber }
  | { type: 'CHECK_ANSWER' }
  | { type: 'SKIP_CHALLENGE' }
  | { type: 'SELECT_IDENTIFY_OPTION'; chord: ChordDefinition }
  | { type: 'NEXT_CHALLENGE' }
  | { type: 'RESET_SESSION'; config?: Partial<TrainerConfig> }
  | { type: 'UPDATE_CONFIG'; config: Partial<TrainerConfig> };

export function resolveChordPool(chordFilter?: string[]): ChordDefinition[] {
  if (!chordFilter || chordFilter.length === 0) {
    return CHORD_CATALOG;
  }

  const resolved = chordFilter
    .map((item) => getChordBySymbol(item) || getChordById(item))
    .filter((c): c is ChordDefinition => Boolean(c));

  return resolved.length > 0 ? resolved : CHORD_CATALOG;
}

export function createInitialChordSessionState(
  config?: Partial<TrainerConfig>
): ChordTrainerSessionState {
  const mode: PracticeMode = config?.mode || 'alternate';
  const chordPool = resolveChordPool(config?.chords);

  // Initial card: if mode is identify, start with identify; otherwise start with draw
  const initialType = mode === 'identify' ? 'identify' : 'draw';
  const targetChord = chordPool[Math.floor(Math.random() * chordPool.length)] || chordPool[0];

  const challenge: PracticeChallenge =
    initialType === 'draw'
      ? generateDrawChallenge(targetChord)
      : generateNextChallenge('identify', undefined, chordPool);

  return {
    challenge,
    userState: createDefaultUserFretboardState(),
    status: 'PENDING',
    selectedChordId: null,
    evaluation: null,
    metrics: {
      hits: 0,
      misses: 0,
      skipped: 0,
      currentStreak: 0,
      bestStreak: 0,
      accuracy: 100,
      totalCompleted: 0,
    },
    mode,
    chordPool,
  };
}

export function chordTrainerSessionReducer(
  state: ChordTrainerSessionState,
  action: ChordTrainerAction
): ChordTrainerSessionState {
  switch (action.type) {
    case 'TOGGLE_FRET': {
      if (state.status !== 'PENDING' || state.challenge.type !== 'draw') {
        return state;
      }
      return {
        ...state,
        userState: toggleFretDot(state.userState, action.stringNumber, action.fret),
      };
    }

    case 'TOGGLE_NUT': {
      if (state.status !== 'PENDING' || state.challenge.type !== 'draw') {
        return state;
      }
      return {
        ...state,
        userState: toggleNutState(state.userState, action.stringNumber),
      };
    }

    case 'CHECK_ANSWER': {
      if (state.status !== 'PENDING' || state.challenge.type !== 'draw') {
        return state;
      }

      const evaluation = evaluateFretboard(state.userState, state.challenge.targetChord);
      const isCorrect = evaluation.isCorrect;

      const newHits = state.metrics.hits + (isCorrect ? 1 : 0);
      const newMisses = state.metrics.misses + (isCorrect ? 0 : 1);
      const newStreak = isCorrect ? state.metrics.currentStreak + 1 : 0;
      const newBestStreak = Math.max(state.metrics.bestStreak, newStreak);
      const newAccuracy = calculateChordAccuracy(newHits, newMisses);

      return {
        ...state,
        status: isCorrect ? 'EVALUATED_CORRECT' : 'EVALUATED_INCORRECT',
        evaluation,
        metrics: {
          ...state.metrics,
          hits: newHits,
          misses: newMisses,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          accuracy: newAccuracy,
          totalCompleted: state.metrics.totalCompleted + 1,
        },
      };
    }

    case 'SKIP_CHALLENGE': {
      if (state.status !== 'PENDING' || state.challenge.type !== 'draw') {
        return state;
      }

      // Reveal solution state
      const solutionState = chordDefinitionToFretboardState(state.challenge.targetChord);
      const evaluation: ChallengeEvaluation = {
        isCorrect: false,
        stringResults: [],
        explanation: {
          en: `Skipped. Correct shape for ${state.challenge.targetChord.symbol} (${state.challenge.targetChord.solfegeName}) is displayed above.`,
          es: `Saltado. La posición correcta de ${state.challenge.targetChord.symbol} (${state.challenge.targetChord.solfegeName}) se muestra arriba.`,
        },
      };

      return {
        ...state,
        status: 'SKIPPED',
        userState: solutionState,
        evaluation,
        metrics: {
          ...state.metrics,
          skipped: state.metrics.skipped + 1,
          currentStreak: 0,
          totalCompleted: state.metrics.totalCompleted + 1,
        },
      };
    }

    case 'SELECT_IDENTIFY_OPTION': {
      if (state.status !== 'PENDING' || state.challenge.type !== 'identify') {
        return state;
      }

      const isCorrect = action.chord.id === state.challenge.targetChord.id;
      const newHits = state.metrics.hits + (isCorrect ? 1 : 0);
      const newMisses = state.metrics.misses + (isCorrect ? 0 : 1);
      const newStreak = isCorrect ? state.metrics.currentStreak + 1 : 0;
      const newBestStreak = Math.max(state.metrics.bestStreak, newStreak);
      const newAccuracy = calculateChordAccuracy(newHits, newMisses);

      return {
        ...state,
        selectedChordId: action.chord.id,
        status: isCorrect ? 'EVALUATED_CORRECT' : 'EVALUATED_INCORRECT',
        metrics: {
          ...state.metrics,
          hits: newHits,
          misses: newMisses,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          accuracy: newAccuracy,
          totalCompleted: state.metrics.totalCompleted + 1,
        },
      };
    }

    case 'NEXT_CHALLENGE': {
      const nextChallenge = generateNextChallenge(
        state.mode,
        state.challenge.type,
        state.chordPool,
        state.challenge.targetChord.id
      );

      return {
        ...state,
        challenge: nextChallenge,
        userState: createDefaultUserFretboardState(),
        status: 'PENDING',
        selectedChordId: null,
        evaluation: null,
      };
    }

    case 'RESET_SESSION': {
      return createInitialChordSessionState(action.config || { mode: state.mode });
    }

    case 'UPDATE_CONFIG': {
      const newPool = action.config.chords
        ? resolveChordPool(action.config.chords)
        : state.chordPool;
      const newMode = action.config.mode || state.mode;

      const nextChallenge = generateNextChallenge(
        newMode,
        undefined,
        newPool
      );

      return {
        ...state,
        mode: newMode,
        chordPool: newPool,
        challenge: nextChallenge,
        userState: createDefaultUserFretboardState(),
        status: 'PENDING',
        selectedChordId: null,
        evaluation: null,
      };
    }

    default:
      return state;
  }
}

export function useChordTrainerSession(
  config?: Partial<TrainerConfig>,
  onAnswerEvaluated?: (data: {
    challengeId: string;
    mode: 'draw' | 'identify';
    chordSymbol: string;
    chordSolfege: string;
    isCorrect: boolean;
    isSkipped: boolean;
    sessionMetrics: SessionMetrics;
  }) => void,
  onProgressUpdate?: (data: SessionMetrics) => void
) {
  const [state, dispatch] = useReducer(
    chordTrainerSessionReducer,
    config,
    createInitialChordSessionState
  );

  // Dispatch events on evaluation or status changes
  useEffect(() => {
    if (state.status === 'PENDING') return;

    const isSkipped = state.status === 'SKIPPED';
    const isCorrect = state.status === 'EVALUATED_CORRECT';

    onAnswerEvaluated?.({
      challengeId: state.challenge.id,
      mode: state.challenge.type,
      chordSymbol: state.challenge.targetChord.symbol,
      chordSolfege: state.challenge.targetChord.solfegeName,
      isCorrect,
      isSkipped,
      sessionMetrics: state.metrics,
    });

    onProgressUpdate?.(state.metrics);
  }, [
    state.status,
    state.challenge.id,
    state.challenge.type,
    state.challenge.targetChord.symbol,
    state.challenge.targetChord.solfegeName,
    state.metrics,
    onAnswerEvaluated,
    onProgressUpdate,
  ]);

  const handleFretClick = useCallback(
    (stringNumber: StringNumber, fret: number) => {
      dispatch({ type: 'TOGGLE_FRET', stringNumber, fret });
    },
    []
  );

  const handleNutToggle = useCallback((stringNumber: StringNumber) => {
    dispatch({ type: 'TOGGLE_NUT', stringNumber });
  }, []);

  const handleCheck = useCallback(() => {
    dispatch({ type: 'CHECK_ANSWER' });
  }, []);

  const handleSkip = useCallback(() => {
    dispatch({ type: 'SKIP_CHALLENGE' });
  }, []);

  const handleSelectOption = useCallback((chord: ChordDefinition) => {
    dispatch({ type: 'SELECT_IDENTIFY_OPTION', chord });
  }, []);

  const handleNext = useCallback(() => {
    dispatch({ type: 'NEXT_CHALLENGE' });
  }, []);

  const resetSession = useCallback(
    (newConfig?: Partial<TrainerConfig>) => {
      dispatch({ type: 'RESET_SESSION', config: newConfig });
    },
    []
  );

  const updateConfig = useCallback((newConfig: Partial<TrainerConfig>) => {
    dispatch({ type: 'UPDATE_CONFIG', config: newConfig });
  }, []);

  return {
    state,
    challenge: state.challenge,
    userState: state.userState,
    status: state.status,
    selectedChordId: state.selectedChordId,
    evaluation: state.evaluation,
    metrics: state.metrics,
    mode: state.mode,
    handleFretClick,
    handleNutToggle,
    handleCheck,
    handleSkip,
    handleSelectOption,
    handleNext,
    resetSession,
    updateConfig,
  };
}
