# Tasks: Strumming Pattern Trainer

**Input**: Design documents from `/specs/001-strumming-pattern-trainer/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/
**Tests**: Includes targeted Vitest unit tests for audio synthesis calculations, scheduling logic, and local storage adapters.
**Organization**: Tasks are grouped by phase and user story to enable independent implementation and testing of each story.

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Exact file paths are specified for every task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, baseline configuration, and shared cross-app primitives

- [X] T001 Initialize Next.js 15+ project with TypeScript, React 19, Lucide React, and Tailwind CSS in package.json and tsconfig.json
- [X] T002 [P] Configure Vitest testing environment with JSDOM and Web Audio mocks in vitest.config.ts
- [X] T003 [P] Configure root styling and Tailwind CSS entry with mobile-first base styles in src/app/globals.css
- [X] T004 [P] Create shared base design system components in src/core/ui/Button.tsx, src/core/ui/Slider.tsx, and src/core/ui/Badge.tsx with minimum 44x44px touch targets
- [X] T005 [P] Implement Screen Wake Lock utility helper in src/core/audio/wakeLock.ts to prevent screen sleep during practice

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core domain types, storage primitives, and Web Audio timing engine infrastructure that MUST be complete before ANY user story can be implemented

⚠️ **CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Define core domain entity types and validation rules in src/apps/strumming/types.ts ensuring `strokeDirection` is `'down' | 'up' | 'none'`, `subdivision` is `'eighth' | 'sixteenth'`, `BeatSlot` `index` is integer between `0` and `slotsCount - 1`, and `ownerId` is `string | null`
- [X] T007 [P] Implement typed local storage wrapper in src/core/storage/typedStorage.ts with in-memory fallback for private browsing mode and JSON serialization
- [X] T008 [P] Implement unit tests for typed storage in tests/unit/core/typedStorage.test.ts verifying get, set, remove, and fallback behaviors
- [X] T009 [P] Implement WebAudioHost in src/apps/strumming/engine/WebAudioHost.ts managing AudioContext lifecycle, user-gesture unlock for iOS Safari, and hardware clock time querying
- [X] T010 [P] Implement MetronomeSynth in src/apps/strumming/engine/MetronomeSynth.ts with synthesized oscillator and gain decay for regular clicks (600Hz) and accented beat 1 (1000Hz) with soundTheme profiles ('woodblock' | 'click' | 'beep')
- [X] T011 [P] Implement unit tests for MetronomeSynth in tests/unit/strumming/MetronomeSynth.test.ts verifying frequency and gain parameters for normal and accented pulses
- [X] T012 Implement LookaheadScheduler in src/apps/strumming/engine/LookaheadScheduler.ts using a 25ms polling loop and 100ms lookahead window with zero clock drift for bpm clamped between 40 and 240 and countInMeasures in [0, 1, 2, 3]
- [X] T013 [P] Implement unit tests for LookaheadScheduler in tests/unit/strumming/LookaheadScheduler.test.ts verifying sub-ms event calculation, tempo adjustments, and count-in transitions
- [X] T014 [P] Implement AnimationDriver in src/apps/strumming/engine/AnimationDriver.ts calling requestAnimationFrame and calculating progress in under 0.1ms without heap allocations
- [X] T015 Implement root layout and platform landing page in src/app/layout.tsx and src/app/page.tsx maintaining Multi-App navigation without fake user profiles
- [X] T016 Implement SEO-optimized layout and metadata in src/app/(apps)/strumming/layout.tsx and src/app/(apps)/strumming/opengraph-image.tsx delivering server-rendered semantic tags and Open Graph data

**Checkpoint**: Foundation ready - audio engine, storage, and shared UI primitives ready for user story integration.

---

## Phase 3: User Story 1 - Interactive Visual Timeline & Looping Playback (Priority: P1) 🎯 MVP

**Goal**: Deliver a real-time synchronized visual strumming timeline that sweeps across beat slots in lockstep with the precision metronome audio, supporting Start/Pause, keyboard shortcuts (`SPACE`, `RETURN`), tempo adjustments (40–240 BPM), Beat 1 accentuation, and count-in on a single unified page.

**Independent Test**: Load the strumming trainer, configure 1-measure count-in at 80 BPM, press `SPACE` to start, listen to introductory clicks followed by looping measure pulses, observe the visual playhead sweeping across slots without lag or drift, press `SPACE` to pause, press `SPACE` to resume, press `RETURN` to reset to beat 1, and slide BPM dynamically.

### Implementation for User Story 1

- [X] T017 [P] [US1] Create BeatSlotBlock presentation component in src/apps/strumming/components/BeatSlotBlock.tsx with arrow rendering (`↓`, `↑`, empty), quarter-beat highlights, and touch targets >= 44x44px
- [X] T018 [P] [US1] Create CountInIndicator component in src/apps/strumming/components/CountInIndicator.tsx displaying prominent visual countdown beats (e.g. 1, 2, 3, 4) during preparatory measures
- [X] T019 [US1] Create VisualTimeline component in src/apps/strumming/components/VisualTimeline.tsx with direct GPU transform playhead translation (`translate3d`) driven by AnimationDriver bypassing React VDOM re-renders
- [X] T020 [P] [US1] Implement useWakeLock hook in src/apps/strumming/hooks/useWakeLock.ts acquiring screen wake lock on playback start and releasing on pause/reset
- [X] T021 [P] [US1] Implement useKeyboardShortcuts hook in src/apps/strumming/hooks/useKeyboardShortcuts.ts binding `SPACE` to toggle play/pause and `RETURN` (Enter) to reset to beat 1
- [X] T022 [US1] Implement usePlaybackEngine hook in src/apps/strumming/hooks/usePlaybackEngine.ts adhering to PlaybackEngineOptions and IPlaybackEngine contracts
- [X] T023 [US1] Create ControlsBar component in src/apps/strumming/components/ControlsBar.tsx with Play/Pause button, Reset button, BPM slider (40-240), Accent toggle, and Count-In selector (0, 1, 2, 3)
- [X] T024 [US1] Create initial StrummingPlayer container in src/apps/strumming/components/StrummingPlayer.tsx integrating VisualTimeline, ControlsBar, and CountInIndicator on a single unified page
- [X] T025 [US1] Connect StrummingPlayer to SSR route in src/app/(apps)/strumming/page.tsx with semantic introductory educational guide and schema.org structured data

**Checkpoint**: User Story 1 is fully functional and delivers an independently testable MVP practice experience.

---

## Phase 4: User Story 2 - Graphic Pattern Builder & Beginner Presets (Priority: P2)

**Goal**: Allow users to select popular beginner strumming presets (D-D-DU-U, Island Strum, Folk, 16th-note grooves), toggle rhythmic subdivision (8th vs 16th notes), graphically edit individual slots by clicking/tapping arrows, and automatically persist custom patterns in localStorage with `ownerId: null`.

**Independent Test**: Select "Island Strum" preset, verify slots display `[D, -, D, U, -, U, D, U]`, click on an empty slot to cycle it to Down (`↓`), switch subdivision to 16th notes, reload the page, and verify the customized pattern is restored from localStorage.

### Implementation for User Story 2

- [X] T026 [P] [US2] Implement beginner preset patterns library in src/apps/strumming/presets/beginnerPatterns.ts including basic 8th-note D-D-DU-U, Folk D-DU-UDU, Island Strum D-DU-U-DU, and 16th-note grooves with slots.length strictly 8 or 16
- [X] T027 [P] [US2] Implement unit tests for preset patterns in tests/unit/strumming/beginnerPatterns.test.ts validating slot integrity, labels, and constraint bounds
- [X] T028 [P] [US2] Implement strumming persistence adapter in src/apps/strumming/storage/strummingStorage.ts enforcing `ownerId: null` for anonymous guest mode and saving custom patterns and user preferences
- [X] T029 [P] [US2] Implement unit tests for strumming persistence in tests/unit/strumming/strummingStorage.test.ts validating savePreferences, getPreferences, saveCustomPattern, and deleteCustomPattern
- [X] T030 [US2] Implement interactive click/tap cycling in src/apps/strumming/components/BeatSlotBlock.tsx to cycle down -> up -> none on click with accessible button semantics
- [X] T031 [US2] Create PresetSelector component in src/apps/strumming/components/PresetSelector.tsx allowing quick selection of presets and subdivision toggle between eighth (8 slots) and sixteenth (16 slots)
- [X] T032 [US2] Integrate PresetSelector, subdivision switching, and local storage auto-restore into src/apps/strumming/components/StrummingPlayer.tsx ensuring real-time pattern updates without page reloads

**Checkpoint**: User Stories 1 and 2 operate seamlessly together, supporting both preset selection and custom graphic pattern editing.

---

## Phase 5: User Story 3 - Practice Session Timer & Flow Control (Priority: P3)

**Goal**: Provide a practice session timer with duration presets (2, 5, 10, 15 minutes) and custom durations that counts down in sync with playback, pauses/resumes automatically, and emits a gentle visual/audible alert upon reaching 00:00 while allowing the rhythm loop to continue uninterrupted (per FR-016).

**Independent Test**: Configure a 1-minute practice countdown, start playback, verify the timer decrements with practice, pause and verify timer pauses, let the timer reach 00:00, verify completion alert is displayed and completion chime sounds, while the strumming pattern and metronome continue looping.

### Implementation for User Story 3

- [X] T033 [P] [US3] Implement usePracticeTimer hook in src/apps/strumming/hooks/usePracticeTimer.ts handling targetDurationSeconds, remainingSeconds countdown, pause/resume sync, and completed status
- [X] T034 [US3] Create PracticeTimer component in src/apps/strumming/components/PracticeTimer.tsx with duration preset buttons (2m, 5m, 10m, 15m), custom minute input, circular/bar progress display, and completion alert
- [X] T035 [US3] Integrate PracticeTimer into src/apps/strumming/components/StrummingPlayer.tsx ensuring continuous loop on completion per FR-016 with subtle Web Audio acoustic chime notification

**Checkpoint**: All three user stories are completely functional, fulfilling the entire product specification.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cross-device ergonomics, performance audit, Zero-Mock UI validation, and test suite execution

- [X] T036 [P] Audit all interactive elements in src/apps/strumming/ to ensure minimum 44x44px touch targets on mobile viewports down to 320px
- [X] T037 [P] Validate Zero-Mock UI compliance ensuring no mock login forms or fake avatars exist in src/app/ or src/apps/
- [X] T038 Execute unit test suite with npm test to verify full coverage and zero test failures
- [X] T039 Perform production build verification with npm run build to ensure zero TypeScript errors or SSR hydration issues

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - executes first to configure Next.js, styling, and base components
- **Foundational (Phase 2)**: Depends on Phase 1 - establishes Web Audio engine, types, and persistence foundation
- **User Story 1 (Phase 3)**: Depends on Phase 2 - delivers core MVP timeline and precision metronome playback
- **User Story 2 (Phase 4)**: Depends on Phase 3 - adds pattern editing, presets, and storage integration
- **User Story 3 (Phase 5)**: Depends on Phase 3 and Phase 4 - adds practice session timer and completion alerts
- **Polish (Phase 6)**: Depends on Phases 1–5 - final responsive audit, unit testing, and production build verification

### User Story Dependencies

- **US1 (P1)**: Prerequisite for all interactive playback features
- **US2 (P2)**: Extends US1 timeline with graphic slot cycling and preset loading
- **US3 (P3)**: Couples with US1 playback engine state (running/paused) and overlays timer controls

---

## Parallel Execution Opportunities

- In **Phase 1**: T002 (Vitest), T003 (globals.css), T004 (core UI components), and T005 (wakeLock) can run in parallel
- In **Phase 2**: T007 (typedStorage), T008 (storage tests), T009 (WebAudioHost), T010 (MetronomeSynth), T011 (synth tests), T013 (scheduler tests), and T014 (AnimationDriver) can run in parallel
- In **Phase 3**: T017 (BeatSlotBlock), T018 (CountInIndicator), T020 (useWakeLock), and T021 (useKeyboardShortcuts) can run in parallel
- In **Phase 4**: T026 (beginnerPatterns), T027 (pattern tests), T028 (strummingStorage), and T029 (storage tests) can run in parallel
- In **Phase 6**: T036 (Mobile audit) and T037 (Zero-Mock UI audit) can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (Web Audio engine, types, storage)
3. Complete Phase 3: User Story 1 (Interactive Visual Timeline + Metronome)
4. **VALIDATE MVP**: Verify real-time playhead sweep and audio metronome in browser

### Incremental Delivery
1. Foundation & Audio Engine Ready (Phases 1 & 2)
2. MVP Looping Playback Ready (Phase 3)
3. Pattern Builder & Presets Ready (Phase 4)
4. Practice Timer & Notification Ready (Phase 5)
5. Responsive & Production Polish Verified (Phase 6)
