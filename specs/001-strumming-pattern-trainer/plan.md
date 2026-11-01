# Implementation Plan: Strumming Pattern Trainer

**Branch**: `001-strumming-pattern-trainer` | **Date**: 2026-11-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-strumming-pattern-trainer/spec.md`

## Summary

Build the first application of the Guitar Companion platform: an interactive, visual, and audio-synchronized **Strumming Pattern Trainer** organized as a unified, dynamic single-page dashboard. The tool provides a looping visual measure with directional arrows (`↓`, `↑`, empty), an integrated precision metronome with customizable tempo (40–240 BPM) and beat 1 accent, configurable introductory Count-In (0 to 3 measures), rhythmic subdivision toggles (8th and 16th notes), comprehensive keyboard controls (`SPACE` to pause/resume, `RETURN` to reset to beat 1), a practice timer with non-interrupting loop completion, and beginner pattern presets. All configuration controls update dynamically in real time on the same view as the visual timeline.

The technical architecture adopts **Next.js 15+ (App Router)** with a **Multi-App modular structure**, rendering an SEO-optimized SSR shell with client-side interactive islands. The audio engine uses native **Web Audio API** with a lookahead scheduler (zero clock drift, synthesized sounds), while the playhead animation runs at **60/120 FPS** via GPU transforms driven by `requestAnimationFrame` tied directly to the hardware audio clock.

---

## Technical Context

**Language/Version**: TypeScript 5.5+ (Strict Mode)  
**Primary Dependencies**: Next.js 15+, React 19, Tailwind CSS v4, Lucide React (no heavy audio or animation libraries)  
**Storage**: Client-side `localStorage` with typed abstraction and explicit `ownerId: null` schema (Guest-First, user-migration ready)  
**Testing**: Vitest (unit tests for engine, math, storage), Playwright (E2E for SEO, timeline, and mobile interaction)  
**Target Platform**: Mobile-first evergreen web browsers (iOS Safari, Android Chrome) and desktop browsers (Chrome, Edge, Firefox, Safari)  
**Project Type**: Multi-Application Modular Web Platform  
**Performance Goals**: 60–120 FPS playhead sweep, < 10ms audio clock drift over 200 continuous loops, < 1.5s initial load on 4G  
**Constraints**: Zero-Mock UI (no fake profiles/avatars), Mobile touch targets $\ge 44\times 44$px, Screen Wake Lock during practice, zero external audio asset latency  
**Scale/Scope**: Self-contained application 001 inside the Guitar Companion multi-app repository  

---

## Constitution Check

*GATE: Evaluated before Phase 0 research and re-checked post-Phase 1 design.*

| Principle | Evaluation | Status |
| :--- | :--- | :---: |
| **I. Arquitectura Multi-Aplicación** | Application code is isolated in `src/apps/strumming/` and routes in `src/app/(apps)/strumming/`, consuming only shared primitives from `src/core/`. Adding or removing this app has zero impact on future sibling apps. | **PASS** |
| **II. SEO-First Obligatorio** | App route uses Next.js Server Components with `generateMetadata`, delivering full semantic HTML, Open Graph tags, canonical URL, and Schema.org JSON-LD markup on initial crawlable response. | **PASS** |
| **III. Mobile-First & Desktop** | Tailwind CSS mobile-first styling (`min-width` expansion), touch targets $\ge 44\times 44$px, Screen Wake Lock integration, Dual Navigation Architecture (desktop top header vs mobile fixed bottom navigation bar avoiding top overflow), and desktop layout enrichment. | **PASS** |
| **IV. Modelo Centrado en Usuario (Zero-Mock UI)** | Anonymous guest mode operates completely without fake login badges, fictitious profile avatars, or non-functional logout menus. Storage schema records `ownerId: null` for cloud sync migration readiness. | **PASS** |
| **V. Simplicidad y Rendimiento** | YAGNI strictly observed: zero third-party audio libraries (Tone.js / Howler.js omitted in favor of ~100 lines of native Web Audio synth); GPU-accelerated playhead bypasses React Virtual DOM re-renders. | **PASS** |

---

## Project Structure

### Documentation (this feature)

```text
specs/001-strumming-pattern-trainer/
├── spec.md                  # Feature Specification
├── plan.md                  # This file (/speckit-plan command output)
├── research.md              # Phase 0 output (framework, audio, animation, hardware)
├── data-model.md            # Phase 1 output (entities, types, state transitions)
├── quickstart.md            # Phase 1 output (end-to-end validation guide)
├── contracts/               # Phase 1 output (engine and storage interfaces)
│   ├── engine-api.md
│   └── storage-api.md
└── checklists/
    └── requirements.md      # Specification quality review checklist
```

### Source Code (repository root layout)

```text
guitar-companion/
├── .specify/                         # Spec Kit platform governance
├── public/                           # Static assets, icons, manifest
├── specs/                            # Feature specifications and design
├── src/
│   ├── app/                          # Next.js App Router (Routing & SEO Shell)
│   │   ├── layout.tsx                # Root layout (fonts, global metadata)
│   │   ├── page.tsx                  # Platform home / directory
│   │   ├── globals.css               # Tailwind CSS v4 entry
│   │   └── (apps)/                   # Multi-App route grouping
│   │       └── strumming/
│   │           ├── layout.tsx        # Strumming app SEO layout
│   │           ├── page.tsx          # SSR Page: Semantic SEO guide + Client Player
│   │           └── opengraph-image.tsx
│   ├── apps/                         # Independent Domain Applications
│   │   └── strumming/
│   │       ├── components/           # Strumming UI Components
│   │       │   ├── StrummingPlayer.tsx
│   │       │   ├── VisualTimeline.tsx
│   │       │   ├── BeatSlotBlock.tsx
│   │       │   ├── CountInIndicator.tsx
│   │       │   ├── ControlsBar.tsx
│   │       │   ├── PracticeTimer.tsx
│   │       │   └── PresetSelector.tsx
│   │       ├── engine/               # Audio & Animation Core Engine
│   │       │   ├── WebAudioHost.ts   # AudioContext lifecycle & iOS unlock
│   │       │   ├── LookaheadScheduler.ts # Sub-ms metronome scheduler
│   │       │   ├── MetronomeSynth.ts # Oscillator & Gain synthesis
│   │       │   └── AnimationDriver.ts # rAF GPU playhead driver
│   │       ├── hooks/                # React Integration Hooks
│   │       │   ├── usePlaybackEngine.ts
│   │       │   ├── useKeyboardShortcuts.ts
│   │       │   ├── usePracticeTimer.ts
│   │       │   └── useWakeLock.ts
│   │       ├── presets/              # Beginner Patterns Library
│   │       │   └── beginnerPatterns.ts
│   │       └── storage/              # Domain-specific persistence
│   │           └── strummingStorage.ts
│   └── core/                         # Shared Cross-App Layer
│       ├── audio/                    # Core audio utilities
│       │   └── wakeLock.ts
│       ├── storage/                  # Typed storage primitives
│       │   └── typedStorage.ts
│       ├── ui/                       # Design System Components
│       │   ├── Button.tsx
│       │   ├── Slider.tsx
│       │   └── Badge.tsx
│       └── types/                    # Shared base types
│           └── common.ts
├── tests/
│   ├── unit/                         # Vitest unit tests (engine, math, storage)
│   └── e2e/                          # Playwright E2E tests (SEO, loop, mobile)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

**Structure Decision**: The modular multi-app architecture cleanly isolates `src/apps/strumming/` from `src/core/` and `src/app/`. This guarantees independent domain development, prevents sibling coupling, and enables effortless onboarding of future apps (e.g., `src/apps/tuner/`, `src/apps/chords/`).

---

## Complexity Tracking

> *No constitutional violations or unjustified complexities identified.*
