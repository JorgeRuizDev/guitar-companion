# Tasks: Basic Note Trainer

**Input**: Design documents from `/specs/002-basic-note-trainer/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/)  
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.  

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create domain application directory structure at `src/apps/basic-note-trainer/` (`domain/`, `components/`, `hooks/`, `storage/`) and test directory `tests/apps/basic-note-trainer/`
- [x] T002 [P] Create TypeScript domain types and entities in `src/apps/basic-note-trainer/types.ts` (`NaturalLetter`, `SolfegeNote`, `AccidentalSymbol`, `ChromaticNoteInfo`, `QuestionCategory`, `DifficultyLevel`, `TrainerMode`, `TranslationDirection`, `FlashcardQuestion`, `ActiveCardState`, `SessionStats`, `StoredUserStats`, `TrainerConfig`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Implement pure music theory mapping engine in `src/apps/basic-note-trainer/domain/musicTheory.ts` with canonical 1-to-1 mappings between English letters (A-G) and Solfège (La-Si-Do-Re-Mi-Fa-Sol), 12 chromatic semitones, natural semitones (`B-C` and `E-F`), and natural whole tones
- [x] T004 [P] Implement pedagogical mnemonics and explanations library in `src/apps/basic-note-trainer/domain/mnemonics.ts` covering note associations (A=440Hz, C=Do-Re-Mi), accidental rules, and semitones (*"Big Cats Eat Fish / Si-Do y Mi-Fa"*)
- [x] T005 [P] Implement persistent guest storage adapter in `src/apps/basic-note-trainer/storage/trainerStorage.ts` for key `guitar-companion:basic-note-trainer:stats` enforcing `ownerId: null` schema with defensive fallback
- [x] T006 Implement unit tests for music theory and storage in `tests/apps/basic-note-trainer/musicTheory.test.ts` verifying bidirectional translation and chromatic semitones

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 - Note Name Translation Flashcards (Priority: P1) 🎯 MVP

**Goal**: Deliver an interactive flashcard session translating Anglo-Saxon letters (A-G) and European Solfège (Do-Si) in both directions with in-place retry and live scoring.

**Independent Test**: Navigate to `/basic-note-trainer?mode=translation`, view a note translation question, tap an incorrect option (confirm button turns red and is disabled, failures increment, streak resets), tap the correct option (confirm button turns green, card resolves), and verify streak and hit counters update live.

### Tests for User Story 1

- [x] T007 [P] [US1] Implement unit tests for translation card generation and retry logic in `tests/apps/basic-note-trainer/cardGenerator.test.ts`

### Implementation for User Story 1

- [x] T008 [P] [US1] Implement translation card question generator in `src/apps/basic-note-trainer/domain/cardGenerator.ts` producing exactly 4 unique options (1 correct, 3 distinct distractors from same domain) for `LETTER_TO_SOLFEGE` and `SOLFEGE_TO_LETTER`
- [x] T009 [US1] Implement session state machine and retry reducer in `src/apps/basic-note-trainer/hooks/useTrainerSession.ts` managing `IDLE`, `RETRYING`, `SOLVED_DIRECT`, and `SOLVED_AFTER_ERROR`, tracking `okeys`, `failures`, `currentStreak`, and `accuracy`
- [x] T010 [P] [US1] Implement accessible 44px+ touch-friendly option button component in `src/apps/basic-note-trainer/components/OptionButton.tsx` with error (red), success (green), and idle styles
- [x] T011 [P] [US1] Implement interactive flashcard component in `src/apps/basic-note-trainer/components/Flashcard.tsx` rendering the question prompt, visual hints, and the 2x2 option button grid
- [x] T012 [US1] Implement main client container in `src/apps/basic-note-trainer/components/NoteTrainerApp.tsx` wiring `useTrainerSession` with `Flashcard` and live scoring
- [x] T013 [US1] Create route page and layout at `src/app/(apps)/basic-note-trainer/page.tsx` and `src/app/(apps)/basic-note-trainer/layout.tsx` rendering the translation MVP

**Checkpoint**: User Story 1 functional and independently testable as the core MVP

---

## Phase 4: User Story 2 - Chromatic Sequence & Accidentals Trainer (Priority: P1)

**Goal**: Expand generator and flashcard questions to test chromatic note order, sharps (#), flats (b), and natural semitones (B-C and E-F).

**Independent Test**: Navigate to `/basic-note-trainer?mode=accidentals`, answer questions testing whether notes have accidentals and identifying natural semitone pairs (B-C / E-F), confirming accurate grading.

### Tests for User Story 2

- [x] T014 [P] [US2] Implement unit tests for accidental and sequence questions in `tests/apps/basic-note-trainer/accidentals.test.ts`

### Implementation for User Story 2

- [x] T015 [US2] Extend `cardGenerator.ts` in `src/apps/basic-note-trainer/domain/cardGenerator.ts` with question generators for `HAS_ACCIDENTAL`, `NATURAL_SEMITONE`, and `NEXT_CHROMATIC` with enharmonic notation (e.g. C#/Db)
- [x] T016 [US2] Update `NoteTrainerApp.tsx` and `Flashcard.tsx` in `src/apps/basic-note-trainer/components/` to support accidental card prompts, sub-prompts, and accidental symbol buttons

**Checkpoint**: User Stories 1 and 2 functional and independently testable

---

## Phase 5: User Story 3 - Pedagogical Explanations, Mnemonics & Error Recovery (Priority: P2)

**Goal**: Display contextual explanations and memory tricks whenever a user selects the correct answer following one or more failed attempts, requiring a manual "Next Card" action to proceed.

**Independent Test**: Intentionally choose a wrong option on a card, then choose the correct option; verify the card reveals the pedagogical explanation and mnemonic trick, pauses auto-advancement, and displays a prominent "Next Card" button (or responds to `Enter`).

### Tests for User Story 3

- [x] T017 [P] [US3] Implement unit tests for error recovery flow and explanation reveal in `tests/apps/basic-note-trainer/useTrainerSession.test.ts`

### Implementation for User Story 3

- [x] T018 [P] [US3] Implement pedagogical explanation and mnemonic display component in `src/apps/basic-note-trainer/components/ExplanationCard.tsx` showing mnemonic badge, theoretical rationale, and "Next Card" action button
- [x] T019 [US3] Implement keyboard navigation hook in `src/apps/basic-note-trainer/hooks/useTrainerKeyboard.ts` enabling options 1-4, `Enter`, and `Space` to advance or retry
- [x] T020 [US3] Integrate `ExplanationCard` and spaced reinforcement queue into `useTrainerSession.ts` and `NoteTrainerApp.tsx` so missed notes reappear after 3-5 cards

**Checkpoint**: User Stories 1, 2, and 3 functional with rich pedagogical feedback

---

## Phase 6: User Story 4 - URL Query Parameter Configuration & Web-View Embed Mode (Priority: P2)

**Goal**: Enable host applications to configure mode, difficulty, and embed status via URL query parameters, suppressing site chrome and dispatching `postMessage` progress events.

**Independent Test**: Navigate to `/basic-note-trainer?mode=translation&embed=true`, verify header and footer are suppressed, live progress bar shows Okeys vs Failures, and browser console registers `NOTE_TRAINER_ANSWER` events dispatched to `window.parent`.

### Tests for User Story 4

- [x] T021 [P] [US4] Implement unit tests for query parameter parsing and fallback defaults in `tests/apps/basic-note-trainer/queryParams.test.ts`

### Implementation for User Story 4

- [x] T022 [P] [US4] Implement query parameters parser in `src/apps/basic-note-trainer/domain/queryParams.ts` handling `mode`, `direction`, `difficulty`, and `embed`
- [x] T023 [P] [US4] Implement live progress bar component in `src/apps/basic-note-trainer/components/LiveProgressBar.tsx` showing Okeys, Failures, Streak, and Accuracy % in both standalone and embed views
- [x] T024 [P] [US4] Implement host postMessage bridge hook in `src/apps/basic-note-trainer/hooks/usePostMessageBridge.ts` dispatching `NOTE_TRAINER_ANSWER` and `NOTE_TRAINER_PROGRESS` events to `window.parent`
- [x] T025 [US4] Implement embed mode layout branch in `src/app/(apps)/basic-note-trainer/page.tsx` and `src/app/(apps)/basic-note-trainer/layout.tsx` suppressing platform header/footer and bottom navigation when `embed=true`

**Checkpoint**: All user stories complete, including deep linking and web-view embedding

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Platform integration, SEO metadata, documentation, and validation

- [x] T026 [P] Implement Open Graph image generator in `src/app/(apps)/basic-note-trainer/opengraph-image.tsx` and SEO structured data (Schema.org JSON-LD)
- [x] T027 [P] Add link and promotional card for Basic Note Trainer to the main platform directory in `src/app/page.tsx`
- [x] T028 Run quickstart validation scenarios from `specs/002-basic-note-trainer/quickstart.md` and execute full test suite `bun test`
- [x] T029 Rebuild and reload production Docker container via `bun run docker:reload` and verify health check at `http://192.168.1.202:3100/api/health`

---

## Phase 8: Internationalization (i18n) & Spanish Support (User Story 5)

**Purpose**: App-level and trainer-level bilingual support (English & Spanish) with UI switcher and query param priority.

- [x] T030 [P] [US5] Implement core i18n infrastructure in `src/core/i18n/` (`types.ts`, `LanguageContext.tsx`, `translations.ts`, and `src/core/ui/LanguageSwitcher.tsx`)
- [x] T031 [P] [US5] Extend `types.ts` and `queryParams.ts` in `src/apps/basic-note-trainer/` to support `lang` (`'en' | 'es'`) and `compact` (`boolean`)
- [x] T032 [P] [US5] Add comprehensive Spanish pedagogical explanations and mnemonics in `src/apps/basic-note-trainer/domain/mnemonics.ts` (covering all notes A-G, natural semitones Si-Do / Mi-Fa, and accidentals)
- [x] T033 [P] [US5] Localize question generator in `src/apps/basic-note-trainer/domain/cardGenerator.ts` supporting `lang` for translation prompts, accidental choices ("Sí"/"No"), hints, and explanations
- [x] T034 [US5] Update UI components (`LiveProgressBar.tsx`, `Flashcard.tsx`, `ExplanationCard.tsx`, `NoteTrainerApp.tsx`, `src/app/layout.tsx`) with language selector and localized text
- [x] T035 [US5] Add unit tests for Spanish translation and query param language parsing in `tests/apps/basic-note-trainer/queryParams.test.ts` and `tests/apps/basic-note-trainer/cardGenerator.test.ts`

---

## Phase 9: Ultra-Compact Embed Experience & Validation (User Story 4 Iteration)

**Purpose**: Fit embed mode within a standard <= 410px container, eliminating vertical scrollbars.

- [x] T036 [P] [US4] Implement dedicated embed route at `src/app/(apps)/basic-note-trainer/embed/page.tsx` enforcing `embed=true` and `compact=true`
- [x] T037 [US4] Implement in-place compact error recovery view within `Flashcard.tsx` and slim progress bar in `LiveProgressBar.tsx`
- [x] T038 [US4] Update `NoteTrainerApp.tsx` and `src/app/(apps)/basic-note-trainer/page.tsx` to streamline embed view without UI language selector or site chrome
- [x] T039 Run full test suite `bun test --preload ./tests/setup.ts` ensuring all tests pass
- [x] T040 Rebuild and reload production Docker container via `bun run docker:reload` and verify health check at `http://192.168.1.202:3100/api/health`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) — BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion. Serves as MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational and User Story 1 domain models.
- **User Story 3 (Phase 5)**: Depends on User Story 1 and 2 interaction components.
- **User Story 4 (Phase 6)**: Depends on User Story 1 main container.
- **Polish (Phase 7)**: Depends on all user stories being complete.

### Parallel Opportunities

- Within Phase 1: `T002` can run alongside directory setup.
- Within Phase 2: `T003`, `T004`, `T005` can run in parallel in different files.
- Within Phase 3 (US1): `T007` (tests), `T008` (generator), `T010` (OptionButton), `T011` (Flashcard) can run in parallel before container integration (`T012`).
- Within Phase 4 (US2): `T014` (tests) can run in parallel with model work.
- Within Phase 5 (US3): `T017` (tests) and `T018` (ExplanationCard) can run in parallel.
- Within Phase 6 (US4): `T021` (tests), `T022` (parser), `T023` (LiveProgressBar), `T024` (postMessage hook) can all run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Complete Phase 3 (User Story 1).
3. Validate independent translation flashcards.
4. Deliver working MVP.

### Incremental Delivery
1. Foundation Ready (Phase 1 + 2).
2. MVP: Note Translation cards (Phase 3).
3. Increment 2: Accidentals & Natural Semitones (Phase 4).
4. Increment 3: Pedagogical Mnemonics & Error Recovery (Phase 5).
5. Increment 4: Query Params & Embed Web-View (Phase 6).
6. Polish, SEO, and Docker Production Reload (Phase 7).
