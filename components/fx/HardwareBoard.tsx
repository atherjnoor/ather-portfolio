'use client';

import { useState } from 'react';
import { hardware } from '@/content/interests';

/** CPU / GPU / RAM / SSD chips; selecting one updates the caption. */
export default function HardwareBoard() {
  const [sel, setSel] = useState(() => hardware.chips.findIndex((c) => c.name === hardware.defaultChip));
  const chip = hardware.chips[sel];

  return (
    <article className="panel crop card wide" aria-labelledby="hwTitle">
      <span className="label">{hardware.label}</span>
      <h3 id="hwTitle">{hardware.title}</h3>
      <div className="board" role="group" aria-label={hardware.groupLabel}>
        {hardware.chips.map((c, i) => (
          <button key={c.name} className="chip" type="button" aria-pressed={i === sel} onClick={() => setSel(i)}>
            <b>{c.name}</b>
            <span>{c.sub}</span>
          </button>
        ))}
      </div>
      <p className="hwcap" id="hwcap" aria-live="polite">
        <span className="k">{chip.name}</span>
        {chip.info}
      </p>
    </article>
  );
}
