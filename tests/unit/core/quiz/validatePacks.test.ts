import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  QuestionPackManifestSchema,
  QuestionPackSchema,
  QuestionSchema,
} from '@/core/quiz/types/schema';

describe('Question Pack & Manifest Validation', () => {
  const contentDir = path.resolve(process.cwd(), 'src/content/quizzes');
  const manifestPath = path.join(contentDir, 'manifest.json');

  it('validates manifest.json conforms to QuestionPackManifestSchema', () => {
    expect(fs.existsSync(manifestPath)).toBe(true);
    const content = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);
    const result = QuestionPackManifestSchema.safeParse(manifest);
    expect(result.success).toBe(true);
  });

  it('validates all registered pack JSON files conform to QuestionPackSchema', () => {
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);

    for (const packEntry of manifest.packs) {
      const packFullPath = path.resolve(process.cwd(), packEntry.filePath);
      expect(fs.existsSync(packFullPath)).toBe(true);

      const rawPack = JSON.parse(fs.readFileSync(packFullPath, 'utf-8'));
      const parsedPack = QuestionPackSchema.parse(rawPack);

      expect(parsedPack.packId).toBe(packEntry.packId);
      expect(parsedPack.course).toBe(packEntry.course);
      expect(parsedPack.questions.length).toBe(packEntry.questionCount);
    }
  });

  it('verifies that all question IDs across all packs are globally unique', () => {
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);
    const seenIds = new Set<string>();

    for (const packEntry of manifest.packs) {
      const packFullPath = path.resolve(process.cwd(), packEntry.filePath);
      const rawPack = JSON.parse(fs.readFileSync(packFullPath, 'utf-8'));
      for (const question of rawPack.questions) {
        expect(seenIds.has(question.id)).toBe(false);
        seenIds.add(question.id);
      }
    }
  });

  it('rejects invalid questions with missing required fields', () => {
    const invalidQuestion = {
      id: 'bad-q',
      // missing type, prompt, options, etc.
    };
    const result = QuestionSchema.safeParse(invalidQuestion);
    expect(result.success).toBe(false);
  });
});
