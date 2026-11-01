/**
 * Typed Local Storage Wrapper
 * Provides safe JSON serialization and in-memory fallback for environments
 * with restricted storage (e.g. private browsing, quotas, SSR).
 */

class MemoryStorage {
  private store: Map<string, string> = new Map();

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

const memoryFallback = new MemoryStorage();

function getStorage(): Storage | MemoryStorage {
  if (typeof window === "undefined") {
    return memoryFallback;
  }

  try {
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return memoryFallback;
  }
}

export const typedStorage = {
  get<T>(key: string, fallback: T): T {
    try {
      const storage = getStorage();
      const raw = storage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      const storage = getStorage();
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn(`Failed to persist key "${key}" to storage`, err);
      return false;
    }
  },

  remove(key: string): boolean {
    try {
      const storage = getStorage();
      storage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};
