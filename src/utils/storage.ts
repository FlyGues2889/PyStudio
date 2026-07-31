// Safe localStorage wrapper that falls back to in-memory storage if window.localStorage is disabled or undefined (e.g., in sandboxed iframe)

class MemoryStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
}

function getStorage(): Storage {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const testKey = '__pystudio_storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    }
  } catch (e) {
    // Storage restricted or disabled in sandbox/iframe
  }
  return new MemoryStorage();
}

export const safeStorage = getStorage();
