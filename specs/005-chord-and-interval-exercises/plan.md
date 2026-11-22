# Implementation Plan: Chord Notes Drag-and-Drop & Musical Intervals

**Branch**: `005-chord-and-interval-exercises` | **Date**: 2026-11-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-chord-and-interval-exercises/spec.md`

## Summary

This feature delivers three educational enhancements to the Guitar Companion platform:
1. **Interactive Chord Notes Identification & Holistic Configuration**: Given an open chord diagram, learners assign note tokens from the upper bank (positioned above the diagram to avoid overflow) onto finger dots or open nut positions on the fretboard. Tokens are placed immediately without premature rejection. The bank contains unique chord notes plus 2 non-chord distractors. Reusable tokens allow covering octave duplicates. Validation occurs holistically upon clicking "Comprobar" (Submit configuration). Erroneous strings are highlighted in red for learning and revision ("Si fallas una nota no aprendes del todo"). Upon full verification, harmonic roles (Tónica, 3ª, 5ª) are revealed.
2. **Root Indicator Spoiler Suppression in `DrawChallenge`**: In the chord completion exercise, the root string indicator badge ("R") is strictly hidden during the active attempt, appearing only after submission/evaluation or hint requests.
3. **Musical Interval Training ("Intervalos") with Dual Notation**: Comprehensive interval identification and calculation training covering 2nds, 3rds, 4ths, 5ths, 6ths, 7ths, and octaves, with strict Anglo-Saxon letters (A–G) and Solfège (Do–Si) segregation, integrated both in Basic Note Trainer (`mode=intervals`) and the Interactive Quiz Framework.

## Technical Context

**Language/Version**: TypeScript 5.7+ (strict mode), Next.js 15 (App Router), React 19

**Primary Dependencies**: React 19, Tailwind CSS v4, Lucide React, Zod (no external drag libraries needed)

**Storage**: Local browser storage (`typedStorage`, Guest Mode, Zero-Mock UI compliant)

**Testing**: Bun test runner (`bun test --preload ./tests/setup.ts`) with Vitest compatible syntax

**Target Platform**: Responsive Web (Mobile-First 320px+ viewports, Desktop, and embedded WebView containers)

**Project Type**: Multi-app educational web platform with domain-agnostic quiz engine

**Performance Goals**: Core Web Vitals (INP < 200ms, LCP < 2.5s, CLS < 0.1), 60fps drag/pointer animations

**Constraints**: Zero external bundle bloat for drag gestures (PointerEvents + tap-to-place fallback); strict mobile overflow prevention

**Scale/Scope**: Open major & minor guitar chords initially, architected for future barre chords; 12 diatonic/chromatic intervals

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Principle I: Independent Multi-App Core**: Basic Chord Trainer and Basic Note Trainer remain autonomous apps sharing domain music primitives via pure utilities.
- [x] **Principle II: SEO-First per Application**: SSR/SSG preserved; canonical URLs and metadata intact.
- [x] **Principle III: Mobile-First with High-End Desktop**: Note balls placed at the top of the diagram above overflow; minimum 44x44px touch targets; tap-to-place accessible fallback.
- [x] **Principle IV: Zero-Mock UI**: Honest UI; anonymous guest stats persisted in local storage; no fake avatars or profile menus.
- [x] **Principle V: Simplicity & Web Performance**: No heavy external drag libraries (`dnd-kit`); pure React pointer events.
- [x] **Principle VI: Canonical English with Spanish Support**: English canonical system language with full Spanish translations.
- [x] **Principle VII: URL-Driven Quiz Engine**: Intervals quiz pack integrates with the agnostic URL-driven quiz engine (`notation=letters|solfege`).
- [x] **Principle VIII: Dual Musical Notation & Theoretical Foundations**: Full letters/solfege parity, strict notation filtering, and semitone-based interval remediation.

## Project Structure

### Documentation (this feature)

```text
specs/005-chord-and-interval-exercises/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Interface contracts
│   ├── chord-notes.contract.ts
│   └── intervals.contract.ts
└── checklists/
    └── requirements.md  # Quality checklist
```

### Source Code

```text
src/
├── apps/
│   ├── basic-chord-trainer/
│   │   ├── components/
│   │   │   ├── ChordNotesChallenge.tsx      # [NEW] Drag-and-drop chord notes component
│   │   │   ├── FretboardDiagram.tsx         # [MODIFY] Add showRootIndicator & harmonicLabels
│   │   │   ├── DrawChallenge.tsx            # [MODIFY] Hide root indicator during pending attempt
│   │   │   ├── ChordTrainerApp.tsx          # [MODIFY] Add 'chord-notes' challenge routing
│   │   │   └── BasicChordTrainerContainer.tsx # [MODIFY] Add 'chord-notes' mode option
│   │   ├── domain/
│   │   │   ├── harmonicAnalysis.ts          # [NEW] Pure domain pitch & interval analyzer for chord voicings
│   │   │   ├── challengeGenerator.ts        # [MODIFY] Add generateChordNotesChallenge
│   │   │   └── queryParams.ts               # [MODIFY] Support mode='chord-notes'
│   │   └── types.ts                         # [MODIFY] Extend PracticeMode and ChallengeType
│   │
│   └── basic-note-trainer/
│       ├── domain/
│       │   ├── musicTheory.ts               # [MODIFY] Add interval taxonomy & transpositions
│       │   ├── cardGenerator.ts             # [MODIFY] Add generateIntervalQuestion
│       │   └── queryParams.ts               # [MODIFY] Add 'intervals' mode support
│       └── types.ts                         # [MODIFY] Add TrainerMode 'intervals'
│
├── content/
│   └── quizzes/
│       ├── manifest.json                    # [MODIFY] Register intervals topic pack
│       └── topics/
│           └── intervals/
│               └── 01-musical-intervals.yml # [NEW] Dual-notation quiz questions for intervals
│
tests/
└── unit/
    ├── basic-chord-trainer/
    │   ├── harmonicAnalysis.test.ts         # [NEW] Unit tests for chord notes & distractors
    │   └── rootIndicatorSuppression.test.ts # [NEW] Unit tests for root badge visibility
    ├── basic-note-trainer/
    │   └── intervals.test.ts                # [NEW] Unit tests for interval questions & notation
    └── core/quiz/
        └── intervalQuestions.test.ts        # [NEW] Unit tests for quiz intervals pack
```

## Complexity Tracking

*No constitutional violations. All implementations adhere strictly to core principles.*
