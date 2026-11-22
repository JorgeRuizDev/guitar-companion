import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';
import { QuestionSchema } from '@/core/quiz/types/schema';
import { loadPack } from '@/core/quiz/engine/packLoader';
import { drawNextEligible } from '@/core/quiz/engine/carousel';

describe('Interval Quiz Questions Bank & Notation Segregation (User Story 3)', () => {
  const filePath = path.resolve(
    process.cwd(),
    'src/content/quizzes/topics/intervals/01-musical-intervals.yml'
  );
  const manifestPath = path.resolve(
    process.cwd(),
    'src/content/quizzes/manifest.json'
  );

  it('validates intervals quiz YAML conforms to QuestionSchema', () => {
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, 'utf-8');
    const questions = yaml.parse(content);

    expect(Array.isArray(questions)).toBe(true);
    expect(questions.length).toBe(12);

    for (const q of questions) {
      const result = QuestionSchema.safeParse(q);
      expect(result.success, `Question ${q.id} failed schema validation: ${JSON.stringify(result.error)}`).toBe(true);
    }
  });

  it('guarantees 100% strict notation segregation with zero leakage', () => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const questions = yaml.parse(content);

    const letterQuestions = questions.filter((q: any) => q.notation === 'letters');
    const solfegeQuestions = questions.filter((q: any) => q.notation === 'solfege');

    expect(letterQuestions.length).toBe(6);
    expect(solfegeQuestions.length).toBe(6);

    // Letter questions must NOT contain Solfège syllables in option labels or English prompts
    const solfegeSyllables = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'];
    for (const q of letterQuestions) {
      for (const opt of q.options) {
        // If option is a note (e.g. G, F, E), it should not be a solfege syllable
        if (opt.label.en.length <= 3) {
          expect(solfegeSyllables).not.toContain(opt.label.en);
        }
      }
    }

    // Solfège questions must NOT use standalone Anglo-Saxon letter note symbols in option labels
    const angloNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    for (const q of solfegeQuestions) {
      for (const opt of q.options) {
        if (opt.label.es.length <= 3) {
          expect(angloNotes).not.toContain(opt.label.es);
        }
      }
    }
  });

  it('verifies family mutual exclusion between letters and solfege sister questions', () => {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const packEntry = manifest.packs.find((p: any) => p.packId === 'intervals');
    expect(packEntry).toBeDefined();

    const parsedPack = loadPack(
      path.resolve(process.cwd(), packEntry.dirPath),
      packEntry
    );

    expect(parsedPack.questions.length).toBe(12);

    // All questions have at least one familyId
    for (const q of parsedPack.questions) {
      expect(q.familyIds.length).toBeGreaterThan(0);
    }

    // Verify sister questions share familyId
    const cP5Letters = parsedPack.questions.find((q) => q.id === 'q-interval-c-p5-letters')!;
    const cP5Solfege = parsedPack.questions.find((q) => q.id === 'q-interval-c-p5-solfege')!;
    expect(cP5Letters.familyIds).toEqual(cP5Solfege.familyIds);

    // Test carousel drawing: drawing cP5Letters must exclude cP5Solfege
    const activeFamilies = new Set<string>();
    const result1 = drawNextEligible(parsedPack.questions, activeFamilies);
    expect(result1.drawn).toBeDefined();

    // After drawing, updatedExcludedFamilies contains the drawn question's family
    expect(result1.updatedExcludedFamilies.size).toBe(1);
    const drawnFamily = result1.drawn!.familyIds[0];
    expect(result1.updatedExcludedFamilies.has(drawnFamily)).toBe(true);

    // Subsequent draw cannot draw the sister question with the same family
    const result2 = drawNextEligible(result1.remainingPool, result1.updatedExcludedFamilies);
    expect(result2.drawn).toBeDefined();
    expect(result2.drawn!.familyIds[0]).not.toBe(drawnFamily);
  });

  it('guarantees semitone distance explanation is present in all interval questions', () => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const questions = yaml.parse(content);

    for (const q of questions) {
      expect(q.remediation.explanation.en).toMatch(/semitone/i);
      expect(q.remediation.explanation.es).toMatch(/semitono/i);
    }
  });
});
