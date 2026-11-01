import { StrummingPattern, SubdivisionUnit, MetronomeSubdivision, validatePattern } from "../types";
import { typedStorage } from "@/core/storage/typedStorage";

export interface UserPreferencesPayload {
  lastBpm: number;
  lastAccentFirstBeat: boolean;
  lastSubdivision: SubdivisionUnit;
  lastPatternId: string;
  lastTimerDurationSeconds: number;
  lastMetronomeSubdivision: MetronomeSubdivision;
  strictAlternation: boolean;
}

const DEFAULT_PREFERENCES: UserPreferencesPayload = {
  lastBpm: 80,
  lastAccentFirstBeat: true,
  lastSubdivision: "eighth",
  lastPatternId: "preset-island-strum",
  lastTimerDurationSeconds: 300, // 5 minutes default
  lastMetronomeSubdivision: "quarter",
  strictAlternation: true,
};

const STORAGE_KEYS = {
  PREFERENCES: "guitar_companion_strumming_prefs",
  CUSTOM_PATTERNS: "guitar_companion_custom_patterns",
  LAST_ACTIVE_PATTERN: "guitar_companion_last_active_pattern",
};

export const strummingStorage = {
  getPreferences(): UserPreferencesPayload {
    return typedStorage.get<UserPreferencesPayload>(
      STORAGE_KEYS.PREFERENCES,
      DEFAULT_PREFERENCES
    );
  },

  savePreferences(prefs: Partial<UserPreferencesPayload>): void {
    const current = this.getPreferences();
    const updated = { ...current, ...prefs };
    typedStorage.set(STORAGE_KEYS.PREFERENCES, updated);
  },

  getCustomPatterns(): StrummingPattern[] {
    return typedStorage.get<StrummingPattern[]>(STORAGE_KEYS.CUSTOM_PATTERNS, []);
  },

  saveCustomPattern(pattern: StrummingPattern): void {
    // Constitutional Requirement: Anonymous guest mode always enforces ownerId: null
    const safePattern: StrummingPattern = {
      ...pattern,
      ownerId: null,
      updatedAt: new Date().toISOString(),
    };

    const existing = this.getCustomPatterns();
    const index = existing.findIndex((p) => p.id === pattern.id);

    if (index >= 0) {
      existing[index] = safePattern;
    } else {
      existing.push(safePattern);
    }

    typedStorage.set(STORAGE_KEYS.CUSTOM_PATTERNS, existing);
  },

  saveLastActivePattern(pattern: StrummingPattern): void {
    const safePattern: StrummingPattern = {
      ...pattern,
      ownerId: null,
      updatedAt: new Date().toISOString(),
    };
    typedStorage.set(STORAGE_KEYS.LAST_ACTIVE_PATTERN, safePattern);
  },

  getLastActivePattern(): StrummingPattern | null {
    const pattern = typedStorage.get<StrummingPattern | null>(
      STORAGE_KEYS.LAST_ACTIVE_PATTERN,
      null
    );
    if (pattern && validatePattern(pattern)) {
      return pattern;
    }
    return null;
  },

  deleteCustomPattern(patternId: string): boolean {
    const existing = this.getCustomPatterns();
    const filtered = existing.filter((p) => p.id !== patternId);
    if (filtered.length === existing.length) return false;

    typedStorage.set(STORAGE_KEYS.CUSTOM_PATTERNS, filtered);
    return true;
  },

  /**
   * Future-facing migration hook: Associates all anonymous records with a real userId
   * once authentication is added to the platform.
   */
  async migrateToUser(userId: string): Promise<void> {
    const patterns = this.getCustomPatterns();
    const migrated = patterns.map((p) => ({
      ...p,
      ownerId: userId,
      updatedAt: new Date().toISOString(),
    }));
    typedStorage.set(STORAGE_KEYS.CUSTOM_PATTERNS, migrated);
  },
};
