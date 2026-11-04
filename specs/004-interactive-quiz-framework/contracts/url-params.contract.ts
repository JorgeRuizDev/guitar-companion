/**
 * Contract: URL Query Parameters for Quiz Engine
 * Defines declarative query parameters parsing, validation, and serialization.
 * @module core/quiz/contracts/url-params
 */

import { z } from 'zod';

export const QuizUrlParamsSchema = z.object({
  courses: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      // Parses "1-5" or "1,2,3" or "1"
      if (val.includes('-')) {
        const [start, end] = val.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        }
      }
      return val
        .split(',')
        .map((n) => Number(n.trim()))
        .filter((n) => !isNaN(n));
    }),
  difficulty: z
    .enum(['beginner', 'intermediate', 'advanced', 'any'])
    .optional()
    .default('any'),
  topics: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(',').map((t) => t.trim()) : undefined)),
  notation: z
    .enum(['letters', 'solfege', 'any'])
    .optional()
    .default('any'),
  embed: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
  compact: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
  lang: z.enum(['en', 'es']).optional().default('en'),
});

export type ParsedQuizUrlParams = z.infer<typeof QuizUrlParamsSchema>;
