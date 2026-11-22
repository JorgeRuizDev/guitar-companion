/**
 * Pure Domain Harmonic Analysis & Voicing Engine
 * Calculates sounding pitches, harmonic roles (Root, 3rd, 5th, etc.), unique pitch sets,
 * and pedagogical distractors for guitar chord voicings.
 * @module apps/basic-chord-trainer/domain/harmonicAnalysis
 */

import {
  ChordDefinition,
  StringNumber,
  StringHarmonicInfo,
  ChordHarmonicAnalysis,
  HarmonicIntervalAbbr,
} from '../types';

/**
 * Standard guitar tuning open string pitch classes (EADGBE).
 * Index 0 corresponds to String 6 (Low E), index 5 to String 1 (High E).
 * Chromatic index: 0=C, 1=C#/Db, 2=D, 3=D#/Eb, 4=E, 5=F, 6=F#/Gb, 7=G, 8=G#/Ab, 9=A, 10=A#/Bb, 11=B.
 */
export const STANDARD_TUNING_PITCH_CLASSES: Record<StringNumber, number> = {
  6: 4,  // Low E
  5: 9,  // A
  4: 2,  // D
  3: 7,  // G
  2: 11, // B
  1: 4,  // High E
};

export const STANDARD_TUNING_NOTE_LETTERS: Record<StringNumber, string> = {
  6: 'E',
  5: 'A',
  4: 'D',
  3: 'G',
  2: 'B',
  1: 'E',
};

/**
 * Maps pitch class (0-11) to note letter and solfege name in context of a chord.
 */
export function getPitchName(
  pitchClass: number,
  chord?: Pick<ChordDefinition, 'symbol' | 'id'>
): { letter: string; solfege: string } {
  const normalizedPitch = ((pitchClass % 12) + 12) % 12;

  // Decide if chord context favors flats (e.g. Bb, Bbm, Fm, C7 7th)
  const isFlatChord =
    chord?.symbol?.includes('b') ||
    chord?.id?.includes('flat') ||
    chord?.id === 'f-minor';

  switch (normalizedPitch) {
    case 0:
      return { letter: 'C', solfege: 'Do' };
    case 1:
      return isFlatChord
        ? { letter: 'Db', solfege: 'Reb' }
        : { letter: 'C#', solfege: 'Do#' };
    case 2:
      return { letter: 'D', solfege: 'Re' };
    case 3:
      return isFlatChord || chord?.symbol?.includes('m')
        ? { letter: 'Eb', solfege: 'Mib' }
        : { letter: 'D#', solfege: 'Re#' };
    case 4:
      return { letter: 'E', solfege: 'Mi' };
    case 5:
      return { letter: 'F', solfege: 'Fa' };
    case 6:
      return isFlatChord
        ? { letter: 'Gb', solfege: 'Solb' }
        : { letter: 'F#', solfege: 'Fa#' };
    case 7:
      return { letter: 'G', solfege: 'Sol' };
    case 8:
      return isFlatChord
        ? { letter: 'Ab', solfege: 'Lab' }
        : { letter: 'G#', solfege: 'Sol#' };
    case 9:
      return { letter: 'A', solfege: 'La' };
    case 10:
      // Dominant 7th chords or flat chords use Bb
      return isFlatChord || chord?.symbol?.includes('7') || chord?.id?.includes('7')
        ? { letter: 'Bb', solfege: 'Sib' }
        : { letter: 'A#', solfege: 'La#' };
    case 11:
      return { letter: 'B', solfege: 'Si' };
    default:
      return { letter: '', solfege: '' };
  }
}

/**
 * Returns harmonic role info based on interval distance in semitones (0 to 11).
 */
export function getHarmonicIntervalInfo(
  semitones: number,
  chord?: Pick<ChordDefinition, 'symbol' | 'id'>
): {
  intervalRole: string;
  intervalRoleEs: string;
  intervalAbbr: HarmonicIntervalAbbr;
} {
  const st = ((semitones % 12) + 12) % 12;

  switch (st) {
    case 0:
      return {
        intervalRole: 'Root',
        intervalRoleEs: 'Tónica',
        intervalAbbr: 'R',
      };
    case 1:
      return {
        intervalRole: 'Minor 2nd',
        intervalRoleEs: '2ª menor',
        intervalAbbr: 'm2',
      };
    case 2:
      if (chord?.symbol?.includes('9') || chord?.id?.includes('9')) {
        return {
          intervalRole: '9th',
          intervalRoleEs: '9ª',
          intervalAbbr: '9',
        };
      }
      return {
        intervalRole: 'Major 2nd',
        intervalRoleEs: '2ª Mayor',
        intervalAbbr: '2M',
      };
    case 3:
      return {
        intervalRole: 'Minor 3rd',
        intervalRoleEs: '3ª menor',
        intervalAbbr: 'm3',
      };
    case 4:
      return {
        intervalRole: 'Major 3rd',
        intervalRoleEs: '3ª Mayor',
        intervalAbbr: '3M',
      };
    case 5:
      return {
        intervalRole: 'Perfect 4th',
        intervalRoleEs: '4ª Justa',
        intervalAbbr: 'P4',
      };
    case 6:
      return {
        intervalRole: 'Tritone',
        intervalRoleEs: 'Tritono',
        intervalAbbr: 'TT',
      };
    case 7:
      return {
        intervalRole: 'Perfect 5th',
        intervalRoleEs: '5ª Justa',
        intervalAbbr: '5J',
      };
    case 8:
      return {
        intervalRole: 'Minor 6th',
        intervalRoleEs: '6ª menor',
        intervalAbbr: 'm6',
      };
    case 9:
      return {
        intervalRole: 'Major 6th',
        intervalRoleEs: '6ª Mayor',
        intervalAbbr: '6M',
      };
    case 10:
      return {
        intervalRole: 'Minor 7th',
        intervalRoleEs: '7ª menor',
        intervalAbbr: 'm7',
      };
    case 11:
      return {
        intervalRole: 'Major 7th',
        intervalRoleEs: '7ª Mayor',
        intervalAbbr: '7M',
      };
    default:
      return {
        intervalRole: '',
        intervalRoleEs: '',
        intervalAbbr: 'R',
      };
  }
}

/**
 * Localizes harmonic interval abbreviations (e.g., 'R' -> 'T', '3M' -> '3ª', '5J' -> '5ª', 'm7' -> '7ª' in Spanish).
 */
export function getLocalizedIntervalAbbr(
  abbr: HarmonicIntervalAbbr,
  lang: 'en' | 'es' = 'en'
): string {
  if (lang !== 'es') return abbr;
  switch (abbr) {
    case 'R':
      return 'T'; // Tónica
    case '3M':
      return '3ª'; // 3ª Mayor
    case 'm3':
      return '3ªm'; // 3ª menor
    case '5J':
      return '5ª'; // 5ª Justa
    case 'm7':
      return '7ª'; // 7ª menor
    case '7M':
      return '7ªM'; // 7ª Mayor
    case '9':
      return '9ª';
    case 'P4':
      return '4ª';
    case '2M':
      return '2ª';
    case 'm2':
      return '2ªm';
    case '6M':
      return '6ª';
    case 'm6':
      return '6ªm';
    default:
      return abbr;
  }
}

/**
 * Computes sounding pitch for a single guitar string in a chord.
 */
export function getStringPitchClass(
  stringNumber: StringNumber,
  fret: number | null
): number | null {
  if (fret === null) return null;
  const openPitch = STANDARD_TUNING_PITCH_CLASSES[stringNumber];
  return (openPitch + fret) % 12;
}

/**
 * Standard ordered candidate pool for distractors.
 * Prioritizes natural notes, followed by common accidentals.
 */
const DISTRACTOR_CANDIDATE_POOL: Array<{ letter: string; solfege: string }> = [
  { letter: 'D', solfege: 'Re' },
  { letter: 'A', solfege: 'La' },
  { letter: 'F', solfege: 'Fa' },
  { letter: 'B', solfege: 'Si' },
  { letter: 'G', solfege: 'Sol' },
  { letter: 'E', solfege: 'Mi' },
  { letter: 'C', solfege: 'Do' },
  { letter: 'F#', solfege: 'Fa#' },
  { letter: 'Bb', solfege: 'Sib' },
];

/**
 * Selects exactly 2 distractor notes that are NOT part of the chord's unique notes.
 */
export function selectDistractorNotes(
  uniqueNotes: string[]
): { distractors: [string, string]; distractorsSolfege: [string, string] } {
  const filtered = DISTRACTOR_CANDIDATE_POOL.filter(
    (cand) => !uniqueNotes.includes(cand.letter)
  );

  const first = filtered[0] ?? { letter: 'F#', solfege: 'Fa#' };
  const second = filtered[1] ?? { letter: 'Bb', solfege: 'Sib' };

  return {
    distractors: [first.letter, second.letter],
    distractorsSolfege: [first.solfege, second.solfege],
  };
}

/**
 * Performs complete harmonic analysis of a chord voicing.
 * Computes string pitches, harmonic functions, unique note sets, and 2 distractors.
 * Works seamlessly with both open chords and barre chords.
 */
export function getChordHarmonicAnalysis(chord: ChordDefinition): ChordHarmonicAnalysis {
  // Find root string definition and calculate root pitch class
  const rootStrDef = chord.strings.find((s) => s.stringNumber === chord.rootString);
  const rootFret = rootStrDef?.fret ?? 0;
  const rootPitchClass = (STANDARD_TUNING_PITCH_CLASSES[chord.rootString] + rootFret) % 12;

  const stringAnalysis: StringHarmonicInfo[] = chord.strings.map((strDef) => {
    if (strDef.state === 'muted' || strDef.fret === null) {
      return {
        stringNumber: strDef.stringNumber,
        state: 'muted' as const,
        fret: null,
        finger: null,
        pitchClass: -1,
        noteLetter: '',
        solfegeName: '',
        semitonesFromRoot: -1,
        intervalRole: '',
        intervalRoleEs: '',
        intervalAbbr: '' as HarmonicIntervalAbbr,
      };
    }

    const pitchClass = (STANDARD_TUNING_PITCH_CLASSES[strDef.stringNumber] + strDef.fret) % 12;
    const { letter, solfege } = getPitchName(pitchClass, chord);
    const semitonesFromRoot = ((pitchClass - rootPitchClass) % 12 + 12) % 12;
    const { intervalRole, intervalRoleEs, intervalAbbr } = getHarmonicIntervalInfo(
      semitonesFromRoot,
      chord
    );

    return {
      stringNumber: strDef.stringNumber,
      state: strDef.state,
      fret: strDef.fret,
      finger: strDef.finger ?? null,
      pitchClass,
      noteLetter: letter,
      solfegeName: solfege,
      semitonesFromRoot,
      intervalRole,
      intervalRoleEs,
      intervalAbbr,
    };
  });

  // Extract unique notes preserving order of sounding strings
  const uniqueNotes: string[] = [];
  const uniqueSolfege: string[] = [];

  for (const str of stringAnalysis) {
    if (str.state !== 'muted' && str.noteLetter) {
      if (!uniqueNotes.includes(str.noteLetter)) {
        uniqueNotes.push(str.noteLetter);
        uniqueSolfege.push(str.solfegeName);
      }
    }
  }

  const { distractors, distractorsSolfege } = selectDistractorNotes(uniqueNotes);

  return {
    chordId: chord.id,
    symbol: chord.symbol,
    solfegeName: chord.solfegeName,
    rootString: chord.rootString,
    strings: stringAnalysis,
    uniqueNotes,
    uniqueSolfege,
    distractors,
    distractorsSolfege,
  };
}
