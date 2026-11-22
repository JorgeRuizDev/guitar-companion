# Research & Technical Decisions: Chord Notes Drag-and-Drop & Musical Intervals

## Technical Decisions

### Decision 1: Mobile-First Pointer & Tap-to-Place Interaction for Chord Notes
- **What was chosen**: Custom lightweight React interaction supporting both direct Pointer Events drag-and-drop and an accessible tap-to-place fallback (tap note ball in upper bank, tap finger dot or open nut marker on the fretboard).
- **Rationale**:
  - Adheres strictly to **Principle III (Mobile-First)** and **Principle V (Simplicity & Bundle Minimalism)** of the Constitution.
  - Eliminates the need for external heavy drag libraries (`dnd-kit`, `react-dnd`), avoiding bundle bloat.
  - Solves the classic mobile touch problem where dragging on mobile viewports can trigger window vertical scroll.
  - Note bank container is placed strictly in the upper region above the SVG fretboard diagram (`flex flex-wrap justify-center gap-2 mb-3`), ensuring zero overflow clipping down to 320px screen width.
- **Alternatives considered**:
  - `dnd-kit`: Powerful but introduces ~30kB of dependencies and complex context wrappers.
  - Native HTML5 Drag and Drop alone: Poor touch device support on iOS/Android WebViews without polyfills.

---

### Decision 2: Pure Domain Harmonic Analysis & Voicing Engine
- **What was chosen**: A standalone, pure domain module `src/apps/basic-chord-trainer/domain/harmonicAnalysis.ts`.
- **Capabilities**:
  1. `getChordHarmonicAnalysis(chord: ChordDefinition)`: Given standard tuning strings `[E2, A2, D3, G3, B3, E4]` and chord frets, computes:
     - Sounding pitch for each active string (pitch class index 0-11, Anglo-Saxon letter, and Solfège syllable).
     - Harmonic interval function relative to root (`Root / Tónica`, `Major 3rd / 3ª Mayor`, `Minor 3rd / 3ª menor`, `Perfect 5th / 5ª Justa`, `Dominant 7th / 7ª menor`, etc.).
     - Unique pitch classes in the chord.
     - Dynamic selection of exactly 2 non-chord distractor notes from the remaining chromatic pitches.
  2. Future-proof compatibility with barre chords (`chord.barre` frets evaluate identical string sounding pitches).
- **Rationale**: Keeps musical computation completely decoupled from UI rendering (pure, easily unit-tested).

---

### Decision 3: Root Indicator Suppression in `DrawChallenge`
- **What was chosen**: Add `showRootIndicator?: boolean` prop to `FretboardDiagram`. In `DrawChallenge.tsx`, conditionally pass `showRootIndicator={!isPending}` (i.e. only true when evaluated or hint requested).
- **Rationale**: Directly resolves the user request without altering the existing catalog or study diagrams where the root indicator remains valuable.

---

### Decision 4: Dual-Notation Interval Theory Engine ("Intervalos")
- **What was chosen**:
  - Core interval taxonomy defined in `src/apps/basic-note-trainer/domain/musicTheory.ts` with interval degrees (1 to 8), semitone distances (0 to 12), and localized names in English and Spanish.
  - Dual notation generation:
    - In `Basic Note Trainer`: New mode `mode=intervals` in `types.ts`, `queryParams.ts`, and `cardGenerator.ts`.
    - In `Interactive Quiz Framework`: New quiz pack in `src/content/quizzes/topics/intervals/01-musical-intervals.yml` registered in `manifest.json`.
  - Full adherence to **Principle VIII (Notación Musical Dual y Fundamentos Teóricos)** ratified in Constitution v1.4.0.
- **Alternatives considered**:
  - Implementing intervals only in Note Trainer: Rejected because user requested both quick flashcards and structured quiz integration.
