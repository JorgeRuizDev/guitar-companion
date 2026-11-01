# Contract: Client Storage & Persistence Interface

**Feature**: `001-strumming-pattern-trainer`  
**Contract Version**: `1.0.0`  

---

## 1. Purpose
Defines the local client persistence layer contract ensuring full compliance with the Constitution's **Zero-Mock UI** and **Guest-First / User-Centric Data Model** principles.

---

## 2. Interface Definition

```typescript
export interface UserPreferencesPayload {
  lastBpm: number;
  lastAccentFirstBeat: boolean;
  lastSubdivision: 'eighth' | 'sixteenth';
  lastPatternId: string;
  lastTimerDurationSeconds: number;
}

export interface IStrummingStorageAdapter {
  /**
   * Loads saved user preferences from local storage or returns sensible defaults.
   */
  getPreferences(): UserPreferencesPayload;

  /**
   * Persists updated preferences to client storage.
   */
  savePreferences(prefs: Partial<UserPreferencesPayload>): void;

  /**
   * Retrieves all custom user-created patterns.
   */
  getCustomPatterns(): StrummingPattern[];

  /**
   * Saves or updates a custom pattern.
   * Ensures ownerId is set to null (anonymous mode).
   */
  saveCustomPattern(pattern: StrummingPattern): void;

  /**
   * Removes a custom pattern by ID. Presets cannot be removed.
   */
  deleteCustomPattern(patternId: string): boolean;

  /**
   * Future-facing migration hook: Associates all anonymous records with a real userId
   * once authentication is added to the platform.
   */
  migrateToUser(userId: string): Promise<void>;
}
```

---

## 3. Guarantees & Constraints
- Under anonymous/guest mode, `ownerId` MUST be stored as `null`.
- The storage implementation MUST gracefully handle private browsing mode or storage quota limits by maintaining an in-memory fallback.
- No network requests or mock user profile schemas shall be created by this adapter.
