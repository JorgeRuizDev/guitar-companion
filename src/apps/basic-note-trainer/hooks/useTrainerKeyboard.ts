'use client';

import { useEffect } from 'react';

export interface UseTrainerKeyboardProps {
  optionsCount: number;
  onSelectOptionIndex: (index: number) => void;
  onNextCard: () => void;
  isNextActive: boolean;
  isEnabled?: boolean;
}

export type KeyAction = '1' | '2' | '3' | '4' | 'NEXT' | null;

export function resolveKeyAction(key: string, isNextActive: boolean): KeyAction {
  if (key === '1' || key === 'Digit1' || key === 'Numpad1') return '1';
  if (key === '2' || key === 'Digit2' || key === 'Numpad2') return '2';
  if (key === '3' || key === 'Digit3' || key === 'Numpad3') return '3';
  if (key === '4' || key === 'Digit4' || key === 'Numpad4') return '4';

  if ((key === 'Enter' || key === ' ' || key === 'Space') && isNextActive) {
    return 'NEXT';
  }

  return null;
}

export function useTrainerKeyboard({
  optionsCount,
  onSelectOptionIndex,
  onNextCard,
  isNextActive,
  isEnabled = true,
}: UseTrainerKeyboardProps): void {
  useEffect(() => {
    if (!isEnabled || typeof window === 'undefined') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't intercept when user is in an editable input
      const target = event.target as HTMLElement | null;
      if (target) {
        if (target.isContentEditable || target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
          return;
        }
      }

      const action = resolveKeyAction(event.key, isNextActive);

      if (action === 'NEXT') {
        event.preventDefault();
        onNextCard();
      } else if (action !== null) {
        const optionIndex = parseInt(action, 10) - 1;
        if (optionIndex >= 0 && optionIndex < optionsCount) {
          event.preventDefault();
          onSelectOptionIndex(optionIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEnabled, isNextActive, onNextCard, onSelectOptionIndex, optionsCount]);
}
