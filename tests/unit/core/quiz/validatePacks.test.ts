import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';
import {
  QuestionPackManifestSchema,
  QuestionSchema,
} from '@/core/quiz/types/schema';
import { loadPack } from '@/core/quiz/engine/packLoader';

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

  it('validates all registered pack directories and YAML files conform to QuestionPackSchema', () => {
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);

    for (const packEntry of manifest.packs) {
      const packFullPath = path.resolve(
        process.cwd(),
        packEntry.dirPath || packEntry.filePath
      );
      expect(fs.existsSync(packFullPath)).toBe(true);

      const parsedPack = loadPack(packFullPath, packEntry);

      expect(parsedPack.packId).toBe(packEntry.packId);
      expect(parsedPack.course).toBe(packEntry.course);
      expect(parsedPack.questions.length).toBe(packEntry.questionCount);
    }
  });

  it('enforces internal organization rule: no pack directory contains more than 15 YAML files', () => {
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);

    for (const packEntry of manifest.packs) {
      const packFullPath = path.resolve(
        process.cwd(),
        packEntry.dirPath || packEntry.filePath
      );
      expect(fs.existsSync(packFullPath)).toBe(true);

      if (fs.statSync(packFullPath).isDirectory()) {
        const ymlFiles = fs
          .readdirSync(packFullPath)
          .filter((file) => /\.(ya?ml)$/i.test(file));

        expect(
          ymlFiles.length,
          `Directory ${packFullPath} contains ${ymlFiles.length} YAML files, exceeding the limit of 15`
        ).toBeLessThanOrEqual(15);
      }
    }
  });

  it('enforces internal organization rule: each YAML file contains at most 15 questions', () => {
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);

    for (const packEntry of manifest.packs) {
      const packFullPath = path.resolve(
        process.cwd(),
        packEntry.dirPath || packEntry.filePath
      );
      expect(fs.existsSync(packFullPath)).toBe(true);

      if (fs.statSync(packFullPath).isDirectory()) {
        const ymlFiles = fs
          .readdirSync(packFullPath)
          .filter((file) => /\.(ya?ml)$/i.test(file));

        for (const file of ymlFiles) {
          const filePath = path.join(packFullPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const parsed = yaml.parse(content);
          const questions = Array.isArray(parsed)
            ? parsed
            : Array.isArray(parsed?.questions)
            ? parsed.questions
            : [];

          expect(
            questions.length,
            `File ${filePath} contains ${questions.length} questions, expected at least 1`
          ).toBeGreaterThan(0);

          expect(
            questions.length,
            `File ${filePath} contains ${questions.length} questions, exceeding maximum of 15`
          ).toBeLessThanOrEqual(15);
        }
      }
    }
  });

  it('verifies that all question IDs across all packs are globally unique', () => {
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);
    const seenIds = new Set<string>();

    for (const packEntry of manifest.packs) {
      const packFullPath = path.resolve(
        process.cwd(),
        packEntry.dirPath || packEntry.filePath
      );
      const pack = loadPack(packFullPath, packEntry);
      for (const question of pack.questions) {
        expect(
          seenIds.has(question.id),
          `Duplicate question ID found: ${question.id}`
        ).toBe(false);
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
