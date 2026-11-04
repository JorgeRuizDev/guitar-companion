# Implementation Plan: Basic Chord Trainer

**Branch**: `003-basic-chord-trainer` | **Date**: 2026-11-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-basic-chord-trainer/spec.md`

## Summary

The Basic Chord Trainer is an interactive, standalone and embeddable web tool designed to help guitarists learn open chord fingerings and bridge Anglo-Saxon letter notation and European Solfège notation. The tool supports two complementary training modes ("Draw the Chord" via an interactive 6-string fretboard and "Identify the Chord" via multiple choice recognition), alternating seamlessly by default. It provides a standalone catalog of 22 extended beginner open chords with preset filters and a customized URL embed link generator for native mobile webview integration.

## Technical Context

**Language/Version**: TypeScript 5.x (`strict: true`), React 19, Next.js 15 (App Router).

**Primary Dependencies**: Next.js 15, React 19, Lucide React (UI icons), TailwindCSS v4. Zero third-party audio or chord graphing libraries to maintain minimal bundle weight.

**Storage**: `window.localStorage` through `@/core/storage/typedStorage.ts` under key `guitar_companion_chord_trainer_v1`, conforming to Guest Mode (Zero-Mock UI) with `ownerId: null`.

**Testing**: Bun test runner with preload setup (`bun test --preload ./tests/setup.ts`).

**Target Platform**: Mobile web, desktop browsers, and embedded WebViews (iOS WKWebView / Android WebView) at widths $\ge 320$px, with ultra-compact embed layout fitting heights $\le 480$px.

**Project Type**: Independent client-side application module within Next.js App Router monorepo.

**Performance Goals**: First contentful paint $< 1$s, touch response $< 50$ms, 60fps fretboard interactions, zero layout shifts (CLS $< 0.05$).

**Constraints**:
- Dual notation (English letter + European Solfège) displayed simultaneously across all cards and options.
- Canonical English language default with Spanish locale support via query parameters (`?lang=es` or `?lang=en`) and platform context.
- Full compliance with Constitution Principles I through VI.

**Scale/Scope**: Extended 22-chord beginner open catalog (majors, minors, dominant 7ths, beginner F/Fmaj7, sus variations, Cadd9).

## Constitution Check

*GATE: Passed prior to Phase 0 research. Re-evaluated post-design.*

| Principle | Compliance Assessment | Status |
| :--- | :--- | :--- |
| **I. Independent Multi-App Core** | App domain logic, components, hooks, and types reside strictly in `src/apps/basic-chord-trainer/`. Shared atomic UI and layout reside in `src/core/`. No coupling to other app states. | **PASS** |
| **II. SEO-First per Application** | Dedicated routes `/basic-chord-trainer` and `/basic-chord-trainer/embed`. SSR layout with metadata, canonical links, OpenGraph tags, and JSON-LD `WebApplication` schema. | **PASS** |
| **III. Mobile-First & Dual Navigation** | Responsive SVG fretboard designed for $\ge 320$px viewports with touch targets $\ge 44\times 44$px. Phone header hides overflow links in favor of `PlatformBottomNav`. Embed mode suppresses all navigation chrome. | **PASS** |
| **IV. Zero-Mock UI** | Fully operational in anonymous guest mode. Schema models `ownerId: null` ready for cloud sync without fake user profiles or mock authentication buttons. | **PASS** |
| **V. Simplicity & Performance** | Pure SVG fretboard with no external chord rendering packages; code-split under route `/basic-chord-trainer`. | **PASS** |
| **VI. Canonical English Default** | Default interface, labels, and docstrings in English (`en`), with seamless Spanish (`es`) localization via parameters and provider. | **PASS** |

## Project Structure

### Documentation (this feature)

```text
specs/003-basic-chord-trainer/
├── spec.md              # User requirements & acceptance criteria
├── checklists/
│   └── requirements.md  # Specification quality checklist
├── plan.md              # This implementation plan
├── research.md          # Phase 0 architectural decisions & technical context
├── data-model.md        # Phase 1 entities, types & state machines
├── quickstart.md        # Phase 1 end-to-end validation scenarios
└── contracts/           # Phase 1 interface contracts
    ├── url-query-params.md
    ├── postmessage-api.md
    └── storage-api.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (apps)/
│   │   └── basic-chord-trainer/
│   │       ├── layout.tsx                # Metadata, canonical URLs & JSON-LD
│   │       ├── page.tsx                  # Standalone page with catalog & generator
│   │       ├── opengraph-image.tsx       # Dynamic or static OG preview
│   │       └── embed/
│   │           └── page.tsx              # Ultra-compact webview embed route
│   └── page.tsx                          # Update Home platform catalog card
├── core/
│   ├── i18n/
│   │   ├── types.ts                      # Localized string definitions
│   │   └── translations.ts               # EN/ES dictionary updates
│   └── ui/
│       ├── PlatformHeader.tsx            # Desktop navigation link
│       └── PlatformBottomNav.tsx         # Mobile tab bar 4th item ("Chords")
└── apps/
    └── basic-chord-trainer/
        ├── types.ts                      # Domain interfaces & config types
        ├── domain/
        │   ├── chordCatalog.ts           # 22 beginner open chord definitions & dual names
        │   ├── challengeGenerator.ts     # Generation of Draw & Identify cards
        │   ├── fretboardEvaluator.ts     # String match & diff evaluation
        │   └── queryParams.ts            # URL query parameter parsing & fallback
        ├── hooks/
        │   ├── useChordTrainerSession.ts # State machine (hits, misses, streak, cards)
        │   └── useChordPostMessage.ts    # Host app webview postMessage bridge
        ├── components/
        │   ├── FretboardDiagram.tsx      # SVG interactive fretboard (Draw & Display)
        │   ├── NutStringToggle.tsx       # Nut Open (O) / Muted (X) touch controls
        │   ├── DrawChallenge.tsx         # "Draw the Chord" challenge container
        │   ├── IdentifyChallenge.tsx     # "Identify the Chord" multiple choice
        │   ├── ChordCatalogGrid.tsx      # Interactive catalog browser with presets
        │   ├── EmbedLinkGenerator.tsx    # URL configuration & copy-to-clipboard tool
        │   ├── ChordTrainerApp.tsx       # Core session runner (standalone & embed)
        │   └── BasicChordTrainerContainer.tsx # Full standalone layout wrapper
        └── storage/
            └── chordTrainerStorage.ts    # Guest mode localStorage adapter

tests/
└── apps/
    └── basic-chord-trainer/
        ├── chordCatalog.test.ts          # Catalog completeness, dual names & fingerings
        ├── fretboardEvaluator.test.ts    # Verification logic, muted/open rules
        ├── challengeGenerator.test.ts    # Draw/Identify card generation & alternation
        ├── queryParams.test.ts           # URL parsing & fallback tests
        ├── useChordTrainerSession.test.ts # State machine, streak & scoring tests
        └── postMessageBridge.test.ts     # Webview postMessage protocol verification
```

## Complexity Tracking

No constitutional violations. Zero-mock guest mode and lightweight native SVG components prevent unnecessary complexity.

---

## Migration Addendum (Spec 004 - Interactive Quiz Framework)

- **Status**: Migrated / Integrated.
- **Reference**: [Interactive Quiz Framework Spec](../../specs/004-interactive-quiz-framework/spec.md).
- **Architecture**:
  - The 22 beginner open chords from `chordCatalog.ts` are cataloged and exported in modular JSON pack `src/content/quizzes/topics/open-chords.json` with sister questions ("identify" and "draw") sharing `familyIds`.
  - Visual diagram `FretboardDiagram` is registered with the decoupled visual registry (`visualRegistry.register('fretboard-diagram', FretboardDiagramAdapter)`).
  - Backward compatibility: 100% maintained for existing routes (`/basic-chord-trainer`, `/basic-chord-trainer/embed`), URL parameters, and interactive chord editor.
