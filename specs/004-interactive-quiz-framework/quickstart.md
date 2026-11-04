# Quickstart & Verification Guide: Interactive Learning & Quiz Framework

**Branch**: `004-interactive-quiz-framework` | **Date**: 2026-11-04 | **Feature**: [spec.md](./spec.md)

This document provides instructions for validating the quiz framework, running schema validations, executing automated unit tests, and verifying the interactive runner.

---

## 1. Prerequisites & Environment

Ensure dependencies are installed and test environment is ready:

```bash
# Verify Bun runtime
bun --version

# Run test suite preload check
bun test --preload ./tests/setup.ts
```

---

## 2. Automated Test Execution

### 2.1 Validate Question Packs Schema

Every JSON pack in `src/content/quizzes/` is validated against the Zod schema:

```bash
bun test tests/unit/core/quiz/validatePacks.test.ts
```
**Expected Outcome**: All packs pass syntax, schema structure, ID uniqueness, and valid family ID associations.

### 2.2 Verify Multi-Family Mutual Exclusion & Carousel Invariants

Run the unit tests for the carousel session state machine:

```bash
bun test tests/unit/core/quiz/useQuizSession.test.ts
```
**Expected Outcome**:
- 0% question repetition in any session.
- Questions sharing any `familyId` with an answered question are completely excluded.
- Single-choice and multiple-choice all-or-nothing scoring operates with accurate false positive/negative diagnostics.
- Streak increments on hit, resets on miss.

### 2.3 Verify URL Query Parameters & Dynamic Filter Combinations

```bash
bun test tests/unit/core/quiz/urlParams.test.ts
```
**Expected Outcome**: Range filters like `courses=1-5`, notation filters, and difficulty filters properly narrow the pool without latency.

---

## 3. End-to-End Visual Verification

1. Start development server or rebuild container:
   ```bash
   bun run docker:reload
   # Or for local development:
   bun run dev
   ```

2. Open the generic Quiz Runner in your browser:
   - Base runner: `http://localhost:3100/quiz`
   - Course range filter: `http://localhost:3100/quiz?courses=1-3&difficulty=beginner`
   - Notation filter (Letters only): `http://localhost:3100/quiz?notation=letters`
   - Embed mode in constrained webview: `http://localhost:3100/quiz?embed=true&compact=true`

3. Verify user interaction:
   - Answering correctly advances to the next question with positive feedback.
   - Answering incorrectly displays the rich remediation card with theoretical explanation, mnemonic, and visual cue.
   - Verify that no sister variants of that concept reappear during the session.
