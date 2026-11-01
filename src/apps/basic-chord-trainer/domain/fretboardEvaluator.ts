/**
 * Fretboard Verification and Diff Evaluator
 * @module apps/basic-chord-trainer/domain/fretboardEvaluator
 */

import {
  ChordDefinition,
  ChordStringDefinition,
  ChallengeEvaluation,
  StringNumber,
  StringVerificationResult,
  UserFretboardState,
  UserStringFretting,
} from '../types';

/**
 * Creates a clean user fretboard state where all 6 strings start in the 'open' state.
 */
export function createDefaultUserFretboardState(): UserFretboardState {
  return [
    { stringNumber: 6, state: 'open', fret: 0 },
    { stringNumber: 5, state: 'open', fret: 0 },
    { stringNumber: 4, state: 'open', fret: 0 },
    { stringNumber: 3, state: 'open', fret: 0 },
    { stringNumber: 2, state: 'open', fret: 0 },
    { stringNumber: 1, state: 'open', fret: 0 },
  ];
}

/**
 * Toggles a fret dot on a specific string:
 * - If the string already has a dot at `fret`, removes the dot (reverts to 'open').
 * - If the string has a dot at another fret or is muted/open, moves the dot to `fret` (state becomes 'fretted').
 * Setting a dot automatically clears any 'muted' state.
 */
export function toggleFretDot(
  current: UserFretboardState,
  stringNumber: StringNumber,
  fret: number
): UserFretboardState {
  return current.map((str) => {
    if (str.stringNumber !== stringNumber) return str;

    if (str.state === 'fretted' && str.fret === fret) {
      // Toggle off: revert to open
      return { stringNumber, state: 'open' as const, fret: 0 };
    }

    // Place or move dot
    return { stringNumber, state: 'fretted' as const, fret };
  }) as UserFretboardState;
}

/**
 * Toggles the nut indicator between Open ('O') and Muted ('X'):
 * - If currently 'open' (or 'fretted'), switches to 'muted' and clears any dot.
 * - If currently 'muted', switches to 'open' (fret: 0).
 */
export function toggleNutState(
  current: UserFretboardState,
  stringNumber: StringNumber
): UserFretboardState {
  return current.map((str) => {
    if (str.stringNumber !== stringNumber) return str;

    if (str.state === 'muted') {
      return { stringNumber, state: 'open' as const, fret: 0 };
    }

    // If open or fretted, switch to muted and remove any fret dot
    return { stringNumber, state: 'muted' as const, fret: null };
  }) as UserFretboardState;
}

/**
 * Evaluates a user fretboard submission against a target chord definition.
 * Generates string-by-string verification diff and bilingual explanations.
 */
export function evaluateFretboard(
  userState: UserFretboardState,
  targetChord: ChordDefinition
): ChallengeEvaluation {
  const stringResults: StringVerificationResult[] = [];
  let isAllCorrect = true;

  // Strings are ordered 6 down to 1
  for (let i = 0; i < 6; i++) {
    const userStr = userState[i];
    const expectedStr = targetChord.strings[i];

    let isMatch = false;

    if (expectedStr.state === 'fretted') {
      isMatch = userStr.state === 'fretted' && userStr.fret === expectedStr.fret;
    } else if (expectedStr.state === 'open') {
      isMatch = userStr.state === 'open' && (userStr.fret === 0 || userStr.fret === null);
    } else if (expectedStr.state === 'muted') {
      isMatch = userStr.state === 'muted';
    }

    if (!isMatch) {
      isAllCorrect = false;
    }

    stringResults.push({
      stringNumber: expectedStr.stringNumber,
      isCorrect: isMatch,
      expectedState: expectedStr.state,
      expectedFret: expectedStr.fret,
      actualState: userStr.state,
      actualFret: userStr.fret,
    });
  }

  // Generate localized explanation
  let explanationEn: string;
  let explanationEs: string;

  if (isAllCorrect) {
    explanationEn = `Perfect! You accurately fingered ${targetChord.symbol} (${targetChord.solfegeName}).`;
    explanationEs = `¡Perfecto! Has digitado con precisión ${targetChord.symbol} (${targetChord.solfegeName}).`;
  } else {
    const incorrectStrings = stringResults
      .filter((r) => !r.isCorrect)
      .map((r) => `String ${r.stringNumber}`)
      .join(', ');
    const incorrectStringsEs = stringResults
      .filter((r) => !r.isCorrect)
      .map((r) => `Cuerda ${r.stringNumber}`)
      .join(', ');

    explanationEn = `Discrepancy found on: ${incorrectStrings}. Check the correct diagram and fingerings.`;
    explanationEs = `Discrepancia en: ${incorrectStringsEs}. Revisa el diagrama y la digitación correcta.`;
  }

  return {
    isCorrect: isAllCorrect,
    stringResults,
    explanation: {
      en: explanationEn,
      es: explanationEs,
    },
  };
}

/**
 * Converts a target chord definition to an expected UserFretboardState for solution rendering
 */
export function chordDefinitionToFretboardState(chord: ChordDefinition): UserFretboardState {
  return chord.strings.map((str: ChordStringDefinition) => ({
    stringNumber: str.stringNumber,
    state: str.state,
    fret: str.fret,
  })) as UserFretboardState;
}
