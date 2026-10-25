'use client';

import { useEffect, useRef, useState } from 'react';
import { labFilters, labItems, labSection, type LabKind } from '@/content/lab';
import { isLive, vars } from '@/lib/css';
import { prefersReducedMotion } from '@/lib/useReducedMotion';
import { Rich } from '../Rich';
import { SectionHeading, TitleBlock } from '../TitleBlock';

export default function Lab() {
  const [filter, setFilter] = useState<'all' | LabKind>('all');
  const [flashes, setFlashes] = useState(0);
  const list = useRef<HTMLUListElement>(null);

  // Flash the rows that remain after a filter click.
  useEffect(() => {
    if (!flashes || prefersReducedMotion()) return;
    list.current?.querySelectorAll<HTMLElement>('li:not([hidden])').forEach((li) => {
      li.classList.remove('flash');
      void li.offsetWidth;
      li.classList.add('flash');
    });
  }, [flashes]);

  return (
    <section className="sheet" id="lab" data-name="Lab" aria-labelledby="labTitle">
      <TitleBlock cells={labSection.titleblock} />
      <SectionHeading id="labTitle" headline={labSection.headline} />
      <p className="lede">{labSection.lede}</p>

      <div className="filters" role="group" aria-label="Filter lab projects">
        {labFilters.map((b) => (
          <button
            key={b.f}
            aria-pressed={filter === b.f}
            data-f={b.f}
            onClick={() => {
              setFilter(b.f);
              setFlashes((n) => n + 1);
            }}
          >
            {b.label}
          </button>
        ))}
      </div>
      <ul className="lab stg" id="labList" ref={list}>
        {labItems.map((it, i) => (
          <li key={it.name} data-k={it.kind} hidden={!(filter === 'all' || it.kind === filter)} style={vars({ '--d': i })}>
            <h3>{it.name}</h3>
            <p>
              <Rich text={it.text} />
            </p>
            <span className={['status', it.tone, isLive(it.status) && 'live'].filter(Boolean).join(' ')}>
              {it.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
