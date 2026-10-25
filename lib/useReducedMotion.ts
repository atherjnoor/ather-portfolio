import { useMediaQuery } from './useMediaQuery';

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** Imperative check for event handlers. Only call in the browser. */
export const prefersReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;

export function useReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION);
}
