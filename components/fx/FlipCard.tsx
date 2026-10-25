'use client';

import { useState } from 'react';
import { cooking } from '@/content/interests';
import { Rich } from '../Rich';

/** Cooking card: press to flip between the front and "On the menu". */
export default function FlipCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <article className="panel crop card cook-card" aria-label="Cooking">
      <button
        className="flip"
        id="flip"
        type="button"
        aria-pressed={flipped}
        aria-label={cooking.cardLabel}
        onClick={() => setFlipped(!flipped)}
      >
        <span className="face front">
          <span className="label">{cooking.label}</span>
          <span className="pan" aria-hidden="true">
            <span className="pot"></span>
            <span className="steam" style={{ left: 24 }}></span>
            <span className="steam" style={{ left: 44, animationDelay: '.8s' }}></span>
            <span className="steam" style={{ left: 64, animationDelay: '1.6s' }}></span>
          </span>
          <span className="serif" style={{ fontSize: 32, lineHeight: 1.1, color: 'var(--paper)' }}>
            {cooking.front}
          </span>
          <span className="hint">{cooking.frontHint}</span>
        </span>
        <span className="face back">
          <span className="label">{cooking.backLabel}</span>
          <span className="serif" style={{ fontSize: 30, lineHeight: 1.1, color: 'var(--paper)' }}>
            <Rich text={cooking.dish} />
          </span>
          <span style={{ color: 'var(--muted)', fontSize: 15.5 }}>
            <Rich text={cooking.line} />
          </span>
          <span className="hint">{cooking.backHint}</span>
        </span>
      </button>
    </article>
  );
}
