/**
 * Domain entity types and runtime validation rules for the Strumming Pattern Trainer.
 * Matches specs/001-strumming-pattern-trainer/data-model.md
 */

export type StrokeDirection = 'down' | 'up' | 'none';

export type SubdivisionUnit = 'eighth' | 'sixteenth';

export type MetronomeSubdivision = 'quarter' | 'eighth' | 'sixteenth' | 'triplet' | 'swing';

export interface BeatSlot {
  /** Zero-based index within the measure (0 to 7 for 8th, 0 to 15 for 16th) */
  index: number;
  /** Display label corresponding to musical count (e.g. '1', '&', 'e', 'a') */
  beatLabel: string;
  /** Strum direction executed at this division ('down' | 'up' | 'none') */
  strokeDirection: StrokeDirection;
  /** True if this slot falls on a primary downbeat (e.g. beat 1, 2, 3, 4) */
  isQuarterBeat: boolean;
  /** True if this slot represents the very first beat of the measure */
  isMeasureStart: boolean;
}

export interface StrummingPattern {
  /** Unique identifier (e.g., 'preset-island-strum' or uuid for custom) */
  id: string;
  /** Human-readable title (minimum 1 character, maximum 50 characters) */
  name: string;
  /** Time signature represented as [beatsPerMeasure, beatValue]. Default [4, 4] */
  timeSignature: [number, number];
  /** Subdivisions per measure ('eighth' | 'sixteenth') */
  subdivision: SubdivisionUnit;
  /** Sequence of rhythmic slots matching the subdivision length (8 or 16) */
  slots: BeatSlot[];
  /** True if built into the beginner preset library; false if user-created */
  isPreset: boolean;
  /** Future authentication link; always null for anonymous guest mode */
  ownerId: string | null;
  /** Timestamp when pattern was created (ISO 8601) */
  createdAt: string;
  /** Timestamp when pattern was last modified (ISO 8601) */
  updatedAt: string;
}

export interface MetronomeConfig {
  /** Tempo in beats per minute, clamped between 40 and 240 */
  bpm: number;
  /** Whether the first beat of each measure is pitch-accented */
  accentFirstBeat: boolean;
  /** Number of introductory count-in measures before loop begins (0, 1, 2, 3) */
  countInMeasures: 0 | 1 | 2 | 3;
  /** Sound profile identifier ('woodblock' | 'click' | 'beep') */
  soundTheme: 'woodblock' | 'click' | 'beep';
  /** Metronome audio subdivision click frequency */
  subdivision: MetronomeSubdivision;
  /** Whether arrows strictly enforce alternating downstrokes on odd slots and upstrokes on even slots */
  strictAlternation: boolean;
}

export type PracticeTimerStatus = 'idle' | 'counting-in' | 'running' | 'paused' | 'completed';

export interface PracticeSessionState {
  /** Target duration configured in seconds (e.g., 300 for 5 min) */
  targetDurationSeconds: number;
  /** Remaining countdown in seconds */
  remainingSeconds: number;
  /** Total elapsed active practice seconds during this session */
  elapsedSeconds: number;
  /** Lifecycle status of the timer */
  status: PracticeTimerStatus;
  /** Active count-in beat remaining (e.g. 4 down to 1) when status is 'counting-in' */
  countInBeatRemaining: number | null;
}

/**
 * Validation helpers
 */
export function clampBpm(bpm: number): number {
  if (isNaN(bpm)) return 80;
  return Math.min(240, Math.max(40, Math.round(bpm)));
}

/**
 * Returns traditional Italian tempo marking corresponding to a given BPM.
 */
export function getTempoMarking(bpm: number): string {
  if (bpm < 60) return "GRAVE - LARGO";
  if (bpm <= 66) return "LARGO - LENTO - ADAGIO";
  if (bpm <= 76) return "ADAGIO";
  if (bpm <= 108) return "ANDANTE";
  if (bpm <= 120) return "MODERATO";
  if (bpm <= 156) return "ALLEGRO";
  if (bpm <= 176) return "VIVACE";
  if (bpm <= 200) return "PRESTO";
  return "PRESTISSIMO";
}

export function validatePattern(pattern: StrummingPattern): boolean {
  if (!pattern || typeof pattern !== 'object') return false;
  if (!pattern.name || pattern.name.length < 1 || pattern.name.length > 50) return false;
  if (pattern.subdivision !== 'eighth' && pattern.subdivision !== 'sixteenth') return false;
  
  const expectedSlots = pattern.subdivision === 'eighth' ? 8 : 16;
  if (!Array.isArray(pattern.slots) || pattern.slots.length !== expectedSlots) return false;

  for (let i = 0; i < pattern.slots.length; i++) {
    const slot = pattern.slots[i];
    if (slot.index !== i) return false;
    if (slot.strokeDirection !== 'down' && slot.strokeDirection !== 'up' && slot.strokeDirection !== 'none') {
      return false;
    }
  }

  return true;
}

/**
 * Returns the default stroke direction for a given slot index under D/U Mode (pendulum hand motion):
 * - Odd positions (1st, 3rd, 5th, etc., i.e. index % 2 === 0) -> 'down' (Downstroke ↓)
 * - Even positions (2nd, 4th, 6th, etc., i.e. index % 2 === 1) -> 'up' (Upstroke ↑)
 * Specifically, in 16th subdivisions: '1' and '&' are Downstrokes, while 'e' and 'a' are Upstrokes.
 */
export function getPositionalStrokeDirection(index: number): StrokeDirection {
  return index % 2 === 0 ? "down" : "up";
}

/**
 * Re-aligns all active strokes in a pattern to their positional D/U directions (odd: down, even: up).
 * Slots with 'none' remain 'none'.
 */
export function alignSlotsToStrictAlternation(slots: BeatSlot[]): BeatSlot[] {
  return slots.map((slot) => {
    if (slot.strokeDirection === "none") return slot;
    return {
      ...slot,
      strokeDirection: getPositionalStrokeDirection(slot.index),
    };
  });
}

