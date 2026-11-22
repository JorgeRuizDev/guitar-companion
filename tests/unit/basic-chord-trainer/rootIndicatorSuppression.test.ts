import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { FretboardDiagram } from '@/apps/basic-chord-trainer/components/FretboardDiagram';
import { DrawChallenge } from '@/apps/basic-chord-trainer/components/DrawChallenge';
import { CHORD_CATALOG } from '@/apps/basic-chord-trainer/domain/chordCatalog';
import { UserFretboardState, PracticeChallenge } from '@/apps/basic-chord-trainer/types';

describe('Root Indicator Spoiler Suppression (User Story 2)', () => {
  const cMajor = CHORD_CATALOG.find((c) => c.id === 'c-major')!;

  const emptyUserState: UserFretboardState = [
    { stringNumber: 6, state: 'muted', fret: null },
    { stringNumber: 5, state: 'open', fret: 0 },
    { stringNumber: 4, state: 'open', fret: 0 },
    { stringNumber: 3, state: 'open', fret: 0 },
    { stringNumber: 2, state: 'open', fret: 0 },
    { stringNumber: 1, state: 'open', fret: 0 },
  ];

  const drawChallenge: PracticeChallenge = {
    id: 'test-challenge-1',
    type: 'draw',
    targetChord: cMajor,
  };

  describe('FretboardDiagram showRootIndicator prop', () => {
    it('renders root indicator badge when showRootIndicator is true', () => {
      const html = renderToString(
        React.createElement(FretboardDiagram, {
          fretboardState: emptyUserState,
          targetChord: cMajor,
          showRootIndicator: true,
        })
      );

      expect(html).toContain('data-testid="root-string-indicator"');
      expect(html).toContain('>R<');
    });

    it('renders root indicator badge by default when prop is omitted', () => {
      const html = renderToString(
        React.createElement(FretboardDiagram, {
          fretboardState: emptyUserState,
          targetChord: cMajor,
        })
      );

      expect(html).toContain('data-testid="root-string-indicator"');
    });

    it('suppresses root indicator badge completely when showRootIndicator is false', () => {
      const html = renderToString(
        React.createElement(FretboardDiagram, {
          fretboardState: emptyUserState,
          targetChord: cMajor,
          showRootIndicator: false,
        })
      );

      expect(html).not.toContain('data-testid="root-string-indicator"');
    });
  });

  describe('DrawChallenge Integration', () => {
    it('suppresses root indicator while challenge status is PENDING', () => {
      const html = renderToString(
        React.createElement(DrawChallenge, {
          challenge: drawChallenge,
          userState: emptyUserState,
          status: 'PENDING',
          evaluation: null,
          onFretClick: () => {},
          onNutToggle: () => {},
          onCheck: () => {},
          onSkip: () => {},
          onNext: () => {},
        })
      );

      expect(html).not.toContain('data-testid="root-string-indicator"');
    });

    it('reveals root indicator when evaluated correctly', () => {
      const html = renderToString(
        React.createElement(DrawChallenge, {
          challenge: drawChallenge,
          userState: emptyUserState,
          status: 'EVALUATED_CORRECT',
          evaluation: {
            isCorrect: true,
            explanation: { en: 'Well done', es: 'Bien hecho' },
          },
          onFretClick: () => {},
          onNutToggle: () => {},
          onCheck: () => {},
          onSkip: () => {},
          onNext: () => {},
        })
      );

      expect(html).toContain('data-testid="root-string-indicator"');
    });

    it('reveals root indicator when evaluated incorrectly (remediation)', () => {
      const html = renderToString(
        React.createElement(DrawChallenge, {
          challenge: drawChallenge,
          userState: emptyUserState,
          status: 'EVALUATED_INCORRECT',
          evaluation: {
            isCorrect: false,
            explanation: { en: 'Try again', es: 'Inténtalo de nuevo' },
          },
          onFretClick: () => {},
          onNutToggle: () => {},
          onCheck: () => {},
          onSkip: () => {},
          onNext: () => {},
        })
      );

      expect(html).toContain('data-testid="root-string-indicator"');
    });
  });
});
