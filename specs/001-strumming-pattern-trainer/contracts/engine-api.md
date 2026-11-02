# Contract: Audio & Playback Engine Interface

**Feature**: `001-strumming-pattern-trainer`  
**Contract Version**: `1.0.0`  

---

## 1. Purpose
Defines the software contract between the UI presentation components and the headless audio/playback timing engine.

---

## 2. Interface Definition

```typescript
export interface PlaybackEngineOptions {
  bpm: number;
  pattern: StrummingPattern;
  accentFirstBeat: boolean;
  countInMeasures: 0 | 1 | 2 | 3;
  onTick?: (slotIndex: number, audioTime: number) => void;
  onCountInTick?: (beatRemaining: number, totalBeats: number) => void;
  onCountInComplete?: () => void;
  onMeasureComplete?: (measureCount: number) => void;
}

export interface IPlaybackEngine {
  /**
   * Initializes the AudioContext if suspended and begins the count-in or pattern loop.
   */
  start(): Promise<void>;

  /**
   * Toggles between Play/Running and Paused. Bound to SPACE key.
   */
  togglePlayPause(): Promise<void>;

  /**
   * Pauses the audio scheduler and freezes the current timeline position.
   */
  pause(): void;

  /**
   * Stops playback and resets the timeline playhead to the beginning of the measure. Bound to RETURN key.
   */
  reset(): void;

  /**
   * Dynamically updates the tempo without breaking the loop or desynchronizing audio.
   * @param bpm Integer between 40 and 240
   */
  setBpm(bpm: number): void;

  /**
   * Updates count-in duration (0, 1, 2, or 3 measures).
   */
  setCountIn(measures: 0 | 1 | 2 | 3): void;

  /**
   * Updates the active pattern configuration.
   * If subdivision changes, playhead resets gracefully.
   */
  setPattern(pattern: StrummingPattern): void;

  /**
   * Enables or disables pitch accent on beat 1.
   */
  setAccentFirstBeat(enabled: boolean): void;

  /**
   * Returns whether playback is currently active (running or counting-in).
   */
  isPlaying(): boolean;

  /**
   * Returns whether playback is currently executing the introductory count-in.
   */
  isCountingIn(): boolean;

  /**
   * Returns the current measure progress as a normalized float from 0.0 to 1.0.
   * Directly called by requestAnimationFrame for zero-lag playhead translation.
   */
  getCurrentProgress(): number;

  /**
   * Disposes of the AudioContext and cancels scheduled timers.
   */
  dispose(): void;
}
```

---

## 3. Guarantees & Constraints
- `getCurrentProgress()` MUST execute in under `0.1 ms` and NEVER allocate memory on the heap (to prevent garbage collection pauses during visual animation loops).
- Changing BPM via `setBpm()` MUST calculate future event times dynamically without restarting the audio context or interrupting active sounds.
- Measure duration MUST be computed dynamically based on the active meter $\text{timeSignature} = [beatsPerMeasure, beatValue]$: $\text{measureDuration} = \text{beatsPerMeasure} \times \left(\frac{4}{\text{beatValue}}\right) \times \left(\frac{60.0}{\text{BPM}}\right)$, ensuring accurate playback across 4/4, 3/4, 6/8, and arbitrary slot configurations ($N \in [2, 24]$).
- When changing patterns with different slot lengths or meters, `setPattern()` MUST recalculate event schedules and reset the playhead smoothly without audio glitching.
