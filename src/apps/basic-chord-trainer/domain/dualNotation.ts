/**
 * Dual-Notation Formatters and Musical Helpers
 * Bridges Anglo-Saxon Letter notation (C, Am, G7) and Solfège notation (Do Mayor, La menor, Sol 7ª).
 * @module apps/basic-chord-trainer/domain/dualNotation
 */

import { ChallengeNotation, ChordDefinition } from '../types';

export const CHORD_NAMES_MAP: Record<
  string,
  { en: string; esLetters: string; esSolfege: string; enSolfege: string }
> = {
  'c-major': { en: 'C major', esLetters: 'C Mayor', esSolfege: 'Do Mayor', enSolfege: 'Do Major' },
  'd-major': { en: 'D major', esLetters: 'D Mayor', esSolfege: 'Re Mayor', enSolfege: 'Re Major' },
  'e-major': { en: 'E major', esLetters: 'E Mayor', esSolfege: 'Mi Mayor', enSolfege: 'Mi Major' },
  'g-major': { en: 'G major', esLetters: 'G Mayor', esSolfege: 'Sol Mayor', enSolfege: 'Sol Major' },
  'a-major': { en: 'A major', esLetters: 'A Mayor', esSolfege: 'La Mayor', enSolfege: 'La Major' },
  'a-minor': { en: 'A minor', esLetters: 'A menor', esSolfege: 'La menor', enSolfege: 'La minor' },
  'd-minor': { en: 'D minor', esLetters: 'D menor', esSolfege: 'Re menor', enSolfege: 'Re minor' },
  'e-minor': { en: 'E minor', esLetters: 'E menor', esSolfege: 'Mi menor', enSolfege: 'Mi minor' },
  'c7': { en: 'C7', esLetters: 'C7', esSolfege: 'Do 7ª', enSolfege: 'Do 7th' },
  'd7': { en: 'D7', esLetters: 'D7', esSolfege: 'Re 7ª', enSolfege: 'Re 7th' },
  'e7': { en: 'E7', esLetters: 'E7', esSolfege: 'Mi 7ª', enSolfege: 'Mi 7th' },
  'g7': { en: 'G7', esLetters: 'G7', esSolfege: 'Sol 7ª', enSolfege: 'Sol 7th' },
  'a7': { en: 'A7', esLetters: 'A7', esSolfege: 'La 7ª', enSolfege: 'La 7th' },
  'b7': { en: 'B7', esLetters: 'B7', esSolfege: 'Si 7ª', enSolfege: 'Si 7th' },
  'f-beginner': { en: 'F major', esLetters: 'F Mayor', esSolfege: 'Fa Mayor', enSolfege: 'Fa Major' },
  'fmaj7': { en: 'Fmaj7', esLetters: 'Fmaj7', esSolfege: 'Fa maj7', enSolfege: 'Fa maj7' },
  'cadd9': { en: 'Cadd9', esLetters: 'Cadd9', esSolfege: 'Do add9', enSolfege: 'Do add9' },
  'dsus2': { en: 'Dsus2', esLetters: 'Dsus2', esSolfege: 'Re sus2', enSolfege: 'Re sus2' },
  'dsus4': { en: 'Dsus4', esLetters: 'Dsus4', esSolfege: 'Re sus4', enSolfege: 'Re sus4' },
  'asus2': { en: 'Asus2', esLetters: 'Asus2', esSolfege: 'La sus2', enSolfege: 'La sus2' },
  'asus4': { en: 'Asus4', esLetters: 'Asus4', esSolfege: 'La sus4', enSolfege: 'La sus4' },
  'esus4': { en: 'Esus4', esLetters: 'Esus4', esSolfege: 'Mi sus4', enSolfege: 'Mi sus4' },
};

/**
 * Returns a standardized dual notation string: e.g. "C (Do Mayor)", "Am (La menor)"
 * Always preserves both notation systems simultaneously.
 */
export function formatDualNotation(
  chord: Pick<ChordDefinition, 'symbol' | 'solfegeName'>
): string {
  if (!chord?.symbol || !chord?.solfegeName) {
    return chord?.symbol || chord?.solfegeName || '';
  }
  return `${chord.symbol} (${chord.solfegeName})`;
}

/**
 * Returns formatted label for multiple-choice options.
 * When notation is provided ('letters' or 'solfege'), formats strictly in that notation
 * without combined dual parentheses. Falls back to formatDualNotation when omitted.
 */
export function formatOptionLabel(
  chord: ChordDefinition,
  notation?: ChallengeNotation,
  lang: 'en' | 'es' = 'en'
): string {
  if (!notation) {
    return formatDualNotation(chord);
  }

  const info = CHORD_NAMES_MAP[chord.id];

  if (notation === 'letters') {
    return lang === 'es' ? (info?.esLetters || chord.symbol) : (info?.en || chord.symbol);
  }

  return lang === 'es' ? chord.solfegeName : (info?.enSolfege || chord.solfegeName);
}

/**
 * Formats user-facing challenge prompts for Draw and Identify modes.
 * When notation is provided, produces segregated prompts without combined parentheses.
 */
export function formatPromptTitle(
  chord: ChordDefinition,
  lang: 'en' | 'es' = 'en',
  mode: 'draw' | 'identify' = 'draw',
  notation?: ChallengeNotation
): { title: string; subtitle: string } {
  const info = CHORD_NAMES_MAP[chord.id];

  if (mode === 'draw') {
    if (notation === 'letters') {
      return {
        title: lang === 'es' ? 'Dibuja el acorde de:' : 'Draw the chord:',
        subtitle: chord.symbol,
      };
    }

    if (notation === 'solfege') {
      return {
        title: lang === 'es' ? 'Dibuja el acorde de:' : 'Draw the chord:',
        subtitle: lang === 'es' ? chord.solfegeName : (info?.en || chord.solfegeName),
      };
    }

    // Default fallback (preserves dual format when notation is omitted)
    const dual = formatDualNotation(chord);
    return {
      title: lang === 'es' ? 'Dibuja el acorde:' : 'Draw the chord:',
      subtitle: dual,
    };
  }

  if (notation) {
    return {
      title:
        lang === 'es'
          ? '¿A qué acorde corresponde este dibujo?'
          : 'Which chord corresponds to this diagram?',
      subtitle:
        lang === 'es'
          ? 'Selecciona el acorde correcto'
          : 'Select the correct chord',
    };
  }

  return {
    title:
      lang === 'es'
        ? 'Identifica la figura del acorde:'
        : 'Identify this chord shape:',
    subtitle:
      lang === 'es'
        ? 'Selecciona el acorde correcto'
        : 'Select the correct chord',
  };
}
