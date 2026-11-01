import { describe, it, expect } from 'vitest';
import { resolveKeyAction } from '@/apps/basic-note-trainer/hooks/useTrainerKeyboard';

describe('useTrainerKeyboard logic', () => {
  it('correctly maps digit keys to option choices 1 to 4', () => {
    expect(resolveKeyAction('1', false)).toBe('1');
    expect(resolveKeyAction('2', false)).toBe('2');
    expect(resolveKeyAction('3', false)).toBe('3');
    expect(resolveKeyAction('4', false)).toBe('4');

    expect(resolveKeyAction('Digit1', false)).toBe('1');
    expect(resolveKeyAction('Numpad3', false)).toBe('3');
  });

  it('handles Enter and Space for advancing to next card only when next is active', () => {
    expect(resolveKeyAction('Enter', false)).toBeNull();
    expect(resolveKeyAction(' ', false)).toBeNull();

    expect(resolveKeyAction('Enter', true)).toBe('NEXT');
    expect(resolveKeyAction(' ', true)).toBe('NEXT');
    expect(resolveKeyAction('Space', true)).toBe('NEXT');
  });

  it('ignores unrelated keys', () => {
    expect(resolveKeyAction('a', true)).toBeNull();
    expect(resolveKeyAction('5', true)).toBeNull();
    expect(resolveKeyAction('Escape', true)).toBeNull();
  });
});
