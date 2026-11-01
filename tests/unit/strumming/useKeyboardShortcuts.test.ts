import { describe, it, expect, vi } from "vitest";

describe("useKeyboardShortcuts logic", () => {
  it("determines whether hotkeys should be processed based on target element and key event", () => {
    const isTextInput = (target: { tagName: string; isContentEditable?: boolean; type?: string }) => {
      if (target.isContentEditable || target.tagName === "TEXTAREA") return true;
      if (target.tagName === "INPUT") {
        const textEntryTypes = ["text", "search", "password", "email", "number", "tel", "url"];
        return textEntryTypes.includes(target.type?.toLowerCase() || "");
      }
      return false;
    };

    const isBackspaceKey = (event: { key?: string; code?: string; keyCode?: number }) => {
      return (
        event.code === "Backspace" ||
        event.key === "Backspace" ||
        event.key === "Delete" ||
        event.code === "Delete" ||
        event.keyCode === 8 ||
        event.keyCode === 46
      );
    };

    const isReturnKey = (event: { key?: string; code?: string; keyCode?: number }) => {
      return (
        event.code === "Enter" ||
        event.code === "NumpadEnter" ||
        event.key === "Enter" ||
        event.key === "Return" ||
        event.keyCode === 13
      );
    };

    const isSpaceKey = (event: { key?: string; code?: string; keyCode?: number }) => {
      return (
        event.code === "Space" ||
        event.key === " " ||
        event.key === "Spacebar" ||
        event.keyCode === 32
      );
    };

    // Range slider and checkboxes should NOT block hotkeys
    expect(isTextInput({ tagName: "INPUT", type: "range" })).toBe(false);
    expect(isTextInput({ tagName: "INPUT", type: "checkbox" })).toBe(false);
    expect(isTextInput({ tagName: "BUTTON" })).toBe(false);
    expect(isTextInput({ tagName: "DIV" })).toBe(false);

    // Text inputs should block hotkeys
    expect(isTextInput({ tagName: "INPUT", type: "text" })).toBe(true);
    expect(isTextInput({ tagName: "INPUT", type: "number" })).toBe(true);
    expect(isTextInput({ tagName: "TEXTAREA" })).toBe(true);
    expect(isTextInput({ tagName: "DIV", isContentEditable: true })).toBe(true);

    // Backspace key (borrar <-) detection across platforms
    expect(isBackspaceKey({ key: "Backspace", code: "Backspace" })).toBe(true);
    expect(isBackspaceKey({ keyCode: 8 })).toBe(true);
    expect(isBackspaceKey({ key: "Delete", code: "Delete" })).toBe(true);
    expect(isBackspaceKey({ keyCode: 46 })).toBe(true);
    expect(isBackspaceKey({ key: "Enter" })).toBe(false);

    // Enter / Return detection across platforms
    expect(isReturnKey({ key: "Enter", code: "Enter" })).toBe(true);
    expect(isReturnKey({ key: "Return", code: "Enter" })).toBe(true); // Mac Return
    expect(isReturnKey({ key: "Enter", code: "NumpadEnter" })).toBe(true); // Numpad
    expect(isReturnKey({ keyCode: 13 })).toBe(true); // KeyCode 13
    expect(isReturnKey({ key: "Escape" })).toBe(false);

    // Space detection
    expect(isSpaceKey({ key: " ", code: "Space" })).toBe(true);
    expect(isSpaceKey({ key: "Spacebar" })).toBe(true);
    expect(isSpaceKey({ keyCode: 32 })).toBe(true);
  });
});
