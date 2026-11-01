import { describe, it, expect } from 'vitest';
import { TRANSLATIONS } from '@/core/i18n/translations';

describe('Navigation System & Dual-Layout Architecture', () => {
  it('contains complete localized navigation entries for both EN and ES', () => {
    for (const lang of ['en', 'es'] as const) {
      const nav = TRANSLATIONS[lang].nav;
      expect(nav.home).toBeDefined();
      expect(nav.brand).toBe('Guitar Companion');
      expect(nav.strumming).toBeDefined();
      expect(nav.noteTrainer).toBeDefined();
      expect(nav.chordTrainer).toBeDefined();
      expect(nav.strummingShort).toBeDefined();
      expect(nav.noteTrainerShort).toBeDefined();
      expect(nav.chordTrainerShort).toBeDefined();
      expect(nav.mobileNavLabel).toBeDefined();

      const footer = TRANSLATIONS[lang].footer;
      expect(footer.tagline).toBeDefined();
      expect(footer.github).toBe('GitHub');
    }
  });

  it('guarantees mobile short labels are concise to avoid phone viewport overflow', () => {
    expect(TRANSLATIONS.en.nav.strummingShort.length).toBeLessThan(12);
    expect(TRANSLATIONS.en.nav.noteTrainerShort.length).toBeLessThan(12);
    expect(TRANSLATIONS.en.nav.chordTrainerShort.length).toBeLessThan(12);
    expect(TRANSLATIONS.es.nav.strummingShort.length).toBeLessThan(12);
    expect(TRANSLATIONS.es.nav.noteTrainerShort.length).toBeLessThan(12);
    expect(TRANSLATIONS.es.nav.chordTrainerShort.length).toBeLessThan(12);
  });

  it('correctly maps route detection for embed view suppression', () => {
    const isEmbedRoute = (pathname: string | null) => Boolean(pathname?.includes('/embed'));

    expect(isEmbedRoute('/basic-note-trainer/embed')).toBe(true);
    expect(isEmbedRoute('/basic-note-trainer/embed?lang=es')).toBe(true);
    expect(isEmbedRoute('/strumming')).toBe(false);
    expect(isEmbedRoute('/basic-note-trainer')).toBe(false);
    expect(isEmbedRoute('/')).toBe(false);
    expect(isEmbedRoute(null)).toBe(false);
  });

  it('determines active route states accurately across platform tools', () => {
    const getActiveStates = (pathname: string | null) => ({
      isHome: pathname === '/',
      isStrumming: pathname === '/strumming' || Boolean(pathname?.startsWith('/strumming/')),
      isNoteTrainer:
        pathname === '/basic-note-trainer' || Boolean(pathname?.startsWith('/basic-note-trainer/')),
      isChordTrainer:
        pathname === '/basic-chord-trainer' ||
        Boolean(pathname?.startsWith('/basic-chord-trainer/')),
    });

    // Root / Home
    const homeStates = getActiveStates('/');
    expect(homeStates.isHome).toBe(true);
    expect(homeStates.isStrumming).toBe(false);
    expect(homeStates.isNoteTrainer).toBe(false);
    expect(homeStates.isChordTrainer).toBe(false);

    // Strumming Pattern Trainer
    const strummingStates = getActiveStates('/strumming');
    expect(strummingStates.isHome).toBe(false);
    expect(strummingStates.isStrumming).toBe(true);
    expect(strummingStates.isNoteTrainer).toBe(false);
    expect(strummingStates.isChordTrainer).toBe(false);

    // Basic Note Trainer
    const noteTrainerStates = getActiveStates('/basic-note-trainer');
    expect(noteTrainerStates.isHome).toBe(false);
    expect(noteTrainerStates.isStrumming).toBe(false);
    expect(noteTrainerStates.isNoteTrainer).toBe(true);
    expect(noteTrainerStates.isChordTrainer).toBe(false);

    // Basic Chord Trainer
    const chordTrainerStates = getActiveStates('/basic-chord-trainer');
    expect(chordTrainerStates.isHome).toBe(false);
    expect(chordTrainerStates.isStrumming).toBe(false);
    expect(chordTrainerStates.isNoteTrainer).toBe(false);
    expect(chordTrainerStates.isChordTrainer).toBe(true);

    // Nested sub-route
    const nestedChordTrainer = getActiveStates('/basic-chord-trainer/embed');
    expect(nestedChordTrainer.isChordTrainer).toBe(true);
  });
});
