# Quickstart Validation Guide: Basic Note Trainer

**Feature Branch**: `002-basic-note-trainer`  
**Date**: 2026-11-01  
**Status**: Ready for Implementation  

---

## 1. Prerequisites

- Bun runtime installed (`bun --version` $\ge$ 1.1)
- Project repository root: `/home/jorge/_STORAGE/guitar-companion`
- Modern web browser or headless browser for verification

---

## 2. Validation Scenarios

### Scenario 1: Note Translation Flow & In-Place Retry
1. Navigate to `http://localhost:3000/basic-note-trainer?mode=translation&direction=letters-to-solfege`.
2. Verify card shows a prompt (e.g., *"What European note corresponds to 'A'?"*) with 4 distinct Solfège buttons.
3. Intentionally click an incorrect option (e.g., *"Do"*).
4. **Expected**:
   - Total Failures count increments from 0 to 1.
   - Current streak resets to 0.
   - The selected "Do" button turns red and is disabled.
   - A quick hint appears.
   - The remaining 3 buttons remain clickable.
5. Click the correct option (*"La"*).
6. **Expected**:
   - The "La" button turns green.
   - The card reveals the complete pedagogical explanation and mnemonic trick.
   - A "Next Card" button appears.
   - Total Okeys increments to 1.
7. Click "Next Card" (or press `Enter`).
8. **Expected**:
   - Smooth transition to a fresh card with all 4 buttons active.

---

### Scenario 2: Chromatic Sequence & Natural Semitones (B-C / E-F)
1. Navigate to `http://localhost:3000/basic-note-trainer?mode=accidentals`.
2. Look for questions testing natural semitones (e.g., *"Which natural notes have NO sharp or flat between them?"* or *"Does E have a sharp in the natural diatonic scale?"*).
3. Select the correct answer on the first try.
4. **Expected**:
   - Immediate hit: button turns green, Okeys increments, current streak increments to 1.
   - Auto-advances cleanly to the next card after ~400ms without requiring an extra click.

---

### Scenario 3: Embedded Web-View Mode
1. Navigate to `http://localhost:3000/basic-note-trainer?embed=true`.
2. Inspect the rendered DOM and viewport.
3. **Expected**:
   - Site global navigation bar and footer are absent.
   - The card and live stats header ("Okeys vs Failures") occupy the full viewport cleanly.
   - Viewport resized to 320px width shows zero horizontal scrolling and touch targets $\ge 44\times 44$px.
   - Opening browser dev console shows dispatches for `NOTE_TRAINER_ANSWER` when options are tapped.

---

## 3. Automated Test Verification

Run the unit test suite covering music theory logic, card generators, state machine, and query param parsing:

```bash
bun test tests/apps/basic-note-trainer
```

**Expected Outcome**: All domain tests pass with 0 errors.

---

## 4. Production Container Verification

Rebuild and reload the production Docker container as required by project rules:

```bash
bun run docker:reload
curl -f http://192.168.1.202:3100/api/health
```

**Expected Outcome**: Healthy status HTTP 200 response.
