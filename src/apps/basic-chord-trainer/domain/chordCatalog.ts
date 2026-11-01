/**
 * Authoritative Catalog of 22 Beginner Open Chords with Dual Notation and Exact Fingerings
 * @module apps/basic-chord-trainer/domain/chordCatalog
 */

import { ChordDefinition } from '../types';

export const CHORD_CATALOG: ChordDefinition[] = [
  // ==========================================
  // Open Majors (5)
  // ==========================================
  {
    id: 'c-major',
    symbol: 'C',
    solfegeName: 'Do Mayor',
    category: 'open-major',
    rootString: 5,
    strings: [
      { stringNumber: 6, state: 'muted', fret: null, finger: null },
      { stringNumber: 5, state: 'fretted', fret: 3, finger: 3 },
      { stringNumber: 4, state: 'fretted', fret: 2, finger: 2 },
      { stringNumber: 3, state: 'open', fret: 0, finger: null },
      { stringNumber: 2, state: 'fretted', fret: 1, finger: 1 },
      { stringNumber: 1, state: 'open', fret: 0, finger: null },
    ],
    description: {
      en: 'Classic open C major chord with root on the 5th string (A string).',
      es: 'Acorde abierto clásico de Do Mayor con tónica en la 5ª cuerda (La).',
    },
  },
  {
    id: 'd-major',
    symbol: 'D',
    solfegeName: 'Re Mayor',
    category: 'open-major',
    rootString: 4,
    strings: [
      { stringNumber: 6, state: 'muted', fret: null, finger: null },
      { stringNumber: 5, state: 'muted', fret: null, finger: null },
      { stringNumber: 4, state: 'open', fret: 0, finger: null },
      { stringNumber: 3, state: 'fretted', fret: 2, finger: 1 },
      { stringNumber: 2, state: 'fretted', fret: 3, finger: 3 },
      { stringNumber: 1, state: 'fretted', fret: 2, finger: 2 },
    ],
    description: {
      en: 'Bright open D major chord with root on the open 4th string (D string).',
      es: 'Acorde brillante de Re Mayor abierto con tónica en la 4ª cuerda al aire (Re).',
    },
  },
  {
    id: 'e-major',
    symbol: 'E',
    solfegeName: 'Mi Mayor',
    category: 'open-major',
    rootString: 6,
    strings: [
      { stringNumber: 6, state: 'open', fret: 0, finger: null },
      { stringNumber: 5, state: 'fretted', fret: 2, finger: 2 },
      { stringNumber: 4, state: 'fretted', fret: 2, finger: 3 },
      { stringNumber: 3, state: 'fretted', fret: 1, finger: 1 },
      { stringNumber: 2, state: 'open', fret: 0, finger: null },
      { stringNumber: 1, state: 'open', fret: 0, finger: null },
    ],
    description: {
      en: 'Full 6-string open E major chord with bass root on low E.',
      es: 'Acorde completo de Mi Mayor a 6 cuerdas con bajo en Mi grave.',
    },
  },
  {
    id: 'g-major',
    symbol: 'G',
    solfegeName: 'Sol Mayor',
    category: 'open-major',
    rootString: 6,
    strings: [
      { stringNumber: 6, state: 'fretted', fret: 3, finger: 2 },
      { stringNumber: 5, state: 'fretted', fret: 2, finger: 1 },
      { stringNumber: 4, state: 'open', fret: 0, finger: null },
      { stringNumber: 3, state: 'open', fret: 0, finger: null },
      { stringNumber: 2, state: 'open', fret: 0, finger: null },
      { stringNumber: 1, state: 'fretted', fret: 3, finger: 3 },
    ],
    description: {
      en: 'Standard 3-finger open G major chord with root on string 6 fret 3.',
      es: 'Acorde estándar de Sol Mayor de 3 dedos con tónica en la 6ª cuerda traste 3.',
    },
  },
  {
    id: 'a-major',
    symbol: 'A',
    solfegeName: 'La Mayor',
    category: 'open-major',
    rootString: 5,
    strings: [
      { stringNumber: 6, state: 'muted', fret: null, finger: null },
      { stringNumber: 5, state: 'open', fret: 0, finger: null },
      { stringNumber: 4, state: 'fretted', fret: 2, finger: 1 },
      { stringNumber: 3, state: 'fretted', fret: 2, finger: 2 },
      { stringNumber: 2, state: 'fretted', fret: 2, finger: 3 },
      { stringNumber: 1, state: 'open', fret: 0, finger: null },
    ],
    description: {
      en: 'Open A major chord with three fingers bunched on fret 2 and root on open string 5.',
      es: 'Acorde de La Mayor abierto con 3 dedos en el traste 2 y tónica en la 5ª cuerda al aire.',
    },
  },

  // ==========================================
  // Open Minors (3)
  // ==========================================
  {
    id: 'a-minor',
    symbol: 'Am',
    solfegeName: 'La menor',
    category: 'open-minor',
    rootString: 5,
    strings: [
      { stringNumber: 6, state: 'muted', fret: null, finger: null },
      { stringNumber: 5, state: 'open', fret: 0, finger: null },
      { stringNumber: 4, state: 'fretted', fret: 2, finger: 2 },
      { stringNumber: 3, state: 'fretted', fret: 2, finger: 3 },
      { stringNumber: 2, state: 'fretted', fret: 1, finger: 1 },
      { stringNumber: 1, state: 'open', fret: 0, finger: null },
    ],
    description: {
      en: 'Melancholic A minor open chord shaped like an E major shifted down one string.',
      es: 'Acorde melancólico de La menor abierto con digitación similar a Mi Mayor desplazada.',
    },
  },
  {
    id: 'd-minor',
    symbol: 'Dm',
    solfegeName: 'Re menor',
    category: 'open-minor',
    rootString: 4,
    strings: [
      { stringNumber: 6, state: 'muted', fret: null, finger: null },
      { stringNumber: 5, state: 'muted', fret: null, finger: null },
      { stringNumber: 4, state: 'open', fret: 0, finger: null },
      { stringNumber: 3, state: 'fretted', fret: 2, finger: 2 },
      { stringNumber: 2, state: 'fretted', fret: 3, finger: 3 },
      { stringNumber: 1, state: 'fretted', fret: 1, finger: 1 },
    ],
    description: {
      en: 'Expressive D minor chord with root on open 4th string and index on string 1 fret 1.',
      es: 'Expresivo acorde de Re menor con tónica en la 4ª cuerda al aire e índice en traste 1.',
    },
  },
  {
    id: 'e-minor',
    symbol: 'Em',
    solfegeName: 'Mi menor',
    category: 'open-minor',
    rootString: 6,
    strings: [
      { stringNumber: 6, state: 'open', fret: 0, finger: null },
      { stringNumber: 5, state: 'fretted', fret: 2, finger: 2 },
      { stringNumber: 4, state: 'fretted', fret: 2, finger: 3 },
      { stringNumber: 3, state: 'open', fret: 0, finger: null },
      { stringNumber: 2, state: 'open', fret: 0, finger: null },
      { stringNumber: 1, state: 'open', fret: 0, finger: null },
    ],
    description: {
      en: 'Simple 2-finger open E minor chord resonant across all 6 strings.',
      es: 'Acorde sencillo de Mi menor a 2 dedos con gran resonancia en las 6 cuerdas.',
    },
  },

  // ==========================================
  // Open Dominant 7ths (6)
  // ==========================================
  {
    id: 'c7',
    symbol: 'C7',
    solfegeName: 'Do 7ª',
    category: 'open-7th',
    rootString: 5,
    strings: [
      { stringNumber: 6, state: 'muted', fret: null, finger: null },
      { stringNumber: 5, state: 'fretted', fret: 3, finger: 3 },
      { stringNumber: 4, state: 'fretted', fret: 2, finger: 2 },
      { stringNumber: 3, state: 'fretted', fret: 3, finger: 4 },
      { stringNumber: 2, state: 'fretted', fret: 1, finger: 1 },
      { stringNumber: 1, state: 'open', fret: 0, finger: null },
    ],
    description: {
      en: 'Bluesy C dominant 7th adding pinky on string 3 fret 3 (Bb).',
      es: 'Acorde de Do 7ª dominante añadiendo el meñique en 3ª cuerda traste 3 (Si♭).',
    },
  },
  {
    id: 'd7',
    symbol: 'D7',
    solfegeName: 'Re 7ª',
    category: 'open-7th',
    rootString: 4,
    strings: [
      { stringNumber: 6, state: 'muted', fret: null, finger: null },
      { stringNumber: 5, state: 'muted', fret: null, finger: null },
      { stringNumber: 4, state: 'open', fret: 0, finger: null },
      { stringNumber: 3, state: 'fretted', fret: 2, finger: 2 },
      { stringNumber: 2, state: 'fretted', fret: 1, finger: 1 },
      { stringNumber: 1, state: 'fretted', fret: 2, finger: 3 },
    ],
    description: {
      en: 'Inverted triangle open D7 with root on open string 4.',
      es: 'Triángulo invertido de Re 7ª con tónica en la 4ª cuerda al aire.',
    },
  },
  {
    id: 'e7',
    symbol: 'E7',
    solfegeName: 'Mi 7ª',
    category: 'open-7th',
    rootString: 6,
    strings: [
      { stringNumber: 6, state: 'open', fret: 0, finger: null },
      { stringNumber: 5, state: 'fretted', fret: 2, finger: 2 },
      { stringNumber: 4, state: 'open', fret: 0, finger: null },
      { stringNumber: 3, state: 'fretted', fret: 1, finger: 1 },
      { stringNumber: 2, state: 'open', fret: 0, finger: null },
      { stringNumber: 1, state: 'open', fret: 0, finger: null },
    ],
    description: {
      en: 'Open E7 releasing the 4th string to sound the open D note.',
      es: 'Acorde abierto de Mi 7ª dejando la 4ª cuerda al aire para sonar la nota Re.',
    },
  },
  {
    id: 'g7',
    symbol: 'G7',
    solfegeName: 'Sol 7ª',
    category: 'open-7th',
    rootString: 6,
    strings: [
      { stringNumber: 6, state: 'fretted', fret: 3, finger: 3 },
      { stringNumber: 5, state: 'fretted', fret: 2, finger: 2 },
      { stringNumber: 4, state: 'open', fret: 0, finger: null },
      { stringNumber: 3, state: 'open', fret: 0, finger: null },
      { stringNumber: 2, state: 'open', fret: 0, finger: null },
      { stringNumber: 1, state: 'fretted', fret: 1, finger: 1 },
    ],
    description: {
      en: 'Open G7 stretching finger 1 down to string 1 fret 1 (F note).',
      es: 'Acorde de Sol 7ª extendiendo el dedo 1 al traste 1 de la 1ª cuerda (Fa).',
    },
  },
  {
    id: 'a7',
    symbol: 'A7',
    solfegeName: 'La 7ª',
    category: 'open-7th',
    rootString: 5,
    strings: [
      { stringNumber: 6, state: 'muted', fret: null, finger: null },
      { stringNumber: 5, state: 'open', fret: 0, finger: null },
      { stringNumber: 4, state: 'fretted', fret: 2, finger: 1 },
      { stringNumber: 3, state: 'open', fret: 0, finger: null },
      { stringNumber: 2, state: 'fretted', fret: 2, finger: 2 },
      { stringNumber: 1, state: 'open', fret: 0, finger: null },
    ],
    description: {
      en: 'Two-finger open A7 leaving the 3rd string open to ring the G note.',
      es: 'Acorde abierto de La 7ª a 2 dedos dejando la 3ª cuerda al aire para la nota Sol.',
    },
  },
  {
    id: 'b7',
    symbol: 'B7',
    solfegeName: 'Si 7ª',
    category: 'open-7th',
    rootString: 5,
    strings: [
      { stringNumber: 6, state: 'muted', fret: null, finger: null },
      { stringNumber: 5, state: 'fretted', fret: 2, finger: 2 },
      { stringNumber: 4, state: 'fretted', fret: 1, finger: 1 },
      { stringNumber: 3, state: 'fretted', fret: 2, finger: 3 },
      { stringNumber: 2, state: 'open', fret: 0, finger: null },
      { stringNumber: 1, state: 'fretted', fret: 2, finger: 4 },
    ],
    description: {
      en: 'Essential open dominant chord in E major progression with root on string 5 fret 2.',
      es: 'Acorde dominante imprescindible en la tonalidad de Mi Mayor con tónica en 5ª cuerda traste 2.',
    },
  },

  // ==========================================
  // Beginner F & Fmaj7 (2)
  // ==========================================
  {
    id: 'f-beginner',
    symbol: 'F',
    solfegeName: 'Fa Mayor',
    category: 'open-variation',
    rootString: 4,
    barre: {
      fret: 1,
      fromString: 2,
      toString: 1,
    },
    strings: [
      { stringNumber: 6, state: 'muted', fret: null, finger: null },
      { stringNumber: 5, state: 'muted', fret: null, finger: null },
      { stringNumber: 4, state: 'fretted', fret: 3, finger: 3 },
      { stringNumber: 3, state: 'fretted', fret: 2, finger: 2 },
      { stringNumber: 2, state: 'fretted', fret: 1, finger: 1 },
      { stringNumber: 1, state: 'fretted', fret: 1, finger: 1 },
    ],
    description: {
      en: '4-string beginner open F chord utilizing a mini-barre on strings 1 and 2.',
      es: 'Acorde de Fa Mayor para principiantes a 4 cuerdas con mini-cejilla en cuerdas 1 y 2.',
    },
  },
  {
    id: 'fmaj7',
    symbol: 'Fmaj7',
    solfegeName: 'Fa maj7',
    category: 'open-variation',
    rootString: 4,
    strings: [
      { stringNumber: 6, state: 'muted', fret: null, finger: null },
      { stringNumber: 5, state: 'muted', fret: null, finger: null },
      { stringNumber: 4, state: 'fretted', fret: 3, finger: 3 },
      { stringNumber: 3, state: 'fretted', fret: 2, finger: 2 },
      { stringNumber: 2, state: 'fretted', fret: 1, finger: 1 },
      { stringNumber: 1, state: 'open', fret: 0, finger: null },
    ],
    description: {
      en: 'No-barre beginner-friendly alternative to F with open high E string ringing.',
      es: 'Alternativa dulce y accesible sin cejilla con la 1ª cuerda Mi sonando al aire.',
    },
  },

  // ==========================================
  // Beginner Extensions & Sus Chords (6)
  // ==========================================
  {
    id: 'cadd9',
    symbol: 'Cadd9',
    solfegeName: 'Do add9',
    category: 'open-variation',
    rootString: 5,
    strings: [
      { stringNumber: 6, state: 'muted', fret: null, finger: null },
      { stringNumber: 5, state: 'fretted', fret: 3, finger: 2 },
      { stringNumber: 4, state: 'fretted', fret: 2, finger: 1 },
      { stringNumber: 3, state: 'open', fret: 0, finger: null },
      { stringNumber: 2, state: 'fretted', fret: 3, finger: 3 },
      { stringNumber: 1, state: 'fretted', fret: 3, finger: 4 },
    ],
    description: {
      en: 'Modern acoustic favorite sharing anchored top strings with G major.',
      es: 'Favorito del pop acústico moderno compartiendo los dedos 3 y 4 anclados con Sol Mayor.',
    },
  },
  {
    id: 'dsus2',
    symbol: 'Dsus2',
    solfegeName: 'Re sus2',
    category: 'open-variation',
    rootString: 4,
    strings: [
      { stringNumber: 6, state: 'muted', fret: null, finger: null },
      { stringNumber: 5, state: 'muted', fret: null, finger: null },
      { stringNumber: 4, state: 'open', fret: 0, finger: null },
      { stringNumber: 3, state: 'fretted', fret: 2, finger: 1 },
      { stringNumber: 2, state: 'fretted', fret: 3, finger: 3 },
      { stringNumber: 1, state: 'open', fret: 0, finger: null },
    ],
    description: {
      en: 'Open suspended 2nd chord replacing the 3rd with open high E note.',
      es: 'Acorde suspendido con 2ª abierta sustituyendo la 3ª por la 1ª cuerda al aire.',
    },
  },
  {
    id: 'dsus4',
    symbol: 'Dsus4',
    solfegeName: 'Re sus4',
    category: 'open-variation',
    rootString: 4,
    strings: [
      { stringNumber: 6, state: 'muted', fret: null, finger: null },
      { stringNumber: 5, state: 'muted', fret: null, finger: null },
      { stringNumber: 4, state: 'open', fret: 0, finger: null },
      { stringNumber: 3, state: 'fretted', fret: 2, finger: 1 },
      { stringNumber: 2, state: 'fretted', fret: 3, finger: 2 },
      { stringNumber: 1, state: 'fretted', fret: 3, finger: 4 },
    ],
    description: {
      en: 'Tension-building suspended 4th raising string 1 to fret 3 with pinky.',
      es: 'Acorde de tensión de 4ª suspendida subiendo la 1ª cuerda al traste 3 con el meñique.',
    },
  },
  {
    id: 'asus2',
    symbol: 'Asus2',
    solfegeName: 'La sus2',
    category: 'open-variation',
    rootString: 5,
    strings: [
      { stringNumber: 6, state: 'muted', fret: null, finger: null },
      { stringNumber: 5, state: 'open', fret: 0, finger: null },
      { stringNumber: 4, state: 'fretted', fret: 2, finger: 1 },
      { stringNumber: 3, state: 'fretted', fret: 2, finger: 2 },
      { stringNumber: 2, state: 'open', fret: 0, finger: null },
      { stringNumber: 1, state: 'open', fret: 0, finger: null },
    ],
    description: {
      en: 'Dreamy suspended A chord lifting the finger off string 2 to sound open B.',
      es: 'Acorde soñador de La suspendido levantando el dedo de la 2ª cuerda para sonar Si al aire.',
    },
  },
  {
    id: 'asus4',
    symbol: 'Asus4',
    solfegeName: 'La sus4',
    category: 'open-variation',
    rootString: 5,
    strings: [
      { stringNumber: 6, state: 'muted', fret: null, finger: null },
      { stringNumber: 5, state: 'open', fret: 0, finger: null },
      { stringNumber: 4, state: 'fretted', fret: 2, finger: 1 },
      { stringNumber: 3, state: 'fretted', fret: 2, finger: 2 },
      { stringNumber: 2, state: 'fretted', fret: 3, finger: 3 },
      { stringNumber: 1, state: 'open', fret: 0, finger: null },
    ],
    description: {
      en: 'Suspended 4th chord extending string 2 to fret 3 (D note).',
      es: 'Acorde de 4ª suspendida extendiendo la 2ª cuerda al traste 3 (nota Re).',
    },
  },
  {
    id: 'esus4',
    symbol: 'Esus4',
    solfegeName: 'Mi sus4',
    category: 'open-variation',
    rootString: 6,
    strings: [
      { stringNumber: 6, state: 'open', fret: 0, finger: null },
      { stringNumber: 5, state: 'fretted', fret: 2, finger: 2 },
      { stringNumber: 4, state: 'fretted', fret: 2, finger: 3 },
      { stringNumber: 3, state: 'fretted', fret: 2, finger: 4 },
      { stringNumber: 2, state: 'open', fret: 0, finger: null },
      { stringNumber: 1, state: 'open', fret: 0, finger: null },
    ],
    description: {
      en: 'Stirring suspended E chord fretting string 3 at fret 2 (A note).',
      es: 'Emotivo acorde de Mi suspendido pisando la 3ª cuerda en traste 2 (nota La).',
    },
  },
];

/** Lookup map by chord ID for O(1) retrieval */
export const CHORD_BY_ID = new Map<string, ChordDefinition>(
  CHORD_CATALOG.map((chord) => [chord.id, chord])
);

/** Lookup map by chord symbol (case-insensitive) */
export const CHORD_BY_SYMBOL = new Map<string, ChordDefinition>(
  CHORD_CATALOG.map((chord) => [chord.symbol.toLowerCase(), chord])
);

export function getChordById(id: string): ChordDefinition | undefined {
  return CHORD_BY_ID.get(id);
}

export function getChordBySymbol(symbol: string): ChordDefinition | undefined {
  return CHORD_BY_SYMBOL.get(symbol.trim().toLowerCase());
}

/** Predefined chord presets for practice and quick filters */
export const CHORD_PRESETS = [
  {
    id: 'all',
    labelEn: 'Select All (22 Chords)',
    labelEs: 'Seleccionar todos (22 acordes)',
    chordSymbols: CHORD_CATALOG.map((c) => c.symbol),
  },
  {
    id: 'fundamental-trio',
    labelEn: 'Fundamental Trio (G-C-D)',
    labelEs: 'Trío fundamental (G-C-D)',
    chordSymbols: ['G', 'C', 'D'],
  },
  {
    id: 'first-three',
    labelEn: 'First 3 Chords (A-D-E)',
    labelEs: 'Primeros 3 acordes (A-D-E)',
    chordSymbols: ['A', 'D', 'E'],
  },
  {
    id: 'open-minors',
    labelEn: 'Open Minors (Am-Dm-Em)',
    labelEs: 'Menores abiertos (Am-Dm-Em)',
    chordSymbols: ['Am', 'Dm', 'Em'],
  },
  {
    id: 'open-7ths',
    labelEn: 'Open 7ths (C7-D7-E7-G7-A7-B7)',
    labelEs: '7ªs dominantes (C7-D7-E7-G7-A7-B7)',
    chordSymbols: ['C7', 'D7', 'E7', 'G7', 'A7', 'B7'],
  },
] as const;
