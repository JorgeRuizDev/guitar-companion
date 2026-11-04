/**
 * Practice Challenge Generator for Draw and Identify Modes
 * @module apps/basic-chord-trainer/domain/challengeGenerator
 */

import {
  ChallengeNotation,
  ChallengeType,
  ChordDefinition,
  PracticeChallenge,
  PracticeMode,
} from '../types';
import { CHORD_CATALOG } from './chordCatalog';

/**
 * Generates an "Identify the Chord" challenge with exactly 4 unique options including the target.
 */
export function generateIdentifyChallenge(
  targetChord: ChordDefinition,
  chordPool: ChordDefinition[] = CHORD_CATALOG,
  notation?: ChallengeNotation
): PracticeChallenge {
  // Pool to pick distractors from
  const candidatePool =
    chordPool.length >= 4 ? chordPool : CHORD_CATALOG;

  // Filter out the target chord
  const otherChords = candidatePool.filter((c) => c.id !== targetChord.id);

  // Randomly shuffle other chords to select 3 distinct distractors
  const shuffledOthers = [...otherChords].sort(() => Math.random() - 0.5);
  const distractors = shuffledOthers.slice(0, 3);

  // Combine target with 3 distractors and shuffle positions
  const options = [targetChord, ...distractors].sort(
    () => Math.random() - 0.5
  ) as [ChordDefinition, ChordDefinition, ChordDefinition, ChordDefinition];

  const chosenNotation = notation ?? (Math.random() < 0.5 ? 'letters' : 'solfege');

  return {
    id: `identify-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: 'identify',
    notation: chosenNotation,
    familyId: `family-chord-${targetChord.id}`,
    targetChord,
    options,
  };
}

/**
 * Generates a "Draw the Chord" challenge for the given target chord.
 */
export function generateDrawChallenge(
  targetChord: ChordDefinition,
  notation?: ChallengeNotation
): PracticeChallenge {
  const chosenNotation = notation ?? (Math.random() < 0.5 ? 'letters' : 'solfege');

  return {
    id: `draw-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: 'draw',
    notation: chosenNotation,
    familyId: `family-chord-${targetChord.id}`,
    targetChord,
  };
}

/**
 * Generates the next challenge according to practice mode ('alternate', 'draw', 'identify')
 * and an optional chord pool. Avoids repeating recently seen chord families if pool size > 1.
 */
export function generateNextChallenge(
  mode: PracticeMode = 'alternate',
  lastChallengeType?: ChallengeType,
  chordPool: ChordDefinition[] = CHORD_CATALOG,
  avoidChordId?: string | string[],
  notation?: ChallengeNotation
): PracticeChallenge {
  const pool = chordPool.length > 0 ? chordPool : CHORD_CATALOG;
  const avoidList = Array.isArray(avoidChordId)
    ? avoidChordId
    : avoidChordId
    ? [avoidChordId]
    : [];

  // Pick target chord avoiding repetition if possible
  const eligibleChords =
    pool.length > avoidList.length
      ? pool.filter((c) => !avoidList.includes(c.id))
      : pool.length > 1 && avoidList.length > 0
      ? pool.filter((c) => c.id !== avoidList[0])
      : pool;

  const targetChord =
    eligibleChords[Math.floor(Math.random() * eligibleChords.length)] ||
    pool[0];

  let nextType: ChallengeType;

  if (mode === 'draw') {
    nextType = 'draw';
  } else if (mode === 'identify') {
    nextType = 'identify';
  } else {
    // Mode is 'alternate': default starts with draw, then flips
    nextType = lastChallengeType === 'draw' ? 'identify' : 'draw';
  }

  const chosenNotation = notation ?? (Math.random() < 0.5 ? 'letters' : 'solfege');

  if (nextType === 'identify') {
    return generateIdentifyChallenge(targetChord, pool, chosenNotation);
  }

  return generateDrawChallenge(targetChord, chosenNotation);
}
