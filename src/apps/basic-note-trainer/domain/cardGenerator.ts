/**
 * Flashcard Question Generator
 * Generates continuous streams of 4-choice flashcards with randomized distractor options,
 * pedagogical explanations, and memory tricks for translation, accidentals, and chromatic sequence.
 * Supports both English and Spanish localization.
 * @module apps/basic-note-trainer/domain/cardGenerator
 */

import {
  FlashcardQuestion,
  NaturalLetter,
  SolfegeNote,
  TrainerConfig,
  TranslationDirection,
  Language,
} from '../types';
import {
  NATURAL_LETTERS,
  SOLFEGE_NOTES,
  CHROMATIC_SCALE,
  NATURAL_WHOLE_TONES,
  ENHARMONIC_PAIRS,
  letterToSolfege,
  solfegeToLetter,
  hasNaturalSharp,
  hasNaturalFlat,
  getChromaticIndex,
  getNextChromatic,
  getPreviousChromatic,
} from './musicTheory';
import {
  getTranslationPedagogy,
  getSemitonePedagogy,
  getAccidentalPedagogy,
  getVisualScaleExplanation,
  SEMITONE_MNEMONICS_EN,
  ACCIDENTAL_MNEMONICS_EN,
} from './mnemonics';

/**
 * Fisher-Yates array shuffle (pure, non-mutating)
 */
export function shuffleArray<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Picks N random distinct elements from an array excluding a given target.
 */
function pickDistinctDistractors<T>(pool: readonly T[], exclude: T, count: number): T[] {
  const candidates = pool.filter((item) => item !== exclude);
  const shuffled = shuffleArray(candidates);
  return shuffled.slice(0, count);
}

let cardCounter = 0;
function createUniqueCardId(prefix: string): string {
  cardCounter += 1;
  return `${prefix}_${Date.now()}_${cardCounter}_${Math.random().toString(36).substring(2, 6)}`;
}

export interface TranslationCardOptions {
  direction?: TranslationDirection;
  letter?: NaturalLetter;
  solfege?: SolfegeNote;
  lang?: Language;
  excludeNotes?: string[];
}

/**
 * Generates a note translation card (Letter -> Solfège or Solfège -> Letter).
 */
export function generateTranslationCard(options: TranslationCardOptions = {}): FlashcardQuestion {
  const lang = options.lang ?? 'en';
  let effectiveDir: 'letters-to-solfege' | 'solfege-to-letters';

  if (!options.direction || options.direction === 'both') {
    effectiveDir = Math.random() < 0.5 ? 'letters-to-solfege' : 'solfege-to-letters';
  } else {
    effectiveDir = options.direction;
  }

  const exclude = options.excludeNotes || [];

  if (effectiveDir === 'letters-to-solfege') {
    const candidates = NATURAL_LETTERS.filter((l) => !exclude.includes(l));
    const pool = candidates.length > 0 ? candidates : NATURAL_LETTERS;
    const letter = options.letter ?? pool[Math.floor(Math.random() * pool.length)];
    const correctAnswer = letterToSolfege(letter);
    const distractors = pickDistinctDistractors(SOLFEGE_NOTES, correctAnswer, 3);
    const shuffledOptions = shuffleArray([correctAnswer, ...distractors]) as [string, string, string, string];
    const pedagogy = getTranslationPedagogy(letter, correctAnswer, 'letters-to-solfege', lang);

    const prompt =
      lang === 'es'
        ? `¿Qué nota corresponde a la letra '${letter}'?`
        : `What Solfège note corresponds to letter '${letter}'?`;

    const subPrompt =
      lang === 'es' ? `Cifrado: ${letter} ➔ Solfeo` : `Letter: ${letter} ➔ Solfège`;

    const hint =
      lang === 'es'
        ? `Recuerda la serie: C=Do, D=Re, E=Mi, F=Fa, G=Sol, A=La, B=Si.`
        : `Remember the series: C=Do, D=Re, E=Mi, F=Fa, G=Sol, A=La, B=Si.`;

    return {
      id: createUniqueCardId('trans_l2s'),
      category: 'translation',
      prompt,
      subPrompt,
      options: shuffledOptions,
      correctAnswer,
      hint,
      explanation: pedagogy.explanation,
      mnemonic: pedagogy.mnemonic,
      difficulty: 'beginner',
      noteReference: letter,
    };
  } else {
    const candidates = SOLFEGE_NOTES.filter((s) => !exclude.includes(solfegeToLetter(s)));
    const pool = candidates.length > 0 ? candidates : SOLFEGE_NOTES;
    const solfege = options.solfege ?? pool[Math.floor(Math.random() * pool.length)];
    const correctAnswer = solfegeToLetter(solfege);
    const distractors = pickDistinctDistractors(NATURAL_LETTERS, correctAnswer, 3);
    const shuffledOptions = shuffleArray([correctAnswer, ...distractors]) as [string, string, string, string];
    const pedagogy = getTranslationPedagogy(correctAnswer, solfege, 'solfege-to-letters', lang);

    const prompt =
      lang === 'es'
        ? `¿Qué letra corresponde a la nota '${solfege}'?`
        : `What letter corresponds to note '${solfege}'?`;

    const subPrompt =
      lang === 'es' ? `Solfeo: ${solfege} ➔ Cifrado` : `Solfège: ${solfege} ➔ Letter`;

    const hint =
      lang === 'es'
        ? `Recuerda: Do=C, Re=D, Mi=E, Fa=F, Sol=G, La=A, Si=B.`
        : `Remember: Do=C, Re=D, Mi=E, Fa=F, Sol=G, La=A, Si=B.`;

    return {
      id: createUniqueCardId('trans_s2l'),
      category: 'translation',
      prompt,
      subPrompt,
      options: shuffledOptions,
      correctAnswer,
      hint,
      explanation: pedagogy.explanation,
      mnemonic: pedagogy.mnemonic,
      difficulty: 'beginner',
      noteReference: correctAnswer,
    };
  }
}

/**
 * Generates a question identifying natural semitones (B-C / E-F).
 */
export function generateNaturalSemitoneQuestion(lang: Language = 'en'): FlashcardQuestion {
  const isBC = Math.random() < 0.5;
  const correctAnswer = isBC ? 'B - C' : 'E - F';
  const wholeTonePool = NATURAL_WHOLE_TONES.map(([n1, n2]) => `${n1} - ${n2}`);
  const distractors = pickDistinctDistractors(wholeTonePool, correctAnswer, 3);
  const shuffledOptions = shuffleArray([correctAnswer, ...distractors]) as [string, string, string, string];
  const pedagogy = getSemitonePedagogy('COMBINED', lang);

  const prompt =
    lang === 'es'
      ? '¿Qué pareja de notas naturales forma un semitono natural (sin sostenido ni bemol entre ellas)?'
      : 'Which pair of natural notes forms a natural semitone (no sharp/flat between them)?';

  const subPrompt =
    lang === 'es'
      ? 'Trastes contiguos en la guitarra sin hueco intermedio'
      : 'Adjacent frets on the guitar neck with zero gap';

  const hint =
    lang === 'es'
      ? "¡Recuerda las dos únicas parejas: 'Si-Do' (B-C) y 'Mi-Fa' (E-F)!"
      : 'Remember the mnemonic "Big Cats Eat Fish" (B-C and E-F)!';

  const explanation = `${pedagogy.explanation}\n\n${getVisualScaleExplanation(lang, isBC ? 'B' : 'E')}`;

  return {
    id: createUniqueCardId('acc_semitone'),
    category: 'accidentals',
    prompt,
    subPrompt,
    options: shuffledOptions,
    correctAnswer,
    hint,
    explanation,
    mnemonic: pedagogy.mnemonic,
    difficulty: 'intermediate',
    noteReference: 'B-C / E-F',
  };
}

/**
 * Generates an accidental existence question (Does note X have a natural sharp or flat?).
 * In standard diatonic scale:
 * - Sharps (#): B and E have NO sharp (natural half-step to C and F).
 * - Flats (b): C and F have NO flat (natural half-step down to B and E).
 */
export function generateAccidentalQuestion(
  targetLetter?: NaturalLetter,
  lang: Language = 'en',
  accidentalType?: 'sharp' | 'flat'
): FlashcardQuestion {
  const isEs = lang === 'es';
  const letter = targetLetter ?? NATURAL_LETTERS[Math.floor(Math.random() * NATURAL_LETTERS.length)];

  // Default to sharp if targetLetter is provided without explicit accidentalType (backward compatibility)
  const effectiveType = accidentalType ?? (targetLetter ? 'sharp' : Math.random() < 0.6 ? 'sharp' : 'flat');

  if (effectiveType === 'sharp') {
    const hasSharp = hasNaturalSharp(letter);
    const correctAnswer = hasSharp ? (isEs ? 'Sí' : 'Yes') : 'No';

    const optionsPool = isEs
      ? (['Sí', 'No', 'Solo con bemoles', 'Depende de la octava'] as const)
      : (['Yes', 'No', 'Only in flat keys', 'Depends on octave'] as const);
    const shuffledOptions = shuffleArray(optionsPool) as [string, string, string, string];

    let baseExplanation: string;
    let mnemonic: string;

    if (isEs) {
      baseExplanation = hasSharp
        ? `${letter} está separada por un tono completo (2 trastes) de la siguiente nota, por lo que ${letter}# existe en la notación cromática estándar.`
        : `${letter} NO tiene sostenido en la escala diatónica natural porque de ${letter} a ${letter === 'B' ? 'Do (C)' : 'Fa (F)'} hay un semitono natural inmediato (1 traste, sin alteración intermedia).`;

      mnemonic = hasSharp
        ? getAccidentalPedagogy('SHARP', 'es').mnemonic
        : letter === 'B'
        ? getSemitonePedagogy('BC', 'es').mnemonic
        : getSemitonePedagogy('EF', 'es').mnemonic;
    } else {
      baseExplanation = hasSharp
        ? `${letter} is separated by a whole step (2 frets) from the next note, so ${letter}# exists in standard music notation.`
        : `${letter} has NO sharp in the natural diatonic scale because ${letter} to ${letter === 'B' ? 'C' : 'F'} is an immediate half-step (natural semitone).`;

      mnemonic = hasSharp
        ? ACCIDENTAL_MNEMONICS_EN.SHARP.mnemonic
        : letter === 'B'
        ? SEMITONE_MNEMONICS_EN.BC.mnemonic
        : SEMITONE_MNEMONICS_EN.EF.mnemonic;
    }

    const explanation = `${baseExplanation}\n\n${getVisualScaleExplanation(lang, letter)}`;

    const prompt = isEs
      ? `¿Tiene la nota natural '${letter}' sostenido (#) en la escala diatónica?`
      : `Does natural note '${letter}' have a sharp (#) in the diatonic scale?`;

    const subPrompt = isEs
      ? hasSharp
        ? 'Paso de tono entero estándar (2 trastes)'
        : 'Excepción de semitono natural (1 traste)'
      : hasSharp
      ? 'Standard whole-tone step (2 frets)'
      : 'Natural half-step exception (1 fret)';

    const hint = isEs
      ? `¡Recuerda si '${letter}' es una de las excepciones 'Si-Do y Mi-Fa'!`
      : `Recall if '${letter}' is one of the 'Big Cats Eat Fish' exceptions!`;

    return {
      id: createUniqueCardId('acc_has_sharp'),
      category: 'accidentals',
      prompt,
      subPrompt,
      options: shuffledOptions,
      correctAnswer,
      hint,
      explanation,
      mnemonic,
      difficulty: 'beginner',
      noteReference: letter,
    };
  } else {
    // Flat (bemol) existence question
    const hasFlat = hasNaturalFlat(letter);
    const correctAnswer = hasFlat ? (isEs ? 'Sí' : 'Yes') : 'No';

    const optionsPool = isEs
      ? (['Sí', 'No', 'Solo con sostenidos', 'Depende de la afinación'] as const)
      : (['Yes', 'No', 'Only with sharps', 'Depends on tuning'] as const);
    const shuffledOptions = shuffleArray(optionsPool) as [string, string, string, string];

    let baseExplanation: string;
    let mnemonic: string;

    if (isEs) {
      baseExplanation = hasFlat
        ? `${letter} tiene bemol (${letter}b) porque está separada por un tono completo hacia la nota inferior en la escala cromática estándar.`
        : `${letter} NO tiene bemol en la escala diatónica natural porque un semitono por debajo está directamente ${letter === 'C' ? 'Si (B)' : 'Mi (E)'} (semitono natural directo).`;

      mnemonic = hasFlat
        ? getAccidentalPedagogy('FLAT', 'es').mnemonic
        : letter === 'C'
        ? getSemitonePedagogy('BC', 'es').mnemonic
        : getSemitonePedagogy('EF', 'es').mnemonic;
    } else {
      baseExplanation = hasFlat
        ? `${letter} has a flat (${letter}b) because it is separated by a whole step from the natural note below.`
        : `${letter} has NO flat in the natural diatonic scale because half a step below lands directly on ${letter === 'C' ? 'B' : 'E'} (natural semitone).`;

      mnemonic = hasFlat
        ? ACCIDENTAL_MNEMONICS_EN.FLAT.mnemonic
        : letter === 'C'
        ? SEMITONE_MNEMONICS_EN.BC.mnemonic
        : SEMITONE_MNEMONICS_EN.EF.mnemonic;
    }

    const explanation = `${baseExplanation}\n\n${getVisualScaleExplanation(lang, letter)}`;

    const prompt = isEs
      ? `¿Tiene la nota natural '${letter}' bemol (b) en la escala diatónica?`
      : `Does natural note '${letter}' have a flat (b) in the diatonic scale?`;

    const subPrompt = isEs
      ? hasFlat
        ? 'Paso de tono hacia el grave (2 trastes)'
        : 'Excepción de semitono hacia el grave (1 traste)'
      : hasFlat
      ? 'Standard whole-tone step downward (2 frets)'
      : 'Natural half-step downward exception (1 fret)';

    const hint = isEs
      ? `Recuerda: medio tono por debajo de Do (C) está Si (B), y por debajo de Fa (F) está Mi (E).`
      : `Remember: a half-step below C is B, and below F is E.`;

    return {
      id: createUniqueCardId('acc_has_flat'),
      category: 'accidentals',
      prompt,
      subPrompt,
      options: shuffledOptions,
      correctAnswer,
      hint,
      explanation,
      mnemonic,
      difficulty: 'beginner',
      noteReference: letter,
    };
  }
}

/**
 * Generates an enharmonic equivalence question linking sharps (#) and flats (b).
 * Demonstrates that C# sounds identical to Db, etc.
 */
export function generateEnharmonicQuestion(lang: Language = 'en'): FlashcardQuestion {
  const isEs = lang === 'es';
  const pair = ENHARMONIC_PAIRS[Math.floor(Math.random() * ENHARMONIC_PAIRS.length)];
  const isSharpToFlat = Math.random() < 0.5;

  if (isSharpToFlat) {
    const correctAnswer = isEs ? `${pair.flat} (${pair.solfegeFlat})` : pair.flat;
    const candidates = ENHARMONIC_PAIRS.filter((p) => p.flat !== pair.flat);
    const distractors = candidates.slice(0, 3).map((p) => (isEs ? `${p.flat} (${p.solfegeFlat})` : p.flat));
    const shuffledOptions = shuffleArray([correctAnswer, ...distractors]) as [string, string, string, string];

    const prompt = isEs
      ? `¿Qué nota con bemol (b) produce el mismo sonido que '${pair.sharp}'?`
      : `Which flat (b) note produces the exact same sound as '${pair.sharp}'?`;

    const subPrompt = isEs
      ? 'Enarmonía: mismo traste en la guitarra, dos nombres'
      : 'Enharmonics: same fret on guitar, two different names';

    const hint = isEs
      ? `El sostenido (#) sube desde la nota inferior; el bemol (b) baja desde la superior.`
      : `Sharps (#) raise from below; flats (b) lower from above.`;

    const baseExplanation = isEs
      ? `${pair.sharp} y ${pair.flat} (${pair.solfegeSharp} y ${pair.solfegeFlat}) son notas enarmónicas: suenan exactamente igual y se tocan en el mismo traste de la guitarra.`
      : `${pair.sharp} and ${pair.flat} are enharmonic notes: they sound identical and are played on the exact same fret.`;

    const explanation = `${baseExplanation}\n\n${getVisualScaleExplanation(lang, pair.sharp)}`;

    const mnemonic = isEs
      ? `Enarmonía: ${pair.sharp} = ${pair.flat} (${pair.solfegeSharp} = ${pair.solfegeFlat})`
      : `Enharmonic: ${pair.sharp} = ${pair.flat}`;

    return {
      id: createUniqueCardId('acc_enharmonic'),
      category: 'accidentals',
      prompt,
      subPrompt,
      options: shuffledOptions,
      correctAnswer,
      hint,
      explanation,
      mnemonic,
      difficulty: 'intermediate',
      noteReference: `${pair.sharp} / ${pair.flat}`,
    };
  } else {
    const correctAnswer = isEs ? `${pair.sharp} (${pair.solfegeSharp})` : pair.sharp;
    const candidates = ENHARMONIC_PAIRS.filter((p) => p.sharp !== pair.sharp);
    const distractors = candidates.slice(0, 3).map((p) => (isEs ? `${p.sharp} (${p.solfegeSharp})` : p.sharp));
    const shuffledOptions = shuffleArray([correctAnswer, ...distractors]) as [string, string, string, string];

    const prompt = isEs
      ? `¿Qué nota con sostenido (#) produce el mismo sonido que '${pair.flat}'?`
      : `Which sharp (#) note produces the exact same sound as '${pair.flat}'?`;

    const subPrompt = isEs
      ? 'Enarmonía: mismo traste en la guitarra, dos nombres'
      : 'Enharmonics: same fret on guitar, two different names';

    const hint = isEs
      ? `El bemol (b) baja desde la nota superior; el sostenido (#) sube desde la inferior.`
      : `Flats (b) lower from above; sharps (#) raise from below.`;

    const baseExplanation = isEs
      ? `${pair.flat} y ${pair.sharp} (${pair.solfegeFlat} y ${pair.solfegeSharp}) son notas enarmónicas: suenan exactamente igual y se tocan en el mismo traste de la guitarra.`
      : `${pair.flat} and ${pair.sharp} are enharmonic notes: they sound identical and are played on the exact same fret.`;

    const explanation = `${baseExplanation}\n\n${getVisualScaleExplanation(lang, pair.flat)}`;

    const mnemonic = isEs
      ? `Enarmonía: ${pair.flat} = ${pair.sharp} (${pair.solfegeFlat} = ${pair.solfegeSharp})`
      : `Enharmonic: ${pair.flat} = ${pair.sharp}`;

    return {
      id: createUniqueCardId('acc_enharmonic'),
      category: 'accidentals',
      prompt,
      subPrompt,
      options: shuffledOptions,
      correctAnswer,
      hint,
      explanation,
      mnemonic,
      difficulty: 'intermediate',
      noteReference: `${pair.sharp} / ${pair.flat}`,
    };
  }
}

/**
 * Generates next chromatic note question (1 half-step up).
 */
export function generateNextChromaticQuestion(
  targetLetter?: NaturalLetter,
  lang: Language = 'en'
): FlashcardQuestion {
  const letter = targetLetter ?? NATURAL_LETTERS[Math.floor(Math.random() * NATURAL_LETTERS.length)];
  const chromaticIdx = getChromaticIndex(letter);
  const nextPitch = getNextChromatic(chromaticIdx);
  const correctAnswer = nextPitch.name;
  const isEs = lang === 'es';

  const pitchPool = CHROMATIC_SCALE.map((p) => p.name);
  const distractors = pickDistinctDistractors(pitchPool, correctAnswer, 3);
  const shuffledOptions = shuffleArray([correctAnswer, ...distractors]) as [string, string, string, string];

  const isNaturalSemitone = letter === 'B' || letter === 'E';

  let baseExplanation: string;
  let mnemonic: string;

  if (isEs) {
    baseExplanation = isNaturalSemitone
      ? `Subir medio tono (1 traste hacia el puente) desde ${letter} lleva directamente a ${correctAnswer} porque es un semitono natural (sin sostenido intermedio).`
      : `Subir medio tono (1 traste hacia el puente) desde ${letter} sube la altura a la alteración ${correctAnswer}.`;

    mnemonic = isNaturalSemitone
      ? letter === 'B'
        ? getSemitonePedagogy('BC', 'es').mnemonic
        : getSemitonePedagogy('EF', 'es').mnemonic
      : getAccidentalPedagogy('SHARP', 'es').mnemonic;
  } else {
    baseExplanation = isNaturalSemitone
      ? `Moving 1 half-step up (1 fret toward body) from ${letter} lands directly on ${correctAnswer} because it is a natural semitone.`
      : `Moving 1 half-step up (1 fret toward body) from ${letter} raises the pitch to accidental ${correctAnswer}.`;

    mnemonic = isNaturalSemitone
      ? letter === 'B'
        ? SEMITONE_MNEMONICS_EN.BC.mnemonic
        : SEMITONE_MNEMONICS_EN.EF.mnemonic
      : ACCIDENTAL_MNEMONICS_EN.SHARP.mnemonic;
  }

  const explanation = `${baseExplanation}\n\n${getVisualScaleExplanation(lang, letter)}`;

  const prompt = isEs
    ? `¿Qué nota está un semitono (1 traste arriba) por encima de '${letter}'?`
    : `What note is one half-step (1 fret up) above '${letter}'?`;

  const subPrompt = isEs
    ? 'Secuencia cromática y navegación en el diapasón'
    : 'Chromatic sequence and fretboard navigation';

  const hint = isEs
    ? `¿A '${letter}' le sigue una nota natural directa o un sostenido?`
    : `Is '${letter}' followed by a direct natural note or a sharp?`;

  return {
    id: createUniqueCardId('seq_next'),
    category: 'sequence',
    prompt,
    subPrompt,
    options: shuffledOptions,
    correctAnswer,
    hint,
    explanation,
    mnemonic,
    difficulty: 'intermediate',
    noteReference: letter,
  };
}

/**
 * Generates previous chromatic note question (1 half-step down).
 */
export function generatePreviousChromaticQuestion(
  targetLetter?: NaturalLetter,
  lang: Language = 'en'
): FlashcardQuestion {
  const letter = targetLetter ?? NATURAL_LETTERS[Math.floor(Math.random() * NATURAL_LETTERS.length)];
  const chromaticIdx = getChromaticIndex(letter);
  const prevPitch = getPreviousChromatic(chromaticIdx);
  const correctAnswer = prevPitch.name;
  const isEs = lang === 'es';

  const pitchPool = CHROMATIC_SCALE.map((p) => p.name);
  const distractors = pickDistinctDistractors(pitchPool, correctAnswer, 3);
  const shuffledOptions = shuffleArray([correctAnswer, ...distractors]) as [string, string, string, string];

  const isNaturalSemitoneDown = letter === 'C' || letter === 'F';

  let baseExplanation: string;
  let mnemonic: string;

  if (isEs) {
    baseExplanation = isNaturalSemitoneDown
      ? `Bajar medio tono (1 traste hacia la pala) desde ${letter} lleva directamente a ${correctAnswer} porque es un semitono natural.`
      : `Bajar medio tono (1 traste hacia la pala) desde ${letter} baja la altura a la nota alterada ${correctAnswer}.`;

    mnemonic = isNaturalSemitoneDown
      ? letter === 'C'
        ? getSemitonePedagogy('BC', 'es').mnemonic
        : getSemitonePedagogy('EF', 'es').mnemonic
      : getAccidentalPedagogy('FLAT', 'es').mnemonic;
  } else {
    baseExplanation = isNaturalSemitoneDown
      ? `Moving 1 half-step down (1 fret toward headstock) from ${letter} lands directly on ${correctAnswer} because it is a natural semitone.`
      : `Moving 1 half-step down (1 fret toward headstock) from ${letter} lowers the pitch to ${correctAnswer}.`;

    mnemonic = isNaturalSemitoneDown
      ? letter === 'C'
        ? SEMITONE_MNEMONICS_EN.BC.mnemonic
        : SEMITONE_MNEMONICS_EN.EF.mnemonic
      : ACCIDENTAL_MNEMONICS_EN.FLAT.mnemonic;
  }

  const explanation = `${baseExplanation}\n\n${getVisualScaleExplanation(lang, letter)}`;

  const prompt = isEs
    ? `¿Qué nota está un semitono (1 traste abajo) por debajo de '${letter}'?`
    : `What note is one half-step (1 fret down) below '${letter}'?`;

  const subPrompt = isEs
    ? 'Secuencia cromática descendente hacia los graves'
    : 'Descending chromatic step toward lower pitch';

  const hint = isEs
    ? `Recuerda si por debajo de '${letter}' hay una nota natural directa o un bemol.`
    : `Recall whether a natural semitone sits immediately below '${letter}'.`;

  return {
    id: createUniqueCardId('seq_prev'),
    category: 'sequence',
    prompt,
    subPrompt,
    options: shuffledOptions,
    correctAnswer,
    hint,
    explanation,
    mnemonic,
    difficulty: 'intermediate',
    noteReference: letter,
  };
}

/**
 * Master card generator taking full trainer configuration into account.
 */
export function generateCard(
  config: TrainerConfig,
  reviewQueue: string[] = [],
  excludeNotes: string[] = []
): FlashcardQuestion {
  const lang = config.lang ?? 'en';

  // If reviewQueue has items, prioritize reinforcing missed notes
  let targetLetter: NaturalLetter | undefined;
  if (reviewQueue.length > 0) {
    const candidate = reviewQueue[0];
    if (NATURAL_LETTERS.includes(candidate as NaturalLetter)) {
      targetLetter = candidate as NaturalLetter;
    }
  }

  const pickNaturalLetter = (): NaturalLetter => {
    if (targetLetter) return targetLetter;
    const candidates = NATURAL_LETTERS.filter((l) => !excludeNotes.includes(l));
    const pool = candidates.length > 0 ? candidates : NATURAL_LETTERS;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  // Translation mode
  if (config.mode === 'translation') {
    return generateTranslationCard({
      direction: config.direction,
      letter: targetLetter,
      lang,
      excludeNotes,
    });
  }

  // Accidentals mode
  if (config.mode === 'accidentals') {
    const roll = Math.random();
    if (roll < 0.25) {
      return generateNaturalSemitoneQuestion(lang);
    }
    const chosenLetter = pickNaturalLetter();
    if (roll < 0.50) {
      return generateAccidentalQuestion(chosenLetter, lang);
    }
    if (roll < 0.75) {
      return generateEnharmonicQuestion(lang);
    }
    return Math.random() < 0.5
      ? generateNextChromaticQuestion(chosenLetter, lang)
      : generatePreviousChromaticQuestion(chosenLetter, lang);
  }

  // Mixed mode: 50% translation, 50% accidentals/sequence
  const roll = Math.random();
  if (roll < 0.5) {
    return generateTranslationCard({
      direction: config.direction,
      letter: targetLetter,
      lang,
      excludeNotes,
    });
  }

  const accidentalRoll = Math.random();
  if (accidentalRoll < 0.25) {
    return generateNaturalSemitoneQuestion(lang);
  }
  const chosenLetter = pickNaturalLetter();
  if (accidentalRoll < 0.50) {
    return generateAccidentalQuestion(chosenLetter, lang);
  }
  if (accidentalRoll < 0.75) {
    return generateEnharmonicQuestion(lang);
  }
  return Math.random() < 0.5
    ? generateNextChromaticQuestion(chosenLetter, lang)
    : generatePreviousChromaticQuestion(chosenLetter, lang);
}

/**
 * Retranslates an existing active card in-place to a new language while maintaining context.
 */
export function retranslateCard(card: FlashcardQuestion, lang: Language): FlashcardQuestion {
  const isEs = lang === 'es';

  // 1. Translation category
  if (card.category === 'translation') {
    const isLettersToSolfege = SOLFEGE_NOTES.includes(card.correctAnswer as SolfegeNote);
    if (isLettersToSolfege) {
      const letter = card.noteReference as NaturalLetter;
      const solfege = card.correctAnswer as SolfegeNote;
      const pedagogy = getTranslationPedagogy(letter, solfege, 'letters-to-solfege', lang);
      return {
        ...card,
        prompt: isEs
          ? `¿Qué nota corresponde a la letra '${letter}'?`
          : `What Solfège note corresponds to letter '${letter}'?`,
        subPrompt: isEs ? `Cifrado: ${letter} ➔ Solfeo` : `Letter: ${letter} ➔ Solfège`,
        hint: isEs
          ? `Recuerda la serie: C=Do, D=Re, E=Mi, F=Fa, G=Sol, A=La, B=Si.`
          : `Remember the series: C=Do, D=Re, E=Mi, F=Fa, G=Sol, A=La, B=Si.`,
        explanation: pedagogy.explanation,
        mnemonic: pedagogy.mnemonic,
      };
    } else {
      const letter = card.correctAnswer as NaturalLetter;
      const solfege = letterToSolfege(letter);
      const pedagogy = getTranslationPedagogy(letter, solfege, 'solfege-to-letters', lang);
      return {
        ...card,
        prompt: isEs
          ? `¿Qué letra corresponde a la nota '${solfege}'?`
          : `What letter corresponds to note '${solfege}'?`,
        subPrompt: isEs ? `Solfeo: ${solfege} ➔ Cifrado` : `Solfège: ${solfege} ➔ Letter`,
        hint: isEs
          ? `Recuerda: Do=C, Re=D, Mi=E, Fa=F, Sol=G, La=A, Si=B.`
          : `Remember: Do=C, Re=D, Mi=E, Fa=F, Sol=G, La=A, Si=B.`,
        explanation: pedagogy.explanation,
        mnemonic: pedagogy.mnemonic,
      };
    }
  }

  // 2. Accidentals category: natural semitones
  if (card.category === 'accidentals' && card.id.startsWith('acc_semitone')) {
    const pedagogy = getSemitonePedagogy('COMBINED', lang);
    const focusLetter = card.correctAnswer.startsWith('B') ? 'B' : 'E';
    return {
      ...card,
      prompt: isEs
        ? '¿Qué pareja de notas naturales forma un semitono natural (sin sostenido ni bemol entre ellas)?'
        : 'Which pair of natural notes forms a natural semitone (no sharp/flat between them)?',
      subPrompt: isEs
        ? 'Trastes contiguos en la guitarra sin hueco intermedio'
        : 'Adjacent frets on the guitar neck with zero gap',
      hint: isEs
        ? "¡Recuerda las dos únicas parejas: 'Si-Do' (B-C) y 'Mi-Fa' (E-F)!"
        : 'Remember the mnemonic "Big Cats Eat Fish" (B-C and E-F)!',
      explanation: `${pedagogy.explanation}\n\n${getVisualScaleExplanation(lang, focusLetter)}`,
      mnemonic: pedagogy.mnemonic,
    };
  }

  // 3. Accidentals category: enharmonics
  if (card.category === 'accidentals' && card.id.startsWith('acc_enharmonic')) {
    const isSharpToFlat = card.prompt.includes('bemol') || card.prompt.includes('flat');
    const pair = ENHARMONIC_PAIRS.find(
      (p) => card.noteReference.includes(p.sharp) && card.noteReference.includes(p.flat)
    ) ?? ENHARMONIC_PAIRS[0];

    if (isSharpToFlat) {
      const correctAnswer = isEs ? `${pair.flat} (${pair.solfegeFlat})` : pair.flat;
      const options = card.options.map((opt) => {
        const found = ENHARMONIC_PAIRS.find((p) => opt.startsWith(p.flat));
        if (found) return isEs ? `${found.flat} (${found.solfegeFlat})` : found.flat;
        return opt;
      }) as [string, string, string, string];

      const baseExplanation = isEs
        ? `${pair.sharp} y ${pair.flat} (${pair.solfegeSharp} y ${pair.solfegeFlat}) son notas enarmónicas: suenan exactamente igual y se tocan en el mismo traste de la guitarra.`
        : `${pair.sharp} and ${pair.flat} are enharmonic notes: they sound identical and are played on the exact same fret.`;

      return {
        ...card,
        prompt: isEs
          ? `¿Qué nota con bemol (b) produce el mismo sonido que '${pair.sharp}'?`
          : `Which flat (b) note produces the exact same sound as '${pair.sharp}'?`,
        subPrompt: isEs
          ? 'Enarmonía: mismo traste en la guitarra, dos nombres'
          : 'Enharmonics: same fret on guitar, two different names',
        hint: isEs
          ? `El sostenido (#) sube desde la nota inferior; el bemol (b) baja desde la superior.`
          : `Sharps (#) raise from below; flats (b) lower from above.`,
        options,
        correctAnswer,
        explanation: `${baseExplanation}\n\n${getVisualScaleExplanation(lang, pair.sharp)}`,
        mnemonic: isEs
          ? `Enarmonía: ${pair.sharp} = ${pair.flat} (${pair.solfegeSharp} = ${pair.solfegeFlat})`
          : `Enharmonic: ${pair.sharp} = ${pair.flat}`,
      };
    } else {
      const correctAnswer = isEs ? `${pair.sharp} (${pair.solfegeSharp})` : pair.sharp;
      const options = card.options.map((opt) => {
        const found = ENHARMONIC_PAIRS.find((p) => opt.startsWith(p.sharp));
        if (found) return isEs ? `${found.sharp} (${found.solfegeSharp})` : found.sharp;
        return opt;
      }) as [string, string, string, string];

      const baseExplanation = isEs
        ? `${pair.flat} y ${pair.sharp} (${pair.solfegeFlat} y ${pair.solfegeSharp}) son notas enarmónicas: suenan exactamente igual y se tocan en el mismo traste de la guitarra.`
        : `${pair.flat} and ${pair.sharp} are enharmonic notes: they sound identical and are played on the exact same fret.`;

      return {
        ...card,
        prompt: isEs
          ? `¿Qué nota con sostenido (#) produce el mismo sonido que '${pair.flat}'?`
          : `Which sharp (#) note produces the exact same sound as '${pair.flat}'?`,
        subPrompt: isEs
          ? 'Enarmonía: mismo traste en la guitarra, dos nombres'
          : 'Enharmonics: same fret on guitar, two different names',
        hint: isEs
          ? `El bemol (b) baja desde la nota superior; el sostenido (#) sube desde la inferior.`
          : `Flats (b) lower from above; sharps (#) raise from below.`,
        options,
        correctAnswer,
        explanation: `${baseExplanation}\n\n${getVisualScaleExplanation(lang, pair.flat)}`,
        mnemonic: isEs
          ? `Enarmonía: ${pair.flat} = ${pair.sharp} (${pair.solfegeFlat} = ${pair.solfegeSharp})`
          : `Enharmonic: ${pair.flat} = ${pair.sharp}`,
      };
    }
  }

  // 4. Accidentals category: has accidental (sharp or flat)
  if (card.category === 'accidentals' && (card.id.startsWith('acc_has') || card.id.startsWith('acc_has_sharp') || card.id.startsWith('acc_has_flat'))) {
    const letter = card.noteReference as NaturalLetter;
    const isFlatCard = card.id.includes('flat') || card.prompt.includes('bemol') || card.prompt.includes('flat');

    if (isFlatCard) {
      const hasFlat = hasNaturalFlat(letter);
      const correctAnswer = hasFlat ? (isEs ? 'Sí' : 'Yes') : 'No';

      const options = card.options.map((opt) => {
        if (opt === 'Yes' || opt === 'Sí') return isEs ? 'Sí' : 'Yes';
        if (opt === 'No') return 'No';
        if (opt === 'Only with sharps' || opt === 'Solo con sostenidos') {
          return isEs ? 'Solo con sostenidos' : 'Only with sharps';
        }
        if (opt === 'Depends on tuning' || opt === 'Depende de la afinación') {
          return isEs ? 'Depende de la afinación' : 'Depends on tuning';
        }
        return opt;
      }) as [string, string, string, string];

      const baseExplanation = isEs
        ? hasFlat
          ? `${letter} tiene bemol (${letter}b) porque está separada por un tono completo hacia la nota inferior en la escala cromática estándar.`
          : `${letter} NO tiene bemol en la escala diatónica natural porque un semitono por debajo está directamente ${letter === 'C' ? 'Si (B)' : 'Mi (E)'} (semitono natural directo).`
        : hasFlat
        ? `${letter} has a flat (${letter}b) because it is separated by a whole step from the natural note below.`
        : `${letter} has NO flat in the natural diatonic scale because half a step below lands directly on ${letter === 'C' ? 'B' : 'E'} (natural semitone).`;

      const mnemonic = isEs
        ? hasFlat
          ? getAccidentalPedagogy('FLAT', 'es').mnemonic
          : letter === 'C'
          ? getSemitonePedagogy('BC', 'es').mnemonic
          : getSemitonePedagogy('EF', 'es').mnemonic
        : hasFlat
        ? ACCIDENTAL_MNEMONICS_EN.FLAT.mnemonic
        : letter === 'C'
        ? SEMITONE_MNEMONICS_EN.BC.mnemonic
        : SEMITONE_MNEMONICS_EN.EF.mnemonic;

      return {
        ...card,
        prompt: isEs
          ? `¿Tiene la nota natural '${letter}' bemol (b) en la escala diatónica?`
          : `Does natural note '${letter}' have a flat (b) in the diatonic scale?`,
        subPrompt: isEs
          ? hasFlat
            ? 'Paso de tono hacia el grave (2 trastes)'
            : 'Excepción de semitono hacia el grave (1 traste)'
          : hasFlat
          ? 'Standard whole-tone step downward (2 frets)'
          : 'Natural half-step downward exception (1 fret)',
        hint: isEs
          ? `Recuerda: medio tono por debajo de Do (C) está Si (B), y por debajo de Fa (F) está Mi (E).`
          : `Remember: a half-step below C is B, and below F is E.`,
        options,
        correctAnswer,
        explanation: `${baseExplanation}\n\n${getVisualScaleExplanation(lang, letter)}`,
        mnemonic,
      };
    } else {
      const hasSharp = hasNaturalSharp(letter);
      const correctAnswer = hasSharp ? (isEs ? 'Sí' : 'Yes') : 'No';

      const options = card.options.map((opt) => {
        if (opt === 'Yes' || opt === 'Sí') return isEs ? 'Sí' : 'Yes';
        if (opt === 'No') return 'No';
        if (opt === 'Only in flat keys' || opt === 'Solo con bemoles') {
          return isEs ? 'Solo con bemoles' : 'Only in flat keys';
        }
        if (opt === 'Depends on octave' || opt === 'Depende de la octava') {
          return isEs ? 'Depende de la octava' : 'Depends on octave';
        }
        return opt;
      }) as [string, string, string, string];

      const baseExplanation = isEs
        ? hasSharp
          ? `${letter} está separada por un tono completo (2 trastes) de la siguiente nota, por lo que ${letter}# existe en la notación cromática estándar.`
          : `${letter} NO tiene sostenido en la escala diatónica natural porque de ${letter} a ${letter === 'B' ? 'Do (C)' : 'Fa (F)'} hay un semitono natural inmediato (1 traste, sin alteración intermedia).`
        : hasSharp
        ? `${letter} is separated by a whole step (2 frets) from the next note, so ${letter}# exists in standard music notation.`
        : `${letter} has NO sharp in the natural diatonic scale because ${letter} to ${letter === 'B' ? 'C' : 'F'} is an immediate half-step (natural semitone).`;

      const mnemonic = hasSharp
        ? (isEs ? getAccidentalPedagogy('SHARP', 'es').mnemonic : ACCIDENTAL_MNEMONICS_EN.SHARP.mnemonic)
        : letter === 'B'
        ? (isEs ? getSemitonePedagogy('BC', 'es').mnemonic : SEMITONE_MNEMONICS_EN.BC.mnemonic)
        : (isEs ? getSemitonePedagogy('EF', 'es').mnemonic : SEMITONE_MNEMONICS_EN.EF.mnemonic);

      return {
        ...card,
        prompt: isEs
          ? `¿Tiene la nota natural '${letter}' sostenido (#) en la escala diatónica?`
          : `Does natural note '${letter}' have a sharp (#) in the diatonic scale?`,
        subPrompt: isEs
          ? hasSharp
            ? 'Paso de tono entero estándar (2 trastes)'
            : 'Excepción de semitono natural (1 traste)'
          : hasSharp
          ? 'Standard whole-tone step (2 frets)'
          : 'Natural half-step exception (1 fret)',
        hint: isEs
          ? `¡Recuerda si '${letter}' es una de las excepciones 'Si-Do y Mi-Fa'!`
          : `Recall if '${letter}' is one of the 'Big Cats Eat Fish' exceptions!`,
        options,
        correctAnswer,
        explanation: `${baseExplanation}\n\n${getVisualScaleExplanation(lang, letter)}`,
        mnemonic,
      };
    }
  }

  // 5. Sequence category: next chromatic
  if (card.category === 'sequence' && card.id.startsWith('seq_next')) {
    const letter = card.noteReference as NaturalLetter;
    const isNaturalSemitone = letter === 'B' || letter === 'E';

    let baseExplanation: string;
    let mnemonic: string;

    if (isEs) {
      baseExplanation = isNaturalSemitone
        ? `Subir medio tono (1 traste hacia el puente) desde ${letter} lleva directamente a ${card.correctAnswer} porque es un semitono natural (sin sostenido intermedio).`
        : `Subir medio tono (1 traste hacia el puente) desde ${letter} sube la altura a la alteración ${card.correctAnswer}.`;

      mnemonic = isNaturalSemitone
        ? letter === 'B'
          ? getSemitonePedagogy('BC', 'es').mnemonic
          : getSemitonePedagogy('EF', 'es').mnemonic
        : getAccidentalPedagogy('SHARP', 'es').mnemonic;
    } else {
      baseExplanation = isNaturalSemitone
        ? `Moving 1 half-step up (1 fret toward body) from ${letter} lands directly on ${card.correctAnswer} because it is a natural semitone.`
        : `Moving 1 half-step up (1 fret toward body) from ${letter} raises the pitch to accidental ${card.correctAnswer}.`;

      mnemonic = isNaturalSemitone
        ? letter === 'B'
          ? SEMITONE_MNEMONICS_EN.BC.mnemonic
          : SEMITONE_MNEMONICS_EN.EF.mnemonic
        : ACCIDENTAL_MNEMONICS_EN.SHARP.mnemonic;
    }

    return {
      ...card,
      prompt: isEs
        ? `¿Qué nota está un semitono (1 traste arriba) por encima de '${letter}'?`
        : `What note is one half-step (1 fret up) above '${letter}'?`,
      subPrompt: isEs
        ? 'Secuencia cromática y navegación en el diapasón'
        : 'Chromatic sequence and fretboard navigation',
      hint: isEs
        ? `¿A '${letter}' le sigue una nota natural directa o un sostenido?`
        : `Is '${letter}' followed by a direct natural note or a sharp?`,
      explanation: `${baseExplanation}\n\n${getVisualScaleExplanation(lang, letter)}`,
      mnemonic,
    };
  }

  // 6. Sequence category: previous chromatic
  if (card.category === 'sequence' && card.id.startsWith('seq_prev')) {
    const letter = card.noteReference as NaturalLetter;
    const isNaturalSemitoneDown = letter === 'C' || letter === 'F';

    let baseExplanation: string;
    let mnemonic: string;

    if (isEs) {
      baseExplanation = isNaturalSemitoneDown
        ? `Bajar medio tono (1 traste hacia la pala) desde ${letter} lleva directamente a ${card.correctAnswer} porque es un semitono natural.`
        : `Bajar medio tono (1 traste hacia la pala) desde ${letter} baja la altura a la nota alterada ${card.correctAnswer}.`;

      mnemonic = isNaturalSemitoneDown
        ? letter === 'C'
          ? getSemitonePedagogy('BC', 'es').mnemonic
          : getSemitonePedagogy('EF', 'es').mnemonic
        : getAccidentalPedagogy('FLAT', 'es').mnemonic;
    } else {
      baseExplanation = isNaturalSemitoneDown
        ? `Moving 1 half-step down (1 fret toward headstock) from ${letter} lands directly on ${card.correctAnswer} because it is a natural semitone.`
        : `Moving 1 half-step down (1 fret toward headstock) from ${letter} lowers the pitch to ${card.correctAnswer}.`;

      mnemonic = isNaturalSemitoneDown
        ? letter === 'C'
          ? SEMITONE_MNEMONICS_EN.BC.mnemonic
          : SEMITONE_MNEMONICS_EN.EF.mnemonic
        : ACCIDENTAL_MNEMONICS_EN.FLAT.mnemonic;
    }

    return {
      ...card,
      prompt: isEs
        ? `¿Qué nota está un semitono (1 traste abajo) por debajo de '${letter}'?`
        : `What note is one half-step (1 fret down) below '${letter}'?`,
      subPrompt: isEs
        ? 'Secuencia cromática descendente hacia los graves'
        : 'Descending chromatic step toward lower pitch',
      hint: isEs
        ? `Recuerda si por debajo de '${letter}' hay una nota natural directa o un bemol.`
        : `Recall whether a natural semitone sits immediately below '${letter}'.`,
      explanation: `${baseExplanation}\n\n${getVisualScaleExplanation(lang, letter)}`,
      mnemonic,
    };
  }

  return card;
}
