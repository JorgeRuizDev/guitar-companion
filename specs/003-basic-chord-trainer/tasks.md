# Tasks: Basic Chord Trainer

**Input**: Design documents from `/specs/003-basic-chord-trainer/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`  
**Tests**: Included per Constitution quality criteria requiring comprehensive unit tests for musical domain logic and state transitions.  
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.  

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, directory structure, and platform integration

- [X] T001 Create project directories for domain, components, hooks, storage, and tests under `src/apps/basic-chord-trainer/` and `tests/apps/basic-chord-trainer/`
- [X] T002 [P] Update navigation translations with `chordTrainer` and `chordTrainerShort` ("Chords" / "Acordes") in `src/core/i18n/translations.ts`
- [X] T003 [P] Add desktop navigation link for Chord Trainer in `src/core/ui/PlatformHeader.tsx`
- [X] T004 [P] Add mobile bottom navigation tab item for Chord Trainer with touch target $\ge 44\times 44$px in `src/core/ui/PlatformBottomNav.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core chord domain types, 22-chord beginner catalog, and fretboard evaluator required by all user stories

**⚠️ CRITICAL**: Must complete before user story implementation begins

- [X] T005 Implement domain entity types (`ChordDefinition`, `ChordStringDefinition`, `StringState`, `FingerNumber`, `PracticeChallenge`, `PracticeMode`, `UserFretboardState`, `ChallengeEvaluation`, `SessionMetrics`, `TrainerConfig`) in `src/apps/basic-chord-trainer/types.ts`
- [X] T006 Implement the 22-chord beginner open catalog with dual names (`symbol` and `solfegeName`), exact string states for strings 6 down to 1 (`state: 'open' | 'muted' | 'fretted'`), fingerings (`finger: 1 | 2 | 3 | 4`), and root strings in `src/apps/basic-chord-trainer/domain/chordCatalog.ts`
- [X] T007 Implement fretboard string verification and diff evaluator in `src/apps/basic-chord-trainer/domain/fretboardEvaluator.ts`
- [X] T008 [P] Implement unit tests for catalog integrity (22 chords, dual names, valid strings) and evaluation matching logic in `tests/apps/basic-chord-trainer/chordCatalog.test.ts` and `tests/apps/basic-chord-trainer/fretboardEvaluator.test.ts`

**Checkpoint**: Foundation ready - all 22 chords catalogued, typed, and verifiable.

---

## Phase 3: User Story 1 - Interactive Dual-Notation Chord Training (Priority: P1) 🎯 MVP

**Goal**: Present chord names simultaneously in both Anglo-Saxon letter notation (e.g. C, Am, G7, Fmaj7) and traditional Solfège notation (e.g. Do Mayor, La menor, Sol 7ª, Fa maj7) across all prompts and UI views without omitting either.

**Independent Test**: Load chord formatting utilities and test that every chord produces dual representation (e.g. "C (Do Mayor)") in English and Spanish contexts.

### Tests for User Story 1 ⚠️
- [X] T009 [P] [US1] Create unit tests validating simultaneous dual notation formatting for all catalog chords in `tests/apps/basic-chord-trainer/dualNotation.test.ts`

### Implementation for User Story 1
- [X] T010 [US1] Implement dual-notation helper functions and prompt formatters ensuring `symbol` and `solfegeName` are always displayed together in `src/apps/basic-chord-trainer/domain/dualNotation.ts`

**Checkpoint**: Dual-notation formatting verified across all 22 chords.

---

## Phase 4: User Story 2 - "Draw the Chord" Mode (Name to Fretboard) (Priority: P1)

**Goal**: Display chord prompt in dual notation and allow users to interactively draw finger dots on frets 1–4 across 6 strings, toggle Open (O) / Muted (X) string states above the nut, evaluate via explicit Check button, and reveal solutions via Skip button.

**Independent Test**: Launch "Draw" challenge with chord prompt, tap fret positions and nut toggles, verify Check evaluates hit/miss correctly with visual diff, and verify Skip reveals target diagram.

### Tests for User Story 2 ⚠️
- [X] T011 [P] [US2] Create unit tests for Draw mode user interaction state, nut toggle rules, dot placement/removal, check evaluation, and skip reveal in `tests/apps/basic-chord-trainer/drawMode.test.ts`

### Implementation for User Story 2
- [X] T012 [US2] Implement responsive SVG vector fretboard diagram displaying 6 strings (thickness gradient from low E to high E), frets 1–4, nut bar, and touch hitboxes ($\ge 44\times 44$px) in `src/apps/basic-chord-trainer/components/FretboardDiagram.tsx`
- [X] T013 [US2] Implement interactive nut toggle controls above frets for strings 6–1 between Open (`O`) and Muted (`X`) with dot auto-clearing in `src/apps/basic-chord-trainer/components/NutStringToggle.tsx`
- [X] T014 [US2] Implement "Draw the Chord" challenge container with Check, Skip, and Next action buttons and error diff highlight in `src/apps/basic-chord-trainer/components/DrawChallenge.tsx`

**Checkpoint**: "Draw the Chord" flow is fully functional and interactive independently.

---

## Phase 5: User Story 3 - "Identify the Chord" Mode (Diagram to Name) (Priority: P1)

**Goal**: Render complete chord fingering diagram with finger numbers and nut indicators, presenting 4 multiple-choice buttons in dual notation for rapid identification.

**Independent Test**: Launch "Identify" challenge, view target diagram, select correct option among 4 choices, verify hit/miss visual feedback and streak updating.

### Tests for User Story 3 ⚠️
- [X] T015 [P] [US3] Create unit tests for Identify mode challenge generation (exactly 4 unique options with dual notation) and option selection in `tests/apps/basic-chord-trainer/identifyMode.test.ts`

### Implementation for User Story 3
- [X] T016 [US3] Implement challenge generator for Identify mode selecting target chord and 3 unique randomized distractors in `src/apps/basic-chord-trainer/domain/challengeGenerator.ts`
- [X] T017 [US3] Implement "Identify the Chord" multiple-choice component with 4 dual-notation buttons, green/red feedback, and Next button in `src/apps/basic-chord-trainer/components/IdentifyChallenge.tsx`

**Checkpoint**: "Identify the Chord" mode is fully functional and testable independently.

---

## Phase 6: User Story 4 - Alternating Practice Flow (Priority: P1)

**Goal**: Alternate automatically between Draw and Identify challenges on successive cards by default, while supporting `mode=draw` or `mode=identify` overrides and tracking session metrics (hits, misses, streak, accuracy).

**Independent Test**: Run a session without mode parameter; verify Card 1 is Draw, Card 2 is Identify, Card 3 is Draw, and session metrics calculate accurately.

### Tests for User Story 4 ⚠️
- [X] T018 [P] [US4] Create unit tests for session state machine, alternation sequencing, mode overrides, and metrics tracking (hits, misses, streaks, accuracy) in `tests/apps/basic-chord-trainer/useChordTrainerSession.test.ts`

### Implementation for User Story 4
- [X] T019 [US4] Implement `useChordTrainerSession` hook managing state machine transitions (`PENDING`, `EVALUATED_CORRECT`, `EVALUATED_INCORRECT`, `SKIPPED`), alternation sequencing, and metrics in `src/apps/basic-chord-trainer/hooks/useChordTrainerSession.ts`
- [X] T020 [US4] Implement unified `ChordTrainerApp.tsx` combining metrics bar, challenge container (`DrawChallenge` or `IdentifyChallenge`), and keyboard shortcuts in `src/apps/basic-chord-trainer/components/ChordTrainerApp.tsx`

**Checkpoint**: Complete alternating training engine operational with live metrics.

---

## Phase 7: User Story 5 - Open Chords Catalog & Standalone Embed Link Generator (Priority: P2)

**Goal**: Standalone view with complete 22-chord catalog grouped by category, preset selection buttons, URL embed link generator with one-click copy, and "Start Practice" action.

**Independent Test**: Open catalog view, select preset "Fundamental Trio G-C-D", verify generated URL `?chords=G,C,D&mode=alternate&embed=true`, copy to clipboard, and start practice session with filtered pool.

### Tests for User Story 5 ⚠️
- [X] T021 [P] [US5] Create unit tests for catalog filtering presets ("Select All", "Fundamental Trio G-C-D", "First 3 Chords A-D-E", "Open 7ths") and link generation logic in `tests/apps/basic-chord-trainer/catalogPresets.test.ts`

### Implementation for User Story 5
- [X] T022 [US5] Implement interactive chord catalog grid displaying diagrams, dual names, and selection toggles in `src/apps/basic-chord-trainer/components/ChordCatalogGrid.tsx`
- [X] T023 [US5] Implement embed link generator with mode selector, live query preview, and copy-to-clipboard button with visual confirmation in `src/apps/basic-chord-trainer/components/EmbedLinkGenerator.tsx`
- [X] T024 [US5] Implement Zero-Mock anonymous storage adapter persisting active chord selection and mode in `src/apps/basic-chord-trainer/storage/chordTrainerStorage.ts`
- [X] T025 [US5] Implement full-page container `BasicChordTrainerContainer.tsx` combining hero header, session card, catalog grid, and link generator in `src/apps/basic-chord-trainer/components/BasicChordTrainerContainer.tsx`
- [X] T026 [US5] Implement standalone Next.js App Router route in `src/app/(apps)/basic-chord-trainer/page.tsx` and layout with SEO metadata and JSON-LD in `src/app/(apps)/basic-chord-trainer/layout.tsx`

**Checkpoint**: Standalone catalog and link generator fully operational with persistent selection.

---

## Phase 8: User Story 6 - URL Query Parameter Configuration & Ultra-Compact Embed Webview Mode (Priority: P2)

**Goal**: Configure practice session via query parameters (`chords`, `mode`, `embed`, `lang`), provide dedicated route `/basic-chord-trainer/embed` suppressing all platform chrome and fitting in $\le 480$px height, with `postMessage` bridge.

**Independent Test**: Open `/basic-chord-trainer/embed?chords=C,D,G&mode=draw`, verify navigation bars are hidden, height fits within 480px, and answer submissions dispatch `CHORD_TRAINER_ANSWER` events to `window.parent`.

### Tests for User Story 6 ⚠️
- [X] T027 [P] [US6] Create unit tests for query parameter parsing (`chords`, `mode`, `embed`, `compact`, `lang`), fallback behavior, and postMessage event payload format in `tests/apps/basic-chord-trainer/queryParams.test.ts` and `tests/apps/basic-chord-trainer/postMessageBridge.test.ts`

### Implementation for User Story 6
- [X] T028 [US6] Implement URL query parameter parser and normalizer with graceful fallbacks in `src/apps/basic-chord-trainer/domain/queryParams.ts`
- [X] T029 [US6] Implement `useChordPostMessage` hook dispatching `CHORD_TRAINER_ANSWER` and `CHORD_TRAINER_PROGRESS` events in `src/apps/basic-chord-trainer/hooks/useChordPostMessage.ts`
- [X] T030 [US6] Implement dedicated embed route in `src/app/(apps)/basic-chord-trainer/embed/page.tsx` enforcing compact mode, chrome suppression, and direct app mounting

**Checkpoint**: Embed route and URL parameter configuration fully operational for mobile webviews.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Platform integration, home page card, touch accessibility, test suite verification, and Docker deployment

- [X] T031 [P] Update platform home page (`src/app/page.tsx`) to activate Application 003 card linking to `/basic-chord-trainer`
- [X] T032 [P] Verify touch targets ($\ge 44\times 44$px), responsive layout down to 320px width, and Spanish localization
- [X] T033 Execute full test suite with preload: `bun test --preload ./tests/setup.ts`
- [X] T034 Rebuild production Docker image and verify health endpoint: `bun run docker:reload && curl -f http://192.168.1.202:3100/api/health`

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Setup)**: Can start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 - **BLOCKS all user stories**.
- **Phase 3 (US1 - Dual Notation)**: Depends on Phase 2.
- **Phase 4 (US2 - Draw Mode)**: Depends on Phase 2 & Phase 3.
- **Phase 5 (US3 - Identify Mode)**: Depends on Phase 2 & Phase 3.
- **Phase 6 (US4 - Alternating Flow)**: Depends on Phase 4 & Phase 5.
- **Phase 7 (US5 - Catalog & Generator)**: Depends on Phase 6.
- **Phase 8 (US6 - URL Config & Embed)**: Depends on Phase 6 & Phase 7.
- **Phase 9 (Polish & Docker Reload)**: Depends on all user stories completed.

### Parallel Opportunities
- In Phase 1: T002, T003, T004 can run in parallel.
- In Phase 2: T008 can run alongside implementation.
- US2 (Phase 4) and US3 (Phase 5) can be developed in parallel once Foundational (Phase 2) is complete.
- In Phase 9: T031 and T032 can run in parallel.

---

## Parallel Example: User Stories 2 & 3

```bash
# Parallel tests and components for Draw and Identify modes:
Task: "Implement FretboardDiagram.tsx in src/apps/basic-chord-trainer/components/FretboardDiagram.tsx"
Task: "Implement IdentifyChallenge.tsx in src/apps/basic-chord-trainer/components/IdentifyChallenge.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2)
1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (Blocking)
3. Complete Phase 3: User Story 1 (Dual notation)
4. Complete Phase 4: User Story 2 (Draw the chord)
5. **Validate MVP**: Test drawing open chords with dual notation feedback.

### Incremental Delivery
1. Add Phase 5 (Identify the chord) -> Test visual recognition independently.
2. Add Phase 6 (Alternating flow) -> Test unified session with live metrics.
3. Add Phase 7 (Catalog & Link Generator) -> Test standalone presets and link copying.
4. Add Phase 8 (Ultra-compact embed webview) -> Test in 480px iframe/webview with postMessage.
5. Add Phase 9 (Home integration, full test run, Docker reload & health check).
