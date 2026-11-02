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

  it("calculates dynamic measure duration accurately for 4/4, 3/4, and 6/8 time signatures", () => {
    // 4/4 at 120 BPM: (4 * (4/4) * 60) / 120 = 2.0s
    const scheduler44 = new LookaheadScheduler({
      bpm: 120,
      pattern: { ...pattern, timeSignature: [4, 4] },
      accentFirstBeat: true,
      countInMeasures: 0,
    });
    // @ts-expect-error accessing private method for testing
    expect(scheduler44.getMeasureDuration()).toBeCloseTo(2.0, 3);
    scheduler44.dispose();

    // 3/4 at 120 BPM: (3 * (4/4) * 60) / 120 = 1.5s
    const scheduler34 = new LookaheadScheduler({
      bpm: 120,
      pattern: { ...pattern, timeSignature: [3, 4] },
      accentFirstBeat: true,
      countInMeasures: 0,
    });
    // @ts-expect-error accessing private method for testing
    expect(scheduler34.getMeasureDuration()).toBeCloseTo(1.5, 3);
    scheduler34.dispose();

    // 6/8 at 120 BPM: (6 * (4/8) * 60) / 120 = 1.5s
    const scheduler68 = new LookaheadScheduler({
      bpm: 120,
      pattern: { ...pattern, timeSignature: [6, 8] },
      accentFirstBeat: true,
      countInMeasures: 0,
    });
    // @ts-expect-error accessing private method for testing
    expect(scheduler68.getMeasureDuration()).toBeCloseTo(1.5, 3);
    scheduler68.dispose();
  });

  it("calculates slot duration accurately for custom block lengths (e.g. 10 slots)", () => {
    const customSlotsPattern: StrummingPattern = {
      ...pattern,
      slots: Array.from({ length: 10 }, (_, i) => ({
        index: i,
        beatLabel: `${i + 1}`,
        strokeDirection: "none",
        isQuarterBeat: i % 2 === 0,
        isMeasureStart: i === 0,
      })),
    };

    const scheduler = new LookaheadScheduler({
      bpm: 120,
      pattern: customSlotsPattern,
      accentFirstBeat: true,
      countInMeasures: 0,
    });

    // 4/4 measure is 2.0s; 10 slots -> 0.2s per slot
    // @ts-expect-error accessing private method for testing
    expect(scheduler.getSlotDuration()).toBeCloseTo(0.2, 3);
    scheduler.dispose();
  });

  it("schedules steady metronome beats in 4/4 regardless of odd custom slot counts (5 slots)", async () => {
    const custom5Slots: StrummingPattern = {
      ...pattern,
      timeSignature: [4, 4],
      slots: Array.from({ length: 5 }, (_, i) => ({
        index: i,
        beatLabel: `${i + 1}`,
        strokeDirection: "none",
        isQuarterBeat: false,
        isMeasureStart: i === 0,
      })),
    };

    const scheduledTicks: { time: number; isAccent: boolean }[] = [];
    const scheduler = new LookaheadScheduler({
      bpm: 120, // 120 BPM: quarter = 0.5s, 4 beats per measure
      pattern: custom5Slots,
      accentFirstBeat: true,
      countInMeasures: 0,
    });

    // @ts-expect-error accessing private synth
    vi.spyOn(scheduler.synth, "scheduleTick").mockImplementation((time, isAccent) => {
      scheduledTicks.push({ time, isAccent });
    });

    await scheduler.start();

    // Advance through 2 full measures (4.0s) in 25ms steps
    // @ts-expect-error accessing private property
    const audioHost = scheduler.audioHost;
    // @ts-expect-error accessing private property
    const startTime = scheduler.measureStartTime;

    for (let t = startTime; t <= startTime + 4.1; t += 0.025) {
      vi.spyOn(audioHost, "getCurrentTime").mockReturnValue(t);
      // @ts-expect-error accessing private method
      scheduler.scheduleEvents();
    }

    // Must have scheduled at least 8 beats across the 2 measures
    expect(scheduledTicks.length).toBeGreaterThanOrEqual(8);

    // Verify constant 0.5s interval between consecutive beats (NO 40%/20% stumbling gaps)
    for (let i = 1; i < 8; i++) {
      const delta = scheduledTicks[i].time - scheduledTicks[i - 1].time;
      expect(delta).toBeCloseTo(0.5, 3);
    }

    // Beat 0 (index 0) and Beat 4 (index 4) are Beat 1 of measures 1 and 2 (accented)
    expect(scheduledTicks[0].isAccent).toBe(true);
    expect(scheduledTicks[4].isAccent).toBe(true);
    // Beats 1, 2, 3 are unaccented
    expect(scheduledTicks[1].isAccent).toBe(false);
    expect(scheduledTicks[2].isAccent).toBe(false);
    expect(scheduledTicks[3].isAccent).toBe(false);

    scheduler.dispose();
  });

  it("schedules 6/8 pulses with accent on beat 1 only and no central accent", async () => {
    const pattern68: StrummingPattern = {
      ...pattern,
      timeSignature: [6, 8],
      slots: Array.from({ length: 12 }, (_, i) => ({
        index: i,
        beatLabel: i % 2 === 0 ? `${(i / 2) + 1}` : "&",
        strokeDirection: i % 2 === 0 ? "down" : "up",
        isQuarterBeat: i % 2 === 0,
        isMeasureStart: i === 0,
      })),
    };

    const scheduledTicks: { time: number; isAccent: boolean }[] = [];

    const scheduler = new LookaheadScheduler({
      bpm: 120, // 120 BPM: 6/8 measure = 1.5s, pulse = 0.25s (6 pulses per measure)
      pattern: pattern68,
      accentFirstBeat: true,
      countInMeasures: 0,
    });

    // @ts-expect-error accessing private synth
    vi.spyOn(scheduler.synth, "scheduleTick").mockImplementation((time, isAccent) => {
      scheduledTicks.push({ time, isAccent: !!isAccent });
    });

    await scheduler.start();

    // @ts-expect-error accessing private property
    const audioHost = scheduler.audioHost;
    // @ts-expect-error accessing private property
    const startTime = scheduler.measureStartTime;

    for (let t = startTime; t <= startTime + 1.6; t += 0.025) {
      vi.spyOn(audioHost, "getCurrentTime").mockReturnValue(t);
      // @ts-expect-error accessing private method
      scheduler.scheduleEvents();
    }

    // Pulse 0: Primary Accent (isAccent=true)
    // Pulses 1..5: Standard pulses (isAccent=false), NO central accent on pulse 3
    expect(scheduledTicks.length).toBeGreaterThanOrEqual(6);
    expect(scheduledTicks[0].isAccent).toBe(true);
    expect(scheduledTicks[1].isAccent).toBe(false);
    expect(scheduledTicks[2].isAccent).toBe(false);
    expect(scheduledTicks[3].isAccent).toBe(false); // No central accent
    expect(scheduledTicks[4].isAccent).toBe(false);
    expect(scheduledTicks[5].isAccent).toBe(false);

    scheduler.dispose();
  });

  it("updates beats per measure when block count expands from 8 to 10 (5 beats)", () => {
    // 8 slots -> 4 beats
    const scheduler8 = new LookaheadScheduler({
      bpm: 120,
      pattern: { ...pattern, slots: Array.from({ length: 8 }, (_, i) => ({ index: i, beatLabel: `${i}`, strokeDirection: "none", isQuarterBeat: i % 2 === 0, isMeasureStart: i === 0 })), timeSignature: [4, 4] },
      accentFirstBeat: true,
      countInMeasures: 0,
    });
    expect(scheduler8.getBeatsPerMeasure()).toBe(4);
    scheduler8.dispose();

    // 10 slots -> 5 beats
    const scheduler10 = new LookaheadScheduler({
      bpm: 120,
      pattern: { ...pattern, slots: Array.from({ length: 10 }, (_, i) => ({ index: i, beatLabel: `${i}`, strokeDirection: "none", isQuarterBeat: i % 2 === 0, isMeasureStart: i === 0 })), timeSignature: [5, 4] },
      accentFirstBeat: true,
      countInMeasures: 0,
    });
    expect(scheduler10.getBeatsPerMeasure()).toBe(5);
    scheduler10.dispose();
  });
});
