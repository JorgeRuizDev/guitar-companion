import { describe, it, expect } from "vitest";
import { beginnerPresets } from "@/apps/strumming/presets/beginnerPatterns";
import { validatePattern } from "@/apps/strumming/types";

describe("beginnerPresets Library", () => {
  it("contains valid presets complying with data model constraints", () => {
    expect(beginnerPresets.length).toBeGreaterThanOrEqual(4);

    beginnerPresets.forEach((preset) => {
      expect(validatePattern(preset)).toBe(true);
      expect(preset.ownerId).toBeNull();
      expect(preset.isPreset).toBe(true);
      expect(preset.name.length).toBeGreaterThan(0);
      expect(preset.name.length).toBeLessThanOrEqual(50);

      if (preset.timeSignature && preset.timeSignature[0] === 3) {
        expect(preset.slots.length).toBe(6);
      } else if (preset.timeSignature && preset.timeSignature[0] === 6) {
        expect(preset.slots.length).toBe(12);
      } else if (preset.subdivision === "eighth") {
        expect(preset.slots.length).toBe(8);
      } else {
        expect(preset.slots.length).toBe(16);
      }

      // First slot must be measure start
      expect(preset.slots[0].isMeasureStart).toBe(true);
      expect(preset.slots[0].isQuarterBeat).toBe(true);
      expect(preset.slots[0].index).toBe(0);
    });
  });

  it("includes the iconic Island Strum pattern with correct strokes", () => {
    const islandStrum = beginnerPresets.find((p) => p.id === "preset-island-strum");
    expect(islandStrum).toBeDefined();

    const directions = islandStrum!.slots.map((s) => s.strokeDirection);
    // D - D U - U D U
    expect(directions).toEqual(["down", "none", "down", "up", "none", "up", "down", "up"]);
  });

  it("includes 3/4 waltz presets (6 slots) and 6/8 compound ballad preset (12 slots)", () => {
    const waltzBasic = beginnerPresets.find((p) => p.id === "preset-waltz-basic");
    expect(waltzBasic).toBeDefined();
    expect(waltzBasic!.timeSignature).toEqual([3, 4]);
    expect(waltzBasic!.slots.length).toBe(6);

    const waltzBallad = beginnerPresets.find((p) => p.id === "preset-waltz-ballad");
    expect(waltzBallad).toBeDefined();
    expect(waltzBallad!.timeSignature).toEqual([3, 4]);
    expect(waltzBallad!.slots.length).toBe(6);

    const ballad68 = beginnerPresets.find((p) => p.id === "preset-ballad-68");
    expect(ballad68).toBeDefined();
    expect(ballad68!.timeSignature).toEqual([6, 8]);
    expect(ballad68!.slots.length).toBe(12);
  });
});
