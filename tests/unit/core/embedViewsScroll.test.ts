import { describe, it, expect } from 'vitest';
import React from 'react';
import { OptionButton } from '@/core/ui/OptionButton';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('OptionButton Component & Shared UI (User Story 3 & 4)', () => {
  it('renders correctly with label and shortcut index', () => {
    const element = OptionButton({
      label: 'C (Do)',
      index: 0,
      onClick: () => {},
    });

    expect(element).toBeDefined();
    expect(element.props['aria-label']).toContain('Option 1: C (Do)');
    expect(element.props.disabled).toBe(false);
  });

  it('renders correct state with emerald style and checkmark', () => {
    const element = OptionButton({
      label: 'Am (La m)',
      index: 1,
      isCorrect: true,
      onClick: () => {},
    });

    expect(element.props.disabled).toBe(true);
    expect(element.props.className).toContain('border-emerald-500');
  });

  it('renders incorrect state with line-through and rose border', () => {
    const element = OptionButton({
      label: 'G7 (Sol 7)',
      index: 2,
      isIncorrect: true,
      onClick: () => {},
    });

    expect(element.props.disabled).toBe(true);
    expect(element.props.className).toContain('line-through');
    expect(element.props.className).toContain('border-rose-800');
  });
});

describe('Embed Views Layout & Scroll Configuration', () => {
  it('ensures basic-note-trainer embed page uses justify-start and overflow-y-auto without overflow-hidden', () => {
    const filePath = join(process.cwd(), 'src/app/(apps)/basic-note-trainer/embed/page.tsx');
    const content = readFileSync(filePath, 'utf-8');

    expect(content).toContain('justify-start');
    expect(content).toContain('items-center');
    expect(content).toContain('overflow-y-auto');
    expect(content).toContain('overscroll-y-contain');
    expect(content).not.toContain('overflow-hidden');
    expect(content).not.toContain('justify-center');
    expect(content).not.toContain('my-auto');
  });

  it('ensures basic-chord-trainer embed page uses justify-start and overflow-y-auto without overflow-hidden', () => {
    const filePath = join(process.cwd(), 'src/app/(apps)/basic-chord-trainer/embed/page.tsx');
    const content = readFileSync(filePath, 'utf-8');

    expect(content).toContain('justify-start');
    expect(content).toContain('items-center');
    expect(content).toContain('overflow-y-auto');
    expect(content).toContain('overscroll-y-contain');
    expect(content).not.toContain('overflow-hidden');
    expect(content).not.toContain('justify-center');
    expect(content).not.toContain('my-auto');
  });

  it('ensures BasicNoteTrainerContainer embed mode uses justify-start and scrollable container', () => {
    const filePath = join(process.cwd(), 'src/apps/basic-note-trainer/components/BasicNoteTrainerContainer.tsx');
    const content = readFileSync(filePath, 'utf-8');

    expect(content).toContain('justify-start');
    expect(content).toContain('overflow-y-auto');
    expect(content).not.toContain('overflow-hidden');
    expect(content).not.toContain('justify-center');
  });

  it('ensures BasicChordTrainerContainer supports embed mode with justify-start and scrollable container', () => {
    const filePath = join(process.cwd(), 'src/apps/basic-chord-trainer/components/BasicChordTrainerContainer.tsx');
    const content = readFileSync(filePath, 'utf-8');

    expect(content).toContain('initialConfig?.embed');
    // Extract embed branch
    const embedBlock = content.match(/if\s*\(initialConfig\?\.embed\)\s*\{([^}]+)\}/)?.[1] || '';
    expect(embedBlock).toContain('justify-start');
    expect(embedBlock).toContain('overflow-y-auto');
    expect(embedBlock).not.toContain('overflow-hidden');
    expect(embedBlock).not.toContain('justify-center');
  });

  it('ensures IdentifyChallenge uses a 2x2 grid (grid-cols-2) and uses OptionButton', () => {
    const filePath = join(process.cwd(), 'src/apps/basic-chord-trainer/components/IdentifyChallenge.tsx');
    const content = readFileSync(filePath, 'utf-8');

    expect(content).toContain('grid-cols-2');
    expect(content).not.toContain('grid-cols-1');
    expect(content).toContain('OptionButton');
  });
});
