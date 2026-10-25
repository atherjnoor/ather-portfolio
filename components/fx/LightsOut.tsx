'use client';

import { useEffect, useRef } from 'react';
import { isTyping, paletteOpen } from '@/lib/bat';
import { useFx, useFxState } from './FxProvider';

/** L toggles flashlight mode (cursor or finger is the light); Esc switches it off. */
export default function LightsOut() {
  const fx = useFx();
  const { lightsOut } = useFxState();
  const ref = useRef<HTMLDivElement>(null);
  const onRef = useRef(lightsOut);

  useEffect(() => {
    onRef.current = lightsOut;
    document.body.classList.toggle('lights-out', lightsOut);
    return () => document.body.classList.remove('lights-out');
  }, [lightsOut]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      el.style.setProperty('--fx', e.clientX + 'px');
      el.style.setProperty('--fy', e.clientY + 'px');
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || paletteOpen() || isTyping()) return;
      if (e.key === 'l' || e.key === 'L') fx.toggleLights();
      else if (e.key === 'Escape' && onRef.current) fx.setLights(false);
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', move, { passive: true });
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', move);
      document.removeEventListener('keydown', onKey);
    };
  }, [fx]);

  return <div className="lights" id="lights" aria-hidden="true" ref={ref} />;
}
