import { describe, it, expect } from 'vitest';
import {
  CHORD_CATALOG,
  CHORD_PRESETS,
  getChordBySymbol,
} from '@/apps/basic-chord-trainer/domain/chordCatalog';
import { generateEmbedUrl } from '@/apps/basic-chord-trainer/domain/queryParams';

describe('User Story 5: Catalog Presets & Embed Link Generation', () => {
  it('defines all required beginner presets with valid chords', () => {
    const presetIds = CHORD_PRESETS.map((p) => p.id);
    expect(presetIds).toContain('all');
    expect(presetIds).toContain('fundamental-trio');
    expect(presetIds).toContain('first-three');
    expect(presetIds).toContain('open-minors');
    expect(presetIds).toContain('open-7ths');

    const fundamental = CHORD_PRESETS.find((p) => p.id === 'fundamental-trio')!;
    expect(fundamental.chordSymbols).toEqual(['G', 'C', 'D']);

    const firstThree = CHORD_PRESETS.find((p) => p.id === 'first-three')!;
    expect(firstThree.chordSymbols).toEqual(['A', 'D', 'E']);

    const openMinors = CHORD_PRESETS.find((p) => p.id === 'open-minors')!;
    expect(openMinors.chordSymbols).toEqual(['Am', 'Dm', 'Em']);

    const open7ths = CHORD_PRESETS.find((p) => p.id === 'open-7ths')!;
    expect(open7ths.chordSymbols).toEqual(['C7', 'D7', 'E7', 'G7', 'A7', 'B7']);
  });

  it('generates standard practice embed links with proper parameters', () => {
    // Fundamental trio in draw mode for webview embed
    const url = generateEmbedUrl({
      chords: ['G', 'C', 'D'],
      mode: 'draw',
      embed: true,
      lang: 'es',
    });

    expect(url).toContain('/basic-chord-trainer/embed');
    expect(url).toContain('chords=G%2CC%2CD');
    expect(url).toContain('mode=draw');
    expect(url).toContain('lang=es');
  });

  it('omits chords param when all 22 chords are selected in link generation', () => {
    const allSymbols = CHORD_CATALOG.map((c) => c.symbol);
    const url = generateEmbedUrl({
      chords: allSymbols,
      mode: 'alternate',
      embed: false,
    });

    expect(url).toBe('/basic-chord-trainer');
  });
});
