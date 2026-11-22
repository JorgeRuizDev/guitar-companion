import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { FretboardDiagram } from '@/apps/basic-chord-trainer/components/FretboardDiagram';
import { CHORD_CATALOG } from '@/apps/basic-chord-trainer/domain/chordCatalog';
import { UserFretboardState } from '@/apps/basic-chord-trainer/types';

describe('Barre Indicator Prevention on Same-Fret Open Chords', () => {
  const e7Chord = CHORD_CATALOG.find((c) => c.id === 'e-7')!;
  const emChord = CHORD_CATALOG.find((c) => c.id === 'e-minor')!;
  const dChord = CHORD_CATALOG.find((c) => c.id === 'd-major')!;
  const fChord = CHORD_CATALOG.find((c) => c.id === 'f-major')!;

  it('does NOT render a barre connector for E7 when strings 4 and 1 are fretted at fret 2', () => {
    // E7 fingering: 6: 0, 5: 0, 4: 2, 3: 1, 2: 0, 1: 2
    const userState: UserFretboardState = [
      { stringNumber: 6, state: 'open', fret: 0 },
      { stringNumber: 5, state: 'open', fret: 0 },
      { stringNumber: 4, state: 'fretted', fret: 2 },
      { stringNumber: 3, state: 'fretted', fret: 1 },
      { stringNumber: 2, state: 'open', fret: 0 },
      { stringNumber: 1, state: 'fretted', fret: 2 },
    ];

    const html = renderToString(
      React.createElement(FretboardDiagram, {
        fretboardState: userState,
        targetChord: e7Chord,
        isInteractive: true,
        evaluation: null,
      })
    );

    // Verify neither user-barre-connector nor target-barre-indicator is present
    expect(html).not.toContain('user-barre-connector');
    expect(html).not.toContain('target-barre-indicator');
  });

  it('does NOT render a barre connector for Em when strings 5 and 4 are fretted at fret 2', () => {
    // Em fingering: 6: 0, 5: 2, 4: 2, 3: 0, 2: 0, 1: 0
    const userState: UserFretboardState = [
      { stringNumber: 6, state: 'open', fret: 0 },
      { stringNumber: 5, state: 'fretted', fret: 2 },
      { stringNumber: 4, state: 'fretted', fret: 2 },
      { stringNumber: 3, state: 'open', fret: 0 },
      { stringNumber: 2, state: 'open', fret: 0 },
      { stringNumber: 1, state: 'open', fret: 0 },
    ];

    const html = renderToString(
      React.createElement(FretboardDiagram, {
        fretboardState: userState,
        targetChord: emChord,
        isInteractive: true,
        evaluation: null,
      })
    );

    expect(html).not.toContain('user-barre-connector');
    expect(html).not.toContain('target-barre-indicator');
  });

  it('does NOT render a barre connector for D major when strings 3 and 1 are fretted at fret 2', () => {
    // D major fingering: 6: muted, 5: muted, 4: 0, 3: 2, 2: 3, 1: 2
    const userState: UserFretboardState = [
      { stringNumber: 6, state: 'muted', fret: null },
      { stringNumber: 5, state: 'muted', fret: null },
      { stringNumber: 4, state: 'open', fret: 0 },
      { stringNumber: 3, state: 'fretted', fret: 2 },
      { stringNumber: 2, state: 'fretted', fret: 3 },
      { stringNumber: 1, state: 'fretted', fret: 2 },
    ];

    const html = renderToString(
      React.createElement(FretboardDiagram, {
        fretboardState: userState,
        targetChord: dChord,
        isInteractive: true,
        evaluation: null,
      })
    );

    expect(html).not.toContain('user-barre-connector');
    expect(html).not.toContain('target-barre-indicator');
  });

  it('renders user barre connector for F major when barre on fret 1 is fretted across strings', () => {
    // F major with barre on fret 1: 6: 1, 5: 3, 4: 3, 3: 2, 2: 1, 1: 1
    const userState: UserFretboardState = [
      { stringNumber: 6, state: 'fretted', fret: 1 },
      { stringNumber: 5, state: 'fretted', fret: 3 },
      { stringNumber: 4, state: 'fretted', fret: 3 },
      { stringNumber: 3, state: 'fretted', fret: 2 },
      { stringNumber: 2, state: 'fretted', fret: 1 },
      { stringNumber: 1, state: 'fretted', fret: 1 },
    ];

    const html = renderToString(
      React.createElement(FretboardDiagram, {
        fretboardState: userState,
        targetChord: fChord,
        isInteractive: true,
        evaluation: null,
      })
    );

    // Barre connector on fret 1 should be present
    expect(html).toContain('user-barre-connector-1');
    // Spurious barre connector on fret 3 (for strings 5 and 4) MUST NOT be present
    expect(html).not.toContain('user-barre-connector-3');
  });

  it('renders target barre indicator for F major in read-only / review mode', () => {
    const userState: UserFretboardState = [
      { stringNumber: 6, state: 'fretted', fret: 1 },
      { stringNumber: 5, state: 'fretted', fret: 3 },
      { stringNumber: 4, state: 'fretted', fret: 3 },
      { stringNumber: 3, state: 'fretted', fret: 2 },
      { stringNumber: 2, state: 'fretted', fret: 1 },
      { stringNumber: 1, state: 'fretted', fret: 1 },
    ];

    const html = renderToString(
      React.createElement(FretboardDiagram, {
        fretboardState: userState,
        targetChord: fChord,
        isInteractive: false,
      })
    );

    expect(html).toContain('target-barre-indicator');
    expect(html).not.toContain('user-barre-connector');
  });
});
