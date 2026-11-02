import { describe, it, expect } from 'vitest';
import {
  formatDualNotation,
  formatPromptTitle,
  formatOptionLabel,
} from '@/apps/basic-chord-trainer/domain/dualNotation';
import { CHORD_CATALOG, getChordBySymbol } from '@/apps/basic-chord-trainer/domain/chordCatalog';

describe('Dual Notation Formatting (User Story 1)', () => {
  it('formats dual notation with both Anglo-Saxon symbol and Solfege name', () => {
    const cChord = getChordBySymbol('C')!;
    expect(formatDualNotation(cChord)).toBe('C (Do Mayor)');

    const amChord = getChordBySymbol('Am')!;
    expect(formatDualNotation(amChord)).toBe('Am (La menor)');

    const g7Chord = getChordBySymbol('G7')!;
    expect(formatDualNotation(g7Chord)).toBe('G7 (Sol 7ª)');

    const fmaj7Chord = getChordBySymbol('Fmaj7')!;
    expect(formatDualNotation(fmaj7Chord)).toBe('Fmaj7 (Fa maj7)');
  });

  it('guarantees that every catalog chord produces a valid dual notation label without omitting either system', () => {
    for (const chord of CHORD_CATALOG) {
      const dualLabel = formatDualNotation(chord);
      expect(dualLabel).toContain(chord.symbol);
      expect(dualLabel).toContain(chord.solfegeName);
      expect(dualLabel).toMatch(/^[A-Za-z0-9#♭]+\s+\([^)]+\)$/);
      expect(formatOptionLabel(chord)).toBe(dualLabel);
    }
  });

  it('formats challenge prompts correctly in both English and Spanish', () => {
    const dChord = getChordBySymbol('D')!;

    // Draw mode prompt in EN
    const drawPromptEn = formatPromptTitle(dChord, 'en', 'draw');
    expect(drawPromptEn.title).toBe('Draw the chord:');
    expect(drawPromptEn.subtitle).toBe('D (Re Mayor)');

    // Draw mode prompt in ES
    const drawPromptEs = formatPromptTitle(dChord, 'es', 'draw');
    expect(drawPromptEs.title).toBe('Dibuja el acorde:');
    expect(drawPromptEs.subtitle).toBe('D (Re Mayor)');

    // Identify mode prompt in EN
    const identifyPromptEn = formatPromptTitle(dChord, 'en', 'identify');
    expect(identifyPromptEn.title).toBe('Identify this chord shape:');

    // Identify mode prompt in ES
    const identifyPromptEs = formatPromptTitle(dChord, 'es', 'identify');
    expect(identifyPromptEs.title).toBe('Identifica la figura del acorde:');
  });
});
