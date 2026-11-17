/**
 * Authoritative Catalog of Open Chords and Essential Barre Chords with Dual Notation, Exact Fingerings and Pedagogical Hints
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
    hint: {
      es: 'Do Mayor (C) forma una diagonal con los dedos 1, 2 y 3 en los trastes 1, 2 y 3. Mutea la 6ª cuerda.',
      en: 'C major forms a diagonal staircase across frets 1, 2, and 3. Mute the 6th string.',
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
    hint: {
      es: 'Re Mayor (D) forma un pequeño triángulo en las cuerdas 1, 2 y 3 (trastes 2, 3, 2). Mutea las cuerdas 5 y 6.',
      en: 'D major forms a triangle on the highest 3 strings (frets 2, 3, 2). Mute strings 5 and 6.',
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
    hint: {
      es: 'Mi Mayor (E) hace sonar las 6 cuerdas: dedos 2 y 3 en traste 2 de cuerdas 5 y 4, y dedo 1 en traste 1 de cuerda 3.',
      en: 'E major sounds all 6 strings: fingers 2 and 3 on fret 2 of strings 5 and 4, and finger 1 on fret 1 of string 3.',
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
    hint: {
      es: 'Sol Mayor (G) tiene la tónica en 6ª cuerda traste 3, dedo 1 en 5ª cuerda traste 2, y dedo 3 en 1ª cuerda traste 3.',
      en: 'G major places finger 2 on string 6 fret 3, finger 1 on string 5 fret 2, and finger 3 on string 1 fret 3.',
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
    hint: {
      es: 'La Mayor (A) agrupa los dedos 1, 2 y 3 en fila en el traste 2 de las cuerdas 4, 3 y 2. La 5ª cuerda suena al aire.',
      en: 'A major bunches fingers 1, 2, and 3 together on fret 2 of strings 4, 3, and 2. String 5 rings open.',
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
    hint: {
      es: 'La menor (Am) tiene la misma figura que Mi Mayor (E), pero bajando todos los dedos una cuerda (cuerda 6 muteada).',
      en: 'A minor has the exact shape of open E major shifted down by one string (string 6 muted).',
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
    hint: {
      es: 'Re menor (Dm) se parece a Re Mayor (D), pero el dedo 1 baja al traste 1 de la 1ª cuerda.',
      en: 'D minor resembles D major, but finger 1 moves down to fret 1 of the 1st string.',
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
    hint: {
      es: 'Mi menor (Em) es igual a Mi Mayor (E), pero levantando el índice: solo pisas el traste 2 en las cuerdas 5 y 4.',
      en: 'E minor is just like E major, but lifting the index finger (leaving string 3 open).',
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
    hint: {
      es: 'Do 7ª (C7) es igual a Do Mayor (C), pero añadiendo el meñique en la 3ª cuerda traste 3.',
      en: 'C7 is open C major plus pinky on string 3 fret 3.',
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
    hint: {
      es: 'Re 7ª (D7) invierte el triángulo de Re Mayor: dedo 1 en traste 1 de la 2ª cuerda, y dedos 2 y 3 en traste 2 de cuerdas 3 y 1.',
      en: 'D7 inverts the D triangle: finger 1 on string 2 fret 1, fingers 2 and 3 on fret 2 of strings 3 and 1.',
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
    hint: {
      es: 'Mi 7ª (E7) es igual a Mi Mayor (E), pero levantando el dedo anular para dejar la 4ª cuerda al aire.',
      en: 'E7 is open E major with the 4th string left open.',
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
    hint: {
      es: 'Sol 7ª (G7) es como Sol Mayor pero sustituyendo el traste 3 de la 1ª cuerda por el traste 1 con el índice.',
      en: 'G7 replaces fret 3 on string 1 with fret 1 using your index finger.',
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
    hint: {
      es: 'La 7ª (A7) es como La Mayor a solo 2 dedos: levanta el dedo del medio dejando la 3ª cuerda al aire.',
      en: 'A7 is open A major with the 3rd string ringing open.',
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
    hint: {
      es: 'Si 7ª (B7) coloca dedo 2 en 5ª cuerda traste 2, dedo 1 en 4ª cuerda traste 1, dedo 3 en 3ª cuerda traste 2, y dedo 4 en 1ª cuerda traste 2.',
      en: 'B7 places finger 2 on string 5 fret 2, finger 1 on string 4 fret 1, finger 3 on string 3 fret 2, and pinky on string 1 fret 2.',
    },
  },

  // ==========================================
  // Open Variations (Fmaj7 & Extensions) (7)
  // ==========================================
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
    hint: {
      es: 'Fa maj7 es como la versión fácil de Fa pero dejando la 1ª cuerda al aire (Mi). Mutea las cuerdas 5 y 6.',
      en: 'Fmaj7 is like open F but leaving string 1 open. Mute strings 5 and 6.',
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
    hint: {
      es: 'Cadd9 mantiene los dedos 3 y 4 en el traste 3 de las cuerdas 1 y 2 (igual que Sol Mayor) mientras colocas los dedos 1 y 2 como en Do Mayor.',
      en: 'Cadd9 anchors fingers 3 and 4 on fret 3 of strings 1 and 2 (like G major).',
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
    hint: {
      es: 'Dsus2 es como Re Mayor pero dejando la 1ª cuerda al aire (sin pisar el traste 2).',
      en: 'Dsus2 is open D major with the 1st string open.',
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
    hint: {
      es: 'Dsus4 es como Re Mayor pero subiendo la 1ª cuerda al traste 3 con el meñique.',
      en: 'Dsus4 is open D major with pinky on string 1 fret 3.',
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
    hint: {
      es: 'Asus2 es como La Mayor pero levantando el dedo de la 2ª cuerda para que suene al aire.',
      en: 'Asus2 is open A major with string 2 ringing open.',
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
    hint: {
      es: 'Asus4 es como La Mayor pero desplazando la 2ª cuerda al traste 3 (dedos en cuerdas 4, 3 y 2 en trastes 2, 2, 3).',
      en: 'Asus4 is open A major with string 2 moved to fret 3.',
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
    hint: {
      es: 'Esus4 es como Mi Mayor pero pisando el traste 2 en la 3ª cuerda con el meñique.',
      en: 'Esus4 is open E major fretting string 3 at fret 2.',
    },
  },

  // ==========================================
  // Barre Chords (Acordes con Cejilla) (9)
  // ==========================================
  {
    id: 'f-major',
    symbol: 'F',
    solfegeName: 'Fa Mayor',
    category: 'barre',
    rootString: 6,
    barre: {
      fret: 1,
      fromString: 6,
      toString: 1,
    },
    strings: [
      { stringNumber: 6, state: 'fretted', fret: 1, finger: 1 },
      { stringNumber: 5, state: 'fretted', fret: 3, finger: 3 },
      { stringNumber: 4, state: 'fretted', fret: 3, finger: 4 },
      { stringNumber: 3, state: 'fretted', fret: 2, finger: 2 },
      { stringNumber: 2, state: 'fretted', fret: 1, finger: 1 },
      { stringNumber: 1, state: 'fretted', fret: 1, finger: 1 },
    ],
    description: {
      en: 'Iconic full 6-string F major barre chord with barre across fret 1 (E shape).',
      es: 'Acorde icónico completo de Fa Mayor con cejilla en el traste 1 (forma de Mi Mayor).',
    },
    hint: {
      es: 'F tiene la misma postura que Mi Mayor (E), pero un traste más abajo con cejilla en el traste 1.',
      en: 'F has the exact same shape as open E major, but shifted one fret down with a barre on fret 1.',
    },
  },
  {
    id: 'f-minor',
    symbol: 'Fm',
    solfegeName: 'Fa menor',
    category: 'barre',
    rootString: 6,
    barre: {
      fret: 1,
      fromString: 6,
      toString: 1,
    },
    strings: [
      { stringNumber: 6, state: 'fretted', fret: 1, finger: 1 },
      { stringNumber: 5, state: 'fretted', fret: 3, finger: 3 },
      { stringNumber: 4, state: 'fretted', fret: 3, finger: 4 },
      { stringNumber: 3, state: 'fretted', fret: 1, finger: 1 },
      { stringNumber: 2, state: 'fretted', fret: 1, finger: 1 },
      { stringNumber: 1, state: 'fretted', fret: 1, finger: 1 },
    ],
    description: {
      en: 'Full 6-string F minor barre chord with barre across fret 1 (E minor shape).',
      es: 'Acorde completo de Fa menor con cejilla en el traste 1 (forma de Mi menor).',
    },
    hint: {
      es: 'Fm es igual a Mi menor (Em), pero un traste más abajo con cejilla en el traste 1.',
      en: 'Fm is identical to open E minor, but shifted one fret down with a barre on fret 1.',
    },
  },
  {
    id: 'f7',
    symbol: 'F7',
    solfegeName: 'Fa 7ª',
    category: 'barre',
    rootString: 6,
    barre: {
      fret: 1,
      fromString: 6,
      toString: 1,
    },
    strings: [
      { stringNumber: 6, state: 'fretted', fret: 1, finger: 1 },
      { stringNumber: 5, state: 'fretted', fret: 3, finger: 3 },
      { stringNumber: 4, state: 'fretted', fret: 1, finger: 1 },
      { stringNumber: 3, state: 'fretted', fret: 2, finger: 2 },
      { stringNumber: 2, state: 'fretted', fret: 1, finger: 1 },
      { stringNumber: 1, state: 'fretted', fret: 1, finger: 1 },
    ],
    description: {
      en: 'F dominant 7th barre chord with barre across fret 1 (E7 shape).',
      es: 'Acorde de Fa 7ª dominante con cejilla en el traste 1 (forma de Mi 7ª).',
    },
    hint: {
      es: 'F7 es igual a Mi 7ª (E7), pero un traste más abajo con cejilla en el traste 1.',
      en: 'F7 is identical to open E7, but shifted one fret down with a barre on fret 1.',
    },
  },
  {
    id: 'f-sharp-major',
    symbol: 'F#',
    solfegeName: 'Fa# Mayor',
    category: 'barre',
    rootString: 6,
    barre: {
      fret: 2,
      fromString: 6,
      toString: 1,
    },
    strings: [
      { stringNumber: 6, state: 'fretted', fret: 2, finger: 1 },
      { stringNumber: 5, state: 'fretted', fret: 4, finger: 3 },
      { stringNumber: 4, state: 'fretted', fret: 4, finger: 4 },
      { stringNumber: 3, state: 'fretted', fret: 3, finger: 2 },
      { stringNumber: 2, state: 'fretted', fret: 2, finger: 1 },
      { stringNumber: 1, state: 'fretted', fret: 2, finger: 1 },
    ],
    description: {
      en: 'F# major barre chord with barre across fret 2 (E major shape).',
      es: 'Acorde de Fa sostenido Mayor con cejilla en el traste 2 (forma de Mi Mayor).',
    },
    hint: {
      es: 'F# tiene la figura de Mi Mayor (E) desplazada dos trastes más abajo con cejilla en el traste 2 (un traste más abajo que F).',
      en: 'F# has the shape of open E major shifted two frets down with a barre on fret 2 (one fret down from F).',
    },
  },
  {
    id: 'f-sharp-minor',
    symbol: 'F#m',
    solfegeName: 'Fa# menor',
    category: 'barre',
    rootString: 6,
    barre: {
      fret: 2,
      fromString: 6,
      toString: 1,
    },
    strings: [
      { stringNumber: 6, state: 'fretted', fret: 2, finger: 1 },
      { stringNumber: 5, state: 'fretted', fret: 4, finger: 3 },
      { stringNumber: 4, state: 'fretted', fret: 4, finger: 4 },
      { stringNumber: 3, state: 'fretted', fret: 2, finger: 1 },
      { stringNumber: 2, state: 'fretted', fret: 2, finger: 1 },
      { stringNumber: 1, state: 'fretted', fret: 2, finger: 1 },
    ],
    description: {
      en: 'F# minor barre chord with barre across fret 2 (E minor shape).',
      es: 'Acorde de Fa sostenido menor con cejilla en el traste 2 (forma de Mi menor).',
    },
    hint: {
      es: 'F#m tiene la figura de Mi menor (Em) desplazada dos trastes más abajo con cejilla en el traste 2 (un traste más abajo que Fm).',
      en: 'F#m has the shape of open E minor shifted two frets down with a barre on fret 2 (one fret down from Fm).',
    },
  },
  {
    id: 'b-flat-major',
    symbol: 'Bb',
    solfegeName: 'Si♭ Mayor',
    category: 'barre',
    rootString: 5,
    barre: {
      fret: 1,
      fromString: 5,
      toString: 1,
    },
    strings: [
      { stringNumber: 6, state: 'muted', fret: null, finger: null },
      { stringNumber: 5, state: 'fretted', fret: 1, finger: 1 },
      { stringNumber: 4, state: 'fretted', fret: 3, finger: 2 },
      { stringNumber: 3, state: 'fretted', fret: 3, finger: 3 },
      { stringNumber: 2, state: 'fretted', fret: 3, finger: 4 },
      { stringNumber: 1, state: 'fretted', fret: 1, finger: 1 },
    ],
    description: {
      en: 'B flat major barre chord with barre across fret 1 (A shape, root on 5th string).',
      es: 'Acorde de Si bemol Mayor con cejilla en el traste 1 (forma de La con tónica en 5ª cuerda).',
    },
    hint: {
      es: 'Bb tiene la misma figura que La Mayor (A), pero un traste más abajo con cejilla en el traste 1 y tónica en la 5ª cuerda.',
      en: 'Bb has the exact shape of open A major, shifted one fret down with a barre on fret 1 (5th string root).',
    },
  },
  {
    id: 'b-flat-minor',
    symbol: 'Bbm',
    solfegeName: 'Si♭ menor',
    category: 'barre',
    rootString: 5,
    barre: {
      fret: 1,
      fromString: 5,
      toString: 1,
    },
    strings: [
      { stringNumber: 6, state: 'muted', fret: null, finger: null },
      { stringNumber: 5, state: 'fretted', fret: 1, finger: 1 },
      { stringNumber: 4, state: 'fretted', fret: 3, finger: 3 },
      { stringNumber: 3, state: 'fretted', fret: 3, finger: 4 },
      { stringNumber: 2, state: 'fretted', fret: 2, finger: 2 },
      { stringNumber: 1, state: 'fretted', fret: 1, finger: 1 },
    ],
    description: {
      en: 'B flat minor barre chord with barre across fret 1 (A minor shape).',
      es: 'Acorde de Si bemol menor con cejilla en el traste 1 (forma de La menor).',
    },
    hint: {
      es: 'Bbm es igual a La menor (Am), pero un traste más abajo con cejilla en el traste 1 y tónica en la 5ª cuerda.',
      en: 'Bbm is identical to open A minor, shifted one fret down with a barre on fret 1 (5th string root).',
    },
  },
  {
    id: 'b-major',
    symbol: 'B',
    solfegeName: 'Si Mayor',
    category: 'barre',
    rootString: 5,
    barre: {
      fret: 2,
      fromString: 5,
      toString: 1,
    },
    strings: [
      { stringNumber: 6, state: 'muted', fret: null, finger: null },
      { stringNumber: 5, state: 'fretted', fret: 2, finger: 1 },
      { stringNumber: 4, state: 'fretted', fret: 4, finger: 2 },
      { stringNumber: 3, state: 'fretted', fret: 4, finger: 3 },
      { stringNumber: 2, state: 'fretted', fret: 4, finger: 4 },
      { stringNumber: 1, state: 'fretted', fret: 2, finger: 1 },
    ],
    description: {
      en: 'Standard B major barre chord with barre across fret 2 (A major shape).',
      es: 'Acorde estándar de Si Mayor con cejilla en el traste 2 (forma de La Mayor).',
    },
    hint: {
      es: 'B (Si Mayor) tiene la misma figura que La Mayor (A), pero dos trastes más abajo con cejilla en el traste 2 (un traste más abajo que Bb).',
      en: 'B has the exact shape of open A major, shifted two frets down with a barre on fret 2 (one fret down from Bb).',
    },
  },
  {
    id: 'b-minor',
    symbol: 'Bm',
    solfegeName: 'Si menor',
    category: 'barre',
    rootString: 5,
    barre: {
      fret: 2,
      fromString: 5,
      toString: 1,
    },
    strings: [
      { stringNumber: 6, state: 'muted', fret: null, finger: null },
      { stringNumber: 5, state: 'fretted', fret: 2, finger: 1 },
      { stringNumber: 4, state: 'fretted', fret: 4, finger: 3 },
      { stringNumber: 3, state: 'fretted', fret: 4, finger: 4 },
      { stringNumber: 2, state: 'fretted', fret: 3, finger: 2 },
      { stringNumber: 1, state: 'fretted', fret: 2, finger: 1 },
    ],
    description: {
      en: 'Essential B minor barre chord with barre across fret 2 (A minor shape).',
      es: 'Acorde indispensable de Si menor con cejilla en el traste 2 (forma de La menor).',
    },
    hint: {
      es: 'Bm (Si menor) es igual a La menor (Am), pero dos trastes más abajo con cejilla en el traste 2 (un traste más abajo que Bbm).',
      en: 'Bm is identical to open A minor, shifted two frets down with a barre on fret 2 (one fret down from Bbm).',
    },
  },
];

/** Lookup map by chord ID for O(1) retrieval */
export const CHORD_BY_ID = new Map<string, ChordDefinition>(
  CHORD_CATALOG.map((chord) => [chord.id, chord])
);
// Legacy compatibility alias for f-beginner
if (CHORD_BY_ID.has('f-major')) {
  CHORD_BY_ID.set('f-beginner', CHORD_BY_ID.get('f-major')!);
}

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
    labelEn: `Select All (${CHORD_CATALOG.length} Chords)`,
    labelEs: `Seleccionar todos (${CHORD_CATALOG.length} acordes)`,
    chordSymbols: CHORD_CATALOG.map((c) => c.symbol),
  },
  {
    id: 'barre-chords',
    labelEn: 'Barre Chords (F-Fm-Bm-B-Bb...)',
    labelEs: 'Acordes con cejilla (F-Fm-Bm-B-Bb...)',
    chordSymbols: ['F', 'Fm', 'F7', 'F#', 'F#m', 'B', 'Bm', 'Bb', 'Bbm'],
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
