import { describe, it, expect } from 'vitest';
import {
  createDefaultUserFretboardState,
  toggleFretDot,
  toggleNutState,
  evaluateFretboard,
} from '@/apps/basic-chord-trainer/domain/fretboardEvaluator';
import { getChordBySymbol } from '@/apps/basic-chord-trainer/domain/chordCatalog';
import { UserFretboardState } from '@/apps/basic-chord-trainer/types';

describe('Fretboard State & Evaluator Logic', () => {
  it('initializes default user fretboard with 6 open strings', () => {
    const defaultState = createDefaultUserFretboardState();
    expect(defaultState).toHaveLength(6);
    for (let i = 0; i < 6; i++) {
      expect(defaultState[i].stringNumber).toBe(6 - i);
      expect(defaultState[i].state).toBe('open');
      expect(defaultState[i].fret).toBe(0);
    }
  });

  it('toggles fret dots accurately and clears muted state when dot is placed', () => {
    let state = createDefaultUserFretboardState();

    // Place dot on string 2 fret 1
    state = toggleFretDot(state, 2, 1);
    const str2 = state.find((s) => s.stringNumber === 2);
    expect(str2?.state).toBe('fretted');
    expect(str2?.fret).toBe(1);

    // Toggle same dot removes it
    state = toggleFretDot(state, 2, 1);
    const str2Toggled = state.find((s) => s.stringNumber === 2);
    expect(str2Toggled?.state).toBe('open');
    expect(str2Toggled?.fret).toBe(0);

    // Mute string 5, then place dot on fret 3 -> muted must clear
    state = toggleNutState(state, 5);
    expect(state.find((s) => s.stringNumber === 5)?.state).toBe('muted');

    state = toggleFretDot(state, 5, 3);
    const str5 = state.find((s) => s.stringNumber === 5);
    expect(str5?.state).toBe('fretted');
    expect(str5?.fret).toBe(3);
  });

  it('toggles nut indicators between open and muted and clears fret dots when muted', () => {
    let state = createDefaultUserFretboardState();

    // String 6 starts open -> toggle to muted
    state = toggleNutState(state, 6);
    expect(state.find((s) => s.stringNumber === 6)?.state).toBe('muted');
    expect(state.find((s) => s.stringNumber === 6)?.fret).toBeNull();

    // Toggle again -> back to open
    state = toggleNutState(state, 6);
    expect(state.find((s) => s.stringNumber === 6)?.state).toBe('open');
    expect(state.find((s) => s.stringNumber === 6)?.fret).toBe(0);

    // Place dot on string 3 fret 2, then tap nut toggle to mute -> dot removed
    state = toggleFretDot(state, 3, 2);
    expect(state.find((s) => s.stringNumber === 3)?.state).toBe('fretted');
    state = toggleNutState(state, 3);
    expect(state.find((s) => s.stringNumber === 3)?.state).toBe('muted');
    expect(state.find((s) => s.stringNumber === 3)?.fret).toBeNull();
  });

  it('evaluates exact match for C major as correct', () => {
    const cChord = getChordBySymbol('C')!;
    expect(cChord).toBeDefined();

    // C Major is: String 6: X, String 5: fret 3, String 4: fret 2, String 3: open, String 2: fret 1, String 1: open
    let state = createDefaultUserFretboardState();
    state = toggleNutState(state, 6); // Mute string 6
    state = toggleFretDot(state, 5, 3); // String 5 fret 3
    state = toggleFretDot(state, 4, 2); // String 4 fret 2
    state = toggleFretDot(state, 2, 1); // String 2 fret 1

    const evaluation = evaluateFretboard(state, cChord);
    expect(evaluation.isCorrect).toBe(true);
    expect(evaluation.stringResults?.every((r) => r.isCorrect)).toBe(true);
    expect(evaluation.explanation.en).toContain('accurately fingered C');
    expect(evaluation.explanation.es).toContain('Has digitado con precisión C');
  });

  it('detects mismatch when a required muted string is left open', () => {
    const cChord = getChordBySymbol('C')!;
    let state = createDefaultUserFretboardState();
    // Do NOT mute string 6 (leave open)
    state = toggleFretDot(state, 5, 3);
    state = toggleFretDot(state, 4, 2);
    state = toggleFretDot(state, 2, 1);

    const evaluation = evaluateFretboard(state, cChord);
    expect(evaluation.isCorrect).toBe(false);
    const str6Result = evaluation.stringResults?.find((r) => r.stringNumber === 6);
    expect(str6Result?.isCorrect).toBe(false);
    expect(str6Result?.expectedState).toBe('muted');
    expect(str6Result?.actualState).toBe('open');
  });

  it('detects mismatch when a finger is placed on the wrong fret', () => {
    const emChord = getChordBySymbol('Em')!;
    // Em is: 0 2 2 0 0 0 (strings 5 and 4 fretted at 2)
    let state = createDefaultUserFretboardState();
    state = toggleFretDot(state, 5, 3); // Wrong fret (3 instead of 2)
    state = toggleFretDot(state, 4, 2);

    const evaluation = evaluateFretboard(state, emChord);
    expect(evaluation.isCorrect).toBe(false);
    const str5Result = evaluation.stringResults?.find((r) => r.stringNumber === 5);
    expect(str5Result?.isCorrect).toBe(false);
    expect(str5Result?.expectedFret).toBe(2);
    expect(str5Result?.actualFret).toBe(3);
  });
});
