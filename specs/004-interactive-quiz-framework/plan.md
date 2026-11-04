# Implementation Plan: Interactive Learning & Quiz Framework

**Branch**: `004-interactive-quiz-framework` | **Date**: 2026-11-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-interactive-quiz-framework/spec.md`

## Summary

The Interactive Learning & Quiz Framework is a domain-agnostic, JSON-driven learning and assessment engine built into the shared core layer (`@/core/quiz/`) in strict compliance with Constitution Core Principle VII. It externalizes learning content into modular JSON question packs indexed by a central manifest, validates schemas using Zod, supports open question formats (single-choice, all-or-nothing multi-select, and decoupled visual challenges), and executes an endless gamified carousel that guarantees zero repetition and enforces multi-family sister question mutual exclusion. Additionally, the plan defines a dedicated migration stream to migrate existing quiz applications (`basic-note-trainer` and `basic-chord-trainer`) to this framework.

## Technical Context

**Language/Version**: TypeScript 5.x (`strict: true`), React 19, Next.js 15 (App Router).

**Primary Dependencies**: Next.js 15, React 19, Lucide React (icons), TailwindCSS v4, Zod (schema validation & inference). No external charting or heavy quiz engines; lean vanilla SVG/React.

**Storage**: External JSON files under `src/content/quizzes/` for question packs; `window.localStorage` via `@/core/storage/typedStorage.ts` for guest-mode session metrics (`ownerId: null`).

**Testing**: Bun test runner with setup preload (`bun test --preload ./tests/setup.ts`).

**Target Platform**: Mobile web, desktop browsers, and embedded webviews ($\ge 320$px width, ultra-compact embed mode fitting $\le 420$px height).

**Project Type**: Reusable core infrastructure engine (`@/core/quiz`) + unified visual question component library (`@/core/ui/questions`) + migration adapters for existing apps. (Standalone route `/quiz` deferred/removed for now).

**Performance Goals**: Candidate pool filtering $< 50$ms for up to 5,000 questions, instant touch responses ($< 16$ms frame budget), zero Cumulative Layout Shift (CLS $< 0.05$).

**Constraints**:
- Domain-agnostic core: zero guitar-specific identifiers in `@/core/quiz/`.
- Content in JSON only: zero question prompts or options hardcoded in TS code.
- Multi-family exclusion: questions can define `familyIds: string[]`; any overlap excludes the candidate.
- Gamified flow: playable in 20-30s micro-sessions without arbitrary 20-question cutoffs; in-place remediation upon error (no deferred review queue).

**Scale/Scope**: Core engine, Zod validators, Visual Component Registry, generic Quiz Runner, 3 initial JSON packs (note translations, accidentals, open chords), and migration of existing trainer apps.

---

## Constitution Check

*GATE: Passed prior to Phase 0 research. Re-evaluated post-design.*

| Principle | Compliance Assessment | Status |
| :--- | :--- | :--- |
| **I. Independent Multi-App Core** | Core quiz framework is placed in `src/core/quiz/` (shared layer), usable by any current or future app without coupling apps directly to each other. | **PASS** |
| **II. SEO-First per Application** | Generic quiz app route (`/quiz`) provides pre-rendered SSR layout, semantic metadata, OpenGraph, and structured JSON-LD data. | **PASS** |
| **III. Mobile-First & Dual Navigation** | Quiz interfaces scale from 320px up; touch targets $\ge 44\times 44$px. Embed mode (`embed=true`) suppresses navigation bars. | **PASS** |
| **IV. Zero-Mock UI** | Fully operational in guest mode; persistence models `ownerId: null` ready for cloud sync without mock accounts. | **PASS** |
| **V. Simplicity & Performance** | Pure React and Zod; zero heavy canvas or external quiz frameworks; minimal bundle impact. | **PASS** |
| **VI. Canonical English Default** | Core code and default microcopy in English (`en`), with robust Spanish (`es`) localization for all questions, options, and explanations. | **PASS** |
| **VII. Domain-Agnostic, Embeddable & URL-Driven Quiz Engine** | Core engine is completely decoupled from guitar specifics; configurable declaratively via URL query params (`courses`, `difficulty`, `topics`, `notation`); provides PostMessage bridge. | **PASS** |

---

## Project Structure

### Documentation (this feature)

```text
specs/004-interactive-quiz-framework/
├── spec.md              # Requirements & acceptance criteria
├── checklists/
│   └── requirements.md  # Quality validation checklist
├── plan.md              # This implementation plan
├── research.md          # Architectural research & decisions
├── data-model.md        # Entities, types & state machines
├── quickstart.md        # Validation scenarios & verification guide
└── contracts/
    ├── quiz-schema.contract.json   # JSON schema for question packs
    ├── postmessage.contract.ts     # PostMessage event bridge contract
    └── url-params.contract.ts      # Query parameter schema
```

### Source Code Architecture

```text
src/
├── core/
│   ├── ui/
│   │   └── questions/               # [NEW] Extracted & Homogenized Visual Question UI
│   │       ├── QuestionCard.tsx     # Mobile-first bounded card container
│   │       ├── QuestionHeader.tsx   # Category/topic/difficulty badges & prompt
│   │       ├── StimulusContainer.tsx# Stimulus container preventing overflow
│   │       ├── ActionNextButton.tsx # Uniform amber gradient CTA button
│   │       ├── MnemonicBanner.tsx   # Consistent mnemonic trick callout
│   │       ├── FeedbackBanner.tsx   # In-place hint and feedback alerts
│   │       └── index.ts
│   │
│   └── quiz/                        # Domain-Agnostic Quiz Engine
│       ├── types/
│       │   ├── schema.ts            # Zod schemas & inferred TypeScript types
│       │   ├── session.ts           # State machine interfaces & action types
│       │   └── index.ts
│       ├── engine/
│       │   ├── filter.ts            # Dynamic multi-dimensional filter & pack resolver
│       │   ├── carousel.ts          # Fisher-Yates shuffle & multi-family exclusion
│       │   └── evaluator.ts         # Single-choice & all-or-nothing multi-select grading
│       ├── registry/
│       │   └── visualRegistry.ts    # Decoupled registry mapping visualType to React components
│       ├── components/
│       │   ├── QuizRunner.tsx       # Top-level pure quiz runner container
│       │   ├── QuestionView.tsx     # Stimulus, prompt & options renderer
│       │   ├── OptionGrid.tsx       # 2x2 or 1-column responsive choice grid
│       │   ├── RemediationCard.tsx  # Rich pedagogical explanation, mnemonic & visual cue
│       │   └── SessionProgressBar.tsx # Gamified live streak and accuracy bar
│       └── hooks/
│           ├── useQuizSession.ts    # React state machine reducer hook
│           ├── useQuizUrlParams.ts  # URL sync & parsing hook
│           └── useQuizPostMessage.ts # Embed bridge hook
│
├── content/
│   └── quizzes/                     # [NEW] External Question Banks
│       ├── manifest.json            # Catalog of courses & packs
│       ├── courses/
│       │   ├── course-01-notes.json # Basic note translations
│       │   └── course-02-accidentals.json # Semitones & accidentals
│       └── topics/
│           └── open-chords.json     # Beginner open chords
│
├── app/
│   └── (apps)/
│       └── quiz/                    # [DEFERRED] Temporarily removed from routing
│
└── apps/
    ├── basic-note-trainer/          # [MIGRATED] Adapts to consume @/core/quiz & JSON packs
    └── basic-chord-trainer/         # [MIGRATED] Adapts to consume @/core/quiz & JSON packs
```

---

## Migration Plan for Existing Apps

### 1. `specs/002-basic-note-trainer` Migration Addendum
- Hardcoded note generation in `cardGenerator.ts` and `mnemonics.ts` is extracted into `src/content/quizzes/courses/course-01-notes.json` and `course-02-accidentals.json`.
- `NoteTrainerApp` is updated to delegate session management to `useQuizSession`, while registering `ChromaticScaleVisualizer` with `VisualRegistry.register('chromatic-scale', ...)`.
- Existing routes `/basic-note-trainer` and `/basic-note-trainer/embed` are maintained with 100% backward compatibility.
- Update `specs/002-basic-note-trainer/plan.md` to note that migration spec `004` has been applied.

### 2. `specs/003-basic-chord-trainer` Migration Addendum
- Hardcoded chord definitions in `chordCatalog.ts` are extracted into `src/content/quizzes/topics/open-chords.json`.
- Fretboard visualizer is registered: `VisualRegistry.register('fretboard-diagram', FretboardDiagram)`.
- Challenge generator delegates to `useQuizSession` with multi-family sister exclusion between "Identify" and "Draw" modes.
- Existing routes `/basic-chord-trainer` and `/basic-chord-trainer/embed` are maintained with 100% backward compatibility.
- Update `specs/003-basic-chord-trainer/plan.md` to note that migration spec `004` has been applied.
