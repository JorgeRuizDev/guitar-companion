import { describe, it, expect, beforeEach } from "vitest";
import { strummingStorage } from "@/apps/strumming/storage/strummingStorage";
import { StrummingPattern } from "@/apps/strumming/types";

describe("strummingStorage Adapter", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns default preferences when storage is empty", () => {
    const prefs = strummingStorage.getPreferences();
    expect(prefs.lastBpm).toBe(80);
    expect(prefs.lastAccentFirstBeat).toBe(true);
    expect(prefs.lastSubdivision).toBe("eighth");
    expect(prefs.lastMetronomeSubdivision).toBe("quarter");
    expect(prefs.strictAlternation).toBe(true);
  });

  it("persists partial preference updates accurately", () => {
    strummingStorage.savePreferences({
      lastBpm: 140,
      lastAccentFirstBeat: false,
      lastMetronomeSubdivision: "triplet",
      strictAlternation: false,
    });
    const updated = strummingStorage.getPreferences();
    expect(updated.lastBpm).toBe(140);
    expect(updated.lastAccentFirstBeat).toBe(false);
    expect(updated.lastSubdivision).toBe("eighth"); // Unchanged
    expect(updated.lastMetronomeSubdivision).toBe("triplet");
    expect(updated.strictAlternation).toBe(false);
  });

  it("saves custom pattern and strictly enforces ownerId as null (Zero-Mock UI guest mode)", () => {
    const customPattern: StrummingPattern = {
      id: "my-pattern-1",
      name: "My Funky Strum",
      timeSignature: [4, 4],
      subdivision: "eighth",
      isPreset: false,
      ownerId: "fake-user-id", // Attempt to inject an owner ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slots: [],
    };

    strummingStorage.saveCustomPattern(customPattern);
    const storedPatterns = strummingStorage.getCustomPatterns();
    expect(storedPatterns.length).toBe(1);
    expect(storedPatterns[0].id).toBe("my-pattern-1");
    expect(storedPatterns[0].ownerId).toBeNull(); // Must be nullified
  });

  it("deletes custom patterns by id", () => {
    const pattern: StrummingPattern = {
      id: "to-delete",
      name: "To Delete",
      timeSignature: [4, 4],
      subdivision: "eighth",
      isPreset: false,
      ownerId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slots: [],
    };

    strummingStorage.saveCustomPattern(pattern);
    expect(strummingStorage.getCustomPatterns().length).toBe(1);

    const deleted = strummingStorage.deleteCustomPattern("to-delete");
    expect(deleted).toBe(true);
    expect(strummingStorage.getCustomPatterns().length).toBe(0);
  });

  it("persists and restores the last active pattern correctly in localStorage", () => {
    expect(strummingStorage.getLastActivePattern()).toBeNull();

    const validPattern: StrummingPattern = {
      id: "last-custom-123",
      name: "Last Custom Pattern",
      timeSignature: [4, 4],
      subdivision: "eighth",
      isPreset: false,
      ownerId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slots: Array.from({ length: 8 }, (_, i) => ({
        index: i,
        beatLabel: i % 2 === 0 ? `${i / 2 + 1}` : "&",
        strokeDirection: i % 2 === 0 ? "down" : "up",
        isQuarterBeat: i % 2 === 0,
        isMeasureStart: i === 0,
      })),
    };

    strummingStorage.saveLastActivePattern(validPattern);
    const restored = strummingStorage.getLastActivePattern();
    expect(restored).not.toBeNull();
    expect(restored?.id).toBe("last-custom-123");
    expect(restored?.slots.length).toBe(8);
    expect(restored?.slots[0].strokeDirection).toBe("down");
    expect(restored?.slots[1].strokeDirection).toBe("up");
  });

  it("migrates anonymous records to an authenticated user when requested", async () => {
    const pattern: StrummingPattern = {
      id: "user-pattern",
      name: "User Pattern",
      timeSignature: [4, 4],
      subdivision: "eighth",
      isPreset: false,
      ownerId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slots: [],
    };

    strummingStorage.saveCustomPattern(pattern);
    await strummingStorage.migrateToUser("real-auth-user-123");

    const stored = strummingStorage.getCustomPatterns();
    expect(stored[0].ownerId).toBe("real-auth-user-123");
  });
});
