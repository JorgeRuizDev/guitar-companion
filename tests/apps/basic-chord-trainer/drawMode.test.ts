import { describe, it, expect } from 'vitest';
import {
  createDefaultUserFretboardState,
  toggleFretDot,
  toggleNutState,
  evaluateFretboard,
  chordDefinitionToFretboardState,
} from '@/apps/basic-chord-trainer/domain/fretboardEvaluator';
import { getChordBySymbol } from '@/apps/basic-chord-trainer/domain/chordCatalog';

describe('User Story 2: "Draw the Chord" Mode Interactions & Mechanics', () => {
  it('handles multi-finger placement for open C major and validates correctly', () => {
    const cChord = getChordBySymbol('C')!;
    let state = createDefaultUserFretboardState();

    // 1. Mute string 6
    state = toggleNutState(state, 6);
    expect(state.find((s) => s.stringNumber === 6)?.state).toBe('muted');

    // 2. Fret string 5 at fret 3
    state = toggleFretDot(state, 5, 3);
    // 3. Fret string 4 at fret 2
    state = toggleFretDot(state, 4, 2);
    // 4. Fret string 2 at fret 1
    state = toggleFretDot(state, 2, 1);

    // Verify strings 1 and 3 remain open
    expect(state.find((s) => s.stringNumber === 1)?.state).toBe('open');
    expect(state.find((s) => s.stringNumber === 3)?.state).toBe('open');

    const result = evaluateFretboard(state, cChord);
    expect(result.isCorrect).toBe(true);
    expect(result.stringResults).toHaveLength(6);
    expect(result.stringResults?.every((s) => s.isCorrect)).toBe(true);
  });

  it('correctly reports error diff when user forgets to mute string 6 or misplaces fret', () => {
    const cChord = getChordBySymbol('C')!;
    let state = createDefaultUserFretboardState();

    // Leave string 6 open instead of muted
    state = toggleFretDot(state, 5, 3);
    state = toggleFretDot(state, 4, 2);
    // Put finger on string 2 fret 2 instead of fret 1
    state = toggleFretDot(state, 2, 2);

    const result = evaluateFretboard(state, cChord);
    expect(result.isCorrect).toBe(false);

    const str6Result = result.stringResults?.find((s) => s.stringNumber === 6);
    expect(str6Result?.isCorrect).toBe(false);
    expect(str6Result?.expectedState).toBe('muted');
    expect(str6Result?.actualState).toBe('open');

    const str2Result = result.stringResults?.find((s) => s.stringNumber === 2);
    expect(str2Result?.isCorrect).toBe(false);
    expect(str2Result?.expectedFret).toBe(1);
    expect(str2Result?.actualFret).toBe(2);
  });

  it('reveals exact solution state upon skip action', () => {
    const dChord = getChordBySymbol('D')!;
    const solutionState = chordDefinitionToFretboardState(dChord);

    expect(solutionState).toHaveLength(6);
    expect(solutionState.find((s) => s.stringNumber === 6)?.state).toBe('muted');
    expect(solutionState.find((s) => s.stringNumber === 5)?.state).toBe('muted');
    expect(solutionState.find((s) => s.stringNumber === 4)?.state).toBe('open');
    expect(solutionState.find((s) => s.stringNumber === 3)?.fret).toBe(2);
    expect(solutionState.find((s) => s.stringNumber === 2)?.fret).toBe(3);
    expect(solutionState.find((s) => s.stringNumber === 1)?.fret).toBe(2);

    // When evaluated, the solution state matches 100%
    const check = evaluateFretboard(solutionState, dChord);
    expect(check.isCorrect).toBe(true);
  });

  it('clears dots automatically when nut is toggled to muted', () => {
    let state = createDefaultUserFretboardState();
    state = toggleFretDot(state, 4, 2);
    expect(state.find((s) => s.stringNumber === 4)?.state).toBe('fretted');
    expect(state.find((s) => s.stringNumber === 4)?.fret).toBe(2);

    // Muting string 4 clears fret dot
    state = toggleNutState(state, 4);
    expect(state.find((s) => s.stringNumber === 4)?.state).toBe('muted');
    expect(state.find((s) => s.stringNumber === 4)?.fret).toBeNull();
  });
});
