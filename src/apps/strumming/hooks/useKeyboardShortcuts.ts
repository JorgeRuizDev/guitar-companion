import { useEffect } from "react";

export interface KeyboardShortcutsProps {
  onTogglePlayPause: () => void;
  onReset: () => void;
  onRestartCountIn?: () => void;
  isEnabled?: boolean;
}

/**
 * useKeyboardShortcuts binds global hotkeys for practice ergonomics:
 * - SPACE: Toggle Play/Pause
 * - BACKSPACE (borrar <-): Reset progress (not the session timer) and return to count-in
 * - RETURN (Enter): Reset / restart with count-in
 */
export function useKeyboardShortcuts({
  onTogglePlayPause,
  onReset,
  onRestartCountIn,
  isEnabled = true,
}: KeyboardShortcutsProps): void {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't intercept if user is typing in a genuine text entry field
      const target = event.target as HTMLElement | null;
      if (target) {
        if (target.isContentEditable || target.tagName === "TEXTAREA") {
          return;
        }
        if (target.tagName === "INPUT") {
          const inputType = (target as HTMLInputElement).type?.toLowerCase();
          const textEntryTypes = [
            "text",
            "search",
            "password",
            "email",
            "number",
            "tel",
            "url",
          ];
          if (textEntryTypes.includes(inputType)) {
            return;
          }
        }
      }

      const isSpace =
        event.code === "Space" ||
        event.key === " " ||
        event.key === "Spacebar" ||
        event.keyCode === 32;

      const isBackspace =
        event.code === "Backspace" ||
        event.key === "Backspace" ||
        event.key === "Delete" ||
        event.code === "Delete" ||
        event.keyCode === 8 ||
        event.keyCode === 46;

      const isReturn =
        event.code === "Enter" ||
        event.code === "NumpadEnter" ||
        event.key === "Enter" ||
        event.key === "Return" ||
        event.keyCode === 13;

      if (isSpace) {
        event.preventDefault();
        event.stopPropagation();
        if (target && target.tagName === "BUTTON") {
          target.blur?.();
        }
        onTogglePlayPause();
      } else if (isBackspace) {
        event.preventDefault();
        event.stopPropagation();
        if (target && target.tagName === "BUTTON") {
          target.blur?.();
        }
        if (onRestartCountIn) {
          onRestartCountIn();
        } else {
          onReset();
        }
      } else if (isReturn) {
        event.preventDefault();
        event.stopPropagation();
        if (target && target.tagName === "BUTTON") {
          target.blur?.();
        }
        if (onRestartCountIn) {
          onRestartCountIn();
        } else {
          onReset();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onTogglePlayPause, onReset, onRestartCountIn, isEnabled]);
}
