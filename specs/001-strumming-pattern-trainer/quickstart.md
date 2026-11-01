# Quickstart & Validation Guide: Strumming Pattern Trainer

**Feature**: `001-strumming-pattern-trainer`  
**Date**: 2026-11-01  
**Status**: Ready for Validation  

---

## 1. Prerequisites & Environment Setup

- **Node.js**: v20.x or higher
- **Package Manager**: `npm` or `pnpm`
- **Browser**: Any modern evergreen browser with Web Audio API support (Chrome, Safari, Firefox, Edge).

---

## 2. Bootstrapping & Launch

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Access the Strumming Trainer
# Open http://localhost:3000/strumming in your browser
```

---

## 3. End-to-End Validation Scenarios

### Scenario 1: SEO & Initial Load Verification
- **Action**: Inspect page source on `http://localhost:3000/strumming` (or use `curl -s http://localhost:3000/strumming | grep "<title>"`).
- **Expected Outcome**:
  - Valid `<title>` containing "Strumming Pattern Trainer | Guitar Companion".
  - Meta tags for description, Open Graph, and canonical URL are present in raw server HTML.
  - Page displays educational introduction, 4/4 measure timeline, and controls.
  - No fake user profile avatars or mock login buttons are visible (Zero-Mock UI).

---

### Scenario 2: Synchronized Playback, Keyboard Controls & Count-In (P1)
- **Action**:
  1. Configure Count-In to **1 measure** (default).
  2. Press `SPACE` on the keyboard (or click Start).
  3. Observe the introductory count-in ("1 - 2 - 3 - 4") with audible clicks.
  4. Observe the playhead line and listen to the metronome audio as it loops continuously.
  5. Press `SPACE` again to pause; press `SPACE` once more to resume.
  6. Press `RETURN` (Enter) to reset the playhead and playback back to beat 1.
  7. Toggle **Accent Beat 1** ON/OFF and adjust the BPM slider dynamically from 80 to 140 BPM without pausing.
- **Expected Outcome**:
  - Count-in sounds and visually marks the 4 preparatory beats before the strumming timeline sweep begins.
  - Cyan playhead line sweeps smoothly (60+ FPS) across all 8 slots and loops back to beat 1 without glitching.
  - `SPACE` reliably toggles Pause and Resume instantly.
  - `RETURN` immediately resets the playhead to beat 1 and stops/resets the loop.
  - Dynamic tempo changes immediately update playback speed without restarting the measure or desynchronizing audio.
  - All configuration elements (BPM, arrows, subdivision, timer) and the animated timeline reside together on the same unified page.

---

### Scenario 3: Graphic Pattern Builder & Presets (P2)
- **Action**:
  1. Open the preset dropdown and select **"Island Strum"**.
  2. Click on slot 4 (an empty slot) to change its direction.
  3. Switch subdivision to **16th notes**.
- **Expected Outcome**:
  - Selecting "Island Strum" immediately populates the blocks with `[D, -, D, U, -, U, D, U]`.
  - Clicking on a slot toggles cleanly through `↓` → `↑` → `Empty`.
  - Switching to 16th notes expands the measure to 16 slots with labels `1, e, &, a, 2, e, ...`.

---

### Scenario 4: Practice Timer & Notification (P3)
- **Action**:
  1. Set the practice timer to **1 minute** (or short test duration).
  2. Click **Start Practice**.
  3. Allow the timer to count down to `00:00`.
- **Expected Outcome**:
  - Timer decrements every second in parallel with playback.
  - Pausing playback pauses the timer; resuming resumes both.
  - Upon reaching `00:00`, a subtle completion chime and visual alert appear, while the rhythm and metronome continue looping without interrupting the guitarist (per FR-016).

---

### Scenario 5: Mobile Viewport & Touch Ergonomics
- **Action**:
  1. Open browser DevTools and switch to Mobile Device Emulation (e.g., iPhone SE at 320px width).
  2. Tap buttons, arrows, and tempo sliders.
- **Expected Outcome**:
  - Layout adapts smoothly without horizontal overflow or clipping.
  - All interactive buttons and slot hitboxes measure at least `44x44px`.
  - When playback is active on a real device, the screen remains awake via Screen Wake Lock.
