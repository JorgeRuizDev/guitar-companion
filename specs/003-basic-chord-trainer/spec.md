# Feature Specification: Basic Chord Trainer

**Feature Branch**: `003-basic-chord-trainer`

**Created**: 2026-11-01

**Status**: Draft

**Input**: User description: "Quiero desarrollar una nueva app para aprenderme los ACORDES. Debe seguir el mismo patrón que la app de las notas, que se va a embeber en una webview, debe ser configurable en mediante query params, etc. La idea de esta App es que aparezca un acorde en letras (solfeo y el sistema de letras), y yo tenga de dibujarlo pulsando los trastes donde debo poner los dedos + cuerdas que deben sonar. También a la inversa, te sale el dibujo y tienes que escoger el nombre del acorde. en ambos casos deben usarse ambos nombres en solfeo y el letras, no debe ser indiscriminatorio. Por defecto se alterna entre ambos modos, pero existe un Query Param que te permite escoger entre seleccionar el nombre del dibujo de un acorde, o dibujar el acorde a partir de su nombre. De momento añade solo los acordes abiertos en el catálogo. Nota sobre las URL: El query param debe contener el listado de acordes a incluir (si no hay ninguno, todos por defecto). En el modo no embebible debo disponer del catálogo de acordes y de poder seleccionar una serie de acordes y generar un query param asociado para el modo embebido."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Interactive Dual-Notation Chord Training (Priority: P1)

As a guitar learner, I want an interactive trainer where chord names are always presented simultaneously in both Anglo-Saxon letter notation (e.g., C, Am, G7) and traditional Solfège notation (e.g., Do Mayor, La menor, Sol séptima), so that I effortlessly master both musical conventions without having to choose between them.

**Why this priority**: Fundamental requirement. Guitarists encounter both systems constantly in sheet music, chord charts, and community tutorials; displaying both formats simultaneously reinforces intuitive translation.

**Independent Test**: Can be tested independently by starting a training session, verifying that every chord prompt and multiple-choice answer displays both notations side-by-side (e.g., "C (Do Mayor)"), with neither notation omitted or favored over the other.

**Acceptance Scenarios**:

1. **Given** any chord presented during practice, **When** the chord name appears as a prompt or an answer option, **Then** both the Anglo-Saxon letter symbol and the Solfège name are displayed clearly together (e.g., "Am (La menor)").
2. **Given** a practice round, **When** an option is selected, **Then** visual feedback confirms the correctness referencing both naming systems.

---

### User Story 2 - "Draw the Chord" Mode (Name to Fretboard) (Priority: P1)

As a guitarist learning chord shapes, I want to see a chord name (in dual notation) and interactively draw its fingering on a fretboard diagram by tapping the frets to place finger dots and configuring which strings should ring open versus which strings must be muted, so that I build motor memory and muscle recognition of chord shapes.

**Why this priority**: Core interactive value. Constructing chord fingerings actively tests whether the learner truly knows where each finger goes and which strings are played, rather than just passively recognizing an image.

**Independent Test**: Can be tested independently by launching the trainer in "Draw" mode, viewing a chord prompt (e.g., "C (Do Mayor)"), tapping fret positions on strings and marking open/muted strings, submitting the diagram, and receiving instant hit/miss evaluation with clear corrective guidance.

**Acceptance Scenarios**:

1. **Given** a chord drawing challenge (e.g., "C (Do Mayor)"), **When** the user taps the fretboard, **Then** finger dots are placed at the tapped string and fret positions (e.g., 2nd string 1st fret, 4th string 2nd fret, 5th string 3rd fret).
2. **Given** open and muted strings for the chord, **When** the user interacts with string status markers above the nut, **Then** the user can designate strings as sounding Open (O) or Muted (X).
3. **Given** the drawn configuration matches the target chord shape, **When** the answer is verified via [NEEDS CLARIFICATION: submission trigger], **Then** the system marks the attempt as a hit (acierto), provides immediate positive confirmation, and advances to the next challenge.
4. **Given** the drawn configuration is missing a finger, has incorrect fret positions, or misconfigures open/muted strings, **When** verified, **Then** the system marks a miss (fallo), highlights the discrepancies, reveals the correct finger positions and string states, and offers an opportunity to retry or review.

---

### User Story 3 - "Identify the Chord" Mode (Diagram to Name) (Priority: P1)

As a guitarist reading sheet music or chord diagrams, I want to see a complete chord fingering diagram (showing finger positions and open/muted string indicators) and choose the matching chord name from multiple-choice options (all displaying dual notation), so that I can instantly identify chords at a glance.

**Why this priority**: Core reading skill. Musician fluency requires rapid visual recognition of standard chord charts.

**Independent Test**: Can be tested independently by launching the trainer in "Identify" mode, observing a diagram with dots and string indicators, selecting an option among 4 choices with dual notation, and verifying immediate hit/miss tally and transition.

**Acceptance Scenarios**:

1. **Given** a chord diagram challenge, **When** the diagram renders, **Then** the user sees a clear 6-string fretboard diagram showing frets 1 to 4, finger dots, and string status markers (O for open, X for muted).
2. **Given** multiple choices displayed below the diagram, **When** the user taps the correct option (e.g., "Em (Mi menor)"), **Then** the choice highlights in green, the streak increments, and the session proceeds to the next challenge.
3. **Given** an incorrect option is tapped, **When** the error is registered, **Then** the selected button indicates an error state, the miss counter increments, and the user can see the correct answer.

---

### User Story 4 - Alternating Practice Flow (Priority: P1)

As a guitar learner, I want the training session to automatically alternate between "Draw the Chord" and "Identify the Chord" challenges by default, so that my practice session is varied, engaging, and reinforces both production (drawing) and recognition (identifying).

**Why this priority**: Pedagogical effectiveness. Combining both directions prevents monotony and develops well-rounded retention.

**Independent Test**: Can be tested independently by running a default session and verifying that question N is a "Draw" challenge and question N+1 is an "Identify" challenge (or vice versa), without manual intervention.

**Acceptance Scenarios**:

1. **Given** a default session without specific mode override, **When** consecutive questions appear, **Then** the system alternates between presenting a "Draw the Chord" challenge and an "Identify the Chord" challenge.
2. **Given** a mode configuration query parameter (e.g., `mode=draw` or `mode=identify`), **When** the session loads, **Then** only the specified challenge type is presented throughout the session.

---

### User Story 5 - Open Chords Catalog & Standalone Embed Link Generator (Priority: P2)

As a guitar instructor or self-directed student in standalone mode, I want to explore a comprehensive catalog of open chords with dual naming and diagrams, select any custom subset of chords (e.g., only "C, G, D, Em" for a specific song lesson), and generate a customized shareable URL / embed query string, so that I or my students can practice exactly the target chords inside an embedded webview or standalone window.

**Why this priority**: Essential bridging between study curriculum and targeted practice. Enables educators and apps to generate tailored practice links for specific songs or difficulty levels.

**Independent Test**: Can be tested independently in standalone mode by opening the chord catalog, selecting 3 chords (e.g., G, C, D), selecting a mode, clicking "Generate Embed URL", and verifying that the resulting link contains the correct query parameters and can be copied to clipboard with one click.

**Acceptance Scenarios**:

1. **Given** the standalone catalog view, **When** the user browses the open chords catalog, **Then** all available open chords in [NEEDS CLARIFICATION: initial open chord catalog scope] are displayed with their diagrams, dual names (letter + Solfège), and finger positions.
2. **Given** the catalog selection interface, **When** the user selects or deselects chords using interactive chips or checkboxes, **Then** the selection updates in real time with quick-action presets (e.g., "Select All", "Clear All", "Fundamental Trio G-C-D").
3. **Given** a custom selection of chords and a chosen mode, **When** the user clicks "Generate Embed Link", **Then** the interface produces the full URL with query parameters (e.g., `?chords=G,C,D&mode=draw&embed=true`) and provides a "Copy Link" button with visual copy confirmation.
4. **Given** the user wants to practice the selected subset directly, **When** clicking "Start Practice", **Then** the session launches immediately using only the selected chords.

---

### User Story 6 - URL Query Parameter Configuration & Ultra-Compact Embed Webview Mode (Priority: P2)

As an application developer embedding this chord trainer in a mobile app webview or an external web platform, I want to configure the session entirely via URL parameters (`chords`, `mode`, `embed`, `lang`), with the embed mode suppressing headers, navigation bars, and footers, and keeping the interface within a compact height without vertical scrolling, so that it integrates seamlessly as a native-feeling widget.

**Why this priority**: Core architectural integration requirement, adhering to Constitution Principle III and embedded multi-app standards.

**Independent Test**: Can be tested independently by loading the URL with query parameters such as `?chords=C,Am,F,G&mode=draw&embed=true&lang=es` or navigating to `/basic-chord-trainer/embed`, verifying that all surrounding platform chrome is hidden, the interface adapts compactly, and questions are filtered strictly to the specified chords.

**Acceptance Scenarios**:

1. **Given** `embed=true` or route `/basic-chord-trainer/embed`, **When** the page renders, **Then** global platform headers, bottom navigation bars, and footer chrome are hidden.
2. **Given** a query parameter `?chords=C,D,G`, **When** practice runs, **Then** only the chords C, D, and G appear in the questions.
3. **Given** the query parameter `chords` is omitted or empty, **When** practice runs, **Then** all open chords from the catalog are included by default.
4. **Given** `?mode=draw`, `?mode=identify`, or `?mode=alternate`, **When** the page loads, **Then** the session honors the specified mode (defaulting to `alternate` if omitted or invalid).
5. **Given** `?lang=es` or `?lang=en`, **When** the page loads, **Then** all instructional prompts, feedback, and labels render in the requested language (canonical default: English).
6. **Given** embed mode is active, **When** interacting on mobile screens, **Then** the fretboard, controls, and feedback fit within the viewport without requiring vertical page scrolling.

---

### Edge Cases

- **Invalid chord symbol in URL**: If the `chords` parameter includes unknown or malformed chord names (e.g., `?chords=C,XYZ,123`), the system ignores invalid entries and practices the valid ones. If none are valid, it falls back to the full catalog with a non-intrusive warning.
- **Empty selection**: If the user deselects all chords in the standalone generator, the "Start Practice" and "Generate Link" actions are disabled until at least one chord is selected.
- **Single chord selected**: If only one chord is specified in the URL, the trainer provides repeated practice on that chord across alternating or selected modes without crashing or entering an infinite loop.
- **Accidental double-tap on touch screens**: Tapping a fret rapidly should toggle the dot cleanly without causing screen zoom or unexpected UI shifting.
- **Muted vs Open confusion on fretboard**: If a user places a finger dot on a fret of string 6, but string 6 is marked as Muted (X), the system should intuitively resolve or highlight the conflict [NEEDS CLARIFICATION: finger interaction mechanics].

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST always display chord names using dual notation simultaneously (Anglo-Saxon letter notation + Solfège name, e.g., "C (Do Mayor)", "Am (La menor)") across all prompts, catalog views, and answer choices.
- **FR-002**: System MUST support a "Draw the Chord" training mode where the user is given a chord name and must interactively mark fret positions and open/muted string states on a guitar fretboard diagram.
- **FR-003**: System MUST support an "Identify the Chord" training mode where the user is shown a fretboard diagram and must select the matching chord name from multiple-choice options.
- **FR-004**: System MUST alternate by default between "Draw the Chord" and "Identify the Chord" modes on successive practice cards unless configured otherwise.
- **FR-005**: System MUST support URL query parameter `mode` accepting values `alternate` (default), `draw`, and `identify`.
- **FR-006**: System MUST support URL query parameter `chords` accepting a comma-separated list of chord symbols (case-insensitive) to filter the practice pool.
- **FR-007**: System MUST default to including all open chords from the catalog when the `chords` parameter is absent, empty, or contains only invalid values.
- **FR-008**: System MUST support URL query parameter `embed=true` and a dedicated route `/basic-chord-trainer/embed` that completely suppresses platform header navigation, bottom tabs, and footer chrome.
- **FR-009**: System MUST support URL query parameter `lang` (`en` or `es`), defaulting canonically to English (`en`) in accordance with Constitution Principle VI.
- **FR-010**: System MUST provide an interactive Chord Catalog in standalone mode displaying all open chords, their diagrams, finger positions, and dual notation names.
- **FR-011**: System MUST provide an interactive selection interface and Embed Link Generator in standalone mode, allowing users to select chords, choose a practice mode, and copy a configured embed URL to the clipboard.
- **FR-012**: System MUST include in its initial catalog [NEEDS CLARIFICATION: initial open chord catalog scope - 8 essential open chords vs 8 essentials + open 7ths].
- **FR-013**: In "Draw the Chord" mode, the interaction mechanics MUST handle finger dot placement and string open/muted state via [NEEDS CLARIFICATION: finger interaction mechanics - tap fret + toggle nut markers vs alternative].
- **FR-014**: In "Draw the Chord" mode, answer verification MUST be triggered via [NEEDS CLARIFICATION: submission trigger - explicit submit button vs automatic validation].
- **FR-015**: System MUST track and display real-time session metrics: total hits (aciertos), total misses (fallos), current streak, and accuracy percentage.
- **FR-016**: System MUST provide immediate visual feedback upon answer submission, showing clear green success indicators for correct answers and red error indicators with the correct diagram and fingering for incorrect answers.
- **FR-017**: The interactive fretboard diagram MUST display 6 guitar strings (from 6th low E to 1st high E) and frets 1 through 4 (plus nut/open indicators), designed to fit cleanly on mobile screens without horizontal or vertical clipping.
- **FR-018**: System MUST comply with Dual Navigation Architecture: on phone/mobile viewports (< 768px), top header navigation links are hidden to eliminate horizontal overflow and replaced with the fixed mobile bottom navigation bar (PlatformBottomNav) with touch targets >= 44x44px. In embed mode, both header and bottom navigation chrome MUST be suppressed.

---

### Key Entities *(include if feature involves data)*

- **ChordDefinition**:
  - `id`: Unique identifier (e.g., `"c-major"`, `"a-minor"`).
  - `symbol`: Anglo-Saxon symbol (e.g., `"C"`, `"Am"`, `"G7"`).
  - `solfegeName`: Solfège name (e.g., `"Do Mayor"`, `"La menor"`, `"Sol 7ª"`).
  - `category`: Category group (e.g., `"open-major"`, `"open-minor"`, `"open-7th"`).
  - `strings`: Array of 6 string states from 6th (low E) to 1st (high E), each defining:
    - `state`: `"open"` (O), `"muted"` (X), or `"fretted"`.
    - `fret`: Fret number (0 for open, 1-4 for fretted, null for muted).
    - `finger`: Recommended finger number (1=Index, 2=Middle, 3=Ring, 4=Pinky, optional).
  - `barre`: Optional barre specification (null for open chords).
  - `rootString`: String number of the root bass note (e.g., 5 for C, 6 for G).

- **PracticeChallenge**:
  - `chord`: The target `ChordDefinition`.
  - `mode`: `"draw"` or `"identify"`.
  - `options`: Array of chord choices (for `"identify"` mode, typically 4 options).
  - `userDrawing`: Current user-placed dots and string states (for `"draw"` mode).
  - `status`: `"pending"`, `"evaluated_correct"`, or `"evaluated_incorrect"`.

- **TrainerSessionConfig**:
  - `selectedChordIds`: Array of chord IDs included in the session.
  - `mode`: `"alternate"`, `"draw"`, or `"identify"`.
  - `isEmbed`: Boolean indicating if embed view is active.
  - `lang`: `"en"` or `"es"`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify or draw any open chord in under 8 seconds per card on average during practice.
- **SC-002**: 100% of chord displays, prompts, and multiple-choice buttons consistently display both Anglo-Saxon letter and Solfège notations across both English and Spanish locales.
- **SC-003**: The embed mode widget fits completely within a mobile viewport height of 480px or less without requiring any vertical or horizontal scrolling.
- **SC-004**: Users can select custom chords in the catalog, generate an embed link, and copy it to their clipboard in fewer than 3 taps or clicks.
- **SC-005**: First-time users achieve an initial practice success rate above 75% after fewer than 10 training cards thanks to clear corrective diagrams.
- **SC-006**: URL query parameters (`chords`, `mode`, `embed`, `lang`) configure the trainer instantaneously upon first load with zero layout shifts (CLS < 0.05).

---

## Assumptions

- **Target Audience**: Guitar beginners and intermediate players who want to memorize open chord fingerings, understand string muting, and bridge the gap between English letter charts and European Solfège.
- **Instrument Standard**: Standard 6-string guitar in standard tuning (E-A-D-G-B-E). Frets 1 to 4 are sufficient for all standard open chords.
- **Zero-Mock UI**: No simulated user profiles or mock authentication buttons will be included. Anonymous session stats (hits, misses, streak) will be held in state or client storage.
- **Audio Feedback**: While visual feedback is mandatory, optional guitar chord strum audio playback can be integrated cleanly if available, but core training is fully functional without mandatory audio dependencies.
- **Catalog Scope**: The initial version focuses strictly on open chords; barre chords, moveable shapes (CAGED), and jazz extensions are deferred to future milestones.
