# Feature Specification: Strumming Pattern Trainer

**Feature Branch**: `001-strumming-pattern-trainer`

**Created**: 2026-11-01

**Status**: Draft

**Input**: User description: "Quiero construir una primera app dentro de la web que me permita practicar strumming patterns. Se debe poder configurar un strumming pattern de manera gráfica (con las flechas). Debe incluir un metrónomo configurable que suene junto al strumming pattern (BPM, si se acentúa la primera nota o no). Temporizador de la práctica. Formato del strumming configurable: básico de corcheas con D-D-DU-U, semicorcheas (1 - e - & - a), otros formatos populares (soy principiante), de manera gráfica escogiendo la división y cuando sube y cuando baja. La visualización debe ser similar a la imagen, con un bloque con la flecha de la dirección y si no se hace nada vacío. Una línea lleva el tiempo. Debe ejecutarse en bucle."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Interactive Visual Timeline & Looping Playback (Priority: P1)

As a beginner guitarist, I want to see a continuous looping visual timeline that sweeps across a strumming pattern with a synchronized metronome across standard and atypical time signatures (4/4, 3/4, 6/8, and custom block lengths), accessible and controllable on a single unified page via UI buttons and keyboard shortcuts, so that I can practice rhythm and hand motion in real time with immediate timing feedback.

**Why this priority**: Core value delivery. Without real-time synchronized visual and auditory feedback, the application cannot serve its fundamental purpose as a practice tool.

**Independent Test**: Can be tested by opening the application, pressing Play (or hitting `SPACE`), hearing the optional count-in, and verifying that the visual playhead sweeps smoothly across the blocks in sync with audible metronome pulses (4 beats in 4/4, 3 beats in 3/4, compound pulses in 6/8), looping continuously until paused.

**Acceptance Scenarios**:

1. **Given** any active strumming pattern (4/4, 3/4 waltz, 6/8 compound ballad, or custom block length) at a chosen tempo (e.g., 80 BPM), **When** the user clicks Play or presses `SPACE`, **Then** the metronome starts clicking at that BPM in accordance with the time signature, a visual playhead line sweeps horizontally across the pattern blocks in real time over the exact calculated measure duration, and playback loops seamlessly upon reaching the end of the measure.
2. **Given** playback is running, **When** the user presses `SPACE`, **Then** playback immediately pauses; when pressed again, playback resumes from the current position.
3. **Given** playback is running or paused, **When** the user presses `RETURN` (Enter) or clicks Reset, **Then** playback halts and the playhead resets immediately to beat 1.
4. **Given** count-in is set to 1, 2, or 3 measures, **When** the user starts playback, **Then** the metronome audibly counts the introductory beats matching the active meter (e.g. 4 quarter beats for 4/4, 3 quarter beats for 3/4, 6 compound eighth pulses for 6/8) with a visual count-in indicator before the timeline playhead begins sweeping the pattern.
5. **Given** the playback is active, **When** the user changes the tempo (BPM slider or numeric input), **Then** the playback speed and visual sweep immediately adjust to the new tempo without restarting the loop or desynchronizing.
6. **Given** the accent option is enabled, **When** the first beat of each measure is played, **Then** the audio produces a higher-pitched or accented pulse on beat 1 compared to subsequent beats; in 6/8 compound meter, pulse 4 also produces a secondary medium-pitch compound accent.
7. **Given** the accent option is disabled, **When** beats are played, **Then** all metronome clicks sound with uniform pitch and volume.

---

### User Story 2 - Graphic Pattern Builder, Atypical Time Signatures & Dynamic Block Configuration (Priority: P2)

As a guitar student, I want to customize strumming patterns graphically by clicking directional arrows, selecting beginner presets for both standard 4/4 and atypical meters (3/4 waltz, 6/8 compound ballad), and dynamically adding or removing blocks (between 2 and 24 slots), with standard alternating down/up motor motion enforced by default and an unobtrusive toggle for free-form arrow direction, so that I develop proper hand mechanics while practicing the exact rhythm required for songs I am learning.

**Why this priority**: Flexibility, versatility, and learning progression. Users need to switch between standard beginner patterns, explore atypical meters like waltzes and 6/8 acoustic ballads, adjust block counts dynamically, maintain consistent alternating pendulum hand motion, and construct custom rhythms effortlessly.

**Independent Test**: Can be tested independently by selecting presets from the library (e.g., "Island Strum", "Vals Básico 3/4", "Vals Balada 3/4", or "Balada 6/8"), verifying that the visual blocks and time signature update immediately with the corresponding arrows, using dynamic block controls (`+` and `-`) to expand or trim pattern length between 2 and 24 blocks, clicking individual blocks to toggle alternating states (Down on odd slot positions, Up on even slot positions, or Rest), and toggling the discreet "Alternado D/U" switch to test free-form direction cycling (Down -> Up -> Rest).

**Acceptance Scenarios**:

1. **Given** the pattern builder interface in 4/4 time, **When** the user chooses an 8th-note rhythmic subdivision, **Then** the measure displays exactly 8 slots (1, &, 2, &, 3, &, 4, &).
2. **Given** the pattern builder interface in 4/4 time, **When** the user chooses a 16th-note subdivision, **Then** the measure displays exactly 16 slots (1, e, &, a, 2, e, &, a, etc.).
3. **Given** the pattern builder interface, **When** the user selects the 3/4 meter button or basic preset ("Vals Básico 3/4"), **Then** the timeline displays 3 slots representing the 3 fundamental quarter beat strums of 3/4 (1, 2, 3) (or 6 slots if subdivided into eighth notes as in "Vals Balada 3/4"), distinctly differing from the 6 strums of 6/8.
4. **Given** the pattern builder interface, **When** the user selects a 6/8 compound meter pattern (e.g., "Balada 6/8" or the 6/8 quick button), **Then** the timeline displays 6 slots (1, 2, 3, 4, 5, 6), representing compound duple meter with primary accent pulse on 1 and secondary compound accent pulse on 4.
5. **Given** the rhythm selector bar, **When** the user clicks the dedicated "Custom" button or uses the `+` and `-` controls on the selector or directly above the timeline, **Then** the application enters custom pattern mode allowing the user to configure any number of strums/blocks between 2 and 24.
6. **Given** any active pattern, **When** the user clicks the add block control (`+`), **Then** a new beat slot is appended to the timeline (up to a maximum of 24 blocks) initialized as Empty (` `) with its corresponding sequential index and alternating stroke rule, without altering existing slot states.
7. **Given** any active pattern with more than 2 blocks, **When** the user clicks the remove block control (`-`), **Then** the last beat slot is removed from the timeline (clamped at a minimum of 2 blocks), immediately recalculating slot spacing and timeline duration.
7. **Given** any beat slot on the timeline with Alternated Mode active (default, following standard pendulum motion), **When** the user clicks/taps an odd slot position (impar: 1st, 3rd, 5th, etc., 0-indexed: 0, 2, 4...), **Then** it toggles exclusively between Down (`↓`) and Empty (` `); when clicking an even slot position (par: 2nd, 4th, 6th, etc., 0-indexed: 1, 3, 5...), **Then** it toggles exclusively between Up (`↑`) and Empty (` `). This alternating motor rule holds universally across 8-slot, 16-slot, 6-slot (3/4 and 6/8), and any dynamically configured block length from 2 to 24 slots.
8. **Given** the discreet Alternated Mode toggle is switched OFF (free-form mode), **When** the user clicks any slot, **Then** it cycles sequentially through all directions: Down (`↓`), Up (`↑`), and Empty/Rest (` `), allowing arbitrary stroke configurations (e.g., DDDU, D-D-U, or free-form strumming) across any number of blocks.
9. **Given** the preset selector, **When** the user selects a preset pattern (e.g. "Island Strum", "Vals Básico 3/4 D-D-U", "Vals Balada 3/4 D-DU-DU", or "Balada 6/8 D-DU-D-DU"), **Then** the timeline immediately reflects that exact sequence of stroke blocks, time signature, and empty spaces.
10. **Given** a custom pattern created by the user (including custom block count or atypical meter), **When** the page is reloaded, **Then** the custom pattern, time signature, block count, and alternation preferences are automatically restored from local storage.

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
7. **Given** playback is running in 4/4 time, **When** quarter beats are triggered, **Then** the 4 beat indicator dots pulse in real-time, highlighting beat 1 in amber accent.
8. **Given** playback is running in 3/4 time, **When** quarter beats are triggered, **Then** exactly 3 beat indicator dots pulse in real-time, highlighting beat 1 in amber accent.
9. **Given** playback is running in 6/8 compound time, **When** eighth pulses are triggered, **Then** 6 beat indicator dots pulse in real-time, highlighting pulse 1 in amber primary accent and pulse 4 in cyan secondary compound accent.

---

### User Story 5 - Shareable URL Configurations & Local Storage Persistence (Priority: P2)

As a guitarist or guitar teacher, I want my active strumming pattern, meter (4/4, 3/4, 6/8), block count, tempo, and metronome settings to be automatically remembered in local storage, and I want to share or configure any pattern setup via a shareable URL with query parameters using an intuitive "Share / Copy Link" button, so that I can easily distribute exercises to students, switch devices, or bookmark my favorite practice routines.

**Why this priority**: Portability and persistence. Users should never lose their practice configuration upon refreshing or closing the browser, and sharing practice routines with teachers or peers is a key collaborative learning benefit.

**Independent Test**: Can be tested by creating or selecting a pattern (including 3/4 waltz or 6/8 ballad, or custom block length), adjusting BPM and metronome settings, verifying that refreshing the page restores the exact configuration from local storage, clicking the "Share Link" button to copy the generated URL to clipboard, and opening the URL in a new window/tab to confirm the exact pattern, tempo, meter, and settings are restored.

**Acceptance Scenarios**:

1. **Given** a customized or preset strumming pattern with specific BPM, meter, block count, subdivision, and metronome settings, **When** the user clicks the "Share Link" (or "Compartir") button, **Then** a shareable URL containing the current configuration as query parameters is copied to the system clipboard, and a visual confirmation notification ("¡Enlace copiado!" / "Link copied!") is briefly displayed.
2. **Given** an incoming URL with query parameters (e.g. `?preset=preset-island-strum&bpm=95&accent=1&countIn=2` or `?preset=preset-ballad-6-8&bpm=110`), **When** the page loads, **Then** the application parses the parameters, immediately initializes playback engine and timeline with the specified preset, meter, BPM, accent, and count-in, and persists this configuration to local storage.
3. **Given** an incoming URL with a custom stroke pattern and meter (e.g. `?strokes=d,-,d,u,-,u,d,u&sub=8th&bpm=85` or `?strokes=d,-,d,u,-,u&meter=3/4&blocks=6&bpm=120`), **When** the page loads, **Then** the application reconstructs the custom pattern with the designated directional arrows, rests, block count, and meter, setting BPM accordingly.
4. **Given** no query parameters are present in the URL, **When** the user visits the page, **Then** the application restores the user's last active pattern, meter, block count, and preferences from local storage, or falls back to the default beginner preset if no storage exists.
5. **Given** any invalid, out-of-range, or corrupted query parameters in the URL, **When** the page loads, **Then** the application gracefully clamps numerical values (BPM between 40 and 240, blocks between 2 and 24) and falls back to safe defaults without crashing.

---

### Edge Cases

- **Dynamic Block Count Limits**: What happens if the user attempts to add more than 24 blocks or reduce below 2 blocks? The UI disables the decrement (`-`) button when the block count reaches 2 (minimum viable musical pattern) and disables the increment (`+`) button when reaching 24 (maximum practical measure grid). Internal state sanitizers clamp any incoming block count strictly to `[2, 24]`.
- **Odd Total Block Counts under Strict Alternation**: What happens if a pattern has an odd number of total blocks (e.g. 3, 5, 7, 9)? Strict alternation continues to enforce odd-positioned slots (0, 2, 4...) as Downstrokes and even-positioned slots (1, 3, 5...) as Upstrokes. When the timeline loops seamlessly back to beat 1, slot 0 starts fresh with a Downstroke, preserving motor pendulum symmetry.
- **Dynamic Meter & Block Count Switching During Active Playback**: What happens if the user switches time signatures (e.g. 4/4 to 3/4 or 6/8) or adds/removes blocks while the loop is running? The engine safely pauses playback, recalculates the measure duration and slot allocations, resets the playhead to beat 1, and allows immediate restart to prevent audio timing glitches or visual desynchronization.
- **Tempo Extremes**: What happens when the user sets BPM to an extreme value (e.g., 30 BPM or 280 BPM)? The UI restricts tempo input to a musically practical range (40 - 240 BPM) with smooth slider steps and input validation.
- **Silent Mode / Audio Context Restrictions**: How does the system handle browser environments where audio autoplay is blocked until user interaction? Playback controls clearly prompt the user to tap/click before starting audio, with visual fallback playhead moving smoothly even if audio device is muted.
- **Window Resizing & Screen Rotation**: How does the visual timeline behave when switching from mobile portrait (320px) to landscape or desktop with variable block counts (2 to 24)? The timeline responsive container adjusts block proportions gracefully using CSS grid (`repeat(N, minmax(0, 1fr))`), maintaining playhead alignment with zero drift or visual clipping even with 24 blocks.
- **Mobile Navigation and Header Sizing**: On mobile/phone viewports (< 768px), the top navbar MUST NOT overflow horizontally or clip items; platform tool links are hidden from the top header and replaced with a dedicated mobile bottom navigation bar (PlatformBottomNav) providing thumb-friendly switching between tools without obscuring interactive controls.
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
- **FR-007**: System MUST support configurable time signatures and rhythmic subdivisions, including standard 4/4 (8 slots for 8th notes, 16 slots for 16th notes: 1-e-&-a), simple triple 3/4 (6 slots for 8th-note waltzes and acoustic ballads: 1-&-2-&-3-&), compound duple 6/8 (6 eighth-note slots with compound pulses on 1 and 4), and dynamically configured block lengths.
- **FR-008**: System MUST provide an interactive graphic pattern editor allowing users to tap or click any individual slot to toggle or set its state (`↓`, `↑`, Empty), and provide dedicated dynamic block controls (`+` to append a slot, `-` to remove trailing slot) allowing pattern measure lengths between 2 and 24 blocks.
- **FR-009**: System MUST provide a pre-configured library of popular beginner strumming patterns across standard and atypical meters, including 4/4 patterns (Basic Beginner D-D-DU-U, Folk Ballad D-DU-UDU, Island Strum D-DU-U-DU, Four on the Floor D-D-D-D, 16th-Note Pop Groove), 3/4 waltz patterns (Vals Básico 3/4 D-D-U, Vals Balada 3/4 D-DU-DU), and 6/8 compound meter patterns (Balada 6/8 D-DU-D-DU).
- **FR-010**: System MUST include a practice session timer with configurable countdown durations (e.g., 2, 5, 10, 15 minutes, or custom duration).
- **FR-011**: System MUST persist the user's last selected tempo, custom pattern, time signature, block count, and practice preferences locally in the browser so that state is maintained across page reloads without requiring user login.
- **FR-012**: System MUST comply with the Zero-Mock UI principle: no mock login forms, fake user avatars, or placeholder profile headers shall be rendered.
- **FR-013**: System MUST support responsive Mobile-First viewports down to 320px width, ensuring all interactive touch targets meet or exceed 44x44px.
- **FR-014**: System MUST emit audio feedback exclusively via acoustic metronome pulses (clear click/woodblock pulses with pitch accent on beat 1 when enabled, plus secondary compound accent on pulse 4 in 6/8), allowing the user to clearly hear their physical guitar without simulated guitar strum sound effects during practice.
- **FR-015**: System MUST focus v1 functionality strictly on rhythm and strumming direction (Downstroke, Upstroke, and Empty slots); chord labeling, progression switching, and chord diagrams are explicitly excluded from v1 scope.
- **FR-016**: System MUST continue looping the strumming pattern and metronome without interruption when the practice timer countdown reaches 00:00, emitting a gentle visual and acoustic completion notification until the user manually pauses or resets playback.
- **FR-017**: System MUST provide keyboard shortcuts for playback control: pressing `SPACE` toggles Pause/Resume (Start/Stop), and pressing `RETURN` (Enter) resets the playhead and playback to the beginning of the measure.
- **FR-018**: System MUST support a configurable Count-In feature with options for 0 (no count-in), 1 measure (default), 2 measures, or 3 measures (for fast tempos), playing audible metronome clicks with a visual countdown indicator before the timeline playhead begins sweeping the pattern.
- **FR-019**: System MUST present all configuration controls (BPM, meter/subdivision, block adder/remover, count-in, accent toggle, timer, presets, and arrow editor) and the animated strumming timeline on a single unified page without requiring tab switching or modal dialogs.
- **FR-020**: System MUST apply all configuration updates dynamically in real time without reloading the page or discarding current session progress.
- **FR-021**: System MUST enforce positional alternating directional strokes by default (Downstroke `↓` on odd slots [impares: 1st, 3rd, 5th, etc.], Upstroke `↑` on even slots [pares: 2nd, 4th, 6th, etc.]) across any block length from 2 to 24 slots (ensuring standard pendulum guitar mechanics in 8th, 16th, 3/4, 6/8, and arbitrary grids). System MUST provide an unobtrusive toggle ("Alternado D/U") to unlock free-form arrow direction where slots can be configured in any arbitrary combination (e.g., DDDU, D-D-U, or custom rhythms).
- **FR-022**: System MUST support configurable metronome subdivisions with dedicated visual buttons for Quarter notes (Negra ♩), Eighth notes (Corcheas ♫), Sixteenth notes (16avas), Triplets (Tresillos), and Shuffle/Swing, synthesizing distinct subordinate click tones for sub-beat divisions.
- **FR-023**: System MUST provide an interactive Tap Tempo ("TAP") control that computes and sets the BPM based on user tap intervals clamped between 40 and 240 BPM.
- **FR-024**: System MUST render real-time beat pulse indicators dynamically adapted to the active time signature (4 dots in 4/4, 3 dots in 3/4, 6 dots in 6/8), highlighting Beat 1 with primary accent emphasis, and Beat 4 with secondary compound accent emphasis in 6/8 meter.
- **FR-025**: System MUST ensure Web Audio initialization is fully decoupled from SSR hydration, using a shared singleton audio context with synchronous gesture unlocking (silent buffer) to prevent silent playback on mobile/WebKit browsers.
- **FR-026**: System MUST utilize a Dual Navigation Architecture: on desktop viewports (>= 768px), navigation between platform tools is hosted in the top header (PlatformHeader); on mobile/phone viewports (< 768px), top header navigation links are hidden to prevent horizontal overflow and replaced with a fixed bottom navigation bar (PlatformBottomNav) with thumb-friendly touch targets (>= 44x44px), active route highlighting, and safe-area inset accommodation.
- **FR-027**: System MUST persist the user's active strumming pattern (preset selection or custom slot edits), time signature, block count, tempo (BPM), subdivision unit, accent preference, strict alternation mode, and metronome subdivision in local storage, automatically restoring them upon return visits when no overriding query parameters are provided.
- **FR-028**: System MUST support URL Query Parameters for configuring and deep-linking strumming setups, supporting parameters: `bpm` (40-240), `meter`/`timeSignature` (`4/4`, `3/4`, `6/8`), `blocks`/`slots` (2-24), `subdivision`/`sub` (`eighth`/`8th`, `sixteenth`/`16th`, `custom`), `preset` (preset identifier), `strokes`/`pattern` (delimited stroke direction sequence `d`, `u`, `-`), `accent` (`1`/`0`), `countIn` (`0`-`3`), `metroSub` (`quarter`, `eighth`, `sixteenth`, `triplet`, `swing`), and `strict` (`1`/`0`).
- **FR-029**: System MUST provide an accessible "Share / Copy Link" button that serializes the current active configuration into a URL, copies it to the system clipboard, and presents immediate visual confirmation ("¡Enlace copiado!" / "Link copied!") with graceful fallback when clipboard API is unavailable.
- **FR-030**: When accessed via a URL containing query parameters, the system MUST parse and validate all parameters, apply them to initialize both the playback engine and the visual timeline, and update local storage so that shared practice configurations are preserved.
- **FR-031**: System MUST compute measure duration dynamically from the active time signature $\text{timeSignature} = [beatsPerMeasure, beatValue]$ using $\text{measureDuration} = \text{beatsPerMeasure} \times \frac{4}{\text{beatValue}} \times \frac{60.0}{\text{BPM}}$, with individual slot duration $\text{slotDuration} = \frac{\text{measureDuration}}{\text{slots.length}}$, driving the Web Audio scheduler and the 60/120 FPS GPU playhead in strict microsecond synchronization across 4/4, 3/4, 6/8, and dynamic block patterns.
- **FR-032**: System MUST synthesize compound meter acoustics for 6/8 time: when accent is enabled, pulse 1 is synthesized with a high-pitch primary accent, pulse 4 is synthesized with a medium-pitch secondary compound accent, and pulses 2, 3, 5, 6 sound as subordinate subdivision clicks.

### Key Entities *(include if feature involves data)*

- **StrummingPattern**: Represents a full measure rhythm configuration, containing:
  - `id`: Unique identifier
  - `name`: Human-readable title (e.g., "Island Strum", "Vals Balada 3/4", "Custom Pattern 1")
  - `timeSignature`: Musical meter represented as `[beatsPerMeasure, beatValue]` (e.g., `[4, 4]`, `[3, 4]`, `[6, 8]`, default `[4, 4]`)
  - `subdivision`: Division unit (`eighth`, `sixteenth`, or `custom`)
  - `slots`: Ordered sequence of `BeatSlot` items (length dynamically configurable between 2 and 24 blocks)
  - `isPreset`: Boolean indicating whether it is a built-in preset or a user-created pattern
  - `ownerId`: Optional user ownership identifier (null/anonymous for guest storage)
  - `createdAt`: ISO 8601 timestamp
  - `updatedAt`: ISO 8601 timestamp
- **BeatSlot**: Represents an individual division slot along the timeline:
  - `index`: Position in the measure (0 to N-1, where $N \in [2, 24]$)
  - `beatLabel`: Musical count label (e.g., "1", "&", "2", "e", "3", "4", "5", "6")
  - `strokeDirection`: Stroke action (`down`, `up`, `none`)
  - `isQuarterBeat`: Boolean indicating if this slot falls on a primary downbeat pulse
  - `isCompoundAccent`: Optional boolean indicating secondary compound downbeat emphasis (e.g., pulse 4 in 6/8 meter)
  - `isMeasureStart`: Boolean indicating if this slot represents the very first beat of the measure
- **MetronomeConfig**: Runtime playback settings:
  - `bpm`: Tempo in beats per minute (40 - 240)
  - `accentFirstBeat`: Boolean flag
  - `countInMeasures`: Number of introductory count-in measures (0, 1, 2, or 3)
  - `soundTheme`: Metronome sound profile (e.g., woodblock, click, digital beep)
  - `subdivision`: Metronome audio division frequency (`quarter`, `eighth`, `sixteenth`, `triplet`, `swing`)
  - `strictAlternation`: Boolean flag enforcing positional alternating Down/Up stroke direction by default (odd slots = Down, even slots = Up) across all block lengths
- **PracticeSession**: Represents session metadata:
  - `targetDurationSeconds`: Goal duration configured on the timer
  - `elapsedSeconds`: Total active practice time accumulated
  - `status`: State of practice (`idle`, `counting-in`, `running`, `paused`, `completed`)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A beginner user can launch the app, select a preset pattern (4/4, 3/4 waltz, or 6/8 ballad), and start practicing with visual feedback in under 10 seconds.
- **SC-002**: The visual playhead sweep and audio metronome remain synchronized within 10 milliseconds of drift over 200 consecutive continuous loops across all supported time signatures and block lengths.
- **SC-003**: 100% of interactive controls (buttons, tempo slider, arrow toggles, preset selector, block adder/remover `+`/`-`) have touch target dimensions of at least 44x44px on mobile devices.
- **SC-004**: Users can customize every slot of an 8-beat pattern, a 3/4 waltz pattern, a 6/8 ballad, or dynamically add/remove blocks, in fewer than 10 taps/clicks using the graphic editor.
- **SC-005**: The application loads and renders the interactive timeline in under 1.5 seconds on a standard 4G mobile connection.
- **SC-006**: Zero mock authentication elements or fake user profiles are rendered in the interface, fulfilling the architectural constitution.

## Assumptions

- **Target Audience**: Beginner to intermediate guitarists learning basic rhythm, strumming hand consistency, atypical meters (3/4 waltzes, 6/8 ballads), and tempo coordination.
- **Guest-First Persistence**: In accordance with the constitution, all patterns, custom meters, block configurations, and session progress are stored transparently in client-side storage (e.g., `localStorage`), structured with an extensible `ownerId` schema ready for cloud synchronization once formal user authentication is developed.
- **Browser Compatibility**: The Web Audio capabilities and visual animations are supported across modern mobile and desktop evergreen browsers (Chrome, Safari iOS, Firefox, Edge).
- **Time Signature & Rhythm Scope**: The platform natively supports standard 4/4 meter, simple triple 3/4 meter, compound duple 6/8 meter, and dynamically variable block lengths (2 to 24 slots), accommodating both basic beginner folk/pop rhythms and atypical song arrangements.
