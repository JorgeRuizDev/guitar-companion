# Feature Specification: Interactive Learning & Quiz Framework

**Feature Branch**: `004-interactive-quiz-framework`

**Created**: 2026-11-04

**Status**: Ready for Planning

**Input**: User description: "quiero crear un framework de preguntas interactivas y aprendizaje. Quiero que analices las dos apps que tienen preguntas y que definas una especificación. Como dato: Las preguntas no pueden estar hardcodeadas en el código, deben ser externas, como una BBDD o ficheros Jsons (Jason es como quiero que se implemente en este proyecto). Deben ser educativas, si fallas se debe explicar la razón por la que se ha fallado, y no debe estar limitado a texto. Deben estar abiertas a distintos formatos, selección múltiples, una opción, o ser gráficas como la de los acordes. Lo grafico no debe ir en el JSON, pero si in type o algo para diferencia como se deben dibujar / gestionar. Los componentes visuales de la spreguntas y las explicaciones deben ser genéticos / reutilizables a ser posible. Quiero una organización dinámica, por ejemplo organizar por cursos y dificultad o tematica. No tiene porque estar en una jerarquía. Debe gestionar el carrusel de preguntas, estás no se pueden repetir y me gustaría poder evitar preguntas hermanas en una misma sesión. También se gestiona pues que quiero, por ejemplo: preguntas de los 5 primeros cursos de cualquier dificultad. Me gustaría tener algún tipo de mecanismo para separar las preguntas con notas en letras de las que usan solfeo, para que sea más variado, igual se puede duplicar la pregunta con distinta categoría (y se excluyen por ser hermanas)"

## Clarifications

### Session 2026-11-04

- **Q1 (Integration & Migration of Existing Apps)**: How should the two existing apps (`basic-note-trainer` and `basic-chord-trainer`) be integrated with the new interactive quiz framework?
  - *Decision*: A dedicated migration workstream and section of tasks will be included for migrating both existing apps to the framework. Additionally, the implementation plans of each corresponding feature specification (`002-basic-note-trainer` and `003-basic-chord-trainer`) will record that a migration following this framework spec is applied. Existing URLs and user-facing contracts will be preserved while their underlying data and engines transition to JSON-driven schemas.
- **Q2 (Session Pacing, Duration & Gamified Play)**: What session pacing and completion model should the framework prioritize?
  - *Decision*: Gamified Continuous Flow (No Artificial 20-Question Rounds). Sessions behave like a casual game playable in quick 20-30 second bursts while waiting, or sustained indefinitely. Questions are continuously drawn and randomized from the eligible filter pool, limited in length only by the total number of available questions in that pool (exhaustion) or until the player chooses to stop.
- **Q3 (Multiple-Select Scoring & Feedback)**: How should multiple-select questions evaluate correctness and present feedback when a learner submits their choices?
  - *Decision*: Option A (All-or-Nothing with Diagnostic Breakdown). Full success is awarded only if all correct options and zero incorrect options are picked. Any discrepancy counts as an incorrect attempt, and the remediation card explicitly flags false positives (incorrect choices picked) and false negatives (omitted correct choices) alongside the conceptual explanation.
- **Q4 (Question Pack Organization & Manifest)**: How should question JSON files be structured and organized in the project repository?
  - *Decision*: Option A (Modular Course & Topic Packs with Central Manifest). Questions are authored across modular JSON pack files organized by course and topic (e.g., `src/content/quizzes/courses/*.json`, `src/content/quizzes/topics/*.json`), cataloged in a lightweight index manifest (`manifest.json`) that provides pack metadata, course tags, and topic indices for fast filtering and lazy-loading.
- **Q5 (Remediation Timing & Review Buffer Policy)**: How should learning and remediation be timed when a user makes mistakes?
  - *Decision*: Immediate In-Place Remediation (No Post-Session Review Queue). The learning process happens immediately when a user fails: the rich pedagogical explanation and visual cues are presented right then. No delayed review buffer is queued for later.
- **Q6 (Multiple Sister Question Families)**: Can a question belong to multiple sister question families simultaneously?
  - *Decision*: Yes. A question can define an array of family identifiers (`familyIds: string[]`), allowing it to belong to multiple sister families simultaneously (for instance, one family for inverse translations such as C↔Do, and another family for notation variants such as Solfège↔Letters). When any question is served in a session, all its associated `familyIds` are registered in the session exclusion set (`excludedFamilyIds`), and any remaining candidate question sharing *at least one* common family ID is automatically excluded from that session.

## Architectural Foundation & Analysis of Existing Apps

A detailed architectural inspection of the two existing quiz/trainer applications in the platform reveals key patterns and divergence points that this framework must generalize:

1. **`basic-note-trainer` (Flashcard / Translation & Sequence Engine)**:
   - *Current Mechanism*: Questions are programmatically generated via algorithms in `cardGenerator.ts` (`generateTranslationCard`, `generateAccidentalCard`, `generateSequenceCard`), relying on in-memory helper tables.
   - *Interaction Flow*: Single-choice 4-option flashcards. On incorrect attempt, the chosen button is disabled with error feedback (`RETRYING` state). When the user selects the right answer after an error (`SOLVED_AFTER_ERROR`), a pedagogical explanation card (`ExplanationCard`) is revealed showing a theoretical explanation, mnemonic trick, and a dynamic graphical visualizer (`ChromaticScaleVisualizer`).
   - *Session Loop*: Infinite continuous stream tracking streak, hits, misses, and accuracy %, with in-place recovery.
   - *Limitations*: Tightly coupled to guitar/music primitives in code; impossible for content authors to add new question sets, modify explanations, or customize mnemonics without modifying TypeScript generator code.

2. **`basic-chord-trainer` (Interactive Fretboard & Dual-Notation Engine)**:
   - *Current Mechanism*: Chords are hardcoded in a static TypeScript catalog (`chordCatalog.ts`, 18KB). Challenges are generated via `challengeGenerator.ts`.
   - *Interaction Flow*: Two distinct challenge types:
     - `identify`: Graphical fretboard diagram displayed as question stimulus; user picks from 4 multiple-choice options.
     - `draw`: Chord name given; user interactively places dots and configures string states (open/muted/fretted) on an SVG fretboard, evaluated with fine-grained string-by-string verification (`StringVerificationResult`).
   - *Session Loop*: Alternating or fixed challenge modes, URL query param selection (`?chords=...&mode=...`), PostMessage embed support.
   - *Limitations*: Fretboard evaluation and challenge types are locked to the specific chord domain; cannot be reused for scale identification, interval drawing, or non-guitar topics without code duplication.

3. **Generalization Strategy for the New Framework**:
   - The framework implements Constitution **Core Principle VII** (*Domain-Agnostic, Embeddable & URL-Driven Quiz Engine*).
   - Questions live in external, human-readable **JSON schema files** with strict runtime validation.
   - Visual and graphical interactions are decoupled: the JSON specifies a semantic `visualType` and parameters, which the generic engine delegates to a **Visual Component Registry**.
   - A multi-dimensional **Filter and Carousel Selector** supports queries across courses, difficulties, topics, and notation formats, enforcing strict **Sister Question Mutual Exclusion** and **Non-Repeating Pool Traversal**.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - JSON-Driven Dynamic Question Execution (Priority: P1)

As a learner, I want quiz questions and options loaded dynamically from structured external JSON files with diverse interaction formats (single-choice, multiple-choice, interactive graphical challenges) so that I experience varied, rich learning content without hardcoded limitations.

**Why this priority**: Fundamental requirement. Separates learning content from application code and enables adding, updating, and localizing learning material without code redeployment.

**Independent Test**: Can be tested independently by loading a test JSON question bank containing single-choice, multiple-choice, and graphical visual references, starting a quiz session, and confirming that questions render faithfully according to their JSON specifications.

**Acceptance Scenarios**:

1. **Given** a JSON question bank file with questions of type `single-choice`, **When** the session loads, **Then** the question prompt, stimulus, and randomized option buttons are displayed, allowing the user to select one choice.
2. **Given** a question of type `multiple-select`, **When** presented to the user, **Then** multiple options can be toggled simultaneously with an explicit "Submit" action evaluating correctness via all-or-nothing logic (full credit only if all correct choices and zero incorrect choices are selected) and providing a diagnostic breakdown of false positives and false negatives on error.
3. **Given** a question specifying an interactive or visual stimulus (e.g., `visualType: "fretboard-diagram"` or `visualType: "chromatic-scale"`), **When** loaded, **Then** the engine retrieves the registered visual component, passing the JSON metadata to render the visual element cleanly.
4. **Given** a corrupted or schema-invalid JSON question file, **When** the framework attempts to load it, **Then** it rejects invalid entries with clear validation error diagnostics and falls back safely without crashing the UI.

---

### User Story 2 - Pedagogical Feedback Beyond Plain Text (Priority: P1)

As a student who makes a mistake on a question, I want to receive an educational explanation explaining *why* my answer was incorrect, enriched with visual aids, mnemonics, and corrective references rather than just a red text label, so that I understand the underlying concept and learn from my mistake.

**Why this priority**: Core educational mission. Memorization without understanding causes high churn. Meaningful remediation converts mistakes into lasting learning moments.

**Independent Test**: Can be tested independently by answering any question incorrectly, verifying that the feedback panel displays the theoretical explanation, highlighted error context, relevant mnemonic or rule-of-thumb, and any associated visual explanation component.

**Acceptance Scenarios**:

1. **Given** a user answers a question incorrectly, **When** feedback is triggered, **Then** the interface displays a dedicated remediation panel containing:
   - A theoretical explanation of the underlying principle.
   - The specific reason why the selected answer was incorrect.
   - A mnemonic trick or memory aid where configured.
2. **Given** a question configured with an explanatory visual cue (e.g. highlighted scale step, corrected chord diagram, or interval map), **When** the user fails or reviews the answer, **Then** the visual component renders the correct state alongside the textual explanation.
3. **Given** a multi-language setup (English/Spanish), **When** feedback is displayed, **Then** all explanations, hints, and mnemonic tips are localized in the active language.

---

### User Story 3 - Multi-Dimensional Dynamic Filtering & Course Ranges (Priority: P2)

As a student or instructor, I want to configure custom practice sessions targeting specific criteria (e.g. "Questions from courses 1 to 5 of any difficulty", or "Intermediate chords only"), so that practice adapts dynamically to my current level and syllabus.

**Why this priority**: Enables syllabus-based progression and ad-hoc practice without forcing a rigid, hardcoded menu hierarchy.

**Independent Test**: Can be tested independently by passing a query filter (e.g. `courses=1,2,3,4,5` and `difficulty=any`), verifying that the session carrousel draws exclusively from questions satisfying all criteria.

**Acceptance Scenarios**:

1. **Given** a question pool spanning courses 1 through 10, **When** the user requests questions for courses 1 to 5, **Then** only questions tagged with course numbers between 1 and 5 are included in the candidate pool.
2. **Given** a multi-tag filter (e.g. `topics=notes,intervals` and `difficulty=beginner`), **When** applied, **Then** only questions matching the specified tag intersections are queued.
3. **Given** a filter criteria that matches zero questions, **When** initiated, **Then** the engine displays a friendly empty-state notice with recommendations to broaden the filter, preventing broken session states.

---

### User Story 4 - Carousel Non-Repetition & Sister Question Exclusion (Priority: P2)

As a learner practicing in a session, I want questions to never repeat within the same session, and I want related "sister questions" (e.g., asking A → La versus La → A, or the same question posed in Solfège versus Anglo-Saxon letters) to be mutually excluded so that I never get redundant variants in a single sitting.

**Why this priority**: Repetitive or near-duplicate questions during a single study session reduce user engagement and artificially inflate mastery scores.

**Independent Test**: Can be tested independently by creating questions associated with one or more family identifiers (`familyIds`), running a session, and asserting that once a question is selected for the carousel, all questions that share ANY of its associated family IDs are excluded from that session.

**Acceptance Scenarios**:

1. **Given** an active session, **When** questions are presented sequentially, **Then** no question ID already presented in that session is served again.
2. **Given** a question belonging to multiple families (e.g. `familyIds: ["family-c-translation", "family-natural-c"]`), **When** this question is served in a session, **Then** all other questions sharing *either* `"family-c-translation"` or `"family-natural-c"` are automatically excluded from the remaining candidate pool for that session.
3. **Given** sister questions representing the same concept in Letter notation versus Solfège notation linked via a notation family, **When** a session requests a mixed notation format, **Then** the engine may pick either representation, but guarantees the alternate representation is omitted from the session.

---

### User Story 5 - Notation Segregation & Balanced Mixing (Priority: P3)

As a teacher or student, I want to explicitly select whether to practice questions in Anglo-Saxon letter notation, traditional Solfège notation, or an alternating balanced mix, so that I can focus on one system or challenge myself with both.

**Why this priority**: Direct user request. Musicians often need isolated practice in one convention before integrating both.

**Independent Test**: Can be tested independently by applying a notation filter (`notation=letters` or `notation=solfege`), verifying that all served questions strictly adhere to that notation system.

**Acceptance Scenarios**:

1. **Given** the filter `notation=letters`, **When** the carousel builds the session pool, **Then** only questions marked with notation format `letters` (or dual/neutral) are included.
2. **Given** the filter `notation=solfege`, **When** the carousel builds the session pool, **Then** only questions marked with notation format `solfege` (or dual/neutral) are included.
3. **Given** the filter `notation=mixed` (or unspecified), **When** questions are drawn, **Then** both formats can appear while sister exclusion ensures no conceptual overlap.

---

### User Story 6 - Migration of Existing Trainer Apps to JSON-Driven Engine (Priority: P2)

As a maintainer and learner, I want `basic-note-trainer` and `basic-chord-trainer` to leverage the centralized JSON quiz framework without breaking their current URLs or user experience, so that all learning apps in the platform share a consistent, maintainable educational engine.

**Why this priority**: Eliminates technical debt, validates the framework against real production tools, and fulfills the constitution requirement for decoupled, domain-agnostic learning systems.

**Independent Test**: Can be tested independently by running automated test suites for both `basic-note-trainer` and `basic-chord-trainer` against migrated JSON datasets, asserting 100% parity of existing question types and interaction modes.

**Acceptance Scenarios**:

1. **Given** the `basic-note-trainer` application, **When** a user launches it, **Then** all flashcard questions, mnemonics, and explanations load from external JSON files while preserving identical UI, in-place retry behavior, and query parameter compatibility.
2. **Given** the `basic-chord-trainer` application, **When** practicing "Identify" or "Draw" modes, **Then** chord definitions and challenges are loaded from external JSON catalogs, delegating to the framework's visual fretboard adapter while maintaining existing routes.
3. **Given** the implementation plans for specs `002-basic-note-trainer` and `003-basic-chord-trainer`, **When** inspected, **Then** both plans formally reference this framework specification and document the migration path.

---

### Edge Cases

- **Small Filter Pool Exhaustion**: What happens when a user specifies a very narrow filter (e.g. course 1, advanced, solfège only) containing fewer questions than the session length? The session terminates gracefully after all eligible non-sister questions have been answered, presenting the completion scorecard rather than crashing or repeating.
- **Malformed JSON or Missing Fields**: What happens when a question file is missing required fields (e.g. missing `correctAnswer` or `explanation`)? The schema validator logs an error at startup/load time, skips the invalid item, and ensures the rest of the pool remains operational.
- **Sister Conflict in Fixed Pools**: What happens if all available questions in a small category belong to the same sister group? The engine selects exactly one question from that family and completes the pool without violating the mutual exclusion invariant.
- **Embedded Webview Viewport Constraints**: How does the visual rendering respond on constrained mobile screens (320px width) or webviews without overflowing? Components use mobile-first responsive design, safe touch targets (min 44x44px), and collapsible or inline remediation cards without requiring platform headers or footers.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST load question banks exclusively from external modular JSON pack files organized by courses and topics, indexed by a lightweight manifest (`manifest.json`); no question data or option lists may be hardcoded in application logic.
- **FR-002**: Question schemas MUST be validated at runtime and build time using strict typed validation (e.g., Zod), rejecting invalid structures with descriptive diagnostics.
- **FR-003**: System MUST support multiple question interaction types, including at least:
  - `single-choice`: Multiple-choice with exactly one correct option.
  - `multiple-choice`: Multiple selections allowed with all-or-nothing evaluation (awarding hit only when all correct and zero incorrect choices are submitted) and diagnostic error breakdowns flagging false positives and false negatives.
  - `interactive-visual`: Stimulus or response mediated by an interactive graphical component (e.g. fretboard, scale map).
- **FR-004**: The JSON schema MUST NOT contain graphic code or canvas/SVG drawing instructions; it MUST specify semantic visual descriptors (e.g., `visualType`, `visualProps`) referenced by a decoupled registry.
- **FR-005**: The framework MUST provide a Decoupled Visual Component Registry allowing applications to register domain-specific visual components (such as fretboards, keyboards, or scale charts) that the generic quiz runner renders dynamically.
- **FR-006**: Visual components and explanation cards MUST be generic and reusable across different subject domains and applications.
- **FR-007**: Every question MUST provide rich pedagogical feedback for incorrect answers, including:
  - A conceptual explanation of the correct answer.
  - An explanation of why the mistake occurred (where applicable).
  - An optional mnemonic trick / rule of thumb.
  - An optional visual explanation reference.
- **FR-008**: System MUST support multi-dimensional question tagging and classification, including:
  - `course`: Numeric or alphanumeric course identifier (e.g., `1`, `2`, `3`...).
  - `difficulty`: Categorical level (`beginner`, `intermediate`, `advanced`).
  - `topics`: Array of topic tags (e.g., `["notes", "fretboard", "open-strings"]`).
  - `notation`: Notation classification (`letters`, `solfege`, `dual`, `none`).
  - `familyIds`: Optional array of string identifiers linking the question to multiple sister families.
- **FR-009**: System MUST support dynamic filtering queries capable of combining criteria, such as range queries on courses (e.g., `courses: [1, 2, 3, 4, 5]`), difficulty matching, topic filtering, and notation style selection.
- **FR-010**: The carousel manager MUST ensure questions never repeat within a single study session.
- **FR-011**: The carousel manager MUST enforce Sister Question Mutual Exclusion across multiple families: questions can belong to one or more families (`familyIds`); once a question is served in a session, all other questions sharing *any* of its `familyIds` MUST be excluded from that session.
- **FR-012**: System MUST allow authoring duplicate or variant questions under distinct categories or notation formats (e.g. Anglo-Saxon letters vs European Solfège) tied together via `familyIds` to prevent simultaneous appearance across multiple conceptual relationships.
- **FR-013**: System MUST support English (`en`) as the canonical default language, with full localization support for Spanish (`es`) across all prompts, options, explanations, and mnemonics.
- **FR-014**: The framework MUST be fully decoupled from guitar-specific terminology in its core engine, adhering to Constitution Principle VII (*Domain-Agnostic, Embeddable & URL-Driven Quiz Engine*).
- **FR-015**: System MUST allow configuring sessions declaratively via URL query parameters (e.g. `?courses=1-5&difficulty=beginner&notation=letters&embed=true`).
- **FR-016**: The engine MUST support embeddable webview operation (`embed=true`), suppressing global navigation elements and operating within constrained viewport heights.
- **FR-017**: System MUST provide a PostMessage bridge emitting standard session events (`QUIZ_ANSWER`, `QUIZ_PROGRESS`, `QUIZ_COMPLETE`) for integration with parent webviews and native containers.

---

- **FR-018**: System MUST provide a dedicated migration strategy and actionable task stream to migrate the two existing applications (`basic-note-trainer` and `basic-chord-trainer`) to the new JSON-driven framework, extracting their hardcoded questions into structured JSON datasets and adapting their session runners without breaking their existing public routes or user interfaces.
- **FR-019**: System MUST update the implementation plans of each corresponding feature specification (`002-basic-note-trainer` and `003-basic-chord-trainer`) to formally document and reference that a migration following this framework specification is applied.
- **FR-020**: System MUST provide a gamified, continuous session model designed for quick casual play (e.g., 20-30 second bursts while waiting, or sustained continuous practice): questions are drawn in a randomized, non-repeating stream limited in length only by the total number of eligible questions in the active filter pool or when the user exits.
- **FR-021**: The learning and remediation loop MUST happen immediately in-place upon error; no post-session review queue or deferred retry buffer is queued.

---

### Key Entities *(data models)*

- **`Question`**: Represents an individual quiz question.
  - `id`: Unique string identifier.
  - `familyIds`: Optional array of strings linking the question to one or more sister families.
  - `type`: Interaction type (`single-choice` | `multiple-choice` | `interactive-visual`).
  - `course`: Numeric or string course indicator (e.g. 1..10).
  - `difficulty`: Level (`beginner` | `intermediate` | `advanced`).
  - `topics`: Array of string keywords for filtering.
  - `notation`: Notation classification (`letters` | `solfege` | `dual` | `neutral`).
  - `prompt`: Localized prompt text or title (`en` and `es`).
  - `subPrompt`: Optional subtitle or secondary instruction.
  - `stimulus`: Optional visual or text stimulus descriptor (`visualType`, `visualProps`).
  - `options`: Array of selectable choices with identifiers and localized labels.
  - `correctAnswer`: Single identifier or array of identifiers for correct choice(s).
  - `remediation`: Educational feedback object containing `explanation`, `hint`, `mnemonic`, and optional `visualExplanation`.
- **`QuestionFamily`**: Logical grouping entity representing a set of mutually exclusive sister questions.
  - `familyId`: Unique identifier.
  - `members`: List of question IDs belonging to this family.
  - `exclusionRule`: Rule defining that selecting any member question causes all its associated `familyIds` to be marked excluded, omitting any candidate sharing at least one common family.
- **`QuestionFilter`**: Query criteria used to construct candidate question pools.
  - `courses`: Array of allowed course identifiers or range.
  - `difficulty`: Single difficulty or array of allowed difficulties.
  - `topics`: Array of required or optional topic tags.
  - `notation`: Desired notation filter (`letters` | `solfege` | `any`).
- **`QuizSession`**: Active state machine managing the question carousel.
  - `filter`: Active `QuestionFilter`.
  - `activePool`: Ordered or randomized array of non-repeating eligible questions.
  - `excludedFamilyIds`: Set of `familyId` values already triggered by previously served questions in the session.
  - `currentIndex`: Index of current active question.
  - `stats`: Live metrics (`hits`, `misses`, `streak`, `accuracy`, `completedCount`).
  - `status`: Lifecycle status (`IDLE` | `ANSWERING` | `EVALUATED` | `COMPLETED`).
- **`VisualComponentRegistry`**: Decoupled registry mapping semantic string keys (`visualType`) to React components capable of rendering stimuli or interactive response areas.
- **`QuestionPackManifest`**: Catalog index (`manifest.json`) registering all available pack files.
  - `version`: Manifest schema version.
  - `packs`: Array of pack descriptor entries, each containing `packId`, `filePath`, `courseId`, `topics`, `questionCount`, and `supportedNotations`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of quiz questions and pedagogical explanations are loaded from external JSON files; zero question text or options remain hardcoded in core application code.
- **SC-002**: Question validation detects 100% of malformed or invalid JSON questions during compilation/test time before runtime deployment.
- **SC-003**: During a session of any length, 0% of answered questions or questions sharing any `familyIds` with previously served questions (multi-family sister questions) are repeated.
- **SC-004**: Users filtering by dynamic criteria (e.g., courses 1-5, beginner difficulty) receive a valid matching pool within 50ms without UI freezing.
- **SC-005**: 100% of incorrect answers present educational remediation containing both theoretical explanation and practical memory advice.
- **SC-006**: Quiz runner and visual components operate seamlessly on viewports as small as 320px width without horizontal overflow or broken layout.
- **SC-007**: When rendered in embed mode (`embed=true`), widget operates without requiring platform shell headers or footers and delivers all events via PostMessage bridge.

---

## Assumptions

- **JSON Storage Location**: Quiz JSON datasets will be organized in structured subdirectories within the repository (e.g., `src/content/quizzes/` or `content/quizzes/`), pre-bundled or loaded through Next.js server/static asset handlers for maximum performance and zero external database latency during v1.
- **Zero-Mock UI Guest Persistence**: User performance statistics and session preferences will persist locally via `localStorage` using the platform's typed storage conventions, fully prepared with owner identifiers (`ownerId: null`) for future cloud synchronization.
- **Zod Schema Validation**: Data schemas will be authored and enforced using Zod to ensure type-safe inference in TypeScript alongside runtime validation.
- **Component Extensibility**: Existing domain visualizers (`FretboardDiagram`, `ChromaticScaleVisualizer`) can be registered into the framework's visual registry without rewriting their internal rendering logic.
