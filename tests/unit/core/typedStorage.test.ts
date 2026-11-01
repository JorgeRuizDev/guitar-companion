import { describe, it, expect, beforeEach } from "vitest";
import { typedStorage } from "@/core/storage/typedStorage";

describe("typedStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns fallback value when key does not exist", () => {
    const result = typedStorage.get("non-existent-key", 42);
    expect(result).toBe(42);
  });

  it("stores and retrieves complex JSON objects correctly", () => {
    const payload = { bpm: 120, accent: true, pattern: "Island Strum" };
    const saved = typedStorage.set("test-config", payload);
    expect(saved).toBe(true);

    const retrieved = typedStorage.get("test-config", { bpm: 80, accent: false, pattern: "" });
    expect(retrieved).toEqual(payload);
  });

  it("removes keys correctly", () => {
    typedStorage.set("temp-key", "value");
    expect(typedStorage.get("temp-key", null)).toBe("value");

    typedStorage.remove("temp-key");
    expect(typedStorage.get("temp-key", null)).toBeNull();
  });

  it("returns fallback when JSON parsing fails on corrupted data", () => {
    window.localStorage.setItem("corrupt-key", "{invalid json");
    const fallback = { safe: true };
    const result = typedStorage.get("corrupt-key", fallback);
    expect(result).toEqual(fallback);
  });
});
