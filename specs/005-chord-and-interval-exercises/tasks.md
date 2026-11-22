# Tasks: Chord Notes Drag-and-Drop & Musical Intervals

**Input**: Design documents from `/specs/005-chord-and-interval-exercises/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`, `constitution.md`
**Tests**: Unit tests included per Constitution Principle VII & VIII and project testing guidelines.
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions and shared interfaces for chord notes and intervals

- [x] T001 Verify runtime environment and test configuration in `tests/setup.ts`
- [x] T002 [P] Extend chord trainer types in `src/apps/basic-chord-trainer/types.ts` adding `'chord-notes'` to `PracticeMode` and `ChallengeType`, and defining `ChordNotesUserState` and `StringHarmonicInfo`
- [x] T003 [P] Extend note trainer types in `src/apps/basic-note-trainer/types.ts` adding `'intervals'` to `TrainerMode` and `QuestionCategory`

---

## Phase 2: Foundational (Core Musical Engines & Utilities)

**Purpose**: Core music theory and harmonic analysis engines required by user stories

- [x] T004 [P] Implement pure harmonic analysis engine in `src/apps/basic-chord-trainer/domain/harmonicAnalysis.ts` to compute string pitches, harmonic roles (Root, 3rd, 5th), unique notes, and select 2 non-chord distractors
- [x] T005 [P] Create unit test suite in `tests/unit/basic-chord-trainer/harmonicAnalysis.test.ts` validating string pitches and distractors for open chords (C, D, E, G, A, Dm, Em, Am) and barre compatibility
- [x] T006 [P] Implement interval taxonomy, semitone distances (0-12), and dual-notation transposition in `src/apps/basic-note-trainer/domain/musicTheory.ts`
- [x] T007 [P] Create unit test suite in `tests/unit/basic-note-trainer/intervals.test.ts` validating interval calculations, diatonic spellings, and semitone formulas

**Checkpoint**: Musical engines verified — user story implementation can begin.

---

## Phase 3: User Story 1 - Interactive Chord Notes Identification & Holistic Configuration (Priority: P1) 🎯 MVP

**Goal**: Present an open chord diagram with a bank of note balls (unique notes + 2 distractors) in the upper area above the diagram (preventing overflow down to 320px). Users place notes immediately across all sounding strings. Holistic validation happens only upon submitting the configuration via "Comprobar". Erroneous strings are highlighted in red for learning and revision ("Si fallas una nota no aprendes del todo"). Full harmonic analysis (Tónica, 3ª, 5ª) is revealed upon correct verification.

**Independent Test**: Navigate to `/basic-chord-trainer?mode=chord-notes`, place notes onto all active strings of an open chord (e.g., C Major: C, E, G), verify notes are placed immediately without premature rejection, submit via "Comprobar", observe red highlight on mistake strings or harmonic roles (Tónica, 3ª, 5ª) on success.

### Implementation for User Story 1

- [x] T008 [P] [US1] Implement `generateChordNotesChallenge` in `src/apps/basic-chord-trainer/domain/challengeGenerator.ts`
- [x] T009 [P] [US1] Support `mode=chord-notes` in `src/apps/basic-chord-trainer/domain/queryParams.ts`
- [x] T010 [US1] Enhance `FretboardDiagram.tsx` to support `harmonicLabels`, `noteLabels`, `errorStrings` highlighting, and interactive note target selection in `src/apps/basic-chord-trainer/components/FretboardDiagram.tsx`
- [x] T011 [US1] Update `ChordNotesChallenge.tsx` to support immediate note placement, deferred configuration submission ("Comprobar"), targeted error feedback on failed strings ("Si fallas una nota no aprendes del todo"), and post-evaluation harmonic breakdown
- [x] T012 [US1] Integrate `chord-notes` challenge routing in `src/apps/basic-chord-trainer/components/ChordTrainerApp.tsx` and add mode toggle in `src/apps/basic-chord-trainer/components/BasicChordTrainerContainer.tsx`
- [x] T013 [US1] Update unit test suite in `tests/unit/basic-chord-trainer/chordNotesChallenge.test.ts` verifying immediate note placement, deferred configuration validation, distractor inclusion, and evaluation states

**Checkpoint**: User Story 1 fully functional and testable independently.

---

## Phase 4: User Story 2 - Removal of Root Note Spoiler in Chord Completion Practice (Priority: P2)

**Goal**: In the interactive chord completion practice (`DrawChallenge`), suppress the root string badge ("R") during the active/pending attempt so it does not act as a hint, and reveal it only upon evaluation/correction or hint reveal.

**Independent Test**: Navigate to `/basic-chord-trainer?mode=draw`, verify that while drawing a chord shape the "R" badge is hidden, and verify that after clicking "Check" the "R" badge appears in the feedback view.

### Implementation for User Story 2

- [x] T014 [US2] Add `showRootIndicator?: boolean` prop to `FretboardDiagram.tsx` (default true) in `src/apps/basic-chord-trainer/components/FretboardDiagram.tsx`
- [x] T015 [US2] Update `DrawChallenge.tsx` in `src/apps/basic-chord-trainer/components/DrawChallenge.tsx` to pass `showRootIndicator={!isPending || showHintPending}`
- [x] T016 [P] [US2] Create unit test suite in `tests/unit/basic-chord-trainer/rootIndicatorSuppression.test.ts` verifying the root badge is hidden during pending attempts and visible in review

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Musical Interval Training with Dual Notation (Priority: P3)

**Goal**: Provide interval identification and calculation practice ("Intervalos") across all diatonic/chromatic intervals (2nds to 7ths and octaves) with strict English letters (A–G) and Solfège (Do–Si) segregation in both Basic Note Trainer (`mode=intervals`) and the Interactive Quiz Framework.

**Independent Test**: Launch `/basic-note-trainer?mode=intervals` in English and Spanish, and run quiz sessions with `topics=intervals`, verifying 100% strict notation segregation, 4-choice options, and semitone distance explanations.

### Implementation for User Story 3

- [x] T017 [P] [US3] Implement `generateIntervalQuestion` in `src/apps/basic-note-trainer/domain/cardGenerator.ts` supporting note calculation ("What is the 5th of C?") and interval identification ("What interval is E from C?") with semitone explanations
- [x] T018 [P] [US3] Support `mode=intervals` in `src/apps/basic-note-trainer/domain/queryParams.ts` and dispatch interval questions in `generateCard`
- [x] T019 [US3] Add 'Intervals' / 'Intervalos' mode toggle and localized UI labels in `src/apps/basic-note-trainer/components/BasicNoteTrainerContainer.tsx`
- [x] T020 [P] [US3] Create dual-notation quiz questions bank in `src/content/quizzes/topics/intervals/01-musical-intervals.yml` paired by family IDs for letters and solfege
- [x] T021 [US3] Register `intervals` topic pack in `src/content/quizzes/manifest.json`
- [x] T022 [P] [US3] Create unit test suite in `tests/unit/core/quiz/intervalQuestions.test.ts` verifying quiz pack schema, notation segregation, and family mutual exclusion

**Checkpoint**: All three user stories functional and independently testable.

---

## Phase 6: Polish, Integration & Docker Verification

**Purpose**: Cross-cutting validation, regressions, and container deployment compliance

- [x] T023 Run full automated test suite `bun test --preload ./tests/setup.ts` ensuring all unit and regression tests pass
- [x] T024 Validate manual scenarios from `specs/005-chord-and-interval-exercises/quickstart.md` across mobile (320px) and desktop viewports
- [x] T025 Rebuild and reload production Docker container (`bun run docker:reload`) and verify health endpoint `curl -f http://192.168.1.202:3100/api/health`

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1; blocks User Stories 1 & 3.
- **User Story 1 (P1)**: Depends on Phase 2; deliverable as standalone MVP.
- **User Story 2 (P2)**: Independent UI fix on `FretboardDiagram` & `DrawChallenge`; can run alongside or after US1.
- **User Story 3 (P3)**: Depends on Phase 2; extends Note Trainer and Quiz Packs.
- **Polish (Phase 6)**: Runs after all stories are completed.

### Parallel Opportunities
- T002 & T003 (Types) can run in parallel.
- T004 & T006 (Music engines) can run in parallel.
- T005 & T007 (Engine tests) can run in parallel.
- US1 (Chord Notes) and US2 (Root Spoiler Fix) can proceed in parallel once FretboardDiagram is ready.
- T020 (Quiz YAML) and T017 (Flashcard generator) can run in parallel.

---

## Implementation Strategy: MVP First

1. **Step 1**: Complete Phase 1 & 2 (Types & Music Engines).
2. **Step 2**: Implement User Story 1 (Chord Notes Challenge) -> **MVP Ready**.
3. **Step 3**: Implement User Story 2 (Root Spoiler Fix) -> Chord Trainer complete.
4. **Step 4**: Implement User Story 3 (Intervals) -> Note Trainer & Quizzes complete.
5. **Step 5**: Run full test suite, reload Docker, and verify health check.
