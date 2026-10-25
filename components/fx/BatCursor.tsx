'use client';

import { useEffect, useRef } from 'react';
import { BAT_SVG } from '@/lib/bat';
import { useFinePointer } from '@/lib/useFinePointer';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useFxState } from './FxProvider';

/**
 * Bat cursor (CSS data-URI on body.batcur), a companion bat that follows with
 * lag and flaps, and sonar rings + mini bats on click. Mouse/trackpad only.
 */
export default function BatCursor() {
  const { batOn } = useFxState();
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const pal = useRef<HTMLDivElement>(null);
  const batOnRef = useRef(batOn);

  useEffect(() => {
    batOnRef.current = batOn && fine;
    document.body.classList.toggle('batcur', batOn && fine);
    return () => document.body.classList.remove('batcur');
  }, [batOn, fine]);

  useEffect(() => {
    const el = pal.current;
    if (!fine || reduce || !el) return;

    let mx = -200,
      my = -200,
      bx = -200,
      by = -200,
      seen = false,
      last = performance.now(),
      raf = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX;
      my = e.clientY;
      last = performance.now();
      if (!seen) {
        bx = mx;
        by = my;
        seen = true;
      }
      el.classList.add('on');
    };
    const onLeave = () => el.classList.remove('on');

    const loop = (now: number) => {
      const idle = now - last > 1800;
      const tx = mx - 34,
        ty = my + 24 + (idle ? Math.sin(now / 380) * 6 : 0);
      const dx = tx - bx,
        dy = ty - by;
      bx += dx * 0.09;
      by += dy * 0.09;
      const rot = Math.max(-28, Math.min(28, dx * 0.35));
      el.style.transform = 'translate(' + bx.toFixed(1) + 'px,' + by.toFixed(1) + 'px) rotate(' + rot.toFixed(1) + 'deg)';
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const spawned = new Set<HTMLElement>();
    const timers = new Set<number>();
    const flyBat = (x: number, y: number, i: number) => {
      const b = document.createElement('span');
      b.className = 'minibat';
      b.innerHTML = BAT_SVG;
      document.body.appendChild(b);
      spawned.add(b);
      const ang = -Math.PI / 2 + (i - 1) * 0.9 + (Math.random() - 0.5) * 0.5,
        d = 90 + Math.random() * 70;
      const a = b.animate(
        [
          { transform: 'translate(' + x + 'px,' + y + 'px) scale(.4)', opacity: 1 },
          {
            transform: 'translate(' + (x + Math.cos(ang) * d) + 'px,' + (y + Math.sin(ang) * d) + 'px) scale(1)',
            opacity: 0,
          },
        ],
        { duration: 700 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.3,1)' },
      );
      a.onfinish = () => {
        b.remove();
        spawned.delete(b);
      };
    };
    const onDown = (e: PointerEvent) => {
      if (!batOnRef.current || e.pointerType !== 'mouse' || e.button !== 0) return;
      if ((e.target as Element | null)?.closest?.('input, textarea, #hoops, #shootBtn, dialog, .chip, .flip')) return;
      for (let i = 0; i < 2; i++) {
        const r = document.createElement('span');
        r.className = 'sonar';
        r.style.left = e.clientX + 'px';
        r.style.top = e.clientY + 'px';
        r.style.animationDelay = i * 150 + 'ms';
        document.body.appendChild(r);
        spawned.add(r);
        const t = window.setTimeout(() => {
          r.remove();
          spawned.delete(r);
          timers.delete(t);
        }, 1200);
        timers.add(t);
      }
      for (let i = 0; i < 3; i++) flyBat(e.clientX, e.clientY, i);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      timers.forEach((t) => window.clearTimeout(t));
      spawned.forEach((n) => n.remove());
      el.classList.remove('on');
    };
  }, [fine, reduce]);

  return (
    <div
      className="batpal"
      id="batpal"
      aria-hidden="true"
      ref={pal}
      style={batOn && !reduce ? undefined : { display: 'none' }}
      dangerouslySetInnerHTML={{ __html: BAT_SVG }}
    />
  );
}
