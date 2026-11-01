# Feature Specification: Basic Note Trainer

**Feature Branch**: `002-basic-note-trainer`

**Created**: 2026-11-01

**Status**: Draft

**Input**: User description: "Quiero aprender de manera interactiva a traducir las notas basadas en letras a notas europeas (no se como se llaman, pero eso se debe hacer aquí). Además, de saber que nota tiene bemol o sostenido (Vamos, la secuencia de notas). Para ello, quiero que se haga en un formato interactivo, con aciertos / fallos, basado en tarjetas. Si se acierta tras un fallo, se debe explicar el por qué esa forma, algúna pista, truco nemotécncio o algo didáctico para recordar el cambio, etc. Esto debe ser una nueva app del proyecto. Iniciación a las notas musicales. La configuración de que se debe abrir debe ser configurable mediante query params (dificultad, o algo así). El diseño debe ser simple, posiblemente se va a embedir en otra app como web-view"

## Clarifications

### Session 2026-11-01

- Q: How should the card interaction flow behave when a user selects an incorrect answer? → A: Option A (In-place retry with reveal on success: wrong choices are disabled in red, and when the user taps the correct answer, the system reveals the full pedagogical explanation and mnemonic trick with a "Next Card" button to proceed).
- Q: Should the practice session run in fixed-length rounds with a summary score screen, or as an endless continuous practice stream? → A: Option B (Endless continuous practice stream: the session flows continuously without artificial round boundaries, controlled externally by the host app, displaying persistent live progress metrics: Okeys vs Failures, current streak, and accuracy %).
- Q: How should multi-language configuration behave across the application and in embed mode? → A: Language is configurable globally via UI toggle (EN/ES) and via URL query parameter (`?lang=es` or `?lang=en`). In embed mode, the UI language toggle is suppressed, and language is controlled by query parameter or parent application default. All questions, mnemonics, pedagogical explanations, and options are localized.
- Q: How should the embed view avoid vertical overflowing and scrolling when pedagogical explanations are revealed? → A: Ultra-compact mode (`compact=true`, default in embed mode). In this mode, upon error recovery, the explanation and mnemonic replace the 4 options *inside the primary flashcard container* alongside a prominent "Next Card" button, keeping the entire widget height <= 410px. Dedicated route `/basic-note-trainer/embed` is also provided.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Interactive Flashcards for Note Name Translation (Priority: P1)

As a beginner music student, I want an interactive flashcard card to translate between Anglo-Saxon letter notation (A, B, C, D, E, F, G) and European/Latin Solfège notation (Do, Re, Mi, Fa, Sol, La, Si) in both directions, receiving instant feedback on hits and misses, so that I can fluently read chords, tabs, and sheet music.

**Why this priority**: Core value of the feature. Beginners frequently encounter Anglo-Saxon letters in modern guitar charts and struggle to correlate them with traditional Solfège names.

**Independent Test**: Can be tested independently by launching the app, seeing a card displaying a note (e.g., "What is the European note for 'C'?" or "What letter corresponds to 'Sol'?"), selecting an option from multiple-choice answer buttons, and observing the hit/miss counter increment immediately with clear visual feedback.

**Acceptance Scenarios**:

1. **Given** the note translation mode is active, **When** a flashcard appears asking to translate a Letter to European Solfège (e.g., "A"), **Then** the card displays 4 distinct choices, with "La" being the correct answer.
2. **Given** a flashcard asking to translate European Solfège to Letter (e.g., "Mi"), **When** the user taps "E" on the first attempt, **Then** the system registers a hit (acierto), provides immediate positive feedback, and transitions cleanly to the next card.
3. **Given** an active session, **When** the user selects an incorrect answer, **Then** the system increments the miss counter (fallo), resets any active streak, marks the selected button in red error state, provides a subtle hint, and keeps other choices available for in-place re-attempts.
4. **Given** the user answers questions consecutively, **When** results are tallied, **Then** the interface continuously displays current streak, total hits, and total misses for the active session.

---

### User Story 2 - Chromatic Sequence & Accidentals Trainer (Priority: P1)

As an aspiring guitarist, I want to practice identifying which musical notes have sharps (#) or flats (b) versus which notes form natural semitones without accidentals (B-C and E-F), so that I understand the chromatic sequence across the fretboard and piano.

**Why this priority**: Fundamental music theory milestone. Beginners must understand that notes like B-C and E-F have no natural sharp/flat in between, which is essential for fret navigation.

**Independent Test**: Can be tested independently by selecting the "Accidentals & Sequence" mode, viewing questions focused on note order and accidental existence (e.g., "Does E have an E# in the natural scale?", "Which note is a half-step above B?"), choosing the answer, and verifying correct evaluation.

**Acceptance Scenarios**:

1. **Given** the sequence & accidentals mode, **When** a card asks "Which pair of natural notes has NO sharp or flat between them?", **Then** options are presented including "B - C" (or "E - F"), and selecting it marks a hit.
2. **Given** a card asking "What is the note one half-step above C?", **When** the user selects "C# / Db", **Then** the system accepts the answer as correct and explains the enharmonic relation.
3. **Given** a question regarding whether "B#" exists in standard natural diatonic scale, **When** the user answers correctly, **Then** the system confirms that the natural half-step lands directly on C.

---

### User Story 3 - Pedagogical Explanations, Mnemonics & Error Recovery (Priority: P2)

As a learner who made a mistake on a card, I want to see a clear pedagogical explanation and a memorable mnemonic trick (e.g., "Big Cats Eat Fish" for B-C/E-F, or "A is La: the 440Hz tuning fork pitch") after missing or when retrying the card, so that I retain the concept long-term rather than just guessing.

**Why this priority**: Educational effectiveness. Pure repetition without understanding leads to frustrating trial-and-error; mnemonics and music theory context accelerate retention.

**Independent Test**: Can be tested by deliberately choosing a wrong answer on a card, observing the immediate educational card expansion revealing the mnemonic trick and theoretical explanation, retrying or acknowledging the card, and confirming understanding.

**Acceptance Scenarios**:

1. **Given** a card with one or more prior misses, **When** the user taps the correct answer, **Then** the system highlights the correct button in green, reveals the full pedagogical explanation and mnemonic memory trick, and displays a prominent "Next Card" button to proceed.
2. **Given** an explanation banner is displayed following a recovered error, **When** the user clicks "Next Card" or hits Enter, **Then** the card advances and marks that specific note concept for spaced reinforcement later in the session.
3. **Given** a card focusing on semitones (B-C and E-F), **When** explained, **Then** the system displays the mnemonic "No sharp between B & C and E & F — think: Big Cats Eat Fish (or Si-Do, Mi-Fa)".

---

### User Story 4 - URL Query Parameter Configuration & Ultra-Compact Web-View Embed Mode (Priority: P2)

As a developer or host application embedding this tool inside another app or web-view, I want to configure the trainer via URL query parameters (specifying difficulty, training mode, language, and an embed mode that suppresses extra headers/navigation) or a direct embed route (`/basic-note-trainer/embed`), and have the layout fit compactly without vertical scrolling, so that the tool seamlessly integrates as a lightweight mini-app without unnecessary chrome or overflow.

**Why this priority**: Architectural versatility. The tool must function both as a standalone app within Guitar Companion and as an embeddable widget for external web-views.

**Independent Test**: Can be tested by loading the application URL with query parameters such as `?mode=accidentals&difficulty=beginner&embed=true&lang=es` or navigating to `/basic-note-trainer/embed?lang=es`, verifying that navigation chrome is hidden, the UI language selector is hidden, the card view stays <= 410px height without vertical scrollbars even after revealing error explanations, and the session begins directly in the specified configuration.

**Acceptance Scenarios**:

1. **Given** a URL with `?embed=true` or route `/basic-note-trainer/embed`, **When** the page renders, **Then** the global site header, navigation bar, UI language toggle, and footer are suppressed, displaying only the minimalist card training interface.
2. **Given** embed mode is active and a card is recovered after an error, **When** the pedagogical explanation is revealed, **Then** the explanation and "Next Card" button transition in-place inside the flashcard area (instead of stacking a secondary card below), maintaining total widget height <= 410px and avoiding iframe vertical scrolling.
3. **Given** a URL with `?mode=translation`, **When** the page loads, **Then** the trainer starts immediately in the Note Name Translation exercise without requiring mode selection.
4. **Given** a URL with `?mode=accidentals`, **When** the page loads, **Then** the trainer starts in the Chromatic Sequence & Accidentals exercise.
5. **Given** a URL with `?difficulty=beginner`, **When** the page loads, **Then** questions are filtered to fundamental natural notes and basic concepts; `?difficulty=advanced` includes mixed accidentals and faster pace.
6. **Given** no query parameters or invalid parameter values, **When** the page loads, **Then** sensible defaults apply gracefully (standalone mode, standard difficulty, mode selector visible).

---

### User Story 5 - Global Multi-Language Configuration (English & Spanish) (Priority: P2)

As a Spanish-speaking guitarist or music learner, I want to switch the application language to Spanish across the entire platform, including all question prompts, visual hints, theoretical explanations, mnemonic memory tricks, and UI metrics, so that I can learn music theory effectively in my native language.

**Why this priority**: International accessibility. Music theory terms (especially European Solfège) are foundational in Spanish-speaking cultures; learning mnemonics in one's primary language accelerates cognitive retention.

**Independent Test**: Can be tested by toggling the language to Spanish (`ES`) in the header or visiting `?lang=es`, answering a translation question, and observing Spanish question text (e.g., "¿Qué nota europea corresponde a 'B'?"), Spanish options ("Sí" / "No" for accidentals), Spanish metric labels ("Aciertos", "Fallos", "Racha", "Precisión"), and Spanish mnemonics (*"Si-Do y Mi-Fa"*).

**Acceptance Scenarios**:

1. **Given** the application in standalone mode, **When** the user clicks the `ES` language button in the navigation bar, **Then** the interface instantly switches all labels, headers, and active flashcards to Spanish, and the choice is persisted to browser `localStorage`.
2. **Given** a URL with `?lang=es`, **When** loaded, **Then** the application initializes in Spanish, overriding any previous preference.
3. **Given** Spanish is selected, **When** an error recovery occurs on an accidental or semitone card, **Then** the pedagogical tip and mnemonic are displayed fully in Spanish (e.g., *"Si-Do y Mi-Fa: Las dos únicas parejas naturales SIN sostenido entre medias"*).
4. **Given** Spanish is selected, **When** an accidental existence question appears, **Then** the answer choices are localized to Spanish (`Sí`, `No`, etc.).

---

### Edge Cases

- **Invalid or Unknown Query Parameters**: If a user or host application provides invalid values (e.g., `?mode=unknown&difficulty=999`), the app gracefully falls back to default settings without crashing or blank screen.
- **Embedded Web-View Resizing and Small Screens**: If loaded inside an embedded web-view with narrow dimensions (e.g., 320px width on low-end mobile devices), the card layout, text, and answer buttons adjust proportionally with zero horizontal overflow and comfortable touch targets (minimum 44x44px).
- **Rapid Button Spamming**: If a user rapidly taps multiple answer buttons simultaneously, the system only registers the initial interaction per card, avoiding double-counting hits/misses or corrupting session statistics.
- **Enharmonic Representation**: When testing accidentals (e.g., C# vs Db), the interface clearly displays both equivalent forms where appropriate to prevent confusion for beginners.
- **Session Reset and Local Storage Recovery**: If the user refreshes the page or reopens the web-view, the best score and historical stats are retained in browser local storage, while offering an explicit option to restart the active session.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an autonomous application route for the basic note trainer (`basic-note-trainer`) within the multi-app ecosystem, adhering to Constitution Principle I.
- **FR-002**: System MUST implement an interactive multiple-choice flashcard interface (at least 4 touch-friendly options) featuring in-place retries: selecting an incorrect choice marks it as a miss (incrementing fallos count and resetting streak), disables that option with red error styling, and keeps remaining choices active for immediate re-attempt.
- **FR-003**: System MUST support bidirectional translation between Anglo-Saxon letter notation (A, B, C, D, E, F, G) and European/Latin Solfège notation (Do, Re, Mi, Fa, Sol, La, Si).
- **FR-004**: System MUST support chromatic sequence and accidental training, testing the identification of sharps (#), flats (b), and the natural semitones (B-C and E-F) that lack intermediate accidentals.
- **FR-005**: System MUST operate as an endless continuous practice stream without artificial round breaks or pagination, controlled by the external host, featuring a persistent live progress bar displaying hits ("Okeys"), misses ("Failures"), active streak, and overall accuracy percentage.
- **FR-006**: System MUST display the full pedagogical explanation and mnemonic memory trick when the user hits the correct answer following one or more failed attempts on that card, requiring an explicit user action ("Next Card" button or Enter key) to advance to the next card.
- **FR-007**: System MUST parse and apply URL query parameters on initial load:
  - `mode`: `translation` (letter-to-solfege and vice-versa), `accidentals` (sharps/flats and sequence), or `mixed` (all topics).
  - `direction`: `letters-to-solfege`, `solfege-to-letters`, or `both`.
  - `difficulty`: `beginner` (natural notes, core semitones), `intermediate` (single accidentals included), or `advanced` (enharmonics and reverse sequence).
  - `embed`: `true` (renders minimalist embed view without host site headers, navigation, language toggle, or footers) or `false` (standard layout).
  - `lang`: `en` (English default) or `es` (Spanish).
  - `compact`: `true` (enforces single-card footprint <= 410px) or `false` (defaults to `true` when embed is enabled).
- **FR-008**: System MUST render an embeddable minimal layout mode when `embed=true` is present or route `/basic-note-trainer/embed` is loaded, optimizing layout dimensions for parent iframe and mobile web-view containers, while keeping the live progress indicators (Okeys vs Failures) always visible.
- **FR-009**: System MUST support English (`en`) and Spanish (`es`) as primary platform languages, with English active by default and Spanish readily selectable via UI or URL parameters.
- **FR-010**: System MUST operate fully in Guest Mode without simulated login or mock avatars (Constitution Principle IV), persisting session records, personal bests, and selected language in client-side local storage.
- **FR-011**: System MUST provide comprehensive SEO metadata, dynamic document title, description, and structured data for public indexing when accessed outside embed mode (Constitution Principle II).
- **FR-012**: System MUST ensure all interactive buttons meet touch target accessibility standards (minimum 44x44px bounding box) and work seamlessly down to 320px viewport width (Constitution Principle III).
- **FR-013**: System MUST provide comprehensive translation for all music theory explanations, mnemonic tips, question prompts, subprompts, distractor options (such as "Sí"/"No"), and retry hints in both English and Spanish.
- **FR-014**: System MUST synchronize language configuration bi-directionally: URL query parameter `lang` takes immediate precedence on initial page load, and subsequent UI language toggle selections update client context and persist to local storage.
- **FR-015**: In embed mode (`embed=true` or `/basic-note-trainer/embed`), the system MUST suppress the UI language selector and platform chrome, rendering strictly the exercise configured via query parameters or inherited defaults.
- **FR-016**: System MUST provide a compact mode (`compact=true`) that caps the entire widget vertical height to <= 410px by transitioning pedagogical explanations in-place within the primary card footprint and utilizing a slimline progress bar.
- **FR-017**: System MUST support Dual Navigation Architecture in standalone mode: desktop viewports (>= 768px) display top navbar links in the header, while phone/mobile viewports (< 768px) hide top navbar links to eliminate horizontal overflow and instead provide an ergonomic fixed bottom navigation bar (PlatformBottomNav) with touch targets >= 44x44px. In embed mode, both header and bottom navigation bars MUST be completely suppressed.

### Key Entities

- **FlashcardItem**:
  - `id`: Unique identifier for the question card.
  - `category`: Category of the card (`translation` | `accidentals` | `sequence`).
  - `prompt`: Question or prompt text (e.g., "What is the European note for 'D'?", "¿Tiene Si (B) sostenido?").
  - `subPrompt`: Optional secondary context or visual cue.
  - `noteReference`: Note or note pair involved (e.g., `D`, `E-F`, `C#`).
  - `options`: Array of selectable answer options (strings).
  - `correctAnswer`: The expected correct answer string.
  - `explanation`: Educational theory explaining the rule or musical fact.
  - `mnemonic`: Practical memory trick or rule of thumb for retention.
  - `difficulty`: Associated difficulty level (`beginner` | `intermediate` | `advanced`).

- **TrainerSessionState**:
  - `mode`: Current training mode (`translation`, `accidentals`, `mixed`).
  - `difficulty`: Active difficulty tier.
  - `hits`: Count of successful first-attempt answers.
  - `misses`: Count of incorrect attempts.
  - `currentStreak`: Consecutive correct answers in active session.
  - `bestStreak`: Highest streak achieved during the session.
  - `completedCards`: List of card IDs already presented in the current run.

- **TrainerConfig**:
  - `mode`: Selected or query-param assigned mode.
  - `difficulty`: Selected or query-param assigned difficulty.
  - `direction`: Translation direction filter.
  - `embed`: Boolean indicating if web-view embedding mode is active.
  - `compact`: Boolean indicating if ultra-compact single-card footprint is active.
  - `lang`: Active language (`en` | `es`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users receive instant visual feedback (hit/miss indication and score update) within 100 milliseconds of tapping an answer button.
- **SC-002**: 90% of beginner users who read the mnemonic tip following an incorrect answer correctly answer that same note concept on subsequent encounters within the same session.
- **SC-003**: The application loads and presents the first interactive flashcard in under 1.5 seconds on standard mobile networks (LCP < 2.5s).
- **SC-004**: 100% of defined query parameters (`mode`, `difficulty`, `direction`, `embed`, `lang`, `compact`) initialize the application directly into the requested state without requiring manual user navigation.
- **SC-005**: All interactive elements maintain touch targets of at least 44x44px and display without horizontal overflow on mobile viewports down to 320px.
- **SC-006**: When loaded with `embed=true` or via `/basic-note-trainer/embed`, the interface renders with zero navigation header/footer clutter and no UI language switcher, consuming 100% of the host iframe or web-view container cleanly.
- **SC-007**: 100% of educational content (questions, answers, hints, explanations, mnemonics) is accurately rendered in the selected language (`en` or `es`).
- **SC-008**: In embed mode, the entire exercise including error recovery explanations and "Next Card" action fits within a standard 410px height container without requiring vertical scrolling.
- **SC-009**: On mobile/phone viewports (< 768px), the top navbar maintains 0px horizontal overflow with tool links replaced by the dedicated mobile bottom navigation bar (PlatformBottomNav).

## Assumptions

- **Target Audience**: Beginner to intermediate musicians learning the correlation between Anglo-Saxon letter notation (common in guitar chords, guitar tabs, modern lead sheets) and traditional European/Latin Solfège naming, as well as the 12-semitone chromatic sequence.
- **Musical Scope**: Focuses on standard Western chromatic and diatonic music systems. Microtonal systems or double accidentals (double sharps/double flats) are excluded from the initial version.
- **Interaction Model**: Card-based multiple-choice selection (4 buttons) provides the fastest, most ergonomic mobile experience compared to on-screen keyboard text input.
- **Persistence**: Anonymous guest mode uses browser `localStorage` to save user stats and streaks without requiring user accounts or authentication.
- **Scope Boundary with Fretboard Trainer**: This application focuses strictly on foundational musical note theory, letter-to-Solfège notation translation, and abstract chromatic semitone relationships. Fretboard-specific fret navigation, string-by-string diagrams, and guitar neck visualization are explicitly out of scope for this app and reserved for a dedicated future fretboard trainer application.
- **Web-View Compatibility & Host Communication**: The embeddable view works reliably across standard web-view engines (Android System WebView, iOS WKWebView, modern desktop iframes) without requiring proprietary native bridge APIs. When embedded, the UI displays persistent on-screen progress (Okeys vs Failures) and dispatches standard `window.postMessage` events (`NOTE_TRAINER_ANSWER`, `NOTE_TRAINER_PROGRESS`) to enable host applications to track progress programmatically.
