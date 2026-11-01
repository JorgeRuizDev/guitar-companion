/**
 * URL Query Parameter Parser and Normalizer
 * Implements Interface Contract: URL Query Parameters
 * @module apps/basic-note-trainer/domain/queryParams
 */

import {
  DifficultyLevel,
  Language,
  TrainerConfig,
  TrainerMode,
  TranslationDirection,
} from '../types';

export type RawSearchParams =
  | URLSearchParams
  | Record<string, string | string[] | undefined>
  | undefined;

function getParamValue(params: RawSearchParams, key: string): string | null {
  if (!params) return null;
  if (params instanceof URLSearchParams) {
    return params.get(key);
  }
  const val = params[key];
  if (Array.isArray(val)) {
    return val[0] ?? null;
  }
  return val ?? null;
}

/**
 * Parses and validates query parameters into a strongly-typed TrainerConfig
 * Falls back safely to defaults on invalid or missing parameters.
 */
export function parseTrainerParams(searchParams?: RawSearchParams): TrainerConfig {
  const modeParam = getParamValue(searchParams, 'mode');
  const dirParam = getParamValue(searchParams, 'direction');
  const diffParam = getParamValue(searchParams, 'difficulty');
  const embedParam = getParamValue(searchParams, 'embed');
  const langParam = getParamValue(searchParams, 'lang') || getParamValue(searchParams, 'locale');
  const compactParam = getParamValue(searchParams, 'compact');

  const mode: TrainerMode =
    modeParam === 'translation' || modeParam === 'accidentals' || modeParam === 'mixed'
      ? modeParam
      : 'mixed';

  const direction: TranslationDirection =
    dirParam === 'letters-to-solfege' || dirParam === 'solfege-to-letters' || dirParam === 'both'
      ? dirParam
      : 'both';

  const difficulty: DifficultyLevel =
    diffParam === 'beginner' || diffParam === 'intermediate' || diffParam === 'advanced'
      ? diffParam
      : 'beginner';

  const embed = embedParam === 'true' || embedParam === '1';

  const lang: Language | undefined =
    langParam === 'es' ? 'es' : langParam === 'en' ? 'en' : undefined;

  const compact =
    compactParam === 'true' || compactParam === '1'
      ? true
      : compactParam === 'false' || compactParam === '0'
      ? false
      : embed; // defaults to true in embed mode

  return { mode, direction, difficulty, embed, compact, lang };
}
