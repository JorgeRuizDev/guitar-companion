import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  generateChordNotesChallenge,
  generateNextChallenge,
} from '@/apps/basic-chord-trainer/domain/challengeGenerator';
import { parseChordTrainerParams } from '@/apps/basic-chord-trainer/domain/queryParams';
import { CHORD_CATALOG } from '@/apps/basic-chord-trainer/domain/chordCatalog';
import { ChordNotesChallenge } from '@/apps/basic-chord-trainer/components/ChordNotesChallenge';
import { FretboardDiagram } from '@/apps/basic-chord-trainer/components/FretboardDiagram';
import { UserFretboardState } from '@/apps/basic-chord-trainer/types';
import {
  getChordHarmonicAnalysis,
  getLocalizedIntervalAbbr,
} from '@/apps/basic-chord-trainer/domain/harmonicAnalysis';

describe('Chord Notes Identification & Holistic Configuration (User Story 1)', () => {
  const cMajor = CHORD_CATALOG.find((c) => c.id === 'c-major')!;
  const dMinor = CHORD_CATALOG.find((c) => c.id === 'd-minor')!;
  const g7 = CHORD_CATALOG.find((c) => c.id === 'g7')!;

  describe('Challenge Generation & Distractor Inclusion', () => {
    it('generates a chord-notes challenge with harmonic analysis and distractors', () => {
      const challenge = generateChordNotesChallenge(cMajor, 'letters');

      expect(challenge.type).toBe('chord-notes');
      expect(challenge.targetChord.id).toBe('c-major');
      expect(challenge.harmonicAnalysis).toBeDefined();

      const ha = challenge.harmonicAnalysis!;
      expect(ha.uniqueNotes).toEqual(['C', 'E', 'G']);
      expect(ha.distractors).toHaveLength(2);
      expect(ha.uniqueNotes).not.toContain(ha.distractors[0]);
      expect(ha.uniqueNotes).not.toContain(ha.distractors[1]);
    });

    it('generates Solfège notation variant correctly', () => {
      const challenge = generateChordNotesChallenge(dMinor, 'solfege');

      expect(challenge.notation).toBe('solfege');
      const ha = challenge.harmonicAnalysis!;
      expect(ha.uniqueSolfege).toEqual(['Re', 'La', 'Fa']);
      expect(ha.distractorsSolfege).toHaveLength(2);
      expect(ha.uniqueSolfege).not.toContain(ha.distractorsSolfege[0]);
      expect(ha.uniqueSolfege).not.toContain(ha.distractorsSolfege[1]);
    });

    it('generates 7th chord (G7) with root, 3rd, 5th, and 7th intervals', () => {
      const challenge = generateChordNotesChallenge(g7, 'letters');
      const ha = challenge.harmonicAnalysis!;

      expect(ha.uniqueNotes).toContain('G');
      expect(ha.uniqueNotes).toContain('B');
      expect(ha.uniqueNotes).toContain('D');
      expect(ha.uniqueNotes).toContain('F');

      const string1 = ha.strings.find((s) => s.stringNumber === 1);
      expect(string1).toBeDefined();
      expect(string1?.noteLetter).toBe('F');
      expect(string1?.intervalAbbr).toBe('m7');
      expect(string1?.intervalRoleEs).toBe('7ª menor');
    });

    it('dispatches chord-notes challenge when mode is chord-notes in generateNextChallenge', () => {
      const challenge = generateNextChallenge('chord-notes', undefined, [cMajor]);
      expect(challenge.type).toBe('chord-notes');
      expect(challenge.targetChord.id).toBe('c-major');
    });
  });

  describe('Localized Interval Abbreviations', () => {
    it('localizes interval abbreviations in Spanish', () => {
      expect(getLocalizedIntervalAbbr('R', 'es')).toBe('T');
      expect(getLocalizedIntervalAbbr('3M', 'es')).toBe('3ª');
      expect(getLocalizedIntervalAbbr('m3', 'es')).toBe('3ªm');
      expect(getLocalizedIntervalAbbr('5J', 'es')).toBe('5ª');
      expect(getLocalizedIntervalAbbr('m7', 'es')).toBe('7ª');
      expect(getLocalizedIntervalAbbr('7M', 'es')).toBe('7ªM');
      expect(getLocalizedIntervalAbbr('9', 'es')).toBe('9ª');
    });

    it('preserves interval abbreviations in English', () => {
      expect(getLocalizedIntervalAbbr('R', 'en')).toBe('R');
      expect(getLocalizedIntervalAbbr('3M', 'en')).toBe('3M');
      expect(getLocalizedIntervalAbbr('5J', 'en')).toBe('5J');
      expect(getLocalizedIntervalAbbr('m7', 'en')).toBe('m7');
    });
  });

  describe('Query Parameters Parsing', () => {
    it('parses mode=chord-notes correctly', () => {
      const config = parseChordTrainerParams({ mode: 'chord-notes' });
      expect(config.mode).toBe('chord-notes');
    });
  });

  describe('ChordNotesChallenge Component Rendering & Deferred Submission Controls', () => {
    it('renders the upper note bank above the diagram without clipping', () => {
      const challenge = generateChordNotesChallenge(cMajor, 'letters');
      const html = renderToString(
        React.createElement(ChordNotesChallenge, {
          challenge,
          onNext: () => {},
          onSkip: () => {},
        })
      );

      // Upper bank container exists
      expect(html).toContain('data-testid="chord-notes-bank"');
      expect(html).toContain('Note Bank');

      // Tokens for C, E, G plus 2 distractors exist in the bank
      expect(html).toContain('data-testid="note-token-C"');
      expect(html).toContain('data-testid="note-token-E"');
      expect(html).toContain('data-testid="note-token-G"');

      // 2 distractors also present
      const dist1 = challenge.harmonicAnalysis!.distractors[0];
      const dist2 = challenge.harmonicAnalysis!.distractors[1];
      expect(html).toContain(`data-testid="note-token-${dist1}"`);
      expect(html).toContain(`data-testid="note-token-${dist2}"`);

      // Sounding strings drop targets exist
      expect(html).toContain('data-testid="drop-target-5"');
      expect(html).toContain('data-testid="drop-target-4"');
      expect(html).toContain('data-testid="drop-target-3"');
      expect(html).toContain('data-testid="drop-target-2"');
      expect(html).toContain('data-testid="drop-target-1"');
    });

    it('renders Check button initially disabled when strings are unassigned', () => {
      const challenge = generateChordNotesChallenge(cMajor, 'letters');
      const html = renderToString(
        React.createElement(ChordNotesChallenge, {
          challenge,
          onNext: () => {},
          onSkip: () => {},
          lang: 'es',
        })
      );

      expect(html).toContain('data-testid="check-chord-notes"');
      expect(html).toContain('disabled=""');
      expect(html).toContain('Comprobar');
      expect(html).toContain('0 de 5 cuerdas con nota asignada');
      expect(html).not.toContain('data-testid="harmonic-breakdown-card"');
    });

    it('renders Reset and Skip actions alongside Check button', () => {
      const challenge = generateChordNotesChallenge(cMajor, 'letters');
      const html = renderToString(
        React.createElement(ChordNotesChallenge, {
          challenge,
          onNext: () => {},
          onSkip: () => {},
          lang: 'en',
        })
      );

      expect(html).toContain('Reset');
      expect(html).toContain('data-testid="skip-chord-notes"');
      expect(html).toContain('Skip');
      expect(html).toContain('Check');
    });

    it('reveals solution, harmonic breakdown, and Next Chord button when status is SKIPPED', () => {
      const challenge = generateChordNotesChallenge(cMajor, 'letters');
      const html = renderToString(
        React.createElement(ChordNotesChallenge, {
          challenge,
          status: 'SKIPPED',
          onNext: () => {},
          onSkip: () => {},
          lang: 'es',
        })
      );

      // Skipped banner must be rendered
      expect(html).toContain('data-testid="chord-notes-skipped-banner"');
      expect(html).toContain('Solución mostrada');

      // Next Chord button must be rendered
      expect(html).toContain('data-testid="next-chord-notes"');
      expect(html).toContain('Siguiente Acorde');

      // Harmonic breakdown card must be rendered
      expect(html).toContain('data-testid="harmonic-breakdown-card"');
      expect(html).toContain('Estructura armónica del acorde:');

      // Check button and Skip button must no longer be present
      expect(html).not.toContain('data-testid="check-chord-notes"');
      expect(html).not.toContain('data-testid="skip-chord-notes"');
    });
  });

  describe('FretboardDiagram Harmonic & Error Highlighting', () => {
    const cMajorFretboardState: UserFretboardState = [
      { stringNumber: 6, state: 'muted', fret: null },
      { stringNumber: 5, state: 'fretted', fret: 3 },
      { stringNumber: 4, state: 'fretted', fret: 2 },
      { stringNumber: 3, state: 'open', fret: 0 },
      { stringNumber: 2, state: 'fretted', fret: 1 },
      { stringNumber: 1, state: 'open', fret: 0 },
    ];

    it('highlights error strings with red fill and stroke when errorStrings is provided', () => {
      const html = renderToString(
        React.createElement(FretboardDiagram, {
          fretboardState: cMajorFretboardState,
          targetChord: cMajor,
          noteLabels: {
            5: 'C',
            4: 'D', // Wrong! Expected E
            3: 'G',
            2: 'C',
            1: 'A', // Wrong! Expected E
          },
          errorStrings: [4, 1],
          showFingerNumbers: false,
        })
      );

      // Red error color #ef4444 and light red border #fca5a5 must be rendered for the error strings
      expect(html).toContain('#ef4444');
      expect(html).toContain('#fca5a5');
    });

    it('renders harmonic role tags (T, 3ª, 5ª) on the diagram when harmonicLabels is passed', () => {
      const html = renderToString(
        React.createElement(FretboardDiagram, {
          fretboardState: cMajorFretboardState,
          targetChord: cMajor,
          noteLabels: {
            5: 'C',
            4: 'E',
            3: 'G',
            2: 'C',
            1: 'E',
          },
          harmonicLabels: {
            5: 'T',
            4: '3ª',
            3: '5ª',
            2: 'T',
            1: '3ª',
          },
          showFingerNumbers: false,
        })
      );

      expect(html).toContain('>T<');
      expect(html).toContain('>3ª<');
      expect(html).toContain('>5ª<');
      // Green color for confirmed harmonic labels
      expect(html).toContain('#059669');
      expect(html).toContain('#a7f3d0');
    });
  });
});
