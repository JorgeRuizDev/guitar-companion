// Setup global DOM and Web Audio mocks for test environments (bun test & vitest)

import { vi } from "vitest";

class MockStorage {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

class MockAudioParam {
  value: number = 0;
  setValueAtTime = vi.fn().mockReturnThis();
  exponentialRampToValueAtTime = vi.fn().mockReturnThis();
  linearRampToValueAtTime = vi.fn().mockReturnThis();
  cancelScheduledValues = vi.fn().mockReturnThis();
}

class MockAudioNode {
  connect = vi.fn().mockReturnThis();
  disconnect = vi.fn().mockReturnThis();
}

class MockGainNode extends MockAudioNode {
  gain = new MockAudioParam();
}

class MockOscillatorNode extends MockAudioNode {
  frequency = new MockAudioParam();
  type: string = "sine";
  start = vi.fn();
  stop = vi.fn();
}

class MockAudioContext {
  currentTime: number = 0;
  state: string = "suspended";
  destination = new MockAudioNode();

  createGain() {
    return new MockGainNode();
  }

  createOscillator() {
    return new MockOscillatorNode();
  }

  createBuffer() {
    return {};
  }

  createBufferSource() {
    return {
      buffer: null,
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }

  async resume() {
    this.state = "running";
  }

  async suspend() {
    this.state = "suspended";
  }

  async close() {
    this.state = "closed";
  }
}

const mockLocalStorage = new MockStorage();

if (typeof globalThis.window === "undefined") {
  (globalThis as unknown as { window: unknown }).window = globalThis;
}

(globalThis as unknown as { localStorage: MockStorage }).localStorage = mockLocalStorage;
(globalThis as unknown as { window: { localStorage: MockStorage } }).window.localStorage = mockLocalStorage;
(globalThis as unknown as { AudioContext: typeof MockAudioContext }).AudioContext = MockAudioContext;
(globalThis as unknown as { webkitAudioContext: typeof MockAudioContext }).webkitAudioContext = MockAudioContext;
