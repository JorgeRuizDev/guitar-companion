import React from 'react';
import type { Question } from '../types/schema';
import { OptionGrid } from './OptionGrid';
import { visualRegistry } from '../registry/visualRegistry';
import {
  QuestionCard,
  QuestionHeader,
  StimulusContainer,
  ActionNextButton,
} from '@/core/ui/questions';

export interface QuestionViewProps {
  question: Question;
  selectedOptionIds: string[];
  onSelectOption: (optionId: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  lang?: 'en' | 'es';
  compact?: boolean;
  evaluated?: boolean;
  correctAnswerIds?: string[];
  falsePositives?: string[];
  falseNegatives?: string[];
}

export const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  selectedOptionIds,
  onSelectOption,
  onSubmit,
  disabled = false,
  lang = 'en',
  compact = false,
  evaluated = false,
  correctAnswerIds = [],
  falsePositives = [],
  falseNegatives = [],
}) => {
  const isMulti = question.type === 'multiple-choice';
  const StimulusComponent = question.stimulus
    ? visualRegistry.get(question.stimulus.visualType)
    : null;

  const promptText = question.prompt[lang] || question.prompt.en;
  const subPromptText = question.subPrompt
    ? question.subPrompt[lang] || question.subPrompt.en
    : null;
  const isEs = lang === 'es';

  const handleOptionClick = (optionId: string) => {
    if (disabled || evaluated) return;
    onSelectOption(optionId);
  };

  const difficultyLabel =
    question.difficulty === 'beginner'
      ? isEs ? 'Principiante' : 'Beginner'
      : question.difficulty === 'intermediate'
      ? isEs ? 'Intermedio' : 'Intermediate'
      : isEs ? 'Avanzado' : 'Advanced';

  return (
    <QuestionCard compact={compact}>
      {/* Category Tag & Difficulty Badge Header */}
      <QuestionHeader
        category={`${isEs ? 'Curso' : 'Course'} ${question.course}`}
        topic={question.topics[0]}
        difficulty={difficultyLabel}
        title={promptText}
        subtitle={subPromptText}
        compact={compact}
      />

      {/* Stimulus Component (if registered) */}
      {question.stimulus && StimulusComponent && (
        <StimulusContainer compact={compact} testId="stimulus-container">
          <StimulusComponent
            props={question.stimulus.visualProps}
            lang={lang}
            compact={compact}
          />
        </StimulusContainer>
      )}

      {/* Options Grid */}
      <OptionGrid
        options={question.options}
        selectedOptionIds={selectedOptionIds}
        onSelectOption={handleOptionClick}
        type={question.type}
        disabled={disabled || evaluated}
        lang={lang}
        compact={compact}
        evaluated={evaluated}
        correctAnswerIds={correctAnswerIds}
        falsePositives={falsePositives}
        falseNegatives={falseNegatives}
      />

      {/* Submit Button for Multiple-choice */}
      {isMulti && !evaluated && (
        <div className={`w-full ${compact ? 'mt-2.5' : 'mt-3'}`}>
          <ActionNextButton
            label={isEs ? 'Comprobar respuesta' : 'Submit Answer'}
            onClick={onSubmit}
            disabled={disabled || selectedOptionIds.length === 0}
            testId="submit-answer-button"
            icon={null}
          />
        </div>
      )}
    </QuestionCard>
  );
};
