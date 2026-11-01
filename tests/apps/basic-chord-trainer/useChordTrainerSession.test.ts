import { describe, it, expect } from 'vitest';
import {
  calculateChordAccuracy,
  createInitialChordSessionState,
  chordTrainerSessionReducer,
} from '@/apps/basic-chord-trainer/hooks/useChordTrainerSession';
import { getChordBySymbol } from '@/apps/basic-chord-trainer/domain/chordCatalog';

describe('User Story 4: Chord Trainer Session State Machine & Alternation', () => {
  it('accurately computes accuracy percentage', () => {
    expect(calculateChordAccuracy(0, 0)).toBe(100);
    expect(calculateChordAccuracy(10, 0)).toBe(100);
    expect(calculateChordAccuracy(1, 1)).toBe(50);
    expect(calculateChordAccuracy(3, 1)).toBe(75);
    expect(calculateChordAccuracy(0, 5)).toBe(0);
  });

  it('alternates between Draw and Identify challenges when mode is alternate', () => {
    // Initial challenge in alternate mode is Draw
    const state0 = createInitialChordSessionState({ mode: 'alternate', embed: false });
    expect(state0.challenge.type).toBe('draw');

    // Skip Card 1 to advance
    const state1Eval = chordTrainerSessionReducer(state0, { type: 'SKIP_CHALLENGE' });
    expect(state1Eval.status).toBe('SKIPPED');

    const state2 = chordTrainerSessionReducer(state1Eval, { type: 'NEXT_CHALLENGE' });
    expect(state2.challenge.type).toBe('identify');

    // Answer Card 2 to advance
    const targetChord = state2.challenge.targetChord;
    const state2Eval = chordTrainerSessionReducer(state2, {
      type: 'SELECT_IDENTIFY_OPTION',
      chord: targetChord,
    });
    expect(state2Eval.status).toBe('EVALUATED_CORRECT');

    const state3 = chordTrainerSessionReducer(state2Eval, { type: 'NEXT_CHALLENGE' });
    expect(state3.challenge.type).toBe('draw');
  });

  it('enforces mode overrides: draw-only mode always serves draw cards', () => {
    const state0 = createInitialChordSessionState({ mode: 'draw', embed: false });
    expect(state0.challenge.type).toBe('draw');

    const state1 = chordTrainerSessionReducer(
      chordTrainerSessionReducer(state0, { type: 'SKIP_CHALLENGE' }),
      { type: 'NEXT_CHALLENGE' }
    );
    expect(state1.challenge.type).toBe('draw');
  });

  it('enforces mode overrides: identify-only mode always serves identify cards', () => {
    const state0 = createInitialChordSessionState({ mode: 'identify', embed: false });
    expect(state0.challenge.type).toBe('identify');

    const state1 = chordTrainerSessionReducer(
      chordTrainerSessionReducer(state0, {
        type: 'SELECT_IDENTIFY_OPTION',
        chord: state0.challenge.targetChord,
      }),
      { type: 'NEXT_CHALLENGE' }
    );
    expect(state1.challenge.type).toBe('identify');
  });

  it('accurately updates session metrics on hits, misses, and skips', () => {
    let state = createInitialChordSessionState({ mode: 'identify', embed: false });
    expect(state.metrics.hits).toBe(0);
    expect(state.metrics.misses).toBe(0);
    expect(state.metrics.skipped).toBe(0);
    expect(state.metrics.currentStreak).toBe(0);
    expect(state.metrics.bestStreak).toBe(0);

    // Hit 1
    state = chordTrainerSessionReducer(state, {
      type: 'SELECT_IDENTIFY_OPTION',
      chord: state.challenge.targetChord,
    });
    expect(state.metrics.hits).toBe(1);
    expect(state.metrics.currentStreak).toBe(1);
    expect(state.metrics.bestStreak).toBe(1);
    expect(state.metrics.accuracy).toBe(100);

    // Next card
    state = chordTrainerSessionReducer(state, { type: 'NEXT_CHALLENGE' });

    // Hit 2
    state = chordTrainerSessionReducer(state, {
      type: 'SELECT_IDENTIFY_OPTION',
      chord: state.challenge.targetChord,
    });
    expect(state.metrics.hits).toBe(2);
    expect(state.metrics.currentStreak).toBe(2);
    expect(state.metrics.bestStreak).toBe(2);

    // Next card
    state = chordTrainerSessionReducer(state, { type: 'NEXT_CHALLENGE' });

    // Miss (pick wrong chord)
    const wrongChord =
      state.challenge.options?.find((o) => o.id !== state.challenge.targetChord.id) ||
      getChordBySymbol('Am')!;
    state = chordTrainerSessionReducer(state, {
      type: 'SELECT_IDENTIFY_OPTION',
      chord: wrongChord,
    });
    expect(state.metrics.hits).toBe(2);
    expect(state.metrics.misses).toBe(1);
    expect(state.metrics.currentStreak).toBe(0); // streak reset
    expect(state.metrics.bestStreak).toBe(2); // best streak preserved
    expect(state.metrics.accuracy).toBe(67); // 2 / (2 + 1) * 100 = 67%
  });
});
