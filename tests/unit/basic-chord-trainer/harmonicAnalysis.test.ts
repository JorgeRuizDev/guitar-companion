import { describe, it, expect } from 'vitest';
import { getChordHarmonicAnalysis } from '@/apps/basic-chord-trainer/domain/harmonicAnalysis';
import { CHORD_CATALOG } from '@/apps/basic-chord-trainer/domain/chordCatalog';

describe('Harmonic Analysis Engine (basic-chord-trainer)', () => {
  const getChord = (id: string) => {
    const chord = CHORD_CATALOG.find((c) => c.id === id);
    if (!chord) throw new Error(`Chord ${id} not found in catalog`);
    return chord;
  };

  it('correctly analyzes C Major open chord (C, E, G)', () => {
    const chord = getChord('c-major');
    const analysis = getChordHarmonicAnalysis(chord);

    expect(analysis.chordId).toBe('c-major');
    expect(analysis.rootString).toBe(5);

    // Muted string 6
    const str6 = analysis.strings.find((s) => s.stringNumber === 6);
    expect(str6?.state).toBe('muted');
    expect(str6?.noteLetter).toBe('');

    // String 5 (fret 3) -> C (Root)
    const str5 = analysis.strings.find((s) => s.stringNumber === 5);
    expect(str5?.noteLetter).toBe('C');
    expect(str5?.solfegeName).toBe('Do');
    expect(str5?.intervalAbbr).toBe('R');
    expect(str5?.intervalRole).toBe('Root');
    expect(str5?.intervalRoleEs).toBe('Tónica');

    // String 4 (fret 2) -> E (Major 3rd)
    const str4 = analysis.strings.find((s) => s.stringNumber === 4);
    expect(str4?.noteLetter).toBe('E');
    expect(str4?.solfegeName).toBe('Mi');
    expect(str4?.intervalAbbr).toBe('3M');
    expect(str4?.intervalRole).toBe('Major 3rd');
    expect(str4?.intervalRoleEs).toBe('3ª Mayor');

    // String 3 (fret 0) -> G (Perfect 5th)
    const str3 = analysis.strings.find((s) => s.stringNumber === 3);
    expect(str3?.noteLetter).toBe('G');
    expect(str3?.solfegeName).toBe('Sol');
    expect(str3?.intervalAbbr).toBe('5J');
    expect(str3?.intervalRole).toBe('Perfect 5th');
    expect(str3?.intervalRoleEs).toBe('5ª Justa');

    // String 2 (fret 1) -> C (Root)
    const str2 = analysis.strings.find((s) => s.stringNumber === 2);
    expect(str2?.noteLetter).toBe('C');
    expect(str2?.intervalAbbr).toBe('R');

    // String 1 (fret 0) -> E (Major 3rd)
    const str1 = analysis.strings.find((s) => s.stringNumber === 1);
    expect(str1?.noteLetter).toBe('E');
    expect(str1?.intervalAbbr).toBe('3M');

    // Unique notes
    expect(analysis.uniqueNotes).toEqual(['C', 'E', 'G']);
    expect(analysis.uniqueSolfege).toEqual(['Do', 'Mi', 'Sol']);

    // Distractors: exactly 2, not in uniqueNotes
    expect(analysis.distractors).toHaveLength(2);
    expect(analysis.uniqueNotes).not.toContain(analysis.distractors[0]);
    expect(analysis.uniqueNotes).not.toContain(analysis.distractors[1]);
    expect(analysis.distractors[0]).not.toBe(analysis.distractors[1]);
  });

  it('correctly analyzes D Major open chord (D, F#, A)', () => {
    const chord = getChord('d-major');
    const analysis = getChordHarmonicAnalysis(chord);

    expect(analysis.uniqueNotes).toEqual(['D', 'A', 'F#']);
    expect(analysis.uniqueSolfege).toEqual(['Re', 'La', 'Fa#']);

    // String 4 -> D (Root)
    const str4 = analysis.strings.find((s) => s.stringNumber === 4);
    expect(str4?.noteLetter).toBe('D');
    expect(str4?.intervalAbbr).toBe('R');

    // String 3 -> A (5th)
    const str3 = analysis.strings.find((s) => s.stringNumber === 3);
    expect(str3?.noteLetter).toBe('A');
    expect(str3?.intervalAbbr).toBe('5J');

    // String 2 -> D (Root)
    const str2 = analysis.strings.find((s) => s.stringNumber === 2);
    expect(str2?.noteLetter).toBe('D');
    expect(str2?.intervalAbbr).toBe('R');

    // String 1 -> F# (Major 3rd)
    const str1 = analysis.strings.find((s) => s.stringNumber === 1);
    expect(str1?.noteLetter).toBe('F#');
    expect(str1?.intervalAbbr).toBe('3M');
    expect(str1?.solfegeName).toBe('Fa#');

    expect(analysis.distractors).toHaveLength(2);
    expect(analysis.uniqueNotes).not.toContain(analysis.distractors[0]);
    expect(analysis.uniqueNotes).not.toContain(analysis.distractors[1]);
  });

  it('correctly analyzes A Minor open chord (A, C, E)', () => {
    const chord = getChord('a-minor');
    const analysis = getChordHarmonicAnalysis(chord);

    expect(analysis.uniqueNotes).toEqual(['A', 'E', 'C']);
    expect(analysis.uniqueSolfege).toEqual(['La', 'Mi', 'Do']);

    // String 2 (fret 1) -> C (Minor 3rd)
    const str2 = analysis.strings.find((s) => s.stringNumber === 2);
    expect(str2?.noteLetter).toBe('C');
    expect(str2?.intervalAbbr).toBe('m3');
    expect(str2?.intervalRole).toBe('Minor 3rd');
    expect(str2?.intervalRoleEs).toBe('3ª menor');
  });

  it('correctly analyzes E Minor open chord (E, G, B)', () => {
    const chord = getChord('e-minor');
    const analysis = getChordHarmonicAnalysis(chord);

    expect(analysis.uniqueNotes).toEqual(['E', 'B', 'G']);
    expect(analysis.uniqueSolfege).toEqual(['Mi', 'Si', 'Sol']);

    // String 3 (fret 0) -> G (Minor 3rd)
    const str3 = analysis.strings.find((s) => s.stringNumber === 3);
    expect(str3?.noteLetter).toBe('G');
    expect(str3?.intervalAbbr).toBe('m3');
  });

  it('correctly analyzes G Major open chord (G, B, D)', () => {
    const chord = getChord('g-major');
    const analysis = getChordHarmonicAnalysis(chord);

    expect(analysis.uniqueNotes).toEqual(['G', 'B', 'D']);
    expect(analysis.uniqueSolfege).toEqual(['Sol', 'Si', 'Re']);

    const str6 = analysis.strings.find((s) => s.stringNumber === 6);
    expect(str6?.noteLetter).toBe('G');
    expect(str6?.intervalAbbr).toBe('R');

    const str5 = analysis.strings.find((s) => s.stringNumber === 5);
    expect(str5?.noteLetter).toBe('B');
    expect(str5?.intervalAbbr).toBe('3M');
  });

  it('correctly analyzes E Major and A Major open chords', () => {
    const eMajor = getChordHarmonicAnalysis(getChord('e-major'));
    expect(eMajor.uniqueNotes).toEqual(['E', 'B', 'G#']);
    expect(eMajor.uniqueSolfege).toEqual(['Mi', 'Si', 'Sol#']);

    const aMajor = getChordHarmonicAnalysis(getChord('a-major'));
    expect(aMajor.uniqueNotes).toEqual(['A', 'E', 'C#']);
    expect(aMajor.uniqueSolfege).toEqual(['La', 'Mi', 'Do#']);
  });

  it('correctly analyzes D Minor open chord (D, F, A)', () => {
    const dMinor = getChordHarmonicAnalysis(getChord('d-minor'));
    expect(dMinor.uniqueNotes).toEqual(['D', 'A', 'F']);
    expect(dMinor.uniqueSolfege).toEqual(['Re', 'La', 'Fa']);

    const str1 = dMinor.strings.find((s) => s.stringNumber === 1);
    expect(str1?.noteLetter).toBe('F');
    expect(str1?.intervalAbbr).toBe('m3');
  });

  it('demonstrates future-proof barre chord compatibility (F Major & B Minor)', () => {
    const fMajorBarre = getChordHarmonicAnalysis(getChord('f-major'));
    expect(fMajorBarre.uniqueNotes).toEqual(['F', 'C', 'A']);
    expect(fMajorBarre.uniqueSolfege).toEqual(['Fa', 'Do', 'La']);

    // String 6 (fret 1) -> F (Root)
    const str6 = fMajorBarre.strings.find((s) => s.stringNumber === 6);
    expect(str6?.noteLetter).toBe('F');
    expect(str6?.intervalAbbr).toBe('R');

    // String 3 (fret 2) -> A (Major 3rd)
    const str3 = fMajorBarre.strings.find((s) => s.stringNumber === 3);
    expect(str3?.noteLetter).toBe('A');
    expect(str3?.intervalAbbr).toBe('3M');

    // B Minor barre chord
    const bMinorBarre = getChordHarmonicAnalysis(getChord('b-minor'));
    expect(bMinorBarre.uniqueNotes).toEqual(['B', 'F#', 'D']);
    expect(bMinorBarre.uniqueSolfege).toEqual(['Si', 'Fa#', 'Re']);

    const str2 = bMinorBarre.strings.find((s) => s.stringNumber === 2);
    expect(str2?.noteLetter).toBe('D');
    expect(str2?.intervalAbbr).toBe('m3');
  });
});
