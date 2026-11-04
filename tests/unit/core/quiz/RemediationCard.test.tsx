import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { RemediationCard } from '@/core/quiz/components/RemediationCard';
import { visualRegistry } from '@/core/quiz/registry/visualRegistry';
import type { Question } from '@/core/quiz/types/schema';
import type { EvaluationResult } from '@/core/quiz/engine/evaluator';

describe('RemediationCard Component (User Story 2)', () => {
  const dummyQuestion: Question = {
    id: 'q-remed-1',
    type: 'multiple-choice',
    course: 1,
    difficulty: 'beginner',
    topics: ['notes'],
    notation: 'letters',
    prompt: { en: 'Identify notes', es: 'Identifica notas' },
    options: [
      { id: 'opt-a', label: { en: 'Option A (La)', es: 'Opción A (La)' } },
      { id: 'opt-b', label: { en: 'Option B (Si)', es: 'Opción B (Si)' } },
      { id: 'opt-c', label: { en: 'Option C (Do)', es: 'Opción C (Do)' } },
    ],
    correctAnswer: ['opt-a', 'opt-c'],
    remediation: {
      explanation: {
        en: 'A and C are correct because of diatonic rules.',
        es: 'A y C son correctas debido a las reglas diatónicas.',
      },
      mnemonic: {
        en: 'Always Check Clefs',
        es: 'Aprende Con Claridad',
      },
      visualExplanation: {
        visualType: 'corrective-scale-diagram',
        visualProps: { root: 'A' },
      },
    },
  };

  const dummyEvaluation: EvaluationResult = {
    isCorrect: false,
    falsePositives: ['opt-b'],
    falseNegatives: ['opt-c'],
  };

  it('renders theoretical explanation and localized text correctly', () => {
    const onContinue = vi.fn();
    const element = RemediationCard({
      question: dummyQuestion,
      evaluation: dummyEvaluation,
      onContinue,
      lang: 'en',
    });

    const jsonStr = JSON.stringify(element);
    expect(jsonStr).toContain('A and C are correct because of diatonic rules.');
    expect(jsonStr).toContain('Pedagogical Explanation');
  });

  it('renders Spanish text when lang is es', () => {
    const element = RemediationCard({
      question: dummyQuestion,
      evaluation: dummyEvaluation,
      onContinue: vi.fn(),
      lang: 'es',
    });

    const jsonStr = JSON.stringify(element);
    expect(jsonStr).toContain('A y C son correctas debido a las reglas diatónicas.');
    expect(jsonStr).toContain('Explicación Pedagógica');
  });

  it('renders error diff diagnostics for false positives and false negatives', () => {
    const element = RemediationCard({
      question: dummyQuestion,
      evaluation: dummyEvaluation,
      onContinue: vi.fn(),
      lang: 'en',
    });

    const jsonStr = JSON.stringify(element);
    expect(jsonStr).toContain('error-diagnostics');
    expect(jsonStr).toContain('Incorrect selection:');
    expect(jsonStr).toContain('Option B (Si)');
    expect(jsonStr).toContain('Missing correct answer:');
    expect(jsonStr).toContain('Option C (Do)');
  });

  it('renders mnemonic memory aid when present', () => {
    const element = RemediationCard({
      question: dummyQuestion,
      evaluation: dummyEvaluation,
      onContinue: vi.fn(),
      lang: 'en',
    });

    const jsonStr = JSON.stringify(element);
    expect(jsonStr).toContain('mnemonic-callout');
    expect(jsonStr).toContain('Always Check Clefs');
  });

  it('renders visual explanation via visualRegistry when registered', () => {
    const MockVisual: React.FC<{ props: Record<string, unknown> }> = () => (
      <div>Mock Visual Remediation</div>
    );
    visualRegistry.register('corrective-scale-diagram', MockVisual);

    const element = RemediationCard({
      question: dummyQuestion,
      evaluation: dummyEvaluation,
      onContinue: vi.fn(),
      lang: 'en',
    });

    const jsonStr = JSON.stringify(element);
    expect(jsonStr).toContain('visual-explanation-container');
    expect(visualRegistry.has('corrective-scale-diagram')).toBe(true);
  });
});
