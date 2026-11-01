# Interface Contract: Client Storage Schema

**Feature Branch**: `002-basic-note-trainer`  
**Storage Engine**: Browser `localStorage`  
**Storage Key**: `guitar-companion:basic-note-trainer:stats`  

---

## 1. Schema Definition

```typescript
export interface StoredBasicNoteTrainerStats {
  version: 1;
  ownerId: null;                // Guest mode schema per Constitution Principle IV
  lifetimeOkeys: number;        // Cumulative successful cards solved
  lifetimeFailures: number;     // Cumulative incorrect choices selected
  allTimeBestStreak: number;    // Highest consecutive first-attempt streak
  lastPlayedAt: string;         // ISO 8601 string timestamp
}
```

---

## 2. Default Initial State

```json
{
  "version": 1,
  "ownerId": null,
  "lifetimeOkeys": 0,
  "lifetimeFailures": 0,
  "allTimeBestStreak": 0,
  "lastPlayedAt": "2026-11-01T00:00:00.000Z"
}
```

---

## 3. Storage Rules

1. **Defensive Parsing**: If `localStorage` is inaccessible (e.g. private browsing restrictions or disabled cookies), storage operations fallback to an in-memory mock store without breaking application rendering or throwing uncaught exceptions.
2. **Schema Versioning**: Stored data carries `version: 1`. Future migrations will check the version number before reading or updating fields.
3. **Zero-Mock User Integrity**: `ownerId` remains `null` until a formal multi-user authentication system is implemented.
