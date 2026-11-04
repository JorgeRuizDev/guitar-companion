import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import type { QuestionPack } from '@/core/quiz/types/schema';
import { drawNextEligible } from '@/core/quiz/engine/carousel';

describe('Chord & Note Questions Family Segregation & Mutual Exclusion', () => {
  const contentDir = path.resolve(process.cwd(), 'src/content/quizzes');
  const openChordsPath = path.join(contentDir, 'topics/open-chords.json');
  const course01Path = path.join(contentDir, 'courses/course-01-notes.json');

  it('guarantees open-chords questions do not use combined dual format (e.g. Am (La Menor))', () => {
    const raw = JSON.parse(fs.readFileSync(openChordsPath, 'utf-8')) as QuestionPack;

    for (const q of raw.questions) {
      // Must not contain combined notation pattern like "Am (La menor)" or "C (Do Mayor)"
      expect(q.prompt.es).not.toMatch(/[A-G][a-z0-9#♭]*\s+\([A-Z][a-z]/);
      expect(q.prompt.en).not.toMatch(/[A-G][a-z0-9#♭]*\s+\([A-Z][a-z]/);

      for (const opt of q.options) {
        expect(opt.label.es).not.toMatch(/[A-G][a-z0-9#♭]*\s+\([A-Z][a-z]/);
        expect(opt.label.en).not.toMatch(/[A-G][a-z0-9#♭]*\s+\([A-Z][a-z]/);
      }
    }
  });

  it('guarantees each chord has draw and identify variants sharing the same familyId', () => {
    const raw = JSON.parse(fs.readFileSync(openChordsPath, 'utf-8')) as QuestionPack;

    // Test a-minor specifically as per user requirement
    const amQuestions = raw.questions.filter((q) =>
      q.familyIds?.includes('family-chord-a-minor')
    );

    expect(amQuestions.length).toBe(4);

    // Draw solfege: "Dibuja el acorde de La menor"
    const drawSolfege = amQuestions.find((q) => q.id === 'chord-a-minor-draw-solfege');
    expect(drawSolfege).toBeDefined();
    expect(drawSolfege?.notation).toBe('solfege');
    expect(drawSolfege?.prompt.es).toContain('La menor');

    // Draw letters: "Dibuja el acorde de Am"
    const drawLetters = amQuestions.find((q) => q.id === 'chord-a-minor-draw-letters');
    expect(drawLetters).toBeDefined();
    expect(drawLetters?.notation).toBe('letters');
    expect(drawLetters?.prompt.es).toContain('Am');

    // Identify letters (Variante A): "A qué acorde corresponde este dibujo" -> A menor
    const identifyLetters = amQuestions.find((q) => q.id === 'chord-a-minor-identify-letters');
    expect(identifyLetters).toBeDefined();
    expect(identifyLetters?.notation).toBe('letters');
    expect(identifyLetters?.prompt.es).toContain('¿A qué acorde corresponde este dibujo?');
    const correctLetterOpt = identifyLetters?.options.find((o) =>
      identifyLetters.correctAnswer.includes(o.id)
    );
    expect(correctLetterOpt?.label.es).toBe('A menor');
    expect(correctLetterOpt?.label.en).toBe('A minor');

    // Identify solfege (Variante B): "A qué acorde corresponde este dibujo" -> La menor
    const identifySolfege = amQuestions.find((q) => q.id === 'chord-a-minor-identify-solfege');
    expect(identifySolfege).toBeDefined();
    expect(identifySolfege?.notation).toBe('solfege');
    expect(identifySolfege?.prompt.es).toContain('¿A qué acorde corresponde este dibujo?');
    const correctSolfegeOpt = identifySolfege?.options.find((o) =>
      identifySolfege.correctAnswer.includes(o.id)
    );
    expect(correctSolfegeOpt?.label.es).toBe('La menor');
  });

  it('excludes all sister questions for a chord once any variant is drawn in a session', () => {
    const raw = JSON.parse(fs.readFileSync(openChordsPath, 'utf-8')) as QuestionPack;
    const amQuestions = raw.questions.filter((q) =>
      q.familyIds?.includes('family-chord-a-minor')
    );

    const pool = [...amQuestions];
    let excluded = new Set<string>();

    // Step 1: Draw the first question (e.g. draw solfege)
    const step1 = drawNextEligible(pool, excluded);
    expect(step1.drawn).not.toBeNull();
    expect(step1.drawn?.familyIds).toContain('family-chord-a-minor');

    // Step 2: Attempting to draw next eligible from remaining pool must find NO eligible questions
    // because all other 3 questions share 'family-chord-a-minor'
    const step2 = drawNextEligible(step1.remainingPool, step1.updatedExcludedFamilies);
    expect(step2.drawn).toBeNull();
    expect(step2.remainingPool.length).toBe(0);
  });

  it('guarantees note translation questions for G and Sol share the same family and exclude each other', () => {
    const raw = JSON.parse(fs.readFileSync(course01Path, 'utf-8')) as QuestionPack;

    const gQuestions = raw.questions.filter((q) =>
      q.familyIds?.includes('family-g-translation')
    );

    expect(gQuestions.length).toBe(2);

    const gToSolfege = gQuestions.find((q) => q.id === 'c01-q-g-to-solfege');
    const solfegeToG = gQuestions.find((q) => q.id === 'c01-q-solfege-sol-to-letter');

    expect(gToSolfege).toBeDefined();
    expect(solfegeToG).toBeDefined();

    // In session: drawing one excludes the other
    const pool = [gToSolfege!, solfegeToG!];
    const step1 = drawNextEligible(pool, new Set());
    expect(step1.drawn?.id).toBe(gToSolfege!.id);

    const step2 = drawNextEligible(step1.remainingPool, step1.updatedExcludedFamilies);
    expect(step2.drawn).toBeNull();
  });
});
