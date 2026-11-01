import { StrummingPattern, clampBpm, MetronomeSubdivision } from "../types";
import { WebAudioHost } from "./WebAudioHost";
import { MetronomeSynth } from "./MetronomeSynth";

export interface PlaybackEngineOptions {
  bpm: number;
  pattern: StrummingPattern;
  accentFirstBeat: boolean;
  countInMeasures: 0 | 1 | 2 | 3;
  subdivision?: MetronomeSubdivision;
  onTick?: (slotIndex: number, audioTime: number) => void;
  onBeatTick?: (beatIndex: number) => void;
  onCountInTick?: (beatRemaining: number, totalBeats: number) => void;
  onCountInComplete?: () => void;
  onMeasureComplete?: (measureCount: number) => void;
}

export interface IPlaybackEngine {
  start(): Promise<void>;
  togglePlayPause(): Promise<void>;
  pause(): void;
  reset(): void;
  setBpm(bpm: number): void;
  setCountIn(measures: 0 | 1 | 2 | 3): void;
  setPattern(pattern: StrummingPattern): void;
  setAccentFirstBeat(enabled: boolean): void;
  setMetronomeSubdivision(subdivision: MetronomeSubdivision): void;
  playSubdivisionPreview?(subdivision: MetronomeSubdivision): void;
  isPlaying(): boolean;
  isCountingIn(): boolean;
  getCurrentProgress(): number;
  dispose(): void;
}

export class LookaheadScheduler implements IPlaybackEngine {
  private bpm: number;
  private pattern: StrummingPattern;
  private accentFirstBeat: boolean;
  private countInMeasures: 0 | 1 | 2 | 3;
  private metronomeSubdivision: MetronomeSubdivision;

  private onTick?: (slotIndex: number, audioTime: number) => void;
  private onBeatTick?: (beatIndex: number) => void;
  private onCountInTick?: (beatRemaining: number, totalBeats: number) => void;
  private onCountInComplete?: () => void;
  private onMeasureComplete?: (measureCount: number) => void;

  private audioHost: WebAudioHost;
  private synth: MetronomeSynth;

  private playing: boolean = false;
  private countingIn: boolean = false;
  private timerId: number | null = null;

  // Audio scheduling state
  private nextEventTime: number = 0;
  private currentSlotIndex: number = 0;
  private countInBeatsRemaining: number = 0;
  private totalCountInBeats: number = 0;
  private measureStartTime: number = 0;
  private completedMeasuresCount: number = 0;
  private pausedProgress: number = 0;

  // Constants
  private readonly lookaheadMs: number = 100;
  private readonly scheduleIntervalMs: number = 25;

  constructor(options: PlaybackEngineOptions, host?: WebAudioHost) {
    this.bpm = clampBpm(options.bpm);
    this.pattern = options.pattern;
    this.accentFirstBeat = options.accentFirstBeat;
    this.countInMeasures = options.countInMeasures;
    this.metronomeSubdivision = options.subdivision || "quarter";
    this.onTick = options.onTick;
    this.onBeatTick = options.onBeatTick;
    this.onCountInTick = options.onCountInTick;
    this.onCountInComplete = options.onCountInComplete;
    this.onMeasureComplete = options.onMeasureComplete;

    this.audioHost = host || new WebAudioHost();
    this.synth = new MetronomeSynth(this.audioHost.getContext());
  }

  private getQuarterBeatDuration(): number {
    return 60.0 / this.bpm;
  }

  private getMeasureDuration(): number {
    return 4.0 * this.getQuarterBeatDuration();
  }

  private getSlotDuration(): number {
    const slots = this.pattern.slots.length;
    return this.getMeasureDuration() / slots;
  }

  public async start(): Promise<void> {
    if (this.playing) return;

    await this.audioHost.ensureRunning();
    const now = this.audioHost.getCurrentTime();

    this.playing = true;

    if (this.pausedProgress > 0) {
      // Resume from paused position
      const measureDur = this.getMeasureDuration();
      this.measureStartTime = now - (this.pausedProgress * measureDur);
      this.nextEventTime = now;
      this.pausedProgress = 0;
      this.countingIn = false;
    } else if (this.countInMeasures > 0) {
      // Begin count-in
      this.countingIn = true;
      this.totalCountInBeats = this.countInMeasures * 4;
      this.countInBeatsRemaining = this.totalCountInBeats;
      this.nextEventTime = now + 0.05; // tiny lead-in to align hardware queue
    } else {
      // Immediate pattern start
      this.countingIn = false;
      this.nextEventTime = now + 0.05;
      this.measureStartTime = this.nextEventTime;
      this.currentSlotIndex = 0;
    }

    this.startSchedulerLoop();
  }

  public async togglePlayPause(): Promise<void> {
    if (this.playing) {
      this.pause();
    } else {
      await this.start();
    }
  }

  public pause(): void {
    if (!this.playing) return;

    this.pausedProgress = this.getCurrentProgress();
    this.playing = false;
    this.stopSchedulerLoop();
  }

  public reset(): void {
    this.playing = false;
    this.countingIn = false;
    this.pausedProgress = 0;
    this.currentSlotIndex = 0;
    this.completedMeasuresCount = 0;
    this.stopSchedulerLoop();
  }

  /**
   * Resets measure progress and restarts playback with count-in (if enabled).
   */
  public async restart(): Promise<void> {
    this.reset();
    await this.start();
  }

  public setBpm(newBpm: number): void {
    const clamped = clampBpm(newBpm);
    if (clamped === this.bpm) return;

    const currentProgress = this.getCurrentProgress();
    this.bpm = clamped;

    if (this.playing && !this.countingIn) {
      const now = this.audioHost.getCurrentTime();
      const newMeasureDur = this.getMeasureDuration();
      this.measureStartTime = now - (currentProgress * newMeasureDur);
      this.nextEventTime = now;
    }
  }

  public setCountIn(measures: 0 | 1 | 2 | 3): void {
    this.countInMeasures = measures;
  }

  public setPattern(pattern: StrummingPattern): void {
    const slotsChanged = this.pattern.slots.length !== pattern.slots.length;
    this.pattern = pattern;
    if (slotsChanged) {
      this.reset();
    }
  }

  public setAccentFirstBeat(enabled: boolean): void {
    this.accentFirstBeat = enabled;
  }

  public setMetronomeSubdivision(subdivision: MetronomeSubdivision): void {
    this.metronomeSubdivision = subdivision;
  }

  public playSubdivisionPreview(subdivision: MetronomeSubdivision): void {
    this.audioHost.ensureRunning().then(() => {
      this.synth.playSubdivisionPreview(subdivision);
    }).catch((err) => {
      console.warn("Failed to play subdivision preview:", err);
    });
  }

  public getMetronomeSubdivision(): MetronomeSubdivision {
    return this.metronomeSubdivision;
  }

  public isPlaying(): boolean {
    return this.playing;
  }

  public isCountingIn(): boolean {
    return this.countingIn;
  }

  /**
   * Fast, allocation-free measure progress calculation (0.0 to 1.0).
   * Called by requestAnimationFrame playhead driver at 60/120 FPS.
   */
  public getCurrentProgress(): number {
    if (!this.playing && this.pausedProgress > 0) {
      return this.pausedProgress;
    }
    if (!this.playing || this.countingIn) {
      return 0.0;
    }

    const now = this.audioHost.getCurrentTime();
    const measureDuration = this.getMeasureDuration();
    if (measureDuration <= 0) return 0.0;

    const elapsed = now - this.measureStartTime;
    if (elapsed <= 0) return 0.0;

    const progress = (elapsed % measureDuration) / measureDuration;
    return progress >= 1.0 ? 0.0 : progress;
  }

  public dispose(): void {
    this.reset();
    this.audioHost.close();
  }

  private startSchedulerLoop(): void {
    this.stopSchedulerLoop();
    this.timerId = window.setInterval(() => this.scheduleEvents(), this.scheduleIntervalMs);
  }

  private stopSchedulerLoop(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private scheduleEvents(): void {
    if (!this.playing) return;

    const currentTime = this.audioHost.getCurrentTime();
    const horizon = currentTime + (this.lookaheadMs / 1000.0);

    // If scheduling fell behind (e.g. background tab or frame lag), catch up smoothly
    if (this.nextEventTime < currentTime - 0.05) {
      this.nextEventTime = currentTime + 0.005;
      this.measureStartTime = this.nextEventTime - (this.currentSlotIndex * this.getSlotDuration());
    }

    while (this.nextEventTime < horizon) {
      try {
        if (this.countingIn) {
          this.scheduleCountInTick(this.nextEventTime);
          this.nextEventTime += this.getQuarterBeatDuration();

          this.countInBeatsRemaining--;
          if (this.countInBeatsRemaining <= 0) {
            this.countingIn = false;
            this.measureStartTime = this.nextEventTime;
            this.currentSlotIndex = 0;
            this.onCountInComplete?.();
          }
        } else {
          this.schedulePatternSlot(this.nextEventTime, this.currentSlotIndex);
          const slotDuration = this.getSlotDuration();
          this.nextEventTime += slotDuration;

          this.currentSlotIndex = (this.currentSlotIndex + 1) % this.pattern.slots.length;
          if (this.currentSlotIndex === 0) {
            this.completedMeasuresCount++;
            // Note: DO NOT set this.measureStartTime = this.nextEventTime here.
            // nextEventTime is scheduled ahead of time (lookahead horizon).
            // Setting measureStartTime into the future causes elapsed time to become negative,
            // dropping progress to 0 prematurely while the last slot is still playing.
            // (elapsed % measureDuration) / measureDuration naturally wraps smoothly at 100%.
            this.onMeasureComplete?.(this.completedMeasuresCount);
          }
        }
      } catch (err) {
        console.error("Audio scheduler error:", err);
        this.nextEventTime += 0.05;
      }
    }
  }

  private scheduleCountInTick(time: number): void {
    const beatIndexInMeasure = (this.totalCountInBeats - this.countInBeatsRemaining) % 4;
    const isAccent = this.accentFirstBeat && beatIndexInMeasure === 0;

    this.synth.scheduleTick(time, isAccent);
    this.scheduleSubdivisionsForQuarterBeat(time);
    this.onBeatTick?.(beatIndexInMeasure);
    this.onCountInTick?.(this.countInBeatsRemaining, this.totalCountInBeats);
  }

  private schedulePatternSlot(time: number, slotIndex: number): void {
    const slot = this.pattern.slots[slotIndex];

    // Metronome clicks on quarter beats (beats 1, 2, 3, 4)
    if (slot && slot.isQuarterBeat) {
      const isBeatOne = slot.isMeasureStart;
      const isAccent = isBeatOne && this.accentFirstBeat;
      this.synth.scheduleTick(time, isAccent);
      this.scheduleSubdivisionsForQuarterBeat(time);

      const quarterSlotsPerMeasure = this.pattern.slots.length / 4;
      const beatNumber = Math.floor(slotIndex / quarterSlotsPerMeasure);
      this.onBeatTick?.(beatNumber);
    }

    this.onTick?.(slotIndex, time);
  }

  private scheduleSubdivisionsForQuarterBeat(beatStartTime: number): void {
    if (this.metronomeSubdivision === "quarter") return;

    const quarterDur = this.getQuarterBeatDuration();

    if (this.metronomeSubdivision === "eighth") {
      this.synth.scheduleSubdivisionTick(beatStartTime + 0.5 * quarterDur, 'woodblock', 0.45);
    } else if (this.metronomeSubdivision === "sixteenth") {
      this.synth.scheduleSubdivisionTick(beatStartTime + 0.25 * quarterDur, 'woodblock', 0.45);
      this.synth.scheduleSubdivisionTick(beatStartTime + 0.5 * quarterDur, 'woodblock', 0.45);
      this.synth.scheduleSubdivisionTick(beatStartTime + 0.75 * quarterDur, 'woodblock', 0.45);
    } else if (this.metronomeSubdivision === "triplet") {
      this.synth.scheduleSubdivisionTick(beatStartTime + (1 / 3) * quarterDur, 'woodblock', 0.45);
      this.synth.scheduleSubdivisionTick(beatStartTime + (2 / 3) * quarterDur, 'woodblock', 0.45);
    } else if (this.metronomeSubdivision === "swing") {
      // Swing shuffle: 3rd triplet eighth (2/3 of the beat)
      this.synth.scheduleSubdivisionTick(beatStartTime + (2 / 3) * quarterDur, 'woodblock', 0.45);
    }
  }
}
