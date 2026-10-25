'use client';

import { useState } from 'react';
import { figure } from '@/content/profile';
import { prefersReducedMotion } from '@/lib/useReducedMotion';

/** Fig. 1 — select a layer: it highlights, the others dim, the caption cross-fades. */
export default function ArchitectureFigure() {
  const [sel, setSel] = useState<number | null>(null);
  const [swap, setSwap] = useState(false);

  const pick = (i: number) => {
    setSel(sel === i ? null : i);
    if (!prefersReducedMotion()) {
      setSwap(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setSwap(false)));
    }
  };

  const node = (i: number) => {
    const n = figure.nodes[i];
    return (
      <button className={n.half ? 'node half' : 'node'} aria-pressed={sel === i} onClick={() => pick(i)}>
        <b>{n.name}</b>
        <span>{n.tech}</span>
      </button>
    );
  };

  const current = sel === null ? null : figure.nodes[sel];

  return (
    <figure className="panel crop fig rv" aria-labelledby="figTitle">
      <div className="fig-head">
        <span className="label" id="figTitle">
          {figure.title}
        </span>
        <span className="label" style={{ color: 'var(--line2)' }}>
          {figure.hint}
        </span>
      </div>
      <div className={sel === null ? 'nodes' : 'nodes has-sel'} role="group" aria-label="Layers of a product">
        {node(0)}
        <div className="wire" aria-hidden="true"></div>
        {node(1)}
        <div className="wire split" aria-hidden="true"></div>
        {node(2)}
        {node(3)}
      </div>
      <figcaption className={swap ? 'figcap swap' : 'figcap'} id="figcap" aria-live="polite">
        <span className="k">{current ? current.name.toUpperCase() : figure.defaultKey}</span>
        {current ? current.cap : figure.defaultCap}
      </figcaption>
    </figure>
  );
}
