import { describe, it, expect } from 'vitest';
import { parseChordTrainerParams } from '@/apps/basic-chord-trainer/domain/queryParams';

describe('Query Parameters Parsing & Defaults (User Story 6)', () => {
  it('parses valid URLSearchParams correctly with all parameters', () => {
    const params = new URLSearchParams('chords=C,Am,G7&mode=draw&embed=true&lang=es');
    const config = parseChordTrainerParams(params);

    expect(config.chords).toEqual(['C', 'Am', 'G7']);
    expect(config.mode).toBe('draw');
    expect(config.embed).toBe(true);
    expect(config.compact).toBe(true);
    expect(config.lang).toBe('es');
  });

  it('parses plain object record with numeric embed string and locale', () => {
    const record = {
      chords: 'G,D,Em',
      mode: 'identify',
      embed: '1',
      locale: 'es',
    };
    const config = parseChordTrainerParams(record);

    expect(config.chords).toEqual(['G', 'D', 'Em']);
    expect(config.mode).toBe('identify');
    expect(config.embed).toBe(true);
    expect(config.compact).toBe(true);
    expect(config.lang).toBe('es');
  });

  it('falls back gracefully to defaults when parameters are missing or invalid', () => {
    const emptyConfig = parseChordTrainerParams({});

    expect(emptyConfig.chords).toBeUndefined();
    expect(emptyConfig.mode).toBe('alternate');
    expect(emptyConfig.embed).toBe(false);
    expect(emptyConfig.compact).toBe(false);
    expect(emptyConfig.lang).toBeUndefined();

    const invalidModeConfig = parseChordTrainerParams({ mode: 'invalid_mode_xyz' });
    expect(invalidModeConfig.mode).toBe('alternate');
  });

  it('handles empty or undefined inputs without throwing', () => {
    expect(() => parseChordTrainerParams(undefined)).not.toThrow();
    const config = parseChordTrainerParams(undefined);
    expect(config.mode).toBe('alternate');
    expect(config.embed).toBe(false);
  });
});
