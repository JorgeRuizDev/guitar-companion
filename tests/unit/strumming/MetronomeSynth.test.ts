import { describe, it, expect, vi } from "vitest";
import { MetronomeSynth } from "@/apps/strumming/engine/MetronomeSynth";

describe("MetronomeSynth", () => {
  it("schedules standard pulse with appropriate frequency and exponential decay", () => {
    const mockCtx = new window.AudioContext();
    const synth = new MetronomeSynth(mockCtx);

    const oscSpy = vi.spyOn(mockCtx, "createOscillator");
    const gainSpy = vi.spyOn(mockCtx, "createGain");

    synth.scheduleTick(1.0, false, "beep");

    expect(oscSpy).toHaveBeenCalled();
    expect(gainSpy).toHaveBeenCalled();

    const createdOsc = oscSpy.mock.results[0].value;
    const createdGain = gainSpy.mock.results[0].value;

    expect(createdOsc.frequency.setValueAtTime).toHaveBeenCalledWith(600, 1.0);
    expect(createdGain.gain.setValueAtTime).toHaveBeenCalledWith(0.6, 1.0);
    expect(createdGain.gain.exponentialRampToValueAtTime).toHaveBeenCalled();
  });

  it("schedules accented beat 1 with higher frequency and higher gain", () => {
    const mockCtx = new window.AudioContext();
    const synth = new MetronomeSynth(mockCtx);

    const oscSpy = vi.spyOn(mockCtx, "createOscillator");
    const gainSpy = vi.spyOn(mockCtx, "createGain");

    synth.scheduleTick(2.0, true, "beep");

    const createdOsc = oscSpy.mock.results[0].value;
    const createdGain = gainSpy.mock.results[0].value;

    expect(createdOsc.frequency.setValueAtTime).toHaveBeenCalledWith(1000, 2.0);
    expect(createdGain.gain.setValueAtTime).toHaveBeenCalledWith(0.9, 2.0);
  });

  it("schedules completion chime with dual harmonic tones", () => {
    const mockCtx = new window.AudioContext();
    const synth = new MetronomeSynth(mockCtx);

    const oscSpy = vi.spyOn(mockCtx, "createOscillator");
    synth.scheduleCompletionChime(3.0);

    // Should create 2 oscillators for the two chime notes
    expect(oscSpy).toHaveBeenCalledTimes(2);
  });

  it("schedules subtle subdivision ticks with appropriate frequency and lower gain", () => {
    const mockCtx = new window.AudioContext();
    const synth = new MetronomeSynth(mockCtx);

    const oscSpy = vi.spyOn(mockCtx, "createOscillator");
    const gainSpy = vi.spyOn(mockCtx, "createGain");

    synth.scheduleSubdivisionTick(1.5, "woodblock");

    expect(oscSpy).toHaveBeenCalled();
    expect(gainSpy).toHaveBeenCalled();

    const createdOsc = oscSpy.mock.results[0].value;
    const createdGain = gainSpy.mock.results[0].value;

    expect(createdOsc.frequency.setValueAtTime).toHaveBeenCalledWith(550, 1.5);
    expect(createdGain.gain.setValueAtTime).toHaveBeenCalledWith(0.35, 1.5);
    expect(createdGain.gain.exponentialRampToValueAtTime).toHaveBeenCalled();
  });

  it("plays subdivision preview correctly for eighth notes", () => {
    const mockCtx = new window.AudioContext();
    const synth = new MetronomeSynth(mockCtx);

    const oscSpy = vi.spyOn(mockCtx, "createOscillator");
    synth.playSubdivisionPreview("eighth", "woodblock");

    // Downbeat + 1 eighth subdivision tick = 2 oscillators scheduled
    expect(oscSpy).toHaveBeenCalledTimes(2);
  });

  it("plays subdivision preview correctly for sixteenth notes", () => {
    const mockCtx = new window.AudioContext();
    const synth = new MetronomeSynth(mockCtx);

    const oscSpy = vi.spyOn(mockCtx, "createOscillator");
    synth.playSubdivisionPreview("sixteenth", "woodblock");

    // Downbeat + 3 sixteenth subdivision ticks = 4 oscillators scheduled
    expect(oscSpy).toHaveBeenCalledTimes(4);
  });
});
