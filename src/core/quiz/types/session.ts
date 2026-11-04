import type { DifficultyLevel, NotationFormat, Question } from './schema';

export interface QuestionFilter {
  courses?: number[];
  difficulties?: DifficultyLevel[];
  topics?: string[];
  notation?: NotationFormat | 'any';
}

export type SessionStatus =
  | 'IDLE'
  | 'ANSWERING'
  | 'EVALUATED_CORRECT'
  | 'EVALUATED_INCORRECT'
  | 'SESSION_EXHAUSTED';

export interface SessionStats {
  hits: number;
  misses: number;
  currentStreak: number;
  bestStreak: number;
  accuracy: number;
  totalCompleted: number;
}

export interface QuizSessionState {
  filter: QuestionFilter;
  candidatePool: Question[];
  activeQuestion: Question | null;
  excludedFamilyIds: Set<string>;
  servedQuestionIds: Set<string>;
  selectedOptionIds: string[];
  status: SessionStatus;
  stats: SessionStats;
}

export type QuizSessionAction =
  | { type: 'INIT_SESSION'; payload: { questions: Question[]; filter?: QuestionFilter } }
  | { type: 'SELECT_OPTION'; payload: { optionId: string } }
  | { type: 'SUBMIT_ANSWER' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'RESET_SESSION' };
