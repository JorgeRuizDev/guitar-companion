# Interface Contract: URL Query Parameters

**Feature Branch**: `002-basic-note-trainer`  
**Endpoint**: `/basic-note-trainer`  
**Version**: 1.0.0  

---

## 1. Parameters Specification

| Parameter | Type | Allowed Values | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `mode` | `string` | `translation`, `accidentals`, `mixed` | `mixed` | Determines the type of flashcard exercises presented. |
| `direction` | `string` | `letters-to-solfege`, `solfege-to-letters`, `both` | `both` | Filters translation card direction (only applicable when `mode` is `translation` or `mixed`). |
| `difficulty` | `string` | `beginner`, `intermediate`, `advanced` | `beginner` | Filters card difficulty pool (natural notes, single accidentals, or enharmonics/reverse). |
| `embed` | `boolean` | `true`, `false`, `1`, `0` | `false` | When true, renders a minimal, distraction-free view suppressing site header and footer for webview/iframe embedding. |

---

## 2. Examples

### Minimal Web-View Embed for Note Translation (Beginner)
```text
https://guitar-companion.domain/basic-note-trainer?mode=translation&direction=letters-to-solfege&difficulty=beginner&embed=true
```

### Accidentals & Semitones Focus in Standalone View
```text
https://guitar-companion.domain/basic-note-trainer?mode=accidentals&difficulty=intermediate
```

---

## 3. Parsing & Fallback Behavior

```typescript
export function parseTrainerParams(searchParams: URLSearchParams): TrainerConfig {
  const modeParam = searchParams.get('mode');
  const dirParam = searchParams.get('direction');
  const diffParam = searchParams.get('difficulty');
  const embedParam = searchParams.get('embed');

  const mode = (modeParam === 'translation' || modeParam === 'accidentals' || modeParam === 'mixed')
    ? modeParam
    : 'mixed';

  const direction = (dirParam === 'letters-to-solfege' || dirParam === 'solfege-to-letters' || dirParam === 'both')
    ? dirParam
    : 'both';

  const difficulty = (diffParam === 'beginner' || diffParam === 'intermediate' || diffParam === 'advanced')
    ? diffParam
    : 'beginner';

  const embed = embedParam === 'true' || embedParam === '1';

  return { mode, direction, difficulty, embed };
}
```

- Any missing or unparseable query parameter gracefully falls back to its default without throwing errors or breaking navigation.
