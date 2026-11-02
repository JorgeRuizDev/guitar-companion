/**
 * MetronomeSynth synthesizes clean acoustic pulses and completion chimes using
 * native Web Audio oscillators and exponential decay gain envelopes.
 * Operates with 0 KB external audio asset latency.
 */

import { MetronomeSubdivision } from "../types";

export type SoundTheme = 'woodblock' | 'click' | 'beep';

export class MetronomeSynth {
  constructor(private context: AudioContext) {}

  /**
   * Schedules a metronome tick at the exact audio hardware timestamp.
   *
   * @param time Scheduled AudioContext.currentTime in seconds
   * @param isAccent Whether this pulse is beat 1 / accented
   * @param theme Sound profile ('woodblock' | 'click' | 'beep')
   */
  public scheduleTick(
    time: number,
    isAccent: boolean,
    theme: SoundTheme = 'woodblock',
    isCompoundAccent: boolean = false
  ): void {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.connect(gain);
    gain.connect(this.context.destination);

    // Profile frequency and waveform selection
    let baseFreq = isAccent ? 1000 : (isCompoundAccent ? 800 : 600);
    let duration = 0.05; // 50ms default click duration
    let peakGain = isAccent ? 0.9 : (isCompoundAccent ? 0.75 : 0.6);

    if (theme === 'woodblock') {
      osc.type = 'triangle';
      baseFreq = isAccent ? 1200 : (isCompoundAccent ? 950 : 750);
      duration = 0.045;
      peakGain = isAccent ? 0.9 : (isCompoundAccent ? 0.78 : 0.65);
    } else if (theme === 'click') {
      osc.type = 'sine';
      baseFreq = isAccent ? 1600 : (isCompoundAccent ? 1200 : 900);
      duration = 0.035;
      peakGain = isAccent ? 0.9 : (isCompoundAccent ? 0.75 : 0.6);
    } else {
      // 'beep'
      osc.type = 'sine';
      baseFreq = isAccent ? 1000 : (isCompoundAccent ? 800 : 600);
      duration = 0.06;
      peakGain = isAccent ? 0.9 : (isCompoundAccent ? 0.75 : 0.6);
    }

    const now = this.context.currentTime;
    const tickTime = Math.max(time, now + 0.002);

    osc.frequency.setValueAtTime(baseFreq, tickTime);

    // Volume envelope: sharp attack, exponential decay down to near-silence
    gain.gain.setValueAtTime(0, 0);
    gain.gain.cancelScheduledValues(tickTime);
    gain.gain.setValueAtTime(peakGain, tickTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, tickTime + duration);

    osc.start(tickTime);
    osc.stop(tickTime + duration + 0.01);
  }

  /**
   * Schedules a crisp metronome subdivision tick at the exact audio hardware timestamp.
   * Uses distinct frequency and punchy envelope for clear alternating pulse ("tic - toc").
   */
  public scheduleSubdivisionTick(
    time: number,
    theme: SoundTheme = 'woodblock',
    gainLevel: number = 0.35
  ): void {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.connect(gain);
    gain.connect(this.context.destination);

    let baseFreq = 500;
    let duration = 0.035; // 35ms, tight and punchy

    if (theme === 'woodblock') {
      osc.type = 'triangle';
      baseFreq = 550;
      duration = 0.035;
    } else if (theme === 'click') {
      osc.type = 'sine';
      baseFreq = 700;
      duration = 0.025;
    } else {
      // 'beep'
      osc.type = 'sine';
      baseFreq = 450;
      duration = 0.035;
    }

    const now = this.context.currentTime;
    const tickTime = Math.max(time, now + 0.002);

    osc.frequency.setValueAtTime(baseFreq, tickTime);

    // Balanced gain: audible, distinct sub-beat click
    gain.gain.setValueAtTime(0, 0);
    gain.gain.cancelScheduledValues(tickTime);
    gain.gain.setValueAtTime(gainLevel, tickTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, tickTime + duration);

    osc.start(tickTime);
    osc.stop(tickTime + duration + 0.01);
  }

  /**
   * Plays an immediate rhythmic preview of a metronome subdivision so the user
   * hears instant acoustic feedback upon clicking a subdivision button.
   */
  public playSubdivisionPreview(
    subdivision: MetronomeSubdivision,
    theme: SoundTheme = 'woodblock'
  ): void {
    const now = this.context.currentTime + 0.02;
    const previewQuarterDur = 0.35; // ~85 BPM feel

    // Play primary downbeat click (accented)
    this.scheduleTick(now, true, theme);

    if (subdivision === 'eighth') {
      this.scheduleSubdivisionTick(now + 0.5 * previewQuarterDur, theme, 0.45);
    } else if (subdivision === 'sixteenth') {
      this.scheduleSubdivisionTick(now + 0.25 * previewQuarterDur, theme, 0.45);
      this.scheduleSubdivisionTick(now + 0.5 * previewQuarterDur, theme, 0.45);
      this.scheduleSubdivisionTick(now + 0.75 * previewQuarterDur, theme, 0.45);
    } else if (subdivision === 'triplet') {
      this.scheduleSubdivisionTick(now + (1 / 3) * previewQuarterDur, theme, 0.45);
      this.scheduleSubdivisionTick(now + (2 / 3) * previewQuarterDur, theme, 0.45);
    } else if (subdivision === 'swing') {
      this.scheduleSubdivisionTick(now + (2 / 3) * previewQuarterDur, theme, 0.45);
    }
  }

  /**
   * Schedules a gentle dual-tone acoustic chime when practice timer completes.
   * Continues without interrupting regular metronome pulses (FR-016).
   */
  public scheduleCompletionChime(time: number): void {
    const frequencies = [587.33, 880.0]; // D5 and A5 harmonious chime
    const duration = 0.6;
    const now = this.context.currentTime;
    const chimeStart = Math.max(time, now + 0.005);

    frequencies.forEach((freq, idx) => {
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();

      const noteTime = chimeStart + idx * 0.15;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.cancelScheduledValues(noteTime);
      gain.gain.setValueAtTime(0.4, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration);

      osc.connect(gain);
      gain.connect(this.context.destination);

      osc.start(noteTime);
      osc.stop(noteTime + duration + 0.05);
    });
  }
}
