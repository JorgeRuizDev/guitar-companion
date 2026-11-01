# Interface Contract: URL Query Parameters

**Feature Branch**: `003-basic-chord-trainer`  
**Endpoint**: `/basic-chord-trainer` & `/basic-chord-trainer/embed`  
**Version**: 1.0.0  

---

## 1. Parameters Specification

| Parameter | Type | Allowed Values | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `chords` | `string` | Comma-separated list of chord symbols (case-insensitive), e.g. `C,Am,G7,Fmaj7,Cadd9` | All catalog chords | Filters the chord pool for training. Invalid or unrecognized chord symbols are silently ignored; if no valid chords remain, all catalog chords are used. |
| `mode` | `string` | `alternate`, `draw`, `identify` | `alternate` | Determines challenge direction: alternating between draw and identify, draw-only, or identify-only. |
| `embed` | `boolean` | `true`, `false`, `1`, `0` | `false` | When true (or when accessed via `/basic-chord-trainer/embed`), suppresses platform header, bottom navigation bar, and footer chrome for mobile webviews or iframe embedding. |
| `compact` | `boolean` | `true`, `false`, `1`, `0` | Same as `embed` | Forces an ultra-compact viewport layout ($\le 480$px height) with minimal padding. Defaults to `true` when `embed=true`. |
| `lang` | `string` | `en`, `es` | `en` | Sets interface language and Solfège formatting. Default English canonically. |

---

## 2. Examples

### Standard Practice (Default: All Chords, Alternating Mode)
```text
https://guitarcompanion.app/basic-chord-trainer
```

### Targeted 4-Chord Pop Lesson in Spanish
```text
https://guitarcompanion.app/basic-chord-trainer?chords=G,C,D,Em&mode=alternate&lang=es
```

### Dedicated "Draw-Only" Embed for Native WebView
```text
https://guitarcompanion.app/basic-chord-trainer/embed?chords=C,Am,Fmaj7,G7&mode=draw
```

---

## 3. Parsing & Normalization Logic

```typescript
export function parseChordTrainerParams(searchParams: URLSearchParams | Record<string, string | string[] | undefined>): TrainerConfig {
  const getParam = (key: string): string | null => {
    if (!searchParams) return null;
    if (searchParams instanceof URLSearchParams) return searchParams.get(key);
    const val = searchParams[key];
    return Array.isArray(val) ? val[0] ?? null : val ?? null;
  };

  const chordsParam = getParam('chords');
  const modeParam = getParam('mode');
  const embedParam = getParam('embed');
  const compactParam = getParam('compact');
  const langParam = getParam('lang') || getParam('locale');

  const mode: PracticeMode =
    modeParam === 'draw' || modeParam === 'identify' || modeParam === 'alternate'
      ? modeParam
      : 'alternate';

  const embed = embedParam === 'true' || embedParam === '1';

  const compact =
    compactParam === 'true' || compactParam === '1'
      ? true
      : compactParam === 'false' || compactParam === '0'
      ? false
      : embed;

  const chords = chordsParam
    ? chordsParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

  const lang: 'en' | 'es' | undefined =
    langParam === 'es' ? 'es' : langParam === 'en' ? 'en' : undefined;

  return { chords, mode, embed, compact, lang };
}
```
