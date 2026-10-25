import { useMediaQuery } from './useMediaQuery';

/** Mouse or trackpad: the only devices that get pointer effects. */
export const FINE_POINTER = '(hover: hover) and (pointer: fine)';

/** Imperative check for event handlers. Only call in the browser. */
export const hasFinePointer = () => window.matchMedia(FINE_POINTER).matches;

/**
 * `serverValue` decides what the static HTML shows before hydration. Use `true`
 * for UI that the original page showed by default (e.g. the Bats button).
 */
export function useFinePointer(serverValue = false): boolean {
  return useMediaQuery(FINE_POINTER, serverValue);
}
