# Research & Technical Decisions: Basic Note Trainer

**Feature Branch**: `002-basic-note-trainer`  
**Date**: 2026-11-01  
**Status**: Completed  

---

## 1. Musical Theory Engine & Note System Mappings

### Context
The trainer must provide rock-solid bidirectional translation between Anglo-Saxon letters (A, B, C, D, E, F, G) and European/Latin Solfège (La, Si, Do, Re, Mi, Fa, Sol), as well as teach the 12-pitch chromatic sequence and which natural notes have accidentals vs natural semitones.

### Decision
Implement a pure, zero-dependency TypeScript music theory module (`src/apps/basic-note-trainer/domain/musicTheory.ts`):
1. **Diatonic Natural Notes**: Define canonical mapping between 7 diatonic notes:
   - `C` $\leftrightarrow$ `Do`
   - `D` $\leftrightarrow$ `Re`
   - `E` $\leftrightarrow$ `Mi`
   - `F` $\leftrightarrow$ `Fa`
   - `G` $\leftrightarrow$ `Sol`
   - `A` $\leftrightarrow$ `La`
   - `B` $\leftrightarrow$ `Si`
2. **Chromatic Semitone Structure**:
   - The 12 chromatic pitch classes: `C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab, A, A#/Bb, B`.
   - **Natural Semitones (no intermediate accidental)**: `B-C` (Si-Do) and `E-F` (Mi-Fa).
   - **Natural Whole Tones (with intermediate accidental)**: `C-D`, `D-E`, `F-G`, `G-A`, `A-B`.
3. **Mnemonic & Pedagogical Catalog**:
   - `B-C` / `E-F`: *"Big Cats Eat Fish"* / *"Si-Do y Mi-Fa no tienen sostenido intermedio"*.
   - `A` / `La`: *"A is La: standard tuning fork frequency 440Hz / la nota de afinar"*.
   - `C` / `Do`: *"Do-Re-Mi starts on C, the baseline key without accidentals"*.
   - `E` / `Mi`: *"E is Mi: lowest and highest strings on standard guitar"*.
   - `G` / `Sol`: *"G is Sol: like the Treble clef (Clave de Sol) centered on line G"*.

### Rationale
- Pure functions without external libraries guarantee ultra-fast execution (< 1ms), 100% unit-testable assertions, and zero bundle bloat.
- Strict enums/unions prevent runtime invalid note states.

### Alternatives Considered
- *Using Tonal.js or Teoria.js*: Evaluated, but rejected per Constitution Principle V (Simplicity & YAGNI). Adding a full music theory package for 7 diatonic notes and 12 chromatic steps adds ~30-50KB of unnecessary bundle weight for simple logic.

---

## 2. Card Generation & Spaced Reinforcement Queue

### Context
Cards must be served in an endless continuous stream with 4 multiple-choice options (1 correct answer and 3 distinct plausible distractors). If a user misses a card, that note concept should reappear later in the session for reinforcement.

### Decision
Implement a lightweight session queue manager (`src/apps/basic-note-trainer/domain/cardGenerator.ts`):
1. **Question Types**:
   - `LETTER_TO_SOLFEGE`: Given Letter (e.g. "G"), select Solfège ("Sol").
   - `SOLFEGE_TO_LETTER`: Given Solfège (e.g. "Re"), select Letter ("D").
   - `HAS_ACCIDENTAL`: "Does E have a sharp in the natural diatonic scale?" (Yes / No / Depends).
   - `NATURAL_SEMITONE`: "Which pair of natural notes has NO sharp or flat between them?" (e.g. "E - F" vs "C - D", "G - A", "F - G").
   - `NEXT_CHROMATIC`: "What note is one half-step above F?" ("F# / Gb").
2. **Distractor Generation**:
   - Always generates 3 unique incorrect options from the same domain pool (e.g., if asking for a Solfège note, all 4 options are valid Solfège names).
   - Randomizes the position of the correct answer using Fisher-Yates shuffle.
3. **Adaptive Reinforcement Queue**:
   - When a card suffers one or more failures, its `noteReference` is pushed into a `reviewBuffer` (cooldown of 3-5 cards). The generator pulls from `reviewBuffer` before generating new random cards.

### Rationale
- Keeps practice engaging, eliminates trivial repetitive patterns, and provides genuine pedagogical reinforcement without complicated external database requirements.

### Alternatives Considered
- *Completely random generation without memory*: Causes rapid back-to-back duplicate questions and fails to reinforce weak concepts.
- *Full SuperMemo SM-2 algorithm*: Overkill for a quick-fire session-based mini-app.

---

## 3. Flashcard State Machine & In-Place Retry Flow

### Context
Per User Clarification Q1: When a user selects a wrong answer, they can quickly try remaining options on the same card. The chosen incorrect button turns red and disabled. When the correct answer is selected after a miss, the system reveals the full pedagogical explanation and mnemonic, requiring an explicit "Next Card" action to advance. Direct hits (0 prior misses) transition automatically.

### Decision
Implement a formalized React reducer / state machine (`useTrainerSession.ts`):
- **Card States**:
  - `IDLE`: Question displayed, all 4 options enabled.
  - `RETRYING`: User made $\ge 1$ mistake on this card.
    - Total session `failures` incremented.
    - Current streak reset to 0.
    - Selected incorrect option added to `disabledOptions` with red error styling.
    - Quick hint displayed.
    - Other options remain clickable.
  - `SOLVED_DIRECT`: User hit the correct option on first attempt (0 misses on this card).
    - Total session `okeys` incremented.
    - Current streak incremented.
    - Correct button turns green.
    - Auto-advances to next card after 400ms.
  - `SOLVED_AFTER_ERROR`: User hit correct option after $\ge 1$ miss.
    - Total session `okeys` incremented (card resolved).
    - Correct button turns green.
    - Full pedagogical box expands showing explanation and mnemonic trick.
    - "Next Card" button appears (and `Enter` / `Space` shortcut active).

### Rationale
- Completely eliminates user frustration while fulfilling the user's explicit requirement: *"Si se acierta tras un fallo, se debe explicar el por qué esa forma, alguna pista, truco mnemotécnico..."*.

---

## 4. Web-View Embedding & Minimalist UI Mode

### Context
Per user prompt and Constitution Principle III: The app may be embedded inside another app (e.g. Flutter, React Native, or desktop web-view) or viewed standalone. In embed mode, headers and footers must be suppressed, and the UI must fit down to 320px viewport without scrollbars.

### Decision
1. **Route Architecture**:
   - Primary route: `/basic-note-trainer` (within Next.js App Router).
2. **Query Parameter Handling**:
   - Parse `searchParams`:
     - `embed`: `'true' | 'false'` (default: `'false'`)
     - `mode`: `'translation' | 'accidentals' | 'mixed'` (default: `'mixed'`)
     - `direction`: `'letters-to-solfege' | 'solfege-to-letters' | 'both'` (default: `'both'`)
     - `difficulty`: `'beginner' | 'intermediate' | 'advanced'` (default: `'beginner'`)
3. **Embed Layout Component**:
   - When `embed === true`:
     - Renders directly without global navigation headers, platform branding, or footers.
     - Root container uses `h-full w-full min-h-screen flex flex-col justify-between p-3 bg-neutral-950 text-neutral-100`.
     - Touch targets strictly enforced $\ge 44\times 44$px.
   - When `embed !== true`:
     - Renders within standard Guitar Companion application shell with SEO header, breadcrumb navigation, and practice tools drawer.

### Rationale
- Clean separation between embedded widget mode and standalone discovery page while sharing 100% of domain and component code.

---

## 5. Live Progress Tracking & External Host postMessage Bridge

### Context
Per User Clarification Q2 & Q3: The session runs as an endless stream controlled by the external app. The UI must prominently display live progress ("Okeys vs Failures", streak, accuracy %). When embedded, it should also emit events to `window.parent`.

### Decision
1. **Live Header Display**:
   - Displays a compact, sticky top bar:
     - **Okeys**: Green badge with checkmark and count.
     - **Failures**: Red badge with cross and count.
     - **Streak**: Amber flame icon with current streak.
     - **Accuracy**: Percentage badge ($Okeys / (Okeys + Failures) \times 100\%$).
2. **postMessage Event Bridge**:
   - Dispatches structured events to `window.parent`:
     ```typescript
     window.parent.postMessage({
       source: 'guitar-companion-note-trainer',
       event: 'NOTE_ANSWER',
       payload: {
         isCorrectFirstTry: boolean,
         totalOkeys: number,
         totalFailures: number,
         currentStreak: number,
         accuracy: number,
         notePrompt: string,
         correctAnswer: string
       }
     }, '*');
     ```
   - Wrapped safely in browser environment check (`typeof window !== 'undefined' && window.parent !== window`).

### Rationale
- Gives host applications full visibility and programmatic control without coupling to specific wrapper frameworks.

---

## 6. Client Storage & Zero-Mock UI

### Context
Constitution Principle IV prohibits fake profiles and requires anonymous guest mode with migration-ready local storage.

### Decision
- Store high scores and cumulative practice stats under typed storage key: `guitar-companion:basic-note-trainer:stats`.
- Storage schema includes `ownerId: null` ready for future authentication synchronization.
- No dummy avatars or mock logout buttons.
