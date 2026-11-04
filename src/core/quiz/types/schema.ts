import { z } from 'zod';

export const LocalizedTextSchema = z.object({
  en: z.string(),
  es: z.string(),
});

export type LocalizedText = z.infer<typeof LocalizedTextSchema>;

export const QuestionTypeSchema = z.enum([
  'single-choice',
  'multiple-choice',
  'interactive-visual',
]);
export type QuestionType = z.infer<typeof QuestionTypeSchema>;

export const DifficultyLevelSchema = z.enum([
  'beginner',
  'intermediate',
  'advanced',
]);
export type DifficultyLevel = z.infer<typeof DifficultyLevelSchema>;

export const NotationFormatSchema = z.enum([
  'letters',
  'solfege',
  'dual',
  'neutral',
]);
export type NotationFormat = z.infer<typeof NotationFormatSchema>;

export const VisualDescriptorSchema = z.object({
  visualType: z.string(),
  visualProps: z.record(z.string(), z.unknown()).optional().default({}),
});
export type VisualDescriptor = z.infer<typeof VisualDescriptorSchema>;

export const QuestionOptionSchema = z.object({
  id: z.string(),
  label: LocalizedTextSchema,
  visualCue: VisualDescriptorSchema.optional(),
});
export type QuestionOption = z.infer<typeof QuestionOptionSchema>;

export const RemediationSchema = z.object({
  explanation: LocalizedTextSchema,
  hint: LocalizedTextSchema.optional(),
  mnemonic: LocalizedTextSchema.optional(),
  visualExplanation: VisualDescriptorSchema.optional(),
});
export type Remediation = z.infer<typeof RemediationSchema>;

export const QuestionSchema = z.object({
  id: z.string(),
  familyIds: z.array(z.string()).optional(),
  type: QuestionTypeSchema,
  course: z.number().int().min(1),
  difficulty: DifficultyLevelSchema,
  topics: z.array(z.string()),
  notation: NotationFormatSchema,
  prompt: LocalizedTextSchema,
  subPrompt: LocalizedTextSchema.optional(),
  stimulus: VisualDescriptorSchema.optional(),
  options: z.array(QuestionOptionSchema).min(2),
  correctAnswer: z.array(z.string()).min(1),
  remediation: RemediationSchema,
});
export type Question = z.infer<typeof QuestionSchema>;

export const QuestionPackSchema = z.object({
  packId: z.string().regex(/^[a-z0-9-]+$/),
  course: z.number().int().min(1),
  topics: z.array(z.string()).optional(),
  questions: z.array(QuestionSchema),
});
export type QuestionPack = z.infer<typeof QuestionPackSchema>;

export const QuestionPackEntrySchema = z.object({
  packId: z.string(),
  filePath: z.string(),
  course: z.number().int().min(1),
  topics: z.array(z.string()),
  questionCount: z.number().int().min(0),
  supportedNotations: z.array(NotationFormatSchema),
});
export type QuestionPackEntry = z.infer<typeof QuestionPackEntrySchema>;

export const QuestionPackManifestSchema = z.object({
  version: z.literal('1.0'),
  packs: z.array(QuestionPackEntrySchema),
});
export type QuestionPackManifest = z.infer<typeof QuestionPackManifestSchema>;
