/**
 * Local Storage Adapter for Basic Note Trainer
 * Persists cumulative statistics in browser localStorage with typed fallback
 * and enforces ownerId: null (Zero-Mock UI guest mode)
 * @module apps/basic-note-trainer/storage/trainerStorage
 */

import { typedStorage } from '@/core/storage/typedStorage';
import { StoredUserStats } from '../types';

export const TRAINER_STORAGE_KEY = 'guitar-companion:basic-note-trainer:stats';

export const DEFAULT_STORED_STATS: StoredUserStats = {
  version: 1,
  ownerId: null,
  lifetimeOkeys: 0,
  lifetimeFailures: 0,
  allTimeBestStreak: 0,
  lastPlayedAt: '2026-11-01T00:00:00.000Z',
};

export const trainerStorage = {
  getStats(): StoredUserStats {
    const data = typedStorage.get<StoredUserStats>(
      TRAINER_STORAGE_KEY,
      DEFAULT_STORED_STATS
    );

    // Defensive check: ensure data matches expected schema structure
    if (!data || typeof data.lifetimeOkeys !== 'number' || typeof data.lifetimeFailures !== 'number') {
      return { ...DEFAULT_STORED_STATS };
    }

    return {
      ...data,
      version: 1,
      ownerId: null, // Always enforce ownerId: null in guest mode
    };
  },

  saveStats(stats: Partial<StoredUserStats>): StoredUserStats {
    const current = this.getStats();
    const updated: StoredUserStats = {
      version: 1,
      ownerId: null,
      lifetimeOkeys: stats.lifetimeOkeys ?? current.lifetimeOkeys,
      lifetimeFailures: stats.lifetimeFailures ?? current.lifetimeFailures,
      allTimeBestStreak: Math.max(
        stats.allTimeBestStreak ?? 0,
        current.allTimeBestStreak
      ),
      lastPlayedAt: new Date().toISOString(),
    };

    typedStorage.set(TRAINER_STORAGE_KEY, updated);
    return updated;
  },

  recordSessionResults(okeys: number, failures: number, streak: number): StoredUserStats {
    const current = this.getStats();
    return this.saveStats({
      lifetimeOkeys: current.lifetimeOkeys + okeys,
      lifetimeFailures: current.lifetimeFailures + failures,
      allTimeBestStreak: Math.max(current.allTimeBestStreak, streak),
    });
  },

  resetStats(): void {
    typedStorage.set(TRAINER_STORAGE_KEY, {
      ...DEFAULT_STORED_STATS,
      lastPlayedAt: new Date().toISOString(),
    });
  },

  /**
   * Future-facing migration hook: Associates anonymous records with an authenticated user
   */
  async migrateToUser(userId: string): Promise<Record<string, unknown>> {
    const stats = this.getStats();
    const migrated = {
      ...stats,
      ownerId: userId,
      migratedAt: new Date().toISOString(),
    };
    return migrated;
  },
};
