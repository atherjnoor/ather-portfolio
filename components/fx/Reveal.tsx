'use client';

import { useEffect } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * Scroll reveals for the page it is rendered in:
 *  - `.rv` panels fade up,
 *  - `.stg` groups stagger their children (each child has a `--d` index),
 *  - `section.sheet` title blocks "draw in" and headings fade up.
 * With reduced motion everything is shown at once (the CSS also forces it).
 */
export default function Reveal() {
  const reduce = useReducedMotion();

  useEffect(() => {
    const panels = Array.from(document.querySelectorAll<HTMLElement>('.rv'));
    const groups = Array.from(document.querySelectorAll<HTMLElement>('.stg, section.sheet'));
    const mark = (el: Element) => el.classList.add(el.matches('section.sheet') ? 'seen' : 'in');

    if (!('IntersectionObserver' in window)) {
      panels.forEach((el) => el.classList.add('in'));
      groups.forEach(mark);
      return;
    }

    const ro = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            ro.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    panels.forEach((el) => ro.observe(el));

    if (reduce) {
      groups.forEach(mark);
      return () => ro.disconnect();
    }
    const so = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            mark(e.target);
            so.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    groups.forEach((el) => so.observe(el));
    return () => {
      ro.disconnect();
      so.disconnect();
    };
  }, [reduce]);

  return null;
}
