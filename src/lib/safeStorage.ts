/**
 * localStorage wrapper that degrades safely:
 *  1. localStorage (when available)
 *  2. sessionStorage (private mode often blocks localStorage but allows session)
 *  3. in-memory Map (last resort, persists only for the page lifetime)
 */
type Storage = { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void };

function tryStorage(getter: () => globalThis.Storage): Storage | null {
  try {
    const s = getter();
    const probe = `__probe_${Math.random()}`;
    s.setItem(probe, "1");
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

const memory = new Map<string, string>();
const memoryStorage: Storage = {
  getItem: (k) => (memory.has(k) ? memory.get(k)! : null),
  setItem: (k, v) => void memory.set(k, v),
  removeItem: (k) => void memory.delete(k),
};

let cached: Storage | null = null;

function pick(): Storage {
  if (cached) return cached;
  if (typeof window === "undefined") return memoryStorage;
  cached =
    tryStorage(() => window.localStorage) ??
    tryStorage(() => window.sessionStorage) ??
    memoryStorage;
  return cached;
}

export const safeStorage: Storage = {
  getItem: (k) => {
    try {
      return pick().getItem(k);
    } catch {
      return null;
    }
  },
  setItem: (k, v) => {
    try {
      pick().setItem(k, v);
    } catch {
      // swallow
    }
  },
  removeItem: (k) => {
    try {
      pick().removeItem(k);
    } catch {
      // swallow
    }
  },
};
