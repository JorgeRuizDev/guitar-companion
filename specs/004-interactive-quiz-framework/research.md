# Architectural Research: Interactive Learning & Quiz Framework

**Branch**: `004-interactive-quiz-framework` | **Date**: 2026-11-04 | **Feature**: [spec.md](./spec.md)

This document records the architectural analysis, technology evaluations, and design decisions for the Domain-Agnostic, JSON-Driven Interactive Learning and Quiz Framework.

---

## 1. Domain-Agnostic Core Placement (Constitution VII Compliance)

### Context
Constitution Core Principle VII requires that the quiz engine, its state machine, UI runners, and evaluation models remain decoupled from guitar or music specifics so that the framework can be extracted or reused for any educational subject.

### Decision
Place the agnostic quiz framework inside `@/core/quiz/` (within the shared infrastructure layer) with modular sub-domains:
- `src/core/quiz/types/`: Agnostic TypeScript types and Zod schemas (`Question`, `QuizSession`, `QuestionFilter`, `Remediation`, `Manifest`).
- `src/core/quiz/engine/`: Pure session state machine, multi-family exclusion filter, Fisher-Yates non-repeating shuffle, and evaluation logic.
- `src/core/quiz/components/`: Pure, agnostic UI components (`QuizRunner`, `QuestionCard`, `ChoiceButtonGrid`, `RemediationBanner`, `SessionScoreBar`).
- `src/core/quiz/registry/`: Component registry (`VisualComponentRegistry`) allowing domain apps to inject specialized visual interactors (such as guitar fretboards or chromatic visualizers) without polluting the core engine.
- `src/core/quiz/hooks/`: Reusable React hooks (`useQuizSession`, `useQuizUrlParams`, `useQuizPostMessage`).

### Alternatives Considered
- *Separate npm workspace / package*: Overkill for the current single-repository scale (violates YAGNI, Principle V).
- *Placing inside `src/apps/quiz/`*: Violates Principle VII because other apps (`basic-note-trainer`, `basic-chord-trainer`) would be forced to cross-import from a sibling app directory, violating Principle I. Shared code belongs in `src/core/`.

---

## 2. Content Storage & Modular Pack Organization

### Context
User requirement: Questions must be external (JSON files), not hardcoded in TypeScript. They must be organized dynamically by courses and topics, allowing queries like "courses 1 to 5 of any difficulty".

### Decision
Store question datasets under `src/content/quizzes/` organized into structured, modular subdirectories:
```text
src/content/quizzes/
├── manifest.json               # Lightweight index of all available packs & metadata
├── courses/
│   ├── course-01.json
│   ├── course-02.json
│   └── ...
└── topics/
    ├── notes-translation.json
    ├── chromatic-sequence.json
    ├── open-chords.json
    └── ...
```
- The `manifest.json` file contains pack identifiers, file paths, course levels, topic tags, question counts, and supported notation styles.
- A static loader (`loadQuizPacks(filter)`) reads only the packs matching the active query filter, combining them into a single pool before passing to the carousel engine.

### Alternatives Considered
- *Single monolithic `questions.json`*: Poor authoring experience, large bundle size, difficult git merge conflicts.
- *SQL or NoSQL database (PostgreSQL/MongoDB)*: Premature complexity for static learning material; violates Constitution V (Simplicity) and introduces runtime server/network dependencies.

---

## 3. Schema Enforcement & Build-Time Validation with Zod

### Context
External JSON files must be guaranteed valid and strictly typed to prevent runtime crashes.

### Decision
Author canonical schemas using **Zod** (`zod` is standard in modern TypeScript/Next.js stacks):
- `QuestionSchema`: Validates `id`, `familyIds` (array of strings), `type` (`single-choice`, `multiple-choice`, `interactive-visual`), `course`, `difficulty`, `topics`, `notation`, `prompt` (localized `en`/`es`), `options`, `correctAnswer`, and `remediation`.
- A build-time/CI test script (`tests/unit/core/quiz/validatePacks.test.ts`) scans every JSON pack in `src/content/quizzes/` against `QuestionSchema` and `ManifestSchema`, failing the build if any syntax, ID duplicate, or schema error is found.

---

## 4. Visual Component Registry Pattern

### Context
Questions must support varied formats (single-choice, multi-select, and graphical interactive challenges like chord drawing or scale visualizers). The graphic logic must NOT live in the JSON, but the JSON must declare how it should be rendered.

### Decision
Implement a type-safe **Visual Component Registry**:
- The JSON defines:
  ```json
  "stimulus": {
    "visualType": "fretboard-diagram",
    "visualProps": {
      "chordSymbol": "C",
      "targetFrets": [null, 3, 2, 0, 1, 0]
    }
  }
  ```
- The application registers visual handlers:
  ```typescript
  VisualRegistry.register('fretboard-diagram', FretboardVisualizer);
  VisualRegistry.register('chromatic-scale', ChromaticScaleVisualizer);
  ```
- The generic `QuizRunner` inspects `stimulus.visualType`. If present, it looks up the component in the registry and passes `visualProps`. If absent, it renders standard text stimulus.

---

## 5. Multi-Family Sister Mutual Exclusion Algorithm

### Context
Questions cannot repeat in a session. Furthermore, related sister questions (e.g. asking A→La vs La→A, or Letter vs Solfège variants, or inverse drawing) must be mutually excluded once any member is served. A question can belong to *multiple* families simultaneously (`familyIds: string[]`).

### Decision
The carousel engine maintains an exclusion set `excludedFamilyIds: Set<string>`:
1. When generating or filtering the session pool:
   - Filter candidate questions matching the `QuestionFilter` criteria.
   - Shuffle candidate pool using pure Fisher-Yates algorithm.
2. In the dynamic carousel:
   - The engine selects the next question from the pool.
   - For every `familyId` in `question.familyIds`:
     - Add `familyId` to `session.excludedFamilyIds`.
   - Before serving any subsequent question from the remaining candidate list:
     - Check whether `candidate.familyIds.some(f => session.excludedFamilyIds.has(f))`.
     - If true, remove or bypass this candidate (it is a sister of an already-served question).
     - Continue until the candidate pool is exhausted or user stops.

---

## 6. Gamified Continuous Flow & In-Place Remediation

### Context
Clarified user requirement: Sessions are casual, gamified micro-play (playable in 20-30s while waiting or continuously). There are no arbitrary 20-question limits. Learning occurs in-place upon error; no post-session review queue is required.

### Decision
The session state machine operates with continuous transitions:
- `IDLE`: Fresh question displayed; all interactive options active.
- `EVALUATED_CORRECT`: Solved on first attempt; streak increments, brief celebration feedback (350ms) or user tap advances to next question.
- `EVALUATED_INCORRECT`: User made an error. Streak resets to 0. The interface renders the rich **Remediation Card** immediately in-place:
  - Error diagnostic (which chosen option was wrong, or missing correct options for multi-select).
  - Theoretical principle explanation.
  - Practical mnemonic rule.
  - Optional visual corrective diagram.
  - A prominent "Continue / Next" button lets the player advance at their own pace.
- `SESSION_EXHAUSTED`: Only reached if all non-sister matching questions in the entire active filter pool have been served. Displays friendly completion card with option to restart or broaden filter.

---

## 7. Migration Strategy for Existing Applications

### Context
User requirement: Dedicated tasks for migrating `basic-note-trainer` and `basic-chord-trainer` to this framework, and recording in each app's plan that this migration has been applied.

### Decision
1. **Extraction of Data into JSON**:
   - Extract `cardGenerator.ts` / `mnemonics.ts` translation tables into `src/content/quizzes/courses/course-01.json` (note names & translations) and `src/content/quizzes/courses/course-02.json` (accidentals & chromatic sequence).
   - Extract `chordCatalog.ts` (22 open chords) into `src/content/quizzes/topics/open-chords.json`, with sister families linking "identify" and "draw" variants.
2. **Adapter & Engine Integration**:
   - Refactor `NoteTrainerApp` and `ChordTrainerApp` to consume the generic `useQuizSession` hook and JSON datasets while maintaining their custom shell styling and existing URL query parameters.
3. **Documentation Updates**:
   - Update `specs/002-basic-note-trainer/plan.md` and `specs/003-basic-chord-trainer/plan.md` with explicit migration addenda referencing spec `004`.
