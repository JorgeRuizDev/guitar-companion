# Technical Research: Strumming Pattern Trainer

**Feature**: `001-strumming-pattern-trainer`  
**Date**: 2026-11-01  
**Status**: Completed  

---

## 1. Web Framework & Routing Architecture

### Decision
Adopt **Next.js 15+ (App Router, React 19, TypeScript)** configured with modular domain boundaries for multi-app coexistence.

### Rationale
- **SEO-First Mandate**: Native Server Components and the `generateMetadata` API enable server-rendered semantic HTML, Open Graph tags, canonical URLs, and structured JSON-LD data for the strumming trainer and each future application.
- **Multi-App Coexistence**: Next.js App Router route groups (`app/(apps)/strumming/...`) allow each application to maintain its own routes, layouts, and metadata without leaking dependencies or styling conflicts to sibling apps.
- **Automatic Code Splitting**: Built-in route-based code splitting ensures that users opening the strumming trainer only download the code for this tool, keeping initial bundle size minimal.

### Alternatives Considered
- **Astro 5**: Exceptional static performance and islands architecture, but Next.js offers a more integrated ecosystem for rich dynamic client transitions, shared state patterns, and uniform full-stack contracts across future complex apps.
- **Single Page App (Vite + React)**: Rejected because it delivers an empty `<div id="root"></div>` on initial load, failing the strict constitutional requirement for SEO and server-side crawlability.

---

## 2. High-Precision Audio Scheduling & Synthesis

### Decision
Implement the **Web Audio API Hardware Clock** using the **Lookahead Scheduler Pattern** and synthesize metronome pulses using native `OscillatorNode` and `GainNode`.

### Rationale
- **Elimination of Clock Drift**: JavaScript's standard `setInterval` or `setTimeout` mechanisms drift by 15–80 ms under garbage collection or main thread UI activity. The Web Audio `AudioContext.currentTime` operates on a dedicated hardware audio thread with sub-millisecond precision.
- **Lookahead Pattern**: A timer loop on the main thread polls every 25 ms, scheduling sound events in a future window of 100 ms into `AudioContext.currentTime`. If the main thread temporarily lags, scheduled audio events still fire at the exact microsecond without stutter.
- **Zero Asset Latency & Instant Offline Support**: Synthesizing the metronome sound (sine/triangle wave with sharp exponential decay) requires 0 KB of network transfer, eliminates audio decoding delays, and works completely offline.
- **Beat 1 Accentuation**: Achieved by modulating frequency (e.g., 1000 Hz for Beat 1 vs. 600 Hz for standard beats) and gain envelope.

### Alternatives Considered
- **Tone.js**: Powerful but introduces ~150 KB of third-party bundle weight. A lightweight native implementation (~100 lines of clean TypeScript) fully satisfies the metronome requirements with zero external dependencies (adhering to the YAGNI principle).
- **Howler.js**: Designed for audio sample playback; lacks a lookahead musical scheduler and adds unnecessary overhead.

---

## 3. High-Frame-Rate (60/120 FPS) Visual Synchronization

### Decision
Implement **Direct DOM GPU Transforms via `requestAnimationFrame`** coupled directly to `audioContext.currentTime`.

### Rationale
- **Playhead Rendering**: The playhead line is a single absolute `div` with `will-change: transform`. On every animation frame, its horizontal translation is calculated from:
  $$\text{progress} = \frac{(\text{audioContext.currentTime} - \text{loopStartTime}) \pmod{\text{measureDuration}}}{\text{measureDuration}}$$
- **Virtual DOM Protection**: The frame loop directly mutates `playheadRef.current.style.transform = "translate3d(" + px + "px, 0, 0)"`. It completely bypasses React state (`useState`), eliminating Virtual DOM reconciliation at 60/120 FPS and preventing UI jank.
- **Semantic HTML & Responsiveness**: The fretboard strings, measure blocks, and arrows remain semantic HTML/CSS elements styled via Tailwind CSS, ensuring accessibility and seamless responsive scaling down to 320px screens.

### Alternatives Considered
- **React State at 60Hz (`useState(currentPosition)`)**: Triggers 60+ re-renders per second, starving the main thread and causing visible stutters and audio dropouts.
- **HTML5 `<canvas>`**: Provides high rendering performance but makes responsive scaling on mobile complex, sacrifices native DOM accessibility, and complicates touch target detection for arrow toggles.

---

## 4. Mobile Ergonomics & Hardware Integration

### Decision
Implement **Screen Wake Lock API** and an **Audio Context User Gesture Resume** handler.

### Rationale
- **Screen Wake Lock**: Prevents mobile screens from dimming or going to sleep while the guitarist practices with both hands on their instrument. It activates automatically when playback starts and releases on pause.
- **iOS Safari Audio Policy**: Browsers block audio playback until user interaction. A clean initialization wrapper captures the first user tap (Play button) to execute `audioContext.resume()` synchronously before starting the scheduler.
- **Touch Target Compliance**: In accordance with the Constitution, all interactive elements (arrows, buttons, BPM sliders, presets) are bounded to a minimum touch target area of 44x44px.

---

## 5. Client-Side Persistence & Future User Migration

### Decision
Implement a **Typed Local Storage Adapter** storing pattern configurations and session metrics with an explicit `ownerId: null` field.

### Rationale
- **Zero-Mock UI Compliance**: No fake login forms or avatars are displayed in the UI.
- **Forward Compatibility**: The data schema matches the domain model entity contracts. When real authentication is introduced in future platform milestones, a migration utility can easily associate local records where `ownerId === null` with the authenticated `userId`.
