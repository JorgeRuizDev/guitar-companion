---
description: "Task list for feature 001-strumming-pattern-trainer implementation"
---

# Tasks: Strumming Pattern Trainer

**Input**: Design documents from `/specs/001-strumming-pattern-trainer/` (`spec.md`, `plan.md`, `data-model.md`, `contracts/`, `research.md`, `.specify/memory/constitution.md`)  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/  
**Tests**: Includes targeted Vitest unit tests for audio synthesis calculations, scheduling logic, alternating motor mechanics, and local storage adapters (`bun test --preload ./tests/setup.ts`).  
**Organization**: Tasks are grouped by phase and user story to enable independent implementation and testing of each story.

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`, `[US4]`, `[US5]`)
- Exact file paths are specified for every task
- Constraints from `data-model.md` are quoted verbatim in task descriptions

## Path Conventions

- Single Next.js multi-app structure: `src/apps/strumming/`, `src/core/`, `src/app/`, `tests/unit/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, baseline configuration, and shared cross-app primitives

- [x] T001 Initialize Next.js 15+ project with TypeScript, React 19, Lucide React, and Tailwind CSS v4 in package.json and tsconfig.json
- [x] T002 [P] Configure Vitest testing environment with JSDOM and Web Audio mocks in vitest.config.ts and tests/setup.ts
- [x] T003 [P] Configure root styling and Tailwind CSS entry with mobile-first base styles in src/app/globals.css
- [x] T004 [P] Create shared base design system components in src/core/ui/Button.tsx, src/core/ui/Slider.tsx, and src/core/ui/Badge.tsx with minimum 44x44px touch targets
- [x] T005 [P] Implement Screen Wake Lock utility helper in src/core/audio/wakeLock.ts to prevent mobile screen sleep during practice

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core domain types, storage primitives, and Web Audio timing engine infrastructure that MUST be complete before ANY user story can be implemented

⚠️ **CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Define core domain entity types and validation rules in src/apps/strumming/types.ts ensuring `strokeDirection` is `'down' | 'up' | 'none'`, `subdivision` is `'eighth' | 'sixteenth' | 'custom'`, `timeSignature` is `[number, number]` (e.g. `[4, 4]`, `[3, 4]`, `[6, 8]`), `BeatSlot` `index` is integer between `0` and `slotsCount - 1`, `slots.length` is integer between `2` and `24`, `isCompoundAccent` is boolean, `beatLabel` does not exceed 8 characters, `name` is 1-50 characters, and `ownerId` is `string | null`
- [x] T007 [P] Implement typed local storage wrapper in src/core/storage/typedStorage.ts with in-memory fallback for private browsing mode and JSON serialization
- [x] T008 [P] Implement unit tests for typed storage in tests/unit/core/typedStorage.test.ts verifying get, set, remove, and private-mode fallback behaviors
- [x] T009 [P] Implement WebAudioHost in src/apps/strumming/engine/WebAudioHost.ts managing AudioContext lifecycle, user-gesture unlock for iOS Safari, and hardware clock time querying
- [x] T010 [P] Implement MetronomeSynth in src/apps/strumming/engine/MetronomeSynth.ts synthesizing regular clicks (600Hz), accented beat 1 (1000Hz), secondary compound accents (800Hz), and subtle subdivision clicks (450Hz) with soundTheme profiles ('woodblock' | 'click' | 'beep')
- [x] T011 [P] Implement unit tests for MetronomeSynth in tests/unit/strumming/MetronomeSynth.test.ts verifying frequency and gain parameters for normal, accented, compound, and subdivision pulses
- [x] T012 Implement LookaheadScheduler in src/apps/strumming/engine/LookaheadScheduler.ts using a 25ms polling loop and 100ms lookahead window with dynamic measure duration math (`measureDuration = beatsPerMeasure * (4 / beatValue) * (60.0 / bpm)`) for bpm clamped between 40 and 240 and countInMeasures in [0, 1, 2, 3]
- [x] T013 [P] Implement unit tests for LookaheadScheduler in tests/unit/strumming/LookaheadScheduler.test.ts verifying sub-ms event calculation, 4/4, 3/4, 6/8 measure durations, tempo adjustments, and count-in transitions
- [x] T014 [P] Implement AnimationDriver in src/apps/strumming/engine/AnimationDriver.ts calling requestAnimationFrame and calculating progress in under 0.1ms without heap allocations
- [x] T015 Implement root layout and platform landing page in src/app/layout.tsx and src/app/page.tsx maintaining Multi-App Dual Navigation Architecture (desktop header vs mobile fixed bottom nav bar) without fake user profiles
- [x] T016 Implement SEO-optimized layout and metadata in src/app/(apps)/strumming/layout.tsx and src/app/(apps)/strumming/opengraph-image.tsx delivering server-rendered semantic tags and Open Graph data

**Checkpoint**: Foundation ready - audio engine, storage, and shared UI primitives ready for user story integration.

---

## Phase 3: User Story 1 - Interactive Visual Timeline & Looping Playback (Priority: P1) 🎯 MVP

**Goal**: Deliver a real-time synchronized visual strumming timeline that sweeps across beat slots in lockstep with the precision metronome audio, supporting Start/Pause, keyboard shortcuts (`SPACE`, `RETURN`), dynamic tempo adjustments (40–240 BPM), Beat 1 accentuation (and compound accents), dynamic measure duration for 4/4, 3/4, 6/8 and variable blocks, and count-in on a single unified page.

**Independent Test**: Load the strumming trainer, configure 1-measure count-in at 80 BPM, press `SPACE` to start, listen to introductory clicks followed by looping measure pulses, observe the visual playhead sweeping across slots without lag or drift, press `SPACE` to pause, press `SPACE` to resume, press `RETURN` to reset to beat 1, and slide BPM dynamically.

### Tests for User Story 1

- [x] T017 [P] [US1] Unit test for keyboard shortcuts hook in tests/unit/strumming/useKeyboardShortcuts.test.ts verifying SPACE toggles playback and RETURN resets playhead
- [x] T018 [P] [US1] Unit test for dynamic measure duration and loop scheduling across 4/4, 3/4, and 6/8 in tests/unit/strumming/LookaheadScheduler.test.ts verifying slot duration calculation and continuous looping

### Implementation for User Story 1

- [x] T019 [P] [US1] Create BeatSlotBlock presentation component in src/apps/strumming/components/BeatSlotBlock.tsx with arrow rendering (`↓`, `↑`, empty), quarter-beat highlights, compound accent indicators, and touch targets >= 44x44px
- [x] T020 [P] [US1] Create CountInIndicator component in src/apps/strumming/components/CountInIndicator.tsx displaying prominent visual countdown beats matching the active meter during preparatory measures
- [x] T021 [US1] Create VisualTimeline component in src/apps/strumming/components/VisualTimeline.tsx with direct GPU transform playhead translation (`translate3d`) driven by AnimationDriver bypassing React VDOM re-renders
- [x] T022 [P] [US1] Implement useWakeLock hook in src/apps/strumming/hooks/useWakeLock.ts acquiring screen wake lock on playback start and releasing on pause/reset
- [x] T023 [P] [US1] Implement useKeyboardShortcuts hook in src/apps/strumming/hooks/useKeyboardShortcuts.ts binding `SPACE` to toggle play/pause and `RETURN` (Enter) to reset to beat 1
- [x] T024 [US1] Implement usePlaybackEngine hook in src/apps/strumming/hooks/usePlaybackEngine.ts adhering to PlaybackEngineOptions and IPlaybackEngine contracts
- [x] T025 [US1] Create ControlsBar component in src/apps/strumming/components/ControlsBar.tsx with Play/Pause button, Reset button, BPM slider (40-240), Accent toggle, and Count-In selector (0, 1, 2, 3)
- [x] T026 [US1] Create initial StrummingPlayer container in src/apps/strumming/components/StrummingPlayer.tsx integrating VisualTimeline, ControlsBar, and CountInIndicator on a single unified page
- [x] T027 [US1] Connect StrummingPlayer to SSR route in src/app/(apps)/strumming/page.tsx with semantic introductory educational guide and schema.org structured data

**Checkpoint**: User Story 1 is fully functional and delivers an independently testable MVP practice experience.

---

## Phase 4: User Story 2 - Graphic Pattern Builder, Atypical Time Signatures & Dynamic Block Configuration (Priority: P2)

**Goal**: Enable guitar students to customize strumming patterns graphically by clicking directional arrows, select presets for 4/4, 3/4 waltz, and 6/8 ballad, dynamically add or remove blocks between 2 and 24 slots with `+`/`-` controls, enforce standard alternating down/up motor mechanics by default (odd slots = Down, even slots = Up), and toggle free-form arrow direction.

**Independent Test**: Select presets from library ("Island Strum", "Vals Básico 3/4", "Balada 6/8"), verify slot count, time signature, and stroke directions update immediately, use dynamic block controls (`+` and `-`) to expand/trim between 2 and 24 blocks, click slots to toggle alternating states, and toggle the "Alternado D/U" switch to test free-form direction cycling (Down -> Up -> Rest).

### Tests for User Story 2

- [x] T028 [P] [US2] Unit test for alternating motor logic and free-form cycling in tests/unit/strumming/alternationLogic.test.ts verifying odd slots Down and even slots Up across 2 to 24 slots
- [x] T029 [P] [US2] Unit test for preset library integrity in tests/unit/strumming/beginnerPatterns.test.ts verifying 4/4, 3/4 waltz, and 6/8 ballad slot counts, stroke sequences, and meter metadata

### Implementation for User Story 2

- [x] T030 [P] [US2] Expand beginner presets library in src/apps/strumming/presets/beginnerPatterns.ts adding 3/4 waltz presets ('Vals Básico 3/4 D-D-U', 'Vals Balada 3/4 D-DU-DU') and 6/8 compound ballad ('Balada 6/8 D-DU-D-DU') alongside 4/4 patterns
- [x] T031 [US2] Implement positional stroke direction helper and alternation toggle logic in src/apps/strumming/types.ts enforcing getPositionalStrokeDirection across 2 to 24 slots and alignSlotsToStrictAlternation
- [x] T032 [US2] Implement interactive click/tap arrow editing in src/apps/strumming/components/BeatSlotBlock.tsx supporting strict alternation mode (odd: down/none, even: up/none) and free-form 3-way cycling (none -> down -> up -> none)
- [x] T033 [US2] Add dynamic block addition/removal controls (`+` and `-`) in src/apps/strumming/components/VisualTimeline.tsx allowing pattern lengths from 2 to 24 slots with auto-calculated labels and preserved strokes
- [x] T034 [US2] Create PresetSelector component in src/apps/strumming/components/PresetSelector.tsx providing preset categories (4/4 Standard, 3/4 Waltz, 6/8 Compound Ballad) and subdivision switches
- [x] T035 [US2] Integrate dynamic block addition/removal, atypical preset selection, and strict alternation toggle into src/apps/strumming/components/StrummingPlayer.tsx

**Checkpoint**: User Stories 1 and 2 operate seamlessly together, supporting both atypical presets, dynamic block lengths, and custom graphic pattern editing.

---

## Phase 5: User Story 3 - Practice Session Timer & Flow Control (Priority: P3)

**Goal**: Provide a practice session timer with duration presets (2, 5, 10, 15 minutes) and custom durations that counts down in sync with practice, pauses/resumes automatically, and emits a gentle visual/audible alert upon reaching 00:00 while allowing the rhythm loop to continue uninterrupted (per FR-016).

**Independent Test**: Configure a 1-minute practice countdown, start playback, verify the timer decrements with practice, pause and verify timer pauses, let the timer reach 00:00, verify completion alert is displayed and completion chime sounds, while the strumming pattern and metronome continue looping.

### Tests for User Story 3

- [x] T036 [P] [US3] Unit test for practice session timer state machine in tests/unit/strumming/usePracticeTimer.test.ts verifying countdown decrement, pause/resume sync, and completed state without stopping loop

### Implementation for User Story 3

- [x] T037 [P] [US3] Implement usePracticeTimer hook in src/apps/strumming/hooks/usePracticeTimer.ts managing targetDurationSeconds, remainingSeconds countdown, pause/resume sync, and completed status
- [x] T038 [US3] Create PracticeTimer component in src/apps/strumming/components/PracticeTimer.tsx with duration preset buttons (2m, 5m, 10m, 15m), custom minute input, circular/bar progress display, and completion alert
- [x] T039 [US3] Integrate PracticeTimer into src/apps/strumming/components/StrummingPlayer.tsx ensuring continuous loop on completion per FR-016 with subtle Web Audio acoustic chime notification via MetronomeSynth

**Checkpoint**: User Story 3 operates seamlessly alongside active looping playback and pattern editing.

---

## Phase 6: User Story 4 - Advanced Metronome Subdivision & Tempo Control (Priority: P2)

**Goal**: Provide rhythm students with configurable metronome subdivisions (Quarter ♩, Eighth ♫, Sixteenth, Triplet, Swing), a Tap Tempo button, Italian tempo markings, and real-time beat pulse indicator dots dynamically adapted to the active time signature (4 dots in 4/4, 3 dots in 3/4, 6 dots in 6/8 with primary and secondary compound accents).

**Independent Test**: Select subdivision buttons on metronome (Negra, Corcheas, Semicorcheas, Tresillos, Swing), start playback, listen to distinct subordinate clicks, tap "TAP" rhythmically to compute BPM, and observe real-time pulse dots highlighting Beat 1 in 4/4, Beat 1 in 3/4, and Beats 1 & 4 in 6/8.

### Tests for User Story 4

- [x] T040 [P] [US4] Unit test for metronome subdivisions and subordinate click generation in tests/unit/strumming/MetronomeSynth.test.ts verifying frequencies and audio preview for quarter, eighth, sixteenth, triplet, and swing
- [x] T041 [P] [US4] Unit test for Tap Tempo calculation and Italian tempo marking helper in tests/unit/strumming/alternationLogic.test.ts verifying clampBpm and getTempoMarking

### Implementation for User Story 4

- [x] T042 [US4] Update MetronomeSynth in src/apps/strumming/engine/MetronomeSynth.ts to synthesize distinct subdivision click tones (quarter, eighth, sixteenth, triplet, swing) with subordinate volume and audio preview playback
- [x] T043 [US4] Implement interactive Tap Tempo control and Italian tempo markings display in src/apps/strumming/components/ControlsBar.tsx computing BPM from tap intervals clamped between 40 and 240
- [x] T044 [US4] Implement dynamic beat pulse indicator dots in src/apps/strumming/components/ControlsBar.tsx rendering 4 dots for 4/4, 3 dots for 3/4, and 6 dots for 6/8 with primary accent on 1 and compound accent on 4
- [x] T045 [US4] Integrate metronome subdivision controls and beat pulse callbacks into src/apps/strumming/components/StrummingPlayer.tsx and LookaheadScheduler.ts

**Checkpoint**: Advanced rhythmic subdivisions, Tap Tempo, and dynamic meter pulses function accurately.

---

## Phase 7: User Story 5 - Shareable URL Configurations & Local Storage Persistence (Priority: P2)

**Goal**: Ensure the user's active strumming pattern, time signature (4/4, 3/4, 6/8), block count (2-24), tempo, metronome subdivisions, and strict alternation settings are remembered in local storage (with `ownerId: null` schema), and provide an accessible "Share / Copy Link" button that encodes full configuration into URL query parameters with clipboard confirmation.

**Independent Test**: Customize pattern to 3/4 waltz or 6/8 compound ballad with custom tempo, refresh the page and verify all settings are restored from localStorage, click "Share Link" and verify URL is copied with confirmation toast, and load the URL in a fresh browser session to verify full parameter reconstruction.

### Tests for User Story 5

- [x] T046 [P] [US5] Unit test for local storage persistence adapter in tests/unit/strumming/strummingStorage.test.ts verifying pattern save, restore, delete, and ownerId null enforcement
- [x] T047 [P] [US5] Unit test for URL query parameters parsing and serialization in tests/unit/strumming/queryParams.test.ts verifying meter, blocks, bpm, strokes, accent, countIn, and metroSub

### Implementation for User Story 5

- [x] T048 [P] [US5] Implement typed strumming storage adapter in src/apps/strumming/storage/strummingStorage.ts enforcing `ownerId: null` for anonymous guest mode, persisting active pattern, meter, block count, and preferences
- [x] T049 [P] [US5] Implement URL query parameter parser and serializer in src/apps/strumming/domain/queryParams.ts supporting `bpm` (40-240), `meter` (`4/4`, `3/4`, `6/8`), `blocks` (`2-24`), `sub`, `preset`, `strokes`, `accent`, `countIn`, `metroSub`, and `strict`
- [x] T050 [US5] Create ShareConfigButton component in src/apps/strumming/components/ShareConfigButton.tsx copying deep-linked practice URL to clipboard with visual confirmation toast ("¡Enlace copiado!" / "Link copied!") and fallback
- [x] T051 [US5] Integrate URL query parameter loading, query synchronization, and local storage auto-restore into src/apps/strumming/components/StrummingPlayer.tsx on page mount

**Checkpoint**: All 5 user stories are completely functional, persistent, and shareable.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Cross-device ergonomics, performance audit, Zero-Mock UI validation, test suite execution, and production container validation

- [x] T052 [P] Audit all interactive elements in src/apps/strumming/ to ensure minimum 44x44px touch targets on mobile viewports down to 320px
- [x] T053 [P] Validate Zero-Mock UI compliance ensuring no mock login forms or fake avatars exist in src/app/ or src/apps/
- [x] T054 Execute complete unit test suite with `bun test --preload ./tests/setup.ts` to verify 100% pass rate across all unit tests
- [x] T055 Run quickstart.md validation scenarios to verify end-to-end functionality across all user stories
- [x] T056 Rebuild Docker production container with `bun run docker:reload` and verify health check at `http://192.168.1.202:3100/api/health` per project guidelines

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - executes first to configure Next.js, styling, and base components
- **Foundational (Phase 2)**: Depends on Phase 1 - establishes Web Audio engine, types, and persistence foundation; BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 - delivers core MVP timeline and precision metronome playback
- **User Story 2 (Phase 4)**: Depends on Phase 3 - adds graphic pattern builder, atypical meters (3/4, 6/8), dynamic blocks (2-24), and presets
- **User Story 3 (Phase 5)**: Depends on Phase 3 and Phase 4 - adds practice session timer and completion alerts
- **User Story 4 (Phase 6)**: Depends on Phase 3 and Phase 4 - adds metronome subdivisions, Tap Tempo, and dynamic meter pulse dots
- **User Story 5 (Phase 7)**: Depends on Phases 3, 4, and 6 - adds deep-link query serialization and client storage persistence
- **Polish (Phase 8)**: Depends on all user stories being complete - final responsive audit, unit testing, and Docker production reload

### User Story Dependencies

- **US1 (P1)**: Core foundation for all visual animation and audio scheduler integration
- **US2 (P2)**: Extends US1 timeline with dynamic block manipulation (+/-), atypical time signatures, and preset cycling
- **US3 (P3)**: Couples with US1 playback engine state (running/paused) and overlays timer countdown without breaking the audio loop
- **US4 (P2)**: Extends US1 metronome with sub-beat clicks, Tap Tempo BPM calculator, and dynamic time-signature pulse dots
- **US5 (P2)**: Serializes full state across US1, US2, and US4 into URL parameters and persists to local storage

### Within Each User Story

- Unit tests (where specified) MUST be written/verified before complete implementation validation
- Presentation components before compound container integration
- Feature logic before page-level integration
- Checkpoint validation before progressing to next phase

### Parallel Opportunities

- In **Phase 1**: T002 (Vitest), T003 (globals.css), T004 (core UI components), and T005 (wakeLock) can run in parallel
- In **Phase 2**: T007 (typedStorage), T008 (storage tests), T009 (WebAudioHost), T010 (MetronomeSynth), T011 (synth tests), T013 (scheduler tests), and T014 (AnimationDriver) can run in parallel
- In **Phase 3**: T017 (keyboard test), T018 (scheduler test), T019 (BeatSlotBlock), T020 (CountInIndicator), and T022 (useWakeLock) can run in parallel
- In **Phase 4**: T028 (alternation test), T029 (preset test), and T030 (preset definitions) can run in parallel
- In **Phase 5**: T036 (timer test) and T037 (usePracticeTimer hook) can run in parallel
- In **Phase 6**: T040 (subdivision test) and T041 (tap tempo test) can run in parallel
- In **Phase 7**: T046 (storage test), T047 (query params test), T048 (strummingStorage), and T049 (queryParams domain) can run in parallel
- In **Phase 8**: T052 (mobile audit) and T053 (zero-mock audit) can run in parallel

---

## Parallel Execution Examples per User Story

### Setup & Foundational (Phases 1 & 2)

```bash
# Launch shared primitives and test configurations concurrently:
Task: "Configure Vitest testing environment with JSDOM and Web Audio mocks in vitest.config.ts"
Task: "Configure root styling and Tailwind CSS entry with mobile-first base styles in src/app/globals.css"
Task: "Create shared base design system components in src/core/ui/"
Task: "Implement Screen Wake Lock utility helper in src/core/audio/wakeLock.ts"
Task: "Implement typed local storage wrapper in src/core/storage/typedStorage.ts"
Task: "Implement WebAudioHost in src/apps/strumming/engine/WebAudioHost.ts"
Task: "Implement MetronomeSynth in src/apps/strumming/engine/MetronomeSynth.ts"
```

### User Story 1 (Interactive Visual Timeline & Looping Playback)

```bash
# Launch components and hooks concurrently:
Task: "Unit test for keyboard shortcuts hook in tests/unit/strumming/useKeyboardShortcuts.test.ts"
Task: "Unit test for dynamic measure duration in tests/unit/strumming/LookaheadScheduler.test.ts"
Task: "Create BeatSlotBlock presentation component in src/apps/strumming/components/BeatSlotBlock.tsx"
Task: "Create CountInIndicator component in src/apps/strumming/components/CountInIndicator.tsx"
Task: "Implement useWakeLock hook in src/apps/strumming/hooks/useWakeLock.ts"
Task: "Implement useKeyboardShortcuts hook in src/apps/strumming/hooks/useKeyboardShortcuts.ts"
```

### User Story 2 (Graphic Pattern Builder, Atypical Meters & Dynamic Blocks)

```bash
# Launch preset libraries, alternation logic, and unit tests concurrently:
Task: "Unit test for alternating motor logic in tests/unit/strumming/alternationLogic.test.ts"
Task: "Unit test for preset library integrity in tests/unit/strumming/beginnerPatterns.test.ts"
Task: "Expand beginner presets library in src/apps/strumming/presets/beginnerPatterns.ts"
```

### User Story 3 (Practice Session Timer & Flow Control)

```bash
# Launch timer hook and unit tests concurrently:
Task: "Unit test for practice session timer state machine in tests/unit/strumming/usePracticeTimer.test.ts"
Task: "Implement usePracticeTimer hook in src/apps/strumming/hooks/usePracticeTimer.ts"
```

### User Story 4 (Advanced Metronome Subdivision & Tempo Control)

```bash
# Launch subdivision synth and tap tempo tests concurrently:
Task: "Unit test for metronome subdivisions in tests/unit/strumming/MetronomeSynth.test.ts"
Task: "Unit test for Tap Tempo calculation in tests/unit/strumming/alternationLogic.test.ts"
```

### User Story 5 (Shareable URL Configurations & Local Storage Persistence)

```bash
# Launch storage and URL query parameter tests and adapters concurrently:
Task: "Unit test for local storage persistence adapter in tests/unit/strumming/strummingStorage.test.ts"
Task: "Unit test for URL query parameters parsing in tests/unit/strumming/queryParams.test.ts"
Task: "Implement typed strumming storage adapter in src/apps/strumming/storage/strummingStorage.ts"
Task: "Implement URL query parameter parser and serializer in src/apps/strumming/domain/queryParams.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (Next.js, Tailwind v4, base UI primitives)
2. Complete Phase 2: Foundational (Web Audio engine, types, storage) - **CRITICAL: blocks all user stories**
3. Complete Phase 3: User Story 1 (Interactive Visual Timeline + Metronome + Count-In)
4. **STOP and VALIDATE**: Verify real-time playhead sweep (60/120 FPS), audio metronome clicks, and keyboard shortcuts (`SPACE`/`RETURN`) in the browser. Deploy MVP if ready.

### Incremental Delivery

1. Setup + Foundational complete -> Foundation ready
2. Deliver User Story 1 -> Test independently -> Playback MVP live!
3. Deliver User Story 2 -> Add graphic arrow cycling, atypical meters (3/4 waltz, 6/8 ballad), and dynamic blocks (+/- 2 to 24)
4. Deliver User Story 3 -> Add practice session timer with uninterrupted completion loop
5. Deliver User Story 4 -> Add metronome subdivisions (triplet/swing), Tap Tempo, and dynamic meter pulse dots
6. Deliver User Story 5 -> Add deep-link shareable URLs and client-side persistence
7. Final Phase: Cross-device responsive polish, Zero-Mock UI audit, unit tests, and production Docker reload

### Parallel Team Strategy

With multiple developers:
1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 & 4 (Audio engine, metronome subdivisions, timeline animation)
   - Developer B: User Story 2 (Graphic pattern builder, presets, dynamic blocks)
   - Developer C: User Story 3 & 5 (Practice timer, URL params, persistence)
3. Stories integrate into `StrummingPlayer.tsx` independently with clean separation of concerns

---

## Notes

- Every task strictly adheres to the format `- [x] [TaskID] [P?] [Story?] Description with file path`
- `[P]` tasks touch independent files with no uncompleted prerequisites
- `[Story]` label explicitly ties tasks to `[US1]`, `[US2]`, `[US3]`, `[US4]`, `[US5]` from `spec.md`
- Data model constraints (`slots.length` between 2 and 24, BPM 40-240, `ownerId: null`, meter `[beats, value]`) are quoted directly in task definitions
- Continuous looping on practice timer completion (FR-016) is strictly maintained across all stories
- Zero-Mock UI ensures no simulated authentication or mock avatars are introduced
- All mobile interactive targets meet or exceed 44x44px
