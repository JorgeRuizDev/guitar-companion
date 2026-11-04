import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { QuestionView } from '@/core/quiz/components/QuestionView';
import { visualRegistry } from '@/core/quiz/registry/visualRegistry';
import type { Question } from '@/core/quiz/types/schema';

describe('QuestionView Component (User Story 1)', () => {
  const dummyQuestion: Question = {
    id: 'test-q1',
    type: 'single-choice',
    course: 1,
    difficulty: 'beginner',
    topics: ['notes'],
    notation: 'letters',
    prompt: { en: 'What is note C in Solfege?', es: '¿Qué es la nota C en Solfeo?' },
    subPrompt: { en: 'Select one', es: 'Selecciona una' },
    options: [
      { id: 'opt-do', label: { en: 'Do', es: 'Do' } },
      { id: 'opt-re', label: { en: 'Re', es: 'Re' } },
    ],
    correctAnswer: ['opt-do'],
    remediation: {
      explanation: { en: 'C is Do', es: 'C es Do' },
    },
  };

  const dummyMultiQuestion: Question = {
    id: 'test-q2',
    type: 'multiple-choice',
    course: 1,
    difficulty: 'intermediate',
    topics: ['theory'],
    notation: 'letters',
    prompt: { en: 'Select all roots', es: 'Selecciona todas las notas' },
    options: [
      { id: 'opt-1', label: { en: 'Root 1', es: 'Raíz 1' } },
      { id: 'opt-2', label: { en: 'Root 2', es: 'Raíz 2' } },
    ],
    correctAnswer: ['opt-1', 'opt-2'],
    remediation: {
      explanation: { en: 'Both are roots', es: 'Ambas son raíces' },
    },
  };

  it('renders localized prompt and subPrompt correctly', () => {
    const element = QuestionView({
      question: dummyQuestion,
      selectedOptionIds: [],
      onSelectOption: vi.fn(),
      onSubmit: vi.fn(),
      lang: 'en',
    });

    expect(element).toBeDefined();
    // Element contains prompt
    const jsonStr = JSON.stringify(element);
    expect(jsonStr).toContain('What is note C in Solfege?');
    expect(jsonStr).toContain('Select one');
    expect(jsonStr).toContain('Course');
  });

  it('renders Spanish prompt when lang is es', () => {
    const element = QuestionView({
      question: dummyQuestion,
      selectedOptionIds: [],
      onSelectOption: vi.fn(),
      onSubmit: vi.fn(),
      lang: 'es',
    });

    const jsonStr = JSON.stringify(element);
    expect(jsonStr).toContain('¿Qué es la nota C en Solfeo?');
    expect(jsonStr).toContain('Selecciona una');
    expect(jsonStr).toContain('Curso');
  });

  it('delegates visual stimulus rendering to visualRegistry when present', () => {
    const DummyStimulus: React.FC<{ props: Record<string, unknown> }> = () => (
      <div data-testid="mock-stimulus">Mock Stimulus Diagram</div>
    );

    visualRegistry.register('test-diagram', DummyStimulus);

    const questionWithStimulus: Question = {
      ...dummyQuestion,
      stimulus: {
        visualType: 'test-diagram',
        visualProps: { frets: 5 },
      },
    };

    const element = QuestionView({
      question: questionWithStimulus,
      selectedOptionIds: [],
      onSelectOption: vi.fn(),
      onSubmit: vi.fn(),
    });

    const jsonStr = JSON.stringify(element);
    expect(jsonStr).toContain('stimulus-container');
    expect(visualRegistry.has('test-diagram')).toBe(true);
  });

  it('renders explicit submit button for multiple-choice questions', () => {
    const onSubmit = vi.fn();
    const element = QuestionView({
      question: dummyMultiQuestion,
      selectedOptionIds: ['opt-1'],
      onSelectOption: vi.fn(),
      onSubmit,
      lang: 'en',
    });

    const jsonStr = JSON.stringify(element);
    expect(jsonStr).toContain('submit-answer-button');
    expect(jsonStr).toContain('Submit Answer');
  });

  it('does not render submit button for single-choice questions in answering state', () => {
    const element = QuestionView({
      question: dummyQuestion,
      selectedOptionIds: ['opt-do'],
      onSelectOption: vi.fn(),
      onSubmit: vi.fn(),
      lang: 'en',
    });

    const jsonStr = JSON.stringify(element);
    expect(jsonStr).not.toContain('submit-answer-button');
  });
});
