# Interface Contract: Local Storage Persistence

**Feature Branch**: `003-basic-chord-trainer`  
**Storage Key**: `guitar_companion_chord_trainer_v1`  
**Mechanism**: `window.localStorage` wrapped with `@/core/storage/typedStorage`  
**Version**: 1.0.0  

---

## 1. Overview & Compliance

In strict compliance with Constitution Principle IV (Zero-Mock UI):
- The chord trainer operates in **Guest Mode (Anonymous)**.
- Data structures are explicitly modelled with an `ownerId: null` field ready for multi-user authentication without schema redesigns.
- No fake user avatars, dummy names, or mock logout buttons are shown.

---

## 2. Storage Schema

```typescript
export interface StoredChordTrainerPreferences {
  version: 1;
  ownerId: null;                  // Ready for cloud sync when auth is implemented
  selectedChordIds: string[];     // Persisted active chord subset in standalone view
  selectedMode: PracticeMode;     // 'alternate', 'draw', or 'identify'
  lifetimeHits: number;
  lifetimeMisses: number;
  allTimeBestStreak: number;
  lastPlayedAt: string;           // ISO 8601 timestamp
}
```

---

## 3. Storage Operations

```typescript
export interface ChordTrainerStorageAdapter {
  getPreferences(): StoredChordTrainerPreferences;
  savePreferences(prefs: Partial<StoredChordTrainerPreferences>): void;
  recordSessionResult(hits: number, misses: number, bestStreak: number): void;
  clear(): void;
}
```
