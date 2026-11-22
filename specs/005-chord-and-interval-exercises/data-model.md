# Data Model: Chord Notes Drag-and-Drop & Musical Intervals

## 1. Chord Notes & Harmonic Analysis Entities

### `StringHarmonicInfo`
Represents the exact musical pitch and harmonic role for a single string of a chord voicing.

| Field | Type | Description |
|---|---|---|
| `stringNumber` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | String index (6 = Low E, 1 = High E) |
| `state` | `'open' \| 'fretted' \| 'muted'` | Vibrational state in this chord |
| `fret` | `number \| null` | 0 for open, 1-4 for fretted, null for muted |
| `finger` | `FingerNumber \| null` | Finger number assigned (1=Index, 2=Middle, 3=Ring, 4=Pinky) |
| `pitchClass` | `number` | Chromatic pitch index (0=C, 1=C#, ..., 11=B) |
| `noteLetter` | `string` | Anglo-Saxon letter (e.g., "C", "E", "G") |
| `solfegeName` | `string` | Latin Solfège name (e.g., "Do", "Mi", "Sol") |
| `semitonesFromRoot` | `number` | Interval distance in semitones modulo 12 |
| `intervalRole` | `string` | English harmonic function (e.g., "Root", "Major 3rd", "Perfect 5th") |
| `intervalRoleEs` | `string` | Spanish harmonic function (e.g., "Tónica", "3ª Mayor", "5ª Justa") |
| `intervalAbbr` | `string` | Standard abbreviation (e.g., "R", "3M", "3m", "5J", "7m") |

---

### `ChordHarmonicAnalysis`
Complete harmonic breakdown for an open or barre chord voicing.

| Field | Type | Description |
|---|---|---|
| `chord` | `ChordDefinition` | Target chord definition |
| `stringAnalysis` | `StringHarmonicInfo[]` | Analysis for all 6 strings |
| `uniqueNotes` | `string[]` | Set of distinct pitch class letters in the chord |
| `uniqueSolfege` | `string[]` | Set of distinct pitch class Solfège names in the chord |
| `distractorNotes` | `[string, string]` | Exactly 2 non-chord pitch letters for the token pool |
| `distractorSolfege` | `[string, string]` | Exactly 2 non-chord Solfège syllables |

---

### `ChordNotesToken`
Represents a draggable/tappable visual ball in the upper bank.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique token identifier |
| `symbol` | `string` | Note symbol displayed (Letter or Solfège) |
| `isDistractor` | `boolean` | True if this note does NOT belong to the chord |
| `isSelected` | `boolean` | True if selected in tap-to-place mobile mode |

---

### `ChordNotesUserState`
User progress on the active chord diagram.

| Field | Type | Description |
|---|---|---|
| `assignments` | `Record<StringNumber, string \| null>` | Map of stringNumber to assigned note symbol |
| `isSubmitted` | `boolean` | True when the user clicks 'Comprobar' / submits configuration |
| `isComplete` | `boolean` | True when all sounding strings are correctly assigned and verified |
| `isCorrect` | `boolean` | True when the submitted configuration matches 100% of sounding notes |
| `revealedHarmonics` | `boolean` | True after successful evaluation, revealing harmonic tags (R, 3M, 5J) |
| `errorStrings` | `StringNumber[]` | Array of string numbers where assigned notes were incorrect upon submission |

---

## 2. Musical Intervals Entities

### `IntervalDefinition`
Canonical representation of a diatonic/chromatic interval.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique ID (e.g., "major-3rd", "perfect-5th") |
| `semitones` | `number` | Distance in semitones (0 to 12) |
| `degree` | `number` | Diatonic degree number (1 to 8) |
| `shortName` | `string` | Formula symbol (e.g., "R", "m2", "M2", "m3", "M3", "P4", "TT", "P5", "m6", "M6", "m7", "M7", "P8") |
| `nameEn` | `string` | Localized name in English (e.g., "Major 3rd", "Perfect 5th") |
| `nameEs` | `string` | Localized name in Spanish (e.g., "3ª Mayor", "5ª Justa") |

---

### `IntervalQuestion`
Flashcard and quiz data contract for interval training.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique question identifier |
| `type` | `'calculate-note' \| 'identify-interval'` | Question category |
| `notation` | `'letters' \| 'solfege'` | Active notation format |
| `rootNote` | `string` | Base root note (e.g. "C" or "Do") |
| `interval` | `IntervalDefinition` | Target interval |
| `prompt` | `{ en: string; es: string }` | Localized question prompt |
| `options` | `[string, string, string, string]` | 4 localized multiple-choice options |
| `correctAnswer` | `string` | The correct option string |
| `remediation` | `Remediation` | Theoretical explanation and semitone breakdown |
