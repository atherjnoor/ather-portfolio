/* In-memory copy so settings still work for this visit when storage is blocked. */
const memory = new Map<string, string>();
const listeners = new Set<() => void>();

/** localStorage that never throws (private mode, blocked storage, SSR). */
export const store = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key) ?? memory.get(key) ?? null;
    } catch {
      return memory.get(key) ?? null;
    }
  },
  set(key: string, value: string): void {
    memory.set(key, value);
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* storage unavailable: the in-memory copy is enough */
    }
    listeners.forEach((l) => l());
  },
  /** For useSyncExternalStore: notified after every set(). */
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export const KEYS = { bat: 'ajn-bat', hello: 'ajn-hello', best: 'ajn-best' } as const;
