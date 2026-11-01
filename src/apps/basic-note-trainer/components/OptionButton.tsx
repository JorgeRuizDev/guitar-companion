'use client';

import React from 'react';

export interface OptionButtonProps {
  label: string;
  index: number; // 0, 1, 2, 3 (for hotkeys 1, 2, 3, 4)
  isCorrect?: boolean;
  isIncorrect?: boolean;
  isDisabled?: boolean;
  compact?: boolean;
  onClick: (label: string) => void;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  label,
  index,
  isCorrect = false,
  isIncorrect = false,
  isDisabled = false,
  compact = false,
  onClick,
}) => {
  const shortcutKey = index + 1;

  // Compute styling based on state
  let buttonStyle =
    'bg-neutral-900/90 text-neutral-100 border-neutral-700 hover:border-amber-500/60 hover:bg-neutral-800 active:scale-[0.98]';

  if (isCorrect) {
    buttonStyle =
      'bg-emerald-600/30 text-emerald-300 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)] font-bold';
  } else if (isIncorrect) {
    buttonStyle =
      'bg-rose-950/40 text-rose-400/80 border-rose-800/80 line-through opacity-60 cursor-not-allowed';
  } else if (isDisabled) {
    buttonStyle =
      'bg-neutral-900/40 text-neutral-500 border-neutral-800/60 cursor-not-allowed opacity-50';
  }

  const heightClass = compact ? 'min-h-[46px] p-2.5 sm:p-3' : 'min-h-[56px] p-4';

  return (
    <button
      type="button"
      disabled={isDisabled || isIncorrect || isCorrect}
      onClick={() => onClick(label)}
      aria-label={`Option ${shortcutKey}: ${label}`}
      className={`relative flex items-center justify-center min-w-[46px] rounded-xl border-2 transition-all duration-150 select-none font-semibold tracking-wide ${heightClass} ${buttonStyle}`}
    >
      {/* Keyboard shortcut hint (hidden on compact/tiny screens) */}
      {!compact && (
        <span className="absolute top-2 left-2 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-800/80 text-neutral-400 hidden sm:inline-block">
          {shortcutKey}
        </span>
      )}

      {/* Button label */}
      <span
        className={
          label.length > 6
            ? 'text-xs sm:text-sm text-center leading-tight'
            : compact
            ? 'text-lg sm:text-xl'
            : 'text-xl md:text-2xl'
        }
      >
        {label}
      </span>

      {/* Visual Status Icons */}
      {isCorrect && (
        <span className={`absolute right-2.5 text-emerald-400 ${compact ? 'text-base' : 'text-lg'}`}>
          ✓
        </span>
      )}
      {isIncorrect && (
        <span className={`absolute right-2.5 text-rose-500 font-mono ${compact ? 'text-xs' : 'text-sm'}`}>
          ✕
        </span>
      )}
    </button>
  );
};
