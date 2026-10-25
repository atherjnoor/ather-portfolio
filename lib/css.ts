import type { CSSProperties } from 'react';

/** Inline CSS custom properties, e.g. vars({ '--d': 2 }) for stagger delays. */
export const vars = (o: Record<`--${string}`, string | number>): CSSProperties => {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(o)) out[k] = String(v);
  return out as CSSProperties;
};

/** Status pills for active work get the pulsing "live" dot. */
export const isLive = (status: string) => /in build|in progress/i.test(status);
