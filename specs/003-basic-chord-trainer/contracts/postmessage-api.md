# Interface Contract: Host Application postMessage API

**Feature Branch**: `003-basic-chord-trainer`  
**Protocol Version**: 1.0.0  
**Transport**: `window.parent.postMessage(message, targetOrigin)`  

---

## 1. Overview

When the **Basic Chord Trainer** is embedded in native mobile WebViews (iOS WKWebView, Android WebView) or an `iframe` with `embed=true`, it dispatches structured window messages to `window.parent`. Host applications can listen to these events to monitor learner performance, track scores, or integrate gamified rewards.

---

## 2. Event Types & Payloads

### Event: `CHORD_TRAINER_ANSWER`
Dispatched immediately when an answer is evaluated:
- In **Draw Mode**: upon tapping "Check" or "Skip".
- In **Identify Mode**: upon tapping any multiple-choice chord button.

```typescript
interface ChordTrainerAnswerEvent {
  source: 'guitar-companion-chord-trainer';
  event: 'CHORD_TRAINER_ANSWER';
  payload: {
    challengeId: string;
    mode: 'draw' | 'identify';
    chordSymbol: string;
    chordSolfege: string;
    isCorrect: boolean;
    isSkipped: boolean;
    sessionMetrics: {
      hits: number;
      misses: number;
      skipped: number;
      currentStreak: number;
      bestStreak: number;
      accuracy: number;
    };
  };
}
```

### Event: `CHORD_TRAINER_PROGRESS`
Dispatched whenever the session metrics change or a card is advanced.

```typescript
interface ChordTrainerProgressEvent {
  source: 'guitar-companion-chord-trainer';
  event: 'CHORD_TRAINER_PROGRESS';
  payload: {
    totalCompleted: number;
    hits: number;
    misses: number;
    skipped: number;
    currentStreak: number;
    bestStreak: number;
    accuracy: number;
  };
}
```

---

## 3. Host Integration Example (JavaScript / TypeScript)

```javascript
window.addEventListener('message', (event) => {
  if (event.data?.source !== 'guitar-companion-chord-trainer') return;

  if (event.data.event === 'CHORD_TRAINER_ANSWER') {
    const { chordSymbol, isCorrect, isSkipped, sessionMetrics } = event.data.payload;
    console.log(`Chord: ${chordSymbol} | Correct: ${isCorrect} | Skipped: ${isSkipped}`);
    console.log(`Streak: ${sessionMetrics.currentStreak} | Accuracy: ${sessionMetrics.accuracy}%`);
  }

  if (event.data.event === 'CHORD_TRAINER_PROGRESS') {
    const { hits, misses, accuracy } = event.data.payload;
    console.log(`Progress update: ${hits} hits, ${misses} misses (${accuracy}%)`);
  }
});
```
