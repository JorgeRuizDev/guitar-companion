import { describe, it, expect } from 'vitest';
import { getChordBySymbol } from '@/apps/basic-chord-trainer/domain/chordCatalog';
import {
  formatOptionLabel,
  formatPromptTitle,
} from '@/apps/basic-chord-trainer/domain/dualNotation';
import {
  generateDrawChallenge,
  generateIdentifyChallenge,
} from '@/apps/basic-chord-trainer/domain/challengeGenerator';

describe('Chord Trainer Segregated Notation Representation (No Combined Dual Text)', () => {
  const am = getChordBySymbol('Am')!;

  it('formats Draw challenge in solfege without combined parentheses', () => {
    const drawSolfege = generateDrawChallenge(am, 'solfege');
    const promptEs = formatPromptTitle(am, 'es', 'draw', drawSolfege.notation);
    const promptEn = formatPromptTitle(am, 'en', 'draw', drawSolfege.notation);

    expect(promptEs.title).toBe('Dibuja el acorde de:');
    expect(promptEs.subtitle).toBe('La menor');
    expect(promptEs.subtitle).not.toContain('(');

    expect(promptEn.title).toBe('Draw the chord:');
    expect(promptEn.subtitle).toBe('A minor');
    expect(promptEn.subtitle).not.toContain('(');
  });

  it('formats Draw challenge in letters without combined parentheses', () => {
    const drawLetters = generateDrawChallenge(am, 'letters');
    const promptEs = formatPromptTitle(am, 'es', 'draw', drawLetters.notation);
    const promptEn = formatPromptTitle(am, 'en', 'draw', drawLetters.notation);

    expect(promptEs.title).toBe('Dibuja el acorde de:');
    expect(promptEs.subtitle).toBe('Am');
    expect(promptEs.subtitle).not.toContain('(');

    expect(promptEn.title).toBe('Draw the chord:');
    expect(promptEn.subtitle).toBe('Am');
    expect(promptEn.subtitle).not.toContain('(');
  });

  it('formats Identify challenge in letters (Variante A) with Spanish A menor and English A minor', () => {
    const identifyLetters = generateIdentifyChallenge(am, undefined, 'letters');
    const promptEs = formatPromptTitle(am, 'es', 'identify', identifyLetters.notation);

    expect(promptEs.title).toBe('¿A qué acorde corresponde este dibujo?');

    const labelEs = formatOptionLabel(am, 'letters', 'es');
    const labelEn = formatOptionLabel(am, 'letters', 'en');

    expect(labelEs).toBe('A menor');
    expect(labelEn).toBe('A minor');
    expect(labelEs).not.toContain('(');
  });

  it('formats Identify challenge in solfege (Variante B) with La menor', () => {
    const identifySolfege = generateIdentifyChallenge(am, undefined, 'solfege');
    const promptEs = formatPromptTitle(am, 'es', 'identify', identifySolfege.notation);

    expect(promptEs.title).toBe('¿A qué acorde corresponde este dibujo?');

    const labelEs = formatOptionLabel(am, 'solfege', 'es');
    expect(labelEs).toBe('La menor');
    expect(labelEs).not.toContain('(');
  });

  it('shares the same familyId across Draw and Identify challenges for the same chord', () => {
    const drawChallenge = generateDrawChallenge(am, 'solfege');
    const identifyChallenge = generateIdentifyChallenge(am, undefined, 'letters');

    expect(drawChallenge.familyId).toBe('family-chord-a-minor');
    expect(identifyChallenge.familyId).toBe('family-chord-a-minor');
  });
});
