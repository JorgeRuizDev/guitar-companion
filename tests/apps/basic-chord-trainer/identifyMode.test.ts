import { describe, it, expect } from 'vitest';
import {
  generateIdentifyChallenge,
  generateNextChallenge,
} from '@/apps/basic-chord-trainer/domain/challengeGenerator';
import { CHORD_CATALOG, getChordBySymbol } from '@/apps/basic-chord-trainer/domain/chordCatalog';
import { formatDualNotation } from '@/apps/basic-chord-trainer/domain/dualNotation';

describe('User Story 3: "Identify the Chord" Mode & Challenge Generation', () => {
  it('generates an Identify challenge with exactly 4 unique options including the target', () => {
    const target = getChordBySymbol('Am')!;
    const challenge = generateIdentifyChallenge(target, CHORD_CATALOG);

    expect(challenge.type).toBe('identify');
    expect(challenge.targetChord.id).toBe('a-minor');
    expect(challenge.options).toBeDefined();
    expect(challenge.options).toHaveLength(4);

    // Target must be present in options
    const targetOption = challenge.options?.find((opt) => opt.id === target.id);
    expect(targetOption).toBeDefined();

    // All 4 options must have unique IDs
    const optionIds = new Set(challenge.options?.map((opt) => opt.id));
    expect(optionIds.size).toBe(4);
  });

  it('formats every multiple-choice option in dual notation without omitting either system', () => {
    const target = getChordBySymbol('C')!;
    const challenge = generateIdentifyChallenge(target, CHORD_CATALOG);

    for (const option of challenge.options!) {
      const dualText = formatDualNotation(option);
      expect(dualText).toContain(option.symbol);
      expect(dualText).toContain(option.solfegeName);
    }
  });

  it('shuffles the position of the target chord across multiple generations', () => {
    const target = getChordBySymbol('G')!;
    const positions = new Set<number>();

    for (let i = 0; i < 30; i++) {
      const challenge = generateIdentifyChallenge(target, CHORD_CATALOG);
      const index = challenge.options?.findIndex((opt) => opt.id === target.id);
      expect(index).toBeGreaterThanOrEqual(0);
      positions.add(index!);
    }

    // Over 30 generations, the target should appear in more than 1 slot
    expect(positions.size).toBeGreaterThan(1);
  });

  it('handles small chord pools gracefully by drawing distractors from full catalog', () => {
    // Only 2 chords in pool
    const smallPool = [getChordBySymbol('C')!, getChordBySymbol('D')!];
    const challenge = generateIdentifyChallenge(smallPool[0], smallPool);

    expect(challenge.options).toHaveLength(4);
    const optionIds = new Set(challenge.options?.map((opt) => opt.id));
    expect(optionIds.size).toBe(4);
  });
});
