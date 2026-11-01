/**
 * Local Storage Adapter for Basic Chord Trainer
 * Persists anonymous session preferences and stats in browser localStorage with typed fallback
 * and enforces ownerId: null in strict compliance with Constitution Principle IV (Zero-Mock UI).
 * @module apps/basic-chord-trainer/storage/chordTrainerStorage
 */

import { typedStorage } from '@/core/storage/typedStorage';
import { PracticeMode, StoredChordTrainerPreferences } from '../types';
import { CHORD_CATALOG } from '../domain/chordCatalog';

export const CHORD_TRAINER_STORAGE_KEY = 'guitar_companion_chord_trainer_v1';

export const DEFAULT_CHORD_PREFERENCES: StoredChordTrainerPreferences = {
  version: 1,
  ownerId: null,
  selectedChordIds: CHORD_CATALOG.map((c) => c.id),
  selectedMode: 'alternate',
  lifetimeHits: 0,
  lifetimeMisses: 0,
  allTimeBestStreak: 0,
  lastPlayedAt: '2026-11-01T00:00:00.000Z',
};

export const chordTrainerStorage = {
  getPreferences(): StoredChordTrainerPreferences {
    const data = typedStorage.get<StoredChordTrainerPreferences>(
      CHORD_TRAINER_STORAGE_KEY,
      DEFAULT_CHORD_PREFERENCES
    );

    if (
      !data ||
      !Array.isArray(data.selectedChordIds) ||
      typeof data.lifetimeHits !== 'number'
    ) {
      return { ...DEFAULT_CHORD_PREFERENCES };
    }

    return {
      ...data,
      version: 1,
      ownerId: null,
    };
  },

  savePreferences(
    prefs: Partial<StoredChordTrainerPreferences>
  ): StoredChordTrainerPreferences {
    const current = this.getPreferences();
    const updated: StoredChordTrainerPreferences = {
      version: 1,
      ownerId: null,
      selectedChordIds: prefs.selectedChordIds ?? current.selectedChordIds,
      selectedMode: prefs.selectedMode ?? current.selectedMode,
      lifetimeHits: prefs.lifetimeHits ?? current.lifetimeHits,
      lifetimeMisses: prefs.lifetimeMisses ?? current.lifetimeMisses,
      allTimeBestStreak: Math.max(
        prefs.allTimeBestStreak ?? 0,
        current.allTimeBestStreak
      ),
      lastPlayedAt: new Date().toISOString(),
    };

    typedStorage.set(CHORD_TRAINER_STORAGE_KEY, updated);
    return updated;
  },

  recordSessionResult(hits: number, misses: number, bestStreak: number): void {
    const current = this.getPreferences();
    this.savePreferences({
      lifetimeHits: current.lifetimeHits + hits,
      lifetimeMisses: current.lifetimeMisses + misses,
      allTimeBestStreak: Math.max(current.allTimeBestStreak, bestStreak),
    });
  },

  clear(): void {
    typedStorage.remove(CHORD_TRAINER_STORAGE_KEY);
  },
};
