import { describe, it, expect } from 'vitest';
import { parseTrainerParams, generateEmbedUrl } from '@/apps/basic-note-trainer/domain/queryParams';

describe('Query Parameters Parsing (User Story 4 & 5)', () => {
  it('parses valid URLSearchParams correctly with language and embed', () => {
    const params = new URLSearchParams('mode=translation&direction=letters-to-solfege&difficulty=intermediate&embed=true&lang=es');
    const config = parseTrainerParams(params);

    expect(config.mode).toBe('translation');
    expect(config.direction).toBe('letters-to-solfege');
    expect(config.difficulty).toBe('intermediate');
    expect(config.embed).toBe(true);
    expect(config.compact).toBe(true); // defaults to true when embed is true
    expect(config.lang).toBe('es');
  });

  it('parses plain object record with numeric embed string and locale', () => {
    const config = parseTrainerParams({
      mode: 'accidentals',
      direction: 'solfege-to-letters',
      difficulty: 'advanced',
      embed: '1',
      locale: 'es',
    });

    expect(config.mode).toBe('accidentals');
    expect(config.direction).toBe('solfege-to-letters');
    expect(config.difficulty).toBe('advanced');
    expect(config.embed).toBe(true);
    expect(config.compact).toBe(true);
    expect(config.lang).toBe('es');
  });

  it('parses explicit compact query parameter', () => {
    const configExplicitCompact = parseTrainerParams({
      compact: 'true',
    });
    expect(configExplicitCompact.compact).toBe(true);
    expect(configExplicitCompact.embed).toBe(false);

    const configExplicitFalse = parseTrainerParams({
      embed: 'true',
      compact: 'false',
    });
    expect(configExplicitFalse.embed).toBe(true);
    expect(configExplicitFalse.compact).toBe(false);
  });

  it('falls back gracefully to defaults when parameters are missing or invalid', () => {
    const config = parseTrainerParams(new URLSearchParams('mode=unknown&direction=invalid&difficulty=extreme&embed=nope&lang=fr'));

    expect(config.mode).toBe('mixed');
    expect(config.direction).toBe('both');
    expect(config.difficulty).toBe('beginner');
    expect(config.embed).toBe(false);
    expect(config.compact).toBe(false);
    expect(config.lang).toBeUndefined();
  });

  it('handles empty or undefined inputs without throwing', () => {
    expect(parseTrainerParams(undefined)).toEqual({
      mode: 'mixed',
      direction: 'both',
      difficulty: 'beginner',
      embed: false,
      compact: false,
      lang: undefined,
    });

    expect(parseTrainerParams({})).toEqual({
      mode: 'mixed',
      direction: 'both',
      difficulty: 'beginner',
      embed: false,
      compact: false,
      lang: undefined,
    });
  });

  it('parses exerciseTypes parameter in mixed mode', () => {
    const config = parseTrainerParams({
      mode: 'mixed',
      types: 'translation,intervals',
    });
    expect(config.exerciseTypes).toEqual(['translation', 'intervals']);

    const configAliases = parseTrainerParams(new URLSearchParams('exercises=intervals,accidentals'));
    expect(configAliases.exerciseTypes).toEqual(['intervals', 'accidentals']);
  });

  it('filters out invalid exerciseTypes safely', () => {
    const config = parseTrainerParams({
      types: 'invalid,intervals,nonsense',
    });
    expect(config.exerciseTypes).toEqual(['intervals']);

    const configAllInvalid = parseTrainerParams({
      types: 'foo,bar',
    });
    expect(configAllInvalid.exerciseTypes).toBeUndefined();
  });
});

describe('Embed and Share URL Generator (Basic Note Trainer)', () => {
  it('generates clean embed URL with default options', () => {
    const url = generateEmbedUrl({
      embed: true,
    });
    expect(url).toBe('/basic-note-trainer/embed');
  });

  it('generates full-page URL with mode and language', () => {
    const url = generateEmbedUrl({
      embed: false,
      mode: 'intervals',
      lang: 'es',
    });
    expect(url).toBe('/basic-note-trainer?mode=intervals&lang=es');
  });

  it('generates URL with custom mixed exerciseTypes', () => {
    const url = generateEmbedUrl({
      embed: false,
      mode: 'mixed',
      exerciseTypes: ['translation', 'intervals'],
      direction: 'solfege-to-letters',
      lang: 'es',
    });
    expect(url).toBe('/basic-note-trainer?types=translation%2Cintervals&direction=solfege-to-letters&lang=es');
  });

  it('does not include types param when all 3 exercise types are selected', () => {
    const url = generateEmbedUrl({
      embed: true,
      mode: 'mixed',
      exerciseTypes: ['translation', 'accidentals', 'intervals'],
      lang: 'es',
    });
    expect(url).toBe('/basic-note-trainer/embed?lang=es');
  });

  it('supports baseUrl prepending for external sharing', () => {
    const url = generateEmbedUrl({
      embed: true,
      mode: 'translation',
      baseUrl: 'https://guitar.jorgeruizdev.com',
    });
    expect(url).toBe('https://guitar.jorgeruizdev.com/basic-note-trainer/embed?mode=translation');
  });
});
