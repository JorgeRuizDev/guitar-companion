import { describe, it, expect, vi, beforeEach } from "vitest";
import { LookaheadScheduler } from "@/apps/strumming/engine/LookaheadScheduler";
import { StrummingPattern } from "@/apps/strumming/types";

function createMockPattern(): StrummingPattern {
  return {
    id: "test-pattern",
    name: "Test 8th",
    timeSignature: [4, 4],
    subdivision: "eighth",
    isPreset: true,
    ownerId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slots: Array.from({ length: 8 }, (_, i) => ({
      index: i,
      beatLabel: i % 2 === 0 ? `${(i / 2) + 1}` : "&",
      strokeDirection: i % 2 === 0 ? "down" : "up",
      isQuarterBeat: i % 2 === 0,
      isMeasureStart: i === 0,
    })),
  };
}

describe("LookaheadScheduler", () => {
  let pattern: StrummingPattern;

  beforeEach(() => {
    pattern = createMockPattern();
  });

  it("initializes in stopped state with 0.0 progress", () => {
    const scheduler = new LookaheadScheduler({
      bpm: 120,
      pattern,
      accentFirstBeat: true,
      countInMeasures: 0,
    });

    expect(scheduler.isPlaying()).toBe(false);
    expect(scheduler.isCountingIn()).toBe(false);
    expect(scheduler.getCurrentProgress()).toBe(0.0);
    scheduler.dispose();
  });

  it("clamps BPM between 40 and 240", () => {
    const scheduler = new LookaheadScheduler({
      bpm: 300, // Should clamp to 240
      pattern,
      accentFirstBeat: true,
      countInMeasures: 0,
    });

    // @ts-expect-error accessing private property for testing
    expect(scheduler.bpm).toBe(240);

    scheduler.setBpm(20); // Should clamp to 40
    // @ts-expect-error accessing private property for testing
    expect(scheduler.bpm).toBe(40);

    scheduler.dispose();
  });

  it("handles start, pause, and reset transitions", async () => {
    const scheduler = new LookaheadScheduler({
      bpm: 120,
      pattern,
      accentFirstBeat: true,
      countInMeasures: 0,
    });

    await scheduler.start();
    expect(scheduler.isPlaying()).toBe(true);

    scheduler.pause();
    expect(scheduler.isPlaying()).toBe(false);

    scheduler.reset();
    expect(scheduler.isPlaying()).toBe(false);
    expect(scheduler.getCurrentProgress()).toBe(0.0);

    // Test restart: should reset progress and start playing
    await scheduler.restart();
    expect(scheduler.isPlaying()).toBe(true);
    expect(scheduler.getCurrentProgress()).toBe(0.0);

    scheduler.dispose();
  });

  it("handles count-in state correctly when countInMeasures > 0", async () => {
    const onCountInTick = vi.fn();
    const onCountInComplete = vi.fn();

    const scheduler = new LookaheadScheduler({
      bpm: 120,
      pattern,
      accentFirstBeat: true,
      countInMeasures: 1,
      onCountInTick,
      onCountInComplete,
    });

    await scheduler.start();
    expect(scheduler.isPlaying()).toBe(true);
    expect(scheduler.isCountingIn()).toBe(true);

    scheduler.dispose();
  });

  it("configures and updates metronome subdivisions correctly", () => {
    const scheduler = new LookaheadScheduler({
      bpm: 100,
      pattern,
      accentFirstBeat: true,
      countInMeasures: 0,
      subdivision: "triplet",
    });

    expect(scheduler.getMetronomeSubdivision()).toBe("triplet");

    scheduler.setMetronomeSubdivision("sixteenth");
    expect(scheduler.getMetronomeSubdivision()).toBe("sixteenth");

    scheduler.dispose();
  });

  it("invokes onBeatTick callback on quarter beats", async () => {
    const onBeatTick = vi.fn();

    const scheduler = new LookaheadScheduler({
      bpm: 120,
      pattern,
      accentFirstBeat: true,
      countInMeasures: 0,
      onBeatTick,
    });

    await scheduler.start();
    // @ts-expect-error accessing private method for testing
    scheduler.scheduleEvents();

    expect(onBeatTick).toHaveBeenCalled();
    scheduler.dispose();
  });

  it("maintains smooth continuous progress through the final slot without prematurely dropping to 0", async () => {
    const scheduler = new LookaheadScheduler({
      bpm: 120, // 120 BPM: quarter = 0.5s, measure = 2.0s, slot = 0.25s (8 slots)
      pattern,
      accentFirstBeat: true,
      countInMeasures: 0,
    });

    await scheduler.start();

    // @ts-expect-error accessing private property for testing
    const audioHost = scheduler.audioHost;
    // @ts-expect-error accessing private property for testing
    const startTime = scheduler.measureStartTime;

    // Advance time and scheduler in realistic 25ms steps up to slot 7 (1.875s)
    let currentTime = startTime;
    while (currentTime <= startTime + 1.875) {
      currentTime += 0.025;
      vi.spyOn(audioHost, "getCurrentTime").mockReturnValue(currentTime);
      // @ts-expect-error accessing private method for testing
      scheduler.scheduleEvents();
    }

    // At 1.875s in a 2.0s measure (93.75%), progress should be ~0.9375 (> 0.90) and NOT 0.0
    const progressAtSlot7 = scheduler.getCurrentProgress();
    expect(progressAtSlot7).toBeGreaterThan(0.9);
    expect(progressAtSlot7).toBeLessThan(1.0);

    // When time crosses 2.0s (measure start of measure 2), progress cleanly wraps to beginning
    vi.spyOn(audioHost, "getCurrentTime").mockReturnValue(startTime + 2.05);
    const progressMeasure2 = scheduler.getCurrentProgress();
    expect(progressMeasure2).toBeLessThan(0.1);

    scheduler.dispose();
  });
});
