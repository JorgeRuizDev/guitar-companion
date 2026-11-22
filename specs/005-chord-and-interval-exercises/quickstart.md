# Quickstart Validation Guide: Chord Notes Drag-and-Drop & Musical Intervals

This guide documents runnable validation scenarios that prove the feature works end-to-end.

## Prerequisites

- Bun runtime installed (`export PATH="/home/jorge/.bun/bin:$PATH"`).
- Docker service running on `http://192.168.1.202:3100`.

## Automated Validation

Run the complete test suite:
```bash
export PATH="/home/jorge/.bun/bin:$PATH"
bun test --preload ./tests/setup.ts
```

Run new unit tests specifically covering:
- Pure harmonic analysis: `tests/unit/basic-chord-trainer/harmonicAnalysis.test.ts`
- Root indicator suppression: `tests/unit/basic-chord-trainer/rootIndicatorSuppression.test.ts`
- Interval engine and dual notation: `tests/unit/basic-note-trainer/intervals.test.ts`
- Quiz intervals pack validation: `tests/unit/core/quiz/intervalQuestions.test.ts`

```bash
export PATH="/home/jorge/.bun/bin:$PATH"
bun test --preload ./tests/setup.ts tests/unit/basic-chord-trainer/harmonicAnalysis.test.ts
bun test --preload ./tests/setup.ts tests/unit/basic-note-trainer/intervals.test.ts
```

---

## Manual Validation Scenarios

### Scenario 1: Chord Notes Identification & Holistic Configuration Challenge
1. Open the Basic Chord Trainer in browser: `http://192.168.1.202:3100/basic-chord-trainer?mode=chord-notes`
2. Verify that the bank of note balls appears in the upper region above the fretboard diagram, containing the chord notes (e.g., C, E, G) plus 2 distractor notes (e.g., D, A).
3. On mobile viewports (e.g. 360px), verify no horizontal or vertical overflow cuts off the balls.
4. Drag or tap any note ball and drop/place it onto a finger dot or open nut marker:
   - The note attaches immediately to that string without premature rejection or instant validation.
   - You can replace notes or tap an assigned note to clear it.
5. Place an incorrect note (or distractor) on one string and correct notes on the others, then click "Comprobar":
   - The system validates the entire configuration at once.
   - The incorrect string is highlighted in red, with an error message guiding the learner ("Si fallas una nota no aprendes del todo").
6. Correct the erroneous note and click "Comprobar" again:
   - The challenge completes with positive feedback.
   - The fretboard reveals harmonic roles (Tónica, 3ª, 5ª) on all positions.
   - "Siguiente Acorde" button advances to the next chord.

### Scenario 2: Root Indicator Spoiler Suppression in `DrawChallenge`
1. Open the Chord Trainer in draw mode: `http://192.168.1.202:3100/basic-chord-trainer?mode=draw`
2. Verify that while the challenge is in progress (pending), NO root indicator badge ("R") is displayed below the fretboard.
3. Submit the fingering or click "Check":
   - The evaluation card appears.
   - The root indicator badge ("R") now appears on the evaluated diagram as part of remediation.

### Scenario 3: Musical Intervals in Note Trainer & Quiz
1. Open Basic Note Trainer with interval mode in English letters:
   `http://192.168.1.202:3100/basic-note-trainer?mode=intervals&direction=letters-to-solfege` or `lang=en`
2. Verify questions test intervals (e.g. "What is the Perfect 5th of C?") using Anglo-Saxon letters (G).
3. Switch to Solfège: `http://192.168.1.202:3100/basic-note-trainer?mode=intervals&lang=es`
4. Verify questions test intervals in Solfège (e.g. "¿Cuál es la 5ª justa de Do?") with Solfège options (Sol).
5. Verify explanation specifies semitone distance (7 semitonos).
