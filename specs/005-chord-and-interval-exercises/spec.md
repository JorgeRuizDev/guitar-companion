# Feature Specification: Chord Notes Drag-and-Drop & Musical Interval Exercises

**Feature Branch**: `005-chord-and-interval-exercises`

**Created**: 2026-11-17

**Status**: Ready for Planning

**Input**: User description: "quiero incluir un nuevo ejercicio / variante, en la que dado el dibujo de un acorde, debo arrastrar unas bolas con las letras de cada nota que lo conforma. Las bolas / letras deben estar en la parte alta del dibujo para que no se metan debajo del overflow. De momento, está limitado a acordes mayores y menores abiertos, pero ten en cuenta que en un futuro estarán también los que tienen cejilla! Luego, no quiero que en el ejercicio de completar un acorde muestre la cuerda con la nota mayor, es una pista. Por último, en el ejercicio sobre las notas quiero que se incluyan preguntas para ejercitar si se que nota es una tercera o una quita, o cuál es la tercera o quinta o séptima o lo que sea de una nota. Esto tanto para letras como para solfeo (como siempre, reflejarlo en la constitución si no está)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Interactive Chord Notes Identification & Holistic Configuration (Priority: P1)

As a guitar learner,
I want to identify all the constituent notes of a chord on its sounding strings by placing note letter tokens immediately onto fret positions or open nut positions, and validating my complete configuration at the end upon submission,
So that I develop a holistic understanding of chord construction and harmonic spelling rather than guessing note-by-note through instant trial-and-error feedback.

**Why this priority**: Core new learning interaction. Instant rejection on single-note attempts allows trial-and-error brute forcing, which degrades true musical retention ("Si fallas una nota no aprendes del todo"). Validating the entire chord voicing on final submission compels the learner to reason through the full chord and learn from errors upon holistic evaluation.

**Independent Test**: Can be tested independently by presenting an open chord diagram (e.g., C major), viewing the pool of notes in the upper area with 2 distractor notes, dragging/tapping note balls onto all sounding strings (finger dots and open nut markers) without immediate rejection, submitting the completed configuration with "Comprobar", observing targeted error feedback on mistake strings or full harmonic analysis (Roots, 3rds, 5ths) upon successful submission.

**Acceptance Scenarios**:

1. **Given** a chord diagram displayed for an open major or minor chord, **When** the challenge starts, **Then** a bank of note balls is displayed strictly in the upper area above the diagram (containing the chord's unique notes plus 2 distractor notes not in the chord) ensuring no elements get hidden beneath container overflow.
2. **Given** the note balls displayed in the top area, **When** the user drags or taps any note token onto a finger dot or open nut position on the diagram, **Then** the note is placed immediately onto that string without premature validation or rejection, and the token remains available in the pool to cover octave duplicates (e.g., C on strings 5 and 2).
3. **Given** an active attempt with assigned notes, **When** the user wishes to adjust their configuration, **Then** they can overwrite a note by assigning a new token or remove an assigned note by tapping it directly.
4. **Given** all sounding strings have assigned notes, **When** the user presses "Comprobar" / "Validar" (Submit configuration), **Then** the system validates all string assignments simultaneously against the chord's true sounding notes.
5. **Given** a submitted configuration containing one or more erroneous notes (wrong pitch or distractor), **When** validation executes, **Then** the system highlights the incorrect strings in red, keeps the user's placed notes visible, provides clear pedagogical feedback ("Algunas notas no son correctas"), and allows the user to correct the erroneous strings and resubmit.
6. **Given** all sounding strings are correctly identified, **When** the configuration is submitted and verified, **Then** the exercise is completed and the diagram reveals the full harmonic structure, clearly annotating which positions are the roots (tónicas), thirds (3ª), and fifths (5ª) for educational enrichment.
7. **Given** the underlying chord architecture, **When** future barre chords (cejilla) are introduced, **Then** the exercise logic seamlessly supports them using the same token matching mechanics without structural refactoring.

---

### User Story 2 - Removal of Root Note Spoiler in Chord Completion Practice (Priority: P2)

As a guitar learner practicing chord shapes in the chord completion exercise,
I want the fretboard diagram to hide the root string badge ("R" indicator) while I am figuring out the fingering, and show it only upon submission or correction,
So that I am not given an accidental clue/hint about which string holds the root note during the challenge.

**Why this priority**: Directly removes an unintended spoiler that reduces the educational rigor and difficulty of the existing interactive chord completion mode.

**Independent Test**: Navigate to the chord completion exercise (draw mode) and verify that the root string badge ("R") is not displayed during the active challenge attempt, but appears after pressing "Check" / evaluation.

**Acceptance Scenarios**:

1. **Given** an active chord completion challenge in progress (status pending), **When** the fretboard is rendered, **Then** the root string indicator badge ("R") is completely hidden from the user.
2. **Given** an active chord completion challenge, **When** the user submits their answer (evaluation occurs) or requests an explicit hint, **Then** the root string indicator ("R") is revealed as part of pedagogical remediation.

---

### User Story 3 - Musical Interval Training ("Intervalos") with Dual Notation (Priority: P3)

As a music student,
I want to practice interval theory ("Intervalos") through targeted questions that test interval identification (e.g., "What note is the 3rd or 5th of C?") and relative distance (e.g., "What interval is G from C?"),
So that I can master interval relationships fluently in both Anglo-Saxon letter notation (A–G) and Solfège (Do–Si) across both the Basic Note Trainer and Quiz Packs.

**Why this priority**: Strengthens core music theory competence and fulfills the newly ratified Principle VIII of the constitution for dual-notation interval training.

**Independent Test**: Launch the note trainer with interval questions (`mode=intervals`) or run the quiz intervals pack in letters mode (verifying Anglo-Saxon letters only) and solfège mode (verifying Latin Do-Si only), checking answer evaluation and distance explanations in semitones.

**Acceptance Scenarios**:

1. **Given** interval practice mode configured for Anglo-Saxon letters, **When** a question asks "What is the Perfect 5th of D?", **Then** options and answers use letter notation (e.g., A) with semitone distance remediation (7 semitones).
2. **Given** interval practice mode configured for Solfège, **When** a question asks "¿Cuál es la tercera mayor de Do?", **Then** options and answers use Solfège notation (e.g., Mi) with pedagogical explanation (4 semitonos).
3. **Given** an interval challenge asking to identify the relationship between two notes (e.g., root C and target E), **When** the user selects "Major 3rd" / "Tercera mayor", **Then** the choice is evaluated as correct with visual or textual harmonic feedback.
4. **Given** any interval question, **When** notation filtering is active (`notation=letters` or `notation=solfege`), **Then** no mixing of notation systems occurs in prompts, options, or immediate hints.
5. **Given** the educational ecosystem, **When** practicing intervals, **Then** exercises are accessible both in the rapid flashcard runner (`Basic Note Trainer` with `mode=intervals`) and as structured topic packs in the `Interactive Quiz Framework`.

---

### Edge Cases

- **Mobile Viewport Overflow**: On small 320px screens, draggable note balls must remain in the upper designated area with touch-friendly dimensions (>= 44x44px) and prevent page scroll interception during drag gestures.
- **Accessible Tap-to-Place Alternative**: If a user on a mobile or assistive device struggles with drag-and-drop gestures, tapping a note ball followed by tapping a target finger dot or nut position performs the assignment smoothly.
- **Accidentals in Intervals**: Diatonic spelling rules are strictly preserved in interval generation (e.g., the minor 3rd of C is Eb, never D#; the augmented 4th of C is F#, while the diminished 5th is Gb).
- **Distractor Selection**: Distractor notes are dynamically selected from notes outside the chord's pitch class set, ensuring there is never an ambiguous distractor that actually belongs to the chord.
- **Dropped Outside Targets**: If the user releases a note ball outside a valid drop target, it smoothly animates back to its origin pool in the top bar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a chord-notes exercise variant where a fretboard chord diagram is displayed and the learner must assign the constituent notes of the chord to their corresponding fret positions or open-string nut locations.
- **FR-002**: The draggable note balls / tokens MUST be positioned in the top area above the fretboard diagram to prevent any clipping or concealment caused by container overflow.
- **FR-003**: The note balls MUST support touch drag interactions with adequate touch targets (minimum 44x44px) and provide an accessible click/tap-to-place fallback for mobile ergonomics and assistive technologies.
- **FR-004**: System MUST limit the initial chord-notes catalog to open major and minor guitar chords (C, D, E, G, A major; Dm, Em, Am), while maintaining an extensible architecture that accommodates barre chords (cejilla) in future iterations.
- **FR-005**: The note bank in the upper area MUST display reusable tokens for the chord's unique pitch classes PLUS exactly 2 distractor notes that do not belong to the chord.
- **FR-006**: Each active sounding position on the chord diagram (fretted finger dots and open nut markers) MUST function as an interactive drop/selection target that immediately accepts and displays any assigned note token without instant rejection or validation during the layout phase.
- **FR-007**: System MUST validate the learner's note assignments holistically only upon explicit submission ("Comprobar" action). When the configuration is 100% correct, the system MUST reveal the harmonic breakdown across all active positions, clearly marking roots (tónicas), thirds (3ª), and fifths (5ª).
- **FR-008**: When an submitted chord note configuration contains errors, the system MUST visibly mark the incorrect strings (e.g. red outline/fill), display targeted pedagogical remediation ("Algunas notas no son correctas"), and allow the learner to modify incorrect positions and resubmit.
- **FR-009**: In the interactive chord completion practice (`DrawChallenge`), the system MUST suppress the root string indicator badge ("R") during the active/pending attempt so it does not act as a hint.
- **FR-010**: Following submission or evaluation of the chord completion challenge (`DrawChallenge`), the root string indicator ("R") MUST be displayed as part of the corrective feedback and diagram remediation.
- **FR-011**: System MUST support interval training questions testing both note calculation (given note X and interval N, find note Y) and interval identification (given note X and note Y, find interval N) covering 2nds, 3rds, 4ths, 5ths, 6ths, 7ths, and octaves, under the official concept name "Intervalos" / "Musical Intervals".
- **FR-012**: All interval questions MUST strictly support dual notation: Anglo-Saxon letters (A, B, C, D, E, F, G) and Latin Solfège (Do, Re, Mi, Fa, Sol, La, Si), with zero leakage between notation systems when filtering is applied.
- **FR-013**: Interval exercises MUST be available both as an active mode (`mode=intervals`) in the `Basic Note Trainer` and as dedicated topic packs in the `Interactive Quiz Framework`.
- **FR-014**: Every interval question explanation MUST include theoretical distance measured in semitones (half steps) and tone equivalents.

### Key Entities *(include if feature involves data)*

- **ChordNoteToken**: Visual and interactive representation of a musical note/pitch class, containing note identifier, Anglo-Saxon symbol, Solfège name, whether it is a distractor, and visual state (in-pool, dragging, slotted).
- **ChordHarmonicAnalysis**: Detailed pitch class breakdown of a chord definition mapping each string's sounding pitch to its interval function (Root, Major/Minor 3rd, Perfect 5th, etc.).
- **IntervalDefinition**: Harmonic interval entity defining interval name (e.g., "Major 3rd" / "Tercera mayor"), semitone distance (e.g., 4 semitones), formula abbreviation (e.g., "M3", "P5", "m7"), and bidirectional transposition logic.
- **IntervalQuestion**: Question structure encapsulating the base note, target interval, question direction (calculate note vs identify interval), prompt in English and Spanish, 4 localized options, correct answer, and semitone-based explanation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of draggable note balls in the chord-notes exercise are rendered in the upper viewport zone without being cut off by overflow on viewports down to 320px width.
- **SC-002**: Users can complete a chord note identification challenge in under 30 seconds using either drag-and-drop or tap-to-select interaction.
- **SC-003**: 0% of active chord completion attempts expose the root string indicator ("R") before answer submission, eliminating the clue.
- **SC-004**: 100% of interval practice questions adhere strictly to the active notation system (`letters` vs `solfege`) without mixed terminology.
- **SC-005**: All open major and minor chords (minimum 8 essential chords) are fully playable in the chord-notes drag exercise and extensible to barre chords without code refactoring.
- **SC-006**: Upon completing the chord-notes exercise, 100% of active sounding positions display their harmonic role (Root, 3rd, 5th) in the review view.

## Assumptions

- **Touch Fallback**: Because drag-and-drop can be awkward or prone to browser scroll collisions on mobile screens, an accessible tap-to-select (tap ball, tap target slot) fallback is supported alongside direct pointer dragging.
- **Open Chords Scope**: The initial implementation focuses on standard open chords: C Major, D Major, E Major, G Major, A Major, D Minor, E Minor, A Minor.
- **Music Theory Canon**: Intervals follow standard 12-tone equal temperament music theory with proper diatonic spelling rules (e.g., minor 3rd of C is Eb, not D#).
- **Language & Localization**: Canonical system language remains English with Spanish translation support adhering to Principle VI and Principle VIII of the constitution.
