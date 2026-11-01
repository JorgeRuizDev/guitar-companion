# Feature Specification: Strumming Pattern Trainer

**Feature Branch**: `001-strumming-pattern-trainer`

**Created**: 2026-11-01

**Status**: Draft

**Input**: User description: "Quiero construir una primera app dentro de la web que me permita practicar strumming patterns. Se debe poder configurar un strumming pattern de manera gráfica (con las flechas). Debe incluir un metrónomo configurable que suene junto al strumming pattern (BPM, si se acentúa la primera nota o no). Temporizador de la práctica. Formato del strumming configurable: básico de corcheas con D-D-DU-U, semicorcheas (1 - e - & - a), otros formatos populares (soy principiante), de manera gráfica escogiendo la división y cuando sube y cuando baja. La visualización debe ser similar a la imagen, con un bloque con la flecha de la dirección y si no se hace nada vacío. Una línea lleva el tiempo. Debe ejecutarse en bucle."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Interactive Visual Timeline & Looping Playback (Priority: P1)

As a beginner guitarist, I want to see a continuous looping visual timeline that sweeps across a strumming pattern with a synchronized metronome, accessible and controllable on a single unified page via UI buttons and keyboard shortcuts, so that I can practice rhythm and hand motion in real time with immediate timing feedback.

**Why this priority**: Core value delivery. Without real-time synchronized visual and auditory feedback, the application cannot serve its fundamental purpose as a practice tool.

**Independent Test**: Can be tested by opening the application, pressing Play (or hitting `SPACE`), hearing the optional count-in, and verifying that the visual playhead sweeps smoothly across the blocks in sync with audible metronome pulses, looping continuously until paused.

**Acceptance Scenarios**:

1. **Given** a 4/4 strumming pattern at 80 BPM, **When** the user clicks Play or presses `SPACE`, **Then** the metronome starts clicking at 80 BPM, a visual playhead line sweeps horizontally across the pattern blocks in real time, and playback loops seamlessly upon reaching the end of the measure.
2. **Given** playback is running, **When** the user presses `SPACE`, **Then** playback immediately pauses; when pressed again, playback resumes from the current position.
3. **Given** playback is running or paused, **When** the user presses `RETURN` (Enter) or clicks Reset, **Then** playback halts and the playhead resets immediately to beat 1.
4. **Given** count-in is set to 1, 2, or 3 measures, **When** the user starts playback, **Then** the metronome audibly counts the introductory beats with a visual count-in indicator before the timeline playhead begins sweeping the pattern.
5. **Given** the playback is active, **When** the user changes the tempo (BPM slider or numeric input), **Then** the playback speed and visual sweep immediately adjust to the new tempo without restarting the loop or desynchronizing.
6. **Given** the accent option is enabled, **When** the first beat of each measure is played, **Then** the audio produces a higher-pitched or accented pulse on beat 1 compared to subsequent beats.
7. **Given** the accent option is disabled, **When** beats are played, **Then** all metronome clicks sound with uniform pitch and volume.

---

### User Story 2 - Graphic Pattern Builder & Beginner Presets (Priority: P2)

As a guitar student, I want to customize strumming patterns graphically by clicking directional arrows or selecting beginner presets (such as basic 8th notes D-D-DU-U or 16th notes 1-e-&-a), with standard alternating down/up motor motion enforced by default and an unobtrusive toggle for free-form arrow direction, so that I develop proper hand mechanics while practicing the exact rhythm required for songs I am learning.

**Why this priority**: Flexibility and learning progression. Users need to switch between standard beginner patterns, maintain consistent alternating pendulum hand motion, and construct custom rhythms effortlessly.

**Independent Test**: Can be tested independently by selecting a preset from a library (e.g., "Island Strum" or "Basic Folk"), verifying that the visual blocks update immediately with the corresponding arrows, clicking individual blocks to toggle alternating states (Down on odd slot positions, Up on even slot positions, or Rest), and toggling the discreet "Alternado D/U" switch to test free-form direction cycling (Down -> Up -> Rest).

**Acceptance Scenarios**:

1. **Given** the pattern builder interface, **When** the user chooses an 8th-note rhythmic subdivision, **Then** the measure displays 8 slots (1, &, 2, &, 3, &, 4, &).
2. **Given** the pattern builder interface, **When** the user chooses a 16th-note subdivision, **Then** the measure displays 16 slots (1, e, &, a, 2, e, &, a, etc.).
3. **Given** any beat slot on the timeline with Alternated Mode active (default, following standard pendulum motion), **When** the user clicks/taps an odd slot position (impar: 1st, 3rd, 5th, etc., including '1' and '&' in 16th subdivisions, or downbeats '1', '2', '3', '4' in 8th subdivisions), **Then** it toggles exclusively between Down (`↓`) and Empty (` `); when clicking an even slot position (par: 2nd, 4th, 6th, etc., including 'e' and 'a' in 16th subdivisions, or '&' in 8th subdivisions), **Then** it toggles exclusively between Up (`↑`) and Empty (` `), ensuring that on any '&' in a 16th-note grid it is strictly a Downstroke (`↓`).
4. **Given** the discreet Alternated Mode toggle is switched OFF (free-form mode), **When** the user clicks any slot, **Then** it cycles sequentially through all directions: Down (`↓`), Up (`↑`), and Empty/Rest (` `), allowing arbitrary stroke configurations (e.g., DDDU or free-form strumming).
5. **Given** the preset selector, **When** the user selects a preset pattern (e.g. "D-D-DU-U" or "Island Strum"), **Then** the timeline immediately reflects that exact sequence of stroke blocks and empty spaces.
6. **Given** a custom pattern created by the user, **When** the page is reloaded, **Then** the custom pattern and alternation preferences are automatically restored from local storage.

---

### User Story 3 - Practice Session Timer & Flow Control (Priority: P3)

As a practicing guitarist, I want to set a dedicated practice timer (e.g., 2, 5, 10, or 15 minutes) for my strumming routine, so that I can manage my practice sessions effectively without watching a clock.

**Why this priority**: Enhances training discipline and provides structured practice sessions without interfering with the primary playback engine.

**Independent Test**: Can be tested by configuring a 1-minute practice countdown, pressing Start Practice, and verifying that the timer counts down in parallel with the looping pattern, notifying the user when the time expires.

**Acceptance Scenarios**:

1. **Given** the practice timer section, **When** the user selects a target duration (or enters minutes) and clicks Start, **Then** the timer decrements every second in sync with practice.
2. **Given** the timer is running, **When** the user pauses playback, **Then** the timer pauses; when playback resumes, the timer resumes.
3. **Given** the timer countdown reaches 00:00, **When** the session concludes, **Then** the user receives an explicit visual and acoustic notification indicating session completion.

---

### User Story 4 - Advanced Metronome Subdivision & Tempo Control (Priority: P2)

As a rhythm student, I want the metronome to support configurable subdivisions (quarter notes ♩, eighth notes ♫, sixteenth notes, triplets, and shuffle/swing), a Tap Tempo button, real-time beat pulse dots, and traditional Italian tempo markings, so that I can practice internalizing sub-beat micro-timing and groove consistency across various tempos.

**Why this priority**: Musical precision. Practicing complex rhythms requires hearing sub-beat subdivisions without overpowering the acoustic guitar.

**Independent Test**: Can be tested by selecting different subdivision buttons on the metronome (Negra, Corcheas, Semicorcheas, Tresillos, Swing), pressing Start, and hearing distinct, lower-gain subdivision pulses between the accented and standard quarter downbeat clicks.

**Acceptance Scenarios**:

1. **Given** the metronome subdivision selector, **When** "Negra" (quarter note ♩) is active, **Then** the metronome emits 1 primary click per beat.
2. **Given** the metronome subdivision selector, **When** "Corcheas" (eighth notes ♫) is active, **Then** the metronome emits 2 clicks per beat (main beat click + subtle off-beat click on the "&").
3. **Given** the metronome subdivision selector, **When** "Semicorcheas" (16th notes) is active, **Then** the metronome emits 4 clicks per beat with subordinate volume.
4. **Given** the metronome subdivision selector, **When** "Tresillos" (triplets) is active, **Then** the metronome emits 3 evenly spaced clicks per beat.
5. **Given** the metronome subdivision selector, **When** "Swing" (shuffle) is active, **Then** the metronome emits swung clicks on the downbeat and the third triplet eighth.
6. **Given** the Tap Tempo button, **When** the user taps the button rhythmically 2 or more times, **Then** the BPM is calculated from the average tap interval and immediately updates playback tempo.
7. **Given** playback is running, **When** quarter beats are triggered, **Then** the 4 beat indicator dots pulse in real-time, highlighting beat 1 in amber accent.

---

### Edge Cases

- **Tempo Extremes**: What happens when the user sets BPM to an extreme value (e.g., 30 BPM or 280 BPM)? The UI restricts tempo input to a musically practical range (40 - 240 BPM) with smooth slider steps and input validation.
- **Silent Mode / Audio Context Restrictions**: How does the system handle browser environments where audio autoplay is blocked until user interaction? Playback controls clearly prompt the user to tap/click before starting audio, with visual fallback playhead moving smoothly even if audio device is muted.
- **Window Resizing & Screen Rotation**: How does the visual timeline behave when switching from mobile portrait (320px) to landscape or desktop? The timeline responsive container adjusts block proportions gracefully, maintaining playhead alignment with zero drift or visual clipping.
- **All-Empty Pattern**: What happens if the user configures all beat slots as Empty? The metronome continues clicking according to the time signature and BPM, while the playhead sweeps across blank blocks without producing strum actions.
- **Rapid Subdivision Switching**: What happens if the subdivision format is changed while looping? The engine safely pauses playback, recalculates slot allocations, and resets the playhead to beat 1 to prevent timing anomalies.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render a visual strumming timeline representing a musical measure divided into discrete beat slots, stylized with guitar fretboard strings and block markers analogous to modern music learning interfaces.
- **FR-002**: System MUST display directional indicators for each slot: Downstroke arrow (`↓`), Upstroke arrow (`↑`), and Empty slot (rest/pause with no block or translucent ghost state).
- **FR-003**: System MUST provide an interactive playhead line that traverses the timeline horizontally in strict synchronization with the musical tempo.
- **FR-004**: System MUST execute the timeline and metronome in a continuous seamless loop until stopped by the user.
- **FR-005**: System MUST include an integrated metronome with configurable tempo ranging from 40 to 240 BPM.
- **FR-006**: System MUST allow users to toggle the accent on the first beat of the measure (Beat 1 accent ON/OFF).
- **FR-007**: System MUST support configurable rhythmic subdivisions, including standard 8th notes (8 slots per 4/4 measure) and 16th notes (16 slots per 4/4 measure: 1-e-&-a).
- **FR-008**: System MUST provide a graphic pattern editor allowing users to tap or click any individual slot to toggle or set its state (`↓`, `↑`, Empty).
- **FR-009**: System MUST provide a pre-configured library of popular beginner strumming patterns (including basic 8th-note D-D-DU-U, Folk D-DU-UDU, Island Strum D-DU-U-DU, and basic 16th-note grooves).
- **FR-010**: System MUST include a practice session timer with configurable countdown durations (e.g., 2, 5, 10, 15 minutes, or custom duration).
- **FR-011**: System MUST persist the user's last selected tempo, custom pattern, and practice preferences locally in the browser so that state is maintained across page reloads without requiring user login.
- **FR-012**: System MUST comply with the Zero-Mock UI principle: no mock login forms, fake user avatars, or placeholder profile headers shall be rendered.
- **FR-013**: System MUST support responsive Mobile-First viewports down to 320px width, ensuring all interactive touch targets meet or exceed 44x44px.
- **FR-014**: System MUST emit audio feedback exclusively via acoustic metronome pulses (clear click/woodblock pulses with pitch accent on beat 1 when enabled), allowing the user to clearly hear their physical guitar without simulated guitar strum sound effects during practice.
- **FR-015**: System MUST focus v1 functionality strictly on rhythm and strumming direction (Downstroke, Upstroke, and Empty slots); chord labeling, progression switching, and chord diagrams are explicitly excluded from v1 scope.
- **FR-016**: System MUST continue looping the strumming pattern and metronome without interruption when the practice timer countdown reaches 00:00, emitting a gentle visual and acoustic completion notification until the user manually pauses or resets playback.
- **FR-017**: System MUST provide keyboard shortcuts for playback control: pressing `SPACE` toggles Pause/Resume (Start/Stop), and pressing `RETURN` (Enter) resets the playhead and playback to the beginning of the measure.
- **FR-018**: System MUST support a configurable Count-In feature with options for 0 (no count-in), 1 measure (default), 2 measures, or 3 measures (for fast tempos), playing audible metronome clicks with a visual countdown indicator before the timeline playhead begins sweeping the pattern.
- **FR-019**: System MUST present all configuration controls (BPM, subdivision, count-in, accent toggle, timer, presets, and arrow editor) and the animated strumming timeline on a single unified page without requiring tab switching or modal dialogs.
- **FR-020**: System MUST apply all configuration updates dynamically in real time without reloading the page or discarding current session progress.
- **FR-021**: System MUST enforce positional alternating directional strokes by default (Downstroke `↓` on odd slots [impares: 1st, 3rd, 5th, etc.], Upstroke `↑` on even slots [pares: 2nd, 4th, 6th, etc.]) when editing pattern slots in D/U mode (ensuring that in 16th notes, '1' and '&' are Downstrokes, while 'e' and 'a' are Upstrokes, matching standard pendulum guitar mechanics). System MUST provide an unobtrusive toggle ("Alternado D/U") to unlock free-form arrow direction where slots can be configured in any arbitrary combination.
- **FR-022**: System MUST support configurable metronome subdivisions with dedicated visual buttons for Quarter notes (Negra ♩), Eighth notes (Corcheas ♫), Sixteenth notes (16avas), Triplets (Tresillos), and Shuffle/Swing, synthesizing distinct subordinate click tones for sub-beat divisions.
- **FR-023**: System MUST provide an interactive Tap Tempo ("TAP") control that computes and sets the BPM based on user tap intervals clamped between 40 and 240 BPM.
- **FR-024**: System MUST render real-time beat pulse indicators (4 dots in 4/4 time) synchronized with metronome downbeats, highlighting Beat 1 with accent emphasis.
- **FR-025**: System MUST ensure Web Audio initialization is fully decoupled from SSR hydration, using a shared singleton audio context with synchronous gesture unlocking (silent buffer) to prevent silent playback on mobile/WebKit browsers.

### Key Entities *(include if feature involves data)*

- **StrummingPattern**: Represents a full measure rhythm configuration, containing:
  - `id`: Unique identifier
  - `name`: Human-readable title (e.g., "Island Strum", "Custom Pattern 1")
  - `timeSignature`: Musical meter (default 4/4)
  - `subdivision`: Division unit (`eighth` [8 slots] or `sixteenth` [16 slots])
  - `slots`: Ordered sequence of `BeatSlot` items
  - `isPreset`: Boolean indicating whether it is a built-in beginner preset or a user-created pattern
  - `ownerId`: Optional user ownership identifier (null/anonymous for guest storage)
- **BeatSlot**: Represents an individual division slot along the timeline:
  - `index`: Position in the measure (0 to N-1)
  - `beatLabel`: Musical count label (e.g., "1", "&", "2", "e", etc.)
  - `strokeDirection`: Stroke action (`down`, `up`, `none`)
  - `accented`: Boolean indicating if this particular stroke carries primary musical emphasis
- **MetronomeConfig**: Runtime playback settings:
  - `bpm`: Tempo in beats per minute (40 - 240)
  - `accentFirstBeat`: Boolean flag
  - `countInMeasures`: Number of introductory count-in measures (0, 1, 2, or 3)
  - `soundTheme`: Metronome sound profile (e.g., woodblock, click, digital beep)
  - `subdivision`: Metronome audio division frequency (`quarter`, `eighth`, `sixteenth`, `triplet`, `swing`)
  - `strictAlternation`: Boolean flag enforcing positional alternating Down/Up stroke direction by default (odd slots = Down, even slots = Up)
- **PracticeSession**: Represents session metadata:
  - `targetDurationSeconds`: Goal duration configured on the timer
  - `elapsedSeconds`: Total active practice time accumulated
  - `status`: State of practice (`idle`, `counting-in`, `running`, `paused`, `completed`)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A beginner user can launch the app, select a preset pattern, and start practicing with visual feedback in under 10 seconds.
- **SC-002**: The visual playhead sweep and audio metronome remain synchronized within 10 milliseconds of drift over 200 consecutive continuous loops.
- **SC-003**: 100% of interactive controls (buttons, tempo slider, arrow toggles, preset pills) have touch target dimensions of at least 44x44px on mobile devices.
- **SC-004**: Users can customize every slot of an 8-beat pattern in fewer than 10 taps/clicks using the graphic arrow editor.
- **SC-005**: The application loads and renders the interactive timeline in under 1.5 seconds on a standard 4G mobile connection.
- **SC-006**: Zero mock authentication elements or fake user profiles are rendered in the interface, fulfilling the architectural constitution.

## Assumptions

- **Target Audience**: Beginner to intermediate guitarists learning basic rhythm, strumming hand consistency, and tempo coordination.
- **Guest-First Persistence**: In accordance with the constitution, all patterns and session progress are stored transparently in client-side storage (e.g., `localStorage`), structured with an extensible `ownerId` schema ready for cloud synchronization once formal user authentication is developed.
- **Browser Compatibility**: The Web Audio capabilities and visual animations are supported across modern mobile and desktop evergreen browsers (Chrome, Safari iOS, Firefox, Edge).
- **Time Signature Scope**: Initial version focuses on the standard 4/4 time signature (the ubiquitous meter for beginner guitar strumming songs); other meters (3/4, 6/8) are deferred to future iterations.
