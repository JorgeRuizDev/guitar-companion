import type { Question } from '../types/schema';

export interface EvaluationResult {
  isCorrect: boolean;
  falsePositives: string[];
  falseNegatives: string[];
}

/**
 * Pure evaluator for question answers.
 * Implements all-or-nothing grading with diagnostic false-positive and false-negative detection.
 */
export function evaluateAnswer(
  question: Question,
  selectedIds: string[]
): EvaluationResult {
  const expectedSet = new Set(question.correctAnswer);
  const actualSet = new Set(selectedIds);

  const falsePositives = selectedIds.filter((id) => !expectedSet.has(id));
  const falseNegatives = question.correctAnswer.filter((id) => !actualSet.has(id));

  const isCorrect = falsePositives.length === 0 && falseNegatives.length === 0;

  return {
    isCorrect,
    falsePositives,
    falseNegatives,
  };
}
