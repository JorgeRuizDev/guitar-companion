import { describe, it, expect } from 'vitest';
import {
  CHORD_CATALOG,
  getChordById,
  getChordBySymbol,
  CHORD_PRESETS,
} from '@/apps/basic-chord-trainer/domain/chordCatalog';

describe('Chord Catalog Integrity & Theory', () => {
  it('contains exactly 22 beginner open chords in the catalog', () => {
    expect(CHORD_CATALOG).toHaveLength(22);
  });

  it('guarantees unique IDs and unique symbols for all catalog chords', () => {
    const ids = new Set<string>();
    const symbols = new Set<string>();

    for (const chord of CHORD_CATALOG) {
      expect(ids.has(chord.id)).toBe(false);
      expect(symbols.has(chord.symbol.toLowerCase())).toBe(false);
      ids.add(chord.id);
      symbols.add(chord.symbol.toLowerCase());
    }
  });

  it('provides dual notation (symbol and solfegeName) for every chord', () => {
    for (const chord of CHORD_CATALOG) {
      expect(chord.symbol.trim().length).toBeGreaterThan(0);
      expect(chord.solfegeName.trim().length).toBeGreaterThan(0);
      expect(chord.description?.en).toBeDefined();
      expect(chord.description?.es).toBeDefined();
    }
  });

  it('contains exactly 6 strings ordered from 6 (low E) down to 1 (high E) for every chord', () => {
    for (const chord of CHORD_CATALOG) {
      expect(chord.strings).toHaveLength(6);
      expect(chord.strings[0].stringNumber).toBe(6);
      expect(chord.strings[1].stringNumber).toBe(5);
      expect(chord.strings[2].stringNumber).toBe(4);
      expect(chord.strings[3].stringNumber).toBe(3);
      expect(chord.strings[4].stringNumber).toBe(2);
      expect(chord.strings[5].stringNumber).toBe(1);

      // Validate string states and frets
      for (const str of chord.strings) {
        if (str.state === 'fretted') {
          expect(str.fret).toBeGreaterThanOrEqual(1);
          expect(str.fret).toBeLessThanOrEqual(4);
          expect([1, 2, 3, 4]).toContain(str.finger);
        } else if (str.state === 'open') {
          expect(str.fret).toBe(0);
        } else if (str.state === 'muted') {
          expect(str.fret).toBeNull();
        }
      }

      // Root string must be 4, 5, or 6
      expect([4, 5, 6]).toContain(chord.rootString);
    }
  });

  it('retrieves chords correctly by id and by symbol', () => {
    const cMajor = getChordById('c-major');
    expect(cMajor).toBeDefined();
    expect(cMajor?.symbol).toBe('C');
    expect(cMajor?.solfegeName).toBe('Do Mayor');

    const amChord = getChordBySymbol('Am');
    expect(amChord).toBeDefined();
    expect(amChord?.id).toBe('a-minor');

    const caseInsensitive = getChordBySymbol('cadd9');
    expect(caseInsensitive).toBeDefined();
    expect(caseInsensitive?.symbol).toBe('Cadd9');

    expect(getChordById('non-existent')).toBeUndefined();
    expect(getChordBySymbol('XYZ')).toBeUndefined();
  });

  it('provides predefined practice presets with valid chord symbols', () => {
    expect(CHORD_PRESETS.length).toBeGreaterThanOrEqual(4);
    for (const preset of CHORD_PRESETS) {
      expect(preset.chordSymbols.length).toBeGreaterThan(0);
      for (const symbol of preset.chordSymbols) {
        const chord = getChordBySymbol(symbol);
        expect(chord).toBeDefined();
      }
    }
  });
});
