/**
 * URL Query Parameter Parser and Normalizer
 * Implements Interface Contract: URL Query Parameters
 * @module apps/basic-note-trainer/domain/queryParams
 */

import {
  DifficultyLevel,
  ExerciseType,
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
  const typesParam =
    getParamValue(searchParams, 'types') ||
    getParamValue(searchParams, 'exercises') ||
    getParamValue(searchParams, 'submodes');

  const mode: TrainerMode =
    modeParam === 'translation' ||
    modeParam === 'accidentals' ||
    modeParam === 'mixed' ||
    modeParam === 'intervals'
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

  let exerciseTypes: ExerciseType[] | undefined;
  if (typesParam) {
    const rawList = typesParam.split(',').map((s) => s.trim().toLowerCase());
    const valid = rawList.filter(
      (t): t is ExerciseType => t === 'translation' || t === 'accidentals' || t === 'intervals'
    );
    if (valid.length > 0) {
      exerciseTypes = valid;
    }
  }

  return {
    mode,
    direction,
    difficulty,
    embed,
    compact,
    lang,
    ...(exerciseTypes ? { exerciseTypes } : {}),
  };
}

/**
 * Generates configured URL or embed link for Basic Note Trainer.
 */
export function generateEmbedUrl(
  config: Partial<TrainerConfig> & { baseUrl?: string }
): string {
  const isEmbed = Boolean(config.embed);
  const basePath = isEmbed ? '/basic-note-trainer/embed' : '/basic-note-trainer';

  const params = new URLSearchParams();

  if (config.mode && config.mode !== 'mixed') {
    params.set('mode', config.mode);
  }

  // If in mixed mode (or unspecified mode which defaults to mixed),
  // specify 'types' when customized (i.e. not all 3 types selected)
  if (
    (!config.mode || config.mode === 'mixed') &&
    config.exerciseTypes &&
    config.exerciseTypes.length > 0 &&
    config.exerciseTypes.length < 3
  ) {
    params.set('types', config.exerciseTypes.join(','));
  }

  if (config.direction && config.direction !== 'both') {
    params.set('direction', config.direction);
  }

  if (config.difficulty && config.difficulty !== 'beginner') {
    params.set('difficulty', config.difficulty);
  }

  if (!isEmbed && config.compact) {
    params.set('compact', 'true');
  }

  if (config.lang && config.lang !== 'en') {
    params.set('lang', config.lang);
  }

  const queryString = params.toString();
  const fullPath = queryString ? `${basePath}?${queryString}` : basePath;

  if (config.baseUrl) {
    const cleanBase = config.baseUrl.replace(/\/$/, '');
    return `${cleanBase}${fullPath}`;
  }

  return fullPath;
}
