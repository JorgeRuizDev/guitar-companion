/**
 * Pedagogical Mnemonics and Music Theory Explanations
 * Memory tricks, guitar associations, and theoretical explanations for note names,
 * accidentals, and natural semitones in both English and Spanish.
 * @module apps/basic-note-trainer/domain/mnemonics
 */

import { NaturalLetter, SolfegeNote, Language } from '../types';

export interface PedagogicalTip {
  explanation: string;
  mnemonic: string;
  guitarContext?: string;
}

export const NOTE_MNEMONICS_EN: Readonly<Record<NaturalLetter, PedagogicalTip>> = {
  A: {
    explanation: "A corresponds to La. It is the international standard reference pitch for tuning instruments (A4 = 440 Hz).",
    mnemonic: "A is 440Hz: The golden pitch orchestra tuning note 'La'.",
    guitarContext: "The open 5th string on guitar is tuned to A (La).",
  },
  B: {
    explanation: "B corresponds to Si. B is the leading tone that resolves into C (Do) by a natural half-step without any sharp between them.",
    mnemonic: "'Big Cats': B leads directly into C. No sharp between B and C!",
    guitarContext: "The open 2nd string on guitar is tuned to B (Si).",
  },
  C: {
    explanation: "C corresponds to Do. It is the fundamental anchor of Western music and the starting key for the natural major scale with zero accidentals.",
    mnemonic: "'Do-Re-Mi' starts on C: The baseline white key on pianos.",
    guitarContext: "First fret on the 2nd string is C (Do).",
  },
  D: {
    explanation: "D corresponds to Re. D is the second scale degree, situated one whole tone above C.",
    mnemonic: "'D' sounds like 'Day' and matches 'Re' (Ray of sunshine).",
    guitarContext: "The open 4th string on guitar is tuned to D (Re).",
  },
  E: {
    explanation: "E corresponds to Mi. E is followed immediately by F with no intermediate sharp note (natural semitone).",
    mnemonic: "'Eat Fish': E goes straight to F. Both 1st and 6th strings on guitar are E (Mi)!",
    guitarContext: "The thickest (6th) and thinnest (1st) strings on guitar are both tuned to E (Mi).",
  },
  F: {
    explanation: "F corresponds to Fa. Both begin with the letter 'F'!",
    mnemonic: "'F' is 'Fa': Both share the identical starting letter 'F'.",
    guitarContext: "The first fret on both E strings (6th and 1st) is F (Fa).",
  },
  G: {
    explanation: "G corresponds to Sol. The Treble Clef is officially called the 'Clave de Sol' (G Clef) because it spirals around the G line.",
    mnemonic: "G Clef = Clave de Sol: G is Sol, spiraling on the staff.",
    guitarContext: "The open 3rd string on guitar is tuned to G (Sol).",
  },
} as const;

export const NOTE_MNEMONICS_ES: Readonly<Record<NaturalLetter, PedagogicalTip>> = {
  A: {
    explanation: "A corresponde a La. Es la referencia estándar internacional de afinación para instrumentos (A4 = 440 Hz).",
    mnemonic: "A es 440 Hz: la nota dorada de afinación orquestal 'La'.",
    guitarContext: "La 5ª cuerda al aire de la guitarra está afinada en La (A).",
  },
  B: {
    explanation: "B corresponde a Si. B es la sensible que resuelve en Do (C) por semitono natural sin sostenido intermedio.",
    mnemonic: "'Si-Do': B va directo a C. ¡No hay sostenido entre Si y Do!",
    guitarContext: "La 2ª cuerda al aire de la guitarra está afinada en Si (B).",
  },
  C: {
    explanation: "C corresponde a Do. Es la base del sistema diatónico occidental y la escala mayor natural sin alteraciones.",
    mnemonic: "'Do-Re-Mi' empieza en C: la tecla blanca de referencia.",
    guitarContext: "El traste 1 de la 2ª cuerda en la guitarra es Do (C).",
  },
  D: {
    explanation: "D corresponde a Re. D es el segundo grado de la escala, un tono entero por encima de Do (C).",
    mnemonic: "'D' de 'Doble paso' hacia 'Re'.",
    guitarContext: "La 4ª cuerda al aire de la guitarra está afinada en Re (D).",
  },
  E: {
    explanation: "E corresponde a Mi. A Mi le sigue inmediatamente Fa sin ningún sostenido intermedio (semitono natural).",
    mnemonic: "'Mi-Fa': E va directo a F. ¡La 1ª y la 6ª cuerdas son Mi (E)!",
    guitarContext: "La cuerda más gruesa (6ª) y la más fina (1ª) están ambas afinadas en Mi (E).",
  },
  F: {
    explanation: "F corresponde a Fa. ¡Ambas notas empiezan exactamente por la misma letra 'F'!",
    mnemonic: "'F' es 'Fa': comparten la misma letra inicial 'F'.",
    guitarContext: "El traste 1 de las cuerdas 6ª y 1ª (ambas Mi) es Fa (F).",
  },
  G: {
    explanation: "G corresponde a Sol. La Clave de Sol se llama oficialmente Clave de G porque se sitúa en la línea de Sol.",
    mnemonic: "Clave de Sol = G Clef: G es Sol, la referencia del pentagrama.",
    guitarContext: "La 3ª cuerda al aire de la guitarra está afinada en Sol (G).",
  },
} as const;

export const SEMITONE_MNEMONICS_EN = {
  BC: {
    explanation: "B and C (Si and Do) are a natural semitone pair. There is only a half-step distance between them, so there is no B# or Cb in the standard diatonic scale.",
    mnemonic: "'Big Cats' (B - C): Right next to each other on the fretboard (1 fret apart)!",
  },
  EF: {
    explanation: "E and F (Mi and Fa) are a natural semitone pair. They sit directly adjacent to each other with no intermediate sharp note.",
    mnemonic: "'Eat Fish' (E - F): No sharp between them; they are adjacent frets on guitar!",
  },
  COMBINED: {
    explanation: "In Western music, all natural whole tones have a sharp between them EXCEPT B-C and E-F, which are natural semitones (half-steps) with no intermediate sharp note.",
    mnemonic: "'Big Cats Eat Fish' (B-C & E-F): The only two natural pairs with NO sharp between them!",
  },
} as const;

export const SEMITONE_MNEMONICS_ES = {
  BC: {
    explanation: "Si y Do (B y C) forman un semitono natural. Solo hay medio tono de distancia entre ellas, por lo que no existe Si# o Dob en la escala diatónica natural.",
    mnemonic: "'Si-Do' (B - C): ¡Están juntas en el diapasón (a 1 traste de distancia)!",
  },
  EF: {
    explanation: "Mi y Fa (E y F) forman un semitono natural. Son notas contiguas sin ningún sostenido intermedio.",
    mnemonic: "'Mi-Fa' (E - F): ¡Sin sostenido intermedio; trastes contiguos en la guitarra!",
  },
  COMBINED: {
    explanation: "En la música occidental, todos los tonos naturales tienen sostenido intermedio EXCEPTO Si-Do (B-C) y Mi-Fa (E-F), que son semitonos naturales sin alteración intermedia.",
    mnemonic: "'Si-Do y Mi-Fa' (B-C y E-F): ¡Las dos únicas parejas naturales SIN sostenido entre medias!",
  },
} as const;

export const ACCIDENTAL_MNEMONICS_EN = {
  SHARP: {
    explanation: "A sharp (#) raises a note by one half-step (1 fret higher on the guitar neck, toward the body).",
    mnemonic: "# = Sharp: Moving 1 fret up (higher pitch).",
  },
  FLAT: {
    explanation: "A flat (b) lowers a note by one half-step (1 fret lower on the guitar neck, toward the headstock).",
    mnemonic: "b = Flat: Moving 1 fret down (lower pitch).",
  },
  ENHARMONIC: {
    explanation: "Enharmonic notes have different names but produce the exact same pitch on the fretboard (e.g. C# is the same sound as Db).",
    mnemonic: "Enharmonics: Two names, one fret! (e.g. C# = Db, F# = Gb).",
  },
} as const;

export const ACCIDENTAL_MNEMONICS_ES = {
  SHARP: {
    explanation: "Un sostenido (#) sube la nota medio tono (1 traste más hacia el cuerpo de la guitarra, sonido más agudo).",
    mnemonic: "# = Sostenido: sube 1 traste (más agudo).",
  },
  FLAT: {
    explanation: "Un bemol (b) baja la nota medio tono (1 traste hacia la pala de la guitarra, sonido más grave).",
    mnemonic: "b = Bemol: baja 1 traste (más grave).",
  },
  ENHARMONIC: {
    explanation: "Las notas enarmónicas tienen diferente nombre pero producen exactamente el mismo sonido en el diapasón (ej. Do# suena igual que Reb).",
    mnemonic: "Enarmonía: ¡dos nombres, un mismo traste! (Do# = Reb, Fa# = Solb).",
  },
} as const;

// Backward-compatibility aliases (defaulting to English)
export const NOTE_MNEMONICS = NOTE_MNEMONICS_EN;
export const SEMITONE_MNEMONICS = SEMITONE_MNEMONICS_EN;
export const ACCIDENTAL_MNEMONICS = ACCIDENTAL_MNEMONICS_EN;

/**
 * Retrieves the pedagogical explanation and mnemonic for a note translation.
 */
export function getTranslationPedagogy(
  letter: NaturalLetter,
  solfege: SolfegeNote,
  direction: 'letters-to-solfege' | 'solfege-to-letters',
  lang: Language = 'en'
): PedagogicalTip {
  const dictionary = lang === 'es' ? NOTE_MNEMONICS_ES : NOTE_MNEMONICS_EN;
  const tip = dictionary[letter];
  const connector = lang === 'es' ? 'equivale a' : 'equals';

  if (direction === 'letters-to-solfege') {
    return {
      explanation: `${letter} ${connector} ${solfege}. ${tip.explanation}`,
      mnemonic: tip.mnemonic,
      guitarContext: tip.guitarContext,
    };
  }
  return {
    explanation: `${solfege} ${connector} ${letter}. ${tip.explanation}`,
    mnemonic: tip.mnemonic,
    guitarContext: tip.guitarContext,
  };
}

export function getSemitonePedagogy(
  key: 'BC' | 'EF' | 'COMBINED',
  lang: Language = 'en'
) {
  return lang === 'es' ? SEMITONE_MNEMONICS_ES[key] : SEMITONE_MNEMONICS_EN[key];
}

export function getAccidentalPedagogy(
  key: 'SHARP' | 'FLAT' | 'ENHARMONIC',
  lang: Language = 'en'
) {
  return lang === 'es' ? ACCIDENTAL_MNEMONICS_ES[key] : ACCIDENTAL_MNEMONICS_EN[key];
}

/**
 * Formats a visual 12-pitch chromatic scale representation to include in card explanations.
 * Visually distinguishes natural semitones (E-F and B-C) from whole tones with accidentals (#/b).
 */
export function getVisualScaleExplanation(lang: Language = 'es', focusNote?: string): string {
  const isEs = lang === 'es';

  if (isEs) {
    let focusTip = '';
    if (focusNote) {
      if (focusNote === 'B' || focusNote === 'C') {
        focusTip = `\n📌 Nota destacada: Si (B) y Do (C) son semitono natural contiguo (1 traste, sin alteración intermedia).`;
      } else if (focusNote === 'E' || focusNote === 'F') {
        focusTip = `\n📌 Nota destacada: Mi (E) y Fa (F) son semitono natural contiguo (1 traste, sin alteración intermedia).`;
      } else {
        focusTip = `\n📌 Nota destacada: ${focusNote} tiene sostenido (#) y bemol (b) a su alrededor al estar separada por 1 tono entero (2 trastes).`;
      }
    }

    return [
      '🎼 Escala cromática completa (12 notas en orden):',
      '• Con sostenidos (#): C ➔ C# ➔ D ➔ D# ➔ [E ➔ F] ➔ F# ➔ G ➔ G# ➔ A ➔ A# ➔ [B ➔ C]',
      '• Con bemoles (b):    C ➔ Db ➔ D ➔ Eb ➔ [E ➔ F] ➔ Gb ➔ G ➔ Ab ➔ A ➔ Bb ➔ [B ➔ C]',
      '• En solfeo:          Do ➔ Do#/Reb ➔ Re ➔ Re#/Mib ➔ [Mi ➔ Fa] ➔ Fa#/Solb ➔ Sol ➔ Sol#/Lab ➔ La ➔ La#/Sib ➔ [Si ➔ Do]',
      '',
      '💡 Regla visual imprescindible:',
      'Las dos únicas parejas SIN alteración (# ni b) intermedia son:',
      '👉 Mi - Fa (E - F)',
      '👉 Si - Do (B - C)',
      '¡Están pegadas en trastes contiguos (a solo 1 traste de distancia)! Todas las demás notas tienen sostenido (#) y bemol (b) intermedio.' + focusTip,
    ].join('\n');
  }

  let focusTipEn = '';
  if (focusNote) {
    if (focusNote === 'B' || focusNote === 'C') {
      focusTipEn = `\n📌 Highlighted note: B and C are a natural half-step (1 fret apart, zero gap).`;
    } else if (focusNote === 'E' || focusNote === 'F') {
      focusTipEn = `\n📌 Highlighted note: E and F are a natural half-step (1 fret apart, zero gap).`;
    } else {
      focusTipEn = `\n📌 Highlighted note: ${focusNote} is surrounded by accidentals (#/b) separated by a whole step (2 frets).`;
    }
  }

  return [
    '🎼 Complete Chromatic Scale (12 notes in sequence):',
    '• With sharps (#): C ➔ C# ➔ D ➔ D# ➔ [E ➔ F] ➔ F# ➔ G ➔ G# ➔ A ➔ A# ➔ [B ➔ C]',
    '• With flats (b):  C ➔ Db ➔ D ➔ Eb ➔ [E ➔ F] ➔ Gb ➔ G ➔ Ab ➔ A ➔ Bb ➔ [B ➔ C]',
    '• In Solfège:      Do ➔ Do#/Reb ➔ Re ➔ Re#/Mib ➔ [Mi ➔ Fa] ➔ Fa#/Solb ➔ Sol ➔ Sol#/Lab ➔ La ➔ La#/Sib ➔ [Si ➔ Do]',
    '',
    '💡 Essential visual rule:',
    'The ONLY two natural pairs with NO sharp (#) or flat (b) between them are:',
    '👉 E - F (Mi - Fa)',
    '👉 B - C (Si - Do)',
    'They sit on directly adjacent frets (1 fret apart)! All other natural notes have an accidental (#/b) in between.' + focusTipEn,
  ].join('\n');
}
