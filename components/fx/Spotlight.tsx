'use client';

import { useEffect } from 'react';
import { useFinePointer } from '@/lib/useFinePointer';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * Pointer effects for mouse/trackpad users without reduced motion:
 *  - a soft mint spotlight that follows the cursor inside every `.panel`,
 *  - a gentle ~3° 3D tilt on the project cards and Fig. 1,
 *  - "magnetic" primary/ghost buttons (except the hoops button).
 */
export default function Spotlight() {
  const fine = useFinePointer();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!fine || reduce) return;
    const off: (() => void)[] = [];
    const on = <K extends keyof HTMLElementEventMap>(
      el: HTMLElement,
      type: K,
      fn: (e: HTMLElementEventMap[K]) => void,
    ) => {
      el.addEventListener(type, fn);
      off.push(() => el.removeEventListener(type, fn));
    };

    document.querySelectorAll<HTMLElement>('.panel').forEach((p) => {
      p.classList.add('spot');
      on(p, 'pointermove', (e) => {
        const r = p.getBoundingClientRect();
        p.style.setProperty('--mx', e.clientX - r.left + 'px');
        p.style.setProperty('--my', e.clientY - r.top + 'px');
        p.style.setProperty('--sa', '.075');
      });
      on(p, 'pointerleave', () => p.style.setProperty('--sa', '0'));
      off.push(() => {
        p.classList.remove('spot');
        p.style.removeProperty('--sa');
      });
    });

    document.querySelectorAll<HTMLElement>('.proj, .fig').forEach((c) => {
      c.classList.add('tilt');
      on(c, 'pointermove', (e) => {
        const r = c.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5,
          py = (e.clientY - r.top) / r.height - 0.5;
        c.style.setProperty('--ry', (px * 3).toFixed(2) + 'deg');
        c.style.setProperty('--rx', (-py * 3).toFixed(2) + 'deg');
      });
      on(c, 'pointerleave', () => {
        c.style.setProperty('--rx', '0deg');
        c.style.setProperty('--ry', '0deg');
      });
      off.push(() => c.classList.remove('tilt'));
    });

    document.querySelectorAll<HTMLElement>('.btn:not(#shootBtn)').forEach((b) => {
      on(b, 'pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform =
          'translate(' +
          ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) +
          'px,' +
          ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) +
          'px)';
      });
      on(b, 'pointerleave', () => {
        b.style.transform = '';
      });
      off.push(() => {
        b.style.transform = '';
      });
    });

    return () => off.forEach((f) => f());
  }, [fine, reduce]);

  return null;
}
