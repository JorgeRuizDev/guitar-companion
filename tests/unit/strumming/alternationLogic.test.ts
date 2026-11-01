import { describe, it, expect } from "vitest";
import {
  StrokeDirection,
  BeatSlot,
  getPositionalStrokeDirection,
  alignSlotsToStrictAlternation,
} from "@/apps/strumming/types";

describe("Alternation Logic (D/U vs Free-form Mode)", () => {
  it("enforces positional D/U motion where odd positions are Down and even positions are Up", () => {
    // 16th note subdivision: 1 e & a 2 e & a 3 e & a 4 e & a
    // Pos 1 (index 0, '1'): odd -> down
    // Pos 2 (index 1, 'e'): even -> up
    // Pos 3 (index 2, '&'): odd -> down (Fix: & MUST be Down in 16th subdivisions!)
    // Pos 4 (index 3, 'a'): even -> up
    expect(getPositionalStrokeDirection(0)).toBe("down");
    expect(getPositionalStrokeDirection(1)).toBe("up");
    expect(getPositionalStrokeDirection(2)).toBe("down");
    expect(getPositionalStrokeDirection(3)).toBe("up");
    expect(getPositionalStrokeDirection(4)).toBe("down");
    expect(getPositionalStrokeDirection(5)).toBe("up");
    expect(getPositionalStrokeDirection(6)).toBe("down");
    expect(getPositionalStrokeDirection(7)).toBe("up");
  });

  it("ensures that in a 16th grid, slot '&' (index 2) is Down even if 'e' is inactive (empty)", () => {
    // User activates slot 0 ('1') and slot 2 ('&'), while slot 1 ('e') is empty
    const slots: BeatSlot[] = Array.from({ length: 16 }, (_, i) => ({
      index: i,
      beatLabel: `${i}`,
      strokeDirection: [0, 2, 4, 6].includes(i) ? "down" : "none",
      isQuarterBeat: i % 4 === 0,
      isMeasureStart: i === 0,
    }));

    const aligned = alignSlotsToStrictAlternation(slots);

    // Slot 0 ('1', 1st pos, odd) -> down
    expect(aligned[0].strokeDirection).toBe("down");
    // Slot 1 ('e', 2nd pos, even) -> none (remains empty)
    expect(aligned[1].strokeDirection).toBe("none");
    // Slot 2 ('&', 3rd pos, odd) -> down (MUST BE DOWN, NOT UP!)
    expect(aligned[2].strokeDirection).toBe("down");
    // Slot 4 ('2', 5th pos, odd) -> down
    expect(aligned[4].strokeDirection).toBe("down");
    // Slot 6 ('&', 7th pos, odd) -> down
    expect(aligned[6].strokeDirection).toBe("down");
  });

  it("permits free-form arbitrary patterns like DDDU when free mode is used", () => {
    const slots: BeatSlot[] = Array.from({ length: 16 }, (_, i) => ({
      index: i,
      beatLabel: `${i}`,
      strokeDirection: "none",
      isQuarterBeat: i % 4 === 0,
      isMeasureStart: i === 0,
    }));

    // In free-form mode, slots can be set arbitrarily:
    slots[0].strokeDirection = "down";
    slots[2].strokeDirection = "down";
    slots[4].strokeDirection = "down";
    slots[6].strokeDirection = "up";

    const directions = [
      slots[0].strokeDirection,
      slots[2].strokeDirection,
      slots[4].strokeDirection,
      slots[6].strokeDirection,
    ];

    expect(directions).toEqual(["down", "down", "down", "up"]); // DDDU pattern allowed in free mode!
  });

  it("re-aligns custom patterns to positional D/U when toggling alternating mode back on", () => {
    // User had custom arbitrary strokes in free mode
    const slots: BeatSlot[] = Array.from({ length: 8 }, (_, i) => ({
      index: i,
      beatLabel: `${i}`,
      strokeDirection: "none",
      isQuarterBeat: i % 2 === 0,
      isMeasureStart: i === 0,
    }));

    slots[0].strokeDirection = "up";   // user set odd pos to up
    slots[1].strokeDirection = "down"; // user set even pos to down
    slots[2].strokeDirection = "up";   // user set odd pos to up
    slots[3].strokeDirection = "up";   // user set even pos to up

    // Re-aligning to strict alternating (impares -> down, pares -> up)
    const reAligned = alignSlotsToStrictAlternation(slots);

    expect(reAligned[0].strokeDirection).toBe("down"); // pos 1 (odd) -> down
    expect(reAligned[1].strokeDirection).toBe("up");   // pos 2 (even) -> up
    expect(reAligned[2].strokeDirection).toBe("down"); // pos 3 (odd) -> down
    expect(reAligned[3].strokeDirection).toBe("up");   // pos 4 (even) -> up
  });
});
