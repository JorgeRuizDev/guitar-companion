# Interface Contract: Host Application postMessage API

**Feature Branch**: `002-basic-note-trainer`  
**Protocol Version**: 1.0.0  
**Transport**: `window.parent.postMessage(message, targetOrigin)`  

---

## 1. Overview

When the **Basic Note Trainer** is loaded inside an `iframe` or native Web-View with `embed=true`, it automatically dispatches structured events to `window.parent`. Host applications can listen to these events to track learner progress, synchronize rewards, or control external navigation.

---

## 2. Event Types & Payloads

### Event: `NOTE_TRAINER_ANSWER`
Dispatched whenever the user taps an option on an active card.

```typescript
interface NoteTrainerAnswerEvent {
  source: 'guitar-companion-note-trainer';
  event: 'NOTE_TRAINER_ANSWER';
  payload: {
    cardId: string;
    isCorrect: boolean;
    isFirstAttempt: boolean;
    selectedOption: string;
    correctAnswer: string;
    noteReference: string;
    sessionStats: {
      okeys: number;
      failures: number;
      currentStreak: number;
      bestStreak: number;
      accuracy: number;
    };
  };
}
```

### Event: `NOTE_TRAINER_PROGRESS`
Dispatched when a card is fully completed (either directly or after error recovery) before moving to the next card.

```typescript
interface NoteTrainerProgressEvent {
  source: 'guitar-companion-note-trainer';
  event: 'NOTE_TRAINER_PROGRESS';
  payload: {
    totalSolved: number;
    okeys: number;
    failures: number;
    currentStreak: number;
    bestStreak: number;
    accuracy: number;
  };
}
```

---

## 3. Host Integration Example (JavaScript)

```javascript
window.addEventListener('message', (event) => {
  // Validate source
  if (event.data?.source !== 'guitar-companion-note-trainer') return;

  if (event.data.event === 'NOTE_TRAINER_ANSWER') {
    const { isCorrect, sessionStats } = event.data.payload;
    console.log(`User answered: ${isCorrect ? 'Correct' : 'Incorrect'}`);
    console.log(`Okeys: ${sessionStats.okeys}, Failures: ${sessionStats.failures}`);
  }

  if (event.data.event === 'NOTE_TRAINER_PROGRESS') {
    console.log(`Current accuracy: ${event.data.payload.accuracy}%`);
  }
});
```
