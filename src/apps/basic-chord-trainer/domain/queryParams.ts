/**
 * URL Query Parameter Parsing and Serialization
 * @module apps/basic-chord-trainer/domain/queryParams
 */

import { PracticeMode, TrainerConfig } from '../types';
import { CHORD_CATALOG } from './chordCatalog';

/**
 * Parses and normalizes URL query parameters with graceful fallbacks.
 */
export function parseChordTrainerParams(
  searchParams?: URLSearchParams | Record<string, string | string[] | undefined>
): TrainerConfig {
  const getParam = (key: string): string | null => {
    if (!searchParams) return null;
    if (searchParams instanceof URLSearchParams) return searchParams.get(key);
    const val = searchParams[key];
    return Array.isArray(val) ? val[0] ?? null : val ?? null;
  };

  const chordsParam = getParam('chords');
  const modeParam = getParam('mode');
  const embedParam = getParam('embed');
  const compactParam = getParam('compact');
  const langParam = getParam('lang') || getParam('locale');

  const mode: PracticeMode =
    modeParam === 'draw' || modeParam === 'identify' || modeParam === 'alternate'
      ? modeParam
      : 'alternate';

  const embed = embedParam === 'true' || embedParam === '1';

  const compact =
    compactParam === 'true' || compactParam === '1'
      ? true
      : compactParam === 'false' || compactParam === '0'
      ? false
      : embed;

  const chords = chordsParam
    ? chordsParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

  const lang: 'en' | 'es' | undefined =
    langParam === 'es' ? 'es' : langParam === 'en' ? 'en' : undefined;

  return { chords, mode, embed, compact, lang };
}

/**
 * Generates configured URL or embed link.
 */
export function generateEmbedUrl(
  config: Partial<TrainerConfig> & { baseUrl?: string }
): string {
  const isEmbed = Boolean(config.embed);
  const basePath = isEmbed
    ? '/basic-chord-trainer/embed'
    : '/basic-chord-trainer';

  const params = new URLSearchParams();

  // Only include chords param if filtered subset (less than full 22 catalog)
  if (config.chords && config.chords.length > 0 && config.chords.length < CHORD_CATALOG.length) {
    params.set('chords', config.chords.join(','));
  }

  if (config.mode && config.mode !== 'alternate') {
    params.set('mode', config.mode);
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
