# Research & Design Decisions: Basic Chord Trainer

**Feature Branch**: `003-basic-chord-trainer`  
**Date**: 2026-11-01  
**Status**: Completed  

---

## 1. Technical Context & Scope Analysis

The Basic Chord Trainer is an interactive educational tool for guitar beginners to learn and master open chords through dual notation (Anglo-Saxon letter symbols + European Solfège) and two complementary practice directions:
1. **Draw the Chord** (Name to Fretboard): Tapping frets and setting open/muted strings on an interactive fretboard.
2. **Identify the Chord** (Fretboard to Name): Recognizing the chord shape and picking the correct dual-notation name from multiple choices.
3. **Alternating Flow**: Automatically alternating between both modes by default.
4. **Standalone Catalog & Embed Link Generator**: Browsing all open chords, filtering subsets, and generating configured URLs for mobile webview embeds.
5. **Ultra-Compact Embed Webview Mode**: Distraction-free, fitting within $\le 480$px height without vertical scrolling.

---

## 2. Key Architectural Decisions

### Decision 1: Interactive Fretboard Rendering Technology
- **Decision**: Native SVG-based component with responsive coordinate system and touch-friendly target areas.
- **Rationale**:
  - Vector scaling provides crisp rendering across all screen densities (Retina, mobile displays, desktop).
  - SVG allows exact placement of strings (variable thicknesses from low E to high E), frets, nut, fret markers, finger position dots with finger numbers, and nut state badges ('O' / 'X').
  - Enables effortless scaling to compact mode (height $\le 480$px) without clipping or layout shifts.
  - Native touch and click event listeners map directly to string index and fret number without coordinate translation headaches.
- **Alternatives Considered**:
  - *HTML5 Canvas*: Harder to make accessible, blurry on high-DPI screens without devicePixelRatio compensation, and requires complex manual hit-test math.
  - *Div/CSS Grid*: Hard to render diagonal barres, string lines with custom stroke widths, and rounded nut decorations with guitar diagram styling.

### Decision 2: Beginner Open Chord Catalog & Data Representation
- **Decision**: Hardcoded, strictly-typed domain catalog containing 22 beginner open chords with zero external dependencies.
  - Catalog subsets:
    - **Open Majors** (5): C, D, E, G, A
    - **Open Minors** (3): Am, Dm, Em
    - **Open Dominant 7ths** (6): C7, D7, E7, G7, A7, B7
    - **Beginner F & Fmaj7** (2): F beginner (XX3211 or XX3210), Fmaj7 (XX3210)
    - **Beginner Extensions & Sus Chords** (6): Cadd9 (X32033), Dsus2 (XX0230), Dsus4 (XX0233), Asus2 (X02200), Asus4 (X02230), Esus4 (022200)
- **Rationale**:
  - Guarantees 0 KB external bundle overhead (Constitution Principle V).
  - Each chord has authoritative fingering, string status (`open`, `muted`, `fretted`), recommended finger numbers (1=Index, 2=Middle, 3=Ring, 4=Pinky), root bass string, and dual notation strings in both English and Spanish (e.g. `C` / `Do Mayor`, `Am` / `La menor`, `G7` / `Sol 7ª`).
- **Alternatives Considered**:
  - *Third-party chord libraries (e.g., tonal, chord-fingering)*: Expose bloated bundles, lack beginner-adapted open shapes (like 4-string open F), and do not provide clean dual notation in English and Spanish.

### Decision 3: Fretboard Interaction & Mutation Rules
- **Decision**: Distinct, unambiguous interaction model adhering to Clarification Q2:
  - Fretboard displays frets 1 to 4 with a Nut bar at the top.
  - Above the nut, 6 toggle buttons correspond to strings 6 through 1. Tapping toggles between **Open (O)** and **Muted (X)**.
  - Tapping a fret (1–4) on string $s$:
    - If string $s$ already has a dot at fret $f$, it removes the dot (reverting to 'open').
    - If string $s$ has a dot at another fret, it moves the dot to fret $f$.
    - Setting a dot automatically clears any **Muted (X)** state on that string and marks it fretted.
  - If the user taps the nut toggle to mark string $s$ as **Muted (X)**, any dot on string $s$ is automatically removed.
  - Verification: Triggered by an explicit **Check / Comprobar** button (Clarification Q3).
  - Error Guidance: Instant visual diff (green for correct strings/frets, red for discrepancies) and display of target finger numbers.
  - **Skip Option**: A dedicated **Skip / Saltar** button immediately reveals the target solution, marks the card as skipped, and presents a "Next" button.
- **Rationale**:
  - Prevents contradictory states (a string cannot be simultaneously fretted and muted).
  - Eradicates accidental submissions during multi-finger placement.
  - The skip option prevents learners from getting stuck on unknown chords.

### Decision 4: Dual Navigation Architecture Integration
- **Decision**:
  - Add `/basic-chord-trainer` and `/basic-chord-trainer/embed` routes.
  - Update `PlatformHeader.tsx` to include Desktop link `Chord Trainer` / `Entrenador de Acordes`.
  - Update `PlatformBottomNav.tsx` with a 4th tab (Home, Strumming, Notes, Chords) with localized short label `Chords` / `Acordes` and touch targets $\ge 44\times 44$px.
  - In `embed` mode (via route `/basic-chord-trainer/embed` or parameter `?embed=true`), suppress header, bottom navigation bar, and footer chrome.
- **Rationale**: Conforms directly to Constitution Principle I (Multi-App Core) and Principle III (Dual Navigation Architecture).

### Decision 5: Embed Integration & PostMessage Protocol
- **Decision**: Support cross-frame messaging with event type `CHORD_TRAINER_ANSWER` and `CHORD_TRAINER_PROGRESS`, matching the standard established in `basic-note-trainer`.
- **Rationale**:
  - Allows parent webviews in iOS/Android apps or external LMS platforms to capture training outcomes, session accuracy, and chord-specific performance.

### Decision 6: Anonymous Storage & Zero-Mock UI
- **Decision**: Implement a typed storage adapter `chordTrainerStorage.ts` persisting anonymous session preferences and stats to `localStorage` under `guitar_companion_chord_trainer_v1`. Schema includes `ownerId: null` for future user migration (Constitution Principle IV).
- **Rationale**: Enables remembering the user's last selected chord subset and practice mode across browser refreshes without requiring simulated user profiles or mock buttons.
