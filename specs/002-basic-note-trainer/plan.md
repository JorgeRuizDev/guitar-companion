# Implementation Plan: Basic Note Trainer

**Branch**: `002-basic-note-trainer` | **Date**: 2026-11-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-basic-note-trainer/spec.md`

## Summary

Build the **Basic Note Trainer** (`basic-note-trainer`) as an autonomous application in the Guitar Companion ecosystem. The application teaches beginner musicians how to translate between Anglo-Saxon letter notation (A, B, C, D, E, F, G) and traditional European/Latin Solfège (La, Si, Do, Re, Mi, Fa, Sol), as well as master chromatic sequence rules, single accidentals (# / b), and the natural semitones that lack intermediate accidentals (B-C and E-F).

The tool runs an endless continuous practice stream of multiple-choice cards (4 options per card). Users can rapidly retry incorrect answers directly on the card; upon recovering with the correct answer, the interface reveals pedagogical explanations and mnemonic memory tricks (e.g., *"Big Cats Eat Fish"*, A440Hz tuning pitch). The application is fully configurable via URL query parameters (`mode`, `direction`, `difficulty`, `embed`) and supports an embeddable minimal mode (`embed=true`) that suppresses navigation chrome, displays live progress (Okeys vs Failures, streak, accuracy), and dispatches `window.postMessage` events for external host application integration.

---

## Technical Context

**Language/Version**: TypeScript 5.5+ (Strict Mode: `strict: true`)  
**Primary Dependencies**: Next.js 15+ (App Router), React 19, Tailwind CSS v4, Lucide React (zero heavy external theory or game libraries)  
**Storage**: Browser `localStorage` with typed abstraction (`ownerId: null`, guest-first, future sync ready)  
**Testing**: Bun test runner / Vitest (`bun test`)  
**Target Platform**: Mobile-first evergreen web browsers, embedded web-views (iOS WKWebView, Android WebView), desktop iframes  
**Project Type**: Multi-Application Modular Web Platform (Autonomous Domain App)  
**Performance Goals**: < 100ms response time on card tap, < 1.5s initial load on 4G connections (LCP < 2.5s), 60 FPS CSS transitions  
**Constraints**: Zero-Mock UI (no fake user profiles/avatars), touch targets $\ge 44\times 44$px down to 320px viewport, distraction-free embed mode  
**Scale/Scope**: Self-contained domain app `002` isolated in `src/apps/basic-note-trainer/` and route in `src/app/(apps)/basic-note-trainer/`  

---

## Constitution Check

*GATE: Evaluated before Phase 0 research and re-checked post-Phase 1 design.*

| Principle | Evaluation | Status |
| :--- | :--- | :---: |
| **I. Arquitectura Multi-Aplicación** | Application code is isolated in `src/apps/basic-note-trainer/` and route in `src/app/(apps)/basic-note-trainer/`, consuming only shared UI and storage primitives from `src/core/`. Has zero coupling to sibling apps like `strumming`. | **PASS** |
| **II. SEO-First Obligatorio** | App route uses Next.js Server Components with `generateMetadata`, delivering full semantic HTML, Open Graph tags, canonical URL, and Schema.org JSON-LD markup on initial crawlable response (when not in embed mode). | **PASS** |
| **III. Mobile-First & Desktop** | Tailwind CSS mobile-first styling (`min-width` expansion), touch targets $\ge 44\times 44$px, seamless responsiveness down to 320px width, keyboard shortcuts (`Enter`/`Space`) on desktop. | **PASS** |
| **IV. Modelo Centrado en Usuario (Zero-Mock UI)** | Anonymous guest mode operates completely without fake login badges, fictitious profile avatars, or non-functional logout menus. Storage schema records `ownerId: null` for cloud sync migration readiness. | **PASS** |
| **V. Simplicidad y Rendimiento** | YAGNI strictly observed: zero third-party music theory libraries; pure TypeScript domain functions; lightweight state machine without heavy external state libraries. | **PASS** |
| **VI. Idioma Inglés Canónico por Defecto** | System UI labels and controls are in English by default, while training content clearly and accurately presents European Solfège note names (Do, Re, Mi, Fa, Sol, La, Si) and Anglo-Saxon letters (A-G). | **PASS** |

---

## Project Structure

### Documentation (this feature)

```text
specs/002-basic-note-trainer/
├── spec.md                  # Feature Specification
├── plan.md                  # This file (/speckit-plan command output)
├── research.md              # Phase 0 output (music theory, algorithms, embed mode)
├── data-model.md            # Phase 1 output (entities, types, state machine diagram)
├── quickstart.md            # Phase 1 output (end-to-end validation guide)
├── contracts/               # Phase 1 output (interface contracts)
│   ├── url-query-params.md  # URL query parameters contract
│   ├── postmessage-api.md   # Host postMessage event bridge contract
│   └── storage-api.md       # Local storage schema contract
└── checklists/
    └── requirements.md      # Specification quality review checklist
```

### Source Code (repository root layout)

```text
guitar-companion/
├── specs/
│   └── 002-basic-note-trainer/       # Design & planning artifacts
├── src/
│   ├── app/
│   │   └── (apps)/
│   │       └── basic-note-trainer/
│   │           ├── layout.tsx        # SEO & Embed shell layout
│   │           ├── page.tsx          # SSR entry page + Client component island
│   │           └── opengraph-image.tsx
│   ├── apps/
│   │   └── basic-note-trainer/
│   │       ├── domain/               # Pure Music Theory & Logic
│   │       │   ├── musicTheory.ts    # Note systems, accidentals, semitones
│   │       │   ├── mnemonics.ts      # Pedagogical explanations & tips
│   │       │   └── cardGenerator.ts  # Endless question queue & distractor generator
│   │       ├── components/           # UI Presentation Components
│   │       │   ├── NoteTrainerApp.tsx # Main client container
│   │       │   ├── Flashcard.tsx     # Card view, prompt, options grid
│   │       │   ├── LiveProgressBar.tsx # Okeys vs Failures, streak, accuracy
│   │       │   ├── ExplanationModal.tsx # Pedagogical reveal & mnemonic display
│   │       │   └── OptionButton.tsx  # 44px+ touch-friendly option button
│   │       ├── hooks/                # React State & Event Hooks
│   │       │   ├── useTrainerSession.ts # In-place retry state machine & metrics
│   │       │   ├── usePostMessageBridge.ts # Host window.postMessage dispatcher
│   │       │   └── useTrainerKeyboard.ts # Keyboard shortcuts (1-4, Enter, Space)
│   │       ├── storage/              # Local Storage Adapter
│   │       │   └── trainerStorage.ts # Persistent stats adapter
│   │       └── types.ts              # Domain interfaces & type definitions
│   └── core/                         # Shared Cross-App Primitives
│       ├── storage/typedStorage.ts
│       └── ui/
│           ├── Badge.tsx
│           └── Button.tsx
└── tests/
    └── apps/
        └── basic-note-trainer/
            ├── musicTheory.test.ts
            ├── cardGenerator.test.ts
            ├── useTrainerSession.test.ts
            └── queryParams.test.ts
```

**Structure Decision**: Option 1 (Modular App within Monorepo). Application code is strictly encapsulated under `src/apps/basic-note-trainer/`, routes under `src/app/(apps)/basic-note-trainer/`, and unit tests under `tests/apps/basic-note-trainer/`. Shared atomic components come from `src/core/`.

---

## Complexity Tracking

*No constitutional violations or unjustified complexity introduced. All gates pass unconditionally.*
