/**
 * Dual-Notation Formatters and Musical Helpers
 * Bridges Anglo-Saxon Letter notation (C, Am, G7) and European Solfège notation (Do Mayor, La menor, Sol 7ª).
 * @module apps/basic-chord-trainer/domain/dualNotation
 */

import { ChordDefinition } from '../types';

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
 * Returns formatted dual-notation label for multiple-choice options
 */
export function formatOptionLabel(chord: ChordDefinition): string {
  return formatDualNotation(chord);
}

/**
 * Formats user-facing challenge prompts for Draw and Identify modes
 */
export function formatPromptTitle(
  chord: ChordDefinition,
  lang: 'en' | 'es' = 'en',
  mode: 'draw' | 'identify' = 'draw'
): { title: string; subtitle: string } {
  const dual = formatDualNotation(chord);

  if (mode === 'draw') {
    return {
      title: lang === 'es' ? 'Dibuja el acorde:' : 'Draw the chord:',
      subtitle: dual,
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
