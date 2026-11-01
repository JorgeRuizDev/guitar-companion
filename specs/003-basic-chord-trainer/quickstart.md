# Quickstart Validation Guide: Basic Chord Trainer

**Feature Branch**: `003-basic-chord-trainer`  
**Date**: 2026-11-01  
**Status**: Ready for Implementation  

---

## 1. Prerequisites

- Bun runtime installed (`bun --version` $\ge$ 1.1)
- Working directory: `/home/jorge/_STORAGE/guitar-companion`
- Modern web browser (Chrome, Safari, Firefox, Edge)

---

## 2. Validation Scenarios

### Scenario 1: Dual Notation & "Draw the Chord" Flow
1. Open `http://localhost:3000/basic-chord-trainer?mode=draw`.
2. Verify chord prompt displays both Anglo-Saxon and Solfège notations (e.g. `C (Do Mayor)`).
3. Tap fretboard frets:
   - String 2 (B string), Fret 1 (Dot appears).
   - String 4 (D string), Fret 2 (Dot appears).
   - String 5 (A string), Fret 3 (Dot appears).
4. Tap nut toggle on String 6 (low E) to set it to Muted (`X`).
5. Ensure strings 1 (high E) and 3 (G) remain Open (`O`).
6. Tap **Check / Comprobar**.
7. **Expected**:
   - Fretboard highlights green.
   - Hits count increments to 1, Streak increments to 1.
   - Transition to next chord challenge.

### Scenario 2: Error Guidance & Skip Reveal in "Draw" Mode
1. In a "Draw" card (e.g. `Am (La menor)`), tap an incorrect fret or leave strings mismatched.
2. Tap **Check / Comprobar**.
3. **Expected**:
   - Discrepant strings highlight in red.
   - Target dots and finger numbers appear.
   - Misses count increments to 1, streak resets to 0.
   - "Next" button appears to proceed when ready.
4. On the next card, tap **Skip / Saltar**.
5. **Expected**:
   - Card is marked as skipped (streak resets to 0).
   - Correct diagram with finger positions and string states is revealed immediately.
   - "Next" button appears to advance.

### Scenario 3: "Identify the Chord" Flow
1. Open `http://localhost:3000/basic-chord-trainer?mode=identify`.
2. Observe diagram displaying a chord (e.g. `Em` with dots on fret 2 of strings 4 and 5).
3. 4 multiple-choice buttons are displayed below, all showing dual notation (e.g., `Em (Mi menor)`, `Am (La menor)`, `E (Mi Mayor)`, `C (Do Mayor)`).
4. Tap the correct option.
5. **Expected**:
   - Button highlights green.
   - Hits count increments to 1, streak increments to 1.
   - Advances cleanly to next card.

### Scenario 4: Alternating Flow (Default)
1. Open `http://localhost:3000/basic-chord-trainer` (without mode parameter).
2. Answer Card 1 (Draw mode).
3. Advance to Card 2.
4. **Expected**: Card 2 is an Identify mode challenge.
5. Answer Card 2 and advance to Card 3.
6. **Expected**: Card 3 is a Draw mode challenge.

### Scenario 5: Open Chords Catalog & Embed Link Generator
1. Open `http://localhost:3000/basic-chord-trainer`.
2. Scroll to the Catalog section.
3. Verify all 22 beginner open chords are displayed with dual names and diagrams.
4. Click preset "Fundamental Trio (G-C-D)".
5. Select "Draw Only" mode in generator options.
6. Click "Generate Link".
7. Click "Copy Link".
8. **Expected**:
   - Generated URL contains `?chords=G,C,D&mode=draw&embed=true`.
   - Clipboard receives the URL and button provides copy confirmation toast/badge.
9. Click "Start Practice".
10. **Expected**: The trainer session immediately runs using only chords G, C, and D.

### Scenario 6: Ultra-Compact Embed Webview Mode
1. Open `http://localhost:3000/basic-chord-trainer/embed?chords=C,G,Am,Fmaj7`.
2. Verify:
   - Header, navigation bottom bar, and platform footer are completely hidden.
   - Viewport height $\le 480$px requires no vertical page scroll.
   - Browser console logs `CHORD_TRAINER_ANSWER` and `CHORD_TRAINER_PROGRESS` events upon user actions.

---

## 3. Automated Test Verification

Run the test suite including newly created tests for chord theory, query parsing, fretboard logic, and session state:

```bash
bun test --preload ./tests/setup.ts
```

**Expected Outcome**: 100% test pass rate with 0 errors.

---

## 4. Production Docker Container Verification

As mandated by project rules:

```bash
bun run docker:reload
curl -f http://192.168.1.202:3100/api/health
```

**Expected Outcome**: Image rebuilds cleanly, container starts, and health endpoint returns HTTP 200.
