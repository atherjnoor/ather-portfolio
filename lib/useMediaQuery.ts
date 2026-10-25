import { useSyncExternalStore } from 'react';

/** Reads a media query on the client; `serverValue` during server render and hydration. */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const m = window.matchMedia(query);
      m.addEventListener('change', onChange);
      return () => m.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

const noop = () => () => {};

/** A value that only exists in the browser (feature detection). `serverValue` is used for SSR + hydration. */
export function useClientValue<T extends string | number | boolean | null>(read: () => T, serverValue: T): T {
  return useSyncExternalStore(noop, read, () => serverValue);
}
