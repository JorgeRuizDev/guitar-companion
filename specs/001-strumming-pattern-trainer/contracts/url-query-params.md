# Interface Contract: URL Query Parameters

**Feature Branch**: `001-strumming-pattern-trainer`  
**Endpoint**: `/strumming`  
**Version**: 1.1.0  

---

## 1. Parameters Specification

| Parameter | Type | Allowed Values | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `bpm` | `number` | Integer `40` to `240` | `80` | Practice tempo in beats per minute. Values outside [40, 240] are clamped to bounds. |
| `subdivision` / `sub` | `string` | `eighth`, `8th`, `sixteenth`, `16th` | Pattern subdivision or `eighth` | Subdivisions per 4/4 measure (8 or 16 beat slots). |
| `preset` | `string` | Preset ID or slug (e.g. `preset-island-strum`, `island-strum`, `basic-8th`, `folk-ballad`, `four-on-floor`, `16th-groove`) | `preset-island-strum` | Built-in beginner preset pattern identifier. |
| `strokes` / `pattern` | `string` | Comma- or dash-delimited stroke sequence, e.g. `d,-,d,u,-,u,d,u` | Preset slots | Configures arbitrary stroke pattern. Symbols: `d` / `down` = Downstroke, `u` / `up` = Upstroke, `-` / `none` / `x` / `_` = Rest. Length determines subdivision (8 -> 8th, 16 -> 16th) if `sub` is omitted. |
| `accent` | `boolean` | `true`, `false`, `1`, `0` | `true` | When true (1), the metronome accents beat 1 of each measure with higher pitch. |
| `countIn` | `number` | `0`, `1`, `2`, `3` | `1` | Introductory metronome countdown measures before looping playback starts. |
| `metroSub` | `string` | `quarter`, `eighth`, `sixteenth`, `triplet`, `swing` | `quarter` | Metronome click division profile. |
| `strict` | `boolean` | `true`, `false`, `1`, `0` | `true` | Enforces pendulum alternating Down/Up motion (odd slots = Down, even slots = Up). |

---

## 2. Examples

### Standard Practice with Island Strum at 90 BPM
```text
https://guitarcompanion.app/strumming?preset=island-strum&bpm=90
```

### Custom 8th-Note Rhythm with Count-In of 2 Measures
```text
https://guitarcompanion.app/strumming?bpm=85&sub=8th&strokes=d,-,d,u,-,u,d,u&countIn=2&accent=1
```

### 16th-Note Funk Groove with Sixteenth Metronome Subdivisions
```text
https://guitarcompanion.app/strumming?bpm=100&sub=16th&strokes=d,-,d,u,-,u,d,u,d,-,d,u,-,u,d,u&metroSub=sixteenth
```

---

## 3. Parsing & Normalization Logic

```typescript
export interface StrummingUrlConfig {
  bpm?: number;
  subdivision?: SubdivisionUnit;
  pattern?: StrummingPattern;
  presetId?: string;
  strokes?: StrokeDirection[];
  accent?: boolean;
  countIn?: 0 | 1 | 2 | 3;
  metroSub?: MetronomeSubdivision;
  strict?: boolean;
}
```
