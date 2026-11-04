import {
  QuestionPackSchema,
  QuestionPackManifestSchema,
  QuestionSchema,
  type Question,
  type QuestionPack,
  type QuestionPackManifest,
} from '../types/schema';

// Static registry of packs for browser/client environments
const staticPackRegistry = new Map<string, QuestionPack>();

/**
 * Registers a question pack in-memory (useful for bundling and client-side usage).
 */
export function registerPack(pack: unknown): QuestionPack {
  const parsed = QuestionPackSchema.parse(pack);
  staticPackRegistry.set(parsed.packId, parsed);
  return parsed;
}

/**
 * Validates a single question against the QuestionSchema.
 */
export function validateQuestion(raw: unknown): Question {
  return QuestionSchema.parse(raw);
}

/**
 * Validates an entire question pack against QuestionPackSchema.
 */
export function validateQuestionPack(raw: unknown): QuestionPack {
  return QuestionPackSchema.parse(raw);
}

/**
 * Validates the manifest index against QuestionPackManifestSchema.
 */
export function validateManifest(raw: unknown): QuestionPackManifest {
  return QuestionPackManifestSchema.parse(raw);
}

/**
 * Retrieves a registered pack by its packId.
 */
export function getPack(packId: string): QuestionPack | undefined {
  return staticPackRegistry.get(packId);
}

/**
 * Returns all registered questions across all registered packs.
 */
export function getAllRegisteredQuestions(): Question[] {
  const questions: Question[] = [];
  for (const pack of staticPackRegistry.values()) {
    questions.push(...pack.questions);
  }
  return questions;
}

/**
 * Clears the static pack registry (useful for testing).
 */
export function clearPackRegistry(): void {
  staticPackRegistry.clear();
}
