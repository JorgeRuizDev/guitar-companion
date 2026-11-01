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
  letterToSolfege,
  solfegeToLetter,
  hasNaturalSharp,
  getChromaticIndex,
  getNextChromatic,
} from './musicTheory';
import {
  getTranslationPedagogy,
  getSemitonePedagogy,
  getAccidentalPedagogy,
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

  if (effectiveDir === 'letters-to-solfege') {
    const letter = options.letter ?? NATURAL_LETTERS[Math.floor(Math.random() * NATURAL_LETTERS.length)];
    const correctAnswer = letterToSolfege(letter);
    const distractors = pickDistinctDistractors(SOLFEGE_NOTES, correctAnswer, 3);
    const shuffledOptions = shuffleArray([correctAnswer, ...distractors]) as [string, string, string, string];
    const pedagogy = getTranslationPedagogy(letter, correctAnswer, 'letters-to-solfege', lang);

    const prompt =
      lang === 'es'
        ? `¿Qué nota europea (solfeo) corresponde a '${letter}'?`
        : `What European Solfège note corresponds to '${letter}'?`;

    const subPrompt =
      lang === 'es' ? `Notación anglosajona: ${letter}` : `Anglo-Saxon: ${letter}`;

    const hint =
      lang === 'es'
        ? `Piensa en la afinación estándar o en la escala de la letra ${letter}.`
        : `Think of standard tuning or scale positions for letter ${letter}.`;

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
    const solfege = options.solfege ?? SOLFEGE_NOTES[Math.floor(Math.random() * SOLFEGE_NOTES.length)];
    const correctAnswer = solfegeToLetter(solfege);
    const distractors = pickDistinctDistractors(NATURAL_LETTERS, correctAnswer, 3);
    const shuffledOptions = shuffleArray([correctAnswer, ...distractors]) as [string, string, string, string];
    const pedagogy = getTranslationPedagogy(correctAnswer, solfege, 'solfege-to-letters', lang);

    const prompt =
      lang === 'es'
        ? `¿Qué letra anglosajona corresponde a '${solfege}'?`
        : `What Anglo-Saxon letter corresponds to '${solfege}'?`;

    const subPrompt =
      lang === 'es' ? `Solfeo tradicional: ${solfege}` : `European: ${solfege}`;

    const hint =
      lang === 'es'
        ? `Recuerda la posición de ${solfege} en la escala Do-Re-Mi empezando en C.`
        : `Remember where ${solfege} sits in the Do-Re-Mi sequence starting at C.`;

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
      ? "¡Recuerda la regla: 'Si-Do y Mi-Fa'!"
      : 'Remember the mnemonic "Big Cats Eat Fish"!';

  return {
    id: createUniqueCardId('acc_semitone'),
    category: 'accidentals',
    prompt,
    subPrompt,
    options: shuffledOptions,
    correctAnswer,
    hint,
    explanation: pedagogy.explanation,
    mnemonic: pedagogy.mnemonic,
    difficulty: 'intermediate',
    noteReference: 'B-C / E-F',
  };
}

/**
 * Generates an accidental existence question (Does note X have a natural sharp?).
 */
export function generateAccidentalQuestion(
  targetLetter?: NaturalLetter,
  lang: Language = 'en'
): FlashcardQuestion {
  const letter = targetLetter ?? NATURAL_LETTERS[Math.floor(Math.random() * NATURAL_LETTERS.length)];
  const hasSharp = hasNaturalSharp(letter);
  const isEs = lang === 'es';
  const correctAnswer = hasSharp ? (isEs ? 'Sí' : 'Yes') : 'No';

  // 4 plausible options localized
  const optionsPool = isEs
    ? (['Sí', 'No', 'Solo con bemoles', 'Depende de la octava'] as const)
    : (['Yes', 'No', 'Only in flat keys', 'Depends on octave'] as const);
  const shuffledOptions = shuffleArray(optionsPool) as [string, string, string, string];

  let explanation: string;
  let mnemonic: string;

  if (isEs) {
    explanation = hasSharp
      ? `${letter} está separada por un tono completo de la siguiente nota, por lo que ${letter}# existe en la notación estándar.`
      : `${letter} NO tiene sostenido en la escala diatónica natural porque de ${letter} a ${letter === 'B' ? 'Do (C)' : 'Fa (F)'} hay un semitono natural inmediato.`;

    mnemonic = hasSharp
      ? getAccidentalPedagogy('SHARP', 'es').mnemonic
      : letter === 'B'
      ? getSemitonePedagogy('BC', 'es').mnemonic
      : getSemitonePedagogy('EF', 'es').mnemonic;
  } else {
    explanation = hasSharp
      ? `${letter} is separated by a whole step from the next note, so ${letter}# exists in standard music notation.`
      : `${letter} has NO sharp in the natural diatonic scale because ${letter} to ${letter === 'B' ? 'C' : 'F'} is an immediate half-step (natural semitone).`;

    mnemonic = hasSharp
      ? ACCIDENTAL_MNEMONICS_EN.SHARP.mnemonic
      : letter === 'B'
      ? SEMITONE_MNEMONICS_EN.BC.mnemonic
      : SEMITONE_MNEMONICS_EN.EF.mnemonic;
  }

  const prompt = isEs
    ? `¿Tiene la nota natural '${letter}' sostenido (#) en la escala diatónica?`
    : `Does natural note '${letter}' have a sharp (#) in the diatonic scale?`;

  const subPrompt = isEs
    ? hasSharp
      ? 'Paso de tono entero estándar'
      : 'Excepción de semitono natural'
    : hasSharp
    ? 'Standard whole-tone step'
    : 'Natural half-step exception';

  const hint = isEs
    ? `¡Recuerda si '${letter}' es una de las excepciones 'Si-Do y Mi-Fa'!`
    : `Recall if '${letter}' is one of the 'Big Cats Eat Fish' exceptions!`;

  return {
    id: createUniqueCardId('acc_has'),
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

  let explanation: string;
  let mnemonic: string;

  if (isEs) {
    explanation = isNaturalSemitone
      ? `Subir medio tono (1 traste) desde ${letter} lleva directamente a ${correctAnswer} porque es un semitono natural.`
      : `Subir medio tono (1 traste) desde ${letter} sube la altura a la alteración ${correctAnswer}.`;

    mnemonic = isNaturalSemitone
      ? letter === 'B'
        ? getSemitonePedagogy('BC', 'es').mnemonic
        : getSemitonePedagogy('EF', 'es').mnemonic
      : getAccidentalPedagogy('SHARP', 'es').mnemonic;
  } else {
    explanation = isNaturalSemitone
      ? `Moving 1 half-step up from ${letter} lands directly on ${correctAnswer} because it is a natural semitone.`
      : `Moving 1 half-step up from ${letter} raises the pitch to the accidental ${correctAnswer}.`;

    mnemonic = isNaturalSemitone
      ? letter === 'B'
        ? SEMITONE_MNEMONICS_EN.BC.mnemonic
        : SEMITONE_MNEMONICS_EN.EF.mnemonic
      : ACCIDENTAL_MNEMONICS_EN.SHARP.mnemonic;
  }

  const prompt = isEs
    ? `¿Qué nota está un semitono (1 traste arriba) por encima de '${letter}'?`
    : `What note is one half-step (1 fret up) above '${letter}'?`;

  const subPrompt = isEs
    ? 'Secuencia cromática y navegación en el diapasón'
    : 'Chromatic sequence and fretboard navigation';

  const hint = isEs
    ? `¿A '${letter}' le sigue una nota natural o un sostenido?`
    : `Is '${letter}' followed by a natural note or a sharp?`;

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
 * Master card generator taking full trainer configuration into account.
 */
export function generateCard(
  config: TrainerConfig,
  reviewQueue: string[] = []
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

  // Translation mode
  if (config.mode === 'translation') {
    return generateTranslationCard({
      direction: config.direction,
      letter: targetLetter,
      lang,
    });
  }

  // Accidentals mode
  if (config.mode === 'accidentals') {
    const roll = Math.random();
    if (roll < 0.35) {
      return generateNaturalSemitoneQuestion(lang);
    }
    if (roll < 0.7) {
      return generateAccidentalQuestion(targetLetter, lang);
    }
    return generateNextChromaticQuestion(targetLetter, lang);
  }

  // Mixed mode: 50% translation, 50% accidentals/sequence
  const roll = Math.random();
  if (roll < 0.5) {
    return generateTranslationCard({
      direction: config.direction,
      letter: targetLetter,
      lang,
    });
  }

  const accidentalRoll = Math.random();
  if (accidentalRoll < 0.35) {
    return generateNaturalSemitoneQuestion(lang);
  }
  if (accidentalRoll < 0.7) {
    return generateAccidentalQuestion(targetLetter, lang);
  }
  return generateNextChromaticQuestion(targetLetter, lang);
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
          ? `¿Qué nota europea (solfeo) corresponde a '${letter}'?`
          : `What European Solfège note corresponds to '${letter}'?`,
        subPrompt: isEs ? `Notación anglosajona: ${letter}` : `Anglo-Saxon: ${letter}`,
        hint: isEs
          ? `Piensa en la afinación estándar o en la escala de la letra ${letter}.`
          : `Think of standard tuning or scale positions for letter ${letter}.`,
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
          ? `¿Qué letra anglosajona corresponde a '${solfege}'?`
          : `What Anglo-Saxon letter corresponds to '${solfege}'?`,
        subPrompt: isEs ? `Solfeo tradicional: ${solfege}` : `European: ${solfege}`,
        hint: isEs
          ? `Recuerda la posición de ${solfege} en la escala Do-Re-Mi empezando en C.`
          : `Remember where ${solfege} sits in the Do-Re-Mi sequence starting at C.`,
        explanation: pedagogy.explanation,
        mnemonic: pedagogy.mnemonic,
      };
    }
  }

  // 2. Accidentals category: natural semitones
  if (card.category === 'accidentals' && card.id.startsWith('acc_semitone')) {
    const pedagogy = getSemitonePedagogy('COMBINED', lang);
    return {
      ...card,
      prompt: isEs
        ? '¿Qué pareja de notas naturales forma un semitono natural (sin sostenido ni bemol entre ellas)?'
        : 'Which pair of natural notes forms a natural semitone (no sharp/flat between them)?',
      subPrompt: isEs
        ? 'Trastes contiguos en la guitarra sin hueco intermedio'
        : 'Adjacent frets on the guitar neck with zero gap',
      hint: isEs
        ? "¡Recuerda la regla: 'Si-Do y Mi-Fa'!"
        : 'Remember the mnemonic "Big Cats Eat Fish"!',
      explanation: pedagogy.explanation,
      mnemonic: pedagogy.mnemonic,
    };
  }

  // 3. Accidentals category: has accidental
  if (card.category === 'accidentals' && card.id.startsWith('acc_has')) {
    const letter = card.noteReference as NaturalLetter;
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

    let explanation: string;
    let mnemonic: string;

    if (isEs) {
      explanation = hasSharp
        ? `${letter} está separada por un tono completo de la siguiente nota, por lo que ${letter}# existe en la notación estándar.`
        : `${letter} NO tiene sostenido en la escala diatónica natural porque de ${letter} a ${letter === 'B' ? 'Do (C)' : 'Fa (F)'} hay un semitono natural inmediato.`;

      mnemonic = hasSharp
        ? getAccidentalPedagogy('SHARP', 'es').mnemonic
        : letter === 'B'
        ? getSemitonePedagogy('BC', 'es').mnemonic
        : getSemitonePedagogy('EF', 'es').mnemonic;
    } else {
      explanation = hasSharp
        ? `${letter} is separated by a whole step from the next note, so ${letter}# exists in standard music notation.`
        : `${letter} has NO sharp in the natural diatonic scale because ${letter} to ${letter === 'B' ? 'C' : 'F'} is an immediate half-step (natural semitone).`;

      mnemonic = hasSharp
        ? ACCIDENTAL_MNEMONICS_EN.SHARP.mnemonic
        : letter === 'B'
        ? SEMITONE_MNEMONICS_EN.BC.mnemonic
        : SEMITONE_MNEMONICS_EN.EF.mnemonic;
    }

    return {
      ...card,
      prompt: isEs
        ? `¿Tiene la nota natural '${letter}' sostenido (#) en la escala diatónica?`
        : `Does natural note '${letter}' have a sharp (#) in the diatonic scale?`,
      subPrompt: isEs
        ? hasSharp
          ? 'Paso de tono entero estándar'
          : 'Excepción de semitono natural'
        : hasSharp
        ? 'Standard whole-tone step'
        : 'Natural half-step exception',
      hint: isEs
        ? `¡Recuerda si '${letter}' es una de las excepciones 'Si-Do y Mi-Fa'!`
        : `Recall if '${letter}' is one of the 'Big Cats Eat Fish' exceptions!`,
      options,
      correctAnswer,
      explanation,
      mnemonic,
    };
  }

  // 4. Sequence category: next chromatic
  if (card.category === 'sequence' && card.id.startsWith('seq_next')) {
    const letter = card.noteReference as NaturalLetter;
    const isNaturalSemitone = letter === 'B' || letter === 'E';

    let explanation: string;
    let mnemonic: string;

    if (isEs) {
      explanation = isNaturalSemitone
        ? `Subir medio tono (1 traste) desde ${letter} lleva directamente a ${card.correctAnswer} porque es un semitono natural.`
        : `Subir medio tono (1 traste) desde ${letter} sube la altura a la alteración ${card.correctAnswer}.`;

      mnemonic = isNaturalSemitone
        ? letter === 'B'
          ? getSemitonePedagogy('BC', 'es').mnemonic
          : getSemitonePedagogy('EF', 'es').mnemonic
        : getAccidentalPedagogy('SHARP', 'es').mnemonic;
    } else {
      explanation = isNaturalSemitone
        ? `Moving 1 half-step up from ${letter} lands directly on ${card.correctAnswer} because it is a natural semitone.`
        : `Moving 1 half-step up from ${letter} raises the pitch to the accidental ${card.correctAnswer}.`;

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
        ? `¿A '${letter}' le sigue una nota natural o un sostenido?`
        : `Is '${letter}' followed by a natural note or a sharp?`,
      explanation,
      mnemonic,
    };
  }

  return card;
}
